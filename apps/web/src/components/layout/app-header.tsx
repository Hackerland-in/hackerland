import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@hackerland/ui';
import { MainNav } from './main-nav';
import { SearchBar } from './search-bar';
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
            <Image
              src="/logo.png"
              alt="Hackerland Logo"
              width={30}
              height={30}
              className="h-[30px] w-[30px] rounded object-contain shadow-xs"
              priority
            />
            <Image
              src="/images/logo2.png"
              alt="Hackerland"
              width={140}
              height={28}
              className="h-[28px] w-auto object-contain dark:brightness-200 dark:contrast-125"
              priority
            />
          </Link>
        </div>

        {/* Center: Main Nav (md+ only) */}
        <MainNav />

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Interactive Global Search (Spotlight ⌘K + input + mobile trigger) */}
          <SearchBar />

          {/* Notifications on md+ */}
          <div className="hidden md:block">
            <NotificationPopover />
          </div>

          {/* Theme toggle (Dark / Day mode) */}
          <ThemeToggle />

          {/* Join AI Community on 2xl+ */}
          <div className="hidden 2xl:block">
            <Button asChild size="sm" variant="ghost" className="text-brand-pink border border-brand-pink/30 hover:bg-brand-pink/10 hover:text-brand-pink">
              <a href="https://ai.hackerland.in/" target="_blank" rel="noopener noreferrer">
                Join AI Community
              </a>
            </Button>
          </div>

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
