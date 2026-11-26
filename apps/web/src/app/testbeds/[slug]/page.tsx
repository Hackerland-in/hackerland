import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import { TestbedDetailView } from '@/components/testbeds/testbed-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface TestbedPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TESTBED_FACILITIES.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: TestbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = TESTBED_FACILITIES.find((tb) => tb.slug === slug);
  if (!item) {
    return { title: 'Testbed Not Found | Hackerland' };
  }

  return {
    title: `${item.name} | Remote HIL Testbed Facility`,
    description: item.description,
    openGraph: {
      title: `${item.name} - Remote SCPI & Lab Booking`,
      description: item.description,
      type: 'article',
    },
  };
}

export default async function TestbedDetailPage({ params }: TestbedPageProps) {
  const { slug } = await params;
  const item = TESTBED_FACILITIES.find((tb) => tb.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <TestbedDetailView testbed={item} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
