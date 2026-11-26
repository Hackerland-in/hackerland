'use client';

import { useState } from 'react';
import type { EisDataPoint, RandlesEcmParameters } from '@hackerland/core';
import { calculateRandlesImpedance } from '@hackerland/core';

interface NyquistPlotVisualizerProps {
  measuredSpectrum: EisDataPoint[];
  fittedEcm?: RandlesEcmParameters;
  cellTitle?: string;
}

export function NyquistPlotVisualizer({
  measuredSpectrum,
  fittedEcm,
  cellTitle = 'Cell EIS',
}: NyquistPlotVisualizerProps) {
  const [hoveredPoint, setHoveredPoint] = useState<EisDataPoint | null>(null);

  const pointsInMilliOhm = measuredSpectrum.map((pt) => ({
    ...pt,
    zRealMOhm: pt.zRealOhm * 1000,
    zImagMOhm: -pt.zImagOhm * 1000,
  }));

  const maxReal = Math.max(...pointsInMilliOhm.map((p) => p.zRealMOhm)) * 1.15;
  const minReal = Math.max(0, Math.min(...pointsInMilliOhm.map((p) => p.zRealMOhm)) * 0.8);
  const maxImag = Math.max(5, Math.max(...pointsInMilliOhm.map((p) => p.zImagMOhm)) * 1.25);
  const minImag = Math.min(-2, Math.min(...pointsInMilliOhm.map((p) => p.zImagMOhm)) * 1.1);

  const svgWidth = 600;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const toSvgX = (zRealMOhm: number) => {
    return padding.left + ((zRealMOhm - minReal) / (maxReal - minReal || 1)) * plotWidth;
  };

  const toSvgY = (negZImagMOhm: number) => {
    return padding.top + plotHeight - ((negZImagMOhm - minImag) / (maxImag - minImag || 1)) * plotHeight;
  };

  let fittedPolyline = '';
  if (fittedEcm) {
    const fittedCurvePoints: { x: number; y: number }[] = [];
    const minFreq = Math.min(...measuredSpectrum.map((p) => p.frequencyHz));
    const maxFreq = Math.max(...measuredSpectrum.map((p) => p.frequencyHz));

    const steps = 60;
    const logMin = Math.log10(minFreq);
    const logMax = Math.log10(maxFreq);

    for (let i = 0; i <= steps; i++) {
      const f = Math.pow(10, logMin + (i / steps) * (logMax - logMin));
      const z = calculateRandlesImpedance(fittedEcm, f);
      fittedCurvePoints.push({
        x: toSvgX(z.zReal * 1000),
        y: toSvgY(-z.zImag * 1000),
      });
    }

    fittedPolyline = fittedCurvePoints.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  }

  const zeroCrossingPt = pointsInMilliOhm.reduce((prev, curr) =>
    Math.abs(curr.zImagMOhm) < Math.abs(prev.zImagMOhm) ? curr : prev,
  );

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 flex flex-col items-center shadow-xs">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 text-xs">
        <div>
          <span className="font-mono uppercase font-bold tracking-wider text-accent-fg">
            Nyquist Impedance Spectrum (-Z″ vs Z′)
          </span>
          <span className="text-fg-muted block text-[11px] mt-0.5">
            {cellTitle} · Standard Electrochemical Representation
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" />
            <span className="text-fg">Measured EIS</span>
          </div>
          {fittedEcm && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-info inline-block" />
              <span className="text-fg">Fitted Randles ECM</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[16/10] max-w-[740px] bg-sunken rounded-xl p-2 border border-hairline select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full text-xs font-mono">
          <line
            x1={padding.left}
            y1={toSvgY(0)}
            x2={svgWidth - padding.right}
            y2={toSvgY(0)}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {Array.from({ length: 5 }).map((_, i) => {
            const val = minReal + (i / 4) * (maxReal - minReal);
            const x = toSvgX(val);
            return (
              <g key={i}>
                <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="#e5d5de" strokeWidth="1" />
                <text x={x} y={svgHeight - padding.bottom + 18} fill="#64748b" fontSize="10" textAnchor="middle">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {Array.from({ length: 4 }).map((_, i) => {
            const val = minImag + (i / 3) * (maxImag - minImag);
            const y = toSvgY(val);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#e5d5de" strokeWidth="1" />
                <text x={padding.left - 10} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold">
            Real Impedance Z′ (mΩ)
          </text>
          <text
            x={-svgHeight / 2}
            y={18}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#475569"
            fontSize="11"
            fontWeight="bold"
          >
            -Imaginary Impedance -Z″ (mΩ)
          </text>

          {fittedPolyline && (
            <polyline
              points={fittedPolyline}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              opacity="0.9"
            />
          )}

          <polyline
            points={pointsInMilliOhm
              .map((p) => `${toSvgX(p.zRealMOhm).toFixed(1)},${toSvgY(p.zImagMOhm).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke="#e11d74"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.6"
          />

          {zeroCrossingPt && (
            <g>
              <circle
                cx={toSvgX(zeroCrossingPt.zRealMOhm)}
                cy={toSvgY(zeroCrossingPt.zImagMOhm)}
                r="6.5"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x={toSvgX(zeroCrossingPt.zRealMOhm)}
                y={toSvgY(zeroCrossingPt.zImagMOhm) - 12}
                fill="#b45309"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                R₀={zeroCrossingPt.zRealMOhm.toFixed(2)}mΩ (1kHz)
              </text>
            </g>
          )}

          {pointsInMilliOhm.map((pt, idx) => {
            const x = toSvgX(pt.zRealMOhm);
            const y = toSvgY(pt.zImagMOhm);
            const isHovered = hoveredPoint?.frequencyHz === pt.frequencyHz;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#2563eb' : '#e11d74'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {(idx === 0 || idx === pointsInMilliOhm.length - 1 || idx === 2) && (
                  <text x={x + 8} y={y - 6} fill="#475569" fontSize="9" fontWeight="600">
                    {pt.frequencyHz >= 1000 ? `${pt.frequencyHz / 1000}kHz` : `${pt.frequencyHz}Hz`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-surface-1/95 border border-accent/40 rounded-xl p-2.5 text-[11px] font-mono shadow-overlay backdrop-blur-sm pointer-events-none space-y-0.5">
            <span className="text-accent-fg font-bold block">
              Frequency: {hoveredPoint.frequencyHz >= 1000 ? `${hoveredPoint.frequencyHz / 1000} kHz` : `${hoveredPoint.frequencyHz} Hz`}
            </span>
            <div className="text-fg-muted">
              Z′: <span className="text-fg font-bold">{(hoveredPoint.zRealOhm * 1000).toFixed(2)} mΩ</span>
            </div>
            <div className="text-fg-muted">
              -Z″: <span className="text-fg font-bold">{(-hoveredPoint.zImagOhm * 1000).toFixed(2)} mΩ</span>
            </div>
            <div className="text-fg-muted">
              |Z|: <span className="text-fg font-bold">{(hoveredPoint.magnitudeOhm * 1000).toFixed(2)} mΩ</span>
            </div>
            <div className="text-fg-muted">
              Phase: <span className="text-info-fg font-bold">{hoveredPoint.phaseDeg.toFixed(1)}°</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-3 flex items-center justify-between text-[11px] font-mono text-fg-muted border-t border-hairline pt-2.5 px-1">
        <span>High-Frequency &larr; (Inductive/Bulk Electrolyte)</span>
        <span>Low-Frequency (Warburg Diffusion) &rarr;</span>
      </div>
    </div>
  );
}
