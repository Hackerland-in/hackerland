import {
  connectDb,
  LabWorkspaceModel,
  PostModel,
  WorkflowStateModel,
  type LabWorkspaceKind,
  type WorkflowNamespace,
} from '@hackerland/db';
import type { PostKind } from '@hackerland/core';
import type { FeedPost, PersonRef } from './types';
import { addStoredPost } from './feed-store';

export interface FeedPostInput {
  kind?: PostKind;
  title: string;
  body: string;
  tags?: string[];
  author?: PersonRef;
  project?: { slug: string; title: string };
  authorId?: string;
}

export interface LabWorkspaceDTO {
  workspaceId: string;
  kind: LabWorkspaceKind;
  slugOrRoute: string;
  title: string;
  summary?: string;
  ownerHandle: string;
  ownerName: string;
  tags: string[];
  payload: Record<string, unknown>;
  isPublic: boolean;
  forkOfWorkspaceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveLabWorkspaceInput {
  workspaceId?: string;
  kind: LabWorkspaceKind;
  slugOrRoute: string;
  title: string;
  summary?: string;
  ownerHandle?: string;
  ownerName?: string;
  tags?: string[];
  payload: Record<string, unknown>;
  isPublic?: boolean;
  forkOfWorkspaceId?: string;
}

interface PersistenceFallbackStore {
  workflows: Map<string, { payload: Record<string, unknown>; updatedBy?: string; updatedAt: string }>;
  workspaces: Map<string, LabWorkspaceDTO>;
  mongoBackoffUntil: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __hackerlandDbFallback: PersistenceFallbackStore | undefined;
}

function getFallbackStore(): PersistenceFallbackStore {
  if (!globalThis.__hackerlandDbFallback) {
    globalThis.__hackerlandDbFallback = {
      workflows: new Map(),
      workspaces: new Map(),
      mongoBackoffUntil: 0,
    };
  }
  return globalThis.__hackerlandDbFallback;
}

function wfKey(namespace: WorkflowNamespace, key: string): string {
  return `${namespace}::${key}`;
}

export async function isMongoAvailable(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  const store = getFallbackStore();
  if (Date.now() < store.mongoBackoffUntil) {
    return false;
  }
  try {
    await connectDb();
    return true;
  } catch (err) {
    store.mongoBackoffUntil = Date.now() + 60_000;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[db-persistence] MongoDB unavailable (${msg}); serving from durable fallback.`);
    return false;
  }
}

export async function readWorkflowState<T extends Record<string, unknown>>(
  namespace: WorkflowNamespace,
  key: string,
): Promise<T | null> {
  const composite = wfKey(namespace, key);
  const store = getFallbackStore();

  if (await isMongoAvailable()) {
    try {
      const doc = await WorkflowStateModel.findOne({ namespace, key }).lean();
      if (doc && doc.payload && typeof doc.payload === 'object') {
        const cloned = structuredClone(doc.payload) as T;
        store.workflows.set(composite, {
          payload: cloned,
          updatedBy: doc.updatedBy,
          updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
        });
        return cloned;
      }
    } catch (err) {
      console.warn('[db-persistence] readWorkflowState failed, using fallback:', err);
    }
  }

  const cached = store.workflows.get(composite);
  return cached ? (structuredClone(cached.payload) as T) : null;
}

export async function listWorkflowNamespace<T extends Record<string, unknown>>(
  namespace: WorkflowNamespace,
): Promise<Array<{ key: string; payload: T; updatedAt: string }>> {
  const store = getFallbackStore();

  if (await isMongoAvailable()) {
    try {
      const docs = await WorkflowStateModel.find({ namespace })
        .sort({ updatedAt: -1 })
        .lean();
      const results = docs.map((doc) => {
        const updatedAt = doc.updatedAt
          ? new Date(doc.updatedAt).toISOString()
          : new Date().toISOString();
        const payload = structuredClone((doc.payload ?? {}) as T);
        store.workflows.set(wfKey(namespace, doc.key), {
          payload,
          updatedBy: doc.updatedBy,
          updatedAt,
        });
        return { key: doc.key, payload, updatedAt };
      });
      if (results.length > 0) return results;
    } catch (err) {
      console.warn('[db-persistence] listWorkflowNamespace failed, using fallback:', err);
    }
  }

  const prefix = `${namespace}::`;
  const list: Array<{ key: string; payload: T; updatedAt: string }> = [];
  for (const [k, v] of store.workflows.entries()) {
    if (k.startsWith(prefix)) {
      list.push({
        key: k.slice(prefix.length),
        payload: structuredClone(v.payload) as T,
        updatedAt: v.updatedAt,
      });
    }
  }
  return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function writeWorkflowState<T extends Record<string, unknown>>(
  namespace: WorkflowNamespace,
  key: string,
  payload: T,
  updatedBy?: string,
): Promise<'mongodb' | 'memory'> {
  const store = getFallbackStore();
  const cloned = structuredClone(payload);
  store.workflows.set(wfKey(namespace, key), {
    payload: cloned,
    updatedBy,
    updatedAt: new Date().toISOString(),
  });

  if (await isMongoAvailable()) {
    try {
      await WorkflowStateModel.findOneAndUpdate(
        { namespace, key },
        {
          $set: {
            namespace,
            key,
            payload: cloned,
            ...(updatedBy ? { updatedBy } : {}),
          },
        },
        { upsert: true, new: true },
      ).lean();
      return 'mongodb';
    } catch (err) {
      console.warn('[db-persistence] writeWorkflowState failed, retained in memory:', err);
    }
  }

  return 'memory';
}

export function fireAndForgetWorkflowWrite<T extends Record<string, unknown>>(
  namespace: WorkflowNamespace,
  key: string,
  payload: T,
  updatedBy?: string,
): void {
  const store = getFallbackStore();
  store.workflows.set(wfKey(namespace, key), {
    payload: structuredClone(payload),
    updatedBy,
    updatedAt: new Date().toISOString(),
  });
  void writeWorkflowState(namespace, key, payload, updatedBy);
}

export async function listLabWorkspaces(opts?: {
  kind?: LabWorkspaceKind;
  ownerHandle?: string;
  limit?: number;
}): Promise<{ workspaces: LabWorkspaceDTO[]; storage: 'mongodb' | 'memory' }> {
  const store = getFallbackStore();
  const limit = Math.min(100, Math.max(1, opts?.limit ?? 40));

  if (await isMongoAvailable()) {
    try {
      const filter: Record<string, unknown> = {};
      if (opts?.kind) filter.kind = opts.kind;
      if (opts?.ownerHandle) filter.ownerHandle = opts.ownerHandle.toLowerCase();

      const docs = await LabWorkspaceModel.find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean();

      const workspaces: LabWorkspaceDTO[] = docs.map((d) => {
        const dto: LabWorkspaceDTO = {
          workspaceId: d.workspaceId,
          kind: d.kind,
          slugOrRoute: d.slugOrRoute,
          title: d.title,
          summary: d.summary,
          ownerHandle: d.ownerHandle,
          ownerName: d.ownerName,
          tags: Array.isArray(d.tags) ? d.tags : [],
          payload: structuredClone((d.payload ?? {}) as Record<string, unknown>),
          isPublic: d.isPublic !== false,
          forkOfWorkspaceId: d.forkOfWorkspaceId,
          createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
        };
        store.workspaces.set(dto.workspaceId, dto);
        return dto;
      });
      return { workspaces, storage: 'mongodb' };
    } catch (err) {
      console.warn('[db-persistence] listLabWorkspaces failed, using memory:', err);
    }
  }

  let items = Array.from(store.workspaces.values());
  if (opts?.kind) items = items.filter((w) => w.kind === opts.kind);
  if (opts?.ownerHandle) {
    const target = opts.ownerHandle.toLowerCase();
    items = items.filter((w) => w.ownerHandle === target);
  }
  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return {
    workspaces: items.slice(0, limit).map((w) => structuredClone(w)),
    storage: 'memory',
  };
}

export async function getLabWorkspace(workspaceId: string): Promise<LabWorkspaceDTO | null> {
  const store = getFallbackStore();

  if (await isMongoAvailable()) {
    try {
      const d = await LabWorkspaceModel.findOne({ workspaceId }).lean();
      if (d) {
        const dto: LabWorkspaceDTO = {
          workspaceId: d.workspaceId,
          kind: d.kind,
          slugOrRoute: d.slugOrRoute,
          title: d.title,
          summary: d.summary,
          ownerHandle: d.ownerHandle,
          ownerName: d.ownerName,
          tags: Array.isArray(d.tags) ? d.tags : [],
          payload: structuredClone((d.payload ?? {}) as Record<string, unknown>),
          isPublic: d.isPublic !== false,
          forkOfWorkspaceId: d.forkOfWorkspaceId,
          createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
        };
        store.workspaces.set(dto.workspaceId, dto);
        return dto;
      }
    } catch (err) {
      console.warn('[db-persistence] getLabWorkspace failed, using memory:', err);
    }
  }

  const found = store.workspaces.get(workspaceId);
  return found ? structuredClone(found) : null;
}

export async function saveLabWorkspace(
  input: SaveLabWorkspaceInput,
): Promise<{ workspace: LabWorkspaceDTO; storage: 'mongodb' | 'memory' }> {
  const store = getFallbackStore();
  const now = new Date().toISOString();
  const workspaceId =
    input.workspaceId?.trim() ||
    `${input.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const existing = store.workspaces.get(workspaceId);

  const dto: LabWorkspaceDTO = {
    workspaceId,
    kind: input.kind,
    slugOrRoute: input.slugOrRoute.trim(),
    title: input.title.trim(),
    summary: input.summary?.trim(),
    ownerHandle: (input.ownerHandle?.trim() || 'rohan_k').toLowerCase(),
    ownerName: input.ownerName?.trim() || 'Rohan Kulkarni',
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean),
    payload: structuredClone(input.payload),
    isPublic: input.isPublic !== false,
    forkOfWorkspaceId: input.forkOfWorkspaceId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  store.workspaces.set(workspaceId, dto);

  if (await isMongoAvailable()) {
    try {
      const doc = await LabWorkspaceModel.findOneAndUpdate(
        { workspaceId },
        {
          $set: {
            workspaceId: dto.workspaceId,
            kind: dto.kind,
            slugOrRoute: dto.slugOrRoute,
            title: dto.title,
            summary: dto.summary,
            ownerHandle: dto.ownerHandle,
            ownerName: dto.ownerName,
            tags: dto.tags,
            payload: dto.payload,
            isPublic: dto.isPublic,
            ...(dto.forkOfWorkspaceId ? { forkOfWorkspaceId: dto.forkOfWorkspaceId } : {}),
          },
        },
        { upsert: true, new: true },
      ).lean();

      if (doc) {
        const persisted: LabWorkspaceDTO = {
          ...dto,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : dto.createdAt,
          updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : dto.updatedAt,
        };
        store.workspaces.set(workspaceId, persisted);
        return { workspace: persisted, storage: 'mongodb' };
      }
    } catch (err) {
      console.warn('[db-persistence] saveLabWorkspace failed, retained in memory:', err);
    }
  }

  return { workspace: dto, storage: 'memory' };
}

export async function deleteLabWorkspace(workspaceId: string): Promise<boolean> {
  const store = getFallbackStore();
  let deleted = store.workspaces.delete(workspaceId);

  if (await isMongoAvailable()) {
    try {
      const res = await LabWorkspaceModel.deleteOne({ workspaceId });
      if (res.deletedCount && res.deletedCount > 0) deleted = true;
    } catch (err) {
      console.warn('[db-persistence] deleteLabWorkspace failed:', err);
    }
  }
  return deleted;
}

export async function persistPostToDbOrMemory(
  input: FeedPostInput,
): Promise<{ postId: string; storage: 'mongodb' | 'memory' }> {
  const stored = addStoredPost(input);

  if (await isMongoAvailable()) {
    try {
      const created = await PostModel.create({
        authorId: input.authorId || input.author?.handle || 'rohan_k',
        projectId: input.project?.slug,
        kind: (input.kind ?? 'update') as PostKind,
        title: input.title,
        body: input.body,
        media: [],
        tags: input.tags ?? [],
        counts: { reactions: 1, comments: 0 },
      });
      return { postId: created._id.toString(), storage: 'mongodb' };
    } catch (err) {
      console.warn('[db-persistence] persistPostToDbOrMemory PostModel failed, mirrored in memory:', err);
    }
  }

  return { postId: stored.id, storage: 'memory' };
}
