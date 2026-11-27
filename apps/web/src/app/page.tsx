import {
  getFeed,
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { VentureProvider } from '@/components/social/venture-context';
import { SocialShell } from '@/components/social/social-shell';
import { BuilderStoriesStrip, type BuilderStoryItem } from '@/components/social/builder-stories-strip';
import { SocialFeedStream } from '@/components/social/social-feed-stream';
import { CommunityRightRail } from '@/components/social/community-right-rail';
import { IndiaJourneyHero } from '@/components/social/india-journey-hero';

export default async function HomePage() {
  const [stats, posts, projects, opportunities] = await Promise.all([
    getPlatformStats(),
    getFeed(),
    listProjects(),
    listOpportunities('bounty'),
  ]);

  const storyTags = ['AeroGlide', 'I2C Recovery', 'OpenBraille', 'Speech AI', 'FabLab 3D', 'Fluids CFD'];
  const stories: BuilderStoryItem[] = ALL_PEOPLE.map((person, index) => ({
    person,
    statusTag: storyTags[index] ?? 'Building',
  }));

  return (
    <SocialCommunityProvider>
      <VentureProvider>
        <SocialShell
          rightRail={
            <CommunityRightRail
              suggestedMakers={ALL_PEOPLE.slice(0, 4)}
              trendingProjects={projects.slice(0, 3)}
              openBounties={opportunities.slice(0, 3)}
              stats={stats}
            />
          }
        >
          {/* India Ideation-to-Factory & Export North-Star Journey */}
          <IndiaJourneyHero />

          {/* Active Builders Stories Bar */}
          <BuilderStoriesStrip stories={stories} />

          {/* Live Community Stream + Quick Composer */}
          <SocialFeedStream initialPosts={posts} showComposer />
        </SocialShell>
      </VentureProvider>
    </SocialCommunityProvider>
  );
}
