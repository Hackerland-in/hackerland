'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Flame,
  FolderKanban,
  Users,
  Trophy,
  Zap,
  GraduationCap,
  Cpu,
  Plus,
  Hash,
  Sparkles,
  Briefcase,
  Rocket,
  Compass,
  Lightbulb,
  Globe2,
  Factory,
  IndianRupee,
} from 'lucide-react';
import { Button, cn } from '@hackerland/ui';

const PRIMARY_LINKS = [
  { href: '/', label: 'Home Hub', icon: Home, exact: true },
  { href: '/feed', label: 'Community Feed', icon: Flame },
  { href: '/sectors', label: 'All 10 Sectors', icon: Compass, badge: 'New' },
  { href: '/resources', label: 'Funding & Free Labs', icon: IndianRupee, badge: '₹0' },
  { href: '/ideas', label: 'IdeaLab & Problems', icon: Lightbulb },
  { href: '/learn', label: 'Learn & Academy', icon: GraduationCap },
  { href: '/projects', label: 'Builds & Squads', icon: FolderKanban },
  { href: '/squads', label: 'Squad Rooms', icon: Users },
  { href: '/earn', label: 'Bounties & Grants', icon: Trophy },
  { href: '/sprints', label: '48H Sprints', icon: Zap, badge: 'Live' },
  { href: '/jobs', label: 'Proof-of-Work Jobs', icon: Briefcase },
  { href: '/manufacturing', label: 'Hardware Labs', icon: Cpu },
  { href: '/how-to-start', label: 'Pilot-to-Plant', icon: Factory },
  { href: '/export', label: 'Global Export Hub', icon: Globe2, badge: 'Export' },
  { href: '/launchpad', label: 'Launchpad', icon: Rocket },
  { href: '/leaderboard', label: 'Leaderboard', icon: Sparkles },
];

const POPULAR_TAGS = [
  'open-hardware',
  'ev-bms',
  'agritech',
  'medtech',
  'textiles',
  'robotics',
  'ai-dpi',
];

export function LeftCommunityRail() {
  const pathname = usePathname();

  return (
    <aside aria-label="Community Navigation" className="space-y-6">
      {/* Main Nav Links */}
      <nav className="space-y-1">
        {PRIMARY_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center justify-between gap-2.5 rounded-full px-3.5 py-2 text-body-sm font-display transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent-fg font-semibold'
                  : 'text-fg-muted hover:bg-surface-1 hover:text-fg',
              )}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn('size-[17px] shrink-0', isActive ? 'text-accent' : 'text-fg-subtle')}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </span>
              {item.badge ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-on-solid">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Primary Action Pill */}
      <Button asChild variant="primary" className="w-full shadow-glow-accent">
        <Link href="/new">
          <Plus className="size-4" aria-hidden="true" />
          <span>Post a Project</span>
        </Link>
      </Button>

      {/* Topics / Channels */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-label-md text-fg">Active Channels</h2>
          <Link href="/feed" className="text-[12px] font-medium text-accent-fg hover:underline">
            All
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/feed?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-2/70 px-2.5 py-1 text-[12px] font-medium text-fg-muted hover:border-accent/40 hover:bg-accent/8 hover:text-accent-fg transition-colors"
            >
              <Hash className="size-3 text-accent/80" aria-hidden="true" />
              <span>{tag}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
