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
  const size = 380;
  const center = size / 2;
  const radius = 135;
  const inscribedRadius = radius * Math.cos(Math.PI / 6);

  const vectors = [
    { name: 'V1 (100)', angleDeg: 0, rad: 0 },
    { name: 'V2 (110)', angleDeg: 60, rad: Math.PI / 3 },
    { name: 'V3 (010)', angleDeg: 120, rad: (2 * Math.PI) / 3 },
    { name: 'V4 (011)', angleDeg: 180, rad: Math.PI },
    { name: 'V5 (001)', angleDeg: 240, rad: (4 * Math.PI) / 3 },
    { name: 'V6 (101)', angleDeg: 300, rad: (5 * Math.PI) / 3 },
  ];

  const vertices = vectors.map((v) => ({
    x: center + radius * Math.cos(v.rad),
    y: center - radius * Math.sin(v.rad),
  }));

  const hexagonPoints = vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

  const sectorMidDeg = (currentSector - 1) * 60 + 30;
  const refRad = (sectorMidDeg * Math.PI) / 180;
  const refMagnitude = Math.min(1.15, modulationIndex) * inscribedRadius;
  const refX = center + refMagnitude * Math.cos(refRad);
  const refY = center - refMagnitude * Math.sin(refRad);

  const totalDwellUs = dwellTimeT1Us + dwellTimeT2Us + dwellTimeT0Us || 50;
  const t1Percent = Math.min(100, Math.round((dwellTimeT1Us / totalDwellUs) * 100));
  const t2Percent = Math.min(100, Math.round((dwellTimeT2Us / totalDwellUs) * 100));
  const t0Percent = Math.max(0, 100 - t1Percent - t2Percent);

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
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs text-fg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-accent-fg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            {title}
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Active 8-state switching sectors and reference voltage synthesis V_ref
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-accent-soft text-accent-fg border border-accent/25 font-semibold">
            Sector {currentSector}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            m = {modulationIndex.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* SVG Hexagon Visualizer (7 cols) */}
        <div className="md:col-span-7 flex justify-center bg-sunken rounded-xl p-3 border border-hairline">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] h-auto select-none">
            {[1, 2, 3, 4, 5, 6].map((sec) => {
              const vStart = vertices[sec - 1]!;
              const vEnd = vertices[sec % 6]!;
              const isSelected = sec === currentSector;
              return (
                <polygon
                  key={`sec-wedge-${sec}`}
                  points={`${center},${center} ${vStart.x},${vStart.y} ${vEnd.x},${vEnd.y}`}
                  fill={isSelected ? 'rgba(250, 22, 129, 0.14)' : '#ffffff'}
                  stroke={isSelected ? '#FA1681' : '#E2E8F0'}
                  strokeWidth={isSelected ? '2' : '1'}
                />
              );
            })}

            <circle
              cx={center}
              cy={center}
              r={inscribedRadius}
              fill="none"
              stroke="#0284C7"
              strokeDasharray="4,4"
              strokeWidth="1.2"
            />

            <polygon
              points={hexagonPoints}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.75"
            />

            <line
              x1={center - radius - 15}
              y1={center}
              x2={center + radius + 15}
              y2={center}
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <line
              x1={center}
              y1={center - radius - 15}
              x2={center}
              y2={center + radius + 15}
              stroke="#CBD5E1"
              strokeWidth="1"
            />

            {vectors.map((v, idx) => {
              const pt = vertices[idx]!;
              const labelRadius = radius + 22;
              const labelX = center + labelRadius * Math.cos(v.rad);
              const labelY = center - labelRadius * Math.sin(v.rad);

              return (
                <g key={v.name}>
                  <line
                    x1={center}
                    y1={center}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#94A3B8"
                    strokeWidth="1.25"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    x={labelX}
                    y={labelY + 4}
                    textAnchor="middle"
                    fill="#334155"
                    className="text-[10px] font-mono font-bold"
                  >
                    {v.name}
                  </text>
                </g>
              );
            })}

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
                  fill={isSelected ? '#D10D69' : '#64748B'}
                  className="text-[11px] font-mono font-bold"
                >
                  Sec {sec}
                </text>
              );
            })}

            <circle cx={center} cy={center} r="5" fill="#D97706" />
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              fill="#B45309"
              className="text-[9px] font-mono font-semibold"
            >
              V0/V7
            </text>

            <line
              x1={center}
              y1={center}
              x2={refX}
              y2={refY}
              stroke="#FA1681"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx={refX}
              cy={refY}
              r="5.5"
              fill="#FA1681"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            <text
              x={center + inscribedRadius - 8}
              y={center - 8}
              fill="#0369A1"
              className="text-[9px] font-mono font-semibold"
            >
              V_max (Vdc/√3)
            </text>
          </svg>
        </div>

        {/* Dwell Times & Switching Sequence (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-3 font-mono text-xs">
          <div className="bg-sunken p-3.5 rounded-xl border border-hairline space-y-2.5">
            <span className="text-fg-subtle text-[11px] block uppercase tracking-wider font-semibold">
              SVPWM Dwell Times (PWM Period)
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-sky-700 font-semibold">T1 ({currentSectorInfo.vAlpha}):</span>
                <span className="font-bold text-fg">{dwellTimeT1Us} μs ({t1Percent}%)</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-hairline">
                <div className="bg-sky-500 h-full" style={{ width: `${t1Percent}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-accent-fg font-semibold">T2 ({currentSectorInfo.vBeta}):</span>
                <span className="font-bold text-fg">{dwellTimeT2Us} μs ({t2Percent}%)</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-hairline">
                <div className="bg-accent h-full" style={{ width: `${t2Percent}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-700 font-semibold">T0 / T7 (Zero Vectors):</span>
                <span className="font-bold text-fg">{dwellTimeT0Us} μs ({t0Percent}%)</span>
              </div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-hairline">
                <div className="bg-amber-500 h-full" style={{ width: `${t0Percent}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-sunken p-3.5 rounded-xl border border-hairline space-y-1">
            <span className="text-fg-subtle text-[11px] block uppercase tracking-wider font-semibold">
              7-Segment Center-Aligned Pattern
            </span>
            <div className="text-[11px] text-accent-fg font-bold break-words">
              {currentSectorInfo.pattern}
            </div>
            <p className="text-[10px] text-fg-subtle pt-1 leading-relaxed">
              Guarantees single MOSFET state transition per step, cutting inverter switching loss by 33% vs sine PWM.
            </p>
          </div>

          <div className="bg-sunken p-3.5 rounded-xl border border-hairline flex justify-between items-center text-[11px]">
            <span className="text-fg-muted">Max Linear Voltage:</span>
            <span className="text-sky-700 font-bold">
              {(dcBusVoltageV / Math.sqrt(3)).toFixed(1)} Vrms ({dcBusVoltageV}V DC Bus)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
