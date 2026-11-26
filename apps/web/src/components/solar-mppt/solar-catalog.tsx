'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Card, cn } from '@hackerland/ui';
import type { SolarMpptProject, MpptAlgorithm, BatteryBankType } from '@hackerland/core';
import { filterSolarMpptProjects } from '@hackerland/core';
import { SolarConverterWorkbench } from './solar-converter-workbench';

interface SolarCatalogProps {
  initialProjects: SolarMpptProject[];
}

export function SolarCatalog({ initialProjects }: SolarCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all');
  const [selectedBattery, setSelectedBattery] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'presets' | 'workbench'>('presets');

  const filteredProjects = filterSolarMpptProjects(initialProjects, {
    algorithm: selectedAlgorithm !== 'all' ? (selectedAlgorithm as MpptAlgorithm) : undefined,
    batteryType: selectedBattery !== 'all' ? (selectedBattery as BatteryBankType) : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  return (
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" variant="outline">
            Single-Diode PV Physics &amp; MPPT Power Converters
          </Badge>
          <span className="text-body-xs text-fg-subtle font-mono">
            BIS IS 14286 / IS 16221 &amp; PM-KUSUM Architecture
          </span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          Solar PV &amp; MPPT Battery Charge Controller Simulator
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Simulate single-diode photovoltaic I-V and P-V characteristic curves under irradiance G and cell temperature T_cell, plus MPPT buck converter component sizing.
        </p>
      </header>

      <div className="flex border-b border-hairline gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={cn(
            'pb-2.5 px-3 font-semibold border-b-2 transition-colors',
            activeTab === 'presets'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          Curated Indian Solar Projects ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={cn(
            'pb-2.5 px-3 font-semibold border-b-2 transition-colors',
            activeTab === 'workbench'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg',
          )}
        >
          Live Interactive Simulator
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by project, canal, PM-KUSUM, standard, or test lab..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-1 border border-line rounded-xl px-4 py-2 text-body-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2 text-fg-subtle hover:text-fg text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by MPPT Algorithm"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All MPPT Algorithms</option>
                <option value="incremental_conductance">Incremental Conductance</option>
                <option value="perturb_and_observe">Perturb &amp; Observe</option>
                <option value="global_sweep_partial_shading">Global Sweep MPPT</option>
                <option value="fractional_voc">Fractional Voc</option>
              </select>

              <select
                aria-label="Filter by Battery Chemistry"
                value={selectedBattery}
                onChange={(e) => setSelectedBattery(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Battery Banks</option>
                <option value="lfp_48v">48V LFP Pack</option>
                <option value="lfp_24v">24V LFP Pack</option>
                <option value="lfp_12v">12V LFP Pack</option>
                <option value="lead_acid_48v">48V Tubular Lead-Acid</option>
                <option value="lead_acid_12v">12V Lead-Acid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/solar-mppt/${project.slug}`} className="group block min-w-0">
                <Card className="h-full bg-surface-1 border-hairline rounded-2xl p-5 hover:border-accent/50 transition-all flex flex-col justify-between [overflow-wrap:anywhere]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="accent" variant="outline">{project.systemCapacityWatts}W</Badge>
                      <span className="text-[10px] font-mono text-fg-subtle uppercase">
                        {project.panelSpecs.technology.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition-colors line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-body-xs text-fg-muted line-clamp-2 leading-relaxed">
                      {project.application}
                    </p>

                    <div className="bg-sunken rounded-xl p-3 border border-hairline font-mono text-[11px] space-y-1">
                      <div className="flex justify-between text-fg-muted">
                        <span>Nominal Vmp / Imp:</span>
                        <span className="text-fg">
                          {project.panelSpecs.nominalVmpV}V / {project.panelSpecs.nominalImpA}A
                        </span>
                      </div>
                      <div className="flex justify-between text-fg-muted">
                        <span>Target Battery:</span>
                        <span className="text-accent-fg font-semibold">{project.targetBattery.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-fg-muted">
                        <span>Algorithm:</span>
                        <span className="text-success-fg">{project.mpptAlgorithm.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline mt-4 flex items-center justify-between text-body-xs font-mono">
                    <span className="text-fg-subtle truncate max-w-[180px]">
                      {project.indianContextFacility.split('-')[0]?.trim()}
                    </span>
                    <span className="text-accent-fg font-semibold group-hover:translate-x-0.5 transition-transform">
                      Inspect Architecture →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card className="text-center py-12 bg-surface-1 border-hairline text-fg-subtle font-mono text-body-xs">
              No matching solar MPPT projects found for query &quot;{search}&quot;.
            </Card>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="bg-sunken border border-hairline rounded-xl p-4 text-body-xs text-fg-muted leading-relaxed font-mono">
            Defaulted to 540W Monocrystalline PERC panel (41.8V Vmp, 12.92A Imp). Adjust sliders to inspect irradiance and buck converter passive dynamics.
          </div>
          <SolarConverterWorkbench
            initialPanelSpecs={{
              panelModel: 'Adani Solar 540W Mono PERC',
              technology: 'mono_perc',
              nominalPmaxW: 540,
              nominalVmpV: 41.8,
              nominalImpA: 12.92,
              nominalVocV: 49.6,
              nominalIscA: 13.68,
              tempCoeffVocPercentPerC: -0.27,
              tempCoeffIscPercentPerC: 0.048,
              tempCoeffPmaxPercentPerC: -0.35,
              seriesCells: 72,
            }}
          />
        </div>
      )}
    </div>
  );
}
