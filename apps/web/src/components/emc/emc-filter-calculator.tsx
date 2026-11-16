'use client';

import { useState } from 'react';
import { calculateCommonModeChoke } from '@hackerland/core';

export function EmcFilterCalculator() {
  const [targetFreqMHz, setTargetFreqMHz] = useState<number>(10.0);
  const [targetImpedanceOhm, setTargetImpedanceOhm] = useState<number>(1000);

  const filter = calculateCommonModeChoke(targetFreqMHz, targetImpedanceOhm);
  const freqPresets = [0.15, 1.0, 5.0, 10.0, 30.0, 100.0, 400.0];

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm space-y-5">
      <div className="border-b border-border/60 pb-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          Pre-Compliance Filter Design
        </span>
        <h3 className="text-base font-bold text-foreground mt-0.5">
          Common-Mode Choke & LC Filter Calculator
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Size inductors and Y-capacitors to suppress conducted and radiated emission spikes.
        </p>
      </div>

      <div className="space-y-4">
        {/* Frequency Preset Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-foreground">Target Noise Frequency (MHz)</span>
            <span className="font-bold text-primary">{targetFreqMHz} MHz</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {freqPresets.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTargetFreqMHz(f)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  targetFreqMHz === f
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary'
                }`}
              >
                {f} MHz
              </button>
            ))}
          </div>
        </div>

        {/* Impedance Target Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-foreground">
            Target Common-Mode Impedance (Zcm)
          </label>
          <div className="flex flex-wrap gap-2">
            {[500, 1000, 2000].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setTargetImpedanceOhm(z)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  targetImpedanceOhm === z
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'bg-secondary/40 text-muted-foreground hover:bg-secondary'
                }`}
              >
                {z} Ω
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Results Matrix */}
        <div className="rounded-lg bg-background/60 border border-border p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Minimum Common-Mode Inductance (Lcm)</span>
            <span className="text-primary font-bold text-sm">
              {filter.requiredInductanceUh} µH
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Recommended Y-Capacitance (Line-to-Earth Cy)</span>
            <span className="text-foreground font-semibold">
              {filter.recommendedCapacitanceNf} nF (Y1/Y2 Rated)
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Calculated Insertion Loss Attenuation at {targetFreqMHz} MHz</span>
            <span className="text-emerald-400 font-bold text-sm">
              -{filter.attenuationAtTargetDb} dB
            </span>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Standard Off-The-Shelf Indian Distributor Part:</span>
            <span className="text-foreground font-semibold">
              Murata DLW / Würth WE-CMB Series
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
