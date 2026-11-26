import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Button } from '@hackerland/ui';
import { MainNav } from './main-nav';
import { SearchBar } from './search-bar';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { NotificationPopover } from './notification-popover';
import { UserNav } from './user-nav';
import { MobileMenu } from './mobile-menu';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full overflow-x-clip border-b border-hairline bg-surface-1/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        {/* Left: Signature Pink H + Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full pr-1"
          >
            <Image
              src="/logo.png"
              alt="Hackerland Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain shrink-0 shadow-xs"
              priority
            />
            <Image
              src="/images/logo2.png"
              alt="Hackerland"
              width={120}
              height={24}
              className="h-[21px] sm:h-[24px] w-auto object-contain dark:invert dark:brightness-150 shrink-0"
              priority
            />
          </Link>
        </div>

        {/* Center: Clean Social Navigation (lg+ only) */}
        <MainNav />

        {/* Right: Community Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <SearchBar />

          <div className="hidden md:block">
            <NotificationPopover />
          </div>

          <ThemeToggle />

          <div className="hidden xl:block">
            <Button asChild size="sm" variant="primary" className="gap-1.5">
              <Link href="/new">
                <Plus className="size-4" aria-hidden="true" />
                <span>Share build</span>
              </Link>
            </Button>
          </div>

          <UserNav />

          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
