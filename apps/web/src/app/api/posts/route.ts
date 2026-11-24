import { getAuth, isAuthConfigured } from '@/lib/auth';
import { listStoredPosts, addStoredPost } from '@/lib/data/feed-store';
import { POST_KINDS, type PostKind } from '@hackerland/core';
import { connectDb, PostModel } from '@hackerland/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawKind = searchParams.get('kind');
  const kind =
    rawKind && (POST_KINDS as readonly string[]).includes(rawKind)
      ? (rawKind as PostKind)
      : undefined;

  const limitParam = parseInt(searchParams.get('limit') || '20', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 20;

  const offsetParam = parseInt(searchParams.get('offset') || '0', 10);
  const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = kind ? { kind } : {};
      const posts = await PostModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      return Response.json({ success: true, posts });
    } catch (err: unknown) {
      console.warn('MongoDB query failed for GET /api/posts, falling back to fixtures:', err);
    }
  }

  // Graceful fallback to stored posts & fixtures
  let posts = listStoredPosts();
  if (kind) {
    posts = posts.filter((p) => p.kind === kind);
  }
  posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const paginated = posts.slice(offset, offset + limit);

  return Response.json({ success: true, posts: paginated });
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }

  const auth = getAuth();
  if (!auth) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title.length < 4) {
    return Response.json(
      { error: 'invalid_title', message: 'Post title must be at least 4 characters.' },
      { status: 400 },
    );
  }

  const content =
    typeof body.body === 'string'
      ? body.body.trim()
      : typeof body.content === 'string'
        ? body.content.trim()
        : '';

  if (content.length < 10) {
    return Response.json(
      { error: 'invalid_body', message: 'Post body must be at least 10 characters.' },
      { status: 400 },
    );
  }

  const rawKind = typeof body.kind === 'string' ? body.kind.trim() : 'update';
  const kind: PostKind = (POST_KINDS as readonly string[]).includes(rawKind)
    ? (rawKind as PostKind)
    : 'update';

  const projectId =
    typeof body.projectId === 'string' && body.projectId.trim()
      ? body.projectId.trim()
      : undefined;

  const tags: string[] = Array.isArray(body.tags)
    ? body.tags
        .filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t: string) => t.trim().toLowerCase())
    : [];

  const media: string[] = Array.isArray(body.media)
    ? body.media
        .filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
        .map((m: string) => m.trim())
    : [];

  try {
    await connectDb();

    const post = await PostModel.create({
      authorId: session.user.id,
      projectId,
      kind,
      title,
      body: content,
      tags,
      media,
      counts: { reactions: 0, comments: 0 },
    });

    return Response.json(
      {
        success: true,
        post: {
          id: post._id.toString(),
          authorId: post.authorId,
          projectId: post.projectId,
          kind: post.kind,
          title: post.title,
          body: post.body,
          tags: post.tags,
          media: post.media,
          counts: post.counts,
          createdAt: post.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.warn('MongoDB post creation failed, using in-memory feed store:', err);
    const storedPost = addStoredPost({
      kind,
      title,
      body: content,
      tags,
    });
    return Response.json(
      {
        success: true,
        post: storedPost,
        notice: 'Saved to active feed ledger.',
      },
      { status: 201 },
    );
  }
}
