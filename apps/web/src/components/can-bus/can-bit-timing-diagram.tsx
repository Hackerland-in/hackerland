'use client';

import { useState } from 'react';
import type { CanWaveformSample } from '@hackerland/core';

interface CanBitTimingDiagramProps {
  nominalBitTimeNs: number;
  timeQuantumNs: number;
  totalTimeQuantaPerBit: number;
  samplePointPercent: number;
  samplePointStatus: 'optimal_cia' | 'acceptable' | 'marginal_out_of_spec' | string;
  waveforms: CanWaveformSample[];
  title?: string;
}

export function CanBitTimingDiagram({
  nominalBitTimeNs,
  timeQuantumNs,
  totalTimeQuantaPerBit,
  samplePointPercent,
  samplePointStatus,
  waveforms,
  title = 'CAN Bit Timing & Physical Layer Differential Oscilloscope',
}: CanBitTimingDiagramProps) {
  const [activeTab, setActiveTab] = useState<'timing_segments' | 'diff_oscilloscope'>('timing_segments');

  // Segment proportions matching CiA 301 allocation
  const syncTq = 1;
  const sampleTq = Math.round((samplePointPercent / 100) * totalTimeQuantaPerBit);
  const phase2Tq = Math.max(2, totalTimeQuantaPerBit - sampleTq);
  const remainingTq = Math.max(2, totalTimeQuantaPerBit - syncTq - phase2Tq);
  const propTq = Math.max(1, Math.floor(remainingTq / 2));
  const phase1Tq = Math.max(1, remainingTq - propTq);
  const totalTq = syncTq + propTq + phase1Tq + phase2Tq;

  // Segment SVG layout
  const segWidth = 620;
  const segHeight = 175;
  const padX = 28;
  const barW = segWidth - padX * 2;
  const syncW = (syncTq / totalTq) * barW;
  const propW = (propTq / totalTq) * barW;
  const ph1W = (phase1Tq / totalTq) * barW;
  const ph2W = (phase2Tq / totalTq) * barW;
  const sampleX = padX + syncW + propW + ph1W;

  // Differential Oscilloscope SVG layout
  const oscW = 620;
  const oscH = 260;
  const oscPad = { top: 24, right: 24, bottom: 38, left: 48 };
  const plotW = oscW - oscPad.left - oscPad.right;
  const plotH = oscH - oscPad.top - oscPad.bottom;
  const maxTime = waveforms.length > 0 ? Math.max(...waveforms.map((w) => w.timeNs), 1) : 1000;
  const toOscX = (t: number) => oscPad.left + (t / maxTime) * plotW;
  const toOscY = (v: number) => oscPad.top + plotH - (v / 5) * plotH;

  const pathCanH = waveforms.map((w) => `${toOscX(w.timeNs).toFixed(1)},${toOscY(w.vCanH).toFixed(1)}`).join(' ');
  const pathCanL = waveforms.map((w) => `${toOscX(w.timeNs).toFixed(1)},${toOscY(w.vCanL).toFixed(1)}`).join(' ');
  const pathVDiff = waveforms.map((w) => `${toOscX(w.timeNs).toFixed(1)},${toOscY(w.vDiff).toFixed(1)}`).join(' ');

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs text-fg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-accent-fg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Nominal Bit Time: <strong className="font-mono text-fg">{nominalBitTimeNs.toFixed(0)} ns</strong> · t_q:{' '}
            <strong className="font-mono text-fg">{timeQuantumNs} ns</strong> ({totalTimeQuantaPerBit} t_q/bit)
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('timing_segments')}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              activeTab === 'timing_segments'
                ? 'bg-accent text-on-solid border-accent font-bold shadow-xs'
                : 'bg-sunken text-fg-muted border-hairline hover:text-fg'
            }`}
          >
            Bit Segments
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diff_oscilloscope')}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              activeTab === 'diff_oscilloscope'
                ? 'bg-accent text-on-solid border-accent font-bold shadow-xs'
                : 'bg-sunken text-fg-muted border-hairline hover:text-fg'
            }`}
          >
            Differential Scope
          </button>
        </div>
      </div>

      {activeTab === 'timing_segments' ? (
        <div className="space-y-3">
          <div className="w-full overflow-x-auto bg-sunken rounded-xl p-3 border border-hairline">
            <svg viewBox={`0 0 ${segWidth} ${segHeight}`} className="w-full h-auto min-w-[480px] select-none">
              {/* Sync_Seg */}
              <rect x={padX} y={48} width={syncW} height={58} rx={4} fill="#FFF0F7" stroke="#FA1681" strokeWidth="1.5" />
              <text x={padX + syncW / 2} y={74} textAnchor="middle" fill="#D10D69" className="text-[10px] font-mono font-bold">
                Sync
              </text>
              <text x={padX + syncW / 2} y={90} textAnchor="middle" fill="#64748B" className="text-[9px] font-mono">
                {syncTq}tq
              </text>

              {/* Prop_Seg */}
              <rect x={padX + syncW} y={48} width={propW} height={58} rx={4} fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
              <text x={padX + syncW + propW / 2} y={74} textAnchor="middle" fill="#1D4ED8" className="text-[11px] font-mono font-bold">
                Prop ({propTq} tq)
              </text>
              <text x={padX + syncW + propW / 2} y={90} textAnchor="middle" fill="#475569" className="text-[9px] font-mono">
                Propagation Delay
              </text>

              {/* Phase_Seg1 */}
              <rect x={padX + syncW + propW} y={48} width={ph1W} height={58} rx={4} fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
              <text x={padX + syncW + propW + ph1W / 2} y={74} textAnchor="middle" fill="#047857" className="text-[11px] font-mono font-bold">
                Phase 1 ({phase1Tq} tq)
              </text>
              <text x={padX + syncW + propW + ph1W / 2} y={90} textAnchor="middle" fill="#475569" className="text-[9px] font-mono">
                Pre-Sample
              </text>

              {/* Phase_Seg2 */}
              <rect x={padX + syncW + propW + ph1W} y={48} width={ph2W} height={58} rx={4} fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
              <text x={padX + syncW + propW + ph1W + ph2W / 2} y={74} textAnchor="middle" fill="#B45309" className="text-[11px] font-mono font-bold">
                Phase 2 ({phase2Tq} tq)
              </text>
              <text x={padX + syncW + propW + ph1W + ph2W / 2} y={90} textAnchor="middle" fill="#475569" className="text-[9px] font-mono">
                Post-Sample
              </text>

              {/* Sample Point Marker */}
              <line x1={sampleX} y1={24} x2={sampleX} y2={126} stroke="#FA1681" strokeWidth="2.5" strokeDasharray="4,3" />
              <circle cx={sampleX} cy={48} r={5} fill="#FA1681" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x={sampleX} y={18} textAnchor="middle" fill="#D10D69" className="text-[11px] font-mono font-bold">
                SAMPLE POINT: {samplePointPercent}%
              </text>
              <text x={padX} y={145} fill="#475569" className="text-[10px] font-mono">
                0 ns (SOF / Edge)
              </text>
              <text x={padX + barW} y={145} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                {nominalBitTimeNs.toFixed(0)} ns ({totalTimeQuantaPerBit} t_q)
              </text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-fg-muted">
              Sample Status:{' '}
              <strong
                className={
                  samplePointStatus === 'optimal_cia'
                    ? 'text-emerald-700'
                    : samplePointStatus === 'acceptable'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                }
              >
                {samplePointStatus.replace(/_/g, ' ').toUpperCase()}
              </strong>
            </span>
            <span className="text-fg-subtle">CiA 301 Target: 75% – 87.5%</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-full overflow-x-auto bg-sunken rounded-xl p-3 border border-hairline">
            <svg viewBox={`0 0 ${oscW} ${oscH}`} className="w-full h-auto min-w-[480px] select-none">
              {[0, 1.5, 2.5, 3.5, 5].map((volt) => {
                const y = toOscY(volt);
                return (
                  <g key={`v-grid-${volt}`}>
                    <line
                      x1={oscPad.left}
                      y1={y}
                      x2={oscPad.left + plotW}
                      y2={y}
                      stroke={volt === 2.5 ? '#94A3B8' : '#E2E8F0'}
                      strokeDasharray={volt === 2.5 ? undefined : '3,3'}
                      strokeWidth="1"
                    />
                    <text x={oscPad.left - 8} y={y + 4} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                      {volt}V
                    </text>
                  </g>
                );
              })}

              <polyline fill="none" stroke="#0284C7" strokeWidth="2.2" points={pathCanH} />
              <polyline fill="none" stroke="#D97706" strokeWidth="2.2" points={pathCanL} />
              <polyline fill="none" stroke="#FA1681" strokeWidth="2.5" strokeDasharray="5,3" points={pathVDiff} />

              <text x={oscPad.left + plotW / 2} y={oscH - 8} textAnchor="middle" fill="#475569" className="text-[10px] font-mono">
                Time Window (0 – {maxTime.toFixed(0)} ns)
              </text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-sky-700 font-semibold">
              <span className="w-3 h-0.5 bg-sky-600 inline-block" /> CAN_H (2.5V → 3.5V)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-3 h-0.5 bg-amber-600 inline-block" /> CAN_L (2.5V → 1.5V)
            </span>
            <span className="flex items-center gap-1.5 text-accent-fg font-semibold">
              <span className="w-3 h-0.5 bg-accent inline-block" /> V_diff (H - L)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
