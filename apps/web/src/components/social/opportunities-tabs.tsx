'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Rocket, Trophy, Zap } from 'lucide-react';
import { cn } from '@hackerland/ui';

const ECOSYSTEM_TABS = [
  { href: '/earn', label: 'Bounties & Grants', icon: Trophy },
  { href: '/sprints', label: '48H Sprints', icon: Zap },
  { href: '/jobs', label: 'Jobs & Fellowships', icon: Briefcase },
  { href: '/launchpad', label: 'Launchpad', icon: Rocket },
];

export function OpportunitiesTabs() {
  const pathname = usePathname() || '/earn';

  return (
    <nav
      aria-label="Earn and Capital Ecosystem"
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-hairline bg-surface-1 p-2 shadow-xs"
    >
      {ECOSYSTEM_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-body-sm font-display font-semibold transition-all',
              active
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
