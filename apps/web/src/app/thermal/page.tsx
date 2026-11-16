import type { Metadata } from 'next';
import { THERMAL_PROFILES_REGISTRY } from '@/lib/data/thermal-data';
import { ThermalCatalog } from '@/components/thermal/thermal-catalog';

export const metadata: Metadata = {
  title: 'Thermal Management & Computational Heat Sink Profiler | Hackerland',
  description:
    '1D lumped-parameter thermal resistance network and fin efficiency calculator. Model junction temperatures (Tj), case temperatures (Tc), TIM thermal impedance, and convective dissipation across SiC traction inverters, GaN microinverters, and edge TPUs under 50°C Indian heatwave conditions.',
  keywords: [
    'heatsink calculator',
    'thermal resistance network',
    'theta jc theta sa',
    'fin efficiency calculator',
    'convective heat transfer coefficient',
    'sic inverter thermal management',
    'gan fet heatsink',
    'honeywell ptm7950 tim',
    'arai thermal chamber pune',
    'ais 156 battery bms thermal',
  ],
  openGraph: {
    title: 'Thermal Management & Computational Heat Sink Profiler | Hackerland',
    description:
      'Model 1D lumped-parameter thermal resistance chains and convective heat sink dissipation under Indian environmental conditions.',
    url: 'https://www.hackerland.in/thermal',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ThermalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Thermal Management & Heat Sink Profiling Registry',
    description: 'Computational heat sink sizing, thermal resistance chains, and convective boundary layer dissipation data.',
    itemListElement: THERMAL_PROFILES_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.deviceType} dissipating ${proj.powerDissipationWatts}W using ${proj.coolingMethod} cooling. Tested at ${proj.indianTestFacility}.`,
        url: `https://www.hackerland.in/thermal/${proj.slug}`,
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

      <ThermalCatalog initialProjects={THERMAL_PROFILES_REGISTRY} />
    </div>
  );
}
