import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  ArrowRight,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { Avatar, Badge, Button, Card, CardBody, CardFooter, StatTile } from '@hackerland/ui';
import { listSquadRooms } from '@/lib/data/squads-data';
import {
  getPlatformStats,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRightRail } from '@/components/social/community-right-rail';

export const metadata: Metadata = {
  title: 'Squad Rooms & Milestone Escrows',
  description:
    'Join active hardware and software squads with transparent milestone escrows and contributor Kanban boards.',
};

export default async function SquadsDirectoryPage() {
  const squads = listSquadRooms();
  const [projects, bounties, stats] = await Promise.all([
    listProjects(),
    listOpportunities('bounty'),
    getPlatformStats(),
  ]);

  const totalEscrowInr = squads.reduce((acc, s) => acc + s.escrowPoolTotalInr, 0);
  const totalOpenRoles = squads.reduce(
    (acc, s) => acc + s.squadMembers.filter((m) => m.status === 'open').length,
    0,
  );
  const totalFilledMembers = squads.reduce(
    (acc, s) => acc + s.squadMembers.filter((m) => m.status === 'filled').length,
    0,
  );

  return (
    <SocialCommunityProvider>
      <SocialShell
        rightRail={
          <CommunityRightRail
            suggestedMakers={ALL_PEOPLE.slice(0, 4)}
            trendingProjects={projects.slice(0, 3)}
            openBounties={bounties.slice(0, 3)}
            stats={stats}
          />
        }
      >
        {/* Header Card */}
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Users className="size-3.5" aria-hidden="true" />
            <span>Collaboration &amp; Escrow Rooms</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            Squad Rooms &amp; Active Teams
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl">
            Stop building alone. Join cross-disciplinary teams of makers, firmware engineers, researchers, and designers shipping milestones together.
          </p>
        </header>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <StatTile
            label="Escrow Pool"
            value={`₹${totalEscrowInr.toLocaleString('en-IN')}`}
            hint="Milestone backed"
            tone="earn"
          />
          <StatTile
            label="Open Positions"
            value={totalOpenRoles}
            hint="Recruiting now"
            tone="accent"
          />
          <StatTile
            label="Active Makers"
            value={totalFilledMembers}
            hint="Verified contributors"
          />
          <StatTile
            label="Active Rooms"
            value={squads.length}
            hint="Public workspaces"
          />
        </div>

        {/* Squads Grid */}
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
            <Briefcase className="size-4 text-accent" aria-hidden="true" />
            <span>Active Squad Workspaces</span>
          </h2>
          <span className="text-body-sm text-fg-subtle">{squads.length} rooms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {squads.map((squad) => {
            const openRoles = squad.squadMembers.filter((m) => m.status === 'open');
            const filledMembers = squad.squadMembers.filter((m) => m.status === 'filled');

            return (
              <Card
                key={squad.projectSlug}
                accent="accent"
                interactive
                className="flex flex-col justify-between min-w-0 break-words"
              >
                <CardBody className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="neutral" variant="outline">
                      Squad Room
                    </Badge>
                    <Badge tone="earn" variant="solid">
                      ₹{squad.escrowPoolTotalInr.toLocaleString('en-IN')} Escrow
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display text-headline-sm font-bold text-fg break-words">
                      {squad.projectTitle}
                    </h3>
                    <p className="text-body-sm text-fg-muted mt-1 line-clamp-2 leading-relaxed">
                      {squad.tagline}
                    </p>
                  </div>

                  {/* Active Members */}
                  <div className="space-y-1.5">
                    <span className="text-[12px] font-display font-semibold text-fg-subtle block">
                      Squad Members ({filledMembers.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {filledMembers.map((m) => (
                        <div
                          key={m.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2/70 px-2.5 py-1 text-[12px]"
                        >
                          <Avatar name={m.assignee?.name ?? m.roleTitle} size="sm" className="size-5 text-[9px]" />
                          <span className="font-medium text-fg">{m.assignee?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Open Roles */}
                  {openRoles.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[12px] font-display font-semibold text-accent-fg block">
                        Open Positions ({openRoles.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {openRoles.map((role) => (
                          <span
                            key={role.id}
                            className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-0.5 text-[11px] font-medium text-accent-fg"
                          >
                            <Sparkles className="size-3" aria-hidden="true" />
                            <span>{role.roleTitle}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Milestone */}
                  {squad.milestones[0] && (
                    <div className="rounded-xl border border-hairline bg-surface-2/50 p-3 space-y-1">
                      <span className="text-[11px] font-display font-medium text-fg-subtle block">
                        Next Milestone
                      </span>
                      <div className="text-body-sm font-semibold text-fg truncate">
                        {squad.milestones[0].title}
                      </div>
                      <div className="text-[12px] font-display font-semibold text-earn-fg">
                        ₹{squad.milestones[0].escrowAmountInr.toLocaleString('en-IN')} Milestone Pool
                      </div>
                    </div>
                  )}
                </CardBody>

                <CardFooter className="justify-between bg-surface-2/30">
                  <Link
                    href={`/projects/${squad.projectSlug}`}
                    className="text-body-sm font-display font-medium text-fg-muted hover:text-accent-fg transition-colors"
                  >
                    Overview
                  </Link>

                  <Button asChild size="sm" variant="primary">
                    <Link href={`/projects/${squad.projectSlug}/squad`}>
                      <span>Enter Squad Room</span>
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
