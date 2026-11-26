import type { Metadata } from 'next';
import { CAN_BUS_PROJECTS_REGISTRY } from '@/lib/data/can-bus-data';
import { CanCatalog } from '@/components/can-bus/can-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Automotive CAN Bus & ISO 11898 Network Protocol Simulator | Hackerland',
  description:
    'Simulate Controller Area Network (CAN 2.0B & CAN-FD) bit timing segments, sample point location, and round-trip cable propagation delay.',
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
    description:
      'Controller Area Network bit timing calculations, bus bandwidth analysis, and physical layer transceiver termination designs.',
    itemListElement: CAN_BUS_PROJECTS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.automotiveDomain} operating at ${proj.nominalBaudRateKbps} kbps over ${proj.busTopology.busLengthMeters}m with ${proj.busTopology.nodeCount} ECUs.`,
        url: `https://www.hackerland.in/can-bus/${proj.slug}`,
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
        <CanCatalog initialProjects={CAN_BUS_PROJECTS_REGISTRY} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
