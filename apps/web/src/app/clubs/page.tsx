import type { Metadata } from 'next';
import { StatTile } from '@hackerland/ui';
import { ShieldCheck, Cpu, Users, Trophy } from 'lucide-react';
import { CLUBS_DATA } from '@/lib/data/clubs-data';
import { ClubsDirectory } from '@/components/clubs/clubs-directory';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Innovation Clubs & ATL Hub · Hackerland',
  description:
    'Network of school Atal Tinkering Labs (ATL), collegiate robotics clubs, and community FabLabs across India with shared equipment registries, intra-club challenges, and DPDP-compliant student mentorship.',
};

export default function ClubsPage() {
  const verifiedCount = CLUBS_DATA.filter((c) => c.verifiedAtl).length;
  const totalEquipment = CLUBS_DATA.reduce((sum, c) => sum + c.equipment.length, 0);
  const totalMembers = CLUBS_DATA.reduce((sum, c) => sum + c.memberCount, 0);
  const totalPrototypes = CLUBS_DATA.reduce((sum, c) => sum + c.establishedPrototypesCount, 0);

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Users className="size-3.5" aria-hidden="true" />
            <span>Pan-India Tinkering Mesh</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            Innovation Clubs &amp; ATL Hub
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
            Connect with school Atal Tinkering Labs, collegiate robotics clubs, and community makerspaces. Book shared machine slots and join verified squads.
          </p>
        </header>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 min-w-0">
          <StatTile
            label="VERIFIED CHAPTERS"
            value={verifiedCount}
            hint="AIM certified school & college labs"
            tone="accent"
            icon={<ShieldCheck className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="SHARED EQUIPMENT"
            value={totalEquipment}
            hint="3D printers, CNCs, scopes"
            tone="make"
            icon={<Cpu className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="STUDENT TINKERERS"
            value={`${totalMembers}+`}
            hint="Across tier-1, 2 & 3 cities"
            tone="learn"
            icon={<Users className="size-4" aria-hidden="true" />}
          />
          <StatTile
            label="PROVEN PROTOTYPES"
            value={totalPrototypes}
            hint="Working hardware builds"
            tone="earn"
            icon={<Trophy className="size-4" aria-hidden="true" />}
          />
        </div>

        <ClubsDirectory initialClubs={CLUBS_DATA} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
