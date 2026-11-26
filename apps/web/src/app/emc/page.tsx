import type { Metadata } from 'next';
import { Radio } from 'lucide-react';
import { EMC_SCAN_REGISTRY } from '@/lib/data/emc-data';
import { EmcCatalog } from '@/components/emc/emc-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'EMI / EMC Pre-Scan Analyzer & Near-Field Probe Visualizer | Hackerland',
  description:
    'Interactive conducted and radiated electromagnetic compatibility (EMC) pre-scan analyzer evaluated against CISPR 25 Class 5, CISPR 32 Class B, and MIL-STD-461G.',
  openGraph: {
    title: 'EMI / EMC Pre-Scan Analyzer & Near-Field Probe Visualizer | Hackerland',
    description:
      'Interactive conducted and radiated emission spectrum analyzer and near-field PCB probe diagnostics.',
    url: 'https://www.hackerland.in/emc',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function EmcPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland EMI/EMC Pre-Compliance Testing Registry',
    description:
      'Electromagnetic compatibility pre-scan spectrum data, CISPR limits, and near-field probe diagnostics.',
    itemListElement: EMC_SCAN_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `EMC pre-scan for ${proj.deviceUnderTesting} tested under ${proj.standard} at ${proj.testLabFacility}.`,
        url: `https://www.hackerland.in/emc/${proj.slug}`,
      },
    })),
  };

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Radio className="size-3.5" aria-hidden="true" />
            <span>EMI / EMC Pre-Compliance &amp; Near-Field Probes</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            EMI / EMC Radiation Pre-Scan Analyzer
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Inspect 150 kHz–1 GHz conducted &amp; radiated scans against CISPR 25, CISPR 32, and MIL-STD-461G limits before booking formal NABL chambers.
          </p>
        </header>

        <EmcCatalog initialProjects={EMC_SCAN_REGISTRY} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
