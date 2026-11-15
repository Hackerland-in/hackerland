import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { MotorbikePhysicsSimulator } from '@/components/manufacturing/physics/motorbike-simulator';

export const metadata: Metadata = {
  title: 'Motorcycle Leaning & Wheelie Dynamics Studio | Hackerland',
  description:
    'Coupled roll-yaw-steer kinematics, tire crown contact patch shift, traction control, and aerodynamic winglet suppression.',
};

export default function MotorbikeStudioPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="Superbike Leaning Studio"
        category="Two-Wheel Physics"
        badge="60°+ Lean & Anti-Wheelie"
        activeId="motorbike"
      />
      <MotorbikePhysicsSimulator />
    </div>
  );
}
