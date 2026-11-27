import type { KanbanTask } from '@hackerland/core';
import {
  type SquadWorkflowState,
  mutateSquadWorkflow,
  setSquadWorkflowState,
} from '@/lib/data/community-workflows-store';
import {
  hydrateSquadWorkflowState,
  persistSquadWorkflowState,
} from '@/lib/data/community-workflows-server';
import {
  persistPostToDbOrMemory,
  readWorkflowState,
  writeWorkflowState,
} from '@/lib/data/db-persistence';
import { buildFallbackSquadRoom, getProject } from '@/lib/data/queries';

async function resolveOrInitFallbackSquadState(slug: string): Promise<{
  state: SquadWorkflowState;
  projectTitle: string;
}> {
  const stored = await readWorkflowState<Record<string, unknown>>('squad', slug);
  const project = await getProject(slug);
  const fallbackRoom = buildFallbackSquadRoom(slug, project);

  if (stored && Array.isArray(stored.milestones) && Array.isArray(stored.tasks)) {
    const hydrated = stored as unknown as SquadWorkflowState;
    setSquadWorkflowState(slug, hydrated);
    return { state: hydrated, projectTitle: fallbackRoom.projectTitle };
  }

  const initialState: SquadWorkflowState = {
    milestones: fallbackRoom.milestones,
    tasks: fallbackRoom.tasks,
  };
  setSquadWorkflowState(slug, initialState);
  await writeWorkflowState('squad', slug, initialState as unknown as Record<string, unknown>);
  return { state: initialState, projectTitle: fallbackRoom.projectTitle };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const state = await hydrateSquadWorkflowState(slug);
  if (state) {
    return Response.json({ success: true, state });
  }
  const fallback = await resolveOrInitFallbackSquadState(slug);
  return Response.json({ success: true, state: fallback.state });
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
      body.priority === 'high' || body.priority === 'low' || body.priority === 'medium' || body.priority === 'critical'
        ? body.priority
        : 'medium';
    if (!title) {
      return Response.json({ error: 'title_required' }, { status: 400 });
    }
    const seeded = mutateSquadWorkflow(slug, { type: 'add_task', title, priority });
    if (seeded) {
      await persistSquadWorkflowState(slug);
      return Response.json({ success: true, state: seeded }, { status: 201 });
    }

    const { state } = await resolveOrInitFallbackSquadState(slug);
    const nextState: SquadWorkflowState = {
      ...state,
      tasks: [
        {
          id: `task_${Date.now()}`,
          title,
          status: 'todo',
          priority,
          tags: ['Squad'],
        },
        ...state.tasks,
      ],
    };
    setSquadWorkflowState(slug, nextState);
    await writeWorkflowState('squad', slug, nextState as unknown as Record<string, unknown>);
    return Response.json({ success: true, state: nextState }, { status: 201 });
  }

  if (action === 'cycle_task') {
    const taskId = typeof body.taskId === 'string' ? body.taskId : '';
    const seeded = mutateSquadWorkflow(slug, { type: 'cycle_task', taskId });
    if (seeded) {
      await persistSquadWorkflowState(slug);
      return Response.json({ success: true, state: seeded });
    }

    const { state } = await resolveOrInitFallbackSquadState(slug);
    const nextMap: Record<KanbanTask['status'], KanbanTask['status']> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'done',
      done: 'todo',
    };
    const nextState: SquadWorkflowState = {
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: nextMap[t.status] } : t,
      ),
    };
    setSquadWorkflowState(slug, nextState);
    await writeWorkflowState('squad', slug, nextState as unknown as Record<string, unknown>);
    return Response.json({ success: true, state: nextState });
  }

  if (action === 'submit_proof') {
    const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : '';
    const proofUrl = typeof body.proofUrl === 'string' ? body.proofUrl.trim() : '';
    const summary = typeof body.summary === 'string' ? body.summary : '';
    const submittedBy = typeof body.submittedBy === 'string' ? body.submittedBy : undefined;
    if (!milestoneId || !proofUrl) {
      return Response.json({ error: 'proof_url_required' }, { status: 400 });
    }
    const seeded = mutateSquadWorkflow(slug, {
      type: 'submit_proof',
      milestoneId,
      proofUrl,
      summary,
      submittedBy,
    });
    if (seeded) {
      await persistSquadWorkflowState(slug);
      return Response.json({ success: true, state: seeded });
    }

    const { state } = await resolveOrInitFallbackSquadState(slug);
    const nextState: SquadWorkflowState = {
      ...state,
      milestones: state.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: 'in_review',
              submittedProof: {
                proofUrl,
                summary: summary.trim() || 'Proof of work submitted for peer review.',
                submittedAt: new Date().toISOString().split('T')[0] ?? '',
                submittedBy: submittedBy?.trim() || 'rohan_k',
              },
            }
          : m,
      ),
    };
    setSquadWorkflowState(slug, nextState);
    await writeWorkflowState('squad', slug, nextState as unknown as Record<string, unknown>);
    return Response.json({ success: true, state: nextState });
  }

  if (action === 'release_escrow') {
    const milestoneId = typeof body.milestoneId === 'string' ? body.milestoneId : '';
    const shareToFeed = Boolean(body.shareToFeed);
    const seeded = mutateSquadWorkflow(slug, {
      type: 'release_escrow',
      milestoneId,
      shareToFeed,
    });
    if (seeded) {
      await persistSquadWorkflowState(slug);
      return Response.json({ success: true, state: seeded });
    }

    const { state, projectTitle } = await resolveOrInitFallbackSquadState(slug);
    const target = state.milestones.find((m) => m.id === milestoneId);
    const nextState: SquadWorkflowState = {
      ...state,
      milestones: state.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: 'released' } : m,
      ),
    };
    setSquadWorkflowState(slug, nextState);
    await writeWorkflowState('squad', slug, nextState as unknown as Record<string, unknown>);

    if (shareToFeed && target) {
      await persistPostToDbOrMemory({
        kind: 'showcase',
        title: `Milestone Released: ${target.title}`,
        body: `${projectTitle} unlocked ₹${target.escrowAmountInr.toLocaleString('en-IN')} escrow upon verified deliverable completion.`,
        tags: ['milestone', 'escrow-verified'],
        project: { slug, title: projectTitle },
      });
    }
    return Response.json({ success: true, state: nextState });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
