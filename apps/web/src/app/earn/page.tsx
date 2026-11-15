import type { Metadata } from 'next';
import Link from 'next/link';
import {
  EmptyState,
  FilterChip,
  Panel,
  SectionHeader,
  StatTile,
  Button,
} from '@hackerland/ui';
import {
  OPPORTUNITY_KINDS,
  parseEnum,
  type OpportunityKind,
} from '@hackerland/core';
import { listOpportunities, getPlatformStats } from '@/lib/data/queries';
import { OpportunityCard } from '@/components/domain/opportunity-card';
import { Money } from '@/components/domain/money';
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="GRANTS & CAPITAL"
        title="Earn by building"
        description="The rewards are funded by sponsors, and Hackerland charges contributors nothing."
        action={<PostOpportunityTrigger />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
        <StatTile
          label="Open Opportunities"
          value={stats.openOpportunities}
          hint="Across all tracks"
          tone="earn"
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

      <div className="flex flex-wrap items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isSelected = filter.value ? selectedKind === filter.value : !selectedKind;
            return (
              <FilterChip
                key={filter.label}
                asChild
                selected={isSelected}
                tone="earn"
              >
                <Link href={filter.href}>{filter.label}</Link>
              </FilterChip>
            );
          })}
        </div>
      </div>

      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-w-0">
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

      <Panel
        title="Sponsor a bounty"
        action={
          <Button asChild variant="earn">
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
    </div>
  );
}
