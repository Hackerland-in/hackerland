import type { Metadata } from 'next';
import { EntrepreneurshipHub } from '@/components/domain/entrepreneurship/entrepreneurship-hub';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Open-Source Entrepreneurship & Founder Academy | Hackerland',
  description:
    'Free university curricula, startup playlists, cap table dilution simulators, unit economics calculators, and open legal frameworks from Stanford, YC, and MIT.',
};

export default function EntrepreneurshipPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <EntrepreneurshipHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
