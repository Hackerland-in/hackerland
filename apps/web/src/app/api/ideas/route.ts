import {
  listWorkflowNamespace,
  persistPostToDbOrMemory,
  writeWorkflowState,
} from '@/lib/data/db-persistence';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get('scope') || 'all';

  const [ideas, problemClaims, ipDisclosures] = await Promise.all([
    scope === 'all' || scope === 'ideas'
      ? listWorkflowNamespace<Record<string, unknown>>('idea')
      : Promise.resolve([]),
    scope === 'all' || scope === 'problems'
      ? listWorkflowNamespace<Record<string, unknown>>('problem_claim')
      : Promise.resolve([]),
    scope === 'all' || scope === 'ip'
      ? listWorkflowNamespace<Record<string, unknown>>('ip_disclosure')
      : Promise.resolve([]),
  ]);

  return Response.json({
    success: true,
    ideas: ideas.map((i) => i.payload),
    problemClaims: problemClaims.map((p) => p.payload),
    ipDisclosures: ipDisclosures.map((d) => d.payload),
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : '';

  if (action === 'save_idea' || action === 'cheer_idea') {
    const idea =
      body.idea && typeof body.idea === 'object'
        ? (body.idea as Record<string, unknown>)
        : null;
    const ideaId =
      (idea && typeof idea.id === 'string' ? idea.id : '') ||
      (typeof body.id === 'string' ? body.id : '');
    if (!ideaId) {
      return Response.json({ error: 'idea_id_required' }, { status: 400 });
    }
    const payload = idea ?? { id: ideaId, cheeredAt: new Date().toISOString(), cheersCount: body.cheersCount };
    const storage = await writeWorkflowState('idea', ideaId, payload);

    if (body.publishToFeed === true && idea && typeof idea.title === 'string') {
      await persistPostToDbOrMemory({
        kind: 'update',
        title: `New IdeaLab Spark: ${String(idea.title)}`,
        body: String(idea.summary || idea.problemStatement || 'Shared from IdeaLab Workbench.'),
        tags: ['idealab', 'early-spark'],
        author: {
          handle: String(idea.creatorHandle || 'rohan_k'),
          name: String(idea.creatorName || 'Rohan Kulkarni'),
          headline: 'Hardware & Embedded Builder',
          badges: [{ label: 'IdeaLab', tone: 'research' }],
        },
      });
    }

    return Response.json({ success: true, idea: payload, storage }, { status: 201 });
  }

  if (action === 'claim_problem') {
    const problemId = typeof body.problemId === 'string' ? body.problemId.trim() : '';
    const problemSlug = typeof body.problemSlug === 'string' ? body.problemSlug.trim() : '';
    const problemTitle = typeof body.problemTitle === 'string' ? body.problemTitle.trim() : '';
    const claimantHandle =
      typeof body.claimantHandle === 'string' && body.claimantHandle.trim()
        ? body.claimantHandle.trim().toLowerCase()
        : 'rohan_k';
    const claimantName =
      typeof body.claimantName === 'string' && body.claimantName.trim()
        ? body.claimantName.trim()
        : 'Rohan Kulkarni';

    if (!problemId) {
      return Response.json({ error: 'problem_id_required' }, { status: 400 });
    }

    const record = {
      id: `${problemId}:${claimantHandle}`,
      problemId,
      problemSlug,
      problemTitle,
      claimantHandle,
      claimantName,
      claimedAt: new Date().toISOString(),
    };
    const storage = await writeWorkflowState('problem_claim', record.id, record, claimantHandle);

    return Response.json({ success: true, claim: record, storage }, { status: 201 });
  }

  if (action === 'publish_ip_disclosure') {
    const publication =
      body.publication && typeof body.publication === 'object'
        ? (body.publication as Record<string, unknown>)
        : null;
    if (!publication || typeof publication.id !== 'string' || !publication.id) {
      return Response.json({ error: 'publication_required' }, { status: 400 });
    }
    const storage = await writeWorkflowState('ip_disclosure', publication.id, publication);
    return Response.json({ success: true, publication, storage }, { status: 201 });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
