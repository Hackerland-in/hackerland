'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  Users,
  Plus,
  Sparkles,
  Newspaper,
  ExternalLink,
  User,
  Settings,
  LogOut,
  Award,
  Box,
  Layers,
  Lightbulb,
  Target,
  ShieldCheck,
  Calculator,
  Usb,
  Rocket,
  Skull,
  Radar,
  Zap,
  Briefcase,
  BatteryCharging,
  Thermometer,
  Sun,
} from 'lucide-react';
import { Avatar, Button, IconButton, cn } from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  const session = authClient.useSession();
  const user = session.data?.user;
  const [userProfile, setUserProfile] = useState<{
    handle?: string;
    displayName?: string;
    avatarUrl?: string;
    reputation?: number;
  } | null>(null);

  // Mount check for client portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync profile details
  useEffect(() => {
    function loadLocal() {
      try {
        const cached = localStorage.getItem('hackerland_user_profile');
        if (cached) {
          const prof = JSON.parse(cached);
          if (prof?.handle) {
            setUserProfile((prev) => ({
              ...prev,
              handle: prof.handle,
              displayName: prof.displayName || prof.name || user?.name || 'Innovator',
              avatarUrl: prof.avatarUrl || user?.image,
              reputation: prof.reputation || prev?.reputation || 120,
            }));
          }
        }
      } catch {
        // Ignore
      }
    }
    loadLocal();
    window.addEventListener('hackerland:profile-updated', loadLocal);

    if (!user?.id) {
      return () => {
        window.removeEventListener('hackerland:profile-updated', loadLocal);
      };
    }

    let active = true;
    fetch('/api/me/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const prof = data.profile || data;
        if (prof?.handle) {
          setUserProfile({
            handle: prof.handle,
            displayName: prof.displayName || prof.name || user.name,
            avatarUrl: prof.avatarUrl || user.image,
            reputation: prof.reputation || 0,
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      window.removeEventListener('hackerland:profile-updated', loadLocal);
    };
  }, [user?.id, user?.name, user?.image]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
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

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setIsOpen(false);
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  const SECTIONS = [
    {
      heading: 'Discover & Build',
      items: [
        { href: '/launchpad', label: 'Hardware Launchpad & Grants', icon: Rocket, badge: 'Escrow' },
        { href: '/observatory', label: 'Innovation Observatory', icon: Radar, badge: 'Tech Radar' },
        { href: '/projects', label: 'Explore Projects', icon: FolderKanban },
        { href: '/squads', label: 'Squad Rooms & Escrow', icon: Users, badge: 'Vault' },
        { href: '/ideas', label: 'IdeaLab (Stage Zero)', icon: Lightbulb, badge: 'Incubator' },
        { href: '/problems', label: 'Unsolved Problems', icon: Target, badge: 'Challenges' },
        { href: '/stories', label: 'Build Journey Archive', icon: BookOpen, badge: 'Histories' },
        { href: '/museum', label: 'Failed Projects Museum', icon: Skull, badge: 'Autopsies' },
        { href: '/passport', label: 'Innovation Passport', icon: ShieldCheck, badge: 'Proof' },
        { href: '/feed', label: 'Community Feed', icon: Compass },
        { href: '/leaderboard', label: 'Top Innovators', icon: Trophy, badge: 'Rankings' },
        { href: '/u', label: 'Innovator Profiles', icon: Users, badge: 'Directory' },
      ],
    },
    {
      heading: 'Hardware & Manufacturing',
      items: [
        { href: '/motor-foc', label: 'Motor FOC & SVPWM Simulator', icon: Gauge, badge: 'Motor FOC' },
        { href: '/solar-mppt', label: 'Solar PV & MPPT Simulator', icon: Sun, badge: 'Solar MPPT' },
        { href: '/thermal', label: 'Thermal Profiler & Heat Sinks', icon: Thermometer, badge: 'Thermal R_θ' },
        { href: '/battery-eis', label: 'Battery EIS & State-of-Health', icon: BatteryCharging, badge: 'SoH EIS' },
        { href: '/rf-calc', label: 'RF Transmission Line Synthesizer', icon: Radar, badge: 'RF 50Ω' },
        { href: '/emc', label: 'EMI/EMC Pre-Scan Analyzer', icon: Gauge, badge: 'EMC' },
        { href: '/assembly', label: 'PCBA Assembly & Stencil', icon: Factory, badge: 'SMT' },
        { href: '/sourcing', label: 'Component Sourcing & Alternates', icon: Cpu, badge: 'Alternates' },
        { href: '/testbeds', label: 'Remote HIL Testbeds', icon: Atom, badge: 'Remote SCPI' },
        { href: '/compliance', label: 'Statutory Compliance Wizard', icon: ShieldCheck, badge: 'NABL Labs' },
        { href: '/firmware', label: 'Firmware Registry & Flasher', icon: Usb, badge: 'WebSerial' },
        { href: '/telemetry', label: 'Digital Twin & Telemetry Stream', icon: Gauge, badge: 'Digital Twin' },
        { href: '/copilot', label: 'Hardware Co-Pilot & Sourcing', icon: Zap, badge: 'AI Sourcing' },
        { href: '/network/ip', label: 'Open Invention IP Defense', icon: ShieldCheck, badge: 'IP Defense' },
        { href: '/clubs', label: 'Innovation Clubs & ATL Hub', icon: GraduationCap, badge: 'ATL Mesh' },
        { href: '/prototype', label: 'Idea-to-Prototype Simulator', icon: Sparkles, badge: 'AI Architect' },
        { href: '/manufacturing', label: 'Manufacturing Hub', icon: Cpu, badge: '8 Domains' },
        { href: '/manufacturing/pcb', label: 'A-Z PCB & Circuit Studio', icon: Layers, badge: 'Real-Time' },
        { href: '/manufacturing/rfq', label: 'Instant PCB RFQ Quoting', icon: Calculator, badge: 'RFQ' },
        { href: '/manufacturing/flasher', label: 'WebSerial Firmware Flasher', icon: Usb, badge: 'WebSerial' },
        { href: '/teardowns', label: 'Hardware Teardowns Library', icon: Compass, badge: 'Autopsies' },
        { href: '/manufacturing/physics/3d', label: '3D Simulator Labs', icon: Box, badge: 'WebGL 3D' },
        { href: '/manufacturing/physics', label: 'Virtual Simulators Suite', icon: Gauge, badge: '60 FPS' },
        { href: '/labs', label: 'Makerspaces & ATL Labs', icon: Atom, badge: 'Across India' },
        { href: '/how-to-start', label: 'Factory Blueprints & CapEx', icon: Factory, badge: 'CapEx' },
      ],
    },
    {
      heading: 'Opportunities & Academy',
      items: [
        { href: '/sprints', label: '48H Hardware Sprints', icon: Zap, badge: '48H' },
        { href: '/jobs', label: 'Hardware Jobs & Fellowships', icon: Briefcase, badge: 'Proof' },
        { href: '/young-innovators', label: 'Young Innovators (Ages 8-17)', icon: GraduationCap, badge: 'Ages 8-17' },
        { href: '/earn', label: 'Earn (Bounties & Grants)', icon: Coins, badge: 'Active' },
        { href: '/learn', label: 'Learn by Doing Roadmaps', icon: GraduationCap, badge: 'Open-Source' },
        { href: '/entrepreneurship', label: 'Founder Academy', icon: BookOpen, badge: '100% Free' },
      ],
    },
    {
      heading: 'Ecosystem & Community',
      items: [
        { href: '/launch', label: 'Community Launch Kit', icon: Rocket, badge: 'Launch' },
        { href: 'https://ai.hackerland.in/', label: 'Join AI Community', icon: Sparkles, badge: 'Free', external: true },
        { href: 'https://blog.hackerland.in/', label: 'Hackerland Blog', icon: Newspaper, external: true },
      ],
    },
  ];

  return (
    <div>
      {/* Drawer Toggle Hamburger Button */}
      <IconButton
        label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
        className="text-fg flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md hover:bg-surface-2 transition-colors"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </IconButton>

      {/* Render Backdrop & Drawer in React Portal to document.body to ensure it sits above all body content */}
      {mounted &&
        createPortal(
          <>
            {/* Backdrop overlay */}
            <div
              className={cn(
                'fixed inset-0 z-[999] bg-canvas/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              )}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Right Side Slider Drawer (Sheet) */}
            <aside
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation drawer"
              className={cn(
                'fixed inset-y-0 right-0 z-[1000] w-[88vw] max-w-[340px] sm:max-w-sm bg-surface-1 border-l border-hairline shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden',
                isOpen ? 'translate-x-0' : 'translate-x-full'
              )}
            >
              {/* Drawer Header with Both Logos */}
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4 shrink-0 bg-surface-1/80 backdrop-blur sticky top-0 z-10">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 transition-opacity hover:opacity-90"
                >
                  <Image
                    src="/logo.png"
                    alt="Hackerland Logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded object-contain shrink-0"
                    priority
                  />
                  <Image
                    src="/images/logo2.png"
                    alt="Hackerland"
                    width={120}
                    height={24}
                    className="h-[22px] w-auto object-contain dark:brightness-200 dark:contrast-125 shrink-0"
                    priority
                  />
                </Link>

                <IconButton
                  label="Close menu"
                  onClick={() => setIsOpen(false)}
                  className="text-fg-subtle hover:text-fg min-h-[40px] min-w-[40px] rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <X className="size-5" />
                </IconButton>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 scrollbar-thin">
                {/* User Status / Auth Section */}
                <div className="rounded-xl border border-hairline bg-surface-2/60 p-3.5 space-y-3">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={userProfile?.displayName || user.name || 'Innovator'}
                          src={userProfile?.avatarUrl || user.image || undefined}
                          size="sm"
                          className="ring-1 ring-hairline"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-body-sm font-bold text-fg truncate">
                            {userProfile?.displayName || user.name || 'Innovator'}
                          </p>
                          {userProfile?.handle ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-accent truncate">
                                @{userProfile.handle}
                              </span>
                              {userProfile.reputation !== undefined && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-accent/15 px-1 py-0.2 text-[9px] font-mono font-bold text-accent">
                                  <Award className="size-2.5" />
                                  {userProfile.reputation} REP
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-fg-subtle truncate mt-0.5">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline">
                        <Link
                          href={userProfile?.handle ? `/u/${userProfile.handle}` : '/profile'}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-hairline bg-surface-1 text-caption font-display font-medium text-fg hover:border-accent hover:text-accent transition-colors"
                        >
                          <User className="size-3.5" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-hairline bg-surface-1 text-caption font-display font-medium text-fg hover:border-accent hover:text-accent transition-colors"
                        >
                          <Settings className="size-3.5" />
                          <span>Settings</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-caption text-fg-muted font-display">
                        Build together, earn together.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button asChild size="sm" variant="secondary" className="w-full">
                          <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                            Sign in
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="primary" className="w-full">
                          <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                            Sign up
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Start Project CTA Button */}
                <Button asChild variant="primary" className="w-full shadow-glow-accent">
                  <Link
                    href="/new"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 font-display font-semibold"
                  >
                    <Plus className="size-4" />
                    <span>Start a New Project</span>
                  </Link>
                </Button>

                {/* Navigation Category Groups */}
                <div className="space-y-5">
                  {SECTIONS.map((section) => (
                    <div key={section.heading} className="space-y-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold px-1">
                        {section.heading}
                      </span>
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            pathname === item.href ||
                            (!('external' in item && item.external) &&
                              item.href !== '/' &&
                              pathname.startsWith(item.href));

                          if ('external' in item && item.external) {
                            return (
                              <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-body-sm font-display font-medium text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon className="size-4 shrink-0 text-brand-pink group-hover:scale-105 transition-transform" />
                                  <span>{item.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {item.badge && (
                                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-brand-pink/15 text-brand-pink border border-brand-pink/30 font-bold">
                                      {item.badge}
                                    </span>
                                  )}
                                  <ExternalLink className="size-3 text-fg-subtle" />
                                </div>
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'flex items-center justify-between px-3 py-2 rounded-lg text-body-sm font-display font-medium transition-colors group',
                                isActive
                                  ? 'text-accent bg-surface-2 border border-accent/20 font-bold'
                                  : 'text-fg-muted hover:text-fg hover:bg-surface-2'
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon
                                  className={cn(
                                    'size-4 shrink-0 transition-transform group-hover:scale-105',
                                    isActive ? 'text-accent' : 'text-fg-subtle group-hover:text-fg'
                                  )}
                                />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span
                                  className={cn(
                                    'font-mono text-[9px] uppercase px-1.5 py-0.2 rounded border',
                                    isActive
                                      ? 'bg-accent/15 text-accent border-accent/30 font-bold'
                                      : 'bg-surface-3 text-fg-subtle border-hairline'
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sign Out Action if Logged In */}
                {user && (
                  <div className="pt-2 border-t border-hairline">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm font-display text-danger hover:bg-danger/10 transition-colors text-left"
                    >
                      <LogOut className="size-4 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer with Theme Toggle & Links */}
              <div className="border-t border-hairline p-4 space-y-3 shrink-0 bg-surface-2/40">
                <ThemeToggle variant="labeled" className="w-full justify-center" />

                <div className="flex items-center justify-between text-[10px] font-mono text-fg-subtle px-1">
                  <span>DPDP India Compliant</span>
                  <span>v1.0 · Open Source</span>
                </div>
              </div>
            </aside>
          </>,
          document.body
        )}
    </div>
  );
}
