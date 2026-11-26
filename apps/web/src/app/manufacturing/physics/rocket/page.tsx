import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { RocketTrajectorySimulator } from '@/components/manufacturing/physics/rocket-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Multi-Stage Rocket Launch & Orbital Trajectory Studio | Hackerland',
  description:
    'Variable mass fuel depletion, barometric air density lapse, aerodynamic Max-Q dynamic pressure, and gravity-turn pitch to orbit.',
};

export default function RocketStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="Rocket Trajectory Studio"
        subtitle="Tsiolkovsky propellant burn, Max-Q dynamic pressure & orbital gravity turn"
        category="Aerospace Physics"
        badge="Tsiolkovsky & Max-Q"
        currentRoute="/manufacturing/physics/rocket"
        edgeToEdge
      >
        <RocketTrajectorySimulator />
        <StudioBreadcrumb
          title="Rocket Trajectory Studio"
          category="Aerospace Physics"
          badge="Tsiolkovsky & Max-Q"
          activeId="rocket"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
