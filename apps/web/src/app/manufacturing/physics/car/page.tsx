import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { CarPhysicsSimulator } from '@/components/manufacturing/physics/car-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Automotive Vehicle Dynamics & Powertrain Studio | Hackerland',
  description:
    'Coupled engine torque maps, transmission gear steps, aerodynamic downforce, chassis squat/dive, and live friction circle.',
};

export default function CarStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="Car Dynamics Studio"
        subtitle="Engine torque curves, gearbox ratios, chassis squat/dive & G-G friction circle"
        category="Automotive Physics"
        badge="Pacejka Tires & G-G Circle"
        currentRoute="/manufacturing/physics/car"
        edgeToEdge
      >
        <CarPhysicsSimulator />
        <StudioBreadcrumb
          title="Car Dynamics Studio"
          category="Automotive Physics"
          badge="Pacejka Tires & G-G Circle"
          activeId="car"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
