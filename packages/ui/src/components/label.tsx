import type { ComponentProps } from 'react';
import { cn } from '../cn';

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      className={cn('font-display text-label-md uppercase text-fg-muted', className)}
      {...props}
    />
  );
}
