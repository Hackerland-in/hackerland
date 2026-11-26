import { validateMilestoneSubmission } from '@hackerland/core';
import {
  addSprintCheckin,
  toggleSprintRegistration,
} from '@/lib/data/community-workflows-store';
import {
  hydrateSprintState,
  persistSprintState,
} from '@/lib/data/community-workflows-server';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const sprint = SPRINTS_CATALOG.find((s) => s.slug === slug);
  if (!sprint) {
    return Response.json({ error: 'sprint_not_found' }, { status: 404 });
  }
  const state = await hydrateSprintState(slug);
  return Response.json({ success: true, state });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const sprint = SPRINTS_CATALOG.find((s) => s.slug === slug);
  if (!sprint) {
    return Response.json({ error: 'sprint_not_found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : 'register';

  if (action === 'register' || action === 'toggle_register') {
    const squadName = typeof body.squadName === 'string' ? body.squadName : undefined;
    const state = toggleSprintRegistration(slug, squadName);
    await persistSprintState(slug);
    return Response.json({ success: true, state });
  }

  if (action === 'submit_checkin') {
    const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : '';
    const milestone = sprint.milestones.find((m) => m.id === milestoneId) ?? sprint.milestones[0];
    if (!milestone) {
      return Response.json({ error: 'milestone_not_found' }, { status: 404 });
    }

    const cadUrl = typeof body.cadUrl === 'string' ? body.cadUrl : '';
    const repoUrl = typeof body.repoUrl === 'string' ? body.repoUrl : '';
    const videoUrl = typeof body.videoUrl === 'string' ? body.videoUrl : '';
    const notes = typeof body.notes === 'string' ? body.notes : '';

    const validation = validateMilestoneSubmission(milestone, {
      cadUrl,
      repoUrl,
      videoUrl,
      notes,
    });
    if (!validation.valid) {
      return Response.json(
        { error: 'validation_error', errors: validation.errors },
        { status: 400 },
      );
    }

    const result = addSprintCheckin(slug, {
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      milestoneHour: milestone.hour,
      squadName: typeof body.squadName === 'string' ? body.squadName : undefined,
      cadUrl,
      repoUrl,
      videoUrl,
      notes,
      shareToFeed: Boolean(body.shareToFeed),
    });
    await persistSprintState(slug);

    return Response.json({ success: true, ...result }, { status: 201 });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
