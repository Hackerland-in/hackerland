import type { Metadata } from 'next';
import Link from 'next/link';
import {
  EmptyState,
  FilterChip,
  Panel,
  SectionHeader,
  Button,
} from '@hackerland/ui';
import { TRACKS, TRACK_META, parseEnum, type Track } from '@hackerland/core';
import { listRoadmaps, listProjects } from '@/lib/data/queries';
import { RoadmapCard } from '@/components/domain/roadmap-card';
import { ProjectCard } from '@/components/domain/project-card';

export const metadata: Metadata = {
  title: 'Learn by Doing',
  description:
    'Curated, open-source skill roadmaps and active maker squads for hardware, software, and deep-tech innovation.',
};

interface LearnPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const resolvedParams = await searchParams;
  const trackParam = typeof resolvedParams.track === 'string' ? resolvedParams.track : undefined;
  const selectedTrack = parseEnum(TRACKS, trackParam);

  const [allRoadmaps, filteredRoadmaps, allProjects] = await Promise.all([
    listRoadmaps(),
    listRoadmaps(selectedTrack),
    listProjects(),
  ]);

  const spotlightRoadmaps = allRoadmaps.slice(0, 2);
  const learningSquads = allProjects.slice(0, 2);
  const featuredRoadmap = filteredRoadmaps[0];

  const filters: { label: string; value?: Track; href: string }[] = [
    { label: 'All', href: '/learn' },
    ...TRACKS.map((track) => ({
      label: TRACK_META[track]?.label ?? track,
      value: track,
      href: `/learn?track=${track}`,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="CURATED CURRICULUM"
        title="Learn by doing"
        description="Master deep tech, hardware, and software through structured open-source roadmaps and peer squads."
      />

      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const isSelected = filter.value ? selectedTrack === filter.value : !selectedTrack;
          return (
            <FilterChip
              key={filter.label}
              asChild
              selected={isSelected}
              tone={filter.value ?? 'accent'}
            >
              <Link href={filter.href}>{filter.label}</Link>
            </FilterChip>
          );
        })}
      </div>

      {!featuredRoadmap ? (
        <EmptyState
          title={`No ${selectedTrack ? TRACK_META[selectedTrack]?.label : ''} roadmaps yet`}
          description="Community-crafted roadmaps for this track are currently in review. Explore active tracks or propose a syllabus."
          action={
            <Button asChild variant="secondary">
              <Link href="/learn">View all roadmaps</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-10 min-w-0">
          {!selectedTrack && spotlightRoadmaps.length > 0 && (
            <section aria-label="Spotlight roadmaps" className="space-y-4">
              <h2 className="font-display text-headline-sm text-fg">Spotlight roadmaps</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 min-w-0">
                {spotlightRoadmaps.map((roadmap) => (
                  <RoadmapCard key={`spotlight-${roadmap.slug}`} roadmap={roadmap} expanded={false} />
                ))}
              </div>
            </section>
          )}

          <section aria-label="Curriculum syllabus" className="space-y-4">
            <h2 className="font-display text-headline-sm text-fg">
              {selectedTrack
                ? `${TRACK_META[selectedTrack]?.label} Roadmap`
                : 'Featured Syllabus'}
            </h2>
            <RoadmapCard roadmap={featuredRoadmap} expanded={true} />
          </section>

          {filteredRoadmaps.length > 1 && (
            <section aria-label="Additional roadmaps" className="space-y-4">
              <h2 className="font-display text-headline-sm text-fg">
                More {selectedTrack ? TRACK_META[selectedTrack]?.label : ''} Roadmaps
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 min-w-0">
                {filteredRoadmaps.slice(1).map((roadmap) => (
                  <RoadmapCard key={`more-${roadmap.slug}`} roadmap={roadmap} expanded={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <Panel
        title="Squads learning together"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">Explore all projects</Link>
          </Button>
        }
      >
        <p className="mb-4 text-body-sm text-fg-muted">
          Accelerate your mastery by building real open hardware, software, and research alongside an
          active squad.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 min-w-0">
          {learningSquads.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
