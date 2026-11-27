'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CORRIDOR_META } from '@hackerland/core';
import { Badge, Button, Card, FilterChip } from '@hackerland/ui';
import { Anchor, ArrowRight, Globe2, Plane, ShieldCheck } from 'lucide-react';
import {
  EXPORT_ARCHETYPE_METADATA,
  EXPORT_CORRIDORS_CATALOG,
} from '@/lib/data/export-trade-data';

export function CorridorDirectory() {
  const [filterMode, setFilterMode] = useState<'all' | 'fta_zero_duty'>('all');

  const corridors = useMemo(() => {
    if (filterMode === 'fta_zero_duty') {
      return EXPORT_CORRIDORS_CATALOG.filter((c) => CORRIDOR_META[c.corridorId].ftaAvailable);
    }
    return EXPORT_CORRIDORS_CATALOG;
  }, [filterMode]);

  return (
    <div className="space-y-5 min-w-0">
      <Card className="border-hairline bg-surface-1 p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="size-4 text-accent-fg" />
              <h2 className="font-display text-headline-sm font-bold text-fg">
                India → Global Trade Corridors &amp; Port Playbooks
              </h2>
            </div>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Compare bilateral FTA tariff perks, mandatory destination marks, and Indian exit ports across 5 strategic hardware corridors.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              selected={filterMode === 'all'}
              tone="accent"
              onClick={() => setFilterMode('all')}
            >
              All 5 Corridors
            </FilterChip>
            <FilterChip
              selected={filterMode === 'fta_zero_duty'}
              tone="accent"
              onClick={() => setFilterMode('fta_zero_duty')}
            >
              Preferential FTA Corridors (CEPA / AIFTA)
            </FilterChip>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {corridors.map((corridor) => {
          const meta = CORRIDOR_META[corridor.corridorId];
          return (
            <Card
              key={corridor.slug}
              accent="accent"
              interactive
              className="flex flex-col justify-between p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={meta.ftaAvailable ? 'success' : 'accent'} variant="outline">
                    {corridor.ftaBadge}
                  </Badge>
                  <span className="font-mono text-[11px] text-fg-subtle">
                    /export/{corridor.slug}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/export/${corridor.slug}`}
                    className="font-display text-headline-sm font-bold text-fg hover:text-accent-fg transition-colors"
                  >
                    {corridor.name}
                  </Link>
                  <p className="text-[11px] font-mono text-accent-fg mt-0.5">
                    {corridor.regionTagline}
                  </p>
                  <p className="text-body-xs text-fg-muted mt-1.5 leading-relaxed">
                    {corridor.headline}
                  </p>
                </div>

                <div className="rounded-xl border border-hairline bg-sunken p-3 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-fg-subtle block">
                    FTA &amp; Tariff Advantage
                  </span>
                  <p className="text-body-xs text-fg leading-relaxed">{corridor.ftaPerkSummary}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-fg-subtle flex items-center gap-1">
                    <ShieldCheck className="size-3 text-accent-fg" /> Mandatory Regulatory Marks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {corridor.regulatoryMarks.map((mark) => (
                      <span
                        key={mark}
                        className="rounded-full border border-hairline bg-surface-1 px-2.5 py-0.5 text-[11px] font-mono text-fg"
                      >
                        {mark}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px] font-mono">
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5 space-y-1">
                    <span className="text-fg-subtle flex items-center gap-1 text-[10px]">
                      <Anchor className="size-3 text-accent-fg" /> INDIAN PORTS ({corridor.seaTransitDays} Sea)
                    </span>
                    <div className="text-fg font-medium">
                      {corridor.indianOriginPorts.join(' · ')}
                    </div>
                  </div>
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5 space-y-1">
                    <span className="text-fg-subtle flex items-center gap-1 text-[10px]">
                      <Plane className="size-3 text-accent-fg" /> DEST HUBS ({corridor.airTransitDays} Air)
                    </span>
                    <div className="text-fg font-medium">
                      {corridor.destinationPorts.join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-fg-muted space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
                    Customs &amp; CHA Execution Notes
                  </span>
                  <p className="leading-relaxed">{corridor.customsNotes[0]}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-fg-subtle uppercase">Top Exports:</span>
                  {corridor.recommendedArchetypes.map((arch) => (
                    <Badge key={arch} tone="neutral" variant="outline">
                      {EXPORT_ARCHETYPE_METADATA[arch].shortLabel}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-hairline pt-3 flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-fg-subtle">
                  LCL Baseline: ₹{meta.defaultFreightPerShipmentInr.toLocaleString('en-IN')}/shpt
                </span>
                <Button asChild variant="primary" size="sm">
                  <Link href={`/export/${corridor.slug}`}>
                    <span>Open Corridor Playbook</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
