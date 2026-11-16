import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EMC_SCAN_REGISTRY } from '@/lib/data/emc-data';
import { evaluateEmcCompliance } from '@hackerland/core';
import { EmcDetailView } from '@/components/emc/emc-detail-view';

interface EmcPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return EMC_SCAN_REGISTRY.map((proj) => ({
    slug: proj.slug,
  }));
}

export async function generateMetadata({ params }: EmcPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = EMC_SCAN_REGISTRY.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'EMC Pre-Scan Project Not Found | Hackerland',
    };
  }

  const evaluation = evaluateEmcCompliance(project.spectralTrace);

  return {
    title: `${project.title} (${evaluation.isCompliant ? 'PASS' : 'FAIL'}) | Hackerland EMC`,
    description: `Pre-compliance ${project.scanType.replace(/_/g, ' ')} for ${project.deviceUnderTesting} tested under ${project.standard} at ${project.testLabFacility}. Worst margin: ${evaluation.worstMarginDb} dB. ${project.hotspots.length} probed radiation hotspots.`,
    keywords: [
      project.title,
      project.deviceUnderTesting,
      project.standard,
      project.testLabFacility,
      'emi emc prescan',
      'conducted emissions',
      'radiated emissions spectrum',
      'near field probe heatmap',
    ],
    openGraph: {
      title: `${project.title} | Hackerland EMC Analyzer`,
      description: `EMC pre-scan evaluation for ${project.deviceUnderTesting} under ${project.standard}.`,
      url: `https://www.hackerland.in/emc/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function EmcDetailPage({ params }: EmcPageProps) {
  const { slug } = await params;
  const project = EMC_SCAN_REGISTRY.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: `EMC pre-scan data for ${project.deviceUnderTesting} tested under ${project.standard} at ${project.testLabFacility}.`,
    author: {
      '@type': 'Organization',
      name: 'Hackerland Open Hardware Engineering',
    },
    publisher: {
      '@type': 'Organization',
      name: project.testLabFacility,
    },
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <EmcDetailView project={project} />

      {/* JSON-LD Technical Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
