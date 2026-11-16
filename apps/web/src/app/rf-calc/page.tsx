import type { Metadata } from 'next';
import { RF_PRESETS } from '@/lib/data/rf-data';
import { RfCatalog } from '@/components/rf/rf-catalog';

export const metadata: Metadata = {
  title: 'RF Impedance & Transmission Line Synthesizer | Hackerland',
  description:
    'Synthesize 50Ω microstrip, grounded coplanar waveguide (GCPW), and 100Ω differential pairs on Rogers RO4350B, RT/duroid, Isola 370HR, and standard FR4. Includes conductor skin depth, copper roughness attenuation, and Smith Chart conjugate matching.',
  keywords: [
    'rf impedance calculator',
    'microstrip synthesizer',
    'gcpw calculator',
    'coplanar waveguide with ground',
    'smith chart matching network',
    'rogers ro4350b 50 ohm trace',
    'navic l5 rf front end',
    'lora 865 mhz matching',
    'sameer chennai rf testing',
    'skin depth high frequency loss',
  ],
  openGraph: {
    title: 'RF Impedance & Transmission Line Synthesizer | Hackerland',
    description:
      'Electromagnetic waveguide solver, high-frequency transmission line synthesis, and Smith Chart complex matching networks.',
    url: 'https://www.hackerland.in/rf-calc',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RfCalcPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland RF Transmission Line & Microwave Engineering Synthesizer',
    description: 'Impedance calculations, stackup synthesizers, and Smith Chart matching networks for microwave and high-speed hardware.',
    itemListElement: RF_PRESETS.map((preset, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: preset.title,
        description: `${preset.application} operating at ${preset.frequencyGHz} GHz using ${preset.lineType}. Tested at ${preset.indianContextFacility}.`,
        url: `https://www.hackerland.in/rf-calc/${preset.slug}`,
      },
    })),
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8">
      {/* Schema.org Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <RfCatalog presets={RF_PRESETS} />
    </div>
  );
}
