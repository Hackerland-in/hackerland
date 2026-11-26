import type { Metadata } from 'next';
import { TeardownSubmitStudio } from '@/components/teardowns/teardown-submit-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

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
      <SocialShell rightRail={<CommunityRailServer />}>
        <TeardownSubmitStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
