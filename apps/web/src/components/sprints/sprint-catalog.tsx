'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bookmark, CheckCircle2, Clock, Search, Trophy, Users, Zap } from 'lucide-react';
import type { SprintEntry, SprintTrack, SprintStatus } from '@hackerland/core';
import { filterSprints } from '@hackerland/core';
import { Badge, Card, CardBody, FilterChip, StatTile, cn } from '@hackerland/ui';
import { useSocialCommunity } from '@/components/social/social-context';
import type { SprintStateRecord } from '@/lib/data/community-workflows-store';

interface SprintCatalogProps {
  initialSprints: SprintEntry[];
}

const TRACK_LABELS: Record<SprintTrack | 'all', string> = {
  all: 'All Tracks',
  robotics_uav: 'Robotics & UAVs',
  ev_powertrain: 'EV & Powertrain',
  edge_ai_silicon: 'Edge AI & Silicon',
  medtech_diagnostics: 'MedTech Diagnostics',
  defence_aerospace: 'Defence & Aerospace',
  clean_energy: 'Clean Energy & GaN',
};

const STATUS_LABELS: Record<SprintStatus | 'all', string> = {
  all: 'All Statuses',
  active: 'Live Now',
  upcoming: 'Upcoming',
  in_review: 'In Review',
  completed: 'Completed',
};

