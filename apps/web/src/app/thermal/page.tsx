import type { Metadata } from 'next';
import { THERMAL_PROFILES_REGISTRY } from '@/lib/data/thermal-data';
import { ThermalCatalog } from '@/components/thermal/thermal-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Thermal Management & Computational Heat Sink Profiler | Hackerland',
  description:
    '1D lumped-parameter thermal resistance network and fin efficiency calculator for SiC inverters, GaN converters, and edge TPUs.',
  openGraph: {
    title: 'Thermal Management & Heat Sink Profiler | Hackerland',
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
    description:
      'Computational heat sink sizing, thermal resistance chains, and convective boundary layer dissipation data.',
    itemListElement: THERMAL_PROFILES_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.deviceType} dissipating ${proj.powerDissipationWatts}W using ${proj.coolingMethod} cooling.`,
        url: `https://www.hackerland.in/thermal/${proj.slug}`,
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
        <ThermalCatalog initialProjects={THERMAL_PROFILES_REGISTRY} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
