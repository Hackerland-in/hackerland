import { getAuth, isAuthConfigured } from '@/lib/auth';
import { ALL_OPPORTUNITIES } from '@/lib/data/fixtures/opportunities';
import { connectDb, OpportunityModel, isValidObjectId } from '@hackerland/db';

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

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // Body is optional for claiming
  }

  const note = typeof body?.note === 'string' ? body.note.trim() : undefined;

  try {
    await connectDb();

    let doc = null;
    if (isValidObjectId(id)) {
      doc = await OpportunityModel.findById(id);
    }
    if (!doc) {
      doc = await OpportunityModel.findOne({
        $or: [{ _id: id }, { projectId: id }],
      });
    }

    if (doc) {
      if (doc.status !== 'open') {
        return Response.json(
          { error: 'opportunity_closed', message: 'This opportunity is no longer open for claims.' },
          { status: 400 },
        );
      }

      const alreadyClaimed = doc.claims?.some((c) => c.userId === session.user.id);
      if (alreadyClaimed) {
        return Response.json(
          {
            error: 'already_claimed',
            message: 'You have already submitted a claim/application for this opportunity.',
          },
          { status: 400 },
        );
      }

      doc.claims = doc.claims || [];
      doc.claims.push({
        userId: session.user.id,
        note,
        status: 'pending',
        createdAt: new Date(),
      });
      await doc.save();

      return Response.json({
        success: true,
        message: 'Opportunity claimed successfully.',
      });
    }

    // Fixture fallback
    const fixture = ALL_OPPORTUNITIES.find((o) => o.id === id);
    if (fixture) {
      if (fixture.status !== 'open') {
        return Response.json(
          { error: 'opportunity_closed', message: 'This opportunity is no longer open for claims.' },
          { status: 400 },
        );
      }
      return Response.json({
        success: true,
        message: 'Opportunity claimed successfully.',
      });
    }

    return Response.json(
      { error: 'opportunity_not_found', message: `Opportunity "${id}" was not found.` },
      { status: 404 },
    );
  } catch (err: unknown) {
    // Check fixtures fallback on error
    const fixture = ALL_OPPORTUNITIES.find((o) => o.id === id);
    if (fixture) {
      return Response.json({
        success: true,
        message: 'Opportunity claimed successfully.',
      });
    }

    const message = err instanceof Error ? err.message : 'Database operation failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}
