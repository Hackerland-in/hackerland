import type { Metadata } from 'next';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { OnboardingStudio } from '@/components/social/onboarding-studio';

export const metadata: Metadata = {
  title: 'Onboarding | Hackerland',
  description: 'Claim your Hackerland maker handle, select tracks, and join open squads.',
};

export default function OnboardingPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <OnboardingStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
