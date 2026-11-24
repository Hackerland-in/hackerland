'use client';

import { useState } from 'react';
import type { PnpComponentPlacement, PnpPlacementSide } from '@hackerland/core';

interface PnpCentroidVisualizerProps {
  boardDimensions: { widthMm: number; heightMm: number };
  placements: PnpComponentPlacement[];
  projectName: string;
}

const PKG_COLORS: Record<string, string> = {
  qfp: '#3b82f6', // blue
  qfn: '#06b6d4', // cyan
  bga: '#8b5cf6', // purple
  soic: '#10b981', // emerald
  sot23: '#f59e0b', // amber
  '0402': '#64748b', // slate
  '0603': '#94a3b8', // slate lighter
  '0805': '#cbd5e1', // slate light
  through_hole: '#ec4899', // pink
  connector: '#f97316', // orange
};

export function PnpCentroidVisualizer({
  boardDimensions,
  placements,
}: PnpCentroidVisualizerProps) {
  const [activeSide, setActiveSide] = useState<PnpPlacementSide>('top');
  const [hoveredComponent, setHoveredComponent] = useState<PnpComponentPlacement | null>(null);

  const filteredPlacements = placements.filter((p) => p.side === activeSide);

  // SVG Coordinate mapping: Board dimensions with padding
  const padding = 10;
  const svgWidth = boardDimensions.widthMm + padding * 2;
  const svgHeight = boardDimensions.heightMm + padding * 2;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            Interactive Centroid SMT Canvas
          </span>
          <h3 className="text-base font-bold text-foreground mt-0.5">
            Pick-and-Place Machine Placement Map
          </h3>
        </div>

        {/* Side Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/60 border border-border">
          <button
            type="button"
            onClick={() => {
              setActiveSide('top');
              setHoveredComponent(null);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeSide === 'top'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Top Side ({placements.filter((p) => p.side === 'top').length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSide('bottom');
              setHoveredComponent(null);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeSide === 'bottom'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bottom Side ({placements.filter((p) => p.side === 'bottom').length})
          </button>
        </div>
      </div>

      {/* 2D Board Rendering */}
      <div className="relative flex items-center justify-center p-4 bg-background/80 rounded-xl border border-border/80 min-h-[320px] overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-h-[360px] w-auto max-w-full drop-shadow-md select-none transition-transform"
        >
          {/* PCB Substrate Outline */}
          <rect
            x={padding}
            y={padding}
            width={boardDimensions.widthMm}
            height={boardDimensions.heightMm}
            rx={2}
            className="fill-emerald-950/40 stroke-emerald-500/60"
            strokeWidth={0.8}
          />

          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding + boardDimensions.heightMm / 2}
            x2={padding + boardDimensions.widthMm}
            y2={padding + boardDimensions.heightMm / 2}
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth={0.4}
            strokeDasharray="2,2"
          />
          <line
            x1={padding + boardDimensions.widthMm / 2}
            y1={padding}
            x2={padding + boardDimensions.widthMm / 2}
            y2={padding + boardDimensions.heightMm}
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth={0.4}
            strokeDasharray="2,2"
          />

          {/* Placed Components */}
          {filteredPlacements.map((p) => {
            const cx = padding + p.posX;
            // Invert Y so 0 is bottom-left as standard in EDA centroid files
            const cy = padding + (boardDimensions.heightMm - p.posY);
            const isHovered = hoveredComponent?.designator === p.designator;
            const color = PKG_COLORS[p.pkg] || '#38bdf8';

            let compWidth = 3;
            let compHeight = 2;
            if (p.pkg === 'qfp') {
              compWidth = 10;
              compHeight = 10;
            } else if (p.pkg === 'bga') {
              compWidth = 12;
              compHeight = 12;
            } else if (p.pkg === 'qfn') {
              compWidth = 6;
              compHeight = 6;
            } else if (p.pkg === 'soic') {
              compWidth = 6;
              compHeight = 5;
            } else if (p.pkg === 'connector') {
              compWidth = 12;
              compHeight = 4;
            } else if (p.pkg === 'through_hole') {
              compWidth = 8;
              compHeight = 8;
            } else if (p.pkg === '0402') {
              compWidth = 1.6;
              compHeight = 1.0;
            } else if (p.pkg === '0603') {
              compWidth = 2.4;
              compHeight = 1.4;
            } else if (p.pkg === '0805') {
              compWidth = 3.2;
              compHeight = 1.8;
            }

            return (
              <g
                key={p.designator}
                transform={`rotate(${p.rotation}, ${cx}, ${cy})`}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredComponent(p)}
                onMouseLeave={() => setHoveredComponent(null)}
              >
                <rect
                  x={cx - compWidth / 2}
                  y={cy - compHeight / 2}
                  width={compWidth}
                  height={compHeight}
                  rx={0.3}
                  fill={color}
                  opacity={isHovered ? 1 : 0.85}
                  stroke={isHovered ? '#ffffff' : color}
                  strokeWidth={isHovered ? 0.8 : 0.3}
                />
                {compWidth >= 4 && (
                  <text
                    x={cx}
                    y={cy + 0.8}
                    textAnchor="middle"
                    fontSize={1.8}
                    fill="#ffffff"
                    fontFamily="monospace"
                    className="font-bold pointer-events-none select-none"
                  >
                    {p.designator}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hovered Component Tooltip Overlay */}
        {hoveredComponent && (
          <div className="absolute bottom-3 left-3 bg-card/95 border border-primary/40 rounded-lg p-2.5 shadow-xl font-mono text-[11px] space-y-0.5 backdrop-blur-md pointer-events-none animate-in fade-in duration-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">{hoveredComponent.designator}</span>
              <span className="text-foreground">{hoveredComponent.val}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-3 text-[10px]">
              <span>Pkg: {hoveredComponent.pkg.toUpperCase()}</span>
              <span>X: {hoveredComponent.posX.toFixed(1)}mm</span>
              <span>Y: {hoveredComponent.posY.toFixed(1)}mm</span>
              <span>Rot: {hoveredComponent.rotation}°</span>
            </div>
          </div>
        )}
      </div>

      {/* Package Legend & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(PKG_COLORS).map(([pkg, color]) => (
            <div key={pkg} className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground uppercase">{pkg}</span>
            </div>
          ))}
        </div>
        <span className="font-mono text-muted-foreground text-[11px]">
          Dimensions: {boardDimensions.widthMm} x {boardDimensions.heightMm} mm
        </span>
      </div>
    </div>
  );
}
