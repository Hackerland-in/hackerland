'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Cpu,
  Atom,
  Gauge,
  Factory,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@hackerland/ui';

interface NavSubItem {
  href: string;
  title: string;
  description: string;
  icon: typeof Cpu;
  badge?: string;
}

interface NavDropdown {
  id: string;
  label: string;
  matchPrefixes: string[];
  items: NavSubItem[];
}

const HARDWARE_DROPDOWN: NavDropdown = {
  id: 'hardware',
  label: 'Hardware',
  matchPrefixes: ['/manufacturing', '/labs'],
  items: [
    {
      href: '/manufacturing',
      title: 'Manufacturing Hub',
      description: 'SPICE solvers, HDL, EDA & web testbenches',
      icon: Cpu,
      badge: 'Core',
    },
    {
      href: '/manufacturing/physics',
      title: 'Vehicle Physics Engine',
      description: 'Bicycle, Car, Motorbike, Drone, EV & Rocket dynamics',
      icon: Gauge,
      badge: '60 FPS',
    },
    {
      href: '/labs',
      title: 'Makerspaces & ATL Nodes',
      description: '3D printers, oscilloscopes & HIL testbenches across India',
      icon: Atom,
    },
    {
      href: '/how-to-start',
      title: 'Factory Blueprints',
      description: 'Semiconductor fab, PCB, carbon fiber, cycle & mobile plants',
      icon: Factory,
    },
  ],
};

const ACADEMY_DROPDOWN: NavDropdown = {
  id: 'academy',
  label: 'Academy',
  matchPrefixes: ['/learn', '/entrepreneurship'],
  items: [
    {
      href: '/learn',
      title: 'Learn by Doing',
      description: 'Curated open-source engineering skill roadmaps & squads',
      icon: GraduationCap,
      badge: 'Roadmaps',
    },
    {
      href: '/entrepreneurship',
      title: 'Founder Academy',
      description: 'Stanford, YC, MIT courses, Cap Table & Unit Economics tools',
      icon: BookOpen,
      badge: '100% Free',
    },
    {
      href: '/how-to-start',
      title: 'How to Start a Factory',
      description: 'CapEx budgeting, machinery checklists & Indian subsidies',
      icon: Factory,
    },
  ],
};

export function MainNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isProjectsActive =
    pathname === '/projects' ||
    pathname.startsWith('/projects/') ||
    pathname === '/new';

  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const isEarnActive = pathname === '/earn' || pathname.startsWith('/earn/');
  const isLeaderboardActive =
    pathname === '/leaderboard' || pathname.startsWith('/leaderboard/');

  const renderDropdown = (dropdown: NavDropdown) => {
    const isOpen = openDropdown === dropdown.id;
    const isDropdownActive = dropdown.matchPrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );

    return (
      <div
        key={dropdown.id}
        className="relative"
        onMouseEnter={() => handleMouseEnter(dropdown.id)}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : dropdown.id)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
            isDropdownActive
              ? 'text-accent bg-surface-2 border border-accent/20'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          )}
        >
          <span>{dropdown.label}</span>
          <ChevronDown
            className={cn(
              'size-3.5 transition-transform duration-200 text-fg-subtle',
              isOpen && 'rotate-180 text-accent'
            )}
          />
        </button>

        {isOpen && (
          <div
            role="menu"
            aria-label={`${dropdown.label} menu`}
            className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-hairline bg-surface-1/95 p-2 shadow-module backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="space-y-1">
              {dropdown.items.map((item) => {
                const Icon = item.icon;
                const isItemActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpenDropdown(null)}
                    className={cn(
                      'group flex items-start gap-3 rounded-lg p-2.5 transition-colors',
                      isItemActive
                        ? 'bg-accent/10 border border-accent/20'
                        : 'hover:bg-surface-2 border border-transparent'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 transition-transform group-hover:scale-105',
                        isItemActive && 'border-accent/40 bg-accent/15 text-accent'
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-caption font-display font-bold',
                            isItemActive
                              ? 'text-accent'
                              : 'text-fg group-hover:text-accent transition-colors'
                          )}
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-3 text-fg-subtle border border-hairline">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-fg-muted line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Hub Shortcut Footer */}
            <div className="mt-2 pt-2 border-t border-hairline/60 px-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-fg-subtle">
                {dropdown.id === 'hardware'
                  ? 'Open-Source Hardware'
                  : 'Entrepreneurship & Skills'}
              </span>
              <Link
                href={dropdown.items[0]!.href}
                onClick={() => setOpenDropdown(null)}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-accent hover:underline"
              >
                <span>Launch Hub</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Main Navigation"
      className="hidden md:flex items-center gap-1"
    >
      {/* 1. Projects */}
      <Link
        href="/projects"
        aria-current={isProjectsActive ? 'page' : undefined}
        className={cn(
          'px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          isProjectsActive
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Projects
      </Link>

      {/* 2. Feed */}
      <Link
        href="/feed"
        aria-current={isFeedActive ? 'page' : undefined}
        className={cn(
          'px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          isFeedActive
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Feed
      </Link>

      {/* 3. Hardware Dropdown (Manufacturing, Physics, Labs, Factory Blueprints) */}
      {renderDropdown(HARDWARE_DROPDOWN)}

      {/* 4. Earn */}
      <Link
        href="/earn"
        aria-current={isEarnActive ? 'page' : undefined}
        className={cn(
          'px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          isEarnActive
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Earn
      </Link>

      {/* 5. Academy Dropdown (Learn by Doing, Founders, How to Start) */}
      {renderDropdown(ACADEMY_DROPDOWN)}

      {/* 6. Leaderboard */}
      <Link
        href="/leaderboard"
        aria-current={isLeaderboardActive ? 'page' : undefined}
        className={cn(
          'px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          isLeaderboardActive
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Leaderboard
      </Link>
    </nav>
  );
}
