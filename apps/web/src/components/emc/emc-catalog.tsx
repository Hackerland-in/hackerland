'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { EmcScanProject, EmcStandard } from '@hackerland/core';
import { filterEmcProjects, evaluateEmcCompliance } from '@hackerland/core';

interface EmcCatalogProps {
  initialProjects: EmcScanProject[];
}

const STANDARD_LABELS: Record<EmcStandard | 'all', string> = {
  all: 'All Standards',
  cispr_25_class5: 'CISPR 25 (EV & Automotive)',
  cispr_32_class_b: 'CISPR 32 Class B (Commercial/IoT)',
  fcc_part15_class_b: 'FCC Part 15 (Compute & Silicon)',
  mil_std_461g: 'MIL-STD-461G (Aerospace/Defence)',
  ais_004_automotive: 'AIS-004 (Indian Automotive)',
};

export function EmcCatalog({ initialProjects }: EmcCatalogProps) {
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return filterEmcProjects(initialProjects, {
      standard: selectedStandard,
      search: searchQuery,
    });
  }, [initialProjects, selectedStandard, searchQuery]);

  const compliantCount = useMemo(() => {
    return initialProjects.filter((p) => p.overallStatus === 'compliant').length;
  }, [initialProjects]);

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pre-Compliance Scans
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {initialProjects.length} Verified
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">150 kHz – 1 GHz Spectrum</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            First-Pass Compliance
          </span>
          <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            {Math.round((compliantCount / initialProjects.length) * 100)}%
          </p>
          <span className="text-[11px] text-emerald-500 font-mono">Pass / Marginal / Fail</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            NABL Lab Chambers
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            SAMEER / ARAI
          </p>
          <span className="text-[11px] text-primary font-mono">ERTL & CSIR-NAL Testbeds</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Standards Mapped
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            CISPR 25 & 32
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">FCC Part 15 & MIL-STD</span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(STANDARD_LABELS).map(([std, label]) => (
            <button
              key={std}
              onClick={() => setSelectedStandard(std)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStandard === std
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search DUT, SAMEER, CAN, GaN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-64"
        />
      </div>

      {/* Grid of Projects */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium text-foreground">No pre-compliance scans match your criteria</p>
          <p className="text-xs text-muted-foreground mt-1">Try resetting the standard filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const evalResult = evaluateEmcCompliance(proj.spectralTrace);

            return (
              <Link
                key={proj.id}
                href={`/emc/${proj.slug}`}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground uppercase">
                      {proj.standard.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                        proj.overallStatus === 'compliant'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : proj.overallStatus === 'marginal_warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-destructive/10 text-destructive border border-destructive/20'
                      }`}
                    >
                      {proj.overallStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1 font-mono">
                    DUT: {proj.deviceUnderTesting}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Worst Margin
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          evalResult.worstMarginDb >= 3
                            ? 'text-emerald-400'
                            : evalResult.worstMarginDb >= 0
                            ? 'text-amber-400'
                            : 'text-destructive'
                        }`}
                      >
                        {evalResult.worstMarginDb >= 0 ? `+${evalResult.worstMarginDb}` : evalResult.worstMarginDb} dB
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Hotspots
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {proj.hotspots.length} Probed Nodes
                      </span>
                    </div>
                  </div>

                  {/* Scan Type & Lab */}
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="capitalize">{proj.scanType.replace('_', ' ')}</span>
                    <span className="truncate max-w-[140px] text-right">{proj.testLabFacility.split('(')[0]}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{proj.spectralTrace.length} Spectral Bins</span>
                  <span className="text-primary group-hover:underline font-semibold">
                    Inspect Spectrum →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
