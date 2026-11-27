import type { Metadata } from 'next';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { IndiaResourcesHub } from '@/components/resources/india-resources-hub';

export const metadata: Metadata = {
  title: 'Pan-India Sectors, Funding Grants, Prototyping & Free Resources',
  description:
    'Discover every manufacturing and digital sector across all regions of India, zero-equity grants like NIDHI-PRAYAS & SISFS, free ATL/I-STEM/FabLab prototyping access, and free vernacular resources.',
};

export default function ResourcesPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <IndiaResourcesHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
