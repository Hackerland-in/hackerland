import type { Metadata } from 'next';
import { SectionHeader, StatTile } from '@hackerland/ui';
import { ShieldCheck, Lock, Users, Trophy } from 'lucide-react';
import { IP_DEFENSE_PUBLICATIONS } from '@/lib/data/ip-defense-data';
import { IpDefenseLedgerView } from '@/components/network/ip/ip-defense-ledger-view';

export const metadata: Metadata = {
  title: 'Open Invention Network & IP Defense Ledger · Hackerland',
  description:
    'Cryptographic prior-art timestamping for open hardware schematics, Gerber files, and mechanical CAD under USPTO 35 U.S.C. § 102 and Indian Patents Act § 29 to protect indie makers from patent trolls.',
};

export default function IpDefenseLedgerPage() {
  const totalPublications = IP_DEFENSE_PUBLICATIONS.length;
  const totalArtifacts = IP_DEFENSE_PUBLICATIONS.reduce(
    (sum, p) => sum + p.openArtifacts.length,
    0
  );
  const latestBlock = Math.max(
    ...IP_DEFENSE_PUBLICATIONS.map((p) => p.timestampProof.blockHeight)
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="PRIOR ART CRYPTOGRAPHIC REGISTRY"
        title="Open Invention Network & IP Defense Ledger"
        description="Defend grassroots hardware inventors, robotics teams, and indie startups against patent trolls. Timestamp open schematics and firmware to create incontrovertible legal prior art across USPTO, Indian Patent Office, and WIPO jurisdictions."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-w-0">
        <StatTile
          label="DEFENDED INVENTIONS"
          value={totalPublications}
          hint="Legally published prior art"
          tone="accent"
          icon={<ShieldCheck className="size-4" />}
        />
        <StatTile
          label="ANCHORED ARTIFACTS"
          value={totalArtifacts}
          hint="Schematics, Gerbers & CAD files"
          tone="make"
          icon={<Lock className="size-4" />}
        />
        <StatTile
          label="NON-AGGRESSION PLEDGES"
          value="340+"
          hint="Cross-licensed indie builders"
          tone="learn"
          icon={<Users className="size-4" />}
        />
        <StatTile
          label="LATEST PROOF BLOCK"
          value={`#${latestBlock}`}
          hint="Bitcoin OP_RETURN & RFC 3161"
          tone="code"
          icon={<Trophy className="size-4" />}
        />
      </div>

      {/* Interactive Defensive Ledger & Verifier */}
      <IpDefenseLedgerView initialPublications={IP_DEFENSE_PUBLICATIONS} />
    </div>
  );
}
