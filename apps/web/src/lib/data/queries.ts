import type {
  OpportunityKind,
  PostKind,
  Track,
} from '@hackerland/core';
import { ALL_OPPORTUNITIES } from './fixtures/opportunities';
import { PROFILE_KAVYA, PROFILE_MEERA } from './fixtures/people';
import { ALL_POSTS } from './fixtures/posts';
import {
  ALL_PROJECT_SUMMARIES,
  ALL_PROJECTS,
} from './fixtures/projects';
import { ALL_ROADMAPS } from './fixtures/roadmaps';
import { PLATFORM_STATS } from './fixtures/stats';
import type {
  FeedPost,
  OpportunityView,
  PlatformStats,
  ProfileView,
  ProjectDetail,
  ProjectSummary,
  RoadmapView,
} from './types';

/**
 * Returns feed posts, optionally filtered by PostKind.
 * Ordered newest first (createdAt descending).
 */
export async function getFeed(kind?: PostKind): Promise<FeedPost[]> {
  let posts = [...ALL_POSTS];
  if (kind) {
    posts = posts.filter((p) => p.kind === kind);
  }
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Lists projects, optionally filtered by Track.
 */
export async function listProjects(track?: Track): Promise<ProjectSummary[]> {
  if (track) {
    return ALL_PROJECT_SUMMARIES.filter((p) => p.tracks.includes(track));
  }
  return ALL_PROJECT_SUMMARIES;
}

/**
 * Returns detailed project information by slug, or null if not found.
 */
export async function getProject(slug: string): Promise<ProjectDetail | null> {
  const match = ALL_PROJECTS.find((p) => p.slug === slug);
  if (!match) return null;

  const projectPosts = ALL_POSTS.filter((post) => post.project?.slug === slug);
  return {
    ...match,
    updates: projectPosts.length > 0 ? projectPosts : match.updates,
  };
}

/**
 * Returns profile details for a given handle, or null if not found.
 */
export async function getProfile(handle: string): Promise<ProfileView | null> {
  const normalized = handle.toLowerCase();
  let profile: ProfileView | null = null;
  if (normalized === PROFILE_MEERA.handle) {
    profile = PROFILE_MEERA;
  } else if (normalized === PROFILE_KAVYA.handle) {
    profile = PROFILE_KAVYA;
  }
  if (!profile) return null;

  const userProjects = ALL_PROJECT_SUMMARIES.filter((p) =>
    p.squad.some((s) => s.handle === normalized)
  );
  return {
    ...profile,
    projects: userProjects.length > 0 ? userProjects : profile.projects,
  };
}

/**
 * Lists opportunities, optionally filtered by kind.
 * Ordered by deadline ascending, with opportunities without a deadline last.
 */
export async function listOpportunities(
  kind?: OpportunityKind
): Promise<OpportunityView[]> {
  let opps = [...ALL_OPPORTUNITIES];
  if (kind) {
    opps = opps.filter((o) => o.kind === kind);
  }
  return opps.sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.localeCompare(b.deadline);
  });
}

/**
 * Lists roadmaps, optionally filtered by track.
 */
export async function listRoadmaps(track?: Track): Promise<RoadmapView[]> {
  if (track) {
    return ALL_ROADMAPS.filter((r) => r.track === track);
  }
  return ALL_ROADMAPS;
}

/**
 * Returns platform statistics.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  return PLATFORM_STATS;
}
