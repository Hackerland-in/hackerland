import type { Metadata } from 'next';
import Link from 'next/link';
import { TRACKS, TRACK_META, parseEnum } from '@hackerland/core';
import { Button, FilterChip, StatTile } from '@hackerland/ui';
import { Sparkles } from 'lucide-react';
import { getLeaderboard } from '@/lib/data/queries';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { LeaderboardInteractive } from '@/components/social/leaderboard-interactive';

export const metadata: Metadata = {
  title: 'Leaderboard · Hackerland',
  description:
    'Proof-of-Ship Leaderboard ranking global innovators by verified cryptographic karma, open-source PRs, and physical prototype milestones.',
};

interface LeaderboardPageProps {
  searchParams: Promise<{ track?: string }>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const { track } = await searchParams;
  const selectedTrack = parseEnum(TRACKS, track);
  const leaderboard = await getLeaderboard(selectedTrack);

  const trackLabel = selectedTrack ? TRACK_META[selectedTrack]?.label ?? selectedTrack : '';
  const totalKarma = leaderboard.reduce((acc, curr) => acc + curr.reputation, 0);
  const totalInnovators = leaderboard.length;
  const top1 = leaderboard[0];

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Proof-of-Ship Reputation</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Innovator Leaderboard
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
              Append-only karma earned through verified prototype builds, merged pull requests, peer reviews, and milestone deliveries.
            </p>
          </div>

          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link href="/feed">View Ship Activity</Link>
          </Button>
        </header>

        {/* KPI Stats Strip */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
          <StatTile
            label="Total Karma Pool"
            value={totalKarma.toLocaleString()}
            hint="Append-only ledger"
            tone="accent"
          />
          <StatTile
            label="Ranked Innovators"
            value={totalInnovators.toString()}
            hint={selectedTrack ? `${trackLabel} discipline` : 'All 6 tracks'}
            tone="code"
          />
          <StatTile
            label="Top Reputation"
            value={top1 ? top1.reputation.toLocaleString() : '0'}
            hint={top1 ? top1.name : 'No ranks yet'}
            tone="earn"
          />
          <StatTile
            label="Proof Fidelity"
            value="100%"
            hint="Anti-sybil verified"
            tone="success"
          />
        </div>

        {/* Filter Row */}
        <div
          role="navigation"
          aria-label="Filter leaderboard by track"
          className="flex flex-wrap items-center gap-2"
        >
          <FilterChip asChild selected={!selectedTrack} tone="accent">
            <Link href="/leaderboard">All</Link>
          </FilterChip>
          {TRACKS.map((t) => {
            const meta = TRACK_META[t];
            const isSelected = selectedTrack === t;
            return (
              <FilterChip key={t} asChild selected={isSelected} tone={t}>
                <Link href={`/leaderboard?track=${t}`}>{meta.label}</Link>
              </FilterChip>
            );
          })}
        </div>

        <LeaderboardInteractive
          entries={leaderboard}
          selectedTrackLabel={selectedTrack ? trackLabel : undefined}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
