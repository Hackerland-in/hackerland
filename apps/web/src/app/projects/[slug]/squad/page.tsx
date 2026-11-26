import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { SQUADS_DATA, getSquadRoomBySlug } from '@/lib/data/squads-data';
import { SquadRoomWorkspace } from '@/components/squad/squad-room-workspace';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';

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
    title: `${squad.projectTitle} Squad Room`,
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
    <SocialCommunityProvider>
      <SocialShell>
        {/* Clean White Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-1 px-4 py-3 text-body-sm shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-fg-muted min-w-0">
            <Link
              href="/squads"
              className="hover:text-accent-fg transition-colors inline-flex items-center gap-1.5 font-display font-medium"
            >
              <Users className="size-3.5" aria-hidden="true" />
              <span>All Squads</span>
            </Link>
            <ChevronRight className="size-3.5 text-fg-subtle shrink-0" aria-hidden="true" />
            <Link
              href={`/projects/${squad.projectSlug}`}
              className="hover:text-accent-fg transition-colors truncate max-w-[180px] sm:max-w-xs"
            >
              {squad.projectTitle}
            </Link>
            <ChevronRight className="size-3.5 text-fg-subtle shrink-0" aria-hidden="true" />
            <span className="font-display font-semibold text-accent-fg">Squad Room</span>
          </div>

          <Link
            href={`/projects/${squad.projectSlug}`}
            className="inline-flex items-center gap-1 font-display font-medium text-fg-muted hover:text-accent-fg transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Back to Project</span>
          </Link>
        </div>

        <SquadRoomWorkspace squadRoom={squad} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
