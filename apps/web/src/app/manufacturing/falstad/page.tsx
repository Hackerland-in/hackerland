import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { FalstadSimulator } from '@/components/manufacturing/falstad/falstad-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Falstad & ngspice Circuit Simulator · Hackerland',
  description: 'Interactive schematic canvas with animated electron current dots, Berkeley SPICE netlist deck, and transient scopes.',
};

export default function FalstadStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="spice"
        title="Falstad & ngspice Circuit Simulator"
        subtitle="Animated schematic solver, real-time branch currents & transient oscilloscope traces"
        category="Electronics Simulation"
        badge="Moving Current Animation"
        currentRoute="/manufacturing/falstad"
        edgeToEdge
      >
        <FalstadSimulator />
        <StudioBreadcrumb
          title="Falstad & ngspice Circuit Simulator"
          category="Free Electronics Simulation"
          badge="Moving Current Animation"
          activeId="falstad"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
