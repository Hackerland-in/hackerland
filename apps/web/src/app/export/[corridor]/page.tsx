import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  EXPORT_CORRIDORS_CATALOG,
  EXPORT_CORRIDOR_SLUGS,
  corridorSlugToId,
} from '@/lib/data/export-trade-data';
import { CorridorDetailView } from '@/components/export/corridor-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

interface ExportCorridorPageProps {
  params: Promise<{ corridor: string }>;
}

export async function generateStaticParams() {
  return EXPORT_CORRIDOR_SLUGS.map((corridor) => ({
    corridor,
  }));
}

export async function generateMetadata({ params }: ExportCorridorPageProps): Promise<Metadata> {
  const { corridor } = await params;
  const corridorId = corridorSlugToId(corridor);
  const playbook = corridorId
    ? EXPORT_CORRIDORS_CATALOG.find((item) => item.corridorId === corridorId)
    : undefined;

  if (!playbook) {
    return { title: 'Export Corridor Not Found | Hackerland' };
  }

  return {
    title: `${playbook.name} | India Export Playbook & Incoterms Lab | Hackerland`,
    description: `${playbook.regionTagline}. ${playbook.headline} ${playbook.ftaPerkSummary}`,
    openGraph: {
      title: `${playbook.name} — Regulatory & Incoterms 2020 Playbook`,
      description: playbook.ftaPerkSummary,
      type: 'article',
    },
  };
}

export default async function ExportCorridorDetailPage({ params }: ExportCorridorPageProps) {
  const { corridor } = await params;
  const corridorId = corridorSlugToId(corridor);
  const playbook = corridorId
    ? EXPORT_CORRIDORS_CATALOG.find((item) => item.corridorId === corridorId)
    : undefined;

  if (!playbook) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="export_trade"
        title={playbook.name}
        subtitle={playbook.regionTagline}
        category="Global Export Corridor"
        badge={playbook.ftaBadge}
        backHref="/export"
        backLabel="Export & Trade Hub"
        currentRoute={`/export/${playbook.slug}`}
      >
        <CorridorDetailView playbook={playbook} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
