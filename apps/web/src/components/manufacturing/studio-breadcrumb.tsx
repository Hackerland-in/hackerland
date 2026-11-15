'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge, Button } from '@hackerland/ui';

export interface StudioBreadcrumbProps {
  title: string;
  category: string;
  badge: string;
  activeId: 'bench' | 'circuito' | 'spice' | 'falstad' | 'hdl' | 'iss' | 'eda' | 'tools';
}

const STUDIOS = [
  { id: 'bench', label: 'ESP-Labs Bench', href: '/manufacturing/bench' },
  { id: 'circuito', label: 'Circuito.io Wiring', href: '/manufacturing/circuito' },
  { id: 'spice', label: 'SPICE Hardware', href: '/manufacturing/spice' },
  { id: 'falstad', label: 'Falstad & ngspice', href: '/manufacturing/falstad' },
  { id: 'hdl', label: 'HDL & GTKWave', href: '/manufacturing/hdl' },
  { id: 'iss', label: 'RISC-V ISS', href: '/manufacturing/iss' },
  { id: 'eda', label: 'Open-Source EDA', href: '/manufacturing/eda' },
  { id: 'tools', label: 'Factory Tooling', href: '/manufacturing/tools' },
];

export function StudioBreadcrumb({
  title,
  category,
  badge,
  activeId,
}: StudioBreadcrumbProps) {
  return (
    <div className="space-y-4 rounded-xl border border-hairline bg-surface-1 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild variant="secondary" size="sm">
            <Link href="/manufacturing">
              <ArrowLeft className="size-4 mr-1.5" />
              <span><span className="hidden sm:inline">Manufacturing </span>Hub</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold uppercase tracking-wider text-accent">
              {category}
            </span>
            <span className="text-fg-subtle">/</span>
            <span className="font-display text-body-sm font-bold text-fg">{title}</span>
          </div>
        </div>

        <Badge tone="accent" variant="solid" className="self-start sm:self-auto font-mono text-caption">
          {badge}
        </Badge>
      </div>

      {/* Quick Jump Bar across Studios */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-hairline/60 scrollbar-thin">
        <span className="text-[11px] font-mono text-fg-muted uppercase font-bold shrink-0 mr-1">
          Switch Studio:
        </span>
        {STUDIOS.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className={`px-2.5 py-1 rounded-md text-caption font-medium whitespace-nowrap transition-colors border ${
              s.id === activeId
                ? 'border-accent bg-accent/10 text-accent font-semibold'
                : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
