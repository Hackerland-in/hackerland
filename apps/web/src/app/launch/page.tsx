import type { Metadata } from 'next';
import { Rocket } from 'lucide-react';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { LaunchKit } from '@/components/launch/launch-kit';

export const metadata: Metadata = {
  title: 'Community Launch & Syndication Kit | Hackerland',
  description:
    'Ready-to-post announcement threads, Product Hunt launch packages, Show HN submissions, and channel launch tracker for makers.',
};

export default function LaunchPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Rocket className="size-3.5" aria-hidden="true" />
            <span>Worldwide Announcement Hub</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Community Launch &amp; Syndication Kit
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Customize your announcement once and broadcast across Product Hunt, Hacker News, X, and Reddit while tracking every launched channel.
          </p>
        </header>

        <LaunchKit />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
