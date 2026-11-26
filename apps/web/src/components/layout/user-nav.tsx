'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  Plus,
  LogOut,
  ChevronDown,
  Sparkles,
  Award,
  GraduationCap,
  Factory,
} from 'lucide-react';
import { Avatar, Button } from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';

export function UserNav() {
  const router = useRouter();
  const session = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    handle?: string;
    displayName?: string;
    avatarUrl?: string;
    reputation?: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session.data?.user;
  const isPending = session.isPending;

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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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

  if (isPending) {
    return (
      <div className="h-9 w-20 animate-pulse rounded-full bg-surface-2" />
    );
  }

  if (user) {
    const displayName = userProfile?.displayName || user.name || 'Innovator';
    const handle = userProfile?.handle;
    const profileHref = handle ? `/u/${handle}` : '/profile';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-h-[40px] items-center gap-2 rounded-full border border-hairline bg-surface-1 p-1 pr-2.5 transition-all hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User account menu"
        >
          <Avatar
            name={displayName}
            src={userProfile?.avatarUrl || user.image || undefined}
            size="sm"
            className="ring-1 ring-accent/20"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-display text-[13px] font-semibold text-fg leading-none max-w-[120px] truncate">
              {displayName}
            </span>
            {handle ? (
              <span className="font-mono text-[10px] text-accent-fg leading-none mt-0.5 truncate max-w-[120px]">
                @{handle}
              </span>
            ) : (
              <span className="text-[10px] text-fg-subtle leading-none mt-0.5 truncate max-w-[120px]">
                {user.email}
              </span>
            )}
          </div>
          <ChevronDown className="size-3.5 text-fg-subtle" />
        </button>

        {isOpen && (
          <div
            role="menu"
            aria-label="User profile options"
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-hairline bg-surface-1 p-2 shadow-overlay z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="border-b border-hairline px-3 py-2.5 mb-1">
              <p className="font-display text-body-sm font-bold text-fg truncate">
                {displayName}
              </p>
              <p className="font-mono text-[12px] text-fg-muted truncate mt-0.5">
                {user.email}
              </p>
              {handle && (
                <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-hairline/70">
                  <span className="font-mono text-[11px] text-accent-fg font-semibold">
                    @{handle}
                  </span>
                  {userProfile?.reputation !== undefined && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-accent-fg">
                      <Award className="size-2.5" />
                      {userProfile.reputation} REP
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-0.5" role="none">
              <Link
                href={profileHref}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <User className="size-4 text-accent-fg" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <Settings className="size-4 text-fg-muted" />
                <span>Profile Settings</span>
              </Link>

              <Link
                href="/new"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <Plus className="size-4 text-earn-fg" />
                <span>Create New Project</span>
              </Link>

              <Link
                href="/entrepreneurship"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <GraduationCap className="size-4 text-accent-fg" />
                <span>Founder Academy</span>
              </Link>

              <Link
                href="/manufacturing"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <Factory className="size-4 text-make-fg" />
                <span>Hardware Workbench</span>
              </Link>

              {!handle && (
                <Link
                  href="/onboarding"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-accent-fg bg-accent/8 hover:bg-accent/12 transition-colors font-medium"
                >
                  <Sparkles className="size-4 text-accent-fg" />
                  <span>Claim Handle &amp; Badges</span>
                </Link>
              )}
            </div>

            <div className="border-t border-hairline my-1 pt-1" role="none">
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-body-sm text-danger-fg hover:bg-danger/10 transition-colors text-left"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-2">
      <Button asChild size="sm" variant="secondary">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <div className="hidden md:block">
        <Button asChild size="sm" variant="primary">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
