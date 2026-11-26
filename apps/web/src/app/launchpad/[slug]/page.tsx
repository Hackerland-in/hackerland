import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCampaignBySlug, getAllCampaignSlugs } from '@/lib/data/launchpad-data';
import { CampaignDetailView } from '@/components/launchpad/campaign-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface CampaignPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCampaignSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    return {
      title: 'Campaign Not Found | Hackerland Launchpad',
    };
  }

  return {
    title: `${campaign.title} | Hardware Launchpad & Escrow | Hackerland`,
    description: campaign.tagline,
    openGraph: {
      title: `${campaign.title} | Hackerland Launchpad`,
      description: campaign.tagline,
      type: 'website',
    },
  };
}

export default async function CampaignDetailPage({ params }: CampaignPageProps) {
  const { slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <CampaignDetailView campaign={campaign} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
