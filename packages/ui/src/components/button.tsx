import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../cn';

export const buttonVariants = cva(
  [
    'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm',
    'font-display font-semibold transition-[background-color,border-color,color,box-shadow,transform]',
    'duration-150 ease-out active:scale-[.98] motion-reduce:active:scale-100',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-solid hover:bg-accent-strong hover:shadow-glow-accent',
        secondary:
          'border border-line bg-transparent text-fg hover:border-accent hover:bg-accent/8',
        ghost: 'bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg',
        make: 'bg-make text-on-solid hover:shadow-glow-make',
        earn: 'bg-earn text-on-solid hover:shadow-glow-earn',
        danger: 'bg-danger text-fg hover:bg-danger/90',
      },
      size: {
        sm: 'h-9 px-3 text-body-sm',
        md: 'h-11 px-4 text-label-lg',
        lg: 'h-13 px-6 text-body-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child element (e.g. a link) with button styling. */
    asChild?: boolean;
    /** Show a spinner, disable the button and mark it busy. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderCircle aria-hidden className="motion-safe:animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
