import type { Metadata } from 'next';
import { EMC_SCAN_REGISTRY } from '@/lib/data/emc-data';
import { EmcCatalog } from '@/components/emc/emc-catalog';

export const metadata: Metadata = {
  title: 'EMI / EMC Pre-Scan Analyzer & Near-Field Probe Visualizer | Hackerland',
  description:
    'Interactive conducted and radiated electromagnetic compatibility (EMC) pre-scan analyzer. Evaluate spectral traces against CISPR 25 Class 5, CISPR 32 Class B, and MIL-STD-461G limits with near-field probe hotspot diagnostics from SAMEER Chennai and ARAI Pune test chambers.',
  keywords: [
    'emi emc analyzer',
    'cispr 25 class 5 automotive',
    'cispr 32 class b radiated emissions',
    'near field probe visualizer',
    'sameer chennai emc lab',
    'arai emc testing pune',
    'common mode choke calculator',
    'pre-compliance spectrum',
  ],
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
    description: 'Electromagnetic compatibility pre-scan spectrum data, CISPR limits, and near-field probe diagnostics.',
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
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono font-medium text-primary">
          <span>📡 EMI / EMC PRE-COMPLIANCE & NEAR-FIELD PROBES</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          EMI / EMC Radiation Pre-Scan Analyzer
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Inspect 150 kHz to 1 GHz conducted and radiated emissions against statutory limits (CISPR 25 Class 5 for EVs, CISPR 32 Class B for IoT, and MIL-STD-461G for aerospace). Map electromagnetic near-field radiation hotspots across PCB switching loops and size common-mode suppression chokes before committing to formal NABL lab certification.
        </p>
      </div>

      <EmcCatalog initialProjects={EMC_SCAN_REGISTRY} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
