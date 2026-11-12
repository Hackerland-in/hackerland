import type { ReactNode } from 'react';
import { cn } from '../cn';
import type { Tone } from '../tokens';
import { toneText } from '../tone';

export type StatTileProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/** KPI readout: label, big tabular value, optional hint and extra content. */
export function StatTile({ label, value, hint, tone, icon, className, children }: StatTileProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-2 rounded-lg border border-hairline bg-surface-1 p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-label-sm uppercase text-fg-subtle">{label}</span>
        {icon ? <span className="text-fg-subtle [&_svg]:size-4">{icon}</span> : null}
      </div>
      <div
        className={cn(
          'font-display text-headline-lg tabular-nums break-words',
          tone ? toneText[tone] : 'text-fg',
        )}
      >
        {value}
      </div>
      {children}
      {hint ? <div className="text-body-sm text-fg-muted">{hint}</div> : null}
    </div>
  );
}
