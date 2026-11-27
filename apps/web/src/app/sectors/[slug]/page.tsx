import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SECTOR_IDS } from '@hackerland/core';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { SectorDetailPathway } from '@/components/sectors/sector-detail-pathway';
import { getEnrichedSector } from '@/lib/data/sectors-data';

interface SectorDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SECTOR_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: SectorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getEnrichedSector(slug);
  if (!sector) {
    return { title: 'Sector Pathway Not Found | Hackerland' };
  }

  return {
    title: `${sector.name} — 5-Rung Pathway | Hackerland`,
    description: `${sector.tagline} Starter cost: ${sector.starterCostRangeInr.label}. Pilot: ${sector.pilotCostRangeInr.label}.`,
  };
}

export default async function SectorDetailPage({ params }: SectorDetailPageProps) {
  const { slug } = await params;
  const sector = getEnrichedSector(slug);

  if (!sector) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <SectorDetailPathway sector={sector} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
