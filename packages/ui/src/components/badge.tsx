import type { ComponentProps } from 'react';
import { cn } from '../cn';
import type { Tone } from '../tokens';
import { toneOutline, toneSolid } from '../tone';

export type BadgeProps = ComponentProps<'span'> & {
  tone?: Tone;
  variant?: 'outline' | 'solid';
};

/** 24px community status pill. Always carries text: never colour alone. */
export function Badge({ tone = 'neutral', variant = 'outline', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 max-w-full shrink-0 items-center gap-1 truncate rounded-full border px-2.5',
        'font-display text-label-sm [&_svg]:size-3',
        variant === 'solid' ? toneSolid[tone] : toneOutline[tone],
        className,
      )}
      {...props}
    />
  );
}
