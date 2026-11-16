'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    heatsinkMaterial: selectedMaterial !== 'all' ? (selectedMaterial as HeatsinkMaterial) : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            Conduction, TIM &amp; Convection Boundary Layers
          </span>
          <span className="text-xs text-stone-500 font-mono">
            1D Thermal Resistor Network &amp; Fin Efficiency Solver
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          Thermal Management &amp; Heat Sink Profiler
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          Model junction-to-ambient thermal resistance chains (θ_jc, θ_cs, θ_sa) across silicon carbide (SiC), gallium nitride (GaN), and edge computing hardware. Calculate convective fin efficiency (η_fin), TIM impedance, and maximum allowable ambient temperatures under 50°C Indian summer heatwaves.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'presets'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Curated Indian Power Stacks ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'workbench'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Live Heat Sink Workbench
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by device (SiC, GaN, Orin), facility (ARAI, NIWE, CDAC) or standard..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                aria-label="Filter by cooling method"
                value={selectedCooling}
                onChange={(e) => setSelectedCooling(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-amber-500"
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
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Materials</option>
                <option value="aluminum_6063_t5">Aluminum 6063-T5</option>
                <option value="copper_c11000">Copper C11000</option>
              </select>
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/thermal/${project.slug}`}
                className="group bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-amber-800/80 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      {project.powerDissipationWatts}W Dissipation
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      {project.operatingAmbientTemperatureC}°C Ambient
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {project.deviceType} · {project.application}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-800/80 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between text-stone-400">
                    <span>Cooling:</span>
                    <span className="text-stone-200 capitalize">{project.coolingMethod.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>TIM:</span>
                    <span className="text-cyan-400 font-bold">{project.timMaterial.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Standard:</span>
                    <span className="text-stone-300 truncate max-w-[170px]">{project.regulatoryStandard}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 truncate pt-1 border-t border-stone-800/50">
                    📍 {project.indianTestFacility}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-stone-800 font-mono text-stone-400 text-xs">
              No matching thermal profiles found for current filter criteria.
            </div>
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
