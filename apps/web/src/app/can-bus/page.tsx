import type { Metadata } from 'next';
import { CAN_BUS_PROJECTS_REGISTRY } from '@/lib/data/can-bus-data';
import { CanCatalog } from '@/components/can-bus/can-catalog';

export const metadata: Metadata = {
  title: 'Automotive CAN Bus & ISO 11898 Network Protocol Simulator | Hackerland',
  description:
    'Simulate Controller Area Network (CAN 2.0B & CAN-FD) bit timing segments (Sync_Seg, Prop_Seg, Phase_Seg1, Phase_Seg2), sample point location, and round-trip cable propagation delay. Model non-destructive bitwise arbitration priority, bus load bandwidth saturation, split termination common-mode RF filtering, and differential physical layer oscilloscope traces across Indian EV two-wheelers, passenger cars, commercial 3-wheelers, and drones.',
  keywords: [
    'can bus simulator',
    'iso 11898 2 physical layer',
    'can bit timing calculator',
    'can sample point cia 301',
    'can fd bit rate switching',
    'can bus load calculator',
    'can arbitration csma cd nba',
    'split termination 60 ohm filter',
    'ather 450x can network',
    'tata nexon ev can-fd',
    'dronecan uavcan avionics',
    'arai ais 004 automotive emc',
  ],
  openGraph: {
    title: 'Automotive CAN Bus & ISO 11898 Network Protocol Simulator | Hackerland',
    description:
      'Model ISO 11898 bit timing, sample point margins, and non-destructive arbitration for Indian automotive and defense networks.',
    url: 'https://www.hackerland.in/can-bus',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function CanBusPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Automotive CAN Bus & ISO 11898 Network Engineering Registry',
    description: 'Controller Area Network bit timing calculations, bus bandwidth analysis, and physical layer transceiver termination designs.',
    itemListElement: CAN_BUS_PROJECTS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.automotiveDomain} operating at ${proj.nominalBaudRateKbps} kbps over ${proj.busTopology.busLengthMeters}m with ${proj.busTopology.nodeCount} ECUs. Tested at ${proj.indianContextFacility}.`,
        url: `https://www.hackerland.in/can-bus/${proj.slug}`,
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

      <CanCatalog initialProjects={CAN_BUS_PROJECTS_REGISTRY} />
    </div>
  );
}
