import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { Button, IconButton, SearchField } from '@hackerland/ui';
import { MainNav } from './main-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
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
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search field on lg+ */}
          <div className="hidden lg:block w-64">
            <SearchField
              placeholder="Search projects, people, bounties…"
              className="w-full text-body-sm"
            />
          </div>

          {/* Search icon below md */}
          <div className="md:hidden">
            <Link href="/feed">
              <IconButton label="Search">
                <Search className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </Link>
          </div>

          {/* Notifications on md+ */}
          <div className="hidden md:block">
            <IconButton label="Notifications">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </IconButton>
          </div>

          {/* Theme toggle (Dark / Day mode) */}
          <ThemeToggle />

          {/* Primary CTA (Start project) on md+ */}
          <div className="hidden md:block">
            <Button asChild size="sm" variant="primary">
              <Link href="/new">Start project</Link>
            </Button>
          </div>

          {/* Sign in on all viewports */}
          <Button asChild size="sm" variant="secondary">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
