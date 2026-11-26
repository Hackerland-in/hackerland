import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '../cn';
import type { Tone } from '../tokens';
import { toneText } from '../tone';

export type ChipProps = ComponentProps<'span'> & { tone?: Tone };

/** Static pill for skills, topics, and hashtags. */
export function Chip({ tone = 'neutral', className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border border-hairline bg-surface-2',
        'px-3 py-1 text-body-sm font-medium break-words transition-colors hover:border-line',
        toneText[tone],
        className,
      )}
      {...props}
    />
  );
}

export type FilterChipProps = ComponentProps<'button'> & {
  selected?: boolean;
  tone?: Tone;
  /** Render the child (e.g. a link) as the chip; uses aria-current instead of aria-pressed. */
  asChild?: boolean;
};

/** Toggleable social filter pill. */
export function FilterChip({
  selected = false,
  tone = 'accent',
  asChild = false,
  className,
  type,
  ...props
}: FilterChipProps) {
  const classes = cn(
    'inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 md:h-9',
    'font-display text-label-md transition-all duration-150',
    selected
      ? tone === 'accent'
        ? 'border-accent bg-accent text-on-solid shadow-xs'
        : cn('border-current bg-surface-2 shadow-xs', toneText[tone])
      : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/40 hover:bg-accent/5 hover:text-fg',
    className,
  );

  if (asChild) {
    return <Slot className={classes} aria-current={selected ? 'true' : undefined} {...props} />;
  }

  return <button type={type ?? 'button'} className={classes} aria-pressed={selected} {...props} />;
}
