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

  // Convert Ohms to milli-Ohms (mΩ) for clean readability
  const pointsInMilliOhm = measuredSpectrum.map((pt) => ({
    ...pt,
    zRealMOhm: pt.zRealOhm * 1000,
    zImagMOhm: -pt.zImagOhm * 1000, // Standard Nyquist plots -Z'' on Y axis (positive values upwards)
  }));

  // Find bounds for SVG scaling
  const maxReal = Math.max(...pointsInMilliOhm.map((p) => p.zRealMOhm)) * 1.15;
  const minReal = Math.max(0, Math.min(...pointsInMilliOhm.map((p) => p.zRealMOhm)) * 0.8);
  const maxImag = Math.max(5, Math.max(...pointsInMilliOhm.map((p) => p.zImagMOhm)) * 1.25);
  const minImag = Math.min(-2, Math.min(...pointsInMilliOhm.map((p) => p.zImagMOhm)) * 1.1);

  // SVG dimensions
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

  // Generate synthetic smooth curve from fitted Randles ECM if provided
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

  // Identify key diagnostic features
  const zeroCrossingPt = pointsInMilliOhm.reduce((prev, curr) =>
    Math.abs(curr.zImagMOhm) < Math.abs(prev.zImagMOhm) ? curr : prev
  );

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col items-center">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 text-xs">
        <div>
          <span className="font-mono uppercase font-bold tracking-wider text-emerald-400">
            Nyquist Impedance Spectrum (-Z″ vs Z′)
          </span>
          <span className="text-stone-400 block text-[11px] mt-0.5">
            {cellTitle} · Standard Electrochemical Representation
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-stone-300">Measured EIS</span>
          </div>
          {fittedEcm && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              <span className="text-stone-300">Fitted Randles ECM</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[16/10] max-w-[700px] bg-stone-950 rounded-lg p-2 border border-stone-800 select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full text-xs font-mono">
          <defs>
            <linearGradient id="nyquistArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {/* Zero Imag axis */}
          <line
            x1={padding.left}
            y1={toSvgY(0)}
            x2={svgWidth - padding.right}
            y2={toSvgY(0)}
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Vertical axis ticks and grid */}
          {Array.from({ length: 5 }).map((_, i) => {
            const val = minReal + (i / 4) * (maxReal - minReal);
            const x = toSvgX(val);
            return (
              <g key={i}>
                <line x1={x} y1={padding.top} x2={x} y2={svgHeight - padding.bottom} stroke="#1e293b" strokeWidth="1" />
                <text x={x} y={svgHeight - padding.bottom + 18} fill="#64748b" fontSize="10" textAnchor="middle">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Horizontal axis ticks and grid */}
          {Array.from({ length: 4 }).map((_, i) => {
            const val = minImag + (i / 3) * (maxImag - minImag);
            const y = toSvgY(val);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#1e293b" strokeWidth="1" />
                <text x={padding.left - 10} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={svgWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
          >
            Real Impedance Z′ (mΩ)
          </text>
          <text
            x={-svgHeight / 2}
            y={18}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
          >
            -Imaginary Impedance -Z″ (mΩ)
          </text>

          {/* Fitted ECM Curve */}
          {fittedPolyline && (
            <polyline
              points={fittedPolyline}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              opacity="0.85"
            />
          )}

          {/* Measured Data Points Connection Line */}
          <polyline
            points={pointsInMilliOhm
              .map((p) => `${toSvgX(p.zRealMOhm).toFixed(1)},${toSvgY(p.zImagMOhm).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.5"
          />

          {/* Bulk Resistance R0 Zero-crossing marker */}
          {zeroCrossingPt && (
            <g>
              <circle
                cx={toSvgX(zeroCrossingPt.zRealMOhm)}
                cy={toSvgY(zeroCrossingPt.zImagMOhm)}
                r="6"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text
                x={toSvgX(zeroCrossingPt.zRealMOhm)}
                y={toSvgY(zeroCrossingPt.zImagMOhm) - 12}
                fill="#f59e0b"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                R₀={zeroCrossingPt.zRealMOhm.toFixed(2)}mΩ (1kHz)
              </text>
            </g>
          )}

          {/* Measured Data Points */}
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
                  fill={isHovered ? '#38bdf8' : '#10b981'}
                  stroke="#022c22"
                  strokeWidth="1.5"
                />
                {/* Frequency annotation for endpoints */}
                {(idx === 0 || idx === pointsInMilliOhm.length - 1 || idx === 2) && (
                  <text
                    x={x + 8}
                    y={y - 6}
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {pt.frequencyHz >= 1000
                      ? `${pt.frequencyHz / 1000}kHz`
                      : `${pt.frequencyHz}Hz`}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-stone-900/95 border border-cyan-500/50 rounded-lg p-2.5 text-[11px] font-mono shadow-2xl backdrop-blur-sm pointer-events-none space-y-0.5">
            <span className="text-cyan-400 font-bold block">
              Frequency: {hoveredPoint.frequencyHz >= 1000 ? `${hoveredPoint.frequencyHz / 1000} kHz` : `${hoveredPoint.frequencyHz} Hz`}
            </span>
            <div className="text-stone-300">
              Z′: <span className="text-stone-100 font-bold">{(hoveredPoint.zRealOhm * 1000).toFixed(2)} mΩ</span>
            </div>
            <div className="text-stone-300">
              -Z″: <span className="text-stone-100 font-bold">{(-hoveredPoint.zImagOhm * 1000).toFixed(2)} mΩ</span>
            </div>
            <div className="text-stone-300">
              |Z|: <span className="text-stone-100 font-bold">{(hoveredPoint.magnitudeOhm * 1000).toFixed(2)} mΩ</span>
            </div>
            <div className="text-stone-300">
              Phase: <span className="text-amber-400 font-bold">{hoveredPoint.phaseDeg.toFixed(1)}°</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full mt-3 flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-800 pt-2 px-1">
        <span>High-Frequency &larr; (Inductive/Bulk Electrolyte)</span>
        <span>Low-Frequency (Warburg Diffusion) &rarr;</span>
      </div>
    </div>
  );
}
