import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';
import { TestbedDetailView } from '@/components/testbeds/testbed-detail-view';

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
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <TestbedDetailView testbed={item} />
    </div>
  );
}
