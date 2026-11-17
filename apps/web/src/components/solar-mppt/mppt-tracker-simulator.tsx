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

  // Generate 12-16 synthetic tracking steps simulating convergence
  const initialV = vmppActualV * 0.55;
  const steps: { v: number; p: number; note: string }[] = [];

  const maxSteps = 14;
  let v = initialV;
  let stepSize = (vmppActualV - initialV) / 6;

  for (let i = 0; i < maxSteps; i++) {
    // Find closest power in pvCurve
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
        note = `Global Sweep: Scanning array voltage across ${(i * 20 + 20)}% Voc`;
        v = (vmppActualV * 1.25) * (0.2 + i * 0.18);
      } else if (i === 5) {
        note = 'Global maximum identified; jumping directly to GMPP';
        v = vmppActualV;
      } else {
        note = 'Locked on Global Maximum Peak; ignoring local bypass diode ripples';
        v = vmppActualV;
      }
    } else {
      // fractional voc
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

  // Timer loop for animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const active = steps[currentStep] || steps[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            MPPT Real-Time Tracking Loop Simulator
          </h3>
          <p className="text-xs text-slate-400">
            Iterative state machine convergence for algorithm: <code className="text-amber-300 font-mono">{algorithm}</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded border border-slate-700 transition"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded border border-slate-700 transition text-slate-300"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Tracker State Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 text-xs">Current Iteration</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            Step {currentStep + 1} / {steps.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Loop frequency: 100 Hz ADC loop</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 text-xs">Operating Point</span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {active?.v} V <span className="text-slate-500 text-sm">@</span> {active?.p} W
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Target GMPP: {vmppActualV}V / {pmppActualW}W</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <span className="text-slate-400 text-xs">Tracking Efficiency</span>
          <div className="text-xl font-bold font-mono text-sky-400 mt-1">
            {trackingEfficiencyPercent.toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1">EN 50530 Dynamic Standard</span>
        </div>
      </div>

      {/* Action Directive Note */}
      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700 text-xs font-mono text-amber-300 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">» STATE:</span>
        <span>{active?.note}</span>
      </div>

      {/* Progress Track */}
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {steps.map((s, idx) => (
          <button
            key={`step-${idx}`}
            onClick={() => {
              setCurrentStep(idx);
              setIsPlaying(false);
            }}
            className={`flex-1 min-w-[20px] h-2 rounded transition-all ${
              idx === currentStep
                ? 'bg-emerald-400 ring-2 ring-emerald-500 scale-110'
                : idx < currentStep
                ? 'bg-emerald-700/60'
                : 'bg-slate-800'
            }`}
            title={`Step ${idx + 1}: ${s.v}V, ${s.p}W`}
          />
        ))}
      </div>
    </div>
  );
}
