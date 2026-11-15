import type {
  OpportunityKind,
  PostKind,
  Track,
} from '@hackerland/core';
import {
  connectDb,
  LabNodeModel,
  OpportunityModel,
  PostModel,
  ProfileModel,
  ProjectModel,
  ReportModel,
  NotificationModel,
  ReputationEventModel,
} from '@hackerland/db';
import { ALL_LAB_NODES } from './fixtures/labs';
import { ALL_OPPORTUNITIES } from './fixtures/opportunities';
import { ALL_PROFILES } from './fixtures/people';
import {
  getStoredProfile,
  listAllStoredProfiles,
  saveStoredProfile,
} from './profile-store';
import { ALL_POSTS } from './fixtures/posts';
import {
  listStoredPosts,
  addStoredPost,
  incrementPostReaction,
} from './feed-store';
import {
  ALL_PROJECT_SUMMARIES,
  ALL_PROJECTS,
} from './fixtures/projects';
import { FIXTURE_REPORTS } from './fixtures/reports';
import { FIXTURE_NOTIFICATIONS } from './fixtures/notifications';
import { ALL_ROADMAPS } from './fixtures/roadmaps';
import { PLATFORM_STATS } from './fixtures/stats';
import type {
  FeedPost,
  LabNodeView,
  LeaderboardEntry,
  ModerationReport,
  NotificationItem,
  OpenRole,
  OpportunityView,
  PersonRef,
  PlatformStats,
  ProfileView,
  ProjectDetail,
  ProjectSummary,
  ReportReason,
  ReportStatus,
  ReportTargetType,
  Resource,
  RoadmapView,
} from './types';

/**
 * Returns feed posts, optionally filtered by PostKind.
 * Queries PostModel when MONGODB_URI is available, merging with fixtures.
 * Ordered newest first (createdAt descending).
 */
export async function getFeed(kind?: PostKind): Promise<FeedPost[]> {
  let dbPosts: FeedPost[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = kind ? { kind } : {};
      const docs = await PostModel.find(filter).sort({ createdAt: -1 }).lean();

      if (docs.length > 0) {
        const authorIds = Array.from(new Set(docs.map((d) => d.authorId)));
        const projectIds = Array.from(
          new Set(docs.map((d) => d.projectId).filter((id): id is string => Boolean(id))),
        );

        const validObjectIds = projectIds.filter((id) => /^[0-9a-fA-F]{24}$/.test(id));
        const projectOrFilter = [
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
          ...(projectIds.length > 0 ? [{ slug: { $in: projectIds } }] : []),
        ];

        const [profiles, projects] = await Promise.all([
          ProfileModel.find({ userId: { $in: authorIds } }).lean(),
          projectOrFilter.length > 0
            ? ProjectModel.find({ $or: projectOrFilter }).lean()
            : Promise.resolve([]),
        ]);

        const profileMap = new Map(profiles.map((p) => [p.userId, p]));
        const projectMap = new Map<string, { slug: string; title: string }>();
        for (const pr of projects) {
          const entry = { slug: pr.slug, title: pr.title };
          projectMap.set(pr._id.toString(), entry);
          projectMap.set(pr.slug, entry);
        }

        dbPosts = docs.map((d) => {
          const prof = profileMap.get(d.authorId);
          const author: PersonRef = prof
            ? {
                handle: prof.handle,
                name: prof.displayName,
                avatarUrl: prof.avatarUrl,
                headline: prof.headline,
                badges: (prof.experienceBadges || []).map((b) => ({
                  label: b.label,
                  tone: b.tone as Track | 'neutral',
                })),
              }
            : {
                handle: `user-${d.authorId.slice(0, 8)}`,
                name: 'Anonymous Builder',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                headline: 'Builder',
                badges: [{ label: 'Builder', tone: 'neutral' as const }],
              };

          const matchedProj = d.projectId ? projectMap.get(d.projectId) : undefined;
          const project = matchedProj
            ? {
                slug: matchedProj.slug,
                title: matchedProj.title,
              }
            : undefined;

          return {
            id: d._id.toString(),
            kind: d.kind,
            author,
            project,
            title: d.title,
            body: d.body,
            tags: d.tags || [],
            createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
            reactions: d.counts?.reactions ?? 0,
            comments: d.counts?.comments ?? 0,
          };
        });
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for getFeed, falling back to fixtures:', err);
    }
  }

  const dbIds = new Set(dbPosts.map((p) => p.id));
  let fixturePosts = listStoredPosts().filter((p) => !dbIds.has(p.id));
  if (kind) {
    fixturePosts = fixturePosts.filter((p) => p.kind === kind);
  }

  const combined = [...dbPosts, ...fixturePosts];
  return combined.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

        const recentEvents = await ReputationEventModel.find({ userId: doc.userId })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        const recentReputation = recentEvents.map((e) => ({
          kind: e.kind,
          points: e.points,
          label: `${e.kind.replace(/-/g, ' ')} (${e.ref?.type || 'item'})`,
          at: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
        }));

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
          recentReputation,
        };
      }
    } catch {
      // Fallback to fixtures on DB error or failure
    }
  }

  // Fallback to in-memory store (registered or updated profiles)
  const stored = getStoredProfile(normalized);
  if (stored) {
    const userProjects = ALL_PROJECT_SUMMARIES.filter((p) =>
      p.squad.some((s) => s.handle === normalized)
    );
    return {
      ...stored,
      projects: userProjects.length > 0 ? userProjects : stored.projects,
    };
  }

  // Fallback to fixtures
  const match = ALL_PROFILES.find((p) => p.handle === normalized);
  if (!match) return null;

  const userProjects = ALL_PROJECT_SUMMARIES.filter((p) =>
    p.squad.some((s) => s.handle === normalized)
  );
  return {
    ...match,
    projects: userProjects.length > 0 ? userProjects : match.projects,
  };
}

