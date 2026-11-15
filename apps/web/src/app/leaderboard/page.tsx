import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TRACKS,
  TRACK_META,
  parseEnum,
} from '@hackerland/core';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FilterChip,
  SectionHeader,
  StatTile,
} from '@hackerland/ui';
import {
  Award,
  Crown,
  Medal,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { getLeaderboard } from '@/lib/data/queries';
import { PersonChip } from '@/components/domain/person-chip';

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
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="PROOF-OF-SHIP REPUTATION"
        title="Innovator Leaderboard"
        description="Cryptographic, append-only karma earned through verified prototype fabrication, merged pull requests, peer reviews, and hardware-in-the-loop milestones."
        action={
          <Button asChild variant="secondary">
            <Link href="/feed">View Ship Activity</Link>
          </Button>
        }
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Total Karma Pool"
          value={totalKarma.toLocaleString()}
          hint="Append-only ledger"
        />
        <StatTile
          label="Ranked Innovators"
          value={totalInnovators.toString()}
          hint={selectedTrack ? `${trackLabel} discipline` : 'All 6 tracks'}
        />
        <StatTile
          label="Top Reputation"
          value={top1 ? top1.reputation.toLocaleString() : '0'}
          hint={top1 ? top1.name : 'No ranks yet'}
        />
        <StatTile
          label="Proof Fidelity"
          value="100%"
          hint="Anti-sybil verified"
        />
      </div>

      {/* Filter Row */}
      <div
        role="navigation"
        aria-label="Filter leaderboard by track"
        className="flex max-w-full items-center gap-2 overflow-x-auto pb-2"
      >
        <FilterChip asChild selected={!selectedTrack}>
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

      {/* Top 3 Podium Cards */}
      {leaderboard.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" aria-hidden="true" />
            <h2 className="font-display text-headline-sm font-semibold text-fg">
              {selectedTrack ? `Top ${trackLabel} Innovators` : 'Podium Champions'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
            {/* Rank #1: Gold */}
            {top1 && (
              <Card
                className="relative flex flex-col justify-between border-warning/60 bg-gradient-to-b from-surface-2 to-surface-1 shadow-[0_0_24px_rgba(255,214,0,0.12)] min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-warning/20 pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 text-label-xs font-mono font-bold text-warning-fg uppercase tracking-wide">
                      <Crown className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                      Rank #1 · Gold
                    </span>
                    <span className="font-mono text-label-xs font-medium text-fg-muted">
                      {top1.tracks[0] ? TRACK_META[top1.tracks[0]]?.label : 'Innovator'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <PersonChip person={top1} size="lg" showBadges={false} />
                  </div>

                  {top1.headline && (
                    <p className="mt-2 text-body-xs text-fg-muted line-clamp-2">
                      {top1.headline}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {top1.tracks.map((t) => (
                      <Badge key={t} tone={t}>
                        {TRACK_META[t]?.label || t}
                      </Badge>
                    ))}
                    {top1.badges.map((b, i) => (
                      <Badge key={i} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-hairline pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-label-xs font-mono text-fg-subtle uppercase">Karma Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-headline-md font-bold text-warning">
                        {top1.reputation.toLocaleString()}
                      </span>
                      <span className="font-mono text-label-xs text-warning-fg">PTS</span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/u/${top1.handle}`}>View Profile</Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Rank #2: Silver */}
            {top2 && (
              <Card
                className="relative flex flex-col justify-between border-hairline bg-surface-1 hover:border-line transition-colors min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-hairline pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-2.5 py-0.5 text-label-xs font-mono font-bold text-fg-muted uppercase tracking-wide">
                      <Medal className="h-3.5 w-3.5 text-fg-muted" aria-hidden="true" />
                      Rank #2 · Silver
                    </span>
                    <span className="font-mono text-label-xs font-medium text-fg-muted">
                      {top2.tracks[0] ? TRACK_META[top2.tracks[0]]?.label : 'Innovator'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <PersonChip person={top2} size="lg" showBadges={false} />
                  </div>

                  {top2.headline && (
                    <p className="mt-2 text-body-xs text-fg-muted line-clamp-2">
                      {top2.headline}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {top2.tracks.map((t) => (
                      <Badge key={t} tone={t}>
                        {TRACK_META[t]?.label || t}
                      </Badge>
                    ))}
                    {top2.badges.map((b, i) => (
                      <Badge key={i} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-hairline pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-label-xs font-mono text-fg-subtle uppercase">Karma Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-headline-md font-bold text-fg">
                        {top2.reputation.toLocaleString()}
                      </span>
                      <span className="font-mono text-label-xs text-fg-muted">PTS</span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/u/${top2.handle}`}>View Profile</Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Rank #3: Bronze */}
            {top3 && (
              <Card
                className="relative flex flex-col justify-between border-hairline bg-surface-1 hover:border-make/40 transition-colors min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-hairline pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-make/30 bg-make/10 px-2.5 py-0.5 text-label-xs font-mono font-bold text-make-fg uppercase tracking-wide">
                      <Award className="h-3.5 w-3.5 text-make-fg" aria-hidden="true" />
                      Rank #3 · Bronze
                    </span>
                    <span className="font-mono text-label-xs font-medium text-fg-muted">
                      {top3.tracks[0] ? TRACK_META[top3.tracks[0]]?.label : 'Innovator'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <PersonChip person={top3} size="lg" showBadges={false} />
                  </div>

                  {top3.headline && (
                    <p className="mt-2 text-body-xs text-fg-muted line-clamp-2">
                      {top3.headline}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {top3.tracks.map((t) => (
                      <Badge key={t} tone={t}>
                        {TRACK_META[t]?.label || t}
                      </Badge>
                    ))}
                    {top3.badges.map((b, i) => (
                      <Badge key={i} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-hairline pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-label-xs font-mono text-fg-subtle uppercase">Karma Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-headline-md font-bold text-make-fg">
                        {top3.reputation.toLocaleString()}
                      </span>
                      <span className="font-mono text-label-xs text-make-fg">PTS</span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/u/${top3.handle}`}>View Profile</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Rank Table or Empty State */}
      {leaderboard.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-hairline bg-surface-1">
          <div className="border-b border-hairline px-4 py-3 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="font-display text-headline-sm font-semibold text-fg">
                Proof-of-Ship Ledger
              </h2>
            </div>
            <span className="text-label-sm font-mono text-fg-subtle">
              {leaderboard.length} Ranked {leaderboard.length === 1 ? 'Innovator' : 'Innovators'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Proof-of-Ship Leaderboard">
              <thead>
                <tr className="border-b border-hairline text-label-sm font-display text-fg-muted uppercase tracking-wider bg-surface-2/40">
                  <th scope="col" className="px-4 py-3 sm:px-6">Rank</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Innovator</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Discipline</th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 sm:px-6">Badges</th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 sm:px-6 text-right">Activity</th>
                  <th scope="col" className="px-4 py-3 sm:px-6 text-right">Reputation Karma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-body-sm">
                {leaderboard.map((entry) => {
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;

                  return (
                    <tr
                      key={entry.handle}
                      className="hover:bg-surface-2/50 transition-colors"
                    >
                      {/* Rank Column */}
                      <td className="px-4 py-3.5 sm:px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center font-mono font-bold text-label-sm rounded px-2 py-0.5 ${
                            isTop1
                              ? 'border border-warning/40 bg-warning/10 text-warning'
                              : isTop2
                              ? 'border border-hairline bg-surface-2 text-fg-muted'
                              : isTop3
                              ? 'border border-make/30 bg-make/10 text-make-fg'
                              : 'text-fg-subtle'
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>

                      {/* Innovator Column */}
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="flex flex-col gap-0.5">
                          <PersonChip person={entry} size="sm" showBadges={false} />
                          {entry.headline && (
                            <span className="text-body-xs text-fg-muted line-clamp-1 max-w-xs sm:max-w-md">
                              {entry.headline}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Disciplines / Tracks */}
                      <td className="px-4 py-3.5 sm:px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {entry.tracks.map((t) => (
                            <Badge key={t} tone={t}>
                              {TRACK_META[t]?.label || t}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Badges Column */}
                      <td className="hidden md:table-cell px-4 py-3.5 sm:px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {entry.badges.map((b, i) => (
                            <Badge key={i} tone={b.tone}>
                              {b.label}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Activity Column */}
                      <td className="hidden sm:table-cell px-4 py-3.5 sm:px-6 text-right whitespace-nowrap font-mono text-label-sm text-fg-muted">
                        <div>{entry.projectsCount || 0} projects</div>
                        <div className="text-label-xs text-fg-subtle">
                          {entry.contributionsCount || 0} contributions
                        </div>
                      </td>

                      {/* Karma Score */}
                      <td className="px-4 py-3.5 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-baseline gap-1">
                          <span
                            className={`font-mono font-bold text-body-md ${
                              isTop1
                                ? 'text-warning'
                                : isTop2
                                ? 'text-fg'
                                : isTop3
                                ? 'text-make-fg'
                                : 'text-accent-fg'
                            }`}
                          >
                            {entry.reputation.toLocaleString()}
                          </span>
                          <span className="font-mono text-label-xs text-fg-subtle">PTS</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title={selectedTrack ? `No ${trackLabel} innovators ranked yet` : 'No innovators ranked yet'}
          description={
            selectedTrack
              ? `Be the first to build and earn Proof-of-Ship reputation in the ${trackLabel} discipline.`
              : 'No innovators match your current filters. Clear your filters or explore open projects to earn karma.'
          }
          action={
            <Button asChild variant="primary">
              <Link href="/leaderboard">View All Innovators</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
