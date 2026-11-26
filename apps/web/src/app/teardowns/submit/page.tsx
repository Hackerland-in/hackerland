import type { Metadata } from 'next';
import { TeardownSubmitStudio } from '@/components/teardowns/teardown-submit-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

export const metadata: Metadata = {
  title: 'Submit Hardware Teardown & Reverse Engineering Autopsy | Hackerland',
  description:
    'Document chip-level schematics, interactive PCB pinout hotspots, subsystem trees, and true Bill of Materials costs of iconic hardware devices.',
  openGraph: {
    title: 'Submit Hardware Teardown | Hackerland',
    description: 'Chip-level hardware autopsies, interactive PCB pinout annotator, and BOM markup analyzer.',
    type: 'website',
  },
};

export default function TeardownSubmitPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="teardown"
        title="Hardware Teardown & Pinout Annotator Studio"
        subtitle="Annotate die & PCB test-point hotspots, map subsystems & document BOM costs"
        category="Reverse Engineering"
        badge="Pinout Canvas"
        backHref="/teardowns"
        backLabel="Teardowns Library"
        currentRoute="/teardowns/submit"
        edgeToEdge
      >
        <TeardownSubmitStudio />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
