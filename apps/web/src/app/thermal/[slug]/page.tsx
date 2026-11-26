import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { THERMAL_PROFILES_REGISTRY } from '@/lib/data/thermal-data';
import { calculateThermalDissipation } from '@hackerland/core';
import { ThermalDetailView } from '@/components/thermal/thermal-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface ThermalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return THERMAL_PROFILES_REGISTRY.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ThermalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = THERMAL_PROFILES_REGISTRY.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Thermal Profile Not Found | Hackerland',
    };
  }

  const result = calculateThermalDissipation({
    powerDissipationWatts: project.powerDissipationWatts,
    ambientTemperatureC: project.operatingAmbientTemperatureC,
    maxJunctionTemperatureC: project.params.maxJunctionTemperatureC,
    junctionToCaseResistanceCPerW: project.params.junctionToCaseResistanceCPerW,
    timMaterial: project.timMaterial,
    timContactAreaCm2: project.params.timContactAreaCm2,
    heatsinkMaterial: project.heatsinkMaterial,
    coolingMethod: project.coolingMethod,
    heatsinkWidthMm: project.params.heatsinkWidthMm,
    heatsinkLengthMm: project.params.heatsinkLengthMm,
    baseThicknessMm: project.params.baseThicknessMm,
    finHeightMm: project.params.finHeightMm,
    finThicknessMm: project.params.finThicknessMm,
    numberOfFins: project.params.numberOfFins,
  });

  return {
    title: `${project.title} (Tj: ${result.junctionTemperatureC}°C) | Hackerland Thermal`,
    description: `${project.deviceType} dissipating ${project.powerDissipationWatts}W in ${project.operatingAmbientTemperatureC}°C ambient. Total thermal resistance: ${result.thetaTotal}°C/W. Headroom: +${result.thermalHeadroomC}°C. Tested at ${project.indianTestFacility}.`,
    keywords: [
      project.title,
      project.deviceType,
      project.coolingMethod,
      project.heatsinkMaterial,
      project.indianTestFacility,
      'heatsink fin efficiency',
      'thermal resistance network',
      'junction temperature calculation',
    ],
    openGraph: {
      title: `${project.title} | Hackerland Thermal Profiler`,
      description: project.application,
      url: `https://www.hackerland.in/thermal/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function ThermalDetailPage({ params }: ThermalDetailPageProps) {
  const { slug } = await params;
  const project = THERMAL_PROFILES_REGISTRY.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: `${project.deviceType} thermal management for ${project.application} verified at ${project.indianTestFacility}.`,
    url: `https://www.hackerland.in/thermal/${project.slug}`,
    inLanguage: 'en_IN',
    author: {
      '@type': 'Organization',
      name: 'Hackerland Thermal Engineering Group',
      url: 'https://www.hackerland.in',
    },
    about: {
      '@type': 'Thing',
      name: 'Thermal Management and Heat Sink Design',
      description: `Power: ${project.powerDissipationWatts}W. Material: ${project.heatsinkMaterial}. Standard: ${project.regulatoryStandard}`,
    },
  };

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="thermal"
        title={project.title}
        subtitle={`${project.deviceType} · ${project.powerDissipationWatts}W Heatsink & Fin Solver`}
        category="Thermal Studio"
        badge={`${project.powerDissipationWatts}W`}
        backHref="/thermal"
        backLabel="All Thermal Labs"
        currentRoute={`/thermal/${project.slug}`}
      >
        {/* Schema.org Article Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThermalDetailView project={project} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
