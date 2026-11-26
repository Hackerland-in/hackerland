'use client';

import { useState, useEffect } from 'react';
import type { MpptAlgorithm, IvCurvePoint } from '@hackerland/core';

interface MpptTrackerSimulatorProps {
  algorithm: MpptAlgorithm;
  vmppActualV: number;
  pmppActualW: number;
  trackingEfficiencyPercent: number;
  pvCurve: IvCurvePoint[];
}

export function MpptTrackerSimulator({
  algorithm,
  vmppActualV,
  pmppActualW,
  trackingEfficiencyPercent,
  pvCurve,
}: MpptTrackerSimulatorProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const initialV = vmppActualV * 0.55;
  const steps: { v: number; p: number; note: string }[] = [];

  const maxSteps = 14;
  let v = initialV;
  const stepSize = (vmppActualV - initialV) / 6;

  for (let i = 0; i < maxSteps; i++) {
    let p = 0;
    if (pvCurve.length > 0) {
      let closestPt = pvCurve[0];
      let minDiff = Infinity;
      for (const pt of pvCurve) {
        const diff = Math.abs(pt.voltageV - v);
        if (diff < minDiff) {
          minDiff = diff;
          closestPt = pt;
        }
      }
      p = closestPt ? closestPt.powerW : 0;
    }

    let note = '';
    if (algorithm === 'perturb_and_observe') {
      if (i < 6) {
        note = `ΔP > 0: Increased V by +${stepSize.toFixed(1)}V`;
        v += stepSize;
      } else if (i === 6) {
        note = 'Reached MPP boundary; ΔP turns negative, reversing step';
        v += stepSize * 0.5;
      } else if (i % 2 === 1) {
        note = 'P&O Hunt Oscillation: Perturbing -0.4V';
        v -= 0.4;
      } else {
        note = 'P&O Hunt Oscillation: Perturbing +0.4V';
        v += 0.4;
      }
    } else if (algorithm === 'incremental_conductance') {
      if (i < 7) {
        const err = (vmppActualV - v) * 0.35;
        note = `dI/dV > -I/V (Left of MPP): Step V +${err.toFixed(2)}V`;
        v += err;
      } else {
        note = 'dI/dV == -I/V (dP/dV = 0): Settled at exact MPP without oscillation';
        v = vmppActualV;
      }
    } else if (algorithm === 'global_sweep_partial_shading') {
      if (i < 5) {
        note = `Global Sweep: Scanning array voltage across ${i * 20 + 20}% Voc`;
        v = vmppActualV * 1.25 * (0.2 + i * 0.18);
      } else if (i === 5) {
        note = 'Global maximum identified; jumping directly to GMPP';
        v = vmppActualV;
      } else {
        note = 'Locked on Global Maximum Peak; ignoring local bypass diode ripples';
        v = vmppActualV;
      }
    } else {
      if (i < 4) {
        note = 'Measuring array Voc open-circuit pulse';
        v = vmppActualV * (0.6 + i * 0.1);
      } else {
        note = `Tracking at fixed 0.80 x Voc = ${vmppActualV.toFixed(1)}V`;
        v = vmppActualV;
      }
    }

    steps.push({ v: Math.round(v * 10) / 10, p: Math.round(p * 10) / 10, note });
  }

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const active = steps[currentStep] || steps[0];

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs text-fg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-accent-fg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            MPPT Real-Time Tracking Loop Simulator
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Iterative state machine convergence for algorithm: <code className="text-accent-fg font-mono font-semibold">{algorithm}</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-sunken hover:bg-surface-2 text-fg text-xs font-mono rounded-lg border border-hairline transition cursor-pointer"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(0)}
            className="px-3 py-1.5 bg-sunken hover:bg-surface-2 text-fg-muted text-xs font-mono rounded-lg border border-hairline transition cursor-pointer"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Tracker State Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-sunken p-3.5 rounded-xl border border-hairline flex flex-col justify-between">
          <span className="text-fg-subtle text-xs">Current Iteration</span>
          <div className="text-xl font-bold font-mono text-accent-fg mt-1">
            Step {currentStep + 1} / {steps.length}
          </div>
          <span className="text-[11px] text-fg-subtle mt-1">Loop frequency: 100 Hz ADC loop</span>
        </div>

        <div className="bg-sunken p-3.5 rounded-xl border border-hairline flex flex-col justify-between">
          <span className="text-fg-subtle text-xs">Operating Point</span>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">
            {active?.v} V <span className="text-fg-subtle text-sm">@</span> {active?.p} W
          </div>
          <span className="text-[11px] text-fg-subtle mt-1">Target GMPP: {vmppActualV}V / {pmppActualW}W</span>
        </div>

        <div className="bg-sunken p-3.5 rounded-xl border border-hairline flex flex-col justify-between">
          <span className="text-fg-subtle text-xs">Tracking Efficiency</span>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {trackingEfficiencyPercent.toFixed(1)}%
          </div>
          <span className="text-[11px] text-fg-subtle mt-1">EN 50530 Dynamic Standard</span>
        </div>
      </div>

      {/* Action Directive Note */}
      <div className="bg-accent-soft p-3 rounded-xl border border-accent/25 text-xs font-mono text-accent-fg flex items-center gap-2">
        <span className="font-bold">» STATE:</span>
        <span className="text-fg">{active?.note}</span>
      </div>

      {/* Progress Track */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {steps.map((s, idx) => (
          <button
            type="button"
            key={`step-${idx}`}
            onClick={() => {
              setCurrentStep(idx);
              setIsPlaying(false);
            }}
            className={`flex-1 min-w-[20px] h-2 rounded-full transition-all cursor-pointer ${
              idx === currentStep
                ? 'bg-accent ring-2 ring-accent/30 scale-y-125'
                : idx < currentStep
                  ? 'bg-accent/50'
                  : 'bg-surface-2'
            }`}
            title={`Step ${idx + 1}: ${s.v}V, ${s.p}W`}
          />
        ))}
      </div>
    </div>
  );
}
