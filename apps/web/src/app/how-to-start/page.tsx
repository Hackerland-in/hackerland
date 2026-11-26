import type { Metadata } from 'next';
import { HowToStartHub } from '@/components/domain/how-to-start/how-to-start-hub';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'How to Start an Industrial Manufacturing Plant | Hackerland Hardware',
  description:
    'Comprehensive blueprints to set up semiconductor fabs, carbon fiber composite hubs, multilayer PCB design plants, bicycle manufacturing facilities, precision CNC turned components, and mobile phone parts in India.',
};

export default function HowToStartPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <HowToStartHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
