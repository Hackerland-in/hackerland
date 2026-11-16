'use client';

import { useState } from 'react';
import type { PcbaAssemblyProject, EmsQualityTier } from '@hackerland/core';
import { calculatePcbaTurnkeyCost } from '@hackerland/core';

interface TurnkeyCostEstimatorProps {
  project: PcbaAssemblyProject;
}

const TIER_LABELS: Record<EmsQualityTier, { label: string; desc: string }> = {
  standard_prototyping: {
    label: 'Standard Prototyping (IPC Class 2)',
    desc: 'Rapid 5-day turnaround, standard optical inspection, consumer IoT.',
  },
  high_rel_automotive: {
    label: 'Automotive & EV (IATF 16949 / AIS-156)',
    desc: 'High-temperature solder profiling, 3D X-Ray for QFN/BGA, 100% AOI.',
  },
  aerospace_class3: {
    label: 'Aerospace & Defence (IPC Class 3 / AS9100)',
    desc: 'Flying-probe test, thermal shock cycling, X-Ray voiding audit <15%.',
  },
};

export function TurnkeyCostEstimator({ project }: TurnkeyCostEstimatorProps) {
  const [quantity, setQuantity] = useState<number>(25);
  const [tier, setTier] = useState<EmsQualityTier>('standard_prototyping');

  const cost = calculatePcbaTurnkeyCost(project, quantity, tier);
  const presets = [5, 25, 100, 500, 1000, 5000];

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm space-y-5">
      <div className="border-b border-border/60 pb-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          Turnkey PCBA Cost Modeling
        </span>
        <h3 className="text-base font-bold text-foreground mt-0.5">
          Indian EMS Factory Production Quote Estimator
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Benchmarked against Kaynes, Syrma SGS, Centum Electronics & Dixon lines.
        </p>
      </div>

      {/* Tier Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-foreground">
          Assembly Reliability & Inspection Standard
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {(['standard_prototyping', 'high_rel_automotive', 'aerospace_class3'] as const).map((t) => {
            const isSelected = tier === t;
            const info = TIER_LABELS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/40'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <p className="text-xs font-bold">{info.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{info.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Batch Quantity Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Production Batch Quantity</span>
          <span className="font-mono font-bold text-primary">{quantity.toLocaleString('en-IN')} boards</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuantity(q)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                quantity === q
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-secondary/40 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {q >= 1000 ? `${q / 1000}k` : q} pcs
            </button>
          ))}
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="rounded-lg bg-background/60 border border-border p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Machine NRE Setup & Feeder Calibration</span>
          <span className="text-foreground font-semibold">₹{cost.setupFeeINR.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Laser-Cut Stainless Steel SMT Stencil</span>
          <span className="text-foreground font-semibold">₹{cost.stencilFeeINR.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>SMT Pick-and-Place Fees ({quantity * project.placements.length} placements)</span>
          <span className="text-foreground font-semibold">₹{cost.smtPlacementFeeINR.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>
            {project.hasBgaOrQfn
              ? 'Automated Optical Inspection (AOI) & 3D X-Ray Voiding Audit'
              : 'Automated Optical Inspection (AOI)'}
          </span>
          <span className="text-foreground font-semibold">₹{cost.inspectionFeeINR.toLocaleString('en-IN')}</span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-sm">
          <span className="font-bold text-foreground">Total Turnkey Assembly Fee</span>
          <span className="font-bold text-primary text-base">
            ₹{cost.totalAssemblyINR.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Effective Assembly Cost Per Board:</span>
          <span className="font-bold text-foreground font-mono">
            ₹{cost.unitAssemblyCostINR.toFixed(2)} / board
          </span>
        </div>
      </div>

      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
        <span>⚡</span>
        <span>
          Recommended Solder Stencil: {project.recommendedFoilThickness} stainless steel with electropolished apertures.
        </span>
      </div>
    </div>
  );
}
