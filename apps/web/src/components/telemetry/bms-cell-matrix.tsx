'use client';

import { calculateBmsCellSpread } from '@hackerland/core';

interface BmsCellMatrixProps {
  packVoltage: number;
  cellDeltaMv: number;
  cellCount?: number;
}

export function BmsCellMatrix({ packVoltage, cellDeltaMv, cellCount = 16 }: BmsCellMatrixProps) {
  const nominalCellV = packVoltage / cellCount;
  const spreadFraction = cellDeltaMv / 1000;

  const cells = Array.from({ length: cellCount }, (_, i) => {
    const offset = Math.sin((i / (cellCount - 1)) * Math.PI) * spreadFraction;
    const v = nominalCellV - spreadFraction / 2 + offset;
    return Number(v.toFixed(3));
  });

  const spreadInfo = calculateBmsCellSpread(cells);

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h4 className="font-display text-sm font-bold text-fg">
            AIS-156 Phase 2: 16S Cell Voltage Balance
          </h4>
          <p className="text-xs text-fg-muted">
            Individual cell tap equalization &amp; thermal runaway precursor audit
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {spreadInfo.isHazardous ? (
            <span className="rounded-full bg-danger/10 border border-danger/35 px-2.5 py-1 text-xs font-mono font-semibold text-danger-fg">
              CRITICAL: Δ {spreadInfo.deltaMv} mV (Over 150mV Limit)
            </span>
          ) : spreadInfo.isBalancingNeeded ? (
            <span className="rounded-full bg-warning/15 border border-warning/40 px-2.5 py-1 text-xs font-mono font-semibold text-warning-fg">
              BALANCING ACTIVE: Δ {spreadInfo.deltaMv} mV (&gt;40mV)
            </span>
          ) : (
            <span className="rounded-full bg-success/10 border border-success/35 px-2.5 py-1 text-xs font-mono font-semibold text-success-fg">
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
                  ? 'border-info/50 bg-info/10 ring-1 ring-info/25'
                  : isMax
                  ? 'border-accent/50 bg-accent-soft/80 ring-1 ring-accent/25'
                  : 'border-hairline bg-sunken/70'
              }`}
            >
              <div className="flex w-full items-center justify-between text-[10px] font-mono text-fg-muted">
                <span>C{idx + 1}</span>
                {isMin && <span className="text-info-fg font-bold">MIN</span>}
                {isMax && <span className="text-accent-fg font-bold">MAX</span>}
              </div>
              <div className="my-1 text-xs font-mono font-bold text-fg tracking-tight">
                {v.toFixed(3)}
                <span className="text-[10px] font-normal text-fg-subtle ml-0.5">V</span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden border border-hairline/50">
                <div
                  className={`h-full rounded-full ${
                    v >= 4.2 ? 'bg-danger' : v <= 3.0 ? 'bg-warning' : 'bg-accent'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, ((v - 3.0) / 1.2) * 100))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-fg-muted pt-2.5 border-t border-hairline">
        <div>
          Pack Total: <span className="text-fg font-bold">{packVoltage.toFixed(2)} V</span>
        </div>
        <div>
          Min Cell: <span className="text-info-fg font-bold">{spreadInfo.minCell} V</span>
        </div>
        <div>
          Max Cell: <span className="text-accent-fg font-bold">{spreadInfo.maxCell} V</span>
        </div>
        <div>
          Delta (Δ): <span className="text-fg font-bold">{spreadInfo.deltaMv} mV</span>
        </div>
      </div>
    </div>
  );
}
