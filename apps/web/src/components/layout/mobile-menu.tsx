'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  FolderKanban,
  Compass,
  Cpu,
  Gauge,
  Atom,
  Coins,
  GraduationCap,
  BookOpen,
  Factory,
  Trophy,
  Plus,
} from 'lucide-react';
import { Button, IconButton, cn } from '@hackerland/ui';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const SECTIONS = [
    {
      heading: 'Discover & Build',
      items: [
        { href: '/projects', label: 'Explore Projects', icon: FolderKanban },
        { href: '/feed', label: 'Community Feed', icon: Compass },
        { href: '/new', label: 'Start a Project', icon: Plus },
        { href: '/leaderboard', label: 'Top Innovators', icon: Trophy },
      ],
    },
    {
      heading: 'Hardware & Engineering',
      items: [
        { href: '/manufacturing', label: 'Manufacturing Hub', icon: Cpu },
        { href: '/manufacturing/physics', label: 'Vehicle Physics Suite', icon: Gauge },
        { href: '/labs', label: 'Makerspaces & ATL Nodes', icon: Atom },
      ],
    },
    {
      heading: 'Opportunities & Academy',
      items: [
        { href: '/earn', label: 'Earn (Bounties & Grants)', icon: Coins },
        { href: '/learn', label: 'Learn by Doing Roadmaps', icon: GraduationCap },
        { href: '/entrepreneurship', label: 'Founder Academy', icon: BookOpen },
        { href: '/how-to-start', label: 'Factory Blueprints', icon: Factory },
      ],
    },
  ];

  return (
    <div className="md:hidden">
      <IconButton
        label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
        className="text-fg"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </IconButton>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-canvas/98 backdrop-blur-xl border-b border-hairline overflow-y-auto px-6 py-6 pb-24 animate-in fade-in duration-150">
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div key={section.heading} className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-bold">
                  {section.heading}
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-display font-medium transition-colors',
                          isActive
                            ? 'text-accent bg-surface-2 border border-accent/20'
                            : 'text-fg-muted hover:text-fg hover:bg-surface-1'
                        )}
                      >
                        <Icon className="size-4 shrink-0 text-fg-subtle" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-hairline flex flex-col gap-3">
            <Button asChild variant="primary" className="w-full">
              <Link href="/new" onClick={() => setIsOpen(false)}>
                Start a New Project
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
