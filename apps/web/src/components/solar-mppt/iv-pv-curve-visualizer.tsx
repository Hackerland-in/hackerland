'use client';

import { useState } from 'react';
import type { IvCurvePoint } from '@hackerland/core';

interface IvPvCurveVisualizerProps {
  ivCurve: IvCurvePoint[];
  pvCurve: IvCurvePoint[];
  vmppActualV: number;
  imppActualA: number;
  pmppActualW: number;
  vocActualV: number;
  iscActualA: number;
  fillFactor: number;
  title?: string;
}

export function IvPvCurveVisualizer({
  ivCurve,
  pvCurve,
  vmppActualV,
  imppActualA,
  pmppActualW,
  vocActualV,
  iscActualA,
  fillFactor,
  title = 'Photovoltaic IV & PV Characteristic Curves',
}: IvPvCurveVisualizerProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 360;
  const pad = { top: 35, right: 60, bottom: 50, left: 60 };
  const plotWidth = svgWidth - pad.left - pad.right;
  const plotHeight = svgHeight - pad.top - pad.bottom;

  // Maximum scales
  const maxV = Math.max(vocActualV * 1.08, 10);
  const maxI = Math.max(iscActualA * 1.15, 1);
  const maxP = Math.max(pmppActualW * 1.15, 10);

  const toX = (v: number) => pad.left + (v / maxV) * plotWidth;
  const toYCurrent = (i: number) => pad.top + plotHeight - (i / maxI) * plotHeight;
  const toYPower = (p: number) => pad.top + plotHeight - (p / maxP) * plotHeight;

  // Generate SVG polyline strings
  const ivPointsString = ivCurve
    .map((pt) => `${toX(pt.voltageV).toFixed(1)},${toYCurrent(pt.currentA).toFixed(1)}`)
    .join(' ');

  const pvPointsString = pvCurve
    .map((pt) => `${toX(pt.voltageV).toFixed(1)},${toYPower(pt.powerW).toFixed(1)}`)
    .join(' ');

  // MPP Coordinates
  const mppSvgX = toX(vmppActualV);
  const mppSvgYCurrent = toYCurrent(imppActualA);
  const mppSvgYPower = toYPower(pmppActualW);

  const activePoint = hoveredIdx !== null && ivCurve[hoveredIdx] ? ivCurve[hoveredIdx] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">
            Simulated Single-Diode I-V (Amperes) and P-V (Watts) response with MPP point
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400 inline-block" />
            <span className="text-sky-300 font-mono">I-V Curve (A)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            <span className="text-amber-300 font-mono">P-V Curve (W)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950/70 rounded-lg p-2 border border-slate-800/80">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px] select-none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = pad.top + plotHeight * frac;
            const x = pad.left + plotWidth * frac;
            return (
              <g key={`grid-${idx}`}>
                {/* Horizontal grid */}
                <line
                  x1={pad.left}
                  y1={y}
                  x2={pad.left + plotWidth}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3,3"
                  strokeWidth="0.8"
                />
                {/* Vertical grid */}
                <line
                  x1={x}
                  y1={pad.top}
                  x2={x}
                  y2={pad.top + plotHeight}
                  stroke="#334155"
                  strokeDasharray="3,3"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}

          {/* Axes */}
          {/* Bottom X-Axis */}
          <line
            x1={pad.left}
            y1={pad.top + plotHeight}
            x2={pad.left + plotWidth}
            y2={pad.top + plotHeight}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {/* Left Y-Axis (Current) */}
          <line
            x1={pad.left}
            y1={pad.top}
            x2={pad.left}
            y2={pad.top + plotHeight}
            stroke="#0ea5e9"
            strokeWidth="1.5"
          />
          {/* Right Y-Axis (Power) */}
          <line
            x1={pad.left + plotWidth}
            y1={pad.top}
            x2={pad.left + plotWidth}
            y2={pad.top + plotHeight}
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          {/* Tick Marks & Labels */}
          {/* X Ticks (Voltage) */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const v = (frac * maxV).toFixed(1);
            const x = pad.left + frac * plotWidth;
            return (
              <text
                key={`xtick-${idx}`}
                x={x}
                y={pad.top + plotHeight + 18}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {v}V
              </text>
            );
          })}
          <text
            x={pad.left + plotWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            className="text-[11px] fill-slate-300 font-medium"
          >
            Array Voltage (V)
          </text>

          {/* Left Y Ticks (Current) */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const currentVal = ((1 - frac) * maxI).toFixed(1);
            const y = pad.top + frac * plotHeight;
            return (
              <text
                key={`ytick-l-${idx}`}
                x={pad.left - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-sky-400 font-mono"
              >
                {currentVal}A
              </text>
            );
          })}
          <text
            x={16}
            y={pad.top + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90, 16, ${pad.top + plotHeight / 2})`}
            className="text-[11px] fill-sky-400 font-medium"
          >
            Current (A)
          </text>

          {/* Right Y Ticks (Power) */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const powerVal = Math.round((1 - frac) * maxP);
            const y = pad.top + frac * plotHeight;
            return (
              <text
                key={`ytick-r-${idx}`}
                x={pad.left + plotWidth + 8}
                y={y + 3}
                textAnchor="start"
                className="text-[10px] fill-amber-400 font-mono"
              >
                {powerVal}W
              </text>
            );
          })}
          <text
            x={svgWidth - 14}
            y={pad.top + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(90, ${svgWidth - 14}, ${pad.top + plotHeight / 2})`}
            className="text-[11px] fill-amber-400 font-medium"
          >
            Power (W)
          </text>

          {/* Curves */}
          {/* IV Curve */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={ivPointsString}
          />

          {/* PV Curve */}
          <polyline
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pvPointsString}
          />

          {/* MPP Crosshair Reticle */}
          <line
            x1={mppSvgX}
            y1={pad.top}
            x2={mppSvgX}
            y2={pad.top + plotHeight}
            stroke="#f59e0b"
            strokeDasharray="4,3"
            strokeWidth="1.2"
          />
          <line
            x1={pad.left}
            y1={mppSvgYPower}
            x2={pad.left + plotWidth}
            y2={mppSvgYPower}
            stroke="#f59e0b"
            strokeDasharray="4,3"
            strokeWidth="0.8"
          />

          {/* MPP Point on PV Curve */}
          <circle
            cx={mppSvgX}
            cy={mppSvgYPower}
            r="5"
            className="fill-amber-400 stroke-slate-900"
            strokeWidth="2"
          />

          {/* MPP Point on IV Curve */}
          <circle
            cx={mppSvgX}
            cy={mppSvgYCurrent}
            r="4.5"
            className="fill-sky-400 stroke-slate-900"
            strokeWidth="2"
          />

          {/* Label MPP Badge */}
          <g transform={`translate(${mppSvgX > pad.left + plotWidth - 110 ? mppSvgX - 110 : mppSvgX + 8}, ${mppSvgYPower - 24})`}>
            <rect
              width="100"
              height="20"
              rx="4"
              fill="#1e293b"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x="50"
              y="14"
              textAnchor="middle"
              className="text-[10px] fill-amber-300 font-mono font-bold"
            >
              MPP: {pmppActualW}W
            </text>
          </g>

          {/* Hover hit targets */}
          {ivCurve.map((pt, i) => {
            const cx = toX(pt.voltageV);
            return (
              <rect
                key={`hit-${i}`}
                x={cx - 5}
                y={pad.top}
                width="10"
                height={plotHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}

          {/* Hover indicator */}
          {activePoint && (
            <g>
              <line
                x1={toX(activePoint.voltageV)}
                y1={pad.top}
                x2={toX(activePoint.voltageV)}
                y2={pad.top + plotHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle
                cx={toX(activePoint.voltageV)}
                cy={toYCurrent(activePoint.currentA)}
                r="4"
                fill="#38bdf8"
              />
              <circle
                cx={toX(activePoint.voltageV)}
                cy={toYPower(activePoint.powerW)}
                r="4"
                fill="#fbbf24"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">P_mpp (Power)</span>
          <span className="font-mono text-sm font-bold text-amber-400">{pmppActualW} W</span>
        </div>
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">V_mpp (Voltage)</span>
          <span className="font-mono text-sm font-bold text-amber-300">{vmppActualV} V</span>
        </div>
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">I_mpp (Current)</span>
          <span className="font-mono text-sm font-bold text-sky-400">{imppActualA} A</span>
        </div>
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">V_oc (Open Ckt)</span>
          <span className="font-mono text-sm font-bold text-emerald-400">{vocActualV} V</span>
        </div>
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">I_sc (Short Ckt)</span>
          <span className="font-mono text-sm font-bold text-emerald-400">{iscActualA} A</span>
        </div>
        <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/60">
          <span className="text-slate-400 block text-[11px]">Fill Factor (FF)</span>
          <span className="font-mono text-sm font-bold text-violet-400">{(fillFactor * 100).toFixed(1)}%</span>
        </div>
      </div>

      {activePoint && (
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 flex items-center justify-around">
          <span>Target V: <strong className="text-slate-100">{activePoint.voltageV.toFixed(2)} V</strong></span>
          <span>Target I: <strong className="text-sky-300">{activePoint.currentA.toFixed(2)} A</strong></span>
          <span>Target P: <strong className="text-amber-300">{activePoint.powerW.toFixed(1)} W</strong></span>
        </div>
      )}
    </div>
  );
}
