'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, Crown, Medal, Search, ShieldCheck, Trophy, UserCheck, UserPlus } from 'lucide-react';
import { TRACK_META } from '@hackerland/core';
import { Badge, Button, Card, EmptyState, cn } from '@hackerland/ui';
import type { LeaderboardEntry } from '@/lib/data/types';
import { PersonChip } from '@/components/domain/person-chip';
import { useSocialCommunity } from './social-context';

export interface LeaderboardInteractiveProps {
  entries: LeaderboardEntry[];
  selectedTrackLabel?: string;
}

export function LeaderboardInteractive({
  entries,
  selectedTrackLabel,
}: LeaderboardInteractiveProps) {
  const { isFollowing, toggleFollow } = useSocialCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [followingOnly, setFollowingOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'reputation' | 'projects' | 'contributions'>('reputation');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entries
      .filter((entry) => {
        if (followingOnly && !isFollowing(entry.handle)) return false;
        if (
          q &&
          !entry.name.toLowerCase().includes(q) &&
          !entry.handle.toLowerCase().includes(q) &&
          !(entry.headline || '').toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'projects') return (b.projectsCount ?? 0) - (a.projectsCount ?? 0);
        if (sortBy === 'contributions') {
          return (b.contributionsCount ?? 0) - (a.contributionsCount ?? 0);
        }
        return a.rank - b.rank;
      });
  }, [entries, searchQuery, followingOnly, sortBy, isFollowing]);

  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];

  const renderPodiumCard = (
    person: LeaderboardEntry,
    tier: 'gold' | 'silver' | 'bronze',
  ) => {
    const following = isFollowing(person.handle);
    const tierStyles =
      tier === 'gold'
        ? {
            card: 'border-warning/50 bg-gradient-to-br from-surface-1 via-surface-1 to-warning/10 shadow-xs',
            badge: 'border-warning/40 bg-warning/10 text-warning-fg',
            icon: <Crown className="size-3.5 text-warning" aria-hidden="true" />,
            label: 'Rank #1 · Gold',
            scoreClass: 'text-warning-fg',
          }
        : tier === 'silver'
        ? {
            card: 'border-hairline bg-surface-1 shadow-xs',
            badge: 'border-hairline bg-surface-2 text-fg-muted',
            icon: <Medal className="size-3.5 text-fg-muted" aria-hidden="true" />,
            label: 'Rank #2 · Silver',
            scoreClass: 'text-fg',
          }
        : {
            card: 'border-make/30 bg-gradient-to-br from-surface-1 via-surface-1 to-make/8 shadow-xs',
            badge: 'border-make/30 bg-make/10 text-make-fg',
            icon: <Award className="size-3.5 text-make-fg" aria-hidden="true" />,
            label: 'Rank #3 · Bronze',
            scoreClass: 'text-make-fg',
          };

    return (
      <Card className={cn('relative flex flex-col justify-between p-5 min-w-0', tierStyles.card)}>
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-hairline pb-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wide',
                tierStyles.badge,
              )}
            >
              {tierStyles.icon}
              <span>{tierStyles.label}</span>
            </span>
            <span className="font-mono text-[11px] font-medium text-fg-subtle">
              {person.tracks[0] ? TRACK_META[person.tracks[0]]?.label : 'Innovator'}
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-2">
            <PersonChip person={person} size="lg" showBadges={false} />
          </div>

          {person.headline && (
            <p className="mt-2 text-body-xs text-fg-muted line-clamp-2">{person.headline}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {person.tracks.map((t) => (
              <Badge key={t} tone={t}>
                {TRACK_META[t]?.label || t}
              </Badge>
            ))}
            {person.badges.slice(0, 2).map((b, i) => (
              <Badge key={i} tone={b.tone}>
                {b.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-hairline pt-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono text-fg-subtle uppercase block">Karma Score</span>
            <div className="flex items-baseline gap-1">
              <span className={cn('font-display text-headline-md font-bold tabular-nums', tierStyles.scoreClass)}>
                {person.reputation.toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-fg-subtle">PTS</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleFollow(person.handle)}
              aria-pressed={following}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-display font-semibold transition-all border',
                following
                  ? 'border-hairline bg-surface-2 text-fg-muted'
                  : 'border-accent bg-accent text-on-solid hover:bg-accent-strong',
              )}
            >
              {following ? (
                <>
                  <UserCheck className="size-3.5" aria-hidden="true" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" aria-hidden="true" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Top 3 Podium Cards */}
      {entries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-warning" aria-hidden="true" />
            <h2 className="font-display text-headline-sm font-semibold text-fg">
              {selectedTrackLabel ? `Top ${selectedTrackLabel} Innovators` : 'Podium Champions'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {top1 && renderPodiumCard(top1, 'gold')}
            {top2 && renderPodiumCard(top2, 'silver')}
            {top3 && renderPodiumCard(top3, 'bronze')}
          </div>
        </div>
      )}

      {/* Search, Following Toggle & Sort Controls */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFollowingOnly(false)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-body-xs font-display font-semibold transition-all',
              !followingOnly
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            All Builders ({entries.length})
          </button>
          <button
            type="button"
            onClick={() => setFollowingOnly(true)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-body-xs font-display font-semibold transition-all',
              followingOnly
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            Following Only
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            aria-label="Sort leaderboard"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'reputation' | 'projects' | 'contributions')
            }
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-display font-semibold text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
          >
            <option value="reputation">Sort: Reputation Karma</option>
            <option value="projects">Sort: Shipped Projects</option>
            <option value="contributions">Sort: Contributions</option>
          </select>

          <div className="relative w-full sm:w-52">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" aria-hidden="true" />
            <input
              type="search"
              placeholder="Find maker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Proof-of-Ship Ledger */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface-1 shadow-xs">
          <div className="border-b border-hairline px-4 py-3.5 sm:px-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
              <h2 className="font-display text-headline-sm font-semibold text-fg">
                Proof-of-Ship Ledger
              </h2>
            </div>
            <span className="text-body-xs font-mono text-fg-subtle">
              {filtered.length} Ranked {filtered.length === 1 ? 'Innovator' : 'Innovators'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Proof-of-Ship Leaderboard">
              <thead>
                <tr className="border-b border-hairline text-label-sm font-display text-fg-muted uppercase tracking-wider bg-surface-2/50">
                  <th scope="col" className="px-4 py-3">Rank</th>
                  <th scope="col" className="px-4 py-3">Innovator</th>
                  <th scope="col" className="px-4 py-3 hidden sm:table-cell">Track</th>
                  <th scope="col" className="px-4 py-3 text-right">Shipped</th>
                  <th scope="col" className="px-4 py-3 text-right">Karma</th>
                  <th scope="col" className="px-4 py-3 text-right">Follow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-body-sm">
                {filtered.map((entry) => {
                  const following = isFollowing(entry.handle);
                  return (
                    <tr key={entry.handle} className="hover:bg-surface-2/40 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center font-mono font-bold text-[12px] rounded-full px-2.5 py-0.5',
                            entry.rank === 1
                              ? 'border border-warning/40 bg-warning/10 text-warning-fg'
                              : entry.rank === 2
                              ? 'border border-hairline bg-surface-2 text-fg-muted'
                              : entry.rank === 3
                              ? 'border border-make/30 bg-make/10 text-make-fg'
                              : 'text-fg-subtle',
                          )}
                        >
                          #{entry.rank}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <PersonChip person={entry} size="sm" showBadges={false} />
                          {entry.headline && (
                            <span className="text-body-xs text-fg-muted line-clamp-1 max-w-xs">
                              {entry.headline}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <div className="flex flex-wrap items-center gap-1">
                          {entry.tracks.slice(0, 2).map((t) => (
                            <Badge key={t} tone={t}>
                              {TRACK_META[t]?.label || t}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono text-body-xs text-fg-muted">
                        <div>{entry.projectsCount || 0} builds</div>
                        <div className="text-[11px] text-fg-subtle">
                          {entry.contributionsCount || 0} PRs
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <span className="font-display font-bold text-body-md text-accent-fg tabular-nums">
                          {entry.reputation.toLocaleString()}
                        </span>
                        <span className="font-mono text-[10px] text-fg-subtle ml-1">PTS</span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleFollow(entry.handle)}
                          aria-label={following ? `Unfollow ${entry.name}` : `Follow ${entry.name}`}
                          aria-pressed={following}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-display font-semibold transition-all border',
                            following
                              ? 'border-hairline bg-surface-2 text-fg-muted'
                              : 'border-accent/30 bg-accent-soft text-accent-fg hover:bg-accent hover:text-on-solid',
                          )}
                        >
                          {following ? 'Following' : 'Follow'}
                        </button>
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
          title="No matching innovators"
          description="Try clearing your search or switching back to All Builders."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFollowingOnly(false);
              }}
            >
              Reset filters
            </Button>
          }
        />
      )}
    </div>
  );
}
