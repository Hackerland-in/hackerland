import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { EvPowertrainSimulator } from '@/components/manufacturing/physics/ev-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'EV Battery, Inverter & Powertrain Studio | Hackerland',
  description:
    'Electrochemical pack degradation, cell internal resistance, instantaneous kW power flow, and kinetic regenerative capture.',
};

export default function EvStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="EV Powertrain Studio"
        subtitle="Pack SoC & ESR sag, 800V SiC inverter power flow & regenerative braking capture"
        category="Electrification Physics"
        badge="800V SiC & Regen"
        currentRoute="/manufacturing/physics/ev"
        edgeToEdge
      >
        <EvPowertrainSimulator />
        <StudioBreadcrumb
          title="EV Powertrain Studio"
          category="Electrification Physics"
          badge="800V SiC & Regen"
          activeId="ev"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
