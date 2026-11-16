import type { Metadata } from 'next';
import { PCBA_ASSEMBLY_CATALOG } from '@/lib/data/assembly-data';
import { AssemblyCatalog } from '@/components/assembly/assembly-catalog';

export const metadata: Metadata = {
  title: 'PCBA Assembly Line & SMT Stencil Visualizer | Hackerland',
  description:
    'Interactive Pick-and-Place (PnP) centroid visualizer, SMT feeder tape planner, and solder stencil foil thickness calculator benchmarked against Indian EMS factories (Kaynes, Syrma SGS, Centum, Dixon).',
  keywords: [
    'pcba assembly visualizer',
    'pnp centroid viewer',
    'smt feeder setup',
    'solder stencil thickness',
    'turnkey pcba cost india',
    'kaynes technology ems',
    'syrma sgs ems',
    'ipc a 610 class 3',
  ],
  openGraph: {
    title: 'PCBA Assembly Line & SMT Stencil Visualizer | Hackerland',
    description:
      'Interactive Pick-and-Place machine placement map, solder stencil optimizer, and Indian EMS factory quote estimator.',
    url: 'https://www.hackerland.in/assembly',
    siteName: 'Hackerland',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function AssemblyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hackerland PCBA Assembly & SMT Stencil Directory',
    description: 'Pick-and-place centroid visualizer and Indian EMS turnkey manufacturing models.',
    itemListElement: PCBA_ASSEMBLY_CATALOG.map((proj, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TechArticle',
        headline: proj.name,
        description: proj.description,
        url: `https://www.hackerland.in/assembly/${proj.slug}`,
      },
    })),
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono font-medium text-primary">
          <span>🏭 SMT ASSEMBLY LINE & PICK-AND-PLACE CENTROIDS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          PCBA Assembly & Stencil Visualizer
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Inspect 2D pick-and-place component coordinate maps, evaluate SMT feeder slot loading, optimize electropolished stainless steel solder stencil foil thickness, and model turnkey assembly costs across India&apos;s leading EMS manufacturing plants.
        </p>
      </div>

      <AssemblyCatalog initialProjects={PCBA_ASSEMBLY_CATALOG} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
