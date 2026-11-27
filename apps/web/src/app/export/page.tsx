import type { Metadata } from 'next';
import { ExportHubStudio } from '@/components/export/export-hub-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Global Export & Trade Hub | DGFT, RoDTEP, CE/FCC, Incoterms 2020 | Hackerland',
  description:
    'Bridge Indian NABL certifications into CE, FCC, UL, ECAS, and IMDA compliance, simulate 8-digit ITC-HS Incoterms 2020 unit economics with RoDTEP & UAE CEPA 0% FTA duty, clear 10 DGFT/ICEGATE gates, and pass Tier-1 OEM PPAP audits.',
  openGraph: {
    title: 'Global Export & Trade Hub (India → World) | Hackerland',
    description:
      'Interactive global hardware export workbench for Indian startups and MSMEs: Regulatory Bridge, Incoterms 2020 Margin Simulator, DGFT Paperwork & PLI Matchmaker, and Global Trade Corridors.',
    type: 'website',
  },
};

export default function ExportHubPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <ExportHubStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
