import { getAuth, isAuthConfigured } from '@/lib/auth';
import { ALL_POSTS } from '@/lib/data/fixtures/posts';
import { connectDb, PostModel, isValidObjectId } from '@hackerland/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
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

  const { id } = await params;
  if (!id) {
    return Response.json({ error: 'id_required' }, { status: 400 });
  }

  try {
    await connectDb();

    if (isValidObjectId(id)) {
      const updated = await PostModel.findByIdAndUpdate(
        id,
        { $inc: { 'counts.reactions': 1 } },
        { new: true },
      );

      if (updated) {
        return Response.json({
          success: true,
          reactions: updated.counts?.reactions ?? 1,
        });
      }
    }

    // Check fixtures fallback
    const fixture = ALL_POSTS.find((p) => p.id === id);
    if (fixture) {
      return Response.json({
        success: true,
        reactions: fixture.reactions + 1,
      });
    }

    return Response.json(
      { error: 'post_not_found', message: `Post "${id}" was not found.` },
      { status: 404 },
    );
  } catch (err: unknown) {
    // If database operation fails, check fixtures fallback
    const fixture = ALL_POSTS.find((p) => p.id === id);
    if (fixture) {
      return Response.json({
        success: true,
        reactions: fixture.reactions + 1,
      });
    }

    const message = err instanceof Error ? err.message : 'Database operation failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}
