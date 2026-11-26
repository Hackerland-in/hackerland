import type { Metadata } from 'next';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { CircuitoBuilder } from '@/components/manufacturing/circuito/circuito-builder';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';
import { SocialCommunityProvider } from '@/components/social/social-context';

export const metadata: Metadata = {
  title: 'Circuito.io Autonomous Breadboard & BOM Engine · Hackerland',
  description: 'Visual breadboard wiring canvas, automatic logic level shifter injection, and Indian distributor BOM.',
};

export default function CircuitoStudioPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="eda"
        title="Circuito.io Autonomous Circuit Builder"
        subtitle="Visual breadboard auto-wiring, level shifter insertion & Indian supplier BOM"
        category="Rapid Prototyping"
        badge="Breadboard & Auto-BOM"
        currentRoute="/manufacturing/circuito"
        edgeToEdge
      >
        <CircuitoBuilder />
        <StudioBreadcrumb
          title="Circuito.io Autonomous Circuit Builder"
          category="Rapid Prototyping"
          badge="Breadboard & Auto-BOM"
          activeId="circuito"
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
