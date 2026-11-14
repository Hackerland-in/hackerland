import type { Metadata } from 'next';
import Link from 'next/link';
import { TRACKS, TRACK_META, parseEnum } from '@hackerland/core';
import { Button, EmptyState, FilterChip, SectionHeader } from '@hackerland/ui';
import { listProjects } from '@/lib/data/queries';
import { ProjectCard } from '@/components/domain/project-card';

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
