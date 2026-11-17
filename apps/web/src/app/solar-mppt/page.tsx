import type { Metadata } from 'next';
import { SOLAR_MPPT_PROJECTS_REGISTRY } from '@/lib/data/solar-mppt-data';
import { SolarCatalog } from '@/components/solar-mppt/solar-catalog';

export const metadata: Metadata = {
  title: 'Solar PV & MPPT Battery Charge Controller Simulator | Hackerland',
  description:
    'Single-diode photovoltaic IV & PV curve synthesizer and dynamic MPPT charge controller simulator. Model Incremental Conductance, Perturb & Observe, and Global Sweep algorithms with synchronous buck converter inductor and capacitor sizing for Indian climatic extremes from -30°C Ladakh border posts to 65°C Rajasthan canal-top arrays.',
  keywords: [
    'solar mppt simulator',
    'photovoltaic iv curve calculator',
    'pv curve calculator',
    'incremental conductance mppt',
    'perturb and observe mppt',
    'solar charge controller buck converter sizing',
    'pm kusum solar pump controller',
    'bifacial solar canal top rajasthan',
    'nise gurugram pv testing',
    'bis is 14286',
    'bis is 16221',
  ],
  openGraph: {
    title: 'Solar PV & MPPT Battery Charge Controller Simulator | Hackerland',
    description:
      'Model single-diode PV curves, MPPT algorithm convergence, and synchronous buck converter component values for Indian solar deployments.',
    url: 'https://www.hackerland.in/solar-mppt',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function SolarMpptPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Solar PV & MPPT Charge Controller Engineering Registry',
    description: 'Single-diode PV physics, MPPT tracking algorithms, and power electronic converter sizing.',
    itemListElement: SOLAR_MPPT_PROJECTS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.panelSpecs.technology} ${proj.systemCapacityWatts}W array charging ${proj.targetBattery} using ${proj.mpptAlgorithm}. Tested at ${proj.indianContextFacility}.`,
        url: `https://www.hackerland.in/solar-mppt/${proj.slug}`,
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

      <SolarCatalog initialProjects={SOLAR_MPPT_PROJECTS_REGISTRY} />
    </div>
  );
}
