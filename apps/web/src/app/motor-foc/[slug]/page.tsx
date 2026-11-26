import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOTOR_FOC_PROJECTS_REGISTRY, getMotorFocProjectBySlug } from '@/lib/data/motor-foc-data';
import { simulateMotorFoc } from '@hackerland/core';
import { MotorDetailView } from '@/components/motor-foc/motor-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface MotorDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MOTOR_FOC_PROJECTS_REGISTRY.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: MotorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getMotorFocProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Motor FOC Project Not Found | Hackerland',
    };
  }

  const result = simulateMotorFoc({
    targetSpeedRpm: project.defaultOperatingSpeedRpm,
    loadTorqueNm: project.defaultLoadTorqueNm,
    motor: project.motorParams,
    pwmFrequencyKhz: project.recommendedPwmKhz,
    dcBusVoltageV: project.motorParams.dcBusVoltageV,
  });

  return {
    title: `${project.title} (Torque: ${result.totalTorqueNm}Nm, ${(result.mechanicalPowerWatts / 1000).toFixed(1)}kW) | Hackerland FOC`,
    description: `${project.motorParams.topology.replace(/_/g, ' ')} producing ${result.totalTorqueNm}Nm at ${project.defaultOperatingSpeedRpm} RPM. Phase RMS: ${result.phaseCurrentRmsA}A, Inverter Efficiency: ${result.inverterEfficiencyPercent}%, SVPWM Sector ${result.currentSector}. Tested at ${project.indianContextFacility}.`,
    keywords: [
      project.title,
      project.motorParams.motorModel,
      project.motorParams.topology,
      project.feedbackSensor,
      project.indianContextFacility,
      'bldc foc simulation',
      'svpwm switching states',
      'pmsm park clarke transforms',
    ],
    openGraph: {
      title: `${project.title} | Hackerland Motor FOC Simulator`,
      description: project.vehicleApplication,
      url: `https://www.hackerland.in/motor-foc/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function MotorDetailPage({ params }: MotorDetailPageProps) {
  const { slug } = await params;
  const project = getMotorFocProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const result = simulateMotorFoc({
    targetSpeedRpm: project.defaultOperatingSpeedRpm,
    loadTorqueNm: project.defaultLoadTorqueNm,
    motor: project.motorParams,
    pwmFrequencyKhz: project.recommendedPwmKhz,
    dcBusVoltageV: project.motorParams.dcBusVoltageV,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: project.vehicleApplication,
    author: {
      '@type': 'Organization',
      name: 'Hackerland EV Powertrain & Motor Control Labs',
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
      '@id': `https://www.hackerland.in/motor-foc/${project.slug}`,
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Field-Oriented Control (FOC)',
      },
      {
        '@type': 'Thing',
        name: 'Space Vector Pulse Width Modulation (SVPWM)',
      },
      {
        '@type': 'Thing',
        name: project.standardsCompliance,
      },
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Rated Peak Power',
        value: `${project.peakPowerWatts} W`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Electromagnetic Torque',
        value: `${result.totalTorqueNm} N·m`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Phase Current RMS',
        value: `${result.phaseCurrentRmsA} A`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Inverter Efficiency',
        value: `${result.inverterEfficiencyPercent}%`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Indian Dyno Facility',
        value: project.indianContextFacility,
      },
    ],
  };

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="motor_foc"
        title={project.title}
        subtitle={`${project.vehicleApplication} · SVPWM & Clarke/Park Control`}
        category="Motor FOC Studio"
        badge={`${project.recommendedPwmKhz} kHz PWM`}
        backHref="/motor-foc"
        backLabel="All Motor FOC"
        currentRoute={`/motor-foc/${project.slug}`}
      >
        {/* Schema.org Microdata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <MotorDetailView project={project} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
