'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SocialCommunityContextValue {
  followingHandles: string[];
  bookmarkedPostIds: string[];
  repostedPostIds: string[];
  isFollowing: (handle: string) => boolean;
  toggleFollow: (handle: string) => void;
  isBookmarked: (postId: string) => boolean;
  toggleBookmark: (postId: string) => void;
  isReposted: (postId: string) => boolean;
  toggleRepost: (postId: string) => void;
}

const DEFAULT_FOLLOWING = ['meera-iyer', 'zoya-khan'];

const SocialCommunityContext = createContext<SocialCommunityContextValue | null>(null);

export function SocialCommunityProvider({ children }: { children: ReactNode }) {
  const [followingHandles, setFollowingHandles] = useState<string[]>(DEFAULT_FOLLOWING);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([]);
  const [repostedPostIds, setRepostedPostIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedFollows = localStorage.getItem('hackerland_following_handles');
      if (savedFollows) {
        const parsed = JSON.parse(savedFollows);
        if (Array.isArray(parsed)) setFollowingHandles(parsed);
      }
      const savedBookmarks = localStorage.getItem('hackerland_bookmarked_posts');
      if (savedBookmarks) {
        const parsed = JSON.parse(savedBookmarks);
        if (Array.isArray(parsed)) setBookmarkedPostIds(parsed);
      }
      const savedReposts = localStorage.getItem('hackerland_reposted_posts');
      if (savedReposts) {
        const parsed = JSON.parse(savedReposts);
        if (Array.isArray(parsed)) setRepostedPostIds(parsed);
      }
    } catch {
      // Ignore storage errors in sandboxed contexts
    }
  }, []);

  const toggleFollow = (handle: string) => {
    setFollowingHandles((prev) => {
      const next = prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle];
      try {
        localStorage.setItem('hackerland_following_handles', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleBookmark = (postId: string) => {
    setBookmarkedPostIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      try {
        localStorage.setItem('hackerland_bookmarked_posts', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleRepost = (postId: string) => {
    setRepostedPostIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      try {
        localStorage.setItem('hackerland_reposted_posts', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <SocialCommunityContext.Provider
      value={{
        followingHandles,
        bookmarkedPostIds,
        repostedPostIds,
        isFollowing: (handle) => followingHandles.includes(handle),
        toggleFollow,
        isBookmarked: (postId) => bookmarkedPostIds.includes(postId),
        toggleBookmark,
        isReposted: (postId) => repostedPostIds.includes(postId),
        toggleRepost,
      }}
    >
      {children}
    </SocialCommunityContext.Provider>
  );
}

/**
 * Returns shared social state if inside SocialCommunityProvider, or safe standalone fallback state.
 */
export function useSocialCommunity(): SocialCommunityContextValue {
  const ctx = useContext(SocialCommunityContext);
  const [localFollowing, setLocalFollowing] = useState<string[]>(DEFAULT_FOLLOWING);
  const [localBookmarks, setLocalBookmarks] = useState<string[]>([]);
  const [localReposts, setLocalReposts] = useState<string[]>([]);

  if (ctx) return ctx;

  return {
    followingHandles: localFollowing,
    bookmarkedPostIds: localBookmarks,
    repostedPostIds: localReposts,
    isFollowing: (handle) => localFollowing.includes(handle),
    toggleFollow: (handle) =>
      setLocalFollowing((prev) =>
        prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle],
      ),
    isBookmarked: (postId) => localBookmarks.includes(postId),
    toggleBookmark: (postId) =>
      setLocalBookmarks((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
      ),
    isReposted: (postId) => localReposts.includes(postId),
    toggleRepost: (postId) =>
      setLocalReposts((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
      ),
  };
}
