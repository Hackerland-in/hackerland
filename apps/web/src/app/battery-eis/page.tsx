import type { Metadata } from 'next';
import { BATTERY_EIS_REGISTRY } from '@/lib/data/battery-eis-data';
import { BatteryEisCatalog } from '@/components/battery-eis/battery-eis-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Battery State-of-Health (SoH) & EIS Analyzer | Hackerland',
  description:
    'Electrochemical Impedance Spectroscopy (EIS) analyzer for EV battery cells. Evaluate Nyquist semicircles, Bode frequency response, Randles Equivalent Circuit Models, Solid Electrolyte Interphase (SEI) growth, and lithium plating under AIS-156 Amendment 3 standards.',
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
    description:
      'Electrochemical impedance spectroscopy data, Nyquist plots, and AIS-156 safety compliance verdicts.',
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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BatteryEisCatalog initialProjects={BATTERY_EIS_REGISTRY} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
