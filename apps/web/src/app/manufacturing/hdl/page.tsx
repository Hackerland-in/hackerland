import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { HdlSimulator } from '@/components/manufacturing/hdl/hdl-simulator';

export const metadata: Metadata = {
  title: 'Digital Logic HDL Simulator & GTKWave Timing Studio · Hackerland',
  description: 'Cycle-accurate Verilog synthesis, ModelSim style timing waveforms, and IEEE 1364 VCD export.',
};

export default function HdlStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="Digital Logic HDL & GTKWave Waveform Studio"
        category="Hardware Description Languages"
        badge="Verilog RTL & IEEE 1364 VCD"
        activeId="hdl"
      />
      <HdlSimulator />
    </div>
  );
}
