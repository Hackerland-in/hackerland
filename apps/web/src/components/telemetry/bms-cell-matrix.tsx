'use client';

import { calculateBmsCellSpread } from '@hackerland/core';

interface BmsCellMatrixProps {
  packVoltage: number;
  cellDeltaMv: number;
  cellCount?: number;
}

export function BmsCellMatrix({ packVoltage, cellDeltaMv, cellCount = 16 }: BmsCellMatrixProps) {
  // Synthesize realistic 16S cell voltages around average with given delta
  const nominalCellV = packVoltage / cellCount;
  const spreadFraction = cellDeltaMv / 1000;

  const cells = Array.from({ length: cellCount }, (_, i) => {
    // Generate pseudo-deterministic variations based on cell position (inner cells run hotter/slightly lower V)
    const offset = Math.sin((i / (cellCount - 1)) * Math.PI) * spreadFraction;
    const v = nominalCellV - spreadFraction / 2 + offset;
    return Number(v.toFixed(3));
  });

  const spreadInfo = calculateBmsCellSpread(cells);

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">AIS-156 Phase 2: 16S Cell Voltage Balance</h4>
          <p className="text-xs text-stone-400">Individual cell tap equalization & thermal runaway precursor audit</p>
        </div>
        <div className="flex items-center space-x-2">
          {spreadInfo.isHazardous ? (
            <span className="rounded-full bg-red-950/80 border border-red-500/50 px-2.5 py-1 text-xs font-mono font-medium text-red-300">
              CRITICAL: Δ {spreadInfo.deltaMv} mV (Over 150mV Limit)
            </span>
          ) : spreadInfo.isBalancingNeeded ? (
            <span className="rounded-full bg-amber-950/80 border border-amber-500/50 px-2.5 py-1 text-xs font-mono font-medium text-amber-300">
              BALANCING ACTIVE: Δ {spreadInfo.deltaMv} mV (&gt;40mV)
            </span>
          ) : (
            <span className="rounded-full bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 text-xs font-mono font-medium text-emerald-300">
              BALANCED: Δ {spreadInfo.deltaMv} mV (Nominal)
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2">
        {cells.map((v, idx) => {
          const isMin = v === spreadInfo.minCell;
          const isMax = v === spreadInfo.maxCell;

          return (
            <div
              key={`cell-${idx}`}
              className={`flex flex-col items-center justify-between rounded-xl border p-2 text-center transition-all ${
                isMin
                  ? 'border-blue-500/60 bg-blue-950/30 ring-1 ring-blue-500/30'
                  : isMax
                  ? 'border-amber-500/60 bg-amber-950/30 ring-1 ring-amber-500/30'
                  : 'border-stone-800 bg-stone-900/60'
              }`}
            >
              <div className="flex w-full items-center justify-between text-[10px] font-mono text-stone-400">
                <span>C{idx + 1}</span>
                {isMin && <span className="text-blue-400 font-bold">MIN</span>}
                {isMax && <span className="text-amber-400 font-bold">MAX</span>}
              </div>
              <div className="my-1 text-xs font-mono font-bold text-white tracking-tight">
                {v.toFixed(3)}
                <span className="text-[10px] font-normal text-stone-400 ml-0.5">V</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    v >= 4.2 ? 'bg-red-500' : v <= 3.0 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, ((v - 3.0) / 1.2) * 100))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-400 pt-2 border-t border-stone-800/60">
        <div>
          Pack Total: <span className="text-white font-bold">{packVoltage.toFixed(2)} V</span>
        </div>
        <div>
          Min Cell: <span className="text-blue-400 font-bold">{spreadInfo.minCell} V</span>
        </div>
        <div>
          Max Cell: <span className="text-amber-400 font-bold">{spreadInfo.maxCell} V</span>
        </div>
        <div>
          Delta (Δ): <span className="text-white font-bold">{spreadInfo.deltaMv} mV</span>
        </div>
      </div>
    </div>
  );
}
