import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';
import { SprintDetailView } from '@/components/sprints/sprint-detail-view';

interface SprintPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SPRINTS_CATALOG.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: SprintPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sprint = SPRINTS_CATALOG.find((s) => s.slug === slug);

  if (!sprint) {
    return {
      title: 'Sprint Not Found | Hackerland',
    };
  }

  const prizeInLakhs = (sprint.totalPrizePoolINR / 100000).toFixed(1);

  return {
    title: `${sprint.title} (₹${prizeInLakhs}L Prize) | Hackerland Sprints`,
    description: `${sprint.tagline} Sponsored by ${sprint.sponsor.name}. 48-hour time-boxed hardware challenge with milestone verification gates.`,
    keywords: [
      sprint.title,
      sprint.track,
      sprint.sponsor.name,
      '48-hour hardware sprint',
      'deeptech build challenge',
      'hardware bounty',
    ],
    openGraph: {
      title: `${sprint.title} | Hackerland 48H Sprint`,
      description: sprint.tagline,
      url: `https://www.hackerland.in/sprints/${sprint.slug}`,
      siteName: 'Hackerland',
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function SprintDetailPage({ params }: SprintPageProps) {
  const { slug } = await params;
  const sprint = SPRINTS_CATALOG.find((s) => s.slug === slug);

  if (!sprint) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: sprint.title,
    description: sprint.tagline,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus:
      sprint.currentStatus === 'active'
        ? 'https://schema.org/EventScheduled'
        : sprint.currentStatus === 'completed'
        ? 'https://schema.org/EventMovedOnline'
        : 'https://schema.org/EventPostponed',
    organizer: {
      '@type': 'Organization',
      name: sprint.sponsor.name,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    performer: sprint.juryPanel.map((j) => ({
      '@type': 'Person',
      name: j.name,
      jobTitle: j.role,
    })),
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <SprintDetailView sprint={sprint} />

      {/* JSON-LD Event Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
