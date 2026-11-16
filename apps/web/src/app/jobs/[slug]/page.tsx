import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobBySlug, getAllJobSlugs } from '@/lib/data/jobs-data';
import { JobDetailView } from '@/components/jobs/job-detail-view';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: 'Job Not Found | Hackerland Jobs',
    };
  }

  return {
    title: `${job.title} at ${job.company.name} | Hardware Jobs & Fellowships | Hackerland`,
    description: `Apply for ${job.title} at ${job.company.name} (${job.workLocation}). Hands-on role with ${job.hardwareBenchesUsed.slice(0, 2).join(', ')}. Proof-of-work hiring.`,
    openGraph: {
      title: `${job.title} at ${job.company.name} | Hackerland`,
      description: `Hands-on hardware engineering role. ${job.workLocation}.`,
      type: 'website',
    },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
      <JobDetailView job={job} />
    </div>
  );
}
