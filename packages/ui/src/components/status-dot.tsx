import { cn } from '../cn';
import { toneFill } from '../tone';

export type StatusDotProps = {
  tone?: 'success' | 'warning' | 'danger' | 'accent';
  pulse?: boolean;
  /** Screen-reader text describing the status. */
  label?: string;
  className?: string;
};

export function StatusDot({ tone = 'success', pulse = false, label, className }: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex size-2 shrink-0', className)}>
      {pulse ? (
        <span
          aria-hidden
          className={cn(
            'absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping',
            toneFill[tone],
          )}
        />
      ) : null}
      <span aria-hidden className={cn('relative inline-flex size-2 rounded-full', toneFill[tone])} />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
