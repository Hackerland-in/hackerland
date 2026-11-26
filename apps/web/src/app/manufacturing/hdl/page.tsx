import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { HdlSimulator } from '@/components/manufacturing/hdl/hdl-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Digital Logic HDL Simulator & GTKWave Timing Studio · Hackerland',
  description: 'Cycle-accurate Verilog synthesis, ModelSim style timing waveforms, and IEEE 1364 VCD export.',
};

export default function HdlStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="eda"
        title="Digital Logic HDL & GTKWave Waveform Studio"
        subtitle="Cycle-accurate Verilog RTL synthesis & IEEE 1364 VCD timing analyzer"
        category="Hardware Description Languages"
        badge="Verilog RTL & VCD"
        currentRoute="/manufacturing/hdl"
        edgeToEdge
      >
        <HdlSimulator />
        <StudioBreadcrumb
          title="Digital Logic HDL & GTKWave Waveform Studio"
          category="Hardware Description Languages"
          badge="Verilog RTL & IEEE 1364 VCD"
          activeId="hdl"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
