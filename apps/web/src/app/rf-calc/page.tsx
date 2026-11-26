import type { Metadata } from 'next';
import { RF_PRESETS } from '@/lib/data/rf-data';
import { RfCatalog } from '@/components/rf/rf-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'RF Impedance & Transmission Line Synthesizer | Hackerland',
  description:
    'Synthesize 50Ω microstrip, grounded coplanar waveguide (GCPW), and 100Ω differential pairs on Rogers RO4350B, RT/duroid, Isola 370HR, and FR4.',
  openGraph: {
    title: 'RF Impedance & Transmission Line Synthesizer | Hackerland',
    description:
      'Electromagnetic waveguide solver, high-frequency transmission line synthesis, and Smith Chart matching networks.',
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
    description:
      'Impedance calculations, stackup synthesizers, and Smith Chart matching networks for microwave hardware.',
    itemListElement: RF_PRESETS.map((preset, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: preset.title,
        description: `${preset.application} operating at ${preset.frequencyGHz} GHz using ${preset.lineType}.`,
        url: `https://www.hackerland.in/rf-calc/${preset.slug}`,
      },
    })),
  };

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <RfCatalog presets={RF_PRESETS} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
