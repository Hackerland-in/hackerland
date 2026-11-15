import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { PhysicsHub } from '@/components/manufacturing/physics/physics-hub';

export const metadata: Metadata = {
  title: 'Multibody Vehicle Physics Simulation Engine | Hackerland Hardware',
  description:
    'Real-time vehicle dynamics, Pacejka tire modeling, aerodynamics, Euler-Lagrange multibody mechanics, and custom component fabrication.',
};

export default function PhysicsStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="Multibody Physics Engine"
        category="Simulation Studio"
        badge="60 FPS RK4"
        activeId="physics"
      />
      <PhysicsHub initialVehicle="bicycle" />
    </div>
  );
}
