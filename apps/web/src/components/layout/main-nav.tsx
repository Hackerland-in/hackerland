'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Home,
  Flame,
  FolderKanban,
  Users,
  Trophy,
  Cpu,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Sparkles,
  Newspaper,
  ExternalLink,
  Rocket,
  Layers,
  Gauge,
  Atom,
  Zap,
  Briefcase,
  ShieldCheck,
  Radar,
  Sun,
  Network,
  Thermometer,
  BatteryCharging,
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

const COMMUNITY_DROPDOWN: NavDropdown = {
  id: 'community',
  label: 'Community',
  matchPrefixes: ['/u', '/leaderboard', '/squads', '/clubs', '/sprints', '/jobs', '/launchpad', '/learn', '/entrepreneurship', '/stories', '/ideas', '/problems', '/museum', '/observatory', '/passport', '/young-innovators'],
  items: [
    {
      href: '/u',
      title: 'Makers & Innovators',
      description: 'Explore public builder profiles, ships & endorsements',
      icon: Users,
      badge: 'Directory',
    },
    {
      href: '/squads',
      title: 'Squad Rooms & Clubs',
      description: 'Active project rooms, tasks & ATL makerspace clubs',
      icon: Sparkles,
      badge: 'Squads',
    },
    {
      href: '/sprints',
      title: '48H Build Sprints',
      description: 'Weekend hackathon sprints with milestone prizes',
      icon: Zap,
      badge: 'Live',
    },
    {
      href: '/leaderboard',
      title: 'Top Builders',
      description: 'Weekly reputation & proof-of-ship rankings',
      icon: Trophy,
    },
    {
      href: '/jobs',
      title: 'Proof-of-Work Jobs',
      description: 'Fellowships & engineering roles based on what you ship',
      icon: Briefcase,
    },
    {
      href: '/launchpad',
      title: 'Launchpad & Grants',
      description: 'Milestone escrow & Indian hardware grant matcher',
      icon: Rocket,
    },
    {
      href: '/learn',
      title: 'Learn & Founder Academy',
      description: 'Skill roadmaps, startup playbooks & Young Innovators track',
      icon: GraduationCap,
      badge: 'Free',
    },
    {
      href: 'https://ai.hackerland.in/',
      title: 'AI Community',
      description: 'Join 10,000+ AI engineers & makers globally',
      icon: Sparkles,
      badge: 'Free',
      external: true,
    },
    {
      href: 'https://blog.hackerland.in/',
      title: 'Engineering Blog',
      description: 'Stories, build autopsies & community highlights',
      icon: Newspaper,
      external: true,
    },
  ],
};

const LABS_DROPDOWN: NavDropdown = {
  id: 'labs',
  label: 'Labs & Tools',
  matchPrefixes: ['/manufacturing', '/labs', '/teardowns', '/prototype', '/copilot', '/telemetry', '/firmware', '/compliance', '/testbeds', '/sourcing', '/assembly', '/emc', '/rf-calc', '/battery-eis', '/thermal', '/solar-mppt', '/motor-foc', '/can-bus', '/how-to-start', '/network'],
  items: [
    {
      href: '/manufacturing',
      title: 'Maker Workbench & Labs',
      description: 'Central hub for PCB studio, CAD, RF, EV & hardware simulators',
      icon: Cpu,
      badge: 'Hub',
    },
    {
      href: '/manufacturing/pcb',
      title: 'PCB & SPICE Studio',
      description: 'Browser circuit simulation, Veroboard & Gerber export',
      icon: Layers,
    },
    {
      href: '/manufacturing/physics/3d',
      title: '3D Physics Simulators',
      description: 'Interactive WebGL labs for drones, EVs & rockets',
      icon: Gauge,
    },
    {
      href: '/can-bus',
      title: 'Automotive CAN Bus',
      description: 'Bit timing quanta, sample points & bus bandwidth',
      icon: Network,
    },
    {
      href: '/motor-foc',
      title: 'Motor FOC & SVPWM',
      description: 'Clarke/Park transforms & traction motor simulator',
      icon: Gauge,
    },
    {
      href: '/solar-mppt',
      title: 'Solar PV & MPPT',
      description: 'PV I-V curves, MPPT tracking & buck sizing',
      icon: Sun,
    },
    {
      href: '/battery-eis',
      title: 'Battery EIS & Health',
      description: 'Nyquist plots, Randles ECM & AIS-156 diagnostics',
      icon: BatteryCharging,
    },
    {
      href: '/thermal',
      title: 'Thermal & Heatsink',
      description: '1D resistor networks & inverter cooling profiler',
      icon: Thermometer,
    },
    {
      href: '/rf-calc',
      title: 'RF & EMC Analyzers',
      description: 'Microstrip lines, Smith charts & CISPR pre-scans',
      icon: Radar,
    },
    {
      href: '/labs',
      title: 'Makerspaces & ATL Mesh',
      description: 'Find physical CNCs, 3D printers & labs across India',
      icon: Atom,
    },
    {
      href: '/compliance',
      title: 'Compliance & Sourcing',
      description: 'BIS/WPC wizards, drop-in ICs & turnkey assembly',
      icon: ShieldCheck,
    },
  ],
};

