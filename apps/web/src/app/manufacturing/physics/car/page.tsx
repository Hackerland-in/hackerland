import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { CarPhysicsSimulator } from '@/components/manufacturing/physics/car-simulator';

export const metadata: Metadata = {
  title: 'Automotive Vehicle Dynamics & Powertrain Studio | Hackerland',
  description:
    'Coupled engine torque maps, transmission gear steps, aerodynamic downforce, chassis squat/dive, and live friction circle.',
};

export default function CarStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="Car Dynamics Studio"
        category="Automotive Physics"
        badge="Pacejka Tires & G-G Circle"
        activeId="car"
      />
      <CarPhysicsSimulator />
    </div>
  );
}
