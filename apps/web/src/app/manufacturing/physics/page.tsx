import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { PhysicsHub } from '@/components/manufacturing/physics/physics-hub';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Multibody Vehicle Physics Simulation Engine | Hackerland Hardware',
  description:
    'Real-time vehicle dynamics, Pacejka tire modeling, aerodynamics, Euler-Lagrange multibody mechanics, and custom component fabrication.',
};

export default function PhysicsStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="Multibody Physics Engine"
        subtitle="Real-time RK4 solver, Pacejka tire models, aero forces & custom subsystem mods"
        category="Simulation Studio"
        badge="60 FPS RK4"
        currentRoute="/manufacturing/physics"
        edgeToEdge
      >
        <PhysicsHub initialVehicle="bicycle" />
        <StudioBreadcrumb
          title="Multibody Physics Engine"
          category="Simulation Studio"
          badge="60 FPS RK4"
          activeId="physics"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
