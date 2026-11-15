'use client';

import { useState } from 'react';
import { Button, Badge, Card, cn } from '@hackerland/ui';
import { Download, Copy, Check, FileJson, FileSpreadsheet, Sliders, Sparkles } from 'lucide-react';
import type { PhysicsVehicleType } from './physics-hub';

export interface TelemetryExporterProps {
  vehicleType: PhysicsVehicleType;
  vehicleName: string;
}

const PRESETS: Record<PhysicsVehicleType, { label: string; desc: string }[]> = {
  bicycle: [
    { label: 'Time-Trial Aero Rig', desc: '0.22 m² CdA, 54T chainring, 120 rpm sprint, 8.2 kg carbon frame' },
    { label: 'Utility Cargo E-Bike', desc: '250W mid-drive, 60 Nm torque, 38 kg loaded, 45 mm high-grip tires' },
    { label: 'Paris-Brest Audax', desc: 'Endurance geometry, dynamo hub drag, 28 mm tubeless, steady 180W output' },
  ],
  car: [
    { label: 'GT3 Track Special', desc: '1,250 kg, 520 hp NA Flat-6, 450 kg downforce at 200 km/h, slick compound' },
    { label: 'Formula Student EV', desc: 'Four in-hub 35kW motors, torque vectoring, 185 kg curb, 2.1g peak cornering' },
    { label: 'Hill-Climb Monster', desc: 'Twin turbo 800 hp, dual-element front wing, 80% rear aero bias' },
  ],
  motorbike: [
    { label: 'MotoGP Prototype', desc: '260 hp 1000cc V4, carbon-carbon discs, 64° lean limit, downforce winglets' },
    { label: 'Supersport 600', desc: '125 hp inline-4, 168 kg dry, dual floating 310mm rotors, 15,500 rpm redline' },
    { label: 'Electric Superbike', desc: '150 kW synchronous motor, direct drive, regenerative engine brake map' },
  ],
  drone: [
    { label: '5-Inch Freestyle 6S', desc: '2207 1950KV motors, 650g AUW, 4.8:1 thrust-to-weight, Betaflight PID' },
    { label: 'Long-Range 7-Inch Li-ion', desc: '2806.5 1300KV, 4S2P 21700 pack, 38 min endurance, GPS rescue mode' },
    { label: 'Industrial LiDAR Hexacopter', desc: 'Carbon folding arms, 15 kg MTOW, 18-inch carbon props, RTK GNSS' },
  ],
  ev: [
    { label: '800V Hyper-Saloon', desc: '100 kWh NMC 811 pack, dual SiC inverters, 350 kW peak DC fast charge' },
    { label: 'Urban LFP Commuter', desc: '45 kWh blade cell battery, single 110 kW front motor, 0.24 Cd drag coefficient' },
    { label: 'Commercial Delivery Van', desc: '75 kWh pack, 3.5 ton gross vehicle weight, high-torque regen braking' },
  ],
  rocket: [
    { label: 'Two-Stage Micro-Launcher', desc: 'LOX/Kero first stage, 250 kg to 500km SSO, gravity-turn ascent' },
    { label: 'Sounding Rocket (100km)', desc: 'Solid propellant grain, 12g launch acceleration, Karman line apogee' },
    { label: 'Methane Reusable Booster', desc: 'Methalox staged combustion, grid fins, supersonic retro-propulsion' },
  ],
};

export function TelemetryExporter({ vehicleType, vehicleName }: TelemetryExporterProps) {
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = PRESETS[vehicleType] || [];

  const generateTelemetryData = () => {
    const timestamp = new Date().toISOString();
    return {
      metadata: {
        system: 'Hackerland Multibody Dynamics Engine',
        vehicleType,
        vehicleName,
        exportTimestamp: timestamp,
        integrationMethod: 'Runge-Kutta 4th Order (RK4)',
        timeStepSeconds: 0.01667,
      },
      telemetry: Array.from({ length: 15 }, (_, i) => {
        const t = (i * 0.5).toFixed(1);
        const velocity = (12 + i * 2.8 + Math.sin(i) * 0.5).toFixed(2);
        const accel = (3.5 - i * 0.18).toFixed(2);
        const powerKw = (45 + i * 8.2).toFixed(1);
        const efficiency = (91.4 - i * 0.4).toFixed(1);
        return {
          timeSeconds: Number(t),
          velocityMs: Number(velocity),
          accelerationMs2: Number(accel),
          powerKilowatts: Number(powerKw),
          systemEfficiencyPercent: Number(efficiency),
        };
      }),
    };
  };

  const handleCopyJson = () => {
    const data = generateTelemetryData();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const data = generateTelemetryData();
    const headers = ['time_s', 'velocity_m_s', 'accel_m_s2', 'power_kw', 'efficiency_pct'];
    const rows = data.telemetry.map(
      (r) => `${r.timeSeconds},${r.velocityMs},${r.accelerationMs2},${r.powerKilowatts},${r.systemEfficiencyPercent}`
    );
    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hackerland-${vehicleType}-telemetry.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const data = generateTelemetryData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hackerland-${vehicleType}-physics.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-2/60 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="size-4 text-accent" />
          <h4 className="font-display text-body-sm font-bold text-fg">
            Engineering Presets & Telemetry Export
          </h4>
          <Badge tone="accent" variant="outline" className="font-mono text-[9px]">
            RK4 60FPS
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleCopyJson}
            className="text-caption font-mono gap-1.5"
          >
            {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
            <span>{copied ? 'Copied JSON!' : 'Copy Netlist'}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleDownloadCsv}
            className="text-caption font-mono gap-1.5"
          >
            <FileSpreadsheet className="size-3.5 text-earn" />
            <span>Export CSV</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleDownloadJson}
            className="text-caption font-mono gap-1.5"
          >
            <Download className="size-3.5" />
            <span>Download JSON</span>
          </Button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-fg-subtle uppercase tracking-wider block">
          Curated Benchmark Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {presets.map((preset) => {
            const isSelected = activePreset === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setActivePreset(preset.label)}
                className={cn(
                  'p-2.5 rounded-lg border text-left transition-all text-caption',
                  isSelected
                    ? 'border-accent bg-accent/15 text-accent shadow-xs'
                    : 'border-hairline bg-surface-1 text-fg hover:border-hairline-strong hover:bg-surface-3'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold">{preset.label}</span>
                  {isSelected && <Sparkles className="size-3 text-accent" />}
                </div>
                <p className="text-[11px] text-fg-muted line-clamp-2 mt-1 leading-normal font-sans">
                  {preset.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
