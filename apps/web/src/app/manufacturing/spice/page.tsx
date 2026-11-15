import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { ActualHardwareSimulator } from '@/components/manufacturing/hardware-simulator/actual-hardware-simulator';

export const metadata: Metadata = {
  title: 'Actual SPICE Hardware Simulator & Oscilloscope · Hackerland',
  description: 'True SPICE nodal matrix physics solver, benchtop DMM multimeter, and 2-channel digital storage oscilloscope.',
};

export default function SpiceStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 min-w-0">
      <StudioBreadcrumb
        title="Actual SPICE Hardware Simulator"
        category="Analog & Component Physics"
        badge="SPICE Nodal Matrix & Oscilloscope"
        activeId="spice"
      />
      <ActualHardwareSimulator />
    </div>
  );
}
