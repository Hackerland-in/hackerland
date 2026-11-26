'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Card, cn } from '@hackerland/ui';
import type { CoolingMethod, HeatsinkMaterial, ThermalProfileProject } from '@hackerland/core';
import { filterThermalProjects } from '@hackerland/core';
import { ThermalCalculatorWorkbench } from './thermal-calculator-workbench';

interface ThermalCatalogProps {
  initialProjects: ThermalProfileProject[];
}

export function ThermalCatalog({ initialProjects }: ThermalCatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCooling, setSelectedCooling] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'presets' | 'workbench'>('presets');

  const filteredProjects = filterThermalProjects(initialProjects, {
    coolingMethod: selectedCooling !== 'all' ? (selectedCooling as CoolingMethod) : undefined,
    heatsinkMaterial:
      selectedMaterial !== 'all' ? (selectedMaterial as HeatsinkMaterial) : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  return (
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" variant="outline">
            Conduction, TIM &amp; Convection Boundary Layers
          </Badge>
          <span className="text-body-xs text-fg-subtle font-mono">
            1D Thermal Resistor Network &amp; Fin Efficiency Solver
          </span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          Thermal Management &amp; Heat Sink Profiler
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Model junction-to-ambient thermal resistance chains (θ_jc, θ_cs, θ_sa) across SiC, GaN, and edge compute modules under 50°C ambient heatwaves.
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
          Curated Indian Power Stacks ({initialProjects.length})
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
          Live Heat Sink Workbench
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by device (SiC, GaN, Orin), facility (ARAI, NIWE, CDAC) or standard..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-surface-1 border border-line rounded-xl px-4 py-2 text-body-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
            />

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filter by cooling method"
                value={selectedCooling}
                onChange={(e) => setSelectedCooling(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Cooling</option>
                <option value="natural_convection">Natural Convection</option>
                <option value="forced_convection_low_cfm">Forced Air (Low CFM)</option>
                <option value="forced_convection_high_cfm">Forced Air (High CFM)</option>
              </select>

              <select
                aria-label="Filter by heatsink material"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="bg-surface-1 border border-line rounded-xl px-3 py-2 text-body-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value="all">All Materials</option>
                <option value="aluminum_6063_t5">Aluminum 6063-T5</option>
                <option value="copper_c11000">Copper C11000</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/thermal/${project.slug}`} className="group block min-w-0">
                <Card className="h-full bg-surface-1 border-hairline hover:border-accent/50 rounded-2xl p-5 transition-all flex flex-col justify-between [overflow-wrap:anywhere]">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge tone="accent" variant="outline">
                        {project.powerDissipationWatts}W Dissipation
                      </Badge>
                      <span className="text-[11px] font-mono text-fg-muted">
                        {project.operatingAmbientTemperatureC}°C Ambient
                      </span>
                    </div>

                    <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-body-xs text-fg-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {project.deviceType} · {project.application}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-hairline space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-fg-muted">
                      <span>Cooling:</span>
                      <span className="text-fg capitalize">
                        {project.coolingMethod.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-fg-muted">
                      <span>TIM:</span>
                      <span className="text-accent-fg font-bold">
                        {project.timMaterial.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-fg-muted">
                      <span>Standard:</span>
                      <span className="text-fg truncate max-w-[170px]">{project.regulatoryStandard}</span>
                    </div>
                    <div className="text-[10px] text-fg-subtle truncate pt-1 border-t border-hairline">
                      📍 {project.indianTestFacility}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card className="text-center py-12 bg-surface-1 border-hairline font-mono text-fg-subtle text-body-xs">
              No matching thermal profiles found for current filter criteria.
            </Card>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <ThermalCalculatorWorkbench />
        </div>
      )}
    </div>
  );
}
