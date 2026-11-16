import type { Metadata } from 'next';
import { SectionHeader, StatTile } from '@hackerland/ui';
import { ShieldCheck, Cpu, Users, Trophy } from 'lucide-react';
import { CLUBS_DATA } from '@/lib/data/clubs-data';
import { ClubsDirectory } from '@/components/clubs/clubs-directory';

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      {/* Page Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="PAN-INDIA TINKERING MESH"
        title="Innovation Clubs & ATL Hub"
        description="Connect with school Atal Tinkering Labs (ATLs), collegiate robotics clubs, and community makerspaces across India. Share precision machine time, enter national hardware challenges, and collaborate under verified mentor guidance."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-w-0">
        <StatTile
          label="VERIFIED CHAPTERS"
          value={verifiedCount}
          hint="AIM certified school & college labs"
          tone="accent"
          icon={<ShieldCheck className="size-4" />}
        />
        <StatTile
          label="SHARED EQUIPMENT"
          value={totalEquipment}
          hint="3D printers, CNCs, scopes & rework"
          tone="make"
          icon={<Cpu className="size-4" />}
        />
        <StatTile
          label="STUDENT TINKERERS"
          value={`${totalMembers}+`}
          hint="Across tier-1, tier-2 & tier-3 cities"
          tone="learn"
          icon={<Users className="size-4" />}
        />
        <StatTile
          label="PROVEN PROTOTYPES"
          value={totalPrototypes}
          hint="Working physical hardware builds"
          tone="code"
          icon={<Trophy className="size-4" />}
        />
      </div>

      {/* Interactive Directory & Equipment Booking */}
      <ClubsDirectory initialClubs={CLUBS_DATA} />
    </div>
  );
}
