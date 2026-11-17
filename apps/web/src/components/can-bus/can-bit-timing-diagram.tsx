'use client';

import { useState } from 'react';
import type { CanWaveformSample } from '@hackerland/core';

interface CanBitTimingDiagramProps {
  nominalBitTimeNs: number;
  timeQuantumNs: number;
  totalTimeQuantaPerBit: number;
  samplePointPercent: number;
  samplePointStatus: 'optimal_cia' | 'acceptable' | 'marginal_out_of_spec';
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
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 280;
  const pad = { top: 30, right: 35, bottom: 45, left: 60 };
  const plotWidth = svgWidth - pad.left - pad.right;
  const plotHeight = svgHeight - pad.top - pad.bottom;

  // Segment allocations
  const syncSegTq = 1;
  const samplePointTq = Math.round((samplePointPercent / 100) * totalTimeQuantaPerBit);
  const phaseSeg2Tq = totalTimeQuantaPerBit - samplePointTq;
  const remaining = totalTimeQuantaPerBit - syncSegTq - phaseSeg2Tq;
  const propSegTq = Math.max(1, Math.floor(remaining / 2));
  const phaseSeg1Tq = remaining - propSegTq;

  // X coordinate helper for segments
  const toSegX = (tq: number) => pad.left + (tq / totalTimeQuantaPerBit) * plotWidth;

  // Oscilloscope X & Y helpers
  const maxTimeNs = waveforms.length > 0 ? waveforms[waveforms.length - 1]!.timeNs : 10000;
  const toScopeX = (tNs: number) => pad.left + (tNs / (maxTimeNs || 1)) * plotWidth;
  // Voltage range: 0V to 4.0V
  const toScopeY = (v: number) => pad.top + plotHeight - (v / 4.0) * plotHeight;

  // Oscilloscope polylines
  const pathCanH = waveforms.map((w) => `${toScopeX(w.timeNs).toFixed(1)},${toScopeY(w.vCanH).toFixed(1)}`).join(' ');
  const pathCanL = waveforms.map((w) => `${toScopeX(w.timeNs).toFixed(1)},${toScopeY(w.vCanL).toFixed(1)}`).join(' ');
  const pathVDiff = waveforms.map((w) => `${toScopeX(w.timeNs).toFixed(1)},${toScopeY(w.vDiff).toFixed(1)}`).join(' ');

