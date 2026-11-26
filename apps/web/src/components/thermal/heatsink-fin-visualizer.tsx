'use client';

import type { CoolingMethod, HeatsinkMaterial } from '@hackerland/core';

interface HeatsinkFinVisualizerProps {
  widthMm: number;
  lengthMm: number;
  baseThicknessMm: number;
  finHeightMm: number;
  finThicknessMm: number;
  numberOfFins: number;
  material: HeatsinkMaterial;
  coolingMethod: CoolingMethod;
  finEfficiencyPercent: number;
  totalSurfaceAreaCm2: number;
  heatTransferCoefficient: number;
}

export function HeatsinkFinVisualizer({
  widthMm,
  lengthMm,
  baseThicknessMm,
  finHeightMm,
  finThicknessMm,
  numberOfFins,
  material,
  coolingMethod,
  finEfficiencyPercent,
  totalSurfaceAreaCm2,
  heatTransferCoefficient,
}: HeatsinkFinVisualizerProps) {
  const svgWidth = 560;
  const svgHeight = 220;
  const padX = 40;
  const baseY = 175;
  const drawWidth = svgWidth - 2 * padX;

  const maxVisualHeight = 110;
  const maxFinH = Math.max(10, finHeightMm);
  const visualFinHeight = Math.min(maxVisualHeight, Math.max(30, (finHeightMm / maxFinH) * 85));
  const visualBaseThickness = Math.max(8, Math.min(24, baseThicknessMm * 1.5));
  const finTopY = baseY - visualBaseThickness - visualFinHeight;

  const clampedFins = Math.min(32, Math.max(3, numberOfFins));
  const finGap = (drawWidth - clampedFins * 6) / (clampedFins - 1);

  const isCopper = material === 'copper_c11000';
  const finColor = isCopper ? '#d97706' : '#94a3b8';
  const finStroke = isCopper ? '#b45309' : '#64748b';
  const baseFill = isCopper ? '#b45309' : '#64748b';

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-4 shadow-xs text-fg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-accent-fg">
            Heat Sink Cross-Section &amp; Boundary Layer Convection
          </span>
          <p className="text-xs text-fg-muted mt-0.5">
            {widthMm}mm (W) × {lengthMm}mm (L) · {numberOfFins} Fins ({material.replace(/_/g, ' ')})
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-fg-muted">h =</span>
          <span className="text-sky-700 font-bold">{heatTransferCoefficient} W/m²·K</span>
        </div>
      </div>

      <div className="w-full bg-sunken rounded-xl p-3 border border-hairline flex items-center justify-center select-none overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[540px] min-w-[440px] text-xs font-mono">
          {coolingMethod !== 'natural_convection' ? (
            <g opacity="0.85">
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={padX + 20 + i * 65}
                    y1={finTopY - 15}
                    x2={padX + 50 + i * 65}
                    y2={finTopY - 15}
                    stroke="#0284C7"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <polygon
                    points={`${padX + 53 + i * 65},${finTopY - 15} ${padX + 46 + i * 65},${finTopY - 18} ${padX + 46 + i * 65},${finTopY - 12}`}
                    fill="#0284C7"
                  />
                </g>
              ))}
              <text x={padX} y={finTopY - 22} fill="#0369A1" fontSize="10" fontWeight="bold">
                Forced Airflow Vector (CFM Duct)
              </text>
            </g>
          ) : (
            <g opacity="0.8">
              {Array.from({ length: 6 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={padX + 35 + i * 75}
                    y1={baseY - visualBaseThickness - 10}
                    x2={padX + 35 + i * 75}
                    y2={finTopY - 15}
                    stroke="#059669"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <polygon
                    points={`${padX + 35 + i * 75},${finTopY - 18} ${padX + 32 + i * 75},${finTopY - 11} ${padX + 38 + i * 75},${finTopY - 11}`}
                    fill="#059669"
                  />
                </g>
              ))}
              <text x={svgWidth / 2} y={finTopY - 22} textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                Natural Convection (Laminar Buoyancy Plume)
              </text>
            </g>
          )}

          {/* Solid Base Plate */}
          <rect
            x={padX}
            y={baseY - visualBaseThickness}
            width={drawWidth}
            height={visualBaseThickness}
            fill={baseFill}
            stroke={finStroke}
            strokeWidth="1.5"
          />

          {/* Extruded Fins Array */}
          {Array.from({ length: clampedFins }).map((_, i) => {
            const finX = padX + i * (6 + finGap);
            return (
              <rect
                key={i}
                x={finX}
                y={finTopY}
                width="6"
                height={visualFinHeight}
                fill={finColor}
                stroke={finStroke}
                strokeWidth="1"
              />
            );
          })}

          <line x1={padX - 8} y1={baseY - visualBaseThickness} x2={padX - 8} y2={baseY} stroke="#64748B" strokeWidth="1" />
          <text x={padX - 12} y={baseY - visualBaseThickness / 2 + 3} fill="#475569" fontSize="9" textAnchor="end">
            t_b={baseThicknessMm}mm
          </text>

          <line x1={svgWidth - padX + 8} y1={finTopY} x2={svgWidth - padX + 8} y2={baseY - visualBaseThickness} stroke="#64748B" strokeWidth="1" />
          <polygon points={`${svgWidth - padX + 8},${finTopY} ${svgWidth - padX + 5},${finTopY + 5} ${svgWidth - padX + 11},${finTopY + 5}`} fill="#64748B" />
          <polygon points={`${svgWidth - padX + 8},${baseY - visualBaseThickness} ${svgWidth - padX + 5},${baseY - visualBaseThickness - 5} ${svgWidth - padX + 11},${baseY - visualBaseThickness - 5}`} fill="#64748B" />
          <text x={svgWidth - padX + 14} y={finTopY + visualFinHeight / 2 + 3} fill="#475569" fontSize="9">
            H_fin={finHeightMm}mm
          </text>

          <line x1={padX} y1={baseY + 12} x2={padX + drawWidth} y2={baseY + 12} stroke="#94A3B8" strokeWidth="1" />
          <text x={svgWidth / 2} y={baseY + 25} textAnchor="middle" fill="#475569" fontSize="10">
            Width W = {widthMm} mm (Length L = {lengthMm} mm, Fin t = {finThicknessMm} mm)
          </text>

          {/* Heat Source Footprint */}
          <rect
            x={svgWidth / 2 - 42}
            y={baseY}
            width="84"
            height="10"
            rx="2"
            fill="#FA1681"
            stroke="#D10D69"
            strokeWidth="1"
          />
          <text x={svgWidth / 2} y={baseY + 7.5} textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
            Heat Source (TIM)
          </text>
        </svg>
      </div>

      {/* Fin Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-sunken p-3 rounded-xl border border-hairline">
          <span className="text-[10px] text-fg-subtle uppercase block">Fin Efficiency (η_fin)</span>
          <span className="text-base font-bold text-emerald-700 mt-0.5 block">{finEfficiencyPercent}%</span>
          <span className="text-[10px] text-fg-subtle block">tanh(mLc) / mLc</span>
        </div>

        <div className="bg-sunken p-3 rounded-xl border border-hairline">
          <span className="text-[10px] text-fg-subtle uppercase block">Total Surface Area</span>
          <span className="text-base font-bold text-fg mt-0.5 block">{totalSurfaceAreaCm2} cm²</span>
          <span className="text-[10px] text-fg-subtle block">Base + fin channel walls</span>
        </div>

        <div className="bg-sunken p-3 rounded-xl border border-hairline col-span-2 sm:col-span-1">
          <span className="text-[10px] text-fg-subtle uppercase block">Convection Mode</span>
          <span className="text-base font-bold text-sky-700 mt-0.5 block capitalize">
            {coolingMethod.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] text-fg-subtle block">h = {heatTransferCoefficient} W/m²·K</span>
        </div>
      </div>
    </div>
  );
}
