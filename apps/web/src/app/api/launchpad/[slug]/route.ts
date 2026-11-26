import {
  addLaunchpadComment,
  getLaunchpadState,
  pledgeLaunchpadTier,
  voteLaunchpadMilestone,
} from '@/lib/data/community-workflows-store';
import {
  hydrateLaunchpadState,
  persistLaunchpadState,
} from '@/lib/data/community-workflows-server';
import { getCampaignBySlug } from '@/lib/data/launchpad-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const state = (await hydrateLaunchpadState(slug)) ?? getLaunchpadState(slug);
  if (!state) {
    return Response.json({ error: 'campaign_not_found' }, { status: 404 });
  }
  return Response.json({ success: true, state });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);
  if (!campaign) {
    return Response.json({ error: 'campaign_not_found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : '';

  if (action === 'pledge') {
    const tierId = typeof body.tierId === 'string' ? body.tierId : '';
    const tier = campaign.backerTiers.find((t) => t.id === tierId);
    if (!tier) {
      return Response.json({ error: 'tier_not_found' }, { status: 404 });
    }
    const state = pledgeLaunchpadTier(slug, tier.id, tier.amountInr);
    await persistLaunchpadState(slug);
    return Response.json({ success: true, state, tier }, { status: 201 });
  }

  if (action === 'vote') {
    const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : '';
    const approve = body.approve !== false;
    const state = voteLaunchpadMilestone(slug, milestoneId, approve);
    await persistLaunchpadState(slug);
    return Response.json({ success: true, state });
  }

  if (action === 'comment') {
    const commentBody = typeof body.body === 'string' ? body.body.trim() : '';
    const authorName =
      typeof body.authorName === 'string' && body.authorName.trim()
        ? body.authorName.trim()
        : 'Rohan Kulkarni';
    if (commentBody.length < 3) {
      return Response.json({ error: 'comment_too_short' }, { status: 400 });
    }
    const state = addLaunchpadComment(slug, authorName, commentBody);
    await persistLaunchpadState(slug);
    return Response.json({ success: true, state }, { status: 201 });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
