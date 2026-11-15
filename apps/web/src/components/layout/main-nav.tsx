'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hackerland/ui';

const NAV_ITEMS = [
  { href: '/feed', label: 'Feed' },
  { href: '/projects', label: 'Projects' },
  { href: '/earn', label: 'Earn' },
  { href: '/learn', label: 'Learn' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'px-3.5 py-2 text-body-sm font-display font-medium rounded-md transition-colors',
              isActive
                ? 'text-accent bg-surface-2 border border-accent/20'
                : 'text-fg-muted hover:text-fg hover:bg-surface-1'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
