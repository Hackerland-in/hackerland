import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { FalstadSimulator } from '@/components/manufacturing/falstad/falstad-simulator';

export const metadata: Metadata = {
  title: 'Falstad & ngspice Circuit Simulator · Hackerland',
  description: 'Interactive schematic canvas with animated electron current dots, Berkeley SPICE netlist deck, and transient scopes.',
};

export default function FalstadStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="Falstad & ngspice Circuit Simulator"
        category="Free Electronics Simulation"
        badge="Moving Current Animation"
        activeId="falstad"
      />
      <FalstadSimulator />
    </div>
  );
}
