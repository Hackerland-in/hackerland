'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TRACKS, TRACK_META, type Track } from '@hackerland/core';
import { Button, EmptyState, FilterChip, SearchField } from '@hackerland/ui';
import { FolderKanban, Sparkles, ArrowRight } from 'lucide-react';
import type { ProjectSummary } from '@/lib/data/types';
import { ProjectCard } from '@/components/domain/project-card';
import { useSocialCommunity } from './social-context';

export interface ProjectCatalogProps {
  initialProjects: ProjectSummary[];
  initialTrack?: Track;
  initialQuery?: string;
}

const TRACK_HUB_PROMOTIONS: Record<
  string,
  {
    title: string;
    description: string;
    actionLabel: string;
    href: string;
  }
> = {
  earn: {
    title: 'Looking for funded bounties & grants?',
    description: 'Explore paid milestones, bug bounties, and hardware seed grants.',
    actionLabel: 'Browse Bounties',
    href: '/earn',
  },
  learn: {
    title: 'Want guided roadmaps before starting a build?',
    description: 'Follow peer-curated engineering roadmaps and founder guides.',
    actionLabel: 'Open Roadmaps',
    href: '/learn',
  },
  make: {
    title: 'Need PCB, SPICE, EV or 3D Physics simulators?',
    description: 'Launch interactive browser simulation tools in the Hardware Workbench.',
    actionLabel: 'Open Workbench',
    href: '/manufacturing',
  },
  research: {
    title: 'Looking for Makerspaces & ATL testbenches?',
    description: 'Find community fabrication facilities and HIL testbeds across India.',
    actionLabel: 'Explore Labs',
    href: '/labs',
  },
};

export function ProjectCatalog({
  initialProjects,
  initialTrack,
  initialQuery = '',
}: ProjectCatalogProps) {
  const { starredProjectSlugs } = useSocialCommunity();
  const [query, setQuery] = useState(initialQuery);
  const [selectedTrack, setSelectedTrack] = useState<Track | 'all' | 'recruiting' | 'liked'>(
    initialTrack ?? 'all',
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialProjects.filter((p) => {
      if (selectedTrack === 'recruiting' && p.openRoleCount === 0) return false;
      if (selectedTrack === 'liked' && !starredProjectSlugs.includes(p.slug)) return false;
      if (
        selectedTrack !== 'all' &&
        selectedTrack !== 'recruiting' &&
        selectedTrack !== 'liked' &&
        !p.tracks.includes(selectedTrack)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.tracks.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [initialProjects, query, selectedTrack, starredProjectSlugs]);

  const promo =
    selectedTrack !== 'all' && selectedTrack !== 'recruiting' && selectedTrack !== 'liked'
      ? TRACK_HUB_PROMOTIONS[selectedTrack]
      : undefined;

  return (
    <div className="space-y-5 min-w-0">
      {/* Search + Social Filter Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-4 shadow-xs">
        <SearchField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search open builds by title, hardware stack, or topic..."
          aria-label="Search builds and projects"
        />

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip selected={selectedTrack === 'all'} onClick={() => setSelectedTrack('all')}>
            All Builds ({initialProjects.length})
          </FilterChip>
          <FilterChip
            selected={selectedTrack === 'recruiting'}
            onClick={() => setSelectedTrack('recruiting')}
          >
            Recruiting Squads
          </FilterChip>
          <FilterChip
            selected={selectedTrack === 'liked'}
            onClick={() => setSelectedTrack('liked')}
          >
            Liked ({initialProjects.filter((p) => starredProjectSlugs.includes(p.slug)).length})
          </FilterChip>
          {TRACKS.map((t) => (
            <FilterChip
              key={t}
              selected={selectedTrack === t}
              tone={t}
              onClick={() => setSelectedTrack((cur) => (cur === t ? 'all' : t))}
            >
              {TRACK_META[t].label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Contextual Channel Tip */}
      {promo && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-accent-soft/70 border border-accent/20">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent shrink-0" aria-hidden="true" />
              <h2 className="text-body-sm font-display font-bold text-fg">{promo.title}</h2>
            </div>
            <p className="text-body-sm text-fg-muted">{promo.description}</p>
          </div>
          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href={promo.href}>
              <span>{promo.actionLabel}</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      )}

      {/* Grid or Empty */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban />}
          title="No builds match your filters"
          description="Try clearing your search or launch a brand-new open-source project."
          action={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSelectedTrack('all');
                }}
              >
                Clear filters
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/new">Start a build</Link>
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
