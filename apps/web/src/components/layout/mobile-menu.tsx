'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Flame,
  FolderKanban,
  Cpu,
  GraduationCap,
  Coins,
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
  Zap,
  Briefcase,
  Rocket,
  Atom,
  ShieldCheck,
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

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
      heading: '01 · Ideate & Learn',
      items: [
        { href: '/', label: 'India Home Hub', icon: Home },
        { href: '/sectors', label: 'All 10 Sectors & Paths', icon: Rocket, badge: 'New' },
        { href: '/resources', label: 'Funding, ATLs & Free Vault', icon: Coins, badge: '₹0' },
        { href: '/ideas', label: 'IdeaLab & Problems', icon: Sparkles },
        { href: '/learn', label: 'Skill Roadmaps', icon: GraduationCap, badge: 'Free' },
        { href: '/young-innovators', label: 'Students & Youth (8–26)', icon: Sparkles },
        { href: '/stories', label: 'India Stories & Museum', icon: Newspaper },
      ],
    },
    {
      heading: '02 · Team Up & Fund',
      items: [
        { href: '/feed', label: 'Community Feed', icon: Flame },
        { href: '/projects', label: 'Builds & Squads', icon: FolderKanban },
        { href: '/squads', label: 'Squad Rooms & Clubs', icon: Users },
        { href: '/earn', label: 'Bounties & Grants', icon: Coins, badge: 'Active' },
        { href: '/sprints', label: '48H Build Sprints', icon: Zap, badge: '48H' },
        { href: '/launchpad', label: 'Launchpad & Escrow', icon: Rocket },
        { href: '/jobs', label: 'Proof-of-Work Jobs', icon: Briefcase },
        { href: '/leaderboard', label: 'Top Builders', icon: Trophy },
      ],
    },
    {
      heading: '03 · Build, Fab & Export',
      items: [
        { href: '/manufacturing', label: 'Hardware Workbench', icon: Cpu, badge: 'Labs' },
        { href: '/manufacturing/pcb', label: 'PCB & SPICE Studio', icon: Cpu },
        { href: '/how-to-start', label: '12 Pilot-to-Plant Guides', icon: Atom },
        { href: '/labs', label: 'Makerspaces & Testbeds', icon: ShieldCheck },
        { href: '/compliance', label: 'Compliance & Sourcing', icon: ShieldCheck },
        { href: '/export', label: 'Global Export & OEM Hub', icon: Rocket, badge: 'Export' },
      ],
    },
    {
      heading: 'Hackerland Network',
      items: [
        { href: 'https://ai.hackerland.in/', label: 'Join AI Community', icon: Sparkles, badge: 'Free', external: true },
        { href: 'https://blog.hackerland.in/', label: 'Hackerland Blog', icon: Newspaper, external: true },
      ],
    },
  ];

  return (
    <div>
      <IconButton
        label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen(!isOpen)}
        className="text-fg flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full hover:bg-surface-2 transition-colors"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </IconButton>

      {mounted &&
        createPortal(
          <>
            <div
              className={cn(
                'fixed inset-0 z-[999] bg-fg/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
              )}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <aside
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation drawer"
              className={cn(
                'fixed inset-y-0 right-0 z-[1000] w-[88vw] max-w-[340px] sm:max-w-sm bg-surface-1 border-l border-hairline shadow-overlay flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden',
                isOpen ? 'translate-x-0' : 'translate-x-full',
              )}
            >
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4 shrink-0 bg-surface-1/95 backdrop-blur sticky top-0 z-10">
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
                    className="h-7 w-7 rounded-lg object-contain shrink-0"
                    priority
                  />
                  <Image
                    src="/images/logo2.png"
                    alt="Hackerland"
                    width={120}
                    height={24}
                    className="h-[22px] w-auto object-contain dark:invert dark:brightness-150 shrink-0"
                    priority
                  />
                </Link>

                <IconButton
                  label="Close menu"
                  onClick={() => setIsOpen(false)}
                  className="text-fg-subtle hover:text-fg min-h-[40px] min-w-[40px] rounded-full hover:bg-surface-2"
                >
                  <X className="size-5" />
                </IconButton>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                {/* Auth / User Status */}
                <div className="rounded-2xl border border-hairline bg-surface-2/60 p-3.5 space-y-3">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={userProfile?.displayName || user.name || 'Innovator'}
                          src={userProfile?.avatarUrl || user.image || undefined}
                          size="sm"
                          className="ring-1 ring-accent/20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-body-sm font-bold text-fg truncate">
                            {userProfile?.displayName || user.name || 'Innovator'}
                          </p>
                          {userProfile?.handle ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-accent-fg truncate">
                                @{userProfile.handle}
                              </span>
                              {userProfile.reputation !== undefined && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-mono font-semibold text-accent-fg">
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
                          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full border border-hairline bg-surface-1 text-[13px] font-display font-medium text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
                        >
                          <User className="size-3.5" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full border border-hairline bg-surface-1 text-[13px] font-display font-medium text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
                        >
                          <Settings className="size-3.5" />
                          <span>Settings</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-[13px] text-fg-muted font-display">
                        Build in the open with India&apos;s makers.
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

                <Button asChild variant="primary" className="w-full">
                  <Link
                    href="/new"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 font-display font-semibold"
                  >
                    <Plus className="size-4" />
                    <span>Share Build / Project</span>
                  </Link>
                </Button>

                <div className="space-y-5">
                  {SECTIONS.map((section) => (
                    <div key={section.heading} className="space-y-1.5">
                      <span className="font-display text-[12px] font-semibold text-fg-subtle px-2">
                        {section.heading}
                      </span>
                      <div className="space-y-0.5">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            item.href === '/'
                              ? pathname === '/'
                              : !('external' in item && item.external) &&
                                pathname.startsWith(item.href);

                          if ('external' in item && item.external) {
                            return (
                              <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-body-sm font-display font-medium text-fg-muted hover:text-accent-fg hover:bg-surface-2 transition-colors group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon className="size-4 shrink-0 text-accent" />
                                  <span>{item.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {item.badge && (
                                    <span className="rounded-full px-2 py-0.5 text-[10px] font-display font-semibold bg-accent/10 text-accent-fg">
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
                                'flex items-center justify-between px-3 py-2 rounded-xl text-body-sm font-display font-medium transition-colors group',
                                isActive
                                  ? 'text-accent-fg bg-accent/10 font-semibold'
                                  : 'text-fg-muted hover:text-fg hover:bg-surface-2',
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon
                                  className={cn(
                                    'size-4 shrink-0',
                                    isActive ? 'text-accent-fg' : 'text-fg-subtle group-hover:text-fg',
                                  )}
                                />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span
                                  className={cn(
                                    'rounded-full px-2 py-0.5 text-[10px] font-display font-semibold',
                                    isActive
                                      ? 'bg-accent text-on-solid'
                                      : 'bg-surface-2 text-fg-subtle',
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

                {user && (
                  <div className="pt-2 border-t border-hairline">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-body-sm font-display text-danger-fg hover:bg-danger/10 transition-colors text-left"
                    >
                      <LogOut className="size-4 shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-hairline p-4 space-y-3 shrink-0 bg-surface-2/40">
                <ThemeToggle variant="labeled" className="w-full justify-center" />
                <div className="flex items-center justify-between text-[11px] text-fg-subtle px-1">
                  <span>DPDP India Compliant</span>
                  <span>v2.0 · Open Source</span>
                </div>
              </div>
            </aside>
          </>,
          document.body,
        )}
    </div>
  );
}
