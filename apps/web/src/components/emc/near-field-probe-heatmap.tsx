'use client';

import { useState } from 'react';
import type { EmcHotspotNode } from '@hackerland/core';

interface NearFieldProbeHeatmapProps {
  hotspots: EmcHotspotNode[];
  dutName: string;
}

const NOISE_LABELS: Record<string, { label: string; color: string; badge: string }> = {
  switching_dv_dt: {
    label: 'High dv/dt Switching Node',
    color: '#ef4444', // red
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  clock_harmonic: {
    label: 'High-Speed Clock Harmonic',
    color: '#f59e0b', // amber
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  ground_bounce: {
    label: 'Ground Return Current Loop Break',
    color: '#8b5cf6', // purple
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  impedance_discontinuity: {
    label: 'Cable Harness Impedance Discontinuity',
    color: '#06b6d4', // cyan
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
};

export function NearFieldProbeHeatmap({ hotspots, dutName }: NearFieldProbeHeatmapProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<EmcHotspotNode | null>(
    hotspots[0] || null
  );

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm space-y-5">
      <div className="border-b border-border/60 pb-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          Near-Field H-Field / E-Field Probe Scanner
        </span>
        <h3 className="text-base font-bold text-foreground mt-0.5">
          Electromagnetic Radiation Hotspot Map
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Near-field magnetic loop probe diagnostics across critical board nets for {dutName}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2D Heatmap Visualizer Canvas */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-6 bg-background/90 rounded-xl border border-border/80 min-h-[300px]">
          <svg viewBox="0 0 120 80" className="w-full h-auto max-h-[320px] select-none">
            {/* PCB Board Outline */}
            <rect
              x={5}
              y={5}
              width={110}
              height={70}
              rx={2}
              className="fill-slate-900/60 stroke-slate-700"
              strokeWidth={0.8}
            />

            {/* Simulated ground grid lines */}
            <line x1={5} y1={25} x2={115} y2={25} stroke="rgba(255,255,255,0.05)" strokeWidth={0.4} />
            <line x1={5} y1={45} x2={115} y2={45} stroke="rgba(255,255,255,0.05)" strokeWidth={0.4} />
            <line x1={5} y1={65} x2={115} y2={65} stroke="rgba(255,255,255,0.05)" strokeWidth={0.4} />
            <line x1={35} y1={5} x2={35} y2={75} stroke="rgba(255,255,255,0.05)" strokeWidth={0.4} />
            <line x1={65} y1={5} x2={65} y2={75} stroke="rgba(255,255,255,0.05)" strokeWidth={0.4} />
            <line x1={95} y1={5} x2={95} y2={75} stroke="rgba(255,255,255,0.05)" strokeWidth={0.4} />

            {/* Hotspots with radial gradient halo */}
            {hotspots.map((hs) => {
              const isSelected = selectedHotspot?.id === hs.id;
              const info = NOISE_LABELS[hs.noiseSource] || { color: '#ef4444' };
              const cx = 5 + (hs.posX / 100) * 110;
              const cy = 5 + (hs.posY / 100) * 70;

              return (
                <g
                  key={hs.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedHotspot(hs)}
                >
                  {/* Outer Radiation Halo */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 14 : 9}
                    fill={info.color}
                    opacity={isSelected ? 0.35 : 0.18}
                    className="animate-pulse"
                  />
                  {/* Core Marker */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 4 : 2.5}
                    fill={info.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 1.2 : 0.6}
                  />
                  {/* Label tag */}
                  <text
                    x={cx}
                    y={cy - 6}
                    textAnchor="middle"
                    fontSize={2.5}
                    fill="#ffffff"
                    fontFamily="monospace"
                    className="font-bold pointer-events-none drop-shadow"
                  >
                    {hs.nodeName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Diagnostic Inspector Panel */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card/80 p-5 space-y-4 font-mono text-xs">
          {selectedHotspot ? (
            <>
              <div className="border-b border-border/50 pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm font-mono">
                    {selectedHotspot.nodeName}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      NOISE_LABELS[selectedHotspot.noiseSource]?.badge
                    }`}
                  >
                    {NOISE_LABELS[selectedHotspot.noiseSource]?.label}
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px] mt-1 flex items-center gap-3">
                  <span>Emission: <strong className="text-destructive font-bold">{selectedHotspot.peakDbuV} dBµV</strong></span>
                  <span>Frequency: <strong className="text-foreground">{selectedHotspot.peakEmissionMHz} MHz</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-foreground text-[11px] uppercase tracking-wider block">
                  Root-Cause Mechanism:
                </span>
                <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                  {selectedHotspot.noiseSource === 'switching_dv_dt' &&
                    'Rapid transition voltage slewing on power switch nodes couples capacitively into adjacent signal planes and heatsink metalwork.'}
                  {selectedHotspot.noiseSource === 'clock_harmonic' &&
                    'Sharp edge rates on single-ended digital clock lines excite antenna radiation loops without proper series source termination.'}
                  {selectedHotspot.noiseSource === 'ground_bounce' &&
                    'High transient return currents flowing across split reference planes create common-mode noise voltages and slot antenna radiation.'}
                  {selectedHotspot.noiseSource === 'impedance_discontinuity' &&
                    'Unshielded harness wires or un-terminated cable shields act as dipole radiator antennas driven by common-mode noise.'}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider block">
                  Prescribed Engineering Fix:
                </span>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-sans leading-relaxed">
                  {selectedHotspot.mitigation}
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-10">Select a hotspot to view diagnostics</p>
          )}
        </div>
      </div>
    </div>
  );
}
