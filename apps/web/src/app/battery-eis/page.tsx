import type { Metadata } from 'next';
import { BATTERY_EIS_REGISTRY } from '@/lib/data/battery-eis-data';
import { BatteryEisCatalog } from '@/components/battery-eis/battery-eis-catalog';

export const metadata: Metadata = {
  title: 'Battery State-of-Health (SoH) & EIS Analyzer | Hackerland',
  description:
    'Electrochemical Impedance Spectroscopy (EIS) analyzer for EV battery cells. Evaluate Nyquist semicircles, Bode frequency response, Randles Equivalent Circuit Models, Solid Electrolyte Interphase (SEI) growth, and lithium plating under AIS-156 Amendment 3 standards.',
  keywords: [
    'battery eis analyzer',
    'nyquist plot visualizer',
    'electrochemical impedance spectroscopy',
    'bode plot battery',
    'randles equivalent circuit model',
    'soh state of health battery',
    'ais 156 amendment 3 ev battery',
    'lithium plating detection',
    'lfp 32700 degradation',
    'arai battery testing pune',
    'icat ev battery certification',
  ],
  openGraph: {
    title: 'Battery State-of-Health (SoH) & EIS Analyzer | Hackerland',
    description:
      'Electrochemical impedance spectroscopy and equivalent circuit modeling for EV battery cells under Indian ambient operating conditions.',
    url: 'https://www.hackerland.in/battery-eis',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function BatteryEisPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Battery EIS & State-of-Health Diagnostic Registry',
    description: 'Electrochemical impedance spectroscopy data, Nyquist plots, and AIS-156 safety compliance verdicts.',
    itemListElement: BATTERY_EIS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `EIS characterization for ${proj.cellModel} (${proj.chemistry}) tested at ${proj.testFacility}. SoH: ${proj.diagnostics.sohPercent}%.`,
        url: `https://www.hackerland.in/battery-eis/${proj.slug}`,
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

      <BatteryEisCatalog initialProjects={BATTERY_EIS_REGISTRY} />
    </div>
  );
}
