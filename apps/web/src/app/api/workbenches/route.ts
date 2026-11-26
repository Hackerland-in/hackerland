import type { LabWorkspaceKind } from '@hackerland/db';
import { LAB_WORKSPACE_KINDS } from '@hackerland/db';
import {
  deleteLabWorkspace,
  getLabWorkspace,
  listLabWorkspaces,
  persistPostToDbOrMemory,
  saveLabWorkspace,
} from '@/lib/data/db-persistence';

function isValidKind(kind: string): kind is LabWorkspaceKind {
  return (LAB_WORKSPACE_KINDS as readonly string[]).includes(kind);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId')?.trim();

  if (workspaceId) {
    const workspace = await getLabWorkspace(workspaceId);
    if (!workspace) {
      return Response.json({ error: 'workspace_not_found' }, { status: 404 });
    }
    return Response.json({ success: true, workspace });
  }

  const kindParam = searchParams.get('kind')?.trim();
  const kind = kindParam && isValidKind(kindParam) ? kindParam : undefined;
  const ownerHandle = searchParams.get('ownerHandle')?.trim() || undefined;
  const limit = Number(searchParams.get('limit')) || 40;

  const result = await listLabWorkspaces({ kind, ownerHandle, limit });
  return Response.json({
    success: true,
    workspaces: result.workspaces,
    storage: result.storage,
  });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const rawKind = typeof body.kind === 'string' ? body.kind.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const slugOrRoute =
    typeof body.slugOrRoute === 'string' && body.slugOrRoute.trim()
      ? body.slugOrRoute.trim()
      : `/manufacturing/${rawKind || 'pcb'}`;

  if (!isValidKind(rawKind) || !title) {
    return Response.json(
      {
        error: 'validation_error',
        message: 'Valid workspace kind and design title are required.',
      },
      { status: 400 },
    );
  }

  const payload =
    body.payload && typeof body.payload === 'object'
      ? (body.payload as Record<string, unknown>)
      : {};

  const ownerHandle =
    typeof body.ownerHandle === 'string' && body.ownerHandle.trim()
      ? body.ownerHandle.trim().toLowerCase()
      : 'rohan_k';
  const ownerName =
    typeof body.ownerName === 'string' && body.ownerName.trim()
      ? body.ownerName.trim()
      : 'Rohan Kulkarni';
  const summary = typeof body.summary === 'string' ? body.summary.trim() : undefined;
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string')
    : [rawKind, 'workbench'];

  const { workspace, storage } = await saveLabWorkspace({
    workspaceId: typeof body.workspaceId === 'string' ? body.workspaceId : undefined,
    kind: rawKind,
    slugOrRoute,
    title,
    summary,
    ownerHandle,
    ownerName,
    tags,
    payload,
    isPublic: body.isPublic !== false,
    forkOfWorkspaceId:
      typeof body.forkOfWorkspaceId === 'string' ? body.forkOfWorkspaceId : undefined,
  });

  let sharedPostId: string | undefined;
  if (body.publishToFeed === true) {
    const shareRes = await persistPostToDbOrMemory({
      kind: 'showcase',
      title: `${title} (${rawKind.toUpperCase()} Snapshot)`,
      body:
        summary ||
        `Saved an updated ${rawKind.replace(/_/g, ' ')} snapshot in ${slugOrRoute} (${tags.slice(0, 3).join(', ')}).`,
      tags: Array.from(new Set(['hardware-lab', rawKind, ...tags])).slice(0, 5),
      author: {
        handle: ownerHandle,
        name: ownerName,
        headline: 'Hardware & Embedded Builder',
        badges: [{ label: 'Lab Snapshot', tone: 'make' }],
      },
      authorId: ownerHandle,
    });
    sharedPostId = shareRes.postId;
  }

  return Response.json(
    {
      success: true,
      workspace,
      storage,
      ...(sharedPostId ? { sharedPostId } : {}),
    },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get('workspaceId')?.trim();
  if (!workspaceId) {
    return Response.json({ error: 'workspace_id_required' }, { status: 400 });
  }
  const deleted = await deleteLabWorkspace(workspaceId);
  return Response.json({ success: true, deleted });
}
