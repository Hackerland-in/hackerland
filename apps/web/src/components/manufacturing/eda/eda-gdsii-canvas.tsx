'use client';

import { useState } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';
import type { EdaPreset, EdaStageId } from './eda-engine';

export interface EdaGdsiiCanvasProps {
  preset: EdaPreset;
  activeStage: EdaStageId;
}

export function EdaGdsiiCanvas({ preset, activeStage }: EdaGdsiiCanvasProps) {
  const [zoom, setZoom] = useState(1.4);
  const [layersVisible, setLayersVisible] = useState({
    dieBoundary: true,
    powerGrid: true,
    cells: true,
    metal1: true,
    metal2: true,
    pins: true,
  });

  const toggleLayer = (layerKey: keyof typeof layersVisible) => {
    setLayersVisible((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const scale = 2.4 * zoom;
  const svgWidth = preset.dieWidthUm * scale;
  const svgHeight = preset.dieHeightUm * scale;

  return (
    <div
      className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4 select-none"
      data-testid="eda-gdsii-canvas"
    >
      {/* Canvas Header & Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            KLayout Silicon Die & GDSII Mask Viewer ({preset.targetNode})
          </h3>
        </div>

        {/* Zoom & Reset Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-hairline bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
              className="p-1 rounded hover:bg-surface-3 text-fg-muted hover:text-fg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="px-2 font-mono text-caption text-fg font-semibold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
              className="p-1 rounded hover:bg-surface-3 text-fg-muted hover:text-fg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1.4)}
              className="p-1 ml-1 rounded hover:bg-surface-3 text-fg-muted hover:text-fg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Visibility Filters */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="text-fg-muted font-bold mr-1">LAYERS:</span>

        <button
          type="button"
          onClick={() => toggleLayer('dieBoundary')}
          className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            layersVisible.dieBoundary
              ? 'border-fg-muted/40 bg-surface-2 text-fg font-semibold'
              : 'border-hairline bg-surface-3/30 text-fg-subtle opacity-50'
          }`}
        >
          {layersVisible.dieBoundary ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          <span>Pad Ring & Core</span>
        </button>

        <button
          type="button"
          onClick={() => toggleLayer('powerGrid')}
          className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            layersVisible.powerGrid
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 font-semibold'
              : 'border-hairline bg-surface-3/30 text-fg-subtle opacity-50'
          }`}
        >
          {layersVisible.powerGrid ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          <span>VDD/VSS PDN Stripes</span>
        </button>

        <button
          type="button"
          onClick={() => toggleLayer('cells')}
          className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            layersVisible.cells
              ? 'border-accent/40 bg-accent/10 text-accent font-semibold'
              : 'border-hairline bg-surface-3/30 text-fg-subtle opacity-50'
          }`}
        >
          {layersVisible.cells ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          <span>Standard Cells ({preset.cells.length})</span>
        </button>

        <button
          type="button"
          onClick={() => toggleLayer('metal1')}
          className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            layersVisible.metal1
              ? 'border-blue-500/40 bg-blue-500/10 text-blue-500 font-semibold'
              : 'border-hairline bg-surface-3/30 text-fg-subtle opacity-50'
          }`}
        >
          {layersVisible.metal1 ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          <span>Metal 1 (M1)</span>
        </button>

        <button
          type="button"
          onClick={() => toggleLayer('metal2')}
          className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            layersVisible.metal2
              ? 'border-purple-500/40 bg-purple-500/10 text-purple-500 font-semibold'
              : 'border-hairline bg-surface-3/30 text-fg-subtle opacity-50'
          }`}
        >
          {layersVisible.metal2 ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
          <span>Metal 2 (M2)</span>
        </button>
      </div>

      {/* Interactive Silicon Canvas */}
      <div className="relative overflow-auto rounded-xl border border-hairline bg-surface-3/80 p-6 flex items-center justify-center min-h-[380px]">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${preset.dieWidthUm} ${preset.dieHeightUm}`}
          className="shadow-2xl rounded-sm transition-all bg-surface-2"
        >
          {/* Substrate Grid Pattern */}
          <defs>
            <pattern
              id="siliconGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <rect width="10" height="10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-hairline" />
            </pattern>
          </defs>
          <rect width={preset.dieWidthUm} height={preset.dieHeightUm} fill="url(#siliconGrid)" />

          {/* Die Boundary & Seal Ring */}
          {layersVisible.dieBoundary && (
            <g className="die-boundary">
              {/* Outer Seal Ring */}
              <rect
                x="1"
                y="1"
                width={preset.dieWidthUm - 2}
                height={preset.dieHeightUm - 2}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-fg-muted"
              />
              {/* Core Boundary Box */}
              <rect
                x="8"
                y="8"
                width={preset.dieWidthUm - 16}
                height={preset.dieHeightUm - 16}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="text-accent/60"
              />
              {/* I/O Pin Pads along periphery */}
              {Array.from({ length: 12 }).map((_, idx) => (
                <rect
                  key={`pad_top_${idx}`}
                  x={14 + idx * 11}
                  y="2"
                  width="7"
                  height="4"
                  fill="currentColor"
                  className="text-amber-500/80"
                />
              ))}
              {Array.from({ length: 12 }).map((_, idx) => (
                <rect
                  key={`pad_bot_${idx}`}
                  x={14 + idx * 11}
                  y={preset.dieHeightUm - 6}
                  width="7"
                  height="4"
                  fill="currentColor"
                  className="text-amber-500/80"
                />
              ))}
            </g>
          )}

          {/* Power Distribution Network (VDD / VSS Stripes) */}
          {layersVisible.powerGrid && (
            <g className="pdn-network">
              {/* Vertical VDD stripes */}
              <line
                x1={preset.dieWidthUm * 0.25}
                y1="8"
                x2={preset.dieWidthUm * 0.25}
                y2={preset.dieHeightUm - 8}
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-rose-500/50"
              />
              <line
                x1={preset.dieWidthUm * 0.75}
                y1="8"
                x2={preset.dieWidthUm * 0.75}
                y2={preset.dieHeightUm - 8}
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-rose-500/50"
              />
              {/* Vertical VSS stripes */}
              <line
                x1={preset.dieWidthUm * 0.5}
                y1="8"
                x2={preset.dieWidthUm * 0.5}
                y2={preset.dieHeightUm - 8}
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-blue-500/50"
              />
            </g>
          )}

          {/* Standard Cell Instances (Visible during and after Placement) */}
          {layersVisible.cells &&
            ['placement', 'cts', 'routing', 'verification', 'tapeout'].includes(activeStage) && (
              <g className="standard-cells">
                {preset.cells.map((cell) => {
                  const fillColor = 'currentColor';
                  let textColor = 'text-accent';
                  if (cell.type === 'DFF') textColor = 'text-purple-500';
                  else if (cell.type === 'INV') textColor = 'text-emerald-500';
                  else if (cell.type === 'NAND2') textColor = 'text-blue-500';

                  return (
                    <g key={cell.id} className="cursor-pointer group">
                      <rect
                        x={cell.x}
                        y={cell.y}
                        width={cell.width}
                        height={cell.height}
                        fill={fillColor}
                        stroke="currentColor"
                        strokeWidth="0.4"
                        className={`${textColor} fill-current/20 hover:fill-current/60`}
                      />
                      <text
                        x={cell.x + cell.width / 2}
                        y={cell.y + cell.height / 2 + 1}
                        fontSize="2.5"
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-fg font-mono font-bold pointer-events-none"
                      >
                        {cell.type}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

          {/* Metal Wires & Vias (Visible during and after Routing) */}
          {['routing', 'verification', 'tapeout'].includes(activeStage) && (
            <g className="metal-interconnects">
              {preset.wires.map((wire) => {
                if (wire.layer === 'metal1' && !layersVisible.metal1) return null;
                if (wire.layer === 'metal2' && !layersVisible.metal2) return null;

                const strokeColor =
                  wire.layer === 'metal1' ? 'text-blue-500' : 'text-purple-500';

                return (
                  <line
                    key={wire.id}
                    x1={wire.x1}
                    y1={wire.y1}
                    x2={wire.x2}
                    y2={wire.y2}
                    stroke="currentColor"
                    strokeWidth="0.8"
                    className={strokeColor}
                  />
                );
              })}
            </g>
          )}

          {/* Scale Legend (10 um bar) */}
          <g transform={`translate(12, ${preset.dieHeightUm - 12})`}>
            <line x1="0" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="1" className="text-fg" />
            <line x1="0" y1="-2" x2="0" y2="2" stroke="currentColor" strokeWidth="1" className="text-fg" />
            <line x1="20" y1="-2" x2="20" y2="2" stroke="currentColor" strokeWidth="1" className="text-fg" />
            <text x="10" y="-3" fontSize="2.8" textAnchor="middle" fill="currentColor" className="text-fg font-mono">
              20 µm
            </text>
          </g>
        </svg>

        {/* Die Dimensions HUD Pill */}
        <div className="absolute bottom-3 right-3 rounded-lg border border-hairline bg-surface-1/90 px-2.5 py-1 text-[11px] font-mono text-fg shadow-sm backdrop-blur-sm">
          <span>Die Size: {preset.dieWidthUm}µm × {preset.dieHeightUm}µm</span>
          <span className="text-fg-muted ml-2">({preset.coreAreaUm2} µm²)</span>
        </div>
      </div>
    </div>
  );
}
