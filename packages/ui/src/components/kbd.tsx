import type { ComponentProps } from 'react';
import { cn } from '../cn';

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 items-center rounded-sm border border-line bg-sunken px-1.5',
        'font-mono text-[0.75rem] text-fg-muted',
        className,
      )}
      {...props}
    />
  );
}
