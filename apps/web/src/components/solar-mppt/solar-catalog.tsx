'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            Single-Diode PV Physics &amp; MPPT Power Converters
          </span>
          <span className="text-xs text-slate-500 font-mono">
            BIS IS 14286 / IS 16221 &amp; PM-KUSUM Architecture
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Solar PV &amp; MPPT Battery Charge Controller Simulator
        </h1>
        <p className="text-base text-slate-400 max-w-3xl leading-relaxed">
          Simulate single-diode photovoltaic I-V and P-V characteristic curves under variable solar irradiance ($G$) and extreme cell temperatures ($T_{'{'}cell{'}'}$). Model MPPT algorithms (Incremental Conductance, Perturb &amp; Observe, and Global Sweep) with synchronous buck converter inductor and output capacitor sizing for Indian climatic extremes from -30°C Ladakh posts to 65°C Rajasthan canal-top arrays.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'presets'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Curated Indian Solar Projects ({initialProjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('workbench')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'workbench'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Interactive Simulator
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by project, canal, PM-KUSUM, standard, or test lab..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                aria-label="Filter by MPPT Algorithm"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400 transition"
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
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400 transition"
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

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/solar-mppt/${project.slug}`}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {project.systemCapacityWatts}W
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {project.panelSpecs.technology.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.application}
                  </p>

                  <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Nominal Vmp / Imp:</span>
                      <span>{project.panelSpecs.nominalVmpV}V / {project.panelSpecs.nominalImpA}A</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Target Battery:</span>
                      <span className="text-sky-400">{project.targetBattery.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Algorithm:</span>
                      <span className="text-emerald-400">{project.mpptAlgorithm.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 truncate max-w-[190px]">
                    {project.indianContextFacility.split('-')[0]?.trim()}
                  </span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                    Inspect Architecture →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 font-mono text-xs">
              No matching solar MPPT projects found for query &quot;{search}&quot;. Try resetting filters.
            </div>
          )}
        </div>
      )}

      {activeTab === 'workbench' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed font-mono">
            Defaulted to 540W Monocrystalline PERC panel (41.8V Vmp, 12.92A Imp). Adjust sliders in real time to simulate diurnal solar transitions and buck converter passive component dynamics.
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
