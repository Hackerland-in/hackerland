'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { SprintEntry, SprintTrack, SprintStatus } from '@hackerland/core';
import { filterSprints } from '@hackerland/core';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = useMemo(() => {
    return filterSprints(initialSprints, {
      track: selectedTrack,
      status: selectedStatus,
      search: searchQuery,
    });
  }, [initialSprints, selectedTrack, selectedStatus, searchQuery]);

  const totalPrizePool = useMemo(() => {
    return initialSprints.reduce((sum, s) => sum + s.totalPrizePoolINR, 0);
  }, [initialSprints]);

  const totalTeams = useMemo(() => {
    return initialSprints.reduce((sum, s) => sum + s.registeredTeamsCount, 0);
  }, [initialSprints]);

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Prize Escrow
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            ₹{(totalPrizePool / 100000).toFixed(1)} Lakhs
          </p>
          <span className="text-[11px] text-emerald-500 font-mono">100% Non-Dilutive Grants</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Rapid Sprints
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {initialSprints.length}
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">48H Time-Boxed Builds</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Squads Building
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {totalTeams}
          </p>
          <span className="text-[11px] text-primary font-mono">Vetted Hardware Engineers</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Sponsors & Partners
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            CSIR / ARAI / IISc
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">Premier Indian R&D Hubs</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Buttons */}
          {(['all', 'active', 'upcoming', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Track Filter Dropdown */}
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {Object.entries(TRACK_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="search"
            placeholder="Search sprints, sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-56"
          />
        </div>
      </div>

      {/* Sprints Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium text-foreground">No sprints match your criteria</p>
          <p className="text-xs text-muted-foreground mt-1">Try resetting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sprint) => {
            const trackLabel = TRACK_LABELS[sprint.track] || sprint.track;
            const prizeInLakhs = (sprint.totalPrizePoolINR / 100000).toFixed(1);

            return (
              <Link
                key={sprint.id}
                href={`/sprints/${sprint.slug}`}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {trackLabel}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        sprint.currentStatus === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : sprint.currentStatus === 'upcoming'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {sprint.currentStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {sprint.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {sprint.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Prize Pool
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        ₹{prizeInLakhs} Lakhs
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Duration
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {sprint.durationHours} Hours
                      </span>
                    </div>
                  </div>

                  {/* Hardware Perks pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {sprint.hardwarePerks.slice(0, 2).map((perk, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/10 line-clamp-1"
                      >
                        ⚡ {perk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono text-[11px] truncate max-w-[170px]">
                    by {sprint.sponsor.name}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground">
                    <span>{sprint.registeredTeamsCount}/{sprint.maxTeams} Squads</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
