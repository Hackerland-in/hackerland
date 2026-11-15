import type { Metadata } from 'next';
import Link from 'next/link';
import { listNotifications } from '@/lib/data/queries';
import { Badge, Button, Card, CardBody, EmptyState, SectionHeader } from '@hackerland/ui';
import { Award, Radio, Sparkles, Users, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { NotificationItem } from '@/lib/data/types';

export const metadata: Metadata = {
  title: 'Notifications & Squad Activity · Hackerland',
  description: 'Real-time updates on squad applications, milestone payouts, ship updates, and community activity.',
};

export default async function NotificationsPage() {
  const notifications = await listNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'squad_apply':
        return <Users className="h-5 w-5 text-accent" />;
      case 'bounty_claim':
        return <Award className="h-5 w-5 text-earn-fg" />;
      case 'ship_update':
        return <Radio className="h-5 w-5 text-make-fg" />;
      case 'reaction':
        return <Sparkles className="h-5 w-5 text-design-fg" />;
      default:
        return <AlertCircle className="h-5 w-5 text-fg-subtle" />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl min-w-0 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="MISSION CONTROL · DISPATCH"
        title="Activity & Notifications"
        description="Squad recruitment requests, hardware milestone sign-offs, and live ship activity across your projects."
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge tone="accent" variant="outline">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        }
      />

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="You have no notifications or activity alerts at this time."
        />
      ) : (
        <div className="space-y-3 min-w-0">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-colors hover:border-accent/40 min-w-0 ${
                !notif.read ? 'border-accent/30 bg-surface-1' : 'bg-surface-1/60'
              }`}
            >
              <CardBody className="flex items-start gap-4 p-4 min-w-0">
                <div className="mt-0.5 rounded-lg border border-hairline bg-surface-2 p-2 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-headline-sm text-fg font-medium truncate">
                      {notif.title}
                    </h2>
                    <span className="font-display text-label-xs text-fg-subtle tabular-nums">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>

                  <p className="text-body-md text-fg-muted [overflow-wrap:anywhere]">
                    {notif.message}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={notif.link}>View Details &rarr;</Link>
                    </Button>
                    {!notif.read && (
                      <span className="font-display text-label-xs text-accent uppercase tracking-wider font-semibold">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
