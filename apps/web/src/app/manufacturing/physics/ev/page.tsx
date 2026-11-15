import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { EvPowertrainSimulator } from '@/components/manufacturing/physics/ev-simulator';

export const metadata: Metadata = {
  title: 'EV Battery, Inverter & Powertrain Studio | Hackerland',
  description:
    'Electrochemical pack degradation, cell internal resistance, instantaneous kW power flow, and kinetic regenerative capture.',
};

export default function EvStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="EV Powertrain Studio"
        category="Electrification Physics"
        badge="800V SiC & Regen"
        activeId="ev"
      />
      <EvPowertrainSimulator />
    </div>
  );
}
