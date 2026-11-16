import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPLIANCE_ROADMAPS } from '@/lib/data/compliance-data';
import { ComplianceDetailView } from '@/components/compliance/compliance-detail-view';

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
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <ComplianceDetailView item={item} />
    </div>
  );
}
