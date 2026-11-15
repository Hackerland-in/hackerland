import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TRACKS, TRACK_META, parseEnum } from '@hackerland/core';
import { Button, EmptyState, FilterChip, SectionHeader } from '@hackerland/ui';
import { listProjects } from '@/lib/data/queries';
import { ProjectCard } from '@/components/domain/project-card';

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
    title: 'Looking for funded bounties, grants & paid roles?',
    description:
      'The Earn Platform features active reverse RFCs, bounties, and hardware seed grants.',
    actionLabel: 'Go to Earn Platform',
    href: '/earn',
  },
  learn: {
    title: 'Looking for structured skill roadmaps & entrepreneurship playbooks?',
    description:
      'Learn by Doing features full curriculum roadmaps and our Open Source Founder Academy.',
    actionLabel: 'Go to Learn Platform',
    href: '/learn',
  },
  make: {
    title: 'Looking for circuit simulators, physics engines & factory blueprints?',
    description:
      'The Manufacturing Suite features SPICE, HDL, and real-time vehicle multibody physics simulators.',
    actionLabel: 'Launch Manufacturing Suite',
    href: '/manufacturing',
  },
  research: {
    title: 'Looking for Atal Tinkering Labs (ATL) & university testbenches?',
    description:
      'Explore distributed hardware fabrication facilities and testbench nodes across India.',
    actionLabel: 'Explore Labs Directory',
    href: '/labs',
  },
};

export const metadata: Metadata = {
  title: 'Projects · Hackerland',
  description:
    'Explore open-source hardware, software, research, and design initiatives looking for squads.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const selectedTrack = parseEnum(TRACKS, track);
  const projects = await listProjects(selectedTrack);

  const trackLabel = selectedTrack ? TRACK_META[selectedTrack]?.label ?? selectedTrack : '';

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8">
      {/* Page Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="PROJECT DIRECTORY"
        title="Projects looking for squads"
        description="Discover open-source hardware, software, scientific research, and design initiatives. Join an active squad or start your own build in public."
        action={
          <Button asChild variant="primary">
            <Link href="/new">Start project</Link>
          </Button>
        }
      />

      {/* Filter Row */}
      <div
        role="navigation"
        aria-label="Filter by track"
        className="flex max-w-full items-center gap-2 overflow-x-auto pb-2"
      >
        <FilterChip asChild selected={!selectedTrack}>
          <Link href="/projects">All</Link>
        </FilterChip>
        {TRACKS.map((t) => {
          const meta = TRACK_META[t];
          const isSelected = selectedTrack === t;
          return (
            <FilterChip key={t} asChild selected={isSelected} tone={t}>
              <Link href={`/projects?track=${t}`}>{meta.label}</Link>
            </FilterChip>
          );
        })}
      </div>

      {/* Track Hub Context Banner */}
      {selectedTrack && TRACK_HUB_PROMOTIONS[selectedTrack] && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-1 border border-accent/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h3 className="text-body-sm font-display font-bold text-fg">
                {TRACK_HUB_PROMOTIONS[selectedTrack].title}
              </h3>
            </div>
            <p className="text-caption text-fg-muted">
              {TRACK_HUB_PROMOTIONS[selectedTrack].description}
            </p>
          </div>
          <Button asChild variant="primary" size="sm" className="shrink-0 gap-1.5 font-mono text-caption">
            <Link href={TRACK_HUB_PROMOTIONS[selectedTrack].href}>
              <span>{TRACK_HUB_PROMOTIONS[selectedTrack].actionLabel}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={selectedTrack ? `No ${trackLabel} projects yet` : 'No projects found'}
          description={
            selectedTrack
              ? `Be the first to start a ${trackLabel} project on Hackerland or explore open roles across other disciplines.`
              : 'No projects match your current filters. Check back soon or start a new project.'
          }
          action={
            <Button asChild variant="primary">
              <Link href="/new">Start project</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
