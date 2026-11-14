import type { Metadata } from 'next';
import Link from 'next/link';
import {
  EmptyState,
  FilterChip,
  Panel,
  SectionHeader,
  Button,
} from '@hackerland/ui';
import { POST_KINDS, parseEnum } from '@hackerland/core';
import { Sparkles, Trophy, Rocket } from 'lucide-react';
import { getFeed, listOpportunities, listProjects } from '@/lib/data/queries';
import { PostCard } from '@/components/domain/post-card';
import { OpportunityCard } from '@/components/domain/opportunity-card';
import { ProjectCard } from '@/components/domain/project-card';

export const metadata: Metadata = {
  title: 'Community Feed',
  description:
    'Discover what innovators, engineers, and makers are building across hardware, software, and deep-tech.',
};

interface FeedPageProps {
  searchParams: Promise<{
    kind?: string | string[];
  }>;
}

const FILTER_ITEMS = [
  { kind: undefined, label: 'All', href: '/feed' },
  { kind: 'update' as const, label: 'Build logs', href: '/feed?kind=update' },
  { kind: 'showcase' as const, label: 'Showcases', href: '/feed?kind=showcase' },
  { kind: 'question' as const, label: 'Questions', href: '/feed?kind=question' },
  { kind: 'squad-call' as const, label: 'Squad calls', href: '/feed?kind=squad-call' },
];

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const resolvedParams = await searchParams;
  const rawKind = Array.isArray(resolvedParams.kind)
    ? resolvedParams.kind[0]
    : resolvedParams.kind;
  const activeKind = parseEnum(POST_KINDS, rawKind);

  // Fetch feed posts and right-rail widgets
  const [posts, opportunities, projects] = await Promise.all([
    getFeed(activeKind),
    listOpportunities('bounty'),
    listProjects(),
  ]);

  const topBounties = opportunities.slice(0, 3);
  const squadOfTheWeek = projects[0];

  return (
    <div className="mx-auto max-w-page px-4 py-8 md:px-6 md:py-12 space-y-8 min-w-0">
      {/* Page Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="LIVE FEED"
        title="What the community is building"
        description="Real-time telemetry, build milestones, technical Q&A, and squad recruitment across all tracks."
      />

      {/* Filter Chips */}
      <nav
        aria-label="Feed filters"
        className="flex flex-wrap items-center gap-2 pt-2"
      >
        {FILTER_ITEMS.map((item) => {
          const isSelected = item.kind === undefined ? !activeKind : activeKind === item.kind;
          return (
            <FilterChip key={item.label} asChild selected={isSelected}>
              <Link href={item.href}>{item.label}</Link>
            </FilterChip>
          );
        })}
      </nav>

      {/* Two-Column Grid: Main Feed & Right Rail */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] min-w-0">
        {/* Main Feed Column */}
        <div className="min-w-0 space-y-6">
          {posts.length === 0 ? (
            <EmptyState
              title="No posts found"
              description="There are no community posts matching this filter yet."
              action={
                <Button asChild variant="secondary">
                  <Link href="/feed">View all posts</Link>
                </Button>
              }
            />
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Right Rail Panels */}
        <aside className="space-y-6 min-w-0">
          {/* Squad of the Week */}
          {squadOfTheWeek ? (
            <Panel
              title="Squad of the week"
              icon={<Sparkles className="size-4 text-accent" aria-hidden="true" />}
            >
              <ProjectCard project={squadOfTheWeek} />
            </Panel>
          ) : null}

          {/* Open Bounties */}
          {topBounties.length > 0 ? (
            <Panel
              title="Open bounties"
              icon={<Trophy className="size-4 text-earn" aria-hidden="true" />}
              action={
                <Link
                  href="/earn?kind=bounty"
                  className="font-display text-label-sm uppercase text-accent hover:underline transition-colors"
                >
                  View all &rarr;
                </Link>
              }
            >
              <div className="flex flex-col gap-3">
                {topBounties.map((bounty) => (
                  <OpportunityCard key={bounty.id} opportunity={bounty} />
                ))}
              </div>
            </Panel>
          ) : null}

          {/* Got a project? CTA */}
          <div className="rounded-lg border border-accent/30 bg-surface-1 p-5 shadow-module space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Rocket className="size-5" aria-hidden="true" />
              <h3 className="font-display text-headline-sm text-fg">Got a project?</h3>
            </div>
            <p className="text-body-sm text-fg-muted">
              Assemble a squad of students, engineers, and designers. Post open roles, share
              telemetry, and earn bounties.
            </p>
            <Button asChild variant="primary" className="w-full">
              <Link href="/new">Start project</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