export {
  listAllStoredProfiles,
  saveStoredProfile,
  listStoredPosts,
  addStoredPost,
  incrementPostReaction,
};

/**
 * Returns ranked list of innovators ordered by total reputation points descending.
 */
export async function getLeaderboard(track?: Track): Promise<LeaderboardEntry[]> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = track ? { tracks: track } : {};
      const docs = await ProfileModel.find(filter)
        .sort({ reputation: -1, createdAt: 1 })
        .limit(50)
        .lean();

      if (docs.length > 0) {
        return docs.map((d, index) => ({
          rank: index + 1,
          handle: d.handle,
          name: d.displayName,
          headline: d.headline,
          avatarUrl: d.avatarUrl,
          tracks: d.tracks || [],
          badges: (d.experienceBadges || []).map((b) => ({
            label: b.label,
            tone: b.tone as Track | 'neutral',
          })),
          reputation: d.reputation ?? 0,
          projectsCount: 0,
          contributionsCount: 0,
        }));
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for getLeaderboard, falling back to fixtures:', err);
    }
  }

  let profiles = [...listAllStoredProfiles()];
  if (track) {
    profiles = profiles.filter((p) => p.tracks.includes(track));
  }
  profiles.sort((a, b) => b.reputation - a.reputation);

  return profiles.map((p, index) => ({
    rank: index + 1,
    handle: p.handle,
    name: p.name,
    headline: p.headline,
    avatarUrl: p.avatarUrl,
    tracks: p.tracks,
    badges: p.badges,
    reputation: p.reputation,
    projectsCount: p.stats.projects,
    contributionsCount: p.stats.contributions,
  }));
}

/**
 * Lists opportunities, optionally filtered by kind.
 * Queries OpportunityModel when MONGODB_URI is available, merging with fixtures.
 * Ordered by deadline ascending, with opportunities without a deadline last.
 */
