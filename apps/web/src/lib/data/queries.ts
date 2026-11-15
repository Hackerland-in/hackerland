import type {
  OpportunityKind,
  PostKind,
  Track,
} from '@hackerland/core';
import { connectDb, PostModel, ProfileModel, ProjectModel } from '@hackerland/db';
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
  OpenRole,
  OpportunityView,
  PersonRef,
  PlatformStats,
  ProfileView,
  ProjectDetail,
  ProjectSummary,
  Resource,
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
 * Queries ProjectModel when MONGODB_URI is available, merging with fixtures.
 */
export async function listProjects(track?: Track): Promise<ProjectSummary[]> {
  let dbProjects: ProjectSummary[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = track ? { tracks: track } : {};
      const docs = await ProjectModel.find(filter).sort({ updatedAt: -1 }).lean();

      if (docs.length > 0) {
        const userIds = Array.from(
          new Set(docs.flatMap((d) => d.members?.map((m) => m.userId) || [])),
        );
        const profiles = await ProfileModel.find({ userId: { $in: userIds } }).lean();
        const profileMap = new Map(profiles.map((p) => [p.userId, p]));

        dbProjects = docs.map((d) => {
          const squad: PersonRef[] = (d.members || []).map((m) => {
            const prof = profileMap.get(m.userId);
            if (prof) {
              return {
                handle: prof.handle,
                name: prof.displayName,
                avatarUrl: prof.avatarUrl,
                headline: prof.headline,
                badges: prof.experienceBadges.map((b) => ({
                  label: b.label,
                  tone: b.tone as Track | 'neutral',
                })),
              };
            }
            return {
              handle: `user-${m.userId.slice(-6)}`,
              name: m.role || 'Member',
              badges: [],
            };
          });

          return {
            slug: d.slug,
            title: d.title,
            summary: d.summary,
            tracks: d.tracks as Track[],
            stage: d.stage,
            licence: d.licence || 'MIT',
            squad,
            squadSize: Math.max(d.members?.length || 1, squad.length),
            openRoleCount: (d.openRoles || []).filter((r) => r.status === 'open').length,
            funding: d.funding
              ? {
                  goal: d.funding.goal,
                  raised: d.funding.raised,
                  currency: d.funding.currency,
                }
              : undefined,
            updatedAt: d.updatedAt ? d.updatedAt.toISOString() : new Date().toISOString(),
          };
        });
      }
    } catch {
      // Ignore DB errors, fall back to fixtures
    }
  }

  const fixtureProjects = track
    ? ALL_PROJECT_SUMMARIES.filter((p) => p.tracks.includes(track))
    : ALL_PROJECT_SUMMARIES;

  if (dbProjects.length === 0) {
    return fixtureProjects;
  }

  // Merge DB projects with fixture projects, DB taking precedence on slug collision
  const dbSlugs = new Set(dbProjects.map((p) => p.slug));
  const nonDuplicateFixtures = fixtureProjects.filter((p) => !dbSlugs.has(p.slug));
  return [...dbProjects, ...nonDuplicateFixtures];
}

/**
 * Returns detailed project information by slug, or null if not found.
 * Queries ProjectModel when MONGODB_URI is available, with fixture fallback.
 */
