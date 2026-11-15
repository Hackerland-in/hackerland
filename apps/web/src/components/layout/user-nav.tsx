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

  // Fetch user profile from /api/me/profile if logged in
  useEffect(() => {
    if (!user?.id) return;

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
    };
  }, [user?.id, user?.name, user?.image]);

  // Close dropdown on outside click or Escape key
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
      <div className="h-9 w-20 animate-pulse rounded-md bg-surface-2" />
    );
  }

  // If user is logged in
  if (user) {
    const displayName = userProfile?.displayName || user.name || 'Innovator';
    const handle = userProfile?.handle;
    const profileHref = handle ? `/u/${handle}` : '/profile';

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-surface-1 p-1 pr-2.5 transition-all hover:border-hairline-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="User account menu"
        >
          <Avatar
            name={displayName}
            src={userProfile?.avatarUrl || user.image || undefined}
            size="sm"
            className="ring-1 ring-hairline"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-display text-caption font-bold text-fg leading-none max-w-[120px] truncate">
              {displayName}
            </span>
            {handle ? (
              <span className="font-mono text-[10px] text-accent leading-none mt-0.5 truncate max-w-[120px]">
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

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="menu"
            aria-label="User profile options"
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-hairline bg-surface-1 p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* User Header in Dropdown */}
            <div className="border-b border-hairline px-3 py-2.5 mb-1">
              <p className="font-display text-body-sm font-bold text-fg truncate">
                {displayName}
              </p>
              <p className="font-mono text-caption text-fg-muted truncate mt-0.5">
                {user.email}
              </p>
              {handle && (
                <div className="flex items-center gap-2 mt-2 pt-1 border-t border-hairline/60">
                  <span className="font-mono text-[11px] text-accent font-semibold">
                    @{handle}
                  </span>
                  {userProfile?.reputation !== undefined && (
                    <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-1.5 py-0.2 text-[10px] font-mono font-bold text-accent">
                      <Award className="size-2.5" />
                      {userProfile.reputation} REP
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Menu Links */}
            <div className="space-y-0.5" role="none">
              <Link
                href={profileHref}
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <User className="size-4 text-accent" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/settings"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <Settings className="size-4 text-fg-muted" />
                <span>Profile Settings</span>
              </Link>

              <Link
                href="/new"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm text-fg hover:bg-surface-2 transition-colors"
              >
                <Plus className="size-4 text-earn" />
                <span>Create New Project</span>
              </Link>

              {!handle && (
                <Link
                  href="/onboarding"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm text-accent bg-accent/5 hover:bg-accent/10 transition-colors font-medium"
                >
                  <Sparkles className="size-4 text-accent" />
                  <span>Claim Handle & Badges</span>
                </Link>
              )}
            </div>

            {/* Sign Out Divider */}
            <div className="border-t border-hairline my-1 pt-1" role="none">
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-sm text-danger hover:bg-danger/10 transition-colors text-left"
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

  // If user is not logged in
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="secondary">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <div className="hidden sm:block">
        <Button asChild size="sm" variant="primary">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
