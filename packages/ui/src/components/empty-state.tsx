import type { ReactNode } from 'react';
import { cn } from '../cn';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  as: Heading = 'h2',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-line bg-surface-1/50 px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full border border-line bg-surface-2 text-accent [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <Heading className="font-display text-headline-sm text-fg">{title}</Heading>
      {description ? <p className="max-w-md text-body-md text-fg-muted">{description}</p> : null}
      {action ? <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
