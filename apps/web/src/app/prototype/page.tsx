import type { Metadata } from 'next';
import { StatTile } from '@hackerland/ui';
import { PrototypeArchitectStudio } from '@/components/prototype/prototype-architect-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

export const metadata: Metadata = {
  title: 'Idea-to-Prototype Hardware Simulator & Architect | Hackerland',
  description:
    'Turn any hardware idea into a complete engineering architecture in seconds: system blocks, MCU pinouts, component-level Bill of Materials (BOM), squad skill requirements, and direct PCB Studio export.',
};

export default function PrototypePage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="prototype"
        title="Idea-to-Prototype Hardware Architecture Simulator"
        subtitle="System block diagrams, MCU pin assignments, initial BOM & direct handoff to PCB Studio"
        category="Architecture Studio"
        badge="I2C / SPI / CAN Matrix"
        currentRoute="/prototype"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
          <StatTile label="Zero to BOM" value="Instant" hint="Component list & footprints" tone="accent" />
          <StatTile label="Pinout Matrix" value="I2C / SPI" hint="Verified bus interconnects" tone="code" />
          <StatTile label="Squad Roster" value="Roles" hint="Skills & hour estimates" tone="make" />
          <StatTile label="1-Click Export" value="PCB / RFQ" hint="Ready for prototyping" tone="earn" />
        </div>

        <PrototypeArchitectStudio />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
