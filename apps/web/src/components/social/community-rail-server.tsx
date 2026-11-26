import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { getPlatformStats, listOpportunities, listProjects } from '@/lib/data/queries';
import { CommunityRightRail } from './community-right-rail';

/**
 * Async server wrapper for the sticky social right rail across community pages.
 */
export async function CommunityRailServer() {
  const [projects, openBounties, stats] = await Promise.all([
    listProjects(),
    listOpportunities('bounty'),
    getPlatformStats(),
  ]);

  return (
    <CommunityRightRail
      suggestedMakers={ALL_PEOPLE.slice(0, 4)}
      trendingProjects={projects.slice(0, 3)}
      openBounties={openBounties.slice(0, 3)}
      stats={stats}
    />
  );
}
