import type { KanbanTask } from '@hackerland/core';
import {
  getSquadWorkflowState,
  mutateSquadWorkflow,
} from '@/lib/data/community-workflows-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const state = getSquadWorkflowState(slug);
  if (!state) {
    return Response.json({ error: 'squad_not_found' }, { status: 404 });
  }
  return Response.json({ success: true, state });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : '';

  if (action === 'add_task') {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const priority: KanbanTask['priority'] =
      body.priority === 'high' || body.priority === 'low' || body.priority === 'medium'
        ? body.priority
        : 'medium';
    if (!title) {
      return Response.json({ error: 'title_required' }, { status: 400 });
    }
    const state = mutateSquadWorkflow(slug, { type: 'add_task', title, priority });
    if (!state) return Response.json({ error: 'squad_not_found' }, { status: 404 });
    return Response.json({ success: true, state }, { status: 201 });
  }

  if (action === 'cycle_task') {
    const taskId = typeof body.taskId === 'string' ? body.taskId : '';
    const state = mutateSquadWorkflow(slug, { type: 'cycle_task', taskId });
    if (!state) return Response.json({ error: 'squad_not_found' }, { status: 404 });
    return Response.json({ success: true, state });
  }

  if (action === 'submit_proof') {
    const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : '';
    const proofUrl = typeof body.proofUrl === 'string' ? body.proofUrl.trim() : '';
    const summary = typeof body.summary === 'string' ? body.summary : '';
    if (!milestoneId || !proofUrl) {
      return Response.json({ error: 'proof_url_required' }, { status: 400 });
    }
    const state = mutateSquadWorkflow(slug, {
      type: 'submit_proof',
      milestoneId,
      proofUrl,
      summary,
    });
    if (!state) return Response.json({ error: 'squad_not_found' }, { status: 404 });
    return Response.json({ success: true, state });
  }

  if (action === 'release_escrow') {
    const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : '';
    const shareToFeed = Boolean(body.shareToFeed);
    const state = mutateSquadWorkflow(slug, {
      type: 'release_escrow',
      milestoneId,
      shareToFeed,
    });
    if (!state) return Response.json({ error: 'squad_not_found' }, { status: 404 });
    return Response.json({ success: true, state });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
