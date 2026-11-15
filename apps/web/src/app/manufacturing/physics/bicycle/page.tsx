import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { BicyclePhysicsSimulator } from '@/components/manufacturing/physics/bicycle-simulator';

export const metadata: Metadata = {
  title: 'Bicycle Dynamics & Custom Component Physics Studio | Hackerland',
  description:
    'Real-time multibody bicycle mechanics, cadence, gear ratio inches, aero drag, road gradient, and custom e-bike component fabrication.',
};

export default function BicycleStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="Bicycle Physics Studio"
        category="Multibody Dynamics"
        badge="Vector Forces & Custom Mods"
        activeId="bicycle"
      />
      <BicyclePhysicsSimulator />
    </div>
  );
}
