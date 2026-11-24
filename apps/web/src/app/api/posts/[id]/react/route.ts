import { getAuth, isAuthConfigured } from '@/lib/auth';
import { incrementPostReaction } from '@/lib/data/feed-store';
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

    const newCount = incrementPostReaction(id);
    return Response.json({
      success: true,
      reactions: newCount,
    });
  } catch {
    const newCount = incrementPostReaction(id);
    return Response.json({
      success: true,
      reactions: newCount,
    });
  }
}
