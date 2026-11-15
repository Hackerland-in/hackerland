import type { Metadata } from 'next';
import { SectionHeader, StatTile } from '@hackerland/ui';
import { ManufacturingHub } from '@/components/manufacturing/manufacturing-hub';

export const metadata: Metadata = {
  title: 'Hardware & Advanced Manufacturing Hub · Hackerland',
  description:
    'Comprehensive cyber-physical engineering, PCB fabrication, CNC hardware, autonomous drones, EV automotive, rocketry engines, and 5G mobile devices.',
};

export default function ManufacturingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="CYBER-PHYSICAL HARDWARE & FABRICATION"
        title="Advanced Manufacturing Hub"
        description="From schematic and multilayer PCB routing to autonomous drones, EV battery packs, rocket engines, and mass-market certified hardware."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
        <StatTile
          label="Manufacturing Pillars"
          value="8 Disciplines"
          hint="PCB, Drone, EV, Engine, Mobile & Future Tech"
          tone="accent"
        />
        <StatTile
          label="Interactive Labs"
          value="8 Virtual Testbenches"
          hint="Physics, Feeds, RF & Dyno Simulations"
          tone="make"
        />
        <StatTile
          label="Execution Stages"
          value="7-Stage Pipeline"
          hint="CAD to BIS, ARAI & DGCA Certification"
          tone="code"
        />
        <StatTile
          label="Domestic Ecosystem"
          value="100% Verified"
          hint="Indian Sourcing & ATL Node Integration"
          tone="earn"
        />
      </div>

      <ManufacturingHub />
    </div>
  );
}
