import type { FeedPost } from './types';
import { ALL_POSTS } from './fixtures/posts';
import { PERSON_MEERA } from './fixtures/people';

declare global {
  // eslint-disable-next-line no-var
  var __hackerlandPostsRegistry: FeedPost[] | undefined;
}

function getPostsRegistry(): FeedPost[] {
  if (!globalThis.__hackerlandPostsRegistry) {
    globalThis.__hackerlandPostsRegistry = [...ALL_POSTS];
  }
  return globalThis.__hackerlandPostsRegistry;
}

export function listStoredPosts(): FeedPost[] {
  return [...getPostsRegistry()];
}

export function addStoredPost(newPost: Partial<FeedPost> & { title: string; body: string }): FeedPost {
  const registry = getPostsRegistry();
  const post: FeedPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: newPost.kind || 'update',
    title: newPost.title,
    body: newPost.body,
    tags: newPost.tags || ['engineering'],
    createdAt: new Date().toISOString(),
    reactions: 1,
    comments: 0,
    author: newPost.author || PERSON_MEERA,
    code: newPost.code,
    project: newPost.project,
    progress: newPost.progress,
  };

  // Prepend to top of feed
  registry.unshift(post);
  return post;
}

export function incrementPostReaction(postId: string): number {
  const registry = getPostsRegistry();
  const match = registry.find((p) => p.id === postId);
  if (match) {
    match.reactions += 1;
    return match.reactions;
  }
  return 1;
}
