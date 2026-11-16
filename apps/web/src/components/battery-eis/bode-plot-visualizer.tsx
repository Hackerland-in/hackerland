'use client';

import { useState } from 'react';
import type { EisDataPoint } from '@hackerland/core';

interface BodePlotVisualizerProps {
  measuredSpectrum: EisDataPoint[];
}

export function BodePlotVisualizer({ measuredSpectrum }: BodePlotVisualizerProps) {
  const [hoveredPoint, setHoveredPoint] = useState<EisDataPoint | null>(null);

  // Sort spectrum by frequency ascending
  const sorted = [...measuredSpectrum].sort((a, b) => a.frequencyHz - b.frequencyHz);

  const minFreq = Math.min(...sorted.map((p) => p.frequencyHz));
  const maxFreq = Math.max(...sorted.map((p) => p.frequencyHz));
  const logMinFreq = Math.log10(minFreq);
  const logMaxFreq = Math.log10(maxFreq);

  const magnitudesMOhm = sorted.map((p) => p.magnitudeOhm * 1000);
  const maxMag = Math.max(...magnitudesMOhm) * 1.15;
  const minMag = Math.max(0, Math.min(...magnitudesMOhm) * 0.8);

  const phases = sorted.map((p) => p.phaseDeg);
  const maxPhase = Math.max(15, Math.max(...phases) + 5);
  const minPhase = Math.min(-30, Math.min(...phases) - 5);

  const svgWidth = 600;
  const svgHeight = 280;
  const padding = { top: 30, right: 65, bottom: 45, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const toSvgX = (freqHz: number) => {
    const logF = Math.log10(freqHz);
    return padding.left + ((logF - logMinFreq) / (logMaxFreq - logMinFreq || 1)) * plotWidth;
  };

  const toSvgYMag = (magMOhm: number) => {
    return padding.top + plotHeight - ((magMOhm - minMag) / (maxMag - minMag || 1)) * plotHeight;
  };

  const toSvgYPhase = (phaseDeg: number) => {
    return padding.top + plotHeight - ((phaseDeg - minPhase) / (maxPhase - minPhase || 1)) * plotHeight;
  };

  const magPoints = sorted.map((p) => `${toSvgX(p.frequencyHz).toFixed(1)},${toSvgYMag(p.magnitudeOhm * 1000).toFixed(1)}`).join(' ');
  const phasePoints = sorted.map((p) => `${toSvgX(p.frequencyHz).toFixed(1)},${toSvgYPhase(p.phaseDeg).toFixed(1)}`).join(' ');

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <div>
          <span className="font-mono uppercase font-bold tracking-wider text-cyan-400">
            Bode Frequency Response (|Z| &amp; Phase vs Frequency)
          </span>
          <span className="text-stone-400 block text-[11px] mt-0.5">
            Logarithmic Sweep from {minFreq >= 1000 ? `${minFreq / 1000}kHz` : `${minFreq}Hz`} to {maxFreq >= 1000 ? `${maxFreq / 1000}kHz` : `${maxFreq}Hz`}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 inline-block rounded" />
            <span className="text-cyan-400 font-semibold">|Z| (mΩ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-400 inline-block rounded" />
            <span className="text-amber-400 font-semibold">Phase (°)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/7.5] max-w-[700px] bg-stone-950 rounded-lg p-2 border border-stone-800 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full text-xs font-mono">
          {/* Zero phase line */}
          <line
            x1={padding.left}
            y1={toSvgYPhase(0)}
            x2={svgWidth - padding.right}
            y2={toSvgYPhase(0)}
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Log Frequency Vertical Grid Lines */}
          {[0.01, 0.1, 1, 10, 100, 1000, 10000, 100000].map((f, i) => {
            if (f < minFreq * 0.9 || f > maxFreq * 1.1) return null;
            const x = toSvgX(f);
            return (
              <g key={i}>
                <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="#1e293b" strokeWidth="1" />
                <text x={x} y={svgHeight - padding.bottom + 16} fill="#64748b" fontSize="9" textAnchor="middle">
                  {f >= 1000 ? `${f / 1000}k` : f}
                </text>
              </g>
            );
          })}

          {/* Left Y-axis (Magnitude in mΩ) */}
          {Array.from({ length: 4 }).map((_, i) => {
            const val = minMag + (i / 3) * (maxMag - minMag);
            const y = toSvgYMag(val);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#1e293b" strokeWidth="0.8" opacity="0.5" />
                <text x={padding.left - 8} y={y + 3} fill="#38bdf8" fontSize="9" textAnchor="end">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Right Y-axis (Phase in degrees) */}
          {Array.from({ length: 4 }).map((_, i) => {
            const val = minPhase + (i / 3) * (maxPhase - minPhase);
            const y = toSvgYPhase(val);
            return (
              <text key={i} x={svgWidth - padding.right + 8} y={y + 3} fill="#fbbf24" fontSize="9" textAnchor="start">
                {val.toFixed(0)}°
              </text>
            );
          })}

          {/* Axis Title Labels */}
          <text x={padding.left} y={18} fill="#38bdf8" fontSize="10" fontWeight="bold">
            |Z| (mΩ)
          </text>
          <text x={svgWidth - padding.right} y={18} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="end">
            Phase (°)
          </text>
          <text x={svgWidth / 2} y={svgHeight - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
            Frequency (Hz, Log Scale)
          </text>

          {/* Magnitude Trace */}
          <polyline points={magPoints} fill="none" stroke="#06b6d4" strokeWidth="2.5" />

          {/* Phase Trace */}
          <polyline points={phasePoints} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />

          {/* Interactive Data Point Dots */}
          {sorted.map((pt, idx) => {
            const x = toSvgX(pt.frequencyHz);
            const yMag = toSvgYMag(pt.magnitudeOhm * 1000);
            const yPhase = toSvgYPhase(pt.phaseDeg);
            const isHovered = hoveredPoint?.frequencyHz === pt.frequencyHz;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle cx={x} cy={yMag} r={isHovered ? 5 : 3.5} fill="#06b6d4" stroke="#000" strokeWidth="1" />
                <circle cx={x} cy={yPhase} r={isHovered ? 5 : 3.5} fill="#f59e0b" stroke="#000" strokeWidth="1" />
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div className="absolute bottom-12 right-6 bg-stone-900/95 border border-cyan-500/50 rounded-lg p-2 text-[10px] font-mono shadow-xl backdrop-blur-sm pointer-events-none">
            <span className="text-stone-200 font-bold block">
              f = {hoveredPoint.frequencyHz >= 1000 ? `${hoveredPoint.frequencyHz / 1000} kHz` : `${hoveredPoint.frequencyHz} Hz`}
            </span>
            <span className="text-cyan-400 block">|Z| = {(hoveredPoint.magnitudeOhm * 1000).toFixed(2)} mΩ</span>
            <span className="text-amber-400 block">Phase = {hoveredPoint.phaseDeg.toFixed(1)}°</span>
          </div>
        )}
      </div>
    </div>
  );
}
