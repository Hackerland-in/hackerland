import type { ProfileView } from './types';
import { ALL_PROFILES } from './fixtures/people';

declare global {
  // eslint-disable-next-line no-var
  var __hackerlandProfileRegistry: Map<string, ProfileView> | undefined;
}

function getRegistry(): Map<string, ProfileView> {
  if (!globalThis.__hackerlandProfileRegistry) {
    const map = new Map<string, ProfileView>();
    for (const p of ALL_PROFILES) {
      map.set(p.handle.toLowerCase(), { ...p });
    }
    globalThis.__hackerlandProfileRegistry = map;
  }
  return globalThis.__hackerlandProfileRegistry;
}

export function getStoredProfile(handle: string): ProfileView | null {
  const norm = handle.toLowerCase().trim();
  const reg = getRegistry();
  return reg.get(norm) || null;
}

export function listAllStoredProfiles(): ProfileView[] {
  const reg = getRegistry();
  return Array.from(reg.values());
}

export function saveStoredProfile(
  data: Partial<ProfileView> & { handle: string; displayName?: string },
): ProfileView {
  const norm = data.handle.toLowerCase().trim();
  const reg = getRegistry();
  const existing = reg.get(norm);

  const name = data.name || data.displayName || existing?.name || norm;
  const updated: ProfileView = {
    handle: norm,
    name,
    headline: data.headline ?? existing?.headline ?? 'Hackerland Innovator',
    bio:
      data.bio ??
      existing?.bio ??
      'Building and collaborating across open-source hardware, software, and deep-tech squads.',
    location: data.location ?? existing?.location ?? 'Bengaluru, India',
    avatarUrl: data.avatarUrl ?? existing?.avatarUrl ?? undefined,
    tracks:
      data.tracks && data.tracks.length > 0 ? data.tracks : existing?.tracks ?? ['code', 'make'],
    skills: data.skills ?? existing?.skills ?? ['Systems Engineering', 'Prototyping'],
    badges: data.badges ?? existing?.badges ?? [{ label: 'Maker', tone: 'make' }],
    links: data.links ?? existing?.links ?? [],
    reputation: existing?.reputation ?? 120,
    stats: existing?.stats ?? {
      projects: 0,
      endorsements: 0,
      contributions: 0,
      earned: { amount: 0, currency: 'INR' },
    },
    projects: existing?.projects ?? [],
    mentorships: existing?.mentorships ?? [],
    credentials: existing?.credentials ?? [],
    endorsements: existing?.endorsements ?? [],
    recentReputation: existing?.recentReputation ?? [
      {
        kind: 'post-helpful',
        points: 50,
        label: 'Node identity activated on Hackerland',
        at: new Date().toISOString(),
      },
    ],
  };

  reg.set(norm, updated);
  return updated;
}
