import type { Metadata } from 'next';
import Link from 'next/link';
import {
  EmptyState,
  FilterChip,
  Panel,
  StatTile,
  Button,
} from '@hackerland/ui';
import {
  OPPORTUNITY_KINDS,
  parseEnum,
  type OpportunityKind,
} from '@hackerland/core';
import { Trophy } from 'lucide-react';
import { listOpportunities, getPlatformStats } from '@/lib/data/queries';
import { OpportunityCard } from '@/components/domain/opportunity-card';
import { Money } from '@/components/domain/money';
import { ReverseRFCSection } from '@/components/domain/reverse-rfc-section';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { OpportunitiesTabs } from '@/components/social/opportunities-tabs';
import { PostOpportunityTrigger } from './post-opportunity-trigger';

export const metadata: Metadata = {
  title: 'Earn by Building',
  description:
    'Funded bounties, paid roles, grants and hackathons for student makers and open-source engineers.',
};

interface EarnPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EarnPage({ searchParams }: EarnPageProps) {
  const resolvedParams = await searchParams;
  const kindParam = typeof resolvedParams.kind === 'string' ? resolvedParams.kind : undefined;
  const selectedKind = parseEnum(OPPORTUNITY_KINDS, kindParam);

  const [opportunities, stats, allOpportunities] = await Promise.all([
    listOpportunities(selectedKind),
    getPlatformStats(),
    listOpportunities(),
  ]);

  const bountyCount = allOpportunities.filter((o) => o.kind === 'bounty').length;
  const grantAndHackathonCount = allOpportunities.filter(
    (o) => o.kind === 'grant' || o.kind === 'hackathon'
  ).length;

  const filters: { label: string; value?: OpportunityKind; href: string }[] = [
    { label: 'All', href: '/earn' },
    { label: 'Bounties', value: 'bounty', href: '/earn?kind=bounty' },
    { label: 'Paid roles', value: 'paid-role', href: '/earn?kind=paid-role' },
    { label: 'Grants', value: 'grant', href: '/earn?kind=grant' },
    { label: 'Hackathons', value: 'hackathon', href: '/earn?kind=hackathon' },
    { label: 'Gigs', value: 'gig', href: '/earn?kind=gig' },
  ];

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <OpportunitiesTabs />

        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Trophy className="size-3.5" aria-hidden="true" />
              <span>Bounties, Grants &amp; Maker Capital</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Earn by building
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
              Sponsors fund the pool, and Hackerland charges contributors zero commission. Claim a bounty, ship open PRs, and get paid in escrow.
            </p>
          </div>

          <div className="shrink-0">
            <PostOpportunityTrigger />
          </div>
        </header>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 min-w-0">
          <StatTile
            label="Open Opportunities"
            value={stats.openOpportunities}
            hint="Across all tracks"
            tone="accent"
          />
          <StatTile
            label="Total Rewards"
            value={
              <Money
                amount={stats.rewardsPool.amount}
                currency={stats.rewardsPool.currency}
              />
            }
            hint="100% direct to builders"
            tone="earn"
          />
          <StatTile
            label="Active Bounties"
            value={bountyCount}
            hint="Task & feature rewards"
            tone="code"
          />
          <StatTile
            label="Grants & Sprints"
            value={grantAndHackathonCount}
            hint="Seed & prize funding"
            tone="make"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isSelected = filter.value ? selectedKind === filter.value : !selectedKind;
            return (
              <FilterChip
                key={filter.label}
                asChild
                selected={isSelected}
                tone="accent"
              >
                <Link href={filter.href}>{filter.label}</Link>
              </FilterChip>
            );
          })}
        </div>

        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={selectedKind === 'gig' ? 'No open gigs right now' : 'No opportunities found'}
            description={
              selectedKind === 'gig'
                ? 'Short-term maker gigs and quick freelance contracts will be posted as verified squads spin up.'
                : 'There are currently no listings matching this filter. Check other categories or sponsor a bounty.'
            }
            action={
              <Button asChild variant="secondary">
                <Link href="/earn">View all opportunities</Link>
              </Button>
            }
          />
        )}

        <ReverseRFCSection />

        <Panel
          title="Sponsor a bounty"
          action={
            <Button asChild variant="primary" size="sm">
              <a href="mailto:hello@hackerland.in?subject=Sponsoring a bounty on Hackerland">
                Get in touch
              </a>
            </Button>
          }
        >
          <p className="max-w-2xl text-body-md text-fg-muted">
            Have a feature you want built, an open-source bug solved, or an edge research problem?
            Fund a bounty, grant, or hackathon and connect directly with India&apos;s most driven
            student makers and developers.
          </p>
        </Panel>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
