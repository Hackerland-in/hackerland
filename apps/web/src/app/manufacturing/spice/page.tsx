import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { ActualHardwareSimulator } from '@/components/manufacturing/hardware-simulator/actual-hardware-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Actual SPICE Hardware Simulator & Oscilloscope · Hackerland',
  description: 'True SPICE nodal matrix physics solver, benchtop DMM multimeter, and 2-channel digital storage oscilloscope.',
};

export default function SpiceStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="spice"
        title="Actual SPICE Hardware Simulator"
        subtitle="True MNA nodal matrix physics solver, bench DMM & 2-channel storage scope"
        category="Analog & Component Physics"
        badge="SPICE Nodal Matrix & Oscilloscope"
        currentRoute="/manufacturing/spice"
        edgeToEdge
      >
        <ActualHardwareSimulator />
        <StudioBreadcrumb
          title="Actual SPICE Hardware Simulator"
          category="Analog & Component Physics"
          badge="SPICE Nodal Matrix & Oscilloscope"
          activeId="spice"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
