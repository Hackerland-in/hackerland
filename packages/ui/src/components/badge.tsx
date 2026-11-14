import type { ComponentProps } from 'react';
import { cn } from '../cn';
import type { Tone } from '../tokens';
import { toneOutline, toneSolid } from '../tone';

export type BadgeProps = ComponentProps<'span'> & {
  tone?: Tone;
  variant?: 'outline' | 'solid';
};

/** 22px uppercase metadata tag. Always carries text: never colour alone. */
export function Badge({ tone = 'neutral', variant = 'outline', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] max-w-full shrink-0 items-center gap-1 truncate rounded-sm border px-2',
        'font-display text-label-sm uppercase [&_svg]:size-3',
        variant === 'solid' ? toneSolid[tone] : toneOutline[tone],
        className,
      )}
      {...props}
    />
  );
}
