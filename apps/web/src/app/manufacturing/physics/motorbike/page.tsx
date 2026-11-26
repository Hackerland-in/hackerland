import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { MotorbikePhysicsSimulator } from '@/components/manufacturing/physics/motorbike-simulator';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Motorcycle Leaning & Wheelie Dynamics Studio | Hackerland',
  description:
    'Coupled roll-yaw-steer kinematics, tire crown contact patch shift, traction control, and aerodynamic winglet suppression.',
};

export default function MotorbikeStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="physics"
        title="Superbike Leaning Studio"
        subtitle="Roll-yaw-steer counter-steering kinematics, lean angle grip & anti-wheelie control"
        category="Two-Wheel Physics"
        badge="60°+ Lean & Anti-Wheelie"
        currentRoute="/manufacturing/physics/motorbike"
        edgeToEdge
      >
        <MotorbikePhysicsSimulator />
        <StudioBreadcrumb
          title="Superbike Leaning Studio"
          category="Two-Wheel Physics"
          badge="60°+ Lean & Anti-Wheelie"
          activeId="motorbike"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
