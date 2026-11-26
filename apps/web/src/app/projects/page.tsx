import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderKanban, Plus, Users } from 'lucide-react';
import { TRACKS, parseEnum } from '@hackerland/core';
import { Button } from '@hackerland/ui';
import {
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { ProjectCatalog } from '@/components/social/project-catalog';
import { CommunityRightRail } from '@/components/social/community-right-rail';

export const metadata: Metadata = {
  title: 'Builds & Projects',
  description:
    'Discover open-source hardware, robotics, software, and research builds looking for squad collaborators.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; q?: string }>;
}) {
  const { track, q } = await searchParams;
  const selectedTrack = parseEnum(TRACKS, track);

  const [projects, opportunities, stats] = await Promise.all([
    listProjects(),
    listOpportunities('bounty'),
    getPlatformStats(),
  ]);

  return (
    <SocialCommunityProvider>
      <SocialShell
        rightRail={
          <CommunityRightRail
            suggestedMakers={ALL_PEOPLE.slice(0, 4)}
            trendingProjects={projects.slice(0, 3)}
            openBounties={opportunities.slice(0, 3)}
            stats={stats}
          />
        }
      >
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <FolderKanban className="size-3.5" aria-hidden="true" />
              <span>Builds &amp; Squads</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Open builds looking for teammates
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
              Join a maker squad, contribute PRs or schematics, track milestones, or launch your own idea.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button asChild variant="primary" size="sm">
              <Link href="/new">
                <Plus className="size-3.5" aria-hidden="true" />
                <span>Start build</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/squads">
                <Users className="size-3.5" aria-hidden="true" />
                <span>Squad rooms</span>
              </Link>
            </Button>
          </div>
        </header>

        <ProjectCatalog
          initialProjects={projects}
          initialTrack={selectedTrack}
          initialQuery={q ?? ''}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
