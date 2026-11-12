import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '../cn';
import type { Tone } from '../tokens';
import { toneText } from '../tone';

export type ChipProps = ComponentProps<'span'> & { tone?: Tone };

/** Static pill for skills and tags. */
export function Chip({ tone = 'neutral', className, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-sm border border-hairline bg-surface-2',
        'px-2.5 py-1 text-body-sm break-words',
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

/** Toggleable filter pill. */
export function FilterChip({
  selected = false,
  tone = 'accent',
  asChild = false,
  className,
  type,
  ...props
}: FilterChipProps) {
  const classes = cn(
    'inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-sm border px-3 md:h-9',
    'font-display text-label-md uppercase transition-colors duration-150',
    selected
      ? tone === 'accent'
        ? 'border-accent bg-accent text-on-solid'
        : cn('border-current bg-surface-2', toneText[tone])
      : 'border-line bg-surface-1 text-fg-muted hover:border-accent/60 hover:text-fg',
    className,
  );

  if (asChild) {
    return <Slot className={classes} aria-current={selected ? 'true' : undefined} {...props} />;
  }

  return <button type={type ?? 'button'} className={classes} aria-pressed={selected} {...props} />;
}
