import type { Metadata } from 'next';
import { Bell } from 'lucide-react';
import { listNotifications } from '@/lib/data/queries';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { NotificationsInbox } from '@/components/social/notifications-inbox';

export const metadata: Metadata = {
  title: 'Notifications & Squad Activity · Hackerland',
  description: 'Real-time updates on squad applications, milestone payouts, ship updates, and community activity.',
};

export default async function NotificationsPage() {
  const notifications = await listNotifications();

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Bell className="size-3.5" aria-hidden="true" />
            <span>Mission Control · Dispatch</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            Activity &amp; Notifications
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
            Squad recruitment requests, hardware milestone sign-offs, bounty claims, and live ship dispatches across your network.
          </p>
        </header>

        <NotificationsInbox initialNotifications={notifications} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
