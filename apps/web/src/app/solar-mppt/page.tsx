import type { Metadata } from 'next';
import { SOLAR_MPPT_PROJECTS_REGISTRY } from '@/lib/data/solar-mppt-data';
import { SolarCatalog } from '@/components/solar-mppt/solar-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Solar PV & MPPT Battery Charge Controller Simulator | Hackerland',
  description:
    'Single-diode photovoltaic IV & PV curve synthesizer and dynamic MPPT charge controller simulator for Indian solar deployments.',
  openGraph: {
    title: 'Solar PV & MPPT Battery Charge Controller Simulator | Hackerland',
    description:
      'Model single-diode PV curves, MPPT algorithm convergence, and synchronous buck converter component values.',
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
    description:
      'Single-diode PV physics, MPPT tracking algorithms, and power electronic converter sizing.',
    itemListElement: SOLAR_MPPT_PROJECTS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.panelSpecs.technology} ${proj.systemCapacityWatts}W array charging ${proj.targetBattery} using ${proj.mpptAlgorithm}.`,
        url: `https://www.hackerland.in/solar-mppt/${proj.slug}`,
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
        <SolarCatalog initialProjects={SOLAR_MPPT_PROJECTS_REGISTRY} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
