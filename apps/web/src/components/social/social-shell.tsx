import type { ReactNode } from 'react';
import { cn } from '@hackerland/ui';
import { LeftCommunityRail } from './left-community-rail';

export interface SocialShellProps {
  children: ReactNode;
  rightRail?: ReactNode;
  className?: string;
}

/**
 * 3-Column Social Network Shell:
 * - Left sticky community nav rail (lg+)
 * - Center social stream / main workspace (fluid, optimal readable width)
 * - Right sticky community widgets rail (xl+, stacks cleanly below on mobile/tablet)
 */
export function SocialShell({ children, rightRail, className }: SocialShellProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-page px-3 sm:px-6 lg:px-8 py-5 md:py-7 min-w-0',
        className,
      )}
    >
      <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8 min-w-0">
        {/* Left Navigation Sidebar */}
        <div className="hidden lg:block w-[228px] xl:w-[244px] shrink-0 sticky top-20">
          <LeftCommunityRail />
        </div>

        {/* Center Main Social Stream */}
        <div className="w-full min-w-0 flex-1 space-y-5">
          {children}
        </div>

        {/* Right Community Rail */}
        {rightRail ? (
          <aside
            aria-label="Community Highlights"
            className="w-full lg:w-[300px] xl:w-[330px] shrink-0 xl:sticky xl:top-20 space-y-5 min-w-0"
          >
            {rightRail}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
