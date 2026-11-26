import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { BicyclePhysicsSimulator } from '@/components/manufacturing/physics/bicycle-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Bicycle Dynamics & Custom Component Physics Studio | Hackerland',
  description:
    'Real-time multibody bicycle mechanics, cadence, gear ratio inches, aero drag, road gradient, and custom e-bike component fabrication.',
};

export default function BicycleStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="Bicycle Physics Studio"
        subtitle="Gear ratio inches, cadence torque, aero CdA drag & custom e-assist drive mods"
        category="Multibody Dynamics"
        badge="Vector Forces & Custom Mods"
        currentRoute="/manufacturing/physics/bicycle"
        edgeToEdge
      >
        <BicyclePhysicsSimulator />
        <StudioBreadcrumb
          title="Bicycle Physics Studio"
          category="Multibody Dynamics"
          badge="Vector Forces & Custom Mods"
          activeId="bicycle"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