export function SprintCatalog({ initialSprints }: SprintCatalogProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'saved' | 'joined'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sprintStates, setSprintStates] = useState<Record<string, SprintStateRecord>>({});
  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  useEffect(() => {
    const next: Record<string, SprintStateRecord> = {};
    for (const s of initialSprints) {
      try {
        const raw = localStorage.getItem(`hackerland_sprint_${s.slug}`);
        if (raw) {
          next[s.slug] = JSON.parse(raw) as SprintStateRecord;
        }
      } catch {}
    }
    setSprintStates(next);
  }, [initialSprints]);

  const savedCount = initialSprints.filter((s) => isItemSaved(`sprint:${s.slug}`)).length;
  const joinedCount = initialSprints.filter((s) => sprintStates[s.slug]?.registered).length;

  const filtered = useMemo(() => {
    const base = filterSprints(initialSprints, {
      track: selectedTrack,
      status: selectedStatus,
      search: searchQuery,
    });
    return base.filter((s) => {
      if (viewMode === 'saved') return isItemSaved(`sprint:${s.slug}`);
      if (viewMode === 'joined') return Boolean(sprintStates[s.slug]?.registered);
      return true;
    });
  }, [initialSprints, selectedTrack, selectedStatus, searchQuery, viewMode, isItemSaved, sprintStates]);

  const totalPrizePool = useMemo(() => {
    return initialSprints.reduce((sum, s) => sum + s.totalPrizePoolINR, 0);
  }, [initialSprints]);

  const totalTeams = useMemo(() => {
    return initialSprints.reduce(
      (sum, s) => sum + s.registeredTeamsCount + (sprintStates[s.slug]?.registeredCountDelta ?? 0),
      0,
    );
  }, [initialSprints, sprintStates]);

  return (
    <div className="space-y-6 min-w-0">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 min-w-0">
        <StatTile
          label="Total Prize Escrow"
          value={`₹${(totalPrizePool / 100000).toFixed(1)} Lakhs`}
          hint="100% Non-Dilutive Grants"
          tone="earn"
          icon={<Trophy aria-hidden="true" />}
        />
        <StatTile
          label="Rapid Sprints"
          value={initialSprints.length}
          hint="48H Time-Boxed Builds"
          tone="accent"
          icon={<Zap aria-hidden="true" />}
        />
        <StatTile
          label="Squads Building"
          value={totalTeams}
          hint="Vetted Hardware Engineers"
          tone="code"
          icon={<Users aria-hidden="true" />}
        />
        <StatTile
          label="Sponsors & Partners"
          value="CSIR / ARAI / IISc"
          hint="Premier Indian R&D Hubs"
          tone="make"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-hairline">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'joined', 'saved'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-body-xs font-display font-semibold transition-all',
                  viewMode === mode
                    ? 'bg-accent text-on-solid shadow-xs'
                    : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                )}
              >
                {mode === 'all'
                  ? `All Sprints (${initialSprints.length})`
                  : mode === 'joined'
                  ? `Joined (${joinedCount})`
                  : `Saved (${savedCount})`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search sprints, sponsors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-9 pr-3.5 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'active', 'upcoming', 'completed'] as const).map((status) => (
              <FilterChip
                key={status}
                selected={selectedStatus === status}
                tone="accent"
                onClick={() => setSelectedStatus(status)}
              >
                {STATUS_LABELS[status]}
              </FilterChip>
            ))}
          </div>

          <select
            aria-label="Filter sprint track"
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="h-9 rounded-full border border-line bg-sunken px-3.5 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
          >
            {Object.entries(TRACK_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sprints Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-1 p-10 text-center space-y-1.5">
          <p className="font-display text-headline-sm font-semibold text-fg">
            No sprints match your criteria
          </p>
          <p className="text-body-sm text-fg-muted">
            Try resetting your filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {filtered.map((sprint) => {
            const trackLabel = TRACK_LABELS[sprint.track] || sprint.track;
            const prizeInLakhs = (sprint.totalPrizePoolINR / 100000).toFixed(1);
            const saved = isItemSaved(`sprint:${sprint.slug}`);
            const localState = sprintStates[sprint.slug];
            const isRegistered = Boolean(localState?.registered);
            const checkinsCount = localState?.checkins?.length ?? 0;
            const statusTone =
              sprint.currentStatus === 'active'
                ? 'success'
                : sprint.currentStatus === 'upcoming'
                ? 'warning'
                : 'neutral';

            return (
              <Card
                key={sprint.id}
                className="flex flex-col justify-between min-w-0 [overflow-wrap:anywhere] transition-all hover:border-accent/40"
              >
                <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <Badge tone="make" variant="outline">
                          {trackLabel}
                        </Badge>
                        <Badge
                          tone={statusTone}
                          variant={sprint.currentStatus === 'active' ? 'solid' : 'outline'}
                        >
                          {sprint.currentStatus}
                        </Badge>
                        {isRegistered && (
                          <Badge tone="accent" variant="solid">
                            <CheckCircle2 className="size-3" aria-hidden="true" />
                            <span>Joined</span>
                          </Badge>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSaveItem(`sprint:${sprint.slug}`)}
                        aria-label={saved ? `Unsave ${sprint.title}` : `Save ${sprint.title}`}
                        aria-pressed={saved}
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                          saved
                            ? 'border-accent/40 bg-accent-soft text-accent-fg'
                            : 'border-hairline bg-surface-2/60 text-fg-subtle hover:border-accent/30 hover:text-accent-fg',
                        )}
                      >
                        <Bookmark className={cn('size-3.5', saved && 'fill-current')} aria-hidden="true" />
                      </button>
                    </div>

                    <Link
                      href={`/sprints/${sprint.slug}`}
                      className="block group space-y-1.5"
                    >
                      <h3 className="font-display text-headline-sm font-bold text-fg group-hover:text-accent-fg transition-colors line-clamp-2 [overflow-wrap:anywhere]">
                        {sprint.title}
                      </h3>
                      <p className="text-body-sm text-fg-muted line-clamp-2 leading-relaxed">
                        {sprint.tagline}
                      </p>
                    </Link>

                    <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-hairline bg-sunken/70 p-3">
                      <div>
                        <span className="font-display text-[11px] uppercase tracking-wider text-fg-subtle block">
                          Prize Pool
                        </span>
                        <span className="font-display text-body-md font-bold text-earn-fg tabular-nums">
                          ₹{prizeInLakhs} Lakhs
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-[11px] uppercase tracking-wider text-fg-subtle block">
                          Duration
                        </span>
                        <span className="inline-flex items-center gap-1 font-display text-body-md font-semibold text-fg tabular-nums">
                          <Clock className="size-3.5 text-accent" aria-hidden="true" />
                          <span>{sprint.durationHours} Hours</span>
                        </span>
                      </div>
                    </div>

                    {/* Hardware Perks pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {sprint.hardwarePerks.slice(0, 2).map((perk, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent-fg line-clamp-1"
                        >
                          ⚡ {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2 text-body-xs">
                    <span className="text-fg-subtle truncate">
                      by <strong className="font-medium text-fg">{sprint.sponsor.name}</strong>
                      {checkinsCount > 0 ? ` · ${checkinsCount} check-ins` : ''}
                    </span>
                    <Link
                      href={`/sprints/${sprint.slug}`}
                      className="shrink-0 inline-flex items-center gap-1.5 font-display font-semibold text-accent-fg hover:underline tabular-nums"
                    >
                      <span>
                        {sprint.registeredTeamsCount + (localState?.registeredCountDelta ?? 0)}/{sprint.maxTeams} Squads
                      </span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
