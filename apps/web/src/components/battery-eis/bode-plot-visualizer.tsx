'use client';

import { useState } from 'react';
import type { EisDataPoint } from '@hackerland/core';

interface BodePlotVisualizerProps {
  measuredSpectrum: EisDataPoint[];
}

export function BodePlotVisualizer({ measuredSpectrum }: BodePlotVisualizerProps) {
  const [hoveredPoint, setHoveredPoint] = useState<EisDataPoint | null>(null);

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
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 flex flex-col items-center shadow-xs">
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
        <div>
          <span className="font-mono uppercase font-bold tracking-wider text-accent-fg">
            Bode Frequency Response (|Z| &amp; Phase vs Frequency)
          </span>
          <span className="text-fg-muted block text-[11px] mt-0.5">
            Logarithmic Sweep from {minFreq >= 1000 ? `${minFreq / 1000}kHz` : `${minFreq}Hz`} to{' '}
            {maxFreq >= 1000 ? `${maxFreq / 1000}kHz` : `${maxFreq}Hz`}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-accent inline-block rounded" />
            <span className="text-accent-fg font-semibold">|Z| (mΩ)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-info inline-block rounded" />
            <span className="text-info-fg font-semibold">Phase (°)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/7.5] max-w-[740px] bg-sunken rounded-xl p-2 border border-hairline select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full text-xs font-mono">
          <line
            x1={padding.left}
            y1={toSvgYPhase(0)}
            x2={svgWidth - padding.right}
            y2={toSvgYPhase(0)}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {[0.01, 0.1, 1, 10, 100, 1000, 10000, 100000].map((f, i) => {
            if (f < minFreq * 0.9 || f > maxFreq * 1.1) return null;
            const x = toSvgX(f);
            return (
              <g key={i}>
                <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="#e5d5de" strokeWidth="1" />
                <text x={x} y={svgHeight - padding.bottom + 16} fill="#64748b" fontSize="9" textAnchor="middle">
                  {f >= 1000 ? `${f / 1000}k` : f}
                </text>
              </g>
            );
          })}

          {Array.from({ length: 4 }).map((_, i) => {
            const val = minMag + (i / 3) * (maxMag - minMag);
            const y = toSvgYMag(val);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#e5d5de" strokeWidth="0.8" />
                <text x={padding.left - 8} y={y + 3} fill="#be185d" fontSize="9" textAnchor="end" fontWeight="600">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {Array.from({ length: 4 }).map((_, i) => {
            const val = minPhase + (i / 3) * (maxPhase - minPhase);
            const y = toSvgYPhase(val);
            return (
              <text key={i} x={svgWidth - padding.right + 8} y={y + 3} fill="#1d4ed8" fontSize="9" textAnchor="start" fontWeight="600">
                {val.toFixed(0)}°
              </text>
            );
          })}

          <text x={padding.left} y={18} fill="#be185d" fontSize="10" fontWeight="bold">
            |Z| (mΩ)
          </text>
          <text x={svgWidth - padding.right} y={18} fill="#1d4ed8" fontSize="10" fontWeight="bold" textAnchor="end">
            Phase (°)
          </text>
          <text x={svgWidth / 2} y={svgHeight - 8} fill="#64748b" fontSize="10" textAnchor="middle">
            Frequency (Hz, Log Scale)
          </text>

          <polyline points={magPoints} fill="none" stroke="#e11d74" strokeWidth="2.5" />
          <polyline points={phasePoints} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 2" />

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
                <circle cx={x} cy={yMag} r={isHovered ? 5 : 3.5} fill="#e11d74" stroke="#ffffff" strokeWidth="1.2" />
                <circle cx={x} cy={yPhase} r={isHovered ? 5 : 3.5} fill="#2563eb" stroke="#ffffff" strokeWidth="1.2" />
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div className="absolute bottom-12 right-6 bg-surface-1/95 border border-accent/40 rounded-xl p-2.5 text-[10px] font-mono shadow-overlay backdrop-blur-sm pointer-events-none">
            <span className="text-fg font-bold block">
              f = {hoveredPoint.frequencyHz >= 1000 ? `${hoveredPoint.frequencyHz / 1000} kHz` : `${hoveredPoint.frequencyHz} Hz`}
            </span>
            <span className="text-accent-fg font-semibold block">
              |Z| = {(hoveredPoint.magnitudeOhm * 1000).toFixed(2)} mΩ
            </span>
            <span className="text-info-fg font-semibold block">Phase = {hoveredPoint.phaseDeg.toFixed(1)}°</span>
          </div>
        )}
      </div>
    </div>
  );
}
