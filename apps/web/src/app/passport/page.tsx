import type { Metadata } from 'next';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { PassportStudio } from '@/components/social/passport-studio';

export const metadata: Metadata = {
  title: 'Personal Innovation Passport | Hackerland',
  description:
    'Cryptographically verifiable record of your hardware builds, Gerber exports, sprint contributions, and maker badges.',
};

export default function PassportPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <PassportStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
