import type { Metadata } from 'next';
import { MOTOR_FOC_PROJECTS_REGISTRY } from '@/lib/data/motor-foc-data';
import { MotorCatalog } from '@/components/motor-foc/motor-catalog';

export const metadata: Metadata = {
  title: 'BLDC & PMSM Field-Oriented Control (FOC) Simulator | Hackerland',
  description:
    'Rotor-flux aligned Field-Oriented Control (FOC) and Space Vector PWM (SVPWM) simulator. Model Clarke/Park transformations, MTPA reluctance torque saliency (Lq > Ld), field-weakening high-speed overdrive, and PI current loop tuning across Ather 450X PMSM, Ola S1 Pro IPM, PM-KUSUM solar agricultural pumps, and Euler HiLoad commercial EV powertrains.',
  keywords: [
    'foc motor simulator',
    'field oriented control bldc',
    'pmsm foc algorithm',
    'space vector pwm hexagon',
    'svpwm dwell times',
    'clarke park transform calculator',
    'mtpa reluctance torque',
    'field weakening pmsm',
    'ather 450x motor controller',
    'ola s1 pro ipm motor',
    'pm kusum bldc pump controller',
    'arai ais 041 electric powertrain',
  ],
  openGraph: {
    title: 'BLDC & PMSM Field-Oriented Control (FOC) Simulator | Hackerland',
    description:
      'Model Clarke/Park transforms, Space Vector PWM hexagon sectors, and IPM reluctance torque for Indian EV and industrial powertrains.',
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
    description: 'Field-Oriented Control coordinate transforms, Space Vector PWM switching sectors, and motor controller tuning data.',
    itemListElement: MOTOR_FOC_PROJECTS_REGISTRY.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.title,
        description: `${proj.motorParams.topology} rated ${proj.peakPowerWatts}W peak with ${proj.inverterSpecs.switchTechnology} inverter. Tested at ${proj.indianContextFacility}.`,
        url: `https://www.hackerland.in/motor-foc/${proj.slug}`,
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

      <MotorCatalog initialProjects={MOTOR_FOC_PROJECTS_REGISTRY} />
    </div>
  );
}
