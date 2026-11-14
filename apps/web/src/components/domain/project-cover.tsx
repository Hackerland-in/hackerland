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

const TRACK_GLOWS: Record<Track, string> = {
  code: 'bg-code/20',
  make: 'bg-make/20',
  design: 'bg-design/20',
  research: 'bg-research/20',
  earn: 'bg-earn/20',
  learn: 'bg-learn/20',
};

const TRACK_ICON_COLORS: Record<Track, string> = {
  code: 'text-code-fg border-code/40',
  make: 'text-make-fg border-make/40',
  design: 'text-design-fg border-design/40',
  research: 'text-research-fg border-research/40',
  earn: 'text-earn-fg border-earn/40',
  learn: 'text-learn-fg border-learn/40',
};

/**
 * Decorative blueprint artwork for projects.
 * Renders technical grid lines, track accent glow, HUD corner markers,
 * and the primary track's icon.
 */
export function ProjectCover({
  tracks = [],
  title,
  className,
}: ProjectCoverProps) {
  const patternId = useId();
  const primaryTrack = tracks[0] as Track | undefined;
  const Icon = primaryTrack ? TRACK_ICONS[primaryTrack] : Rocket;
  const glow = primaryTrack ? TRACK_GLOWS[primaryTrack] : 'bg-accent/20';
  const iconColor = primaryTrack
    ? TRACK_ICON_COLORS[primaryTrack]
    : 'text-accent-fg border-accent/40';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex items-center justify-center overflow-hidden border-b border-hairline bg-surface-1/90 select-none',
        className,
      )}
    >
      {/* Blueprint grid pattern */}
      <svg
        className="absolute inset-0 size-full stroke-hairline/60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`cover-grid-${patternId}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#cover-grid-${patternId})`} />
      </svg>

      {/* Track-coloured ambient glow */}
      <div
        className={cn(
          'pointer-events-none absolute size-56 rounded-full blur-3xl opacity-30 transition-opacity',
          glow,
        )}
      />

      {/* HUD blueprint corner markings */}
      <div className="pointer-events-none absolute inset-2.5 border border-hairline/30">
        <span className="absolute -top-px -left-px size-2 border-t-2 border-l-2 border-accent/70" />
        <span className="absolute -top-px -right-px size-2 border-t-2 border-r-2 border-accent/70" />
        <span className="absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-accent/70" />
        <span className="absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-accent/70" />
      </div>

      {/* Telemetry mark */}
      <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-wider text-fg-subtle/70">
        {primaryTrack ? `SYS://${primaryTrack.toUpperCase()}` : 'SYS://CORE'}
      </div>

      {/* Center blueprint icon */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-lg border bg-surface-2/90 shadow-module',
            iconColor,
          )}
        >
          <Icon className="size-6 stroke-[1.75]" />
        </div>
        {title ? (
          <span className="max-w-[200px] truncate font-mono text-[11px] text-fg-subtle">
            {title}
          </span>
        ) : null}
      </div>
    </div>
  );
}