export async function getProject(slug: string): Promise<ProjectDetail | null> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const doc = await ProjectModel.findOne({ slug }).lean();
      if (doc) {
        const userIds = Array.from(
          new Set(doc.members?.map((m) => m.userId) || []),
        );
        const profiles = await ProfileModel.find({ userId: { $in: userIds } }).lean();
        const profileMap = new Map(profiles.map((p) => [p.userId, p]));

        const squad: PersonRef[] = (doc.members || []).map((m) => {
          const prof = profileMap.get(m.userId);
          if (prof) {
            return {
              handle: prof.handle,
              name: prof.displayName,
              avatarUrl: prof.avatarUrl,
              headline: prof.headline,
              badges: prof.experienceBadges.map((b) => ({
                label: b.label,
                tone: b.tone as Track | 'neutral',
              })),
            };
          }
          return {
            handle: `user-${m.userId.slice(-6)}`,
            name: m.role || 'Member',
            badges: [],
          };
        });

        const leads = (doc.members || [])
          .filter((m) => m.isLead)
          .map((m) => {
            const prof = profileMap.get(m.userId);
            return {
              handle: prof?.handle || `lead-${m.userId.slice(-6)}`,
              name: prof?.displayName || 'Project Lead',
              avatarUrl: prof?.avatarUrl,
              headline: prof?.headline,
              role: m.role || 'Project Lead',
              bio: prof?.bio || '',
              skills: prof?.skills || [],
              badges:
                prof?.experienceBadges?.map((b) => ({
                  label: b.label,
                  tone: b.tone as Track | 'neutral',
                })) || [],
            };
          });

        const openRoles: OpenRole[] = (doc.openRoles || []).map((r, idx) => ({
          id: r.id || `role-${idx}`,
          title: r.title,
          track: r.track as Track,
          skills: r.skills || [],
          description: r.description || '',
          compensation: r.compensation,
        }));

        const resources: Resource[] = (doc.resources || []).map((res) => ({
          name: res.name,
          qty: res.qty,
          spec: res.spec,
          cost: res.cost,
          status: res.status,
        }));

        const posts = await PostModel.find({ projectId: doc._id.toString() })
          .sort({ createdAt: -1 })
          .lean();

        const updates: FeedPost[] = posts.map((post) => ({
          id: post._id.toString(),
          kind: post.kind,
          author: leads[0] || {
            handle: 'lead',
            name: 'Project Lead',
            badges: [],
          },
          title: post.title,
          body: post.body,
          tags: post.tags || [],
          createdAt: post.createdAt.toISOString(),
          reactions: post.counts?.reactions || 0,
          comments: post.counts?.comments || 0,
        }));

        return {
          slug: doc.slug,
          title: doc.title,
          summary: doc.summary,
          body: doc.body || doc.summary,
          tracks: doc.tracks as Track[],
          stage: doc.stage,
          licence: doc.licence || 'MIT',
          squad,
          squadSize: Math.max(doc.members?.length || 1, squad.length),
          openRoleCount: openRoles.length,
          funding: doc.funding
            ? {
                goal: doc.funding.goal,
                raised: doc.funding.raised,
                currency: doc.funding.currency,
              }
            : undefined,
          updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
          leads:
            leads.length > 0
              ? leads
              : [
                  {
                    handle: 'lead',
                    name: 'Project Lead',
                    role: 'Lead',
                    bio: '',
                    skills: [],
                    badges: [],
                  },
                ],
          openRoles,
          resources,
          updates,
          milestone: {
            current: 1,
            total: 3,
            label: 'Alpha Deployment',
            next: 'Public Beta Testing',
          },
        };
      }
    } catch {
      // Fallback to fixtures
    }
  }

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

  // Try DB first if MONGODB_URI is available
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const doc = await ProfileModel.findOne({ handle: normalized }).lean();
      if (doc) {
        const userProjects = ALL_PROJECT_SUMMARIES.filter((p) =>
          p.squad.some((s) => s.handle === normalized)
        );
        return {
          handle: doc.handle,
          name: doc.displayName,
          headline: doc.headline || '',
          bio: doc.bio || '',
          location: doc.location || '',
          avatarUrl: doc.avatarUrl,
          tracks: doc.tracks as Track[],
          skills: doc.skills,
          badges: doc.experienceBadges.map((b) => ({
            label: b.label,
            tone: b.tone as Track | 'neutral',
          })),
          links: doc.links,
          reputation: doc.reputation,
          stats: {
            projects: userProjects.length,
            endorsements: 0,
            contributions: userProjects.length,
            earned: { amount: 0, currency: 'INR' },
          },
          projects: userProjects,
          mentorships: [],
          credentials: [],
          endorsements: [],
          recentReputation: [],
        };
      }
    } catch {
      // Fallback to fixtures on DB error or failure
    }
  }

  // Fallback to fixtures
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
