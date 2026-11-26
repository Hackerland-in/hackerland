import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '../cn';
import type { TrackTone } from '../tokens';

type CardAccent = TrackTone | 'accent';

const accentBar: Record<CardAccent, string> = {
  code: 'before:bg-code',
  make: 'before:bg-make',
  design: 'before:bg-design',
  research: 'before:bg-research',
  earn: 'before:bg-earn',
  learn: 'before:bg-learn',
  accent: 'before:bg-accent',
};

export type CardProps = ComponentProps<'div'> & {
  /** Shows a subtle top highlight bar in this tone on hover / focus-within. */
  accent?: CardAccent;
  /** Hover elevation for clickable cards. */
  interactive?: boolean;
  asChild?: boolean;
};

export function Card({ accent, interactive = false, asChild = false, className, ...props }: CardProps) {
  const Component = asChild ? Slot : 'div';
  return (
    <Component
      data-accent={accent}
      className={cn(
        'relative min-w-0 overflow-hidden rounded-2xl border border-hairline bg-surface-1 shadow-xs',
        interactive &&
          'transition-[border-color,box-shadow,background-color,transform] duration-150 hover:border-accent/30 hover:shadow-module',
        accent && [
          'before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:opacity-0',
          'before:transition-opacity before:duration-150',
          'hover:before:opacity-100 focus-within:before:opacity-100',
          accentBar[accent],
        ],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-4 pb-0 md:p-5 md:pb-0', className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-4 md:p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 border-t border-hairline/80 px-4 py-3 md:px-5',
        className,
      )}
      {...props}
    />
  );
}
