import type { Metadata } from 'next';
import { Factory } from 'lucide-react';
import { PCBA_ASSEMBLY_CATALOG } from '@/lib/data/assembly-data';
import { AssemblyCatalog } from '@/components/assembly/assembly-catalog';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'PCBA Assembly Line & SMT Stencil Visualizer | Hackerland',
  description:
    'Interactive Pick-and-Place (PnP) centroid visualizer, SMT feeder tape planner, and solder stencil foil thickness calculator benchmarked against Indian EMS factories (Kaynes, Syrma SGS, Centum, Dixon).',
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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Factory className="size-3.5" aria-hidden="true" />
            <span>SMT Assembly Line &amp; PnP Centroids</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            PCBA Assembly &amp; Stencil Visualizer
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Inspect 2D pick-and-place coordinates, SMT feeder loading, stainless stencil foil thickness, and turnkey quotes across Indian EMS fabs.
          </p>
        </header>

        <AssemblyCatalog initialProjects={PCBA_ASSEMBLY_CATALOG} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
