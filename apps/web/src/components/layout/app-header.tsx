import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button, IconButton, SearchField } from '@hackerland/ui';
import { MainNav } from './main-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { NotificationPopover } from './notification-popover';
import { UserNav } from './user-nav';
import { MobileMenu } from './mobile-menu';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded border border-accent bg-accent/10 font-display text-headline-sm font-bold text-accent">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4v16" />
                <path d="M20 4v16" />
                <path d="M4 12h16" />
              </svg>
            </div>
            <span className="font-display text-headline-sm font-bold tracking-wider text-fg">
              HACKERLAND
            </span>
          </Link>
        </div>

        {/* Center: Main Nav (md+ only) */}
        <MainNav />

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Search field on xl+ */}
          <div className="hidden xl:block w-48">
            <SearchField
              placeholder="Search Hackerland…"
              className="w-full text-caption"
            />
          </div>

          {/* Search icon below xl */}
          <div className="xl:hidden">
            <Link href="/feed">
              <IconButton label="Search">
                <Search className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </Link>
          </div>

          {/* Notifications on md+ */}
          <div className="hidden md:block">
            <NotificationPopover />
          </div>

          {/* Theme toggle (Dark / Day mode) */}
          <ThemeToggle />

          {/* Primary CTA (Start project) on lg+ */}
          <div className="hidden lg:block">
            <Button asChild size="sm" variant="primary">
              <Link href="/new">Start project</Link>
            </Button>
          </div>

          {/* User Nav (Profile / Menu if logged in, Sign in / Sign up if not) */}
          <UserNav />

          {/* Mobile Menu Hamburger (md:hidden) */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
