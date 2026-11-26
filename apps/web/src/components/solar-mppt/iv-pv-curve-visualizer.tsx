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

  const svgWidth = 620;
  const svgHeight = 360;
  const pad = { top: 35, right: 60, bottom: 50, left: 60 };
  const plotWidth = svgWidth - pad.left - pad.right;
  const plotHeight = svgHeight - pad.top - pad.bottom;

  const maxV = Math.max(vocActualV * 1.08, 10);
  const maxI = Math.max(iscActualA * 1.15, 1);
  const maxP = Math.max(pmppActualW * 1.15, 10);

  const toX = (v: number) => pad.left + (v / maxV) * plotWidth;
  const toYCurrent = (i: number) => pad.top + plotHeight - (i / maxI) * plotHeight;
  const toYPower = (p: number) => pad.top + plotHeight - (p / maxP) * plotHeight;

  const ivPointsString = ivCurve
    .map((pt) => `${toX(pt.voltageV).toFixed(1)},${toYCurrent(pt.currentA).toFixed(1)}`)
    .join(' ');

  const pvPointsString = pvCurve
    .map((pt) => `${toX(pt.voltageV).toFixed(1)},${toYPower(pt.powerW).toFixed(1)}`)
    .join(' ');

  const mppSvgX = toX(vmppActualV);
  const mppSvgYCurrent = toYCurrent(imppActualA);
  const mppSvgYPower = toYPower(pmppActualW);

  const activePoint = hoveredIdx !== null && ivCurve[hoveredIdx] ? ivCurve[hoveredIdx] : null;

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs text-fg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-accent-fg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Simulated Single-Diode I-V (Amperes) and P-V (Watts) response with MPP point
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-600 inline-block" />
            <span className="text-sky-700 font-mono font-semibold">I-V Curve (A)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-accent inline-block" />
            <span className="text-accent-fg font-mono font-semibold">P-V Curve (W)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-sunken rounded-xl p-2.5 border border-hairline">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[500px] select-none">
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = pad.top + plotHeight * frac;
            const x = pad.left + plotWidth * frac;
            return (
              <g key={`grid-${idx}`}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={pad.left + plotWidth}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3,3"
                  strokeWidth="0.9"
                />
                <line
                  x1={x}
                  y1={pad.top}
                  x2={x}
                  y2={pad.top + plotHeight}
                  stroke="#E2E8F0"
                  strokeDasharray="3,3"
                  strokeWidth="0.9"
                />
              </g>
            );
          })}

          <line
            x1={pad.left}
            y1={pad.top + plotHeight}
            x2={pad.left + plotWidth}
            y2={pad.top + plotHeight}
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          <line
            x1={pad.left}
            y1={pad.top}
            x2={pad.left}
            y2={pad.top + plotHeight}
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <line
            x1={pad.left + plotWidth}
            y1={pad.top}
            x2={pad.left + plotWidth}
            y2={pad.top + plotHeight}
            stroke="#FA1681"
            strokeWidth="1.5"
          />

          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const v = (frac * maxV).toFixed(1);
            const x = pad.left + frac * plotWidth;
            return (
              <text
                key={`xtick-${idx}`}
                x={x}
                y={pad.top + plotHeight + 18}
                textAnchor="middle"
                fill="#475569"
                className="text-[10px] font-mono"
              >
                {v}V
              </text>
            );
          })}
          <text
            x={pad.left + plotWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            fill="#334155"
            className="text-[11px] font-medium"
          >
            Array Voltage (V)
          </text>

          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const currentVal = ((1 - frac) * maxI).toFixed(1);
            const y = pad.top + frac * plotHeight;
            return (
              <text
                key={`ytick-l-${idx}`}
                x={pad.left - 8}
                y={y + 3}
                textAnchor="end"
                fill="#0369A1"
                className="text-[10px] font-mono"
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
            fill="#0369A1"
            className="text-[11px] font-medium"
          >
            Current (A)
          </text>

          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const powerVal = Math.round((1 - frac) * maxP);
            const y = pad.top + frac * plotHeight;
            return (
              <text
                key={`ytick-r-${idx}`}
                x={pad.left + plotWidth + 8}
                y={y + 3}
                textAnchor="start"
                fill="#D10D69"
                className="text-[10px] font-mono"
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
            fill="#D10D69"
            className="text-[11px] font-medium"
          >
            Power (W)
          </text>

          <polyline
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={ivPointsString}
          />

          <polyline
            fill="none"
            stroke="#FA1681"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pvPointsString}
          />

          <line
            x1={mppSvgX}
            y1={pad.top}
            x2={mppSvgX}
            y2={pad.top + plotHeight}
            stroke="#FA1681"
            strokeDasharray="4,3"
            strokeWidth="1.2"
          />
          <line
            x1={pad.left}
            y1={mppSvgYPower}
            x2={pad.left + plotWidth}
            y2={mppSvgYPower}
            stroke="#FA1681"
            strokeDasharray="4,3"
            strokeWidth="0.9"
          />

          <circle
            cx={mppSvgX}
            cy={mppSvgYPower}
            r="5"
            fill="#FA1681"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          <circle
            cx={mppSvgX}
            cy={mppSvgYCurrent}
            r="4.5"
            fill="#0284C7"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          <g transform={`translate(${mppSvgX > pad.left + plotWidth - 110 ? mppSvgX - 110 : mppSvgX + 8}, ${mppSvgYPower - 24})`}>
            <rect
              width="100"
              height="20"
              rx="4"
              fill="#FFFFFF"
              stroke="#FA1681"
              strokeWidth="1.2"
            />
            <text
              x="50"
              y="14"
              textAnchor="middle"
              fill="#D10D69"
              className="text-[10px] font-mono font-bold"
            >
              MPP: {pmppActualW}W
            </text>
          </g>

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

          {activePoint && (
            <g>
              <line
                x1={toX(activePoint.voltageV)}
                y1={pad.top}
                x2={toX(activePoint.voltageV)}
                y2={pad.top + plotHeight}
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <circle
                cx={toX(activePoint.voltageV)}
                cy={toYCurrent(activePoint.currentA)}
                r="4"
                fill="#0284C7"
              />
              <circle
                cx={toX(activePoint.voltageV)}
                cy={toYPower(activePoint.powerW)}
                r="4"
                fill="#FA1681"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        <div className="bg-sunken rounded-xl p-2.5 border border-hairline">
          <span className="text-fg-subtle block text-[11px]">P_mpp (Power)</span>
          <span className="font-mono text-sm font-bold text-accent-fg">{pmppActualW} W</span>
        </div>
        <div className="bg-sunken rounded-xl p-2.5 border border-hairline">
          <span className="text-fg-subtle block text-[11px]">V_mpp (Voltage)</span>
          <span className="font-mono text-sm font-bold text-amber-700">{vmppActualV} V</span>
        </div>
        <div className="bg-sunken rounded-xl p-2.5 border border-hairline">
          <span className="text-fg-subtle block text-[11px]">I_mpp (Current)</span>
          <span className="font-mono text-sm font-bold text-sky-700">{imppActualA} A</span>
        </div>
        <div className="bg-sunken rounded-xl p-2.5 border border-hairline">
          <span className="text-fg-subtle block text-[11px]">V_oc (Open Ckt)</span>
          <span className="font-mono text-sm font-bold text-emerald-700">{vocActualV} V</span>
        </div>
        <div className="bg-sunken rounded-xl p-2.5 border border-hairline">
          <span className="text-fg-subtle block text-[11px]">I_sc (Short Ckt)</span>
          <span className="font-mono text-sm font-bold text-emerald-700">{iscActualA} A</span>
        </div>
        <div className="bg-sunken rounded-xl p-2.5 border border-hairline">
          <span className="text-fg-subtle block text-[11px]">Fill Factor (FF)</span>
          <span className="font-mono text-sm font-bold text-violet-700">{(fillFactor * 100).toFixed(1)}%</span>
        </div>
      </div>

      {activePoint && (
        <div className="bg-sunken p-2.5 rounded-xl border border-hairline font-mono text-xs text-fg flex items-center justify-around">
          <span>Target V: <strong>{activePoint.voltageV.toFixed(2)} V</strong></span>
          <span>Target I: <strong className="text-sky-700">{activePoint.currentA.toFixed(2)} A</strong></span>
          <span>Target P: <strong className="text-accent-fg">{activePoint.powerW.toFixed(1)} W</strong></span>
        </div>
      )}
    </div>
  );
}
