import type { Metadata } from 'next';
import { Factory } from 'lucide-react';
import { StatTile } from '@hackerland/ui';
import { ManufacturingHub } from '@/components/manufacturing/manufacturing-hub';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Hardware & Advanced Manufacturing Hub · Hackerland',
  description:
    'Comprehensive cyber-physical engineering, PCB fabrication, CNC hardware, autonomous drones, EV automotive, rocketry engines, and 5G mobile devices.',
};

export default function ManufacturingPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Factory className="size-3.5" aria-hidden="true" />
            <span>Cyber-Physical Hardware &amp; Fabrication</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Advanced Manufacturing Hub
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            From schematic capture and multilayer PCB routing to autonomous drones, EV battery packs, rocket propulsion, and certified hardware production.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 min-w-0">
          <StatTile
            label="Manufacturing Pillars"
            value="8 Disciplines"
            hint="PCB, Drone, EV & Aero"
            tone="accent"
          />
          <StatTile
            label="Interactive Labs"
            value="8 Workbenches"
            hint="Physics, SPICE & RF sims"
            tone="make"
          />
          <StatTile
            label="Execution Stages"
            value="7-Stage Flow"
            hint="CAD to BIS & DGCA approval"
            tone="code"
          />
          <StatTile
            label="Domestic Ecosystem"
            value="Verified"
            hint="Indian Sourcing & ATL Nodes"
            tone="earn"
          />
        </div>

        <ManufacturingHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
