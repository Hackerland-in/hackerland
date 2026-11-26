'use client';

import { useMemo, useState } from 'react';
import { POST_KIND_LABEL, type PostKind } from '@hackerland/core';
import { Button, EmptyState, FilterChip, cn } from '@hackerland/ui';
import { Sparkles, X } from 'lucide-react';
import type { FeedPost } from '@/lib/data/types';
import { PostCard } from '@/components/domain/post-card';
import { InlinePostComposer } from './inline-post-composer';
import { useSocialCommunity } from './social-context';

export interface SocialFeedStreamProps {
  initialPosts: FeedPost[];
  initialKind?: PostKind;
  initialTag?: string;
  showComposer?: boolean;
}

const STREAM_TABS = [
  { id: 'for-you', label: 'For You' },
  { id: 'following', label: 'Following' },
] as const;

const KIND_FILTERS: { value: PostKind | 'all'; label: string }[] = [
  { value: 'all', label: 'All updates' },
  { value: 'update', label: POST_KIND_LABEL.update },
  { value: 'showcase', label: POST_KIND_LABEL.showcase },
  { value: 'question', label: POST_KIND_LABEL.question },
  { value: 'squad-call', label: POST_KIND_LABEL['squad-call'] },
];

export function SocialFeedStream({
  initialPosts,
  initialKind,
  initialTag,
  showComposer = true,
}: SocialFeedStreamProps) {
  const { isFollowing, bookmarkedPostIds } = useSocialCommunity();
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [streamMode, setStreamMode] = useState<'for-you' | 'following' | 'saved'>('for-you');
  const [kindFilter, setKindFilter] = useState<PostKind | 'all'>(initialKind ?? 'all');
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null);

  const visiblePosts = useMemo(() => {
    return posts.filter((post) => {
      if (streamMode === 'following' && !isFollowing(post.author.handle) && post.author.handle !== 'community-builder') {
        return false;
      }
      if (streamMode === 'saved' && !bookmarkedPostIds.includes(post.id)) {
        return false;
      }
      if (kindFilter !== 'all' && post.kind !== kindFilter) {
        return false;
      }
      if (activeTag && !post.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [posts, streamMode, kindFilter, activeTag, isFollowing, bookmarkedPostIds]);

  return (
    <div className="space-y-4 min-w-0">
      {/* Inline Composer Box */}
      {showComposer && (
        <InlinePostComposer
          onPostPublished={(newPost) => {
            setPosts((prev) => [newPost, ...prev]);
            setKindFilter('all');
            setActiveTag(null);
            setStreamMode('for-you');
          }}
        />
      )}

      {/* Segmented Feed Mode Bar (For You / Following / Saved) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-1 p-2 shadow-xs">
        <div className="flex items-center gap-1">
          {STREAM_TABS.map((tab) => {
            const active = streamMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStreamMode(tab.id)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-body-sm font-display font-semibold transition-all',
                  active
                    ? 'bg-accent text-on-solid shadow-xs'
                    : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                )}
              >
                {tab.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setStreamMode('saved')}
            className={cn(
              'rounded-full px-4 py-1.5 text-body-sm font-display font-semibold transition-all',
              streamMode === 'saved'
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            Saved ({bookmarkedPostIds.length})
          </button>
        </div>

        <span className="px-3 text-[12px] font-medium text-fg-subtle tabular-nums">
          {visiblePosts.length} {visiblePosts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Category Filter Pills + Optional Active Tag Chip */}
      <div className="flex flex-wrap items-center gap-2">
        {KIND_FILTERS.map((item) => (
          <FilterChip
            key={item.value}
            selected={kindFilter === item.value}
            onClick={() => setKindFilter(item.value)}
          >
            {item.label}
          </FilterChip>
        ))}

        {activeTag && (
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-body-sm font-display font-semibold text-accent-fg hover:bg-accent/15 transition-colors"
          >
            <span>#{activeTag}</span>
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <EmptyState
            icon={<Sparkles />}
            title={
              streamMode === 'saved'
                ? 'No saved posts yet'
                : streamMode === 'following'
                ? 'Follow more makers to see updates here'
                : 'No posts match these filters'
            }
            description={
              streamMode === 'saved'
                ? 'Bookmark helpful build logs, circuits, or discussions to keep them handy.'
                : 'Clear filters or switch back to For You to browse all active builds.'
            }
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setStreamMode('for-you');
                  setKindFilter('all');
                  setActiveTag(null);
                }}
              >
                Show all posts
              </Button>
            }
          />
        ) : (
          visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onTagClick={(tag) => setActiveTag((cur) => (cur === tag ? null : tag))}
            />
          ))
        )}
      </div>
    </div>
  );
}