  const activeWaveform = hoveredIdx !== null && waveforms[hoveredIdx] ? waveforms[hoveredIdx] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">
            Nominal bit time: <code className="text-amber-300 font-mono">{nominalBitTimeNs} ns</code> ({totalTimeQuantaPerBit} $t_q$ @ {timeQuantumNs} ns/tq)
          </p>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('timing_segments')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'timing_segments'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Bit Segments
          </button>
          <button
            onClick={() => setActiveTab('diff_oscilloscope')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'diff_oscilloscope'
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Differential Scope
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950/70 rounded-lg p-2 border border-slate-800/80">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px] select-none">
          {activeTab === 'timing_segments' ? (
            /* Tab 1: Bit Timing Segments Breakdown */
            <g>
              {/* Segment Rectangles */}
              {/* 1. Sync_Seg */}
              <rect
                x={toSegX(0)}
                y={pad.top + 40}
                width={toSegX(syncSegTq) - toSegX(0)}
                height={plotHeight - 80}
                className="fill-rose-500/20 stroke-rose-500"
                strokeWidth="1.5"
              />
              <text
                x={toSegX(syncSegTq / 2)}
                y={pad.top + 40 + (plotHeight - 80) / 2 + 4}
                textAnchor="middle"
                className="text-[10px] fill-rose-300 font-mono font-bold"
              >
                Sync
              </text>

              {/* 2. Prop_Seg */}
              <rect
                x={toSegX(syncSegTq)}
                y={pad.top + 40}
                width={toSegX(syncSegTq + propSegTq) - toSegX(syncSegTq)}
                height={plotHeight - 80}
                className="fill-sky-500/20 stroke-sky-500"
                strokeWidth="1.5"
              />
              <text
                x={toSegX(syncSegTq + propSegTq / 2)}
                y={pad.top + 40 + (plotHeight - 80) / 2 + 4}
                textAnchor="middle"
                className="text-[10px] fill-sky-300 font-mono font-bold"
              >
                Prop ({propSegTq} tq)
              </text>

              {/* 3. Phase_Seg1 */}
              <rect
                x={toSegX(syncSegTq + propSegTq)}
                y={pad.top + 40}
                width={toSegX(samplePointTq) - toSegX(syncSegTq + propSegTq)}
                height={plotHeight - 80}
                className="fill-amber-500/20 stroke-amber-500"
                strokeWidth="1.5"
              />
              <text
                x={toSegX(syncSegTq + propSegTq + phaseSeg1Tq / 2)}
                y={pad.top + 40 + (plotHeight - 80) / 2 + 4}
                textAnchor="middle"
                className="text-[10px] fill-amber-300 font-mono font-bold"
              >
                Phase 1 ({phaseSeg1Tq} tq)
              </text>

              {/* 4. Phase_Seg2 */}
              <rect
                x={toSegX(samplePointTq)}
                y={pad.top + 40}
                width={toSegX(totalTimeQuantaPerBit) - toSegX(samplePointTq)}
                height={plotHeight - 80}
                className="fill-violet-500/20 stroke-violet-500"
                strokeWidth="1.5"
              />
              <text
                x={toSegX(samplePointTq + phaseSeg2Tq / 2)}
                y={pad.top + 40 + (plotHeight - 80) / 2 + 4}
                textAnchor="middle"
                className="text-[10px] fill-violet-300 font-mono font-bold"
              >
                Phase 2 ({phaseSeg2Tq} tq)
              </text>

              {/* Sample Point Reticle Line */}
              <line
                x1={toSegX(samplePointTq)}
                y1={pad.top + 10}
                x2={toSegX(samplePointTq)}
                y2={pad.top + plotHeight - 10}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4,3"
              />

              {/* Sample Point Indicator Badge */}
              <g transform={`translate(${toSegX(samplePointTq) - 55}, ${pad.top + 10})`}>
                <rect width="110" height="22" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                <text x="55" y="15" textAnchor="middle" className="text-[10px] fill-emerald-200 font-mono font-bold">
                  SAMPLE POINT: {samplePointPercent}%
                </text>
              </g>

              {/* Time Quantum Tick Marks */}
              {Array.from({ length: totalTimeQuantaPerBit + 1 }).map((_, idx) => {
                const x = toSegX(idx);
                return (
                  <g key={`tq-${idx}`}>
                    <line x1={x} y1={pad.top + plotHeight - 35} x2={x} y2={pad.top + plotHeight - 25} stroke="#64748b" strokeWidth="1" />
                    {idx % 4 === 0 && (
                      <text x={x} y={pad.top + plotHeight - 12} textAnchor="middle" className="text-[9px] fill-slate-400 font-mono">
                        {idx}
                      </text>
                    )}
                  </g>
                );
              })}

              <text x={pad.left + plotWidth / 2} y={svgHeight - 10} textAnchor="middle" className="text-[11px] fill-slate-400 font-mono">
                Bit Time Quanta Division (Total {totalTimeQuantaPerBit} t_q)
              </text>
            </g>
          ) : (
            /* Tab 2: Differential Oscilloscope Waveforms */
            <g>
              {/* Voltage Grid Lines (0V, 1.0V, 1.5V, 2.0V, 2.5V, 3.5V) */}
              {[0, 1.0, 1.5, 2.0, 2.5, 3.5].map((v) => {
                const y = toScopeY(v);
                return (
                  <g key={`volt-${v}`}>
                    <line
                      x1={pad.left}
                      y1={y}
                      x2={pad.left + plotWidth}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3,3"
                      strokeWidth="0.8"
                    />
                    <text x={pad.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">
                      {v.toFixed(1)}V
                    </text>
                  </g>
                );
              })}

              {/* CAN_H Waveform (Amber) */}
              <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" points={pathCanH} />

              {/* CAN_L Waveform (Sky Blue) */}
              <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" points={pathCanL} />

              {/* V_Diff Waveform (Emerald) */}
              <polyline fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3,2" points={pathVDiff} />

              {/* Hover Hit Targets */}
              {waveforms.map((w, idx) => {
                const cx = toScopeX(w.timeNs);
                return (
                  <rect
                    key={`hit-${idx}`}
                    x={cx - 5}
                    y={pad.top}
                    width="10"
                    height={plotHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })}

              {/* Active Hover Marker */}
              {activeWaveform && (
                <g>
                  <line
                    x1={toScopeX(activeWaveform.timeNs)}
                    y1={pad.top}
                    x2={toScopeX(activeWaveform.timeNs)}
                    y2={pad.top + plotHeight}
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />
                  <circle cx={toScopeX(activeWaveform.timeNs)} cy={toScopeY(activeWaveform.vCanH)} r="4" fill="#f59e0b" />
                  <circle cx={toScopeX(activeWaveform.timeNs)} cy={toScopeY(activeWaveform.vCanL)} r="4" fill="#38bdf8" />
                  <circle cx={toScopeX(activeWaveform.timeNs)} cy={toScopeY(activeWaveform.vDiff)} r="4" fill="#10b981" />
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Sample Point Location</span>
          <span className="text-emerald-400 font-bold text-sm">{samplePointPercent}%</span>
          <span className="text-[10px] text-slate-500 block">Target: 80.0% – 87.5%</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Time Quantum (t_q)</span>
          <span className="text-amber-300 font-bold text-sm">{timeQuantumNs} ns</span>
          <span className="text-[10px] text-slate-500 block">Clock Prescaler: N_tq = {totalTimeQuantaPerBit}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">CiA 301 Compliance</span>
          <span className={`font-bold text-sm uppercase ${
            samplePointStatus === 'optimal_cia'
              ? 'text-emerald-400'
              : samplePointStatus === 'acceptable'
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}>
            {samplePointStatus.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] text-slate-500 block">Prop: {propSegTq} tq, Phase1: {phaseSeg1Tq} tq</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Dominant V_diff</span>
          <span className="text-sky-400 font-bold text-sm">~2.00 V</span>
          <span className="text-[10px] text-slate-500 block">CAN_H 3.5V / CAN_L 1.5V</span>
        </div>
      </div>

      {activeTab === 'diff_oscilloscope' && (
        <div className="flex items-center justify-between text-xs font-mono border-t border-slate-800 pt-2 px-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-3 h-0.5 bg-amber-400 inline-block" /> CAN_H
            </span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <span className="w-3 h-0.5 bg-sky-400 inline-block" /> CAN_L
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> V_diff (H - L)
            </span>
          </div>
          {activeWaveform && (
            <div className="text-slate-300">
              {activeWaveform.segmentLabel}: <strong className="text-amber-300">{activeWaveform.vCanH}V</strong>, <strong className="text-sky-300">{activeWaveform.vCanL}V</strong> (V_diff: <strong className="text-emerald-300">{activeWaveform.vDiff}V</strong>)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
