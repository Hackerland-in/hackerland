'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    safetyVerdict: selectedVerdict !== 'all' ? (selectedVerdict as 'certified_safe' | 'advisory_derate' | 'quarantine_isolate') : undefined,
    search: search.trim() !== '' ? search.trim() : undefined,
  });

  const safeCount = initialProjects.filter((p) => p.diagnostics.ais156SafetyVerdict === 'certified_safe').length;
  const derateCount = initialProjects.filter((p) => p.diagnostics.ais156SafetyVerdict === 'advisory_derate').length;
  const isolateCount = initialProjects.filter((p) => p.diagnostics.ais156SafetyVerdict === 'quarantine_isolate').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Electrochemical Impedance Spectroscopy (EIS)
          </span>
          <span className="text-xs text-stone-500 font-mono">
            AIS-156 Amendment 3 &amp; Cell Degradation Physics
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
          Battery State-of-Health (SoH) &amp; EIS Analyzer
        </h1>
        <p className="text-base text-stone-400 max-w-3xl leading-relaxed">
          Analyze complex impedance spectra (0.01 Hz to 100 kHz) with Nyquist semicircles, Bode frequency responses, and Randles Equivalent Circuit Model (ECM) extraction. Detect Solid Electrolyte Interphase (SEI) growth, charge-transfer resistance surges, and low-temperature metallic lithium plating for Indian EV fleets.
        </p>
      </div>

      {/* High-Level Fleet Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Characterized Cells</span>
          <span className="text-2xl font-bold text-stone-100 mt-0.5 block">{initialProjects.length}</span>
          <span className="text-[10px] text-stone-500 block">LFP, NMC, Tabless &amp; Na-Ion</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">AIS-156 Certified Safe</span>
          <span className="text-2xl font-bold text-emerald-400 mt-0.5 block">{safeCount}</span>
          <span className="text-[10px] text-stone-500 block">Nominal internal resistance</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-amber-400 uppercase tracking-wider block">Advisory Derate</span>
          <span className="text-2xl font-bold text-amber-400 mt-0.5 block">{derateCount}</span>
          <span className="text-[10px] text-stone-500 block">45°C ambient heatwave aging</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-rose-400 uppercase tracking-wider block">Quarantine Isolate</span>
          <span className="text-2xl font-bold text-rose-400 mt-0.5 block">{isolateCount}</span>
          <span className="text-[10px] text-stone-500 block">Lithium plating / abuse detected</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search cells by model, facility (ARAI, ICAT, IIT-M, CSIR) or failure mode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            aria-label="Filter by battery chemistry"
            value={selectedChemistry}
            onChange={(e) => setSelectedChemistry(e.target.value)}
            className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-emerald-500"
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
            className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Verdicts</option>
            <option value="certified_safe">Certified Safe</option>
            <option value="advisory_derate">Advisory Derate</option>
            <option value="quarantine_isolate">Quarantine Isolate</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/battery-eis/${project.slug}`}
            className="group bg-stone-900/70 hover:bg-stone-900 border border-stone-800 hover:border-emerald-800/80 rounded-2xl p-5 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                  {project.chemistry.replace(/_/g, ' ')}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  project.diagnostics.ais156SafetyVerdict === 'certified_safe'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : project.diagnostics.ais156SafetyVerdict === 'advisory_derate'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {project.diagnostics.ais156SafetyVerdict.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="text-base font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {project.cellModel} · Tested at {project.testTemperatureC}°C after {project.cycleCount} cycles
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-800/80 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-stone-400">
                <span>State of Health (SoH):</span>
                <span className={`font-bold ${
                  project.diagnostics.sohPercent >= 90
                    ? 'text-emerald-400'
                    : project.diagnostics.sohPercent >= 80
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {project.diagnostics.sohPercent}% ({project.diagnostics.capacityAh}Ah)
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>R₀ (Bulk 1kHz):</span>
                <span className="text-stone-200 font-bold">{(project.fittedEcm.rBulkOhm * 1000).toFixed(2)} mΩ</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Charge Transfer R_ct:</span>
                <span className="text-purple-400 font-bold">{(project.fittedEcm.rCtOhm * 1000).toFixed(2)} mΩ</span>
              </div>
              <div className="text-[10px] text-stone-500 truncate pt-1 border-t border-stone-800/50">
                📍 {project.testFacility}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-stone-900/40 rounded-2xl border border-stone-800 font-mono text-stone-400 text-xs">
          No matching battery EIS records found for current search and filters.
        </div>
      )}
    </div>
  );
}
