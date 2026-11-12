import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../cn';

const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-sm transition-colors duration-150',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5',
  ],
  {
    variants: {
      variant: {
        ghost: 'text-fg-muted hover:bg-surface-2 hover:text-fg',
        secondary: 'border border-line bg-surface-1 text-fg-muted hover:border-accent hover:text-fg',
      },
      size: {
        sm: 'size-9',
        md: 'size-11',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> &
  VariantProps<typeof iconButtonVariants> & {
    /** Accessible name; icon-only buttons must always have one. */
    label: string;
  };

export function IconButton({ label, variant, size, className, type, ...props }: IconButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
