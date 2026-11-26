import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Settings, Users } from 'lucide-react';
import { Button } from '@hackerland/ui';
import {
  getPlatformStats,
  listAllStoredProfiles,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import type { Track } from '@hackerland/core';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { MakerDirectory } from '@/components/social/maker-directory';
import { CommunityRightRail } from '@/components/social/community-right-rail';

export const metadata: Metadata = {
  title: 'Makers & Builders Directory',
  description:
    'Discover and follow makers, hardware engineers, researchers, students, and designers building in public on Hackerland.',
};

interface InnovatorsPageProps {
  searchParams: Promise<{
    q?: string;
    track?: string;
  }>;
}

export default async function InnovatorsDirectoryPage({ searchParams }: InnovatorsPageProps) {
  const { q, track } = await searchParams;
  const rawQuery = (q || '').trim();
  const activeTrack = track as Track | undefined;

  const [allProfiles, projects, opportunities, stats] = await Promise.all([
    Promise.resolve(listAllStoredProfiles()),
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
              <Users className="size-3.5" aria-hidden="true" />
              <span>Community Directory</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Makers &amp; Builders
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
              Follow engineers, designers, robotics hackers, and mentors shipping open projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button asChild variant="primary" size="sm">
              <Link href="/settings">
                <Settings className="size-3.5" aria-hidden="true" />
                <span>Edit Profile</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/leaderboard">
                <Award className="size-3.5 text-earn-fg" aria-hidden="true" />
                <span>Leaderboard</span>
              </Link>
            </Button>
          </div>
        </header>

        <MakerDirectory
          initialProfiles={allProfiles}
          initialQuery={rawQuery}
          initialTrack={activeTrack}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
