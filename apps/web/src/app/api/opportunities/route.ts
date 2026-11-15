import { getAuth, isAuthConfigured } from '@/lib/auth';
import { ALL_OPPORTUNITIES } from '@/lib/data/fixtures/opportunities';
import {
  OPPORTUNITY_KINDS,
  opportunitySchema,
  TRACKS,
  type OpportunityKind,
  type Track,
} from '@hackerland/core';
import { connectDb, OpportunityModel } from '@hackerland/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawKind = searchParams.get('kind');
  const kind =
    rawKind && (OPPORTUNITY_KINDS as readonly string[]).includes(rawKind)
      ? (rawKind as OpportunityKind)
      : undefined;

  const rawTrack = searchParams.get('track');
  const track =
    rawTrack && (TRACKS as readonly string[]).includes(rawTrack)
      ? (rawTrack as Track)
      : undefined;

  const limitParam = parseInt(searchParams.get('limit') || '20', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 20;

  const offsetParam = parseInt(searchParams.get('offset') || '0', 10);
  const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter: Record<string, unknown> = {};
      if (kind) filter.kind = kind;
      if (track) filter.tracks = track;

      const docs = await OpportunityModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      return Response.json({ success: true, opportunities: docs });
    } catch (err: unknown) {
      console.warn('MongoDB query failed for GET /api/opportunities, falling back to fixtures:', err);
    }
  }

  // Graceful fallback to fixtures
  let opps = [...ALL_OPPORTUNITIES];
  if (kind) {
    opps = opps.filter((o) => o.kind === kind);
  }
  if (track) {
    opps = opps.filter((o) => o.tracks.includes(track));
  }
  const paginated = opps.slice(offset, offset + limit);

  return Response.json({ success: true, opportunities: paginated });
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

  const parseResult = opportunitySchema.safeParse({
    ...body,
    status: typeof body.status === 'string' ? body.status : 'open',
  });

  if (!parseResult.success) {
    return Response.json(
      {
        error: 'validation_error',
        message: 'Invalid opportunity payload.',
        details: parseResult.error.format(),
      },
      { status: 400 },
    );
  }

  const data = parseResult.data;

  try {
    await connectDb();

    const opportunity = await OpportunityModel.create({
      kind: data.kind,
      title: data.title,
      summary: data.summary,
      sponsor: data.sponsor,
      reward: data.reward,
      tracks: data.tracks,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      status: data.status,
      projectId: typeof body.projectId === 'string' ? body.projectId : undefined,
      externalUrl: data.externalUrl,
      createdBy: session.user.id,
      claims: [],
    });

    return Response.json(
      {
        success: true,
        opportunity: {
          id: opportunity._id.toString(),
          kind: opportunity.kind,
          title: opportunity.title,
          summary: opportunity.summary,
          sponsor: opportunity.sponsor,
          reward: opportunity.reward,
          tracks: opportunity.tracks,
          deadline: opportunity.deadline,
          status: opportunity.status,
          projectId: opportunity.projectId,
          createdBy: opportunity.createdBy,
          createdAt: opportunity.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database operation failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}
