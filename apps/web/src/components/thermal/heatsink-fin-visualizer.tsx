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
  // SVG drawing configuration
  const svgWidth = 560;
  const svgHeight = 220;
  const padX = 40;
  const baseY = 175;
  const drawWidth = svgWidth - 2 * padX;

  // Scale base thickness and fin height
  const maxVisualHeight = 110;
  const maxFinH = Math.max(10, finHeightMm);
  const visualFinHeight = Math.min(maxVisualHeight, Math.max(30, (finHeightMm / maxFinH) * 85));
  const visualBaseThickness = Math.max(8, Math.min(24, baseThicknessMm * 1.5));
  const finTopY = baseY - visualBaseThickness - visualFinHeight;

  // Render fin rects
  const clampedFins = Math.min(32, Math.max(3, numberOfFins));
  const finGap = (drawWidth - clampedFins * 6) / (clampedFins - 1);

  const isCopper = material === 'copper_c11000';
  const finColor = isCopper ? '#d97706' : '#64748b';
  const finStroke = isCopper ? '#b45309' : '#475569';
  const baseFill = isCopper ? '#b45309' : '#334155';

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-400">
            Heat Sink Cross-Section &amp; Boundary Layer Convection
          </span>
          <p className="text-xs text-stone-400 mt-0.5">
            {widthMm}mm (W) × {lengthMm}mm (L) · {numberOfFins} Fins ({material.replace(/_/g, ' ')})
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-stone-400">h =</span>
          <span className="text-cyan-400 font-bold">{heatTransferCoefficient} W/m²·K</span>
        </div>
      </div>

      <div className="w-full bg-stone-950 rounded-lg p-3 border border-stone-800 flex items-center justify-center select-none">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[540px] text-xs font-mono">
          {/* Airflow velocity vectors */}
          {coolingMethod !== 'natural_convection' ? (
            <g opacity="0.65">
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={padX + 20 + i * 65}
                    y1={finTopY - 15}
                    x2={padX + 50 + i * 65}
                    y2={finTopY - 15}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <polygon
                    points={`${padX + 53 + i * 65},${finTopY - 15} ${padX + 46 + i * 65},${finTopY - 18} ${padX + 46 + i * 65},${finTopY - 12}`}
                    fill="#38bdf8"
                  />
                </g>
              ))}
              <text x={padX} y={finTopY - 22} fill="#38bdf8" fontSize="10" fontWeight="bold">
                Forced Airflow Vector (CFM Duct)
              </text>
            </g>
          ) : (
            <g opacity="0.55">
              {/* Natural buoyancy vertical arrows */}
              {Array.from({ length: 6 }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={padX + 35 + i * 75}
                    y1={baseY - visualBaseThickness - 10}
                    x2={padX + 35 + i * 75}
                    y2={finTopY - 15}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <polygon
                    points={`${padX + 35 + i * 75},${finTopY - 18} ${padX + 32 + i * 75},${finTopY - 11} ${padX + 38 + i * 75},${finTopY - 11}`}
                    fill="#10b981"
                  />
                </g>
              ))}
              <text x={svgWidth / 2} y={finTopY - 22} textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">
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

          {/* Dimension Annotations */}
          {/* Base thickness */}
          <line x1={padX - 8} y1={baseY - visualBaseThickness} x2={padX - 8} y2={baseY} stroke="#94a3b8" strokeWidth="1" />
          <text x={padX - 12} y={baseY - visualBaseThickness / 2 + 3} fill="#94a3b8" fontSize="9" textAnchor="end">
            t_b={baseThicknessMm}mm
          </text>

          {/* Fin Height */}
          <line x1={svgWidth - padX + 8} y1={finTopY} x2={svgWidth - padX + 8} y2={baseY - visualBaseThickness} stroke="#94a3b8" strokeWidth="1" />
          <polygon points={`${svgWidth - padX + 8},${finTopY} ${svgWidth - padX + 5},${finTopY + 5} ${svgWidth - padX + 11},${finTopY + 5}`} fill="#94a3b8" />
          <polygon points={`${svgWidth - padX + 8},${baseY - visualBaseThickness} ${svgWidth - padX + 5},${baseY - visualBaseThickness - 5} ${svgWidth - padX + 11},${baseY - visualBaseThickness - 5}`} fill="#94a3b8" />
          <text x={svgWidth - padX + 14} y={finTopY + visualFinHeight / 2 + 3} fill="#94a3b8" fontSize="9">
            H_fin={finHeightMm}mm
          </text>

          {/* Width dimension */}
          <line x1={padX} y1={baseY + 12} x2={padX + drawWidth} y2={baseY + 12} stroke="#94a3b8" strokeWidth="1" />
          <text x={svgWidth / 2} y={baseY + 25} textAnchor="middle" fill="#94a3b8" fontSize="10">
            Width W = {widthMm} mm (Length L = {lengthMm} mm)
          </text>

          {/* Heat Source Footprint */}
          <rect
            x={svgWidth / 2 - 35}
            y={baseY}
            width="70"
            height="8"
            fill="#ef4444"
            stroke="#991b1b"
            strokeWidth="1"
          />
          <text x={svgWidth / 2} y={baseY + 7} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
            Heat Source (TIM)
          </text>
        </svg>
      </div>

      {/* Fin Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
          <span className="text-[10px] text-stone-500 uppercase block">Fin Efficiency (η_fin)</span>
          <span className="text-base font-bold text-emerald-400 mt-0.5 block">{finEfficiencyPercent}%</span>
          <span className="text-[10px] text-stone-500 block">tanh(mLc) / mLc</span>
        </div>

        <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800">
          <span className="text-[10px] text-stone-500 uppercase block">Total Surface Area</span>
          <span className="text-base font-bold text-stone-100 mt-0.5 block">{totalSurfaceAreaCm2} cm²</span>
          <span className="text-[10px] text-stone-500 block">Base + fin channel walls</span>
        </div>

        <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-stone-500 uppercase block">Convection Mode</span>
          <span className="text-base font-bold text-cyan-400 mt-0.5 block capitalize">
            {coolingMethod.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] text-stone-500 block">h = {heatTransferCoefficient} W/m²·K</span>
        </div>
      </div>
    </div>
  );
}
