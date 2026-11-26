import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import {
  Badge,
  Button,
  EmptyState,
  FilterChip,
  Panel,
} from '@hackerland/ui';
import { TRACKS, TRACK_META, parseEnum, type Track } from '@hackerland/core';
import { listRoadmaps, listProjects } from '@/lib/data/queries';
import { RoadmapCard } from '@/components/domain/roadmap-card';
import { ProjectCard } from '@/components/domain/project-card';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <GraduationCap className="size-3.5" aria-hidden="true" />
            <span>Curated Open Curriculum</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            Learn by doing
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
            Master deep tech, hardware, and software through interactive checklists, peer squads, and shareable milestones.
          </p>
        </header>

        {/* Featured Founder Academy Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-hairline bg-surface-1 shadow-xs">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" variant="outline">Founder Academy</Badge>
              <Badge tone="earn" variant="solid">100% Free</Badge>
            </div>
            <h2 className="text-body-md font-display font-bold text-fg pt-0.5">
              Open-Source Entrepreneurship &amp; Startup Playbooks
            </h2>
            <p className="text-body-xs text-fg-muted">
              Complete playlists from Stanford CS183B, YC Startup School, MIT 15.390, plus Cap Table &amp; Unit Economics calculators.
            </p>
          </div>

          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href="/entrepreneurship">
              <span>Open Founder Academy</span>
              <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          <div className="space-y-8 min-w-0">
            {!selectedTrack && spotlightRoadmaps.length > 0 && (
              <section aria-label="Spotlight roadmaps" className="space-y-3.5">
                <h2 className="font-display text-headline-sm font-semibold text-fg">Spotlight roadmaps</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
                  {spotlightRoadmaps.map((roadmap) => (
                    <RoadmapCard key={`spotlight-${roadmap.slug}`} roadmap={roadmap} expanded={false} />
                  ))}
                </div>
              </section>
            )}

            <section aria-label="Curriculum syllabus" className="space-y-3.5">
              <h2 className="font-display text-headline-sm font-semibold text-fg">
                {selectedTrack
                  ? `${TRACK_META[selectedTrack]?.label} Roadmap`
                  : 'Featured Interactive Syllabus'}
              </h2>
              <RoadmapCard roadmap={featuredRoadmap} expanded={true} />
            </section>

            {filteredRoadmaps.length > 1 && (
              <section aria-label="Additional roadmaps" className="space-y-3.5">
                <h2 className="font-display text-headline-sm font-semibold text-fg">
                  More {selectedTrack ? TRACK_META[selectedTrack]?.label : ''} Roadmaps
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
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
            <Button asChild variant="soft" size="sm">
              <Link href="/projects">Explore all builds</Link>
            </Button>
          }
        >
          <p className="mb-4 text-body-sm text-fg-muted">
            Accelerate mastery by shipping open hardware, software, and research alongside an active squad.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
            {learningSquads.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Panel>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
