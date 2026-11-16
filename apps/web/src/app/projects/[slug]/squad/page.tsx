import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import { SQUADS_DATA, getSquadRoomBySlug } from '@/lib/data/squads-data';
import { SquadRoomWorkspace } from '@/components/squad/squad-room-workspace';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SQUADS_DATA.map((s) => ({
    slug: s.projectSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const squad = getSquadRoomBySlug(slug);
  if (!squad) return { title: 'Squad Room Not Found' };

  return {
    title: `${squad.projectTitle} Squad Room & Milestone Escrow | Hackerland`,
    description: squad.tagline,
  };
}

export default async function ProjectSquadRoomPage({ params }: Props) {
  const { slug } = await params;
  const squad = getSquadRoomBySlug(slug);

  if (!squad) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Link href="/squads" className="hover:text-white transition flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> All Squads
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <Link href={`/projects/${squad.projectSlug}`} className="hover:text-white transition">
              {squad.projectTitle}
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-emerald-400 font-medium">Squad Room</span>
          </div>

          <Link
            href={`/projects/${squad.projectSlug}`}
            className="text-neutral-400 hover:text-white transition"
          >
            ← Back to Project Overview
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SquadRoomWorkspace squadRoom={squad} />
      </div>
    </div>
  );
}
