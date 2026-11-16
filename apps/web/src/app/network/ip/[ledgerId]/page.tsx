import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getDefensivePublicationById,
  getAllDefensivePublicationIds,
} from '@/lib/data/ip-defense-data';
import { DefensivePublicationDetail } from '@/components/network/ip/defensive-publication-detail';

interface DefensivePublicationPageProps {
  params: Promise<{ ledgerId: string }>;
}

export async function generateStaticParams() {
  const ids = getAllDefensivePublicationIds();
  return ids.map((ledgerId) => ({ ledgerId }));
}

export async function generateMetadata({
  params,
}: DefensivePublicationPageProps): Promise<Metadata> {
  const { ledgerId } = await params;
  const publication = getDefensivePublicationById(ledgerId);

  if (!publication) {
    return {
      title: 'Publication Not Found · Hackerland IP Defense',
    };
  }

  return {
    title: `${publication.title} (${publication.id}) · Prior Art Defense Ledger · Hackerland`,
    description: publication.abstractSummary,
  };
}

export default async function DefensivePublicationPage({ params }: DefensivePublicationPageProps) {
  const { ledgerId } = await params;
  const publication = getDefensivePublicationById(ledgerId);

  if (!publication) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <DefensivePublicationDetail publication={publication} />
    </div>
  );
}
