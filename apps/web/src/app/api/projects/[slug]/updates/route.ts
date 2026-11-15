import { getAuth, isAuthConfigured } from '@/lib/auth';
import { connectDb, PostModel, ProjectModel } from '@hackerland/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
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

  const { slug } = await params;
  if (!slug) {
    return Response.json({ error: 'slug_required' }, { status: 400 });
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
      { error: 'invalid_title', message: 'Build update title must be at least 4 characters.' },
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
      { error: 'invalid_body', message: 'Build update body must be at least 10 characters.' },
      { status: 400 },
    );
  }

  try {
    await connectDb();

    const project = await ProjectModel.findOne({ slug });
    if (!project) {
      return Response.json(
        { error: 'project_not_found', message: `Project "${slug}" was not found.` },
        { status: 404 },
      );
    }

    const isOwner = project.ownerId === session.user.id;
    const isMember = project.members?.some((m) => m.userId === session.user.id);

    if (!isOwner && !isMember) {
      return Response.json(
        {
          error: 'forbidden',
          message: 'Only squad leads and members can post build updates for this project.',
        },
        { status: 403 },
      );
    }

    const tags: string[] = Array.isArray(body.tags)
      ? body.tags
          .filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
          .map((t: string) => t.trim().toLowerCase())
      : project.tags || [];

    const media: string[] = Array.isArray(body.media)
      ? body.media
          .filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
          .map((m: string) => m.trim())
      : [];

    const post = await PostModel.create({
      authorId: session.user.id,
      projectId: project.id || project._id.toString(),
      kind: 'update',
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
          title: post.title,
          createdAt: post.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database operation failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}
