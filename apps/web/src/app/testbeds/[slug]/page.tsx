import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import { TestbedDetailView } from '@/components/testbeds/testbed-detail-view';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

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
      <FullScreenLabShell
        labKind="sim_preset"
        title={item.name}
        subtitle="Hardware-in-the-Loop SCPI Bench Console & Slot Booking"
        category="Remote Testbed"
        badge={item.hostLab.city}
        backHref="/testbeds"
        backLabel="All Testbeds"
        currentRoute={`/testbeds/${item.slug}`}
      >
        <TestbedDetailView testbed={item} />
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
