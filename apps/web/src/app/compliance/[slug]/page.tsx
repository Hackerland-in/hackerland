import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { ComplianceDetailView } from '@/components/compliance/compliance-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface CompliancePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPLIANCE_ROADMAPS.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: CompliancePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = COMPLIANCE_ROADMAPS.find((rm) => rm.slug === slug);
  if (!item) {
    return { title: 'Compliance Roadmap Not Found | Hackerland' };
  }

  return {
    title: `${item.title} | Hardware Statutory Compliance Roadmap`,
    description: item.tagline,
    openGraph: {
      title: `${item.title} - Statutory Compliance & NABL Lab Fees`,
      description: item.tagline,
      type: 'article',
    },
  };
}

export default async function ComplianceDetailPage({ params }: CompliancePageProps) {
  const { slug } = await params;
  const item = COMPLIANCE_ROADMAPS.find((rm) => rm.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <ComplianceDetailView item={item} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