export function MainNav() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

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

  const navLinkClass = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-display font-medium rounded-full transition-colors',
      active
        ? 'bg-accent/10 text-accent-fg font-semibold'
        : 'text-fg-muted hover:text-fg hover:bg-surface-2',
    );

  const renderDropdown = (dropdown: NavDropdown) => {
    const isOpen = openDropdown === dropdown.id;
    const isDropdownActive = dropdown.matchPrefixes.some((prefix) => pathname.startsWith(prefix));

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
          className={navLinkClass(isDropdownActive)}
        >
          <span>{dropdown.label}</span>
          <ChevronDown
            className={cn(
              'size-3.5 transition-transform duration-150 text-fg-subtle',
              isOpen && 'rotate-180 text-accent-fg',
            )}
          />
        </button>

        {isOpen && (
          <div
            role="menu"
            aria-label={`${dropdown.label} menu`}
            className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-hairline bg-surface-1 p-2 shadow-overlay z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="max-h-[70vh] overflow-y-auto space-y-0.5 pr-0.5">
              {dropdown.items.map((item) => {
                const Icon = item.icon;
                const isItemActive =
                  pathname === item.href ||
                  (!item.external && item.href !== '/' && pathname.startsWith(item.href));

                const content = (
                  <>
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors',
                        isItemActive
                          ? 'bg-accent text-on-solid'
                          : 'bg-surface-2 text-fg-muted group-hover:bg-accent/10 group-hover:text-accent-fg',
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-body-sm font-display font-semibold truncate',
                            isItemActive ? 'text-accent-fg' : 'text-fg group-hover:text-accent-fg',
                          )}
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-display text-[10px] font-semibold text-accent-fg">
                            {item.badge}
                          </span>
                        )}
                        {item.external && (
                          <ExternalLink className="size-3 text-fg-subtle ml-auto shrink-0" />
                        )}
                      </div>
                      <p className="text-[12px] text-fg-subtle line-clamp-1 mt-0.5">
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
                      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-2"
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
                      'group flex items-center gap-3 rounded-xl p-2 transition-colors',
                      isItemActive ? 'bg-accent/8' : 'hover:bg-surface-2',
                    )}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="mt-1.5 pt-2 border-t border-hairline px-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-fg-subtle">
                {dropdown.id === 'labs' ? 'Open Hardware Tools' : 'Hackerland Network'}
              </span>
              <Link
                href={dropdown.items[0]!.href}
                onClick={() => setOpenDropdown(null)}
                className="inline-flex items-center gap-1 text-[12px] font-display font-semibold text-accent-fg hover:underline"
              >
                <span>Explore all</span>
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
      className="hidden lg:flex items-center gap-1"
    >
      <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className={navLinkClass(pathname === '/')}>
        <Home className="size-3.5" aria-hidden="true" />
        <span>Home</span>
      </Link>

      <Link
        href="/feed"
        aria-current={pathname === '/feed' || pathname.startsWith('/feed/') ? 'page' : undefined}
        className={navLinkClass(pathname === '/feed' || pathname.startsWith('/feed/'))}
      >
        <Flame className="size-3.5" aria-hidden="true" />
        <span>Feed</span>
      </Link>

      <Link
        href="/projects"
        aria-current={pathname.startsWith('/projects') || pathname === '/new' ? 'page' : undefined}
        className={navLinkClass(pathname.startsWith('/projects') || pathname === '/new')}
      >
        <FolderKanban className="size-3.5" aria-hidden="true" />
        <span>Projects</span>
      </Link>

      <Link
        href="/earn"
        aria-current={pathname.startsWith('/earn') ? 'page' : undefined}
        className={navLinkClass(pathname.startsWith('/earn'))}
      >
        <Trophy className="size-3.5" aria-hidden="true" />
        <span>Bounties</span>
      </Link>

      {renderDropdown(COMMUNITY_DROPDOWN)}
      {renderDropdown(LABS_DROPDOWN)}
    </nav>
  );
}
