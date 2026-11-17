'use client';

import { useState } from 'react';
import type { FocWaveformPoint } from '@hackerland/core';

interface FocWaveformVisualizerProps {
  waveforms: FocWaveformPoint[];
  idCurrentA: number;
  iqCurrentA: number;
  phaseCurrentRmsA: number;
  title?: string;
}

export function FocWaveformVisualizer({
  waveforms,
  idCurrentA,
  iqCurrentA,
  phaseCurrentRmsA,
  title = '3-Phase Stator Current & Saddle PWM Waveforms',
}: FocWaveformVisualizerProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'currents' | 'duty'>('currents');

  const svgWidth = 620;
  const svgHeight = 280;
  const pad = { top: 25, right: 30, bottom: 40, left: 55 };
  const plotWidth = svgWidth - pad.left - pad.right;
  const plotHeight = svgHeight - pad.top - pad.bottom;

  // Max current for scaling
  const maxI = Math.max(
    10,
    ...waveforms.map((w) =>
      Math.max(Math.abs(w.currentPhaseA), Math.abs(w.currentPhaseB), Math.abs(w.currentPhaseC))
    )
  ) * 1.15;

  const toX = (deg: number) => pad.left + (deg / 360) * plotWidth;
  const toYCurrent = (val: number) => pad.top + plotHeight / 2 - (val / maxI) * (plotHeight / 2);
  const toYDuty = (val: number) => pad.top + plotHeight - val * plotHeight;

  // Polylines for currents
  const pathIA = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYCurrent(w.currentPhaseA).toFixed(1)}`).join(' ');
  const pathIB = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYCurrent(w.currentPhaseB).toFixed(1)}`).join(' ');
  const pathIC = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYCurrent(w.currentPhaseC).toFixed(1)}`).join(' ');

  // Polylines for duty cycles
  const pathDA = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYDuty(w.dutyCycleA).toFixed(1)}`).join(' ');
  const pathDB = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYDuty(w.dutyCycleB).toFixed(1)}`).join(' ');
  const pathDC = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYDuty(w.dutyCycleC).toFixed(1)}`).join(' ');

  const activePoint = hoveredIdx !== null && waveforms[hoveredIdx] ? waveforms[hoveredIdx] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-sky-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">
            Balanced 120° electrical displacement reconstructed from Park transforms ($I_d = {idCurrentA}$A, $I_q = {iqCurrentA}$A)
          </p>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('currents')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'currents'
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Phase Currents (A)
          </button>
          <button
            onClick={() => setActiveTab('duty')}
            className={`px-2.5 py-1 rounded transition ${
              activeTab === 'duty'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Saddle Duty Cycles
          </button>
        </div>
      </div>

      {/* Waveform SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950/70 rounded-lg p-2 border border-slate-800/80">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px] select-none">
          {/* Horizontal Grid */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = pad.top + plotHeight * frac;
            return (
              <line
                key={`hgrid-${idx}`}
                x1={pad.left}
                y1={y}
                x2={pad.left + plotWidth}
                y2={y}
                stroke="#334155"
                strokeDasharray="3,3"
                strokeWidth="0.8"
              />
            );
          })}

          {/* Zero reference line for currents */}
          {activeTab === 'currents' && (
            <line
              x1={pad.left}
              y1={pad.top + plotHeight / 2}
              x2={pad.left + plotWidth}
              y2={pad.top + plotHeight / 2}
              stroke="#64748b"
              strokeWidth="1.5"
            />
          )}

          {/* Vertical Grid & Degree ticks */}
          {[0, 60, 120, 180, 240, 300, 360].map((deg) => {
            const x = toX(deg);
            return (
              <g key={`vgrid-${deg}`}>
                <line
                  x1={x}
                  y1={pad.top}
                  x2={x}
                  y2={pad.top + plotHeight}
                  stroke="#334155"
                  strokeDasharray="3,3"
                  strokeWidth="0.8"
                />
                <text
                  x={x}
                  y={pad.top + plotHeight + 16}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {deg}°
                </text>
              </g>
            );
          })}

          {/* Y-Axis Ticks */}
          {activeTab === 'currents' ? (
            <>
              <text x={pad.left - 8} y={pad.top + 5} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                +{maxI.toFixed(0)}A
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight / 2 + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                0A
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                -{maxI.toFixed(0)}A
              </text>
            </>
          ) : (
            <>
              <text x={pad.left - 8} y={pad.top + 5} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                100%
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight / 2 + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                50%
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                0%
              </text>
            </>
          )}

          {/* Curves */}
          {activeTab === 'currents' ? (
            <>
              {/* Phase A - Cyan */}
              <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" points={pathIA} />
              {/* Phase B - Amber */}
              <polyline fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" points={pathIB} />
              {/* Phase C - Rose */}
              <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" points={pathIC} />
            </>
          ) : (
            <>
              {/* Duty A */}
              <polyline fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" points={pathDA} />
              {/* Duty B */}
              <polyline fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" points={pathDB} />
              {/* Duty C */}
              <polyline fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" points={pathDC} />
            </>
          )}

          {/* Interactive Hit Rectangles */}
          {waveforms.map((w, idx) => {
            const cx = toX(w.angleElectricalDeg);
            return (
              <rect
                key={`hit-${idx}`}
                x={cx - 6}
                y={pad.top}
                width="12"
                height={plotHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}

          {/* Hover Crosshair */}
          {activePoint && (
            <g>
              <line
                x1={toX(activePoint.angleElectricalDeg)}
                y1={pad.top}
                x2={toX(activePoint.angleElectricalDeg)}
                y2={pad.top + plotHeight}
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
              <circle
                cx={toX(activePoint.angleElectricalDeg)}
                cy={activeTab === 'currents' ? toYCurrent(activePoint.currentPhaseA) : toYDuty(activePoint.dutyCycleA)}
                r="4.5"
                fill="#38bdf8"
              />
              <circle
                cx={toX(activePoint.angleElectricalDeg)}
                cy={activeTab === 'currents' ? toYCurrent(activePoint.currentPhaseB) : toYDuty(activePoint.dutyCycleB)}
                r="4.5"
                fill="#fbbf24"
              />
              <circle
                cx={toX(activePoint.angleElectricalDeg)}
                cy={activeTab === 'currents' ? toYCurrent(activePoint.currentPhaseC) : toYDuty(activePoint.dutyCycleC)}
                r="4.5"
                fill="#f43f5e"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend and DQ Projections */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-400 inline-block rounded-full" />
            <span className="text-sky-300">Phase A (U)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-400 inline-block rounded-full" />
            <span className="text-amber-300">Phase B (V)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-rose-500 inline-block rounded-full" />
            <span className="text-rose-400">Phase C (W)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Phase RMS: <strong className="text-slate-100">{phaseCurrentRmsA} A</strong></span>
          <span className="text-slate-400">I_q: <strong className="text-emerald-400">{iqCurrentA} A</strong></span>
          <span className="text-slate-400">I_d: <strong className={idCurrentA < 0 ? 'text-amber-400' : 'text-slate-300'}>{idCurrentA} A</strong></span>
        </div>
      </div>

      {activePoint && (
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex flex-wrap items-center justify-around gap-2">
          <span>Angle: <strong className="text-slate-100">{activePoint.angleElectricalDeg.toFixed(0)}°</strong></span>
          <span>Ia: <strong className="text-sky-300">{activePoint.currentPhaseA.toFixed(1)} A</strong> ({(activePoint.dutyCycleA * 100).toFixed(1)}%)</span>
          <span>Ib: <strong className="text-amber-300">{activePoint.currentPhaseB.toFixed(1)} A</strong> ({(activePoint.dutyCycleB * 100).toFixed(1)}%)</span>
          <span>Ic: <strong className="text-rose-400">{activePoint.currentPhaseC.toFixed(1)} A</strong> ({(activePoint.dutyCycleC * 100).toFixed(1)}%)</span>
        </div>
      )}
    </div>
  );
}
