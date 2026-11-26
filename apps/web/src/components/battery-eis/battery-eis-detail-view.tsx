'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BatteryEisProject, RandlesEcmParameters } from '@hackerland/core';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import { NyquistPlotVisualizer } from './nyquist-plot-visualizer';
import { BodePlotVisualizer } from './bode-plot-visualizer';
import { RandlesCircuitFitter } from './randles-circuit-fitter';

interface BatteryEisDetailViewProps {
  project: BatteryEisProject;
}

export function BatteryEisDetailView({ project }: BatteryEisDetailViewProps) {
  const labShell = useLabShell();
  const [currentEcm, setCurrentEcm] = useState<RandlesEcmParameters>(project.fittedEcm);
  const [activeTab, setActiveTab] = useState<'nyquist' | 'bode' | 'ecm_fitter'>('nyquist');

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `${project.title} — Fitted Randles ECM`,
        summary: `R0=${(currentEcm.rBulkOhm * 1000).toFixed(2)}mΩ, Rsei=${(currentEcm.rSeiOhm * 1000).toFixed(2)}mΩ, Rct=${(currentEcm.rCtOhm * 1000).toFixed(2)}mΩ`,
        tags: ['battery-eis', project.chemistry],
        payload: { projectSlug: project.slug, currentEcm },
      }),
      onLoad: (ws) => {
        const ecm = ws.payload?.currentEcm as RandlesEcmParameters | undefined;
        if (ecm && typeof ecm.rBulkOhm === 'number') {
          setCurrentEcm(ecm);
        }
      },
    });
  }, [labShell, project.slug, project.title, project.chemistry, currentEcm]);

  const { diagnostics } = project;

  return (
    <div className="space-y-6">
      {/* Header Summary Card */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-fg-muted">
          <Link href="/battery-eis" className="hover:text-accent-fg transition-colors">
            ← Battery EIS &amp; SoH Registry
          </Link>
          <span>/</span>
          <span className="text-fg font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent-fg border border-accent/25 font-mono uppercase">
                {project.chemistry.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-1 border border-hairline text-fg font-mono">
                {project.nominalCapacityAh}Ah · {project.nominalVoltageV}V Nom
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info/10 text-info-fg border border-info/25 font-mono">
                {project.cycleCount} Cycles @ {project.testTemperatureC}°C
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-fg-muted mt-1 max-w-3xl">
              Cell Model: <span className="text-fg font-mono font-bold">{project.cellModel}</span> · SoC:{' '}
              <span className="text-fg font-mono font-bold">{project.stateOfChargeSocPercent}%</span>
            </p>
          </div>

          <div className="bg-surface-1 border border-hairline rounded-2xl p-3.5 text-right font-mono shadow-xs">
            <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">State of Health (SoH)</span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span
                className={`text-2xl font-bold ${
                  diagnostics.sohPercent >= 90
                    ? 'text-success-fg'
                    : diagnostics.sohPercent >= 80
                    ? 'text-warning-fg'
                    : 'text-danger-fg'
                }`}
              >
                {diagnostics.sohPercent}%
              </span>
            </div>
            <span className="text-[10px] text-fg-subtle block">
              {diagnostics.capacityAh}Ah / {diagnostics.nominalCapacityAh}Ah
            </span>
          </div>
        </div>
      </div>

      {/* AIS-156 Safety Alert */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3.5 font-mono shadow-xs ${
          diagnostics.ais156SafetyVerdict === 'certified_safe'
            ? 'bg-success/10 border-success/30 text-success-fg'
            : diagnostics.ais156SafetyVerdict === 'advisory_derate'
            ? 'bg-warning/10 border-warning/30 text-warning-fg'
            : 'bg-danger/10 border-danger/35 text-danger-fg'
        }`}
      >
        <div className="p-2 rounded-xl bg-surface-1 border border-hairline shrink-0">
          {diagnostics.ais156SafetyVerdict === 'certified_safe' ? (
            <span className="text-success-fg font-bold text-lg">✓</span>
          ) : diagnostics.ais156SafetyVerdict === 'advisory_derate' ? (
            <span className="text-warning-fg font-bold text-lg">⚠</span>
          ) : (
            <span className="text-danger-fg font-bold text-lg">⛔</span>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm tracking-wide uppercase">
              AIS-156 Phase 2 / Amendment 3 Verdict: {diagnostics.ais156SafetyVerdict.replace(/_/g, ' ')}
            </span>
            {diagnostics.lithiumPlatingRisk !== 'none' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-danger text-on-solid">
                Plating: {diagnostics.lithiumPlatingRisk}
              </span>
            )}
          </div>
          <p className="text-xs text-fg leading-relaxed font-sans">
            {diagnostics.ais156SafetyVerdict === 'certified_safe' &&
              'Electrolyte bulk impedance and double-layer charge transfer are within certified thresholds. No lithium dendrite deposition or hazardous anode polarization detected.'}
            {diagnostics.ais156SafetyVerdict === 'advisory_derate' &&
              `Cell internal resistance has risen by ${diagnostics.internalResistanceIncreasePercent}%. Recommend BMS derating charge current limit to 0.5C to prevent thermal acceleration in Indian ambient heatwaves.`}
            {diagnostics.ais156SafetyVerdict === 'quarantine_isolate' &&
              `Critical impedance divergence detected (+${diagnostics.internalResistanceIncreasePercent}% R_0 increase). Anode metallic lithium plating signature violates AIS-156 safety thresholds. Quarantine cell to prevent thermal runaway.`}
          </p>
        </div>
      </div>

      {/* Diagnostic Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-surface-1 border border-hairline rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">Internal Resistance Δ</span>
          <span
            className={`text-xl font-bold mt-1 block ${
              diagnostics.internalResistanceIncreasePercent > 50 ? 'text-danger-fg' : 'text-fg'
            }`}
          >
            +{diagnostics.internalResistanceIncreasePercent}%
          </span>
          <span className="text-[10px] text-fg-muted block mt-0.5">vs baseline formation</span>
        </div>

        <div className="bg-surface-1 border border-hairline rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">SEI Layer Growth</span>
          <span
            className={`text-xl font-bold mt-1 block ${
              diagnostics.seiLayerGrowthWarning ? 'text-warning-fg' : 'text-success-fg'
            }`}
          >
            {diagnostics.seiLayerGrowthWarning ? 'Thickened' : 'Nominal'}
          </span>
          <span className="text-[10px] text-fg-muted block mt-0.5">
            R_sei = {(currentEcm.rSeiOhm * 1000).toFixed(2)}mΩ
          </span>
        </div>

        <div className="bg-surface-1 border border-hairline rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">Lithium Plating Risk</span>
          <span
            className={`text-xl font-bold mt-1 block uppercase ${
              diagnostics.lithiumPlatingRisk === 'none'
                ? 'text-success-fg'
                : diagnostics.lithiumPlatingRisk === 'elevated'
                ? 'text-warning-fg'
                : 'text-danger-fg'
            }`}
          >
            {diagnostics.lithiumPlatingRisk}
          </span>
          <span className="text-[10px] text-fg-muted block mt-0.5">Fast-charge vulnerability</span>
        </div>

        <div className="bg-surface-1 border border-hairline rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] text-fg-subtle uppercase tracking-wider block">Est. Remaining Cycles</span>
          <span className="text-xl font-bold text-accent-fg mt-1 block">
            {diagnostics.estimatedCycleLifeRemaining}
          </span>
          <span className="text-[10px] text-fg-muted block mt-0.5">To 80% EOL threshold</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap border-b border-hairline gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('nyquist')}
          className={`pb-3 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'nyquist'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Nyquist Plot (-Z″ vs Z′)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bode')}
          className={`pb-3 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'bode'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Bode Response (|Z| &amp; Phase)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ecm_fitter')}
          className={`pb-3 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'ecm_fitter'
              ? 'border-accent text-accent-fg'
              : 'border-transparent text-fg-muted hover:text-fg'
          }`}
        >
          Randles ECM Circuit Fitter
        </button>
      </div>

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
            initialParams={currentEcm}
            onParamsChange={(updated) => setCurrentEcm(updated)}
          />
          <NyquistPlotVisualizer
            measuredSpectrum={project.eisSpectrum}
            fittedEcm={currentEcm}
            cellTitle={`${project.title} (Live ECM Overlay)`}
          />
        </div>
      )}

      {/* NABL Facility Card */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-2.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2 text-xs font-mono">
          <span className="uppercase tracking-wider font-bold text-fg">
            NABL Accredited Test Facility &amp; Methodology
          </span>
          <span className="text-accent-fg font-semibold">📍 {project.testFacility}</span>
        </div>
        <p className="text-xs text-fg-muted leading-relaxed">{project.testingNotes}</p>
      </div>
    </div>
  );
}
