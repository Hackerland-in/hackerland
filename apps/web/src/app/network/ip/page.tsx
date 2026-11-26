import type { Metadata } from 'next';
import { StatTile } from '@hackerland/ui';
import { ShieldCheck, Lock, Users, Trophy } from 'lucide-react';
import { IP_DEFENSE_PUBLICATIONS } from '@/lib/data/ip-defense-data';
import { IpDefenseLedgerView } from '@/components/network/ip/ip-defense-ledger-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Open Invention Network & IP Defense Ledger · Hackerland',
  description:
    'Cryptographic prior-art timestamping for open hardware schematics, Gerber files, and mechanical CAD under USPTO 35 U.S.C. § 102 and Indian Patents Act § 29 to protect indie makers from patent trolls.',
};

export default function IpDefenseLedgerPage() {
  const totalPublications = IP_DEFENSE_PUBLICATIONS.length;
  const totalArtifacts = IP_DEFENSE_PUBLICATIONS.reduce(
    (sum, p) => sum + p.openArtifacts.length,
    0,
  );
  const latestBlock = Math.max(
    ...IP_DEFENSE_PUBLICATIONS.map((p) => p.timestampProof.blockHeight),
  );

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            <span>Prior Art Cryptographic Registry</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Open Invention Network &amp; IP Defense Ledger
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Timestamp open schematics, Gerbers, and firmware to establish statutory prior art under USPTO 35 U.S.C. § 102 and the Indian Patents Act § 29.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 min-w-0">
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
            hint="Schematics, Gerbers & CAD"
            tone="make"
            icon={<Lock className="size-4" />}
          />
          <StatTile
            label="NON-AGGRESSION PLEDGES"
            value="340+"
            hint="Cross-licensed makers"
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

        <IpDefenseLedgerView initialPublications={IP_DEFENSE_PUBLICATIONS} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
