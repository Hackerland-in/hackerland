'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Card, StatTile, cn } from '@hackerland/ui';
import type { BatteryEisProject, CellChemistry } from '@hackerland/core';
import { filterBatteryEisProjects } from '@hackerland/core';

interface BatteryEisCatalogProps {
  initialProjects: BatteryEisProject[];
}

export function BatteryEisCatalog({ initialProjects }: BatteryEisCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedChemistry, setSelectedChemistry] = useState<string>('all');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');

  const filteredProjects = filterBatteryEisProjects(initialProjects, {
    chemistry: selectedChemistry !== 'all' ? (selectedChemistry as CellChemistry) : undefined,
    safetyVerdict:
      selectedVerdict !== 'all'
        ? (selectedVerdict as 'certified_safe' | 'advisory_derate' | 'quarantine_isolate')
        : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  const safeCount = initialProjects.filter((p) => p.diagnostics.ais156SafetyVerdict === 'certified_safe').length;
  const derateCount = initialProjects.filter((p) => p.diagnostics.ais156SafetyVerdict === 'advisory_derate').length;
  const isolateCount = initialProjects.filter((p) => p.diagnostics.ais156SafetyVerdict === 'quarantine_isolate').length;

  return (
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" variant="outline">
            Electrochemical Impedance Spectroscopy (EIS)
          </Badge>
          <span className="text-body-xs text-fg-subtle font-mono">
            AIS-156 Amendment 3 &amp; Cell Degradation Physics
          </span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          Battery State-of-Health (SoH) &amp; EIS Analyzer
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Inspect Nyquist semicircles, Bode responses, and Randles Equivalent Circuit Models (0.01 Hz–100 kHz) to spot SEI growth and lithium plating.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Total Characterized Cells" value={initialProjects.length} hint="LFP, NMC & Na-Ion" tone="accent" />
        <StatTile label="AIS-156 Certified Safe" value={safeCount} hint="Nominal impedance" tone="make" />
        <StatTile label="Advisory Derate" value={derateCount} hint="45°C heatwave aging" tone="code" />
        <StatTile label="Quarantine Isolate" value={isolateCount} hint="Plating / abuse flagged" tone="danger" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search cells by model, facility (ARAI, ICAT, IIT-M, CSIR) or failure mode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-surface-1 border border-line rounded-xl px-4 py-2 text-body-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
        />

        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter by battery chemistry"
            value={selectedChemistry}
            onChange={(e) => setSelectedChemistry(e.target.value)}
            className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
          >
            <option value="all">All Chemistries</option>
            <option value="lfp_32700">LFP (32700 Cylindrical)</option>
            <option value="nmc_21700">NMC (21700 High-Energy)</option>
            <option value="nmc_4680">NMC (4680 Tabless)</option>
            <option value="sodium_ion">Sodium-Ion (Na-Ion)</option>
          </select>

          <select
            aria-label="Filter by AIS-156 safety verdict"
            value={selectedVerdict}
            onChange={(e) => setSelectedVerdict(e.target.value)}
            className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
          >
            <option value="all">All Verdicts</option>
            <option value="certified_safe">Certified Safe</option>
            <option value="advisory_derate">Advisory Derate</option>
            <option value="quarantine_isolate">Quarantine Isolate</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const verdictTone: 'success' | 'warning' | 'danger' =
            project.diagnostics.ais156SafetyVerdict === 'certified_safe'
              ? 'success'
              : project.diagnostics.ais156SafetyVerdict === 'advisory_derate'
                ? 'warning'
                : 'danger';
          return (
            <Link key={project.id} href={`/battery-eis/${project.slug}`} className="group block min-w-0">
              <Card className="h-full border-hairline bg-surface-1 hover:border-accent/50 rounded-2xl p-5 transition-all flex flex-col justify-between [overflow-wrap:anywhere]">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <Badge tone="accent" variant="outline">
                      {project.chemistry.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <Badge tone={verdictTone} variant="outline">
                      {project.diagnostics.ais156SafetyVerdict.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-body-xs text-fg-muted mt-1 line-clamp-2 leading-relaxed">
                    {project.cellModel} · Tested at {project.testTemperatureC}°C after {project.cycleCount} cycles
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-hairline space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-fg-muted">
                    <span>State of Health (SoH):</span>
                    <span
                      className={cn(
                        'font-bold',
                        project.diagnostics.sohPercent >= 90
                          ? 'text-success-fg'
                          : project.diagnostics.sohPercent >= 80
                            ? 'text-warning-fg'
                            : 'text-danger-fg',
                      )}
                    >
                      {project.diagnostics.sohPercent}% ({project.diagnostics.capacityAh}Ah)
                    </span>
                  </div>
                  <div className="flex justify-between text-fg-muted">
                    <span>R₀ (Bulk 1kHz):</span>
                    <span className="text-fg font-bold">
                      {(project.fittedEcm.rBulkOhm * 1000).toFixed(2)} mΩ
                    </span>
                  </div>
                  <div className="flex justify-between text-fg-muted">
                    <span>Charge Transfer R_ct:</span>
                    <span className="text-accent-fg font-bold">
                      {(project.fittedEcm.rCtOhm * 1000).toFixed(2)} mΩ
                    </span>
                  </div>
                  <div className="text-[10px] text-fg-subtle truncate pt-1 border-t border-hairline">
                    📍 {project.testFacility}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="text-center py-12 bg-surface-1 border-hairline font-mono text-fg-subtle text-body-xs">
          No matching battery EIS records found for current search and filters.
        </Card>
      )}
    </div>
  );
}
