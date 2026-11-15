import { listReports } from '@/lib/data/queries';
import {
  REPORT_REASONS,
  REPORT_STATUSES,
  REPORT_TARGET_TYPES,
  type ReportReason,
  type ReportStatus,
  type ReportTargetType,
} from '@hackerland/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawStatus = searchParams.get('status');
  const status =
    rawStatus && (REPORT_STATUSES as readonly string[]).includes(rawStatus)
      ? (rawStatus as ReportStatus)
      : undefined;

  const rawTargetType = searchParams.get('targetType');
  const targetType =
    rawTargetType && (REPORT_TARGET_TYPES as readonly string[]).includes(rawTargetType)
      ? (rawTargetType as ReportTargetType)
      : undefined;

  const rawReason = searchParams.get('reason');
  const reason =
    rawReason && (REPORT_REASONS as readonly string[]).includes(rawReason)
      ? (rawReason as ReportReason)
      : undefined;

  const limitParam = parseInt(searchParams.get('limit') || '50', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

  const offsetParam = parseInt(searchParams.get('offset') || '0', 10);
  const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

  try {
    const allReports = await listReports({ status, targetType, reason });
    const paginated = allReports.slice(offset, offset + limit);

    return Response.json({
      success: true,
      total: allReports.length,
      reports: paginated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query moderation reports';
    return Response.json({ error: 'server_error', message }, { status: 500 });
  }
}
