import type { Metadata } from 'next';
import { POST_KINDS, parseEnum } from '@hackerland/core';
import {
  getFeed,
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { SocialFeedStream } from '@/components/social/social-feed-stream';
import { CommunityRightRail } from '@/components/social/community-right-rail';
import { Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community Feed',
  description:
    'Discover what makers, engineers, and builders are sharing across hardware, robotics, software, and open projects.',
};

interface FeedPageProps {
  searchParams: Promise<{
    kind?: string | string[];
    tag?: string | string[];
  }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const resolvedParams = await searchParams;
  const rawKind = Array.isArray(resolvedParams.kind)
    ? resolvedParams.kind[0]
    : resolvedParams.kind;
  const rawTag = Array.isArray(resolvedParams.tag)
    ? resolvedParams.tag[0]
    : resolvedParams.tag;

  const activeKind = parseEnum(POST_KINDS, rawKind);

  const [posts, opportunities, projects, stats] = await Promise.all([
    getFeed(),
    listOpportunities('bounty'),
    listProjects(),
    getPlatformStats(),
  ]);

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
        {/* Clean Social Feed Header */}
        <header className="rounded-2xl border border-hairline bg-surface-1 p-5 shadow-xs space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Flame className="size-3.5" aria-hidden="true" />
            <span>Explore Community</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            What makers are building right now
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted">
            Live build logs, hardware demos, technical Q&amp;A threads, and active squad calls.
          </p>
        </header>

        <SocialFeedStream
          initialPosts={posts}
          initialKind={activeKind}
          initialTag={rawTag}
          showComposer
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
