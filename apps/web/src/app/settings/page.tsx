import type { Metadata } from 'next';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { SettingsStudio } from '@/components/social/settings-studio';

export const metadata: Metadata = {
  title: 'Profile Settings | Hackerland',
  description: 'Manage your public maker identity, tracks, social links, and collaboration preferences.',
};

export default function SettingsPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <SettingsStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
