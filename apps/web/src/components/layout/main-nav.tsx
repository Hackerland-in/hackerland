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
  Compass,
  Lightbulb,
  Factory,
  Globe2,
  FlaskConical,
  IndianRupee,
  Archive,
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
  label: 'Community & Sectors',
  matchPrefixes: ['/u', '/leaderboard', '/squads', '/clubs', '/sprints', '/jobs', '/launchpad', '/learn', '/entrepreneurship', '/stories', '/ideas', '/problems', '/museum', '/observatory', '/passport', '/young-innovators', '/sectors', '/resources'],
  items: [
    {
      href: '/sectors',
      title: 'All 10 India Sectors',
      description: 'Progressive beginner-to-export pathways across core industries',
      icon: Compass,
      badge: '10 Hubs',
    },
    {
      href: '/resources',
      title: 'Funding, ATLs & Free Vault',
      description: 'Zero-equity grants, I-STEM/FabLabs & 22-language courses',
      icon: IndianRupee,
      badge: '₹0 Start',
    },
    {
      href: '/ideas',
      title: 'IdeaLab & Problem Bank',
      description: 'Pick real Indian problems & craft your 1-page build brief',
      icon: Lightbulb,
    },
    {
      href: '/young-innovators',
      title: 'Students & Youth (Ages 8–26)',
      description: 'MicroPython sandbox, ITI/diploma ramp & DPDP safe clubs',
      icon: Sparkles,
      badge: 'Free',
    },
    {
      href: '/learn',
      title: 'Learn & Founder Academy',
      description: 'Interactive skill roadmaps & startup playbooks',
      icon: GraduationCap,
    },
    {
      href: '/stories',
      title: 'India Tier-2/3 Stories & Autopsies',
      description: 'Real Pune, Surat & Tiruppur exporters + hardware failure museum',
      icon: Newspaper,
    },
    {
      href: '/squads',
      title: 'Squad Rooms & Clubs',
      description: 'Active project rooms, tasks & ATL makerspace clubs',
      icon: Users,
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
      href: '/u',
      title: 'Makers & Top Builders',
      description: 'Public builder profiles, ships & weekly rankings',
      icon: Trophy,
    },
  ],
};

const LABS_DROPDOWN: NavDropdown = {
  id: 'labs',
  label: 'Labs, Fab & Export',
  matchPrefixes: ['/manufacturing', '/labs', '/teardowns', '/prototype', '/copilot', '/telemetry', '/firmware', '/compliance', '/testbeds', '/sourcing', '/assembly', '/emc', '/rf-calc', '/battery-eis', '/thermal', '/solar-mppt', '/motor-foc', '/can-bus', '/how-to-start', '/network', '/export', '/launch'],
  items: [
    {
      href: '/manufacturing',
      title: 'Advanced Manufacturing Hub',
      description: 'Central workbench for PCB, CAD, RF, EV, SPICE & drones',
      icon: Cpu,
      badge: 'Hub',
    },
    {
      href: '/how-to-start',
      title: 'Pilot-to-Plant Blueprints',
      description: '12 industrial guides bridging ₹5L pilots to export factories',
      icon: Factory,
      badge: '12 Plants',
    },
    {
      href: '/export',
      title: 'Global Export & OEM Hub',
      description: 'CE/FCC/UL bridge, HSN Incoterms margins, RoDTEP & PPAP',
      icon: Globe2,
      badge: 'Export',
    },
    {
      href: '/prototype',
      title: 'Prototype & PCB Studio',
      description: 'BOM architecture generator, browser PCB layout & RFQ quotes',
      icon: Layers,
    },
    {
      href: '/manufacturing/rfq',
      title: 'Instant PCB & CNC RFQ + Sourcing',
      description: 'Compare domestic Indian fabs, ICs & turnkey SMT assembly',
      icon: FlaskConical,
    },
    {
      href: '/compliance',
      title: 'BIS, WPC & AIS-156 Compliance',
      description: '30-sec regulatory profiler & NABL testbed reservations',
      icon: ShieldCheck,
    },
    {
      href: '/teardowns',
      title: 'Teardowns & IP Defense',
      description: 'Commercial product BOM autopsies & prior-art timestamping',
      icon: Archive,
    },
    {
      href: '/manufacturing/physics/3d',
      title: '3D Physics & Domain Workbenches',
      description: 'WebGL sims plus CAN, FOC, Solar MPPT, EIS & Thermal labs',
      icon: Gauge,
    },
    {
      href: '/labs',
      title: 'Makerspaces, ATLs & Testbeds',
      description: 'Find physical CNCs, 3D printers & remote HIL labs across India',
      icon: Atom,
    },
    {
      href: '/rf-calc',
      title: 'RF, EMC & Motor Simulators',
      description: 'Smith charts, CISPR pre-scans, EV powertrains & CAN-FD',
      icon: Radar,
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
