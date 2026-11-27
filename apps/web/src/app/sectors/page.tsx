import type { Metadata } from 'next';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { SectorPathwaysHub } from '@/components/sectors/sector-pathways-hub';

export const metadata: Metadata = {
  title: 'India Sector Pathways Hub — Beginner to Pilot & Export | Hackerland',
  description:
    'Explore progressive 5-rung pathways across 10 core Indian manufacturing & deep-tech sectors: Semiconductors, EVs, Drones, Robotics/CNC, MedTech, Consumer Hardware, Textiles, Agro Cold-Chain, Materials & Rail/Marine.',
};

export default function SectorsPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <SectorPathwaysHub />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
