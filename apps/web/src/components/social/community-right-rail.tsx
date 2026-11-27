'use client';

import Link from 'next/link';
import { Avatar, Badge, Button, Panel, cn } from '@hackerland/ui';
import { formatMoney } from '@hackerland/core';
import { ArrowRight, Flame, Trophy, UserCheck, UserPlus, Sparkles } from 'lucide-react';
import type { OpportunityView, PersonRef, PlatformStats, ProjectSummary } from '@/lib/data/types';
import { useSocialCommunity } from './social-context';

export interface CommunityRightRailProps {
  suggestedMakers: PersonRef[];
  trendingProjects: ProjectSummary[];
  openBounties: OpportunityView[];
  stats: PlatformStats;
}

export function CommunityRightRail({
  suggestedMakers,
  trendingProjects,
  openBounties,
  stats,
}: CommunityRightRailProps) {
  const { isFollowing, toggleFollow } = useSocialCommunity();

  return (
    <div className="space-y-5 min-w-0">
      {/* Community Snapshot */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-accent text-on-solid">
            <Sparkles className="size-3.5" aria-hidden="true" />
          </span>
          <span className="font-display font-bold text-body-md text-fg">Hackerland Square</span>
        </div>
        <p className="text-body-sm text-fg-muted leading-snug">
          Join {stats.members.toLocaleString()} students, hardware engineers &amp; designers building open projects together.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-center">
          <div className="rounded-xl bg-surface-1/90 border border-hairline p-2">
            <div className="font-display text-headline-sm font-bold text-accent-fg tabular-nums">
              {stats.projects}
            </div>
            <div className="text-[11px] text-fg-subtle">Active Builds</div>
          </div>
          <div className="rounded-xl bg-surface-1/90 border border-hairline p-2">
            <div className="font-display text-headline-sm font-bold text-earn-fg tabular-nums">
              {formatMoney(stats.rewardsPool.amount, stats.rewardsPool.currency)}
            </div>
            <div className="text-[11px] text-fg-subtle">Bounty Pool</div>
          </div>
        </div>
      </div>

      {/* Who to Follow */}
      <Panel
        title="Makers to follow"
        headingLevel={3}
        action={
          <Link href="/u" className="text-[12px] font-display font-semibold text-accent-fg hover:underline">
            See all
          </Link>
        }
      >
        <div className="space-y-3">
          {suggestedMakers.map((person) => {
            const following = isFollowing(person.handle);
            return (
              <div key={person.handle} className="flex items-center justify-between gap-2.5 min-w-0">
                <Link
                  href={`/u/${person.handle}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1 group"
                >
                  <Avatar name={person.name} src={person.avatarUrl} size="sm" />
                  <div className="min-w-0">
                    <div className="font-display text-body-sm font-semibold text-fg truncate group-hover:text-accent-fg">
                      {person.name}
                    </div>
                    <div className="text-[12px] text-fg-subtle truncate">
                      {person.headline || `@${person.handle}`}
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFollow(person.handle)}
                  aria-pressed={following}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-display font-semibold transition-all border',
                    following
                      ? 'border-hairline bg-surface-2 text-fg-muted'
                      : 'border-accent bg-accent text-on-solid hover:bg-accent-strong',
                  )}
                >
                  {following ? (
                    <>
                      <UserCheck className="size-3" aria-hidden="true" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-3" aria-hidden="true" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Trending Builds */}
      {trendingProjects.length > 0 && (
        <Panel
          title="Trending builds"
          headingLevel={3}
          icon={<Flame className="size-4 text-accent" aria-hidden="true" />}
          action={
            <Link href="/projects" className="text-[12px] font-display font-semibold text-accent-fg hover:underline">
              Explore
            </Link>
          }
        >
          <div className="space-y-3">
            {trendingProjects.map((proj) => (
              <Link
                key={proj.slug}
                href={`/projects/${proj.slug}`}
                className="block rounded-xl border border-hairline bg-surface-2/50 p-3 hover:border-accent/35 hover:bg-surface-1 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-display text-body-sm font-semibold text-fg group-hover:text-accent-fg truncate">
                    {proj.title}
                  </span>
                  {proj.openRoleCount > 0 && (
                    <Badge tone="accent" variant="outline">
                      {proj.openRoleCount} open
                    </Badge>
                  )}
                </div>
                <p className="text-[12px] text-fg-muted line-clamp-2">{proj.summary}</p>
              </Link>
            ))}
          </div>
        </Panel>
      )}

      {/* Open Bounties */}
      {openBounties.length > 0 && (
        <Panel
          title="Live bounties"
          headingLevel={3}
          icon={<Trophy className="size-4 text-earn" aria-hidden="true" />}
          action={
            <Link href="/earn" className="text-[12px] font-display font-semibold text-accent-fg hover:underline">
              All
            </Link>
          }
        >
          <div className="space-y-2.5">
            {openBounties.map((bounty) => (
              <Link
                key={bounty.id}
                href={bounty.projectSlug ? `/projects/${bounty.projectSlug}` : '/earn'}
                className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2/50 p-3 hover:border-earn/40 hover:bg-surface-1 transition-all group"
              >
                <div className="min-w-0">
                  <div className="font-display text-body-sm font-semibold text-fg truncate group-hover:text-accent-fg">
                    {bounty.title}
                  </div>
                  <div className="text-[11px] text-fg-subtle truncate">{bounty.sponsor.name}</div>
                </div>
                <span className="shrink-0 rounded-full bg-earn/10 px-2.5 py-1 font-display text-[12px] font-bold text-earn-fg tabular-nums">
                  {formatMoney(bounty.reward.amount, bounty.reward.currency)}
                </span>
              </Link>
            ))}
          </div>

          <Button asChild variant="soft" size="sm" className="w-full mt-3">
            <Link href="/earn">
              <span>Browse bounties &amp; sprints</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </Panel>
      )}

      {/* Pan-India Funding, Prototyping & Export Shortcuts */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-2.5 shadow-xs">
        <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-accent-fg">
          Zero-to-Export Toolkit
        </div>
        <div className="space-y-1.5 text-body-xs">
          <Link
            href="/resources"
            className="flex items-center justify-between rounded-xl bg-sunken px-3 py-2 font-medium text-fg hover:text-accent-fg transition-colors"
          >
            <span>Funding, ATLs &amp; Free Resources</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/sectors"
            className="flex items-center justify-between rounded-xl bg-sunken px-3 py-2 font-medium text-fg hover:text-accent-fg transition-colors"
          >
            <span>All 10 India Sector Pathways</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/export"
            className="flex items-center justify-between rounded-xl bg-sunken px-3 py-2 font-medium text-fg hover:text-accent-fg transition-colors"
          >
            <span>Global Export &amp; OEM Hub</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
