'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader } from '@hackerland/ui';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Info,
} from 'lucide-react';

export interface KiCanvasViewerProps {
  boardName?: string;
  className?: string;
}

type LayerKey = 'topCopper' | 'bottomCopper' | 'silkscreen' | 'edgeCuts' | 'solderMask';

interface PcbLayer {
  key: LayerKey;
  label: string;
  color: string;
  fill: string;
  stroke: string;
  active: boolean;
}

export function KiCanvasViewer({
  boardName = 'AeroGlide Telemetry & Flight Controller v2.1',
  className = '',
}: KiCanvasViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedNet, setSelectedNet] = useState<string | null>('I2C1_SDA');
  const [viewMode, setViewMode] = useState<'layout' | 'schematic'>('layout');
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    topCopper: true,
    bottomCopper: true,
    silkscreen: true,
    edgeCuts: true,
    solderMask: false,
  });

  const toggleLayer = (layer: LayerKey) => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const pcbLayers: PcbLayer[] = [
    {
      key: 'topCopper',
      label: 'F.Cu (Top Copper)',
      color: 'text-make-fg',
      fill: 'fill-make/20',
      stroke: 'stroke-make',
      active: layers.topCopper,
    },
    {
      key: 'bottomCopper',
      label: 'B.Cu (Bottom Copper)',
      color: 'text-accent-fg',
      fill: 'fill-accent/20',
      stroke: 'stroke-accent',
      active: layers.bottomCopper,
    },
    {
      key: 'silkscreen',
      label: 'F.SilkS (Silkscreen)',
      color: 'text-fg',
      fill: 'fill-fg/40',
      stroke: 'stroke-fg/90',
      active: layers.silkscreen,
    },
    {
      key: 'edgeCuts',
      label: 'Edge.Cuts (Board Edge)',
      color: 'text-warning-fg',
      fill: 'none',
      stroke: 'stroke-warning',
      active: layers.edgeCuts,
    },
    {
      key: 'solderMask',
      label: 'F.Mask (Solder Mask)',
      color: 'text-success-fg',
      fill: 'fill-success/15',
      stroke: 'stroke-success/40',
      active: layers.solderMask,
    },
  ];

  const nets = [
    { name: 'I2C1_SDA', type: 'Signal', pins: 'U1.PB9, U2.4, R1.2', status: 'Matched 400kHz' },
    { name: 'I2C1_SCL', type: 'Clock', pins: 'U1.PB8, U2.3, R2.2', status: 'Matched 400kHz' },
    { name: '+3V3_VCC', type: 'Power', pins: 'VR1.OUT, C1.+, C2.+, U1.VDD', status: 'Regulated 500mA' },
    { name: 'GND_PLANE', type: 'Ground', pins: 'Layer 2 Solid Flood', status: 'Low-Z return' },
    { name: 'RF95_DIO0', type: 'Interrupt', pins: 'U1.PA4, M1.DIO0', status: 'Fast ISR' },
  ];

  return (
    <Card
      accent="make"
      className={`min-w-0 overflow-hidden border border-hairline bg-surface-1 shadow-module ${className}`}
      role="region"
      aria-label="KiCanvas Interactive PCB and Schematic Viewer"
    >
      <CardHeader className="border-b border-hairline pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-make/30 bg-make/10 text-make-fg">
              <Cpu className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  KiCanvas CAD Engine
                </span>
                <Badge tone="success" variant="outline" className="h-4 text-[10px] px-1">
                  DRC Clean (0 Errors)
                </Badge>
              </div>
              <h3 className="font-display text-headline-sm text-fg truncate">
                {boardName}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <div className="flex rounded-sm border border-hairline bg-surface-2 p-0.5 text-label-xs">
              <button
                type="button"
                onClick={() => setViewMode('layout')}
                className={`px-2.5 py-1 rounded-sm font-display uppercase transition-colors ${
                  viewMode === 'layout'
                    ? 'bg-accent text-on-solid'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                PCB Layout
              </button>
              <button
                type="button"
                onClick={() => setViewMode('schematic')}
                className={`px-2.5 py-1 rounded-sm font-display uppercase transition-colors ${
                  viewMode === 'schematic'
                    ? 'bg-accent text-on-solid'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                Schematic
              </button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
                aria-label="Zoom in"
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="size-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                aria-label="Zoom out"
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(1)}
                aria-label="Reset zoom"
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] min-w-0">
          {/* Main Visualizer Canvas Area */}
          <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-sunken p-6 border-b lg:border-b-0 lg:border-r border-hairline select-none">
            {/* Visualizer Grid Background */}
            <div
              className="absolute inset-0 size-full opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(var(--color-line) 1px, transparent 1px), radial-gradient(var(--color-line) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Board Canvas SVG */}
            <div
              style={{ transform: `scale(${zoom})`, transition: 'transform 150ms ease-out' }}
              className="relative z-10 flex items-center justify-center"
            >
              <svg
                width="420"
                height="260"
                viewBox="0 0 420 260"
                className="max-w-full drop-shadow-2xl overflow-visible"
              >
                {/* Edge Cuts (Board Outline) */}
                {layers.edgeCuts && (
                  <rect
                    x="20"
                    y="20"
                    width="380"
                    height="220"
                    rx="12"
                    fill="#08101C"
                    stroke="var(--color-warning)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Solder Mask Tint */}
                {layers.solderMask && (
                  <rect
                    x="20"
                    y="20"
                    width="380"
                    height="220"
                    rx="12"
                    fill="var(--color-success)"
                    fillOpacity="0.12"
                  />
                )}

                {/* Ground Flood Zone */}
                {layers.bottomCopper && (
                  <path
                    d="M 35 35 L 385 35 L 385 225 L 35 225 Z"
                    fill="var(--color-accent)"
                    fillOpacity="0.06"
                    stroke="var(--color-accent)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Bottom Copper Traces */}
                {layers.bottomCopper && (
                  <g className="transition-opacity">
                    <path
                      d="M 60 70 L 160 70 L 190 100 L 260 100"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth={selectedNet === 'I2C1_SCL' ? '4' : '2'}
                      strokeLinecap="round"
                      className="cursor-pointer hover:stroke-accent-strong"
                      onClick={() => setSelectedNet('I2C1_SCL')}
                    />
                    <path
                      d="M 60 90 L 140 90 L 180 130 L 320 130"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth={selectedNet === 'GND_PLANE' ? '4' : '2'}
                      strokeLinecap="round"
                      className="cursor-pointer hover:stroke-accent-strong"
                      onClick={() => setSelectedNet('GND_PLANE')}
                    />
                    <circle cx="260" cy="100" r="4" fill="var(--color-accent)" />
                    <circle cx="320" cy="130" r="4" fill="var(--color-accent)" />
                  </g>
                )}

                {/* Top Copper Traces */}
                {layers.topCopper && (
                  <g className="transition-opacity">
                    <path
                      d="M 50 140 L 110 140 L 150 180 L 310 180 L 340 150"
                      fill="none"
                      stroke="var(--color-make)"
                      strokeWidth={selectedNet === 'I2C1_SDA' ? '4' : '2'}
                      strokeLinecap="round"
                      className="cursor-pointer hover:stroke-make-fg"
                      onClick={() => setSelectedNet('I2C1_SDA')}
                    />
                    <path
                      d="M 210 50 L 210 90 L 290 90 L 330 50"
                      fill="none"
                      stroke="var(--color-make)"
                      strokeWidth={selectedNet === '+3V3_VCC' ? '4' : '2.5'}
                      strokeLinecap="round"
                      className="cursor-pointer hover:stroke-make-fg"
                      onClick={() => setSelectedNet('+3V3_VCC')}
                    />
                    <path
                      d="M 120 40 L 120 110 L 80 150"
                      fill="none"
                      stroke="var(--color-make)"
                      strokeWidth={selectedNet === 'RF95_DIO0' ? '4' : '1.5'}
                      strokeLinecap="round"
                      className="cursor-pointer hover:stroke-make-fg"
                      onClick={() => setSelectedNet('RF95_DIO0')}
                    />
                  </g>
                )}

                {/* IC Components (U1 MCU, U2 IMU Sensor) */}
                <g>
                  {/* U1: STM32 MCU */}
                  <rect
                    x="170"
                    y="100"
                    width="60"
                    height="60"
                    rx="2"
                    fill="#151F33"
                    stroke="var(--color-hairline)"
                    strokeWidth="1.5"
                  />
                  <circle cx="178" cy="108" r="2" fill="var(--color-fg-muted)" />
                  <text
                    x="200"
                    y="135"
                    fill="var(--color-fg)"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    STM32F4
                  </text>

                  {/* U2: BNO085 IMU */}
                  <rect
                    x="50"
                    y="60"
                    width="35"
                    height="45"
                    rx="2"
                    fill="#151F33"
                    stroke="var(--color-hairline)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="67"
                    y="86"
                    fill="var(--color-fg)"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    BNO085
                  </text>

                  {/* M1: LoRa SX1276 Module */}
                  <rect
                    x="290"
                    y="60"
                    width="70"
                    height="120"
                    rx="3"
                    fill="#101827"
                    stroke="var(--color-make)"
                    strokeWidth="1"
                    strokeDasharray="2 1"
                  />
                  <text
                    x="325"
                    y="125"
                    fill="var(--color-make-fg)"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    SX1276 LoRa
                  </text>
                </g>

                {/* Silkscreen Labels & Pinout */}
                {layers.silkscreen && (
                  <g className="font-mono text-[8px] fill-fg/90 select-none">
                    <text x="35" y="42">J1: USB-C TELEMETRY</text>
                    <text x="35" y="215">ANT_915MHz</text>
                    <text x="295" y="215">CERN-OHL-P-2.0</text>
                    <text x="175" y="94" fill="var(--color-accent-fg)">U1: MCU_CORE</text>
                    <text x="50" y="54" fill="var(--color-make-fg)">U2: IMU</text>
                  </g>
                )}

                {/* Active Net Indicator Rings */}
                {selectedNet === 'I2C1_SDA' && (
                  <circle cx="150" cy="180" r="7" fill="none" stroke="var(--color-make)" strokeWidth="1.5" className="animate-ping" />
                )}
                {selectedNet === 'I2C1_SCL' && (
                  <circle cx="190" cy="100" r="7" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" className="animate-ping" />
                )}
              </svg>
            </div>

            {/* Bottom Floating Telemetry Strip */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-hairline/80 bg-surface-2/90 px-3 py-1.5 backdrop-blur-md text-[11px] font-mono text-fg-subtle">
              <div className="flex items-center gap-3">
                <span>SIZE: 64.0 × 42.0 mm</span>
                <span>•</span>
                <span>LAYERS: 4-LAYER (FR4 1.6mm)</span>
                <span>•</span>
                <span>VIAS: 28</span>
              </div>
              <div className="flex items-center gap-1.5 text-accent-fg">
                <Info className="size-3" />
                <span>CLICK ANY TRACE TO INSPECT NET</span>
              </div>
            </div>
          </div>

          {/* Right Control & Net Inspector Panel */}
          <div className="flex flex-col justify-between p-4 bg-surface-1 min-w-0 space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-2 font-display text-label-xs uppercase tracking-wider text-fg-subtle">
                  <Layers className="size-3.5" />
                  <span>Layer Visibility</span>
                </div>
                <div className="space-y-1.5">
                  {pcbLayers.map((layer) => (
                    <button
                      key={layer.key}
                      type="button"
                      onClick={() => toggleLayer(layer.key)}
                      className={`flex w-full items-center justify-between rounded-sm border px-2.5 py-1.5 text-left text-body-xs font-mono transition-colors ${
                        layer.active
                          ? 'border-hairline bg-surface-2 text-fg'
                          : 'border-transparent bg-transparent text-fg-subtle/60 hover:bg-surface-2/40'
                      }`}
                    >
                      <span className={layer.active ? layer.color : ''}>{layer.label}</span>
                      <span
                        className={`size-2.5 rounded-full ${
                          layer.active ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-line'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Net Inspector Block */}
              <div className="border-t border-hairline pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-label-xs uppercase tracking-wider text-fg-subtle">
                    Net Inspector
                  </span>
                  <Badge tone="accent" variant="solid" className="h-4 text-[10px] px-1 font-mono">
                    {selectedNet ?? 'Select Net'}
                  </Badge>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {nets.map((net) => (
                    <button
                      key={net.name}
                      type="button"
                      onClick={() => setSelectedNet(net.name)}
                      className={`flex w-full flex-col gap-0.5 rounded-sm border p-2 text-left transition-colors ${
                        selectedNet === net.name
                          ? 'border-accent bg-accent/10 text-fg'
                          : 'border-hairline bg-surface-2/50 text-fg-muted hover:border-line'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-label-xs">
                        <span className="font-semibold text-fg">{net.name}</span>
                        <span className="text-[10px] text-fg-subtle">{net.type}</span>
                      </div>
                      <span className="text-[10px] font-mono text-fg-subtle truncate">
                        Pins: {net.pins}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-hairline bg-surface-2/60 p-2 text-center text-label-xs text-fg-subtle font-mono">
              <span className="inline-flex items-center gap-1 text-success-fg">
                <CheckCircle2 className="size-3" />
                OSHWA Certified CERN-OHL-P-2.0
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
