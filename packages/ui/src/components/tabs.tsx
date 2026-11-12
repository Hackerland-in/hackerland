'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';

type TabsContextValue = {
  baseId: string;
  value: string;
  select: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return context;
}

const idFor = (baseId: string, kind: 'tab' | 'panel', value: string) =>
  `${baseId}-${kind}-${value.replace(/\s+/g, '-')}`;

export type TabsProps = {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

/** WAI-ARIA tabs with automatic activation and roving focus. */
export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;

  const select = useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [onValueChange, value],
  );

  return (
    <TabsContext.Provider value={{ baseId, value: current, select }}>
      <div className={cn('min-w-0', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = { label: string; className?: string; children: ReactNode };

export function TabsList({ label, className, children }: TabsListProps) {
  const { baseId, select } = useTabs('TabsList');

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const all = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'),
      (tab) => tab.dataset.value ?? '',
    );
    const target = event.target as HTMLElement;
    const currentValue = target.dataset.value;
    if (!currentValue || all.length === 0) return;
    const index = all.indexOf(currentValue);
    let next: string | undefined;
    if (event.key === 'ArrowRight') next = all[(index + 1) % all.length];
    else if (event.key === 'ArrowLeft') next = all[(index - 1 + all.length) % all.length];
    else if (event.key === 'Home') next = all[0];
    else if (event.key === 'End') next = all[all.length - 1];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    document.getElementById(idFor(baseId, 'tab', next))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'flex max-w-full gap-1 overflow-x-auto rounded-lg border border-hairline bg-surface-1 p-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

export type TabsTriggerProps = { value: string; className?: string; children: ReactNode };

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { baseId, value: current, select } = useTabs('TabsTrigger');
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={idFor(baseId, 'tab', value)}
      aria-selected={selected}
      aria-controls={idFor(baseId, 'panel', value)}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      onClick={() => select(value)}
      className={cn(
        'inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-sm px-3 md:h-9',
        'font-display text-label-md uppercase transition-colors duration-150',
        selected
          ? 'bg-surface-3 text-accent-fg shadow-[inset_0_-2px_0_var(--color-accent)]'
          : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
        className,
      )}
    >
      {children}
    </button>
  );
}

export type TabsContentProps = { value: string; className?: string; children: ReactNode };

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { baseId, value: current } = useTabs('TabsContent');
  if (current !== value) return null;
  return (
    <div
      role="tabpanel"
      id={idFor(baseId, 'panel', value)}
      aria-labelledby={idFor(baseId, 'tab', value)}
      tabIndex={0}
      className={cn('mt-4 min-w-0 focus-visible:outline-offset-4', className)}
    >
      {children}
    </div>
  );
}
