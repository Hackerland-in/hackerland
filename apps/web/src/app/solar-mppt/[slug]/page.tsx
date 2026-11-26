import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SOLAR_MPPT_PROJECTS_REGISTRY, getSolarMpptProjectBySlug } from '@/lib/data/solar-mppt-data';
import { simulateSolarMppt } from '@hackerland/core';
import { SolarDetailView } from '@/components/solar-mppt/solar-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface SolarDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SOLAR_MPPT_PROJECTS_REGISTRY.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: SolarDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getSolarMpptProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Solar MPPT Project Not Found | Hackerland',
    };
  }

  const result = simulateSolarMppt({
    irradianceWPerM2: project.operatingConditions.designIrradianceWPerM2,
    cellTemperatureC: project.operatingConditions.designTemperatureC,
    panelSpecs: project.panelSpecs,
    algorithm: project.mpptAlgorithm,
    targetBatteryType: project.targetBattery,
    converterSwitchingFreqKhz: project.converterSpecs.switchingFrequencyKhz,
  });

  return {
    title: `${project.title} (Pmpp: ${result.pmppActualW}W) | Hackerland Solar MPPT`,
    description: `${project.panelSpecs.technology.replace(/_/g, ' ')} delivering ${result.pmppActualW}W at ${project.operatingConditions.designTemperatureC}°C ambient. Buck inductor: ${result.converterInductanceMicroH}μH, Charge current: ${result.batteryCurrentA}A into ${project.targetBattery}. Tested at ${project.indianContextFacility}.`,
    keywords: [
      project.title,
      project.panelSpecs.panelModel,
      project.panelSpecs.technology,
      project.targetBattery,
      project.mpptAlgorithm,
      project.indianContextFacility,
      'solar mppt converter sizing',
      'iv curve simulator',
      'pv single diode model',
    ],
    openGraph: {
      title: `${project.title} | Hackerland Solar Simulator`,
      description: project.application,
      url: `https://www.hackerland.in/solar-mppt/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function SolarDetailPage({ params }: SolarDetailPageProps) {
  const { slug } = await params;
  const project = getSolarMpptProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const result = simulateSolarMppt({
    irradianceWPerM2: project.operatingConditions.designIrradianceWPerM2,
    cellTemperatureC: project.operatingConditions.designTemperatureC,
    panelSpecs: project.panelSpecs,
    algorithm: project.mpptAlgorithm,
    targetBatteryType: project.targetBattery,
    converterSwitchingFreqKhz: project.converterSpecs.switchingFrequencyKhz,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: project.application,
    author: {
      '@type': 'Organization',
      name: 'Hackerland Hardware & Power Electronics Labs',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hackerland',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.hackerland.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.hackerland.in/solar-mppt/${project.slug}`,
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Single-Diode Photovoltaic Physics',
      },
      {
        '@type': 'Thing',
        name: 'Maximum Power Point Tracking (MPPT)',
      },
      {
        '@type': 'Thing',
        name: project.standardsCompliance,
      },
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Actual Peak Power (P_mpp)',
        value: `${result.pmppActualW} W`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Design Voltage (V_mpp)',
        value: `${result.vmppActualV} V`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Buck Sizing Inductor',
        value: `${result.converterInductanceMicroH} μH`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Indian Validation Facility',
        value: project.indianContextFacility,
      },
    ],
  };

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="solar_mppt"
        title={project.title}
        subtitle={`${project.application} · I-V / P-V Sweeps & Buck Sizing`}
        category="Solar MPPT Lab"
        badge={project.mpptAlgorithm}
        backHref="/solar-mppt"
        backLabel="All Solar MPPT"
        currentRoute={`/solar-mppt/${project.slug}`}
      >
        {/* Schema.org Microdata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <SolarDetailView project={project} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
