import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClubBySlug, getAllClubSlugs } from '@/lib/data/clubs-data';
import { ClubDetailView } from '@/components/clubs/club-detail-view';

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <ClubDetailView club={club} />
    </div>
  );
}
