import Link from 'next/link';
import { Sparkles, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@hackerland/ui';
import {
  getFeed,
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { BuilderStoriesStrip, type BuilderStoryItem } from '@/components/social/builder-stories-strip';
import { SocialFeedStream } from '@/components/social/social-feed-stream';
import { CommunityRightRail } from '@/components/social/community-right-rail';

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
        {/* Compact Social Community Banner */}
        <section className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
                <Sparkles className="size-3.5" aria-hidden="true" />
                <span>Builder Social Network</span>
              </div>
              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight break-words">
                Build in public. Ship together.
              </h1>
              <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
                Share hardware prototypes, ask engineering questions, join open squads, and claim funded bounties.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button asChild size="sm" variant="primary">
                <Link href="/new">
                  <Rocket className="size-3.5" aria-hidden="true" />
                  <span>Start project</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/projects">
                  <span>Browse builds</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Active Builders Stories Bar */}
        <BuilderStoriesStrip stories={stories} />

        {/* Live Community Stream + Quick Composer */}
        <SocialFeedStream initialPosts={posts} showComposer />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
