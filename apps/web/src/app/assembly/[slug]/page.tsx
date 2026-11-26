import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PCBA_ASSEMBLY_CATALOG } from '@/lib/data/assembly-data';
import { AssemblyDetailView } from '@/components/assembly/assembly-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface AssemblyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PCBA_ASSEMBLY_CATALOG.map((proj) => ({
    slug: proj.slug,
  }));
}

export async function generateMetadata({ params }: AssemblyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PCBA_ASSEMBLY_CATALOG.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'PCBA Assembly Project Not Found | Hackerland',
    };
  }

  return {
    title: `${project.name} (${project.layerCount}-Layer) | Hackerland Assembly`,
    description: `${project.description} ${project.boardDimensions.widthMm}x${project.boardDimensions.heightMm}mm board with ${project.placements.length} SMT placements and ${project.recommendedFoilThickness} stencil foil. EMS Partner: ${project.recommendedEmsPartner.name} (${project.recommendedEmsPartner.city}).`,
    keywords: [
      project.name,
      'pcba assembly',
      'pnp centroid map',
      project.recommendedEmsPartner.name,
      'smt stencil thickness',
      'turnkey pcb manufacturing india',
    ],
    openGraph: {
      title: `${project.name} | Hackerland SMT Visualizer`,
      description: project.description,
      url: `https://www.hackerland.in/assembly/${project.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function AssemblyDetailPage({ params }: AssemblyPageProps) {
  const { slug } = await params;
  const project = PCBA_ASSEMBLY_CATALOG.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: project.name,
    description: project.description,
    author: {
      '@type': 'Organization',
      name: 'Hackerland Open Hardware Engineering',
    },
    publisher: {
      '@type': 'Organization',
      name: project.recommendedEmsPartner.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.recommendedEmsPartner.city,
        addressRegion: project.recommendedEmsPartner.state,
        addressCountry: 'IN',
      },
    },
  };

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="pcb"
        title={project.name}
        subtitle={`${project.layerCount}-Layer SMT Pick & Place Centroid & Stencil Inspector`}
        category="PCBA Assembly"
        badge={`${project.placements.length} Placements`}
        backHref="/assembly"
        backLabel="All Assemblies"
        currentRoute={`/assembly/${project.slug}`}
        edgeToEdge
      >
        <AssemblyDetailView project={project} />

        {/* JSON-LD Technical Article Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
