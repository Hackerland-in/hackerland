'use client';

import React from 'react';

interface SvpwmHexagonVisualizerProps {
  currentSector: 1 | 2 | 3 | 4 | 5 | 6 | number;
  modulationIndex: number;
  dwellTimeT1Us: number;
  dwellTimeT2Us: number;
  dwellTimeT0Us: number;
  dcBusVoltageV: number;
  title?: string;
}

export function SvpwmHexagonVisualizer({
  currentSector,
  modulationIndex,
  dwellTimeT1Us,
  dwellTimeT2Us,
  dwellTimeT0Us,
  dcBusVoltageV,
  title = 'Space Vector PWM (SVPWM) Voltage Hexagon',
}: SvpwmHexagonVisualizerProps) {
  // SVG dimensions
  const size = 380;
  const center = size / 2;
  const radius = 135; // Hexagon radius
  const inscribedRadius = radius * Math.cos(Math.PI / 6); // Max linear modulation circle = R * sqrt(3)/2

  // 6 Active Voltage Vectors at 0, 60, 120, 180, 240, 300 degrees
  const vectors = [
    { name: 'V1 (100)', angleDeg: 0, rad: 0 },
    { name: 'V2 (110)', angleDeg: 60, rad: Math.PI / 3 },
    { name: 'V3 (010)', angleDeg: 120, rad: (2 * Math.PI) / 3 },
    { name: 'V4 (011)', angleDeg: 180, rad: Math.PI },
    { name: 'V5 (001)', angleDeg: 240, rad: (4 * Math.PI) / 3 },
    { name: 'V6 (101)', angleDeg: 300, rad: (5 * Math.PI) / 3 },
  ];

  // Coordinates of the 6 vertices
  const vertices = vectors.map((v) => ({
    x: center + radius * Math.cos(v.rad),
    y: center - radius * Math.sin(v.rad),
  }));

  const hexagonPoints = vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

  // Reference Vector Angle based on currentSector
  // Sector 1: 0 to 60 deg -> Midpoint 30 deg
  const sectorMidDeg = (currentSector - 1) * 60 + 30;
  const refRad = (sectorMidDeg * Math.PI) / 180;
  const refMagnitude = Math.min(1.15, modulationIndex) * inscribedRadius;
  const refX = center + refMagnitude * Math.cos(refRad);
  const refY = center - refMagnitude * Math.sin(refRad);

  // Total PWM period
  const totalDwellUs = dwellTimeT1Us + dwellTimeT2Us + dwellTimeT0Us || 50;
  const t1Percent = Math.min(100, Math.round((dwellTimeT1Us / totalDwellUs) * 100));
  const t2Percent = Math.min(100, Math.round((dwellTimeT2Us / totalDwellUs) * 100));
  const t0Percent = Math.max(0, 100 - t1Percent - t2Percent);

  // Switching States for each sector
  const sectorSwitchingStates = {
    1: { vAlpha: 'V1(100)', vBeta: 'V2(110)', pattern: '000 → 100 → 110 → 111 → 110 → 100 → 000' },
    2: { vAlpha: 'V2(110)', vBeta: 'V3(010)', pattern: '000 → 010 → 110 → 111 → 110 → 010 → 000' },
    3: { vAlpha: 'V3(010)', vBeta: 'V4(011)', pattern: '000 → 010 → 011 → 111 → 011 → 010 → 000' },
    4: { vAlpha: 'V4(011)', vBeta: 'V5(001)', pattern: '000 → 001 → 011 → 111 → 011 → 001 → 000' },
    5: { vAlpha: 'V5(001)', vBeta: 'V6(101)', pattern: '000 → 001 → 101 → 111 → 101 → 001 → 000' },
    6: { vAlpha: 'V6(101)', vBeta: 'V1(100)', pattern: '000 → 100 → 101 → 111 → 101 → 100 → 000' },
  };

  const secKey = (currentSector >= 1 && currentSector <= 6 ? Math.round(currentSector) : 1) as 1 | 2 | 3 | 4 | 5 | 6;
  const currentSectorInfo = sectorSwitchingStates[secKey];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">
            Active 8-state switching sectors and reference voltage synthesis $\vec{'{'}V{'}'}_{'{'}ref{'}'}$
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Sector {currentSector}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            m = {modulationIndex.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* SVG Hexagon Visualizer (7 cols) */}
        <div className="md:col-span-7 flex justify-center bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] h-auto select-none">
            {/* Sector Background Wedges */}
            {[1, 2, 3, 4, 5, 6].map((sec) => {
              const vStart = vertices[sec - 1]!;
              const vEnd = vertices[sec % 6]!;
              const isSelected = sec === currentSector;
              return (
                <polygon
                  key={`sec-wedge-${sec}`}
                  points={`${center},${center} ${vStart.x},${vStart.y} ${vEnd.x},${vEnd.y}`}
                  className={
                    isSelected
                      ? 'fill-emerald-500/25 stroke-emerald-400'
                      : 'fill-slate-900/60 stroke-slate-800/80'
                  }
                  strokeWidth={isSelected ? '2' : '1'}
                />
              );
            })}

            {/* Inscribed Maximum Linear Modulation Circle */}
            <circle
              cx={center}
              cy={center}
              r={inscribedRadius}
              fill="none"
              stroke="#38bdf8"
              strokeDasharray="4,4"
              strokeWidth="1.2"
            />

            {/* Outer Hexagon Outline */}
            <polygon
              points={hexagonPoints}
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Axes */}
            <line
              x1={center - radius - 15}
              y1={center}
              x2={center + radius + 15}
              y2={center}
              stroke="#475569"
              strokeWidth="1"
            />
            <line
              x1={center}
              y1={center - radius - 15}
              x2={center}
              y2={center + radius + 15}
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Vector Spokes and Labels */}
            {vectors.map((v, idx) => {
              const pt = vertices[idx]!;
              const labelRadius = radius + 22;
              const labelX = center + labelRadius * Math.cos(v.rad);
              const labelY = center - labelRadius * Math.sin(v.rad);

              return (
                <g key={v.name}>
                  {/* Spoke */}
                  <line
                    x1={center}
                    y1={center}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  {/* Vertex Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#38bdf8"
                    className="stroke-slate-900"
                    strokeWidth="1.5"
                  />
                  {/* Vector Name Label */}
                  <text
                    x={labelX}
                    y={labelY + 4}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-300 font-mono font-bold"
                  >
                    {v.name}
                  </text>
                </g>
              );
            })}

            {/* Sector Numbers */}
            {[1, 2, 3, 4, 5, 6].map((sec) => {
              const secAngleRad = ((sec - 1) * 60 + 30) * (Math.PI / 180);
              const secR = radius * 0.62;
              const sx = center + secR * Math.cos(secAngleRad);
              const sy = center - secR * Math.sin(secAngleRad);
              const isSelected = sec === currentSector;
              return (
                <text
                  key={`sec-num-${sec}`}
                  x={sx}
                  y={sy + 4}
                  textAnchor="middle"
                  className={`text-[12px] font-mono font-bold ${
                    isSelected ? 'fill-emerald-300' : 'fill-slate-500'
                  }`}
                >
                  Sec {sec}
                </text>
              );
            })}

            {/* Origin (Zero Vectors V0(000) & V7(111)) */}
            <circle cx={center} cy={center} r="5" fill="#f59e0b" />
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              className="text-[9px] fill-amber-400 font-mono"
            >
              V0/V7
            </text>

            {/* Reference Voltage Vector V_ref */}
            <line
              x1={center}
              y1={center}
              x2={refX}
              y2={refY}
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx={refX}
              cy={refY}
              r="5.5"
              fill="#10b981"
              className="stroke-slate-900"
              strokeWidth="2"
            />

            {/* Inscribed limit text */}
            <text
              x={center + inscribedRadius - 8}
              y={center - 8}
              className="text-[9px] fill-sky-400 font-mono"
            >
              V_max (Vdc/√3)
            </text>
          </svg>
        </div>

        {/* Dwell Times & Switching Sequence (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-3 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] block uppercase tracking-wider">
              SVPWM Dwell Times (PWM Period)
            </span>

            {/* T1 Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-sky-300">T1 ({currentSectorInfo.vAlpha}):</span>
                <span className="font-bold">{dwellTimeT1Us} μs ({t1Percent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div className="bg-sky-400 h-full" style={{ width: `${t1Percent}%` }} />
              </div>
            </div>

            {/* T2 Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-300">T2 ({currentSectorInfo.vBeta}):</span>
                <span className="font-bold">{dwellTimeT2Us} μs ({t2Percent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${t2Percent}%` }} />
              </div>
            </div>

            {/* T0 Bar (Zero vector) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-300">T0 / T7 (Zero Vectors):</span>
                <span className="font-bold">{dwellTimeT0Us} μs ({t0Percent}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${t0Percent}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block uppercase tracking-wider">
              7-Segment Center-Aligned Pattern
            </span>
            <div className="text-[11px] text-emerald-400 font-bold break-words">
              {currentSectorInfo.pattern}
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Guarantees single MOSFET state transition per step, cutting inverter switching loss by 33% vs sine PWM.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Max Linear Voltage:</span>
            <span className="text-sky-300 font-bold">
              {(dcBusVoltageV / Math.sqrt(3)).toFixed(1)} Vrms ({dcBusVoltageV}V DC Bus)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
