import type { ReactNode } from 'react';
import { cn } from '../cn';
import { StatusDot } from './status-dot';

const titleSize = {
  hero: 'text-display-hero-mobile md:text-display-hero',
  page: 'text-headline-xl-mobile md:text-headline-xl',
  section: 'text-headline-md md:text-headline-lg',
} as const;

export type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  size?: keyof typeof titleSize;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
  size = 'section',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="min-w-0 max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 flex items-center gap-2 font-display text-label-sm uppercase text-accent-fg">
            <StatusDot tone="accent" />
            {eyebrow}
          </p>
        ) : null}
        <Heading className={cn('font-display text-fg break-words', titleSize[size])}>{title}</Heading>
        {description ? (
          <p className="mt-3 text-body-md text-fg-muted md:text-body-lg">{description}</p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
