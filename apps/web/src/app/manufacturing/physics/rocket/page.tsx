import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { RocketTrajectorySimulator } from '@/components/manufacturing/physics/rocket-simulator';

export const metadata: Metadata = {
  title: 'Multi-Stage Rocket Launch & Orbital Trajectory Studio | Hackerland',
  description:
    'Variable mass fuel depletion, barometric air density lapse, aerodynamic Max-Q dynamic pressure, and gravity-turn pitch to orbit.',
};

export default function RocketStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="Rocket Trajectory Studio"
        category="Aerospace Physics"
        badge="Tsiolkovsky & Max-Q"
        activeId="rocket"
      />
      <RocketTrajectorySimulator />
    </div>
  );
}
