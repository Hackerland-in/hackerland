import React from 'react';
import { BookOpen } from 'lucide-react';
import { listBuildStories } from '@/lib/data/stories-data';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { StoriesExplorer } from '@/components/social/stories-explorer';

export const metadata = {
  title: 'Build Journey Archive & Founder Histories',
  description:
    'Deep, structured build histories of real companies, hardware breakthroughs, and inventions. Decision archaeology, early prototypes, and unit economics.',
};

export default async function StoriesPage() {
  const stories = await listBuildStories();

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <BookOpen className="size-3.5" aria-hidden="true" />
            <span>Hackerland Knowledge Universe</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            The Build Journey Archive
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Study the real engineering inflection points behind ambitious builds: early hardware prototypes, unit economics, and interactive decision archaeology.
          </p>
        </header>

        <StoriesExplorer initialStories={stories} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
