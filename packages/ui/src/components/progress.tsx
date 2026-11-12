import { cn } from '../cn';
import type { Tone } from '../tokens';
import { toneFill } from '../tone';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type ProgressBarProps = {
  value: number;
  max?: number;
  tone?: Tone;
  label: string;
  showValue?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  max = 100,
  tone = 'accent',
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const current = clamp(value, 0, max);
  const percent = max > 0 ? Math.round((current / max) * 100) : 0;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={current}
        className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-hairline"
      >
        <div
          className={cn('h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500', toneFill[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue ? (
        <span className="font-display text-label-md tabular-nums text-fg-muted">{percent}%</span>
      ) : null}
    </div>
  );
}

export type SegmentedProgressProps = {
  total: number;
  completed: number;
  tone?: Tone;
  label: string;
  className?: string;
};

export function SegmentedProgress({
  total,
  completed,
  tone = 'accent',
  label,
  className,
}: SegmentedProgressProps) {
  const steps = Math.max(0, Math.floor(total));
  const done = clamp(Math.floor(completed), 0, steps);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={steps}
      aria-valuenow={done}
      aria-valuetext={`${done} of ${steps}`}
      className={cn('flex gap-1', className)}
    >
      {Array.from({ length: steps }, (_, index) => (
        <span
          key={index}
          data-segment
          data-filled={index < done}
          className={cn('h-1.5 flex-1 rounded-full', index < done ? toneFill[tone] : 'bg-hairline')}
        />
      ))}
    </div>
  );
}
