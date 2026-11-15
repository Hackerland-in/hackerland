import { getAuth, isAuthConfigured } from '@/lib/auth';
import {
  connectDb,
  REPORT_REASONS,
  REPORT_TARGET_TYPES,
  ReportModel,
  type ReportReason,
  type ReportTargetType,
} from '@hackerland/db';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json', message: 'Request body must be valid JSON' }, { status: 400 });
  }

  const rawTargetType = typeof body.targetType === 'string' ? body.targetType.trim() : '';
  if (!(REPORT_TARGET_TYPES as readonly string[]).includes(rawTargetType)) {
    return Response.json(
      {
        error: 'invalid_target_type',
        message: `Target type must be one of: ${REPORT_TARGET_TYPES.join(', ')}`,
      },
      { status: 400 },
    );
  }
  const targetType = rawTargetType as ReportTargetType;

  const targetId = typeof body.targetId === 'string' ? body.targetId.trim() : '';
  if (!targetId) {
    return Response.json(
      { error: 'invalid_target_id', message: 'Target ID is required' },
      { status: 400 },
    );
  }

  const rawReason = typeof body.reason === 'string' ? body.reason.trim() : '';
  if (!(REPORT_REASONS as readonly string[]).includes(rawReason)) {
    return Response.json(
      {
        error: 'invalid_reason',
        message: `Reason must be one of: ${REPORT_REASONS.join(', ')}`,
      },
      { status: 400 },
    );
  }
  const reason = rawReason as ReportReason;

  const details = typeof body.details === 'string' ? body.details.trim().slice(0, 2000) : '';

  // Determine reporter ID
  let reporterId = typeof body.reporterId === 'string' && body.reporterId.trim()
    ? body.reporterId.trim()
    : 'anon_innovator';

  if (isAuthConfigured()) {
    try {
      const auth = getAuth();
      if (auth) {
        const session = await auth.api.getSession({ headers: request.headers });
        if (session?.user?.id) {
          reporterId = session.user.id;
        }
      }
    } catch {
      // Fallback to provided reporterId or anon
    }
  }

  const reportData = {
    reporterId,
    targetType,
    targetId,
    reason,
    details,
    status: 'pending' as const,
    actionTaken: 'none' as const,
  };

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const doc = await ReportModel.create(reportData);
      return Response.json(
        {
          success: true,
          report: {
            id: doc._id.toString(),
            reporterId: doc.reporterId,
            targetType: doc.targetType,
            targetId: doc.targetId,
            reason: doc.reason,
            details: doc.details,
            status: doc.status,
            actionTaken: doc.actionTaken,
            createdAt: doc.createdAt.toISOString(),
            updatedAt: doc.updatedAt.toISOString(),
          },
        },
        { status: 201 },
      );
    } catch (err: unknown) {
      console.warn('MongoDB error creating report, falling back to mock response:', err);
    }
  }

  // Graceful offline fallback
  const mockReport = {
    id: `rep_${Date.now()}`,
    ...reportData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return Response.json({ success: true, report: mockReport }, { status: 201 });
}
