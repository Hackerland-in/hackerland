import type { Metadata } from 'next';
import { Radar } from 'lucide-react';
import { StatTile } from '@hackerland/ui';
import { listObservatoryItems } from '@/lib/data/observatory-data';
import { TechRadarView } from '@/components/observatory/tech-radar-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Global Innovation Observatory & Tech Radar | Hackerland',
  description:
    'Real-time intelligence feed tracking expired patents in the public domain, deep-tech research breakthroughs, open-source silicon tapeouts, and non-dilutive government grants.',
};

export default function ObservatoryPage() {
  const items = listObservatoryItems();

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Radar className="size-3.5" aria-hidden="true" />
            <span>Worldwide Horizon Scanning</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Global Innovation Observatory &amp; Tech Radar
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Track expired patents entering the public domain, lab breakthroughs ready for commercialization, open-source silicon shuttles, and non-dilutive hardware grants.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
          <StatTile label="Public Domain" value="Patents" hint="Expired IP you can build" tone="accent" />
          <StatTile label="Lab-to-Market" value="Research" hint="Commercializable breakthroughs" tone="code" />
          <StatTile label="Open Silicon" value="ASICs" hint="Custom silicon & PCBs" tone="make" />
          <StatTile label="Grants" value="₹ Cr" hint="iDEX & deep-tech funding" tone="earn" />
        </div>

        <TechRadarView items={items} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
