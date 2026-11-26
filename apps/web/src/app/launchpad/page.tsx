import type { Metadata } from 'next';
import { LaunchpadStudio } from '@/components/launchpad/launchpad-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { OpportunitiesTabs } from '@/components/social/opportunities-tabs';

export const metadata: Metadata = {
  title: 'Hardware Launchpad & Indian Govt Grant Matcher | Hackerland',
  description:
    'Milestone-locked micro-crowdfunding and Indian government non-dilutive grant matcher (iDEX, BIRAC BIG, DST NIDHI-PRAYAS, Semiconductor DLI) for breakthrough hardware engineering.',
  openGraph: {
    title: 'Hardware Launchpad & Indian Govt Grant Matcher | Hackerland',
    description:
      'Back physical hardware with zero lump-sum risk. Funds are locked in smart escrow and released upon verified EVT, DVT, and PVT engineering milestones.',
    type: 'website',
  },
};

export default function LaunchpadPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <OpportunitiesTabs />
        <LaunchpadStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
