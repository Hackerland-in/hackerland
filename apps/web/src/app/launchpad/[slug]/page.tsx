import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCampaignBySlug, getAllCampaignSlugs } from '@/lib/data/launchpad-data';
import { CampaignDetailView } from '@/components/launchpad/campaign-detail-view';

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
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <CampaignDetailView campaign={campaign} />
    </div>
  );
}
