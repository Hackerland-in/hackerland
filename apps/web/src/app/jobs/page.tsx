import type { Metadata } from 'next';
import { JobsStudio } from '@/components/jobs/jobs-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { OpportunitiesTabs } from '@/components/social/opportunities-tabs';

export const metadata: Metadata = {
  title: 'Hardware & Deep-Tech Jobs, Fellowships & Residencies | Hackerland',
  description:
    'Proof-of-work hiring for aerospace, robotics, EV power electronics, BMS firmware, RISC-V silicon, and defense hardware engineering across India.',
  openGraph: {
    title: 'Hardware Deep-Tech Jobs & Fellowships | Hackerland',
    description:
      'Get hired based on verified schematics, firmware repositories, oscilloscope traces, and physical prototypes built.',
    type: 'website',
  },
};

export default function JobsPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <OpportunitiesTabs />
        <JobsStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
