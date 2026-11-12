import type { ReactNode } from 'react';
import { cn } from '../cn';
import { slugify } from '../slug';

export type PanelProps = {
  title: ReactNode;
  /** Required when `title` is not a plain string, so the section can be labelled. */
  titleId?: string;
  icon?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
  children?: ReactNode;
};

/** Titled section container, exposed as a named region. */
export function Panel({
  title,
  titleId,
  icon,
  action,
  headingLevel = 2,
  className,
  children,
}: PanelProps) {
  const headingId = titleId ?? (typeof title === 'string' ? `panel-${slugify(title)}` : undefined);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'min-w-0 rounded-lg border border-hairline bg-surface-1 p-4 md:p-5',
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Heading
          id={headingId}
          className="flex min-w-0 items-center gap-2 font-display text-headline-sm text-fg [&_svg]:size-5 [&_svg]:text-accent"
        >
          {icon}
          <span className="min-w-0 break-words">{title}</span>
        </Heading>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
