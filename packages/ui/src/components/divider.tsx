import { cn } from '../cn';

export type DividerProps = {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
};

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-hairline',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
        className,
      )}
    />
  );
}
