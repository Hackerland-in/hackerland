import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubBySlug, getAllClubSlugs } from '@/lib/data/clubs-data';
import { ClubDetailView } from '@/components/clubs/club-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface ClubDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllClubSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ClubDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = getClubBySlug(slug);

  if (!club) {
    return {
      title: 'Club Not Found · Hackerland',
    };
  }

  return {
    title: `${club.name} · Innovation Clubs & ATL Hub · Hackerland`,
    description: club.summary,
  };
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { slug } = await params;
  const club = getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <ClubDetailView club={club} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
