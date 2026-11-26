'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SocialCommunityContextValue {
  followingHandles: string[];
  bookmarkedPostIds: string[];
  repostedPostIds: string[];
  starredProjectSlugs: string[];
  isFollowing: (handle: string) => boolean;
  toggleFollow: (handle: string) => void;
  isBookmarked: (postId: string) => boolean;
  toggleBookmark: (postId: string) => void;
  isReposted: (postId: string) => boolean;
  toggleRepost: (postId: string) => void;
  isProjectStarred: (slug: string) => boolean;
  toggleStarProject: (slug: string) => void;
}

const DEFAULT_FOLLOWING = ['meera-iyer', 'zoya-khan'];
const DEFAULT_STARRED_PROJECTS = ['aeroglide'];

const SocialCommunityContext = createContext<SocialCommunityContextValue | null>(null);

export function SocialCommunityProvider({ children }: { children: ReactNode }) {
  const [followingHandles, setFollowingHandles] = useState<string[]>(DEFAULT_FOLLOWING);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([]);
  const [repostedPostIds, setRepostedPostIds] = useState<string[]>([]);
  const [starredProjectSlugs, setStarredProjectSlugs] = useState<string[]>(DEFAULT_STARRED_PROJECTS);

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
      const savedStars = localStorage.getItem('hackerland_starred_projects');
      if (savedStars) {
        const parsed = JSON.parse(savedStars);
        if (Array.isArray(parsed)) setStarredProjectSlugs(parsed);
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

  const toggleStarProject = (slug: string) => {
    setStarredProjectSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('hackerland_starred_projects', JSON.stringify(next));
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
        starredProjectSlugs,
        isFollowing: (handle) => followingHandles.includes(handle),
        toggleFollow,
        isBookmarked: (postId) => bookmarkedPostIds.includes(postId),
        toggleBookmark,
        isReposted: (postId) => repostedPostIds.includes(postId),
        toggleRepost,
        isProjectStarred: (slug) => starredProjectSlugs.includes(slug),
        toggleStarProject,
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
  const [localStars, setLocalStars] = useState<string[]>(DEFAULT_STARRED_PROJECTS);

  if (ctx) return ctx;

  return {
    followingHandles: localFollowing,
    bookmarkedPostIds: localBookmarks,
    repostedPostIds: localReposts,
    starredProjectSlugs: localStars,
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
    isProjectStarred: (slug) => localStars.includes(slug),
    toggleStarProject: (slug) =>
      setLocalStars((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
      ),
  };
}
