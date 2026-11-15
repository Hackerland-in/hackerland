'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, FolderKanban, Plus, Cpu, User } from 'lucide-react';
import { cn } from '@hackerland/ui';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: '/feed', label: 'Feed', icon: Compass },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/new', label: 'Start', icon: Plus, isAction: true },
    { href: '/manufacturing', label: 'Hardware', icon: Cpu },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-[calc(4rem+env(safe-area-inset-bottom,0px))] items-center justify-around border-t border-hairline bg-canvas/95 backdrop-blur md:hidden px-2 pb-[env(safe-area-inset-bottom,0px)]"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        if (item.isAction) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label="Start project"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-on-solid shadow-glow-accent transition-transform active:scale-95"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 transition-colors',
              isActive ? 'text-accent' : 'text-fg-subtle hover:text-fg'
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-label-sm font-display mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
