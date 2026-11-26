import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BATTERY_EIS_REGISTRY } from '@/lib/data/battery-eis-data';
import { BatteryEisDetailView } from '@/components/battery-eis/battery-eis-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface BatteryEisPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BATTERY_EIS_REGISTRY.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: BatteryEisPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = BATTERY_EIS_REGISTRY.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Battery EIS Record Not Found | Hackerland',
    };
  }

  const { diagnostics } = project;

  return {
    title: `${project.title} (SoH: ${diagnostics.sohPercent}%) | Hackerland Battery EIS`,
    description: `${project.cellModel} (${project.chemistry}) characterized after ${project.cycleCount} cycles at ${project.testTemperatureC}°C. AIS-156 safety verdict: ${diagnostics.ais156SafetyVerdict}. Tested at ${project.testFacility}.`,
    keywords: [
      project.title,
      project.cellModel,
      project.chemistry,
      project.testFacility,
      'nyquist plot eis',
      'bode plot battery',
      'soh state of health',
      'randles ecm parameters',
      'ais 156 battery compliance',
    ],
    openGraph: {
      title: `${project.title} | Hackerland Battery EIS`,
      description: `EIS evaluation for ${project.cellModel} with SoH of ${diagnostics.sohPercent}%.`,
      url: `https://www.hackerland.in/battery-eis/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function BatteryEisDetailPage({ params }: BatteryEisPageProps) {
  const { slug } = await params;
  const project = BATTERY_EIS_REGISTRY.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.title,
    description: `EIS characterization for ${project.cellModel} (${project.chemistry}) tested under AIS-156 at ${project.testFacility}. SoH: ${project.diagnostics.sohPercent}%.`,
    url: `https://www.hackerland.in/battery-eis/${project.slug}`,
    inLanguage: 'en_IN',
    author: {
      '@type': 'Organization',
      name: 'Hackerland Battery Engineering Council',
      url: 'https://www.hackerland.in',
    },
    about: {
      '@type': 'Thing',
      name: 'Electrochemical Impedance Spectroscopy',
      description: `Cell: ${project.cellModel}. Cycle Count: ${project.cycleCount}. AIS-156 Verdict: ${project.diagnostics.ais156SafetyVerdict}`,
    },
  };

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="battery_eis"
        title={project.title}
        subtitle={`${project.cellModel} (${project.chemistry}) · Nyquist & Bode EIS Fitter`}
        category="Battery EIS Lab"
        badge={`SoH ${project.diagnostics.sohPercent}%`}
        backHref="/battery-eis"
        backLabel="All Battery EIS"
        currentRoute={`/battery-eis/${project.slug}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BatteryEisDetailView project={project} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
