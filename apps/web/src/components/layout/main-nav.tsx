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
  Sparkles,
  Newspaper,
  Trophy,
  Users,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@hackerland/ui';

interface NavSubItem {
  href: string;
  title: string;
  description: string;
  icon: typeof Cpu;
  badge?: string;
  external?: boolean;
}

interface NavDropdown {
  id: string;
  label: string;
  matchPrefixes: string[];
  items: NavSubItem[];
}

const HARDWARE_DROPDOWN: NavDropdown = {
  id: 'hardware',
  label: 'Hardware & Labs',
  matchPrefixes: ['/manufacturing', '/labs'],
  items: [
    {
      href: '/manufacturing',
      title: 'Manufacturing Hub',
      description: '8 engineering domains: PCB, Drone, EV, Propulsion & Silicon',
      icon: Cpu,
      badge: 'Hub',
    },
    {
      href: '/manufacturing/physics',
      title: 'Virtual Simulators Suite',
      description: 'Vehicle, Quadcopter, Rocket, SPICE & EDA 60 FPS physics engines',
      icon: Gauge,
      badge: 'Simulators',
    },
    {
      href: '/labs',
      title: 'Makerspaces & Labs Across India',
      description: '3D printers, CNC mills, ATL nodes & HIL testbenches',
      icon: Atom,
      badge: 'Labs',
    },
    {
      href: '/how-to-start',
      title: 'Factory Blueprints',
      description: 'Semiconductor fab, PCB, carbon fiber, cycle & mobile plants',
      icon: Factory,
      badge: 'CapEx',
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

const COMMUNITY_DROPDOWN: NavDropdown = {
  id: 'community',
  label: 'Community',
  matchPrefixes: ['/leaderboard', '/u'],
  items: [
    {
      href: '/u',
      title: 'Innovator Profiles',
      description: 'Explore public profiles of hardware makers, researchers & squad leads',
      icon: Users,
      badge: 'Directory',
    },
    {
      href: '/leaderboard',
      title: 'Top Innovators',
      description: 'Global leaderboard of top project builders and contributors',
      icon: Trophy,
      badge: 'Top 100',
    },
    {
      href: 'https://ai.hackerland.in/',
      title: 'Join AI Community',
      description: 'Global network of 10,000+ AI engineers, researchers & builders',
      icon: Sparkles,
      badge: 'Free',
      external: true,
    },
    {
      href: 'https://blog.hackerland.in/',
      title: 'Hackerland Blog',
      description: 'Engineering stories, system designs & hardware breakthroughs',
      icon: Newspaper,
      external: true,
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
                  (!item.external && item.href !== '/' && pathname.startsWith(item.href));

                const content = (
                  <>
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 transition-transform group-hover:scale-105',
                        isItemActive && 'border-accent/40 bg-accent/15 text-accent',
                        item.external && 'text-brand-pink group-hover:bg-brand-pink/10'
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
                          <span
                            className={cn(
                              'font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border',
                              item.badge === 'Free'
                                ? 'bg-brand-pink/15 text-brand-pink border-brand-pink/30 font-bold'
                                : 'bg-surface-3 text-fg-subtle border-hairline'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.external && (
                          <ExternalLink className="size-3 text-fg-subtle ml-auto shrink-0 opacity-60 group-hover:opacity-100" />
                        )}
                      </div>
                      <p className="text-[11px] text-fg-muted line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </>
                );

                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setOpenDropdown(null)}
                      className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-2 border border-transparent"
                    >
                      {content}
                    </a>
                  );
                }

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
                    {content}
                  </Link>
                );
              })}
            </div>

            {/* Hub Shortcut Footer */}
            <div className="mt-2 pt-2 border-t border-hairline/60 px-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-fg-subtle">
                {dropdown.id === 'hardware'
                  ? 'Open-Source Hardware'
                  : dropdown.id === 'academy'
                  ? 'Entrepreneurship & Skills'
                  : 'Hackerland Network'}
              </span>
              {dropdown.items[0]!.external ? (
                <a
                  href={dropdown.items[0]!.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpenDropdown(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-brand-pink hover:underline"
                >
                  <span>{dropdown.items[0]!.title}</span>
                  <ArrowRight className="size-3" />
                </a>
              ) : (
                <Link
                  href={dropdown.items[0]!.href}
                  onClick={() => setOpenDropdown(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-accent hover:underline"
                >
                  <span>Launch Hub</span>
                  <ArrowRight className="size-3" />
                </Link>
              )}
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
      className="hidden md:flex items-center gap-0.5 lg:gap-1"
    >
      {/* 1. Projects */}
      <Link
        href="/projects"
        aria-current={isProjectsActive ? 'page' : undefined}
        className={cn(
          'px-2.5 lg:px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
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
          'px-2.5 lg:px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          isFeedActive
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Feed
      </Link>

      {/* 3. Hardware Dropdown (Manufacturing, Physics, Labs, Factory Blueprints) */}
      {renderDropdown(HARDWARE_DROPDOWN)}

      {/* 3a. Direct Simulators link on lg+ */}
      <Link
        href="/manufacturing/physics"
        aria-current={pathname.startsWith('/manufacturing/physics') ? 'page' : undefined}
        className={cn(
          'hidden lg:inline-flex px-2.5 lg:px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          pathname.startsWith('/manufacturing/physics')
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Simulators
      </Link>

      {/* 3b. Direct Labs link on lg+ */}
      <Link
        href="/labs"
        aria-current={pathname === '/labs' || pathname.startsWith('/labs/') ? 'page' : undefined}
        className={cn(
          'hidden lg:inline-flex px-2.5 lg:px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          pathname === '/labs' || pathname.startsWith('/labs/')
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Labs
      </Link>

      {/* 4. Earn */}
      <Link
        href="/earn"
        aria-current={isEarnActive ? 'page' : undefined}
        className={cn(
          'px-2.5 lg:px-3 py-1.5 text-body-sm font-display font-medium rounded-md transition-colors',
          isEarnActive
            ? 'text-accent bg-surface-2 border border-accent/20'
            : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
        )}
      >
        Earn
      </Link>

      {/* 5. Academy Dropdown (Learn by Doing, Founders, How to Start) */}
      {renderDropdown(ACADEMY_DROPDOWN)}

      {/* 6. Community Dropdown (Join AI Community, Blog, Leaderboard) */}
      {renderDropdown(COMMUNITY_DROPDOWN)}

      {/* 7. Direct Blog link on xl+ */}
      <a
        href="https://blog.hackerland.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden xl:inline-flex px-2.5 lg:px-3 py-1.5 text-body-sm font-display font-medium rounded-md text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent transition-colors items-center gap-1"
      >
        <span>Blog</span>
      </a>
    </nav>
  );
}
