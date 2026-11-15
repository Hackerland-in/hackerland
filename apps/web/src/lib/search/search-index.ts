import { listProjects, listLabs, listOpportunities, listAllStoredProfiles } from '@/lib/data/queries';
import {
  STATIC_SEARCH_CATALOG,
  type SearchResultItem,
} from './search-catalog';

export type { SearchResultItem };
export { STATIC_SEARCH_CATALOG };

/**
 * Searches across projects, virtual simulators, factory blueprints,
 * academy masterclasses, bounties, and makerspaces.
 */
export async function searchGlobalPlatform(rawQuery: string): Promise<SearchResultItem[]> {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const queryTerms = query.split(/\s+/).filter(Boolean);

  // 1. Fetch dynamic data from database/fixtures
  const [projects, labs, opportunities] = await Promise.all([
    listProjects().catch(() => []),
    listLabs().catch(() => []),
    listOpportunities().catch(() => []),
  ]);

  const dynamicItems: SearchResultItem[] = [];

  // Convert profiles
  const profiles = listAllStoredProfiles();
  for (const p of profiles) {
    dynamicItems.push({
      id: `profile-${p.handle}`,
      title: `${p.name} (@${p.handle})`,
      description: p.headline || p.bio || '',
      category: 'projects',
      categoryLabel: 'Innovator Profile',
      href: `/u/${p.handle}`,
      badge: `${p.reputation} REP`,
      badgeTone: 'accent',
      keywords: [p.name, p.handle, p.headline, ...(p.skills || []), p.location],
    });
  }

  // Convert projects
  for (const proj of projects) {
    dynamicItems.push({
      id: `project-${proj.slug}`,
      title: proj.title,
      description: proj.summary,
      category: 'projects',
      categoryLabel: 'Project',
      href: `/projects/${proj.slug}`,
      badge: proj.tracks[0]?.toUpperCase() || 'PROJECT',
      badgeTone: 'accent',
      keywords: [
        proj.slug,
        proj.title,
        proj.summary,
        ...proj.tracks,
        proj.stage,
        proj.licence,
      ],
    });
  }

  // Convert labs
  for (const lab of labs) {
    dynamicItems.push({
      id: `lab-${lab.slug || lab.id}`,
      title: lab.name,
      description: `${lab.location.city}, ${lab.location.state} (${lab.institution}) — Tools: ${lab.tools.slice(0, 4).join(', ')}`,
      category: 'labs',
      categoryLabel: 'Makerspace / Lab',
      href: `/labs?node=${lab.slug || lab.id}`,
      badge: lab.type.toUpperCase(),
      badgeTone: 'make',
      keywords: [lab.name, lab.location.city, lab.location.state, lab.institution, lab.type, ...lab.tools],
    });
  }

  // Convert opportunities & bounties
  for (const opp of opportunities) {
    dynamicItems.push({
      id: `opp-${opp.id}`,
      title: opp.title,
      description: opp.summary || '',
      category: 'bounties',
      categoryLabel: 'Bounty / Grant',
      href: `/earn`,
      badge: opp.reward
        ? `${opp.reward.currency} ${opp.reward.amount.toLocaleString()}`
        : 'BOUNTY',
      badgeTone: 'earn',
      keywords: [opp.title, opp.summary, opp.kind, ...(opp.tracks || [])],
    });
  }

  const allItems = [...STATIC_SEARCH_CATALOG, ...dynamicItems];

  // Match ranking scoring
  const scoredItems = allItems.map((item) => {
    let score = 0;
    const itemTitle = (item.title || '').toLowerCase();
    const itemDesc = (item.description || '').toLowerCase();
    const keywords = (item.keywords || [])
      .filter(Boolean)
      .map((k) => String(k).toLowerCase())
      .join(' ');

    if (itemTitle === query) score += 100;
    else if (itemTitle.startsWith(query)) score += 60;
    else if (itemTitle.includes(query)) score += 40;

    for (const term of queryTerms) {
      if (itemTitle.includes(term)) score += 20;
      if (keywords.includes(term)) score += 15;
      if (itemDesc.includes(term)) score += 8;
    }

    return { item, score };
  });

  return scoredItems
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}
