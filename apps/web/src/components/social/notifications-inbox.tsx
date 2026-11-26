'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, Check, CheckCheck, Radio, Sparkles, Users, AlertCircle, Bell } from 'lucide-react';
import { Badge, Button, Card, CardBody, EmptyState, cn } from '@hackerland/ui';
import { formatDate } from '@/lib/format';
import type { NotificationItem } from '@/lib/data/types';

export interface NotificationsInboxProps {
  initialNotifications: NotificationItem[];
}

export function NotificationsInbox({ initialNotifications }: NotificationsInboxProps) {
  const [readIds, setReadIds] = useState<string[]>(() =>
    initialNotifications.filter((n) => n.read).map((n) => n.id),
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | NotificationItem['type']>(
    'all',
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackerland_read_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReadIds((prev) => Array.from(new Set([...prev, ...parsed])));
        }
      }
    } catch {}
  }, []);

  const persistReadIds = (next: string[]) => {
    setReadIds(next);
    try {
      localStorage.setItem('hackerland_read_notifications', JSON.stringify(next));
    } catch {}
  };

  const notificationsWithState = useMemo(
    () =>
      initialNotifications.map((n) => ({
        ...n,
        read: readIds.includes(n.id),
      })),
    [initialNotifications, readIds],
  );

  const unreadCount = notificationsWithState.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return notificationsWithState.filter((n) => {
      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'all') return true;
      return n.type === activeFilter;
    });
  }, [notificationsWithState, activeFilter]);

  const handleToggleRead = (id: string, currentlyRead: boolean) => {
    if (currentlyRead) {
      persistReadIds(readIds.filter((x) => x !== id));
    } else {
      persistReadIds(Array.from(new Set([...readIds, id])));
      void fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', id }),
      }).catch(() => {});
    }
  };

  const handleMarkAllRead = () => {
    const allIds = initialNotifications.map((n) => n.id);
    persistReadIds(allIds);
    void fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read' }),
    }).catch(() => {});
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'squad_apply':
        return <Users className="size-4 text-accent" aria-hidden="true" />;
      case 'bounty_claim':
        return <Award className="size-4 text-earn-fg" aria-hidden="true" />;
      case 'ship_update':
        return <Radio className="size-4 text-make-fg" aria-hidden="true" />;
      case 'reaction':
        return <Sparkles className="size-4 text-design-fg" aria-hidden="true" />;
      default:
        return <AlertCircle className="size-4 text-fg-subtle" aria-hidden="true" />;
    }
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Control Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All (${notificationsWithState.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'squad_apply', label: 'Squads' },
            { id: 'bounty_claim', label: 'Bounties' },
            { id: 'ship_update', label: 'Ship Updates' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-body-xs font-display font-semibold transition-all',
                activeFilter === tab.id
                  ? 'bg-accent text-on-solid shadow-xs'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="soft"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="size-3.5" aria-hidden="true" />
          <span>Mark all read</span>
        </Button>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <EmptyState
          title="All caught up"
          description="No notifications in this filter right now. Check back after your squad pushes updates."
          action={
            activeFilter !== 'all' ? (
              <Button variant="secondary" size="sm" onClick={() => setActiveFilter('all')}>
                View all alerts
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3 min-w-0">
          {filtered.map((notif) => (
            <Card
              key={notif.id}
              className={cn(
                'transition-all hover:border-accent/40 min-w-0',
                !notif.read ? 'border-accent/35 bg-surface-1 shadow-xs' : 'bg-surface-1/75',
              )}
            >
              <CardBody className="flex items-start gap-3.5 p-4 sm:p-5 min-w-0">
                <div
                  className={cn(
                    'mt-0.5 rounded-full border p-2.5 shrink-0',
                    !notif.read
                      ? 'border-accent/25 bg-accent-soft'
                      : 'border-hairline bg-surface-2',
                  )}
                >
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h2 className="font-display text-body-md font-bold text-fg truncate">
                        {notif.title}
                      </h2>
                      {!notif.read && (
                        <Badge tone="accent" variant="solid">
                          <Bell className="size-2.5" aria-hidden="true" />
                          <span>New</span>
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-fg-subtle tabular-nums shrink-0">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>

                  <p className="text-body-sm text-fg-muted [overflow-wrap:anywhere]">
                    {notif.message}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <Button asChild size="sm" variant="secondary">
                      <Link href={notif.link}>View Details &rarr;</Link>
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleToggleRead(notif.id, notif.read)}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-body-xs font-display font-medium text-fg-subtle hover:bg-surface-2 hover:text-accent-fg transition-colors"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      <span>{notif.read ? 'Mark unread' : 'Mark read'}</span>
                    </button>
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
