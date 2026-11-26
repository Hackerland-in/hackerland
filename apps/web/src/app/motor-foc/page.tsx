import type { Metadata } from 'next';
import { MOTOR_FOC_PROJECTS_REGISTRY } from '@/lib/data/motor-foc-data';
import { MotorCatalog } from '@/components/motor-foc/motor-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'BLDC & PMSM Field-Oriented Control (FOC) Simulator | Hackerland',
  description:
    'Rotor-flux aligned Field-Oriented Control (FOC) and Space Vector PWM (SVPWM) simulator across Indian EV and agricultural powertrains.',
  openGraph: {
    title: 'BLDC & PMSM Field-Oriented Control (FOC) Simulator | Hackerland',
    description:
      'Model Clarke/Park transforms, Space Vector PWM hexagon sectors, and IPM reluctance torque.',
    url: 'https://www.hackerland.in/motor-foc',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function MotorFocPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland Motor FOC & SVPWM Powertrain Engineering Registry',
    description:
      'Field-Oriented Control coordinate transforms, Space Vector PWM switching sectors, and motor controller tuning data.',
    itemListElement: MOTOR_FOC_PROJECTS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.motorParams.topology} rated ${proj.peakPowerWatts}W peak with ${proj.inverterSpecs.switchTechnology} inverter.`,
        url: `https://www.hackerland.in/motor-foc/${proj.slug}`,
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
        <MotorCatalog initialProjects={MOTOR_FOC_PROJECTS_REGISTRY} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
