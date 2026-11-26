import {
  persistPostToDbOrMemory,
  readWorkflowState,
  writeWorkflowState,
} from '@/lib/data/db-persistence';
import { incrementPostReaction, listStoredPosts } from '@/lib/data/feed-store';
import type { FeedPost, PersonRef } from '@/lib/data/types';
import type { PostKind } from '@hackerland/core';

export interface PersistedReplyRecord {
  id: string;
  authorName: string;
  authorHandle: string;
  body: string;
  timeAgo: string;
  createdAt: string;
}

export interface SocialUserGraphState {
  handle: string;
  followedHandles: string[];
  bookmarkedPostIds: string[];
  likedPostIds: string[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = (searchParams.get('handle') || 'default').trim().toLowerCase();

  const [graphState, repliesDoc, customPostsDoc] = await Promise.all([
    readWorkflowState<Record<string, unknown>>('social_graph', `user:${handle}`),
    readWorkflowState<Record<string, unknown>>('social_graph', 'global:replies'),
    readWorkflowState<Record<string, unknown>>('social_graph', 'global:custom_posts'),
  ]);

  const savedCustomPosts = Array.isArray(customPostsDoc?.posts)
    ? (customPostsDoc.posts as FeedPost[])
    : [];

  return Response.json({
    success: true,
    handle,
    graph: graphState ?? {
      handle,
      followedHandles: ['meera', 'arjun_k', 'kavya_ai'],
      bookmarkedPostIds: [],
      likedPostIds: [],
    },
    repliesByPostId: (repliesDoc?.repliesByPostId as Record<string, PersistedReplyRecord[]>) ?? {},
    posts: savedCustomPosts.length > 0 ? savedCustomPosts : listStoredPosts().slice(0, 25),
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

  if (action === 'publish_post') {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const postBody = typeof body.body === 'string' ? body.body.trim() : '';
    if (!title || !postBody) {
      return Response.json(
        { error: 'validation_error', message: 'Title and update details are required.' },
        { status: 400 },
      );
    }

    const kind =
      body.kind === 'showcase' ||
      body.kind === 'question' ||
      body.kind === 'squad-call' ||
      body.kind === 'update' ||
      body.kind === 'telemetry' ||
      body.kind === 'milestone'
        ? (body.kind as PostKind)
        : ('update' as PostKind);

    const authorHandle =
      typeof body.authorHandle === 'string' && body.authorHandle.trim()
        ? body.authorHandle.trim().toLowerCase()
        : 'rohan_k';
    const authorName =
      typeof body.authorName === 'string' && body.authorName.trim()
        ? body.authorName.trim()
        : 'Rohan Kulkarni';
    const authorHeadline =
      typeof body.authorHeadline === 'string' && body.authorHeadline.trim()
        ? body.authorHeadline.trim()
        : 'Embedded Systems & Robotics Builder';

    const author: PersonRef = {
      handle: authorHandle,
      name: authorName,
      headline: authorHeadline,
      badges: [{ label: 'Active Builder', tone: 'make' }],
    };

    const tags = Array.isArray(body.tags)
      ? body.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : ['build-log'];

    const projectSlug =
      typeof body.projectSlug === 'string' && body.projectSlug.trim()
        ? body.projectSlug.trim()
        : undefined;
    const projectTitle =
      typeof body.projectTitle === 'string' && body.projectTitle.trim()
        ? body.projectTitle.trim()
        : undefined;

    const { postId, storage } = await persistPostToDbOrMemory({
      kind,
      title,
      body: postBody,
      tags,
      author,
      authorId: authorHandle,
      ...(projectSlug && projectTitle
        ? { project: { slug: projectSlug, title: projectTitle } }
        : {}),
    });

    const existingDoc =
      (await readWorkflowState<Record<string, unknown>>('social_graph', 'global:custom_posts')) ??
      {};
    const existingList = Array.isArray(existingDoc.posts)
      ? (existingDoc.posts as FeedPost[])
      : [];
    const createdPost: FeedPost = {
      id: postId,
      kind,
      author,
      ...(projectSlug && projectTitle
        ? { project: { slug: projectSlug, title: projectTitle } }
        : {}),
      title,
      body: postBody,
      tags,
      createdAt: new Date().toISOString(),
      reactions: 1,
      comments: 0,
    };

    await writeWorkflowState(
      'social_graph',
      'global:custom_posts',
      { posts: [createdPost, ...existingList].slice(0, 60) },
      authorHandle,
    );

    return Response.json(
      { success: true, post: createdPost, storage },
      { status: 201 },
    );
  }

  if (action === 'reply') {
    const postId = typeof body.postId === 'string' ? body.postId.trim() : '';
    const replyBody = typeof body.body === 'string' ? body.body.trim() : '';
    const authorName =
      typeof body.authorName === 'string' && body.authorName.trim()
        ? body.authorName.trim()
        : 'Rohan Kulkarni';
    const authorHandle =
      typeof body.authorHandle === 'string' && body.authorHandle.trim()
        ? body.authorHandle.trim().toLowerCase()
        : 'rohan_k';

    if (!postId || !replyBody) {
      return Response.json({ error: 'post_id_and_body_required' }, { status: 400 });
    }

    const doc =
      (await readWorkflowState<Record<string, unknown>>('social_graph', 'global:replies')) ?? {};
    const map = ((doc.repliesByPostId as Record<string, PersistedReplyRecord[]>) ?? {});
    const reply: PersistedReplyRecord = {
      id: `${postId}-reply-${Date.now()}`,
      authorName,
      authorHandle,
      body: replyBody,
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
    };
    const nextMap = {
      ...map,
      [postId]: [...(map[postId] ?? []), reply],
    };
    const storage = await writeWorkflowState(
      'social_graph',
      'global:replies',
      { repliesByPostId: nextMap },
      authorHandle,
    );

    return Response.json({ success: true, reply, storage }, { status: 201 });
  }

  if (
    action === 'sync_graph' ||
    action === 'toggle_follow' ||
    action === 'toggle_bookmark' ||
    action === 'toggle_reaction'
  ) {
    const handle =
      typeof body.handle === 'string' && body.handle.trim()
        ? body.handle.trim().toLowerCase()
        : 'default';

    if (action === 'toggle_reaction' && typeof body.postId === 'string' && body.increment) {
      incrementPostReaction(body.postId);
    }

    const payload: SocialUserGraphState = {
      handle,
      followedHandles: Array.isArray(body.followedHandles)
        ? body.followedHandles.filter((x): x is string => typeof x === 'string')
        : ['meera', 'arjun_k', 'kavya_ai'],
      bookmarkedPostIds: Array.isArray(body.bookmarkedPostIds)
        ? body.bookmarkedPostIds.filter((x): x is string => typeof x === 'string')
        : [],
      likedPostIds: Array.isArray(body.likedPostIds)
        ? body.likedPostIds.filter((x): x is string => typeof x === 'string')
        : [],
    };

    const storage = await writeWorkflowState(
      'social_graph',
      `user:${handle}`,
      payload as unknown as Record<string, unknown>,
      handle,
    );
    return Response.json({ success: true, graph: payload, storage });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
