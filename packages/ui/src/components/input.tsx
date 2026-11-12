import type { ComponentProps } from 'react';
import { cn } from '../cn';

export const fieldClasses = [
  'w-full min-w-0 rounded-sm border border-line bg-sunken px-3 text-body-md text-fg',
  'placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-150',
  'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-danger aria-invalid:ring-1 aria-invalid:ring-danger',
].join(' ');

export type InputProps = ComponentProps<'input'> & { invalid?: boolean };

export function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(fieldClasses, 'h-11', className)}
      {...props}
    />
  );
}