export async function listOpportunities(
  kind?: OpportunityKind
): Promise<OpportunityView[]> {
  let dbOpps: OpportunityView[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = kind ? { kind } : {};
      const docs = await OpportunityModel.find(filter).lean();

      if (docs.length > 0) {
        dbOpps = docs.map((d) => ({
          id: d._id.toString(),
          kind: d.kind,
          title: d.title,
          summary: d.summary,
          sponsor: {
            name: d.sponsor.name,
            url: d.sponsor.url,
          },
          reward: {
            amount: d.reward.amount,
            currency: d.reward.currency,
          },
          tracks: d.tracks,
          deadline: d.deadline ? new Date(d.deadline).toISOString().split('T')[0] : undefined,
          status: d.status,
          projectSlug: d.projectId,
          externalUrl: d.externalUrl,
        }));
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for listOpportunities, falling back to fixtures:', err);
    }
  }

  const dbIds = new Set(dbOpps.map((o) => o.id));
  let fixtureOpps = ALL_OPPORTUNITIES.filter((o) => !dbIds.has(o.id));
  if (kind) {
    fixtureOpps = fixtureOpps.filter((o) => o.kind === kind);
  }

  const combined = [...dbOpps, ...fixtureOpps];
  return combined.sort((a, b) => {
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

/**
 * Lists Atal Tinkering Labs (ATLs) and makerspaces, optionally filtered by tool.
 */
export async function listLabs(tool?: string): Promise<LabNodeView[]> {
  let dbLabs: LabNodeView[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = tool ? { tools: { $regex: new RegExp(tool, 'i') } } : {};
      const docs = await LabNodeModel.find(filter).sort({ isVerified: -1, createdAt: -1 }).lean();

      if (docs.length > 0) {
        dbLabs = docs.map((d) => ({
          id: d._id.toString(),
          slug: d.slug,
          name: d.name,
          type: d.type,
          institution: d.institution,
          location: d.location,
          tools: d.tools,
          equipmentList: (d.equipmentList || []).map((e) => ({
            name: e.name,
            model: e.model,
            count: e.count,
            status: e.status,
          })),
          isVerified: d.isVerified,
          contact: d.contact,
          benchServiceUrl: d.benchServiceUrl,
          createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
        }));
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for listLabs, falling back to fixtures:', err);
    }
  }

  const dbSlugs = new Set(dbLabs.map((l) => l.slug));
  let fixtureLabs = ALL_LAB_NODES.filter((l) => !dbSlugs.has(l.slug));
  if (tool) {
    const lower = tool.toLowerCase();
    fixtureLabs = fixtureLabs.filter((l) => l.tools.some((t) => t.toLowerCase().includes(lower)));
  }

  return [...dbLabs, ...fixtureLabs];
}

/**
 * Retrieves a lab node by its slug, or null if not found.
 */
export async function getLab(slug: string): Promise<LabNodeView | null> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const d = await LabNodeModel.findOne({ slug }).lean();
      if (d) {
        return {
          id: d._id.toString(),
          slug: d.slug,
          name: d.name,
          type: d.type,
          institution: d.institution,
          location: d.location,
          tools: d.tools,
          equipmentList: (d.equipmentList || []).map((e) => ({
            name: e.name,
            model: e.model,
            count: e.count,
            status: e.status,
          })),
          isVerified: d.isVerified,
          contact: d.contact,
          benchServiceUrl: d.benchServiceUrl,
          createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : undefined,
        };
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for getLab, falling back to fixtures:', err);
    }
  }

  const match = ALL_LAB_NODES.find((l) => l.slug === slug);
  return match || null;
}

/**
 * Retrieves moderation reports, optionally filtered by status, targetType, or reason.
 */
export async function listReports(filters?: {
  status?: ReportStatus;
  targetType?: ReportTargetType;
  reason?: ReportReason;
}): Promise<ModerationReport[]> {
  let dbReports: ModerationReport[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const query: Record<string, unknown> = {};
      if (filters?.status) query.status = filters.status;
      if (filters?.targetType) query.targetType = filters.targetType;
      if (filters?.reason) query.reason = filters.reason;

      const docs = await ReportModel.find(query).sort({ createdAt: -1 }).lean();
      dbReports = docs.map((d) => ({
        id: d._id.toString(),
        reporterId: d.reporterId,
        targetType: d.targetType as ReportTargetType,
        targetId: d.targetId,
        reason: d.reason as ReportReason,
        details: d.details,
        status: d.status as ReportStatus,
        actionTaken: d.actionTaken,
        resolvedBy: d.resolvedBy,
        resolvedAt: d.resolvedAt ? new Date(d.resolvedAt).toISOString() : undefined,
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
      }));
    } catch (err: unknown) {
      console.warn('MongoDB query failed for listReports, falling back to fixtures:', err);
    }
  }

  let fixtureReports = FIXTURE_REPORTS;
  if (filters?.status) {
    fixtureReports = fixtureReports.filter((r) => r.status === filters.status);
  }
  if (filters?.targetType) {
    fixtureReports = fixtureReports.filter((r) => r.targetType === filters.targetType);
  }
  if (filters?.reason) {
    fixtureReports = fixtureReports.filter((r) => r.reason === filters.reason);
  }

  return [...dbReports, ...fixtureReports];
}

/**
 * Retrieves a single moderation report by its id.
 */
export async function getReport(id: string): Promise<ModerationReport | null> {
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const d = await ReportModel.findById(id).lean();
      if (d) {
        return {
          id: d._id.toString(),
          reporterId: d.reporterId,
          targetType: d.targetType as ReportTargetType,
          targetId: d.targetId,
          reason: d.reason as ReportReason,
          details: d.details,
          status: d.status as ReportStatus,
          actionTaken: d.actionTaken,
          resolvedBy: d.resolvedBy,
          resolvedAt: d.resolvedAt ? new Date(d.resolvedAt).toISOString() : undefined,
          createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for getReport, falling back to fixtures:', err);
    }
  }

  const match = FIXTURE_REPORTS.find((r) => r.id === id);
  return match || null;
}

/**
 * Lists notifications for a given user, optionally filtered by read status.
 */
export async function listNotifications(userId?: string): Promise<NotificationItem[]> {
  let dbNotifs: NotificationItem[] = [];

  if (process.env.MONGODB_URI && userId) {
    try {
      await connectDb();
      const docs = await NotificationModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();

      dbNotifs = docs.map((d) => ({
        id: d._id.toString(),
        userId: d.userId,
        actorId: d.actorId,
        type: d.type as NotificationItem['type'],
        title: d.title,
        message: d.message,
        link: d.link,
        read: d.read,
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (err: unknown) {
      console.warn('MongoDB query failed for listNotifications, falling back to fixtures:', err);
    }
  }

  return [...dbNotifs, ...FIXTURE_NOTIFICATIONS];
}



