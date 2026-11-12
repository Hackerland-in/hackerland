import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { fieldClasses } from './input';

export type TextareaProps = ComponentProps<'textarea'> & { invalid?: boolean };

export function Textarea({ invalid = false, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(fieldClasses, 'min-h-28 py-2.5', className)}
      {...props}
    />
  );
}
