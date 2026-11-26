'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { Bell, Check, ExternalLink, Sparkles, Users, Award, Radio, AlertCircle } from 'lucide-react';
import { Badge, cn } from '@hackerland/ui';
import type { NotificationItem } from '@/lib/data/types';

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, startTransition] = useTransition();
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) {
          startTransition(() => {
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'squad_apply':
        return <Users className="h-4 w-4 text-accent-fg" />;
      case 'bounty_claim':
        return <Award className="h-4 w-4 text-earn-fg" />;
      case 'ship_update':
        return <Radio className="h-4 w-4 text-make-fg" />;
      case 'reaction':
        return <Sparkles className="h-4 w-4 text-design-fg" />;
      default:
        return <AlertCircle className="h-4 w-4 text-fg-subtle" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface-1 text-fg-muted transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-display text-[10px] font-bold text-on-solid ring-2 ring-surface-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notification Center"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-hairline bg-surface-1 shadow-overlay z-50 overflow-hidden min-w-0"
        >
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3 bg-surface-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-fg text-body-sm">Activity</span>
              {unreadCount > 0 && (
                <Badge tone="accent" variant="outline">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-body-sm font-display font-medium text-accent-fg hover:underline flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-hairline">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-body-sm text-fg-muted">
                All caught up! No new activity.
              </div>
            ) : (
              notifications.slice(0, 6).map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.link}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-start gap-3 p-3.5 transition-colors hover:bg-surface-2 min-w-0 block',
                    !notif.read && 'bg-accent/5',
                  )}
                >
                  <div className="mt-0.5 rounded-full border border-hairline bg-surface-2 p-2 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-display text-body-sm font-semibold text-fg truncate">
                      {notif.title}
                    </p>
                    <p className="text-body-sm text-fg-muted line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-hairline px-4 py-2.5 bg-surface-2/50 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-body-sm font-display font-semibold text-accent-fg hover:underline inline-flex items-center gap-1"
            >
              <span>View all activity</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
