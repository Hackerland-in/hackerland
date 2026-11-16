'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BatteryEisProject, RandlesEcmParameters } from '@hackerland/core';
import { NyquistPlotVisualizer } from './nyquist-plot-visualizer';
import { BodePlotVisualizer } from './bode-plot-visualizer';
import { RandlesCircuitFitter } from './randles-circuit-fitter';

interface BatteryEisDetailViewProps {
  project: BatteryEisProject;
}

export function BatteryEisDetailView({ project }: BatteryEisDetailViewProps) {
  const [currentEcm, setCurrentEcm] = useState<RandlesEcmParameters>(project.fittedEcm);
  const [activeTab, setActiveTab] = useState<'nyquist' | 'bode' | 'ecm_fitter'>('nyquist');

  const { diagnostics } = project;

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <Link href="/battery-eis" className="hover:text-emerald-400 transition-colors">
            ← Battery EIS &amp; SoH Registry
          </Link>
          <span>/</span>
          <span className="text-stone-300 font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                {project.chemistry.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 font-mono">
                {project.nominalCapacityAh}Ah · {project.nominalVoltageV}V Nom
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {project.cycleCount} Cycles @ {project.testTemperatureC}°C
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-3xl">
              Cell Model: <span className="text-stone-200 font-mono font-bold">{project.cellModel}</span> · SoC: <span className="text-stone-200 font-mono font-bold">{project.stateOfChargeSocPercent}%</span>
            </p>
          </div>

          {/* Quick Health Summary Pill */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-right font-mono">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">State of Health (SoH)</span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className={`text-2xl font-bold ${
                diagnostics.sohPercent >= 90
                  ? 'text-emerald-400'
                  : diagnostics.sohPercent >= 80
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {diagnostics.sohPercent}%
              </span>
            </div>
            <span className="text-[10px] text-stone-500 block">
              {diagnostics.capacityAh}Ah / {diagnostics.nominalCapacityAh}Ah
            </span>
          </div>
        </div>
      </div>

      {/* AIS-156 Amendment 3 Compliance Verdict Alert */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 font-mono ${
        diagnostics.ais156SafetyVerdict === 'certified_safe'
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          : diagnostics.ais156SafetyVerdict === 'advisory_derate'
          ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
      }`}>
        <div className="p-2 rounded-lg bg-stone-900/80 border border-stone-800 shrink-0">
          {diagnostics.ais156SafetyVerdict === 'certified_safe' ? (
            <span className="text-emerald-400 font-bold text-lg">✓</span>
          ) : diagnostics.ais156SafetyVerdict === 'advisory_derate' ? (
            <span className="text-amber-400 font-bold text-lg">⚠</span>
          ) : (
            <span className="text-rose-400 font-bold text-lg">⛔</span>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide uppercase">
              AIS-156 Phase 2 / Amendment 3 Verdict: {diagnostics.ais156SafetyVerdict.replace(/_/g, ' ')}
            </span>
            {diagnostics.lithiumPlatingRisk !== 'none' && (
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Plating: {diagnostics.lithiumPlatingRisk}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            {diagnostics.ais156SafetyVerdict === 'certified_safe' &&
              'Electrolyte bulk impedance and double-layer charge transfer are within certified thresholds. No lithium dendrite deposition or hazardous anode polarization detected.'}
            {diagnostics.ais156SafetyVerdict === 'advisory_derate' &&
              `Cell internal resistance has risen by ${diagnostics.internalResistanceIncreasePercent}%. Recommend BMS derating charge current limit to 0.5C to prevent thermal acceleration in Indian ambient heatwaves.`}
            {diagnostics.ais156SafetyVerdict === 'quarantine_isolate' &&
              `Critical impedance divergence detected (+${diagnostics.internalResistanceIncreasePercent}% R_0 increase). Anode metallic lithium plating signature violates AIS-156 safety thresholds. Quarantine cell to prevent catastrophic thermal runaway.`}
          </p>
        </div>
      </div>

      {/* Diagnostics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Internal Resistance Δ</span>
          <span className={`text-xl font-bold mt-1 block ${
            diagnostics.internalResistanceIncreasePercent > 50 ? 'text-rose-400' : 'text-stone-100'
          }`}>
            +{diagnostics.internalResistanceIncreasePercent}%
          </span>
          <span className="text-[10px] text-stone-500 block mt-0.5">vs baseline formation</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">SEI Layer Growth</span>
          <span className={`text-xl font-bold mt-1 block ${
            diagnostics.seiLayerGrowthWarning ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {diagnostics.seiLayerGrowthWarning ? 'Thickened' : 'Nominal'}
          </span>
          <span className="text-[10px] text-stone-500 block mt-0.5">R_sei = {(project.fittedEcm.rSeiOhm * 1000).toFixed(2)}mΩ</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Lithium Plating Risk</span>
          <span className={`text-xl font-bold mt-1 block uppercase ${
            diagnostics.lithiumPlatingRisk === 'none'
              ? 'text-emerald-400'
              : diagnostics.lithiumPlatingRisk === 'elevated'
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}>
            {diagnostics.lithiumPlatingRisk}
          </span>
          <span className="text-[10px] text-stone-500 block mt-0.5">Fast-charge vulnerability</span>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-3.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Est. Remaining Cycles</span>
          <span className="text-xl font-bold text-stone-100 mt-1 block">
            {diagnostics.estimatedCycleLifeRemaining}
          </span>
          <span className="text-[10px] text-stone-500 block mt-0.5">To 80% EOL threshold</span>
        </div>
      </div>

      {/* Tabs for Plots & ECM Fitter */}
      <div className="flex border-b border-stone-800 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('nyquist')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'nyquist'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Nyquist Plot (-Z″ vs Z′)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bode')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'bode'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Bode Response (|Z| &amp; Phase)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ecm_fitter')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'ecm_fitter'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Randles ECM Circuit Fitter
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'nyquist' && (
        <NyquistPlotVisualizer
          measuredSpectrum={project.eisSpectrum}
          fittedEcm={currentEcm}
          cellTitle={project.title}
        />
      )}

      {activeTab === 'bode' && (
        <BodePlotVisualizer measuredSpectrum={project.eisSpectrum} />
      )}

      {activeTab === 'ecm_fitter' && (
        <div className="space-y-6">
          <RandlesCircuitFitter
            initialParams={project.fittedEcm}
            onParamsChange={(updated) => setCurrentEcm(updated)}
          />
          <NyquistPlotVisualizer
            measuredSpectrum={project.eisSpectrum}
            fittedEcm={currentEcm}
            cellTitle={`${project.title} (Live ECM Overlay)`}
          />
        </div>
      )}

      {/* Laboratory Facility & Testing Methodology */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-xs">
          <span className="uppercase tracking-wider font-semibold text-stone-300">
            NABL Accredited Test Facility &amp; Methodology
          </span>
          <span className="text-emerald-400">
            📍 {project.testFacility}
          </span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          {project.testingNotes}
        </p>
      </div>
    </div>
  );
}
