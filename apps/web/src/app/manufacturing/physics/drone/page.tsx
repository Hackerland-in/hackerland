import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { DronePhysicsSimulator } from '@/components/manufacturing/physics/drone-simulator';

export const metadata: Metadata = {
  title: 'Quadcopter Multi-Rotor 6-DOF Flight Studio | Hackerland',
  description:
    'Individual brushless motor thrust, Euler angle attitude integration, battery voltage sag under amp draw, and PID response.',
};

export default function DroneStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="Quadcopter 6-DOF Studio"
        category="Aeronautical Physics"
        badge="6-DOF & Rotor Aerodynamics"
        activeId="drone"
      />
      <DronePhysicsSimulator />
    </div>
  );
}
