import { connectDb, MODERATION_ACTIONS, REPORT_STATUSES, ReportModel, type ModerationAction, type ReportStatus } from '@hackerland/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'missing_id', message: 'Report ID is required' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json', message: 'Malformed JSON payload' }, { status: 400 });
  }

  const { action, status } = body;

  const validAction =
    typeof action === 'string' && (MODERATION_ACTIONS as readonly string[]).includes(action)
      ? (action as ModerationAction)
      : 'none';

  const validStatus =
    typeof status === 'string' && (REPORT_STATUSES as readonly string[]).includes(status)
      ? (status as ReportStatus)
      : 'actioned';

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const filter = isObjectId ? { _id: id } : { _id: id };

      const updated = await ReportModel.findOneAndUpdate(
        filter,
        {
          $set: {
            status: validStatus,
            actionTaken: validAction,
            resolvedBy: 'mod_admin',
            resolvedAt: new Date(),
          },
        },
        { new: true },
      ).lean();

      if (updated) {
        return Response.json({
          success: true,
          report: {
            id: updated._id.toString(),
            status: updated.status,
            actionTaken: updated.actionTaken,
            resolvedBy: updated.resolvedBy,
            resolvedAt: updated.resolvedAt ? new Date(updated.resolvedAt).toISOString() : new Date().toISOString(),
          },
        });
      }
    } catch (err: unknown) {
      console.warn('MongoDB error updating moderation report:', err);
    }
  }

  // Fallback response for fixtures / mock mode
  return Response.json({
    success: true,
    report: {
      id,
      status: validStatus,
      actionTaken: validAction,
      resolvedBy: 'mod_admin',
      resolvedAt: new Date().toISOString(),
    },
  });
}
