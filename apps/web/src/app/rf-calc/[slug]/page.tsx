import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RF_PRESETS } from '@/lib/data/rf-data';
import { RfPresetDetail } from '@/components/rf/rf-preset-detail';

interface RfPresetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RF_PRESETS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: RfPresetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = RF_PRESETS.find((p) => p.slug === slug);

  if (!preset) {
    return {
      title: 'RF Preset Not Found | Hackerland',
    };
  }

  return {
    title: `${preset.title} (${preset.targetImpedance}Ω @ ${preset.frequencyGHz} GHz) | Hackerland RF`,
    description: `${preset.application}. Fabricated on ${preset.layerStackup}. Recommended trace width: ${preset.recommendedWidthMm} mm. Characterized at ${preset.indianContextFacility}.`,
    keywords: [
      preset.title,
      `${preset.targetImpedance} ohm transmission line`,
      `${preset.frequencyGHz} GHz RF trace`,
      preset.lineType,
      preset.substrate,
      preset.indianContextFacility,
      'kicad rf layout rules',
      'smith chart conjugate matching',
    ],
    openGraph: {
      title: `${preset.title} | Hackerland RF Synthesizer`,
      description: preset.application,
      url: `https://www.hackerland.in/rf-calc/${preset.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function RfPresetPage({ params }: RfPresetPageProps) {
  const { slug } = await params;
  const preset = RF_PRESETS.find((p) => p.slug === slug);

  if (!preset) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: preset.title,
    description: preset.application,
    url: `https://www.hackerland.in/rf-calc/${preset.slug}`,
    inLanguage: 'en_IN',
    author: {
      '@type': 'Organization',
      name: 'Hackerland Engineering Council',
      url: 'https://www.hackerland.in',
    },
    about: {
      '@type': 'Thing',
      name: 'Radio Frequency Transmission Line Design',
      description: `Stackup: ${preset.layerStackup}. Facility: ${preset.indianContextFacility}`,
    },
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8">
      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RfPresetDetail preset={preset} />
    </div>
  );
}
