import {
  createReverseRfc,
  listReverseRfcs,
  replyToReverseRfc,
  voteReverseRfc,
} from '@/lib/data/community-workflows-store';
import {
  hydrateReverseRfcs,
  persistReverseRfcs,
} from '@/lib/data/community-workflows-server';

export async function GET() {
  const rfcs = await hydrateReverseRfcs();
  return Response.json({ success: true, rfcs });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : 'create';

  if (action === 'upvote') {
    const id = typeof body.id === 'string' ? body.id : '';
    const delta = body.delta === -1 ? -1 : 1;
    const updated = voteReverseRfc(id, delta);
    if (!updated) {
      return Response.json({ error: 'rfc_not_found' }, { status: 404 });
    }
    await persistReverseRfcs();
    return Response.json({ success: true, rfc: updated, rfcs: listReverseRfcs() });
  }

  if (action === 'reply') {
    const id = typeof body.id === 'string' ? body.id : '';
    const replyBody = typeof body.body === 'string' ? body.body.trim() : '';
    const authorName =
      typeof body.authorName === 'string' && body.authorName.trim()
        ? body.authorName.trim()
        : 'Rohan Kulkarni';
    if (replyBody.length < 3) {
      return Response.json({ error: 'reply_too_short' }, { status: 400 });
    }
    const updated = replyToReverseRfc(id, authorName, replyBody);
    if (!updated) {
      return Response.json({ error: 'rfc_not_found' }, { status: 404 });
    }
    await persistReverseRfcs();
    return Response.json({ success: true, rfc: updated, rfcs: listReverseRfcs() });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const domain = typeof body.domain === 'string' ? body.domain.trim() : 'Clean Water';
  const sponsor = typeof body.sponsor === 'string' ? body.sponsor.trim() : 'IndiMaker Partner';
  const bountyAmount = Number(body.bountyAmount) || 25000;
  const urgency =
    body.urgency === 'critical' || body.urgency === 'high' || body.urgency === 'medium'
      ? body.urgency
      : 'medium';
  const shareToFeed = Boolean(body.shareToFeed);

  if (title.length < 4 || description.length < 10) {
    return Response.json(
      { error: 'validation_error', message: 'Title and technical requirements are required.' },
      { status: 400 },
    );
  }

  const rfc = createReverseRfc({
    title,
    domain,
    sponsor,
    bountyAmount,
    description,
    urgency,
    shareToFeed,
  });
  await persistReverseRfcs();

  return Response.json({ success: true, rfc, rfcs: listReverseRfcs() }, { status: 201 });
}
