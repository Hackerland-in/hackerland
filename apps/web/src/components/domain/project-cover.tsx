import { useId } from 'react';
import type { Track } from '@hackerland/core';
import { cn } from '@hackerland/ui';
import {
  Atom,
  BookOpen,
  Code2,
  Coins,
  Hammer,
  Palette,
  Rocket,
} from 'lucide-react';

export interface ProjectCoverProps {
  tracks?: Track[];
  title?: string;
  className?: string;
}

const TRACK_ICONS: Record<Track, typeof Code2> = {
  code: Code2,
  make: Hammer,
  design: Palette,
  research: Atom,
  earn: Coins,
  learn: BookOpen,
};

const TRACK_GRADIENTS: Record<Track, string> = {
  code: 'from-code/12 via-surface-1 to-accent/10',
  make: 'from-make/12 via-surface-1 to-accent/10',
  design: 'from-accent/15 via-surface-1 to-design/10',
  research: 'from-research/12 via-surface-1 to-accent/10',
  earn: 'from-earn/12 via-surface-1 to-accent/10',
  learn: 'from-learn/12 via-surface-1 to-accent/10',
};

const TRACK_ICON_COLORS: Record<Track, string> = {
  code: 'text-code-fg border-code/30 bg-surface-1',
  make: 'text-make-fg border-make/30 bg-surface-1',
  design: 'text-accent-fg border-accent/30 bg-surface-1',
  research: 'text-research-fg border-research/30 bg-surface-1',
  earn: 'text-earn-fg border-earn/30 bg-surface-1',
  learn: 'text-learn-fg border-learn/30 bg-surface-1',
};

/**
 * Clean light showcase header banner for project cards.
 */
export function ProjectCover({
  tracks = [],
  title,
  className,
}: ProjectCoverProps) {
  const patternId = useId();
  const primaryTrack = tracks[0] as Track | undefined;
  const Icon = primaryTrack ? TRACK_ICONS[primaryTrack] : Rocket;
  const gradient = primaryTrack ? TRACK_GRADIENTS[primaryTrack] : 'from-accent/12 via-surface-1 to-surface-2';
  const iconColor = primaryTrack
    ? TRACK_ICON_COLORS[primaryTrack]
    : 'text-accent-fg border-accent/30 bg-surface-1';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex items-center justify-center overflow-hidden border-b border-hairline bg-gradient-to-br select-none',
        gradient,
        className,
      )}
    >
      {/* Subtle Dot Grid Pattern */}
      <svg className="absolute inset-0 size-full text-fg-subtle/15" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`dot-grid-${patternId}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dot-grid-${patternId})`} />
      </svg>

      {/* Center Feature Badge */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 px-4 text-center">
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-2xl border shadow-xs transition-transform group-hover:scale-105',
            iconColor,
          )}
        >
          <Icon className="size-6 stroke-[1.75]" />
        </div>
        {title ? (
          <span className="max-w-[220px] truncate rounded-full bg-surface-1/90 px-2.5 py-0.5 text-[11px] font-display font-medium text-fg-muted border border-hairline shadow-xs">
            {title}
          </span>
        ) : null}
      </div>
    </div>
  );
}
