import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { DronePhysicsSimulator } from '@/components/manufacturing/physics/drone-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Quadcopter Multi-Rotor 6-DOF Flight Studio | Hackerland',
  description:
    'Individual brushless motor thrust, Euler angle attitude integration, battery voltage sag under amp draw, and PID response.',
};

export default function DroneStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="Quadcopter 6-DOF Studio"
        subtitle="Brushless motor thrust mixing, Euler kinematics, LiPo voltage sag & PID loop"
        category="Aeronautical Physics"
        badge="6-DOF & Rotor Aerodynamics"
        currentRoute="/manufacturing/physics/drone"
        edgeToEdge
      >
        <DronePhysicsSimulator />
        <StudioBreadcrumb
          title="Quadcopter 6-DOF Studio"
          category="Aeronautical Physics"
          badge="6-DOF & Rotor Aerodynamics"
          activeId="drone"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
