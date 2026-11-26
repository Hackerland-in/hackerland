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

  const maxI =
    Math.max(
      10,
      ...waveforms.map((w) =>
        Math.max(Math.abs(w.currentPhaseA), Math.abs(w.currentPhaseB), Math.abs(w.currentPhaseC))
      )
    ) * 1.15;

  const toX = (deg: number) => pad.left + (deg / 360) * plotWidth;
  const toYCurrent = (val: number) => pad.top + plotHeight / 2 - (val / maxI) * (plotHeight / 2);
  const toYDuty = (val: number) => pad.top + plotHeight - val * plotHeight;

  const pathIA = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYCurrent(w.currentPhaseA).toFixed(1)}`).join(' ');
  const pathIB = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYCurrent(w.currentPhaseB).toFixed(1)}`).join(' ');
  const pathIC = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYCurrent(w.currentPhaseC).toFixed(1)}`).join(' ');

  const pathDA = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYDuty(w.dutyCycleA).toFixed(1)}`).join(' ');
  const pathDB = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYDuty(w.dutyCycleB).toFixed(1)}`).join(' ');
  const pathDC = waveforms.map((w) => `${toX(w.angleElectricalDeg).toFixed(1)},${toYDuty(w.dutyCycleC).toFixed(1)}`).join(' ');

  const activePoint = hoveredIdx !== null && waveforms[hoveredIdx] ? waveforms[hoveredIdx] : null;

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs text-fg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-accent-fg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            {title}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Balanced 120° electrical displacement reconstructed from Park transforms (I_d = {idCurrentA}A, I_q = {iqCurrentA}A)
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('currents')}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              activeTab === 'currents'
                ? 'bg-accent text-on-solid border-accent font-bold shadow-xs'
                : 'bg-sunken text-fg-muted border-hairline hover:text-fg'
            }`}
          >
            Phase Currents (A)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('duty')}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              activeTab === 'duty'
                ? 'bg-accent text-on-solid border-accent font-bold shadow-xs'
                : 'bg-sunken text-fg-muted border-hairline hover:text-fg'
            }`}
          >
            Saddle Duty Cycles
          </button>
        </div>
      </div>

      {/* Waveform SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-sunken rounded-xl p-2.5 border border-hairline">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px] select-none">
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = pad.top + plotHeight * frac;
            return (
              <line
                key={`hgrid-${idx}`}
                x1={pad.left}
                y1={y}
                x2={pad.left + plotWidth}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3,3"
                strokeWidth="0.9"
              />
            );
          })}

          {activeTab === 'currents' && (
            <line
              x1={pad.left}
              y1={pad.top + plotHeight / 2}
              x2={pad.left + plotWidth}
              y2={pad.top + plotHeight / 2}
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
          )}

          {[0, 60, 120, 180, 240, 300, 360].map((deg) => {
            const x = toX(deg);
            return (
              <g key={`vgrid-${deg}`}>
                <line
                  x1={x}
                  y1={pad.top}
                  x2={x}
                  y2={pad.top + plotHeight}
                  stroke="#E2E8F0"
                  strokeDasharray="3,3"
                  strokeWidth="0.9"
                />
                <text
                  x={x}
                  y={pad.top + plotHeight + 16}
                  textAnchor="middle"
                  fill="#475569"
                  className="text-[10px] font-mono"
                >
                  {deg}°
                </text>
              </g>
            );
          })}

          {activeTab === 'currents' ? (
            <>
              <text x={pad.left - 8} y={pad.top + 5} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                +{maxI.toFixed(0)}A
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight / 2 + 4} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                0A
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                -{maxI.toFixed(0)}A
              </text>
            </>
          ) : (
            <>
              <text x={pad.left - 8} y={pad.top + 5} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                100%
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight / 2 + 4} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                50%
              </text>
              <text x={pad.left - 8} y={pad.top + plotHeight} textAnchor="end" fill="#475569" className="text-[10px] font-mono">
                0%
              </text>
            </>
          )}

          {activeTab === 'currents' ? (
            <>
              <polyline fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" points={pathIA} />
              <polyline fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" points={pathIB} />
              <polyline fill="none" stroke="#FA1681" strokeWidth="2.5" strokeLinecap="round" points={pathIC} />
            </>
          ) : (
            <>
              <polyline fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" points={pathDA} />
              <polyline fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" points={pathDB} />
              <polyline fill="none" stroke="#FA1681" strokeWidth="2.2" strokeLinecap="round" points={pathDC} />
            </>
          )}

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

          {activePoint && (
            <g>
              <line
                x1={toX(activePoint.angleElectricalDeg)}
                y1={pad.top}
                x2={toX(activePoint.angleElectricalDeg)}
                y2={pad.top + plotHeight}
                stroke="#64748B"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
              <circle
                cx={toX(activePoint.angleElectricalDeg)}
                cy={activeTab === 'currents' ? toYCurrent(activePoint.currentPhaseA) : toYDuty(activePoint.dutyCycleA)}
                r="4.5"
                fill="#0284C7"
              />
              <circle
                cx={toX(activePoint.angleElectricalDeg)}
                cy={activeTab === 'currents' ? toYCurrent(activePoint.currentPhaseB) : toYDuty(activePoint.dutyCycleB)}
                r="4.5"
                fill="#D97706"
              />
              <circle
                cx={toX(activePoint.angleElectricalDeg)}
                cy={activeTab === 'currents' ? toYCurrent(activePoint.currentPhaseC) : toYDuty(activePoint.dutyCycleC)}
                r="4.5"
                fill="#FA1681"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend and DQ Projections */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-600 inline-block rounded-full" />
            <span className="text-sky-700 font-semibold">Phase A (U)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-600 inline-block rounded-full" />
            <span className="text-amber-700 font-semibold">Phase B (V)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-accent inline-block rounded-full" />
            <span className="text-accent-fg font-semibold">Phase C (W)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-fg-muted">Phase RMS: <strong className="text-fg">{phaseCurrentRmsA} A</strong></span>
          <span className="text-fg-muted">I_q: <strong className="text-emerald-700">{iqCurrentA} A</strong></span>
          <span className="text-fg-muted">I_d: <strong className={idCurrentA < 0 ? 'text-amber-700' : 'text-fg'}>{idCurrentA} A</strong></span>
        </div>
      </div>

      {activePoint && (
        <div className="bg-sunken p-2.5 rounded-xl border border-hairline font-mono text-xs text-fg flex flex-wrap items-center justify-around gap-2">
          <span>Angle: <strong>{activePoint.angleElectricalDeg.toFixed(0)}°</strong></span>
          <span>Ia: <strong className="text-sky-700">{activePoint.currentPhaseA.toFixed(1)} A</strong> ({(activePoint.dutyCycleA * 100).toFixed(1)}%)</span>
          <span>Ib: <strong className="text-amber-700">{activePoint.currentPhaseB.toFixed(1)} A</strong> ({(activePoint.dutyCycleB * 100).toFixed(1)}%)</span>
          <span>Ic: <strong className="text-accent-fg">{activePoint.currentPhaseC.toFixed(1)} A</strong> ({(activePoint.dutyCycleC * 100).toFixed(1)}%)</span>
        </div>
      )}
    </div>
  );
}
