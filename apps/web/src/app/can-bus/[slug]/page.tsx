import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CAN_BUS_PROJECTS_REGISTRY, getCanBusProjectBySlug } from '@/lib/data/can-bus-data';
import { simulateCanBus } from '@hackerland/core';
import { CanDetailView } from '@/components/can-bus/can-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface CanDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CAN_BUS_PROJECTS_REGISTRY.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: CanDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getCanBusProjectBySlug(slug);

  if (!project) {
    return {
      title: 'CAN Bus Project Not Found | Hackerland',
    };
  }

  const result = simulateCanBus({
    standard: project.protocolStandard,
    baudRateKbps: project.nominalBaudRateKbps,
    busLengthMeters: project.busTopology.busLengthMeters,
    numberOfNodes: project.busTopology.nodeCount,
    termination: project.busTopology.terminationMethod,
  });

  return {
    title: `${project.title} (Baud: ${project.nominalBaudRateKbps}kbps, SP: ${result.samplePointPercent}%) | Hackerland CAN Bus`,
    description: `${project.automotiveDomain} with ${project.busTopology.nodeCount} ECUs over ${project.busTopology.busLengthMeters}m harness. Bit time: ${result.nominalBitTimeNs}ns, Sample Point: ${result.samplePointPercent}% (${result.samplePointStatus.replace(/_/g, ' ')}), Bus Load: ${result.busLoadPercent}%. Tested at ${project.indianContextFacility}.`,
    keywords: [
      project.title,
      project.protocolStandard,
      project.busTopology.terminationMethod,
      project.busTopology.isolationType,
      project.indianContextFacility,
      'can bus bit timing',
      'sample point validation',
      'automotive can harness',
      'differential transceiver',
    ],
    openGraph: {
      title: `${project.title} | Hackerland CAN Bus Simulator`,
      description: project.automotiveDomain,
      url: `https://www.hackerland.in/can-bus/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function CanDetailPage({ params }: CanDetailPageProps) {
  const { slug } = await params;
  const project = getCanBusProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const result = simulateCanBus({
    standard: project.protocolStandard,
    baudRateKbps: project.nominalBaudRateKbps,
    busLengthMeters: project.busTopology.busLengthMeters,
    numberOfNodes: project.busTopology.nodeCount,
    termination: project.busTopology.terminationMethod,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: project.automotiveDomain,
    author: {
      '@type': 'Organization',
      name: 'Hackerland Automotive Communications & Embedded Systems Lab',
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
      '@id': `https://www.hackerland.in/can-bus/${project.slug}`,
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Controller Area Network (CAN)',
      },
      {
        '@type': 'Thing',
        name: 'ISO 11898 Physical Layer',
      },
      {
        '@type': 'Thing',
        name: project.standardsCompliance,
      },
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Nominal Baud Rate',
        value: `${project.nominalBaudRateKbps} kbps`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Sample Point',
        value: `${result.samplePointPercent}%`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Nominal Bit Time',
        value: `${result.nominalBitTimeNs} ns`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Time Quanta per Bit',
        value: `${result.totalTimeQuantaPerBit} tq`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Bus Harness Length',
        value: `${project.busTopology.busLengthMeters} meters`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Testing Facility',
        value: project.indianContextFacility,
      },
    ],
  };

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="can_bus"
        title={project.title}
        subtitle={`${project.automotiveDomain} · Bit Timing & Bus Load Analyzer`}
        category="CAN Bus Studio"
        badge={`${project.nominalBaudRateKbps} kbps`}
        backHref="/can-bus"
        backLabel="All CAN Bus"
        currentRoute={`/can-bus/${project.slug}`}
      >
        {/* Schema.org Microdata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <CanDetailView project={project} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
