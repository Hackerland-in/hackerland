import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { StatTile } from '@hackerland/ui';
import { PrototypeArchitectStudio } from '@/components/prototype/prototype-architect-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Idea-to-Prototype Hardware Simulator & Architect | Hackerland',
  description:
    'Turn any hardware idea into a complete engineering architecture in seconds: system blocks, MCU pinouts, component-level Bill of Materials (BOM), squad skill requirements, and direct PCB Studio export.',
};

export default function PrototypePage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Idea-to-Prototype Synthesizer</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Idea-to-Prototype Hardware Architecture Simulator
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Turn any hardware prompt into a complete architecture plan: system blocks, MCU pinouts, component BOM, squad roles, and direct handoff to PCB Studio.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
          <StatTile label="Zero to BOM" value="Instant" hint="Component list & footprints" tone="accent" />
          <StatTile label="Pinout Matrix" value="I2C / SPI" hint="Verified bus interconnects" tone="code" />
          <StatTile label="Squad Roster" value="Roles" hint="Skills & hour estimates" tone="make" />
          <StatTile label="1-Click Export" value="PCB / RFQ" hint="Ready for prototyping" tone="earn" />
        </div>

        <PrototypeArchitectStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
