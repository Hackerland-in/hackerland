import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getDefensivePublicationById,
  getAllDefensivePublicationIds,
} from '@/lib/data/ip-defense-data';
import { DefensivePublicationDetail } from '@/components/network/ip/defensive-publication-detail';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <DefensivePublicationDetail publication={publication} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
