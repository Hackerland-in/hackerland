import { ALL_PROFILES } from '@/lib/data/fixtures/people';
import { TRACKS, type Track } from '@hackerland/core';
import { connectDb, ProfileModel } from '@hackerland/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTrack = searchParams.get('track');
  const track =
    rawTrack && (TRACKS as readonly string[]).includes(rawTrack)
      ? (rawTrack as Track)
      : undefined;

  const limitParam = parseInt(searchParams.get('limit') || '50', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter = track ? { tracks: track } : {};
      const docs = await ProfileModel.find(filter)
        .sort({ reputation: -1, createdAt: 1 })
        .limit(limit)
        .lean();

      if (docs.length > 0) {
        const leaderboard = docs.map((d, index) => ({
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

        return Response.json({ success: true, leaderboard });
      }
    } catch (err: unknown) {
      console.warn('MongoDB query failed for GET /api/leaderboard, falling back to fixtures:', err);
    }
  }

  // Graceful fallback to fixtures
  let profiles = [...ALL_PROFILES];
  if (track) {
    profiles = profiles.filter((p) => p.tracks.includes(track));
  }
  profiles.sort((a, b) => b.reputation - a.reputation);

  const leaderboard = profiles.slice(0, limit).map((p, index) => ({
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

  return Response.json({ success: true, leaderboard });
}
