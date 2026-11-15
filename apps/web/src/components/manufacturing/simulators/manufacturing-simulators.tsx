'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import {
  Gauge,
  Cpu,
  Flame,
  Plane,
  Car,
  Bike,
  Smartphone,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface SimulatorProps {
  pillarId: string;
}

export function ManufacturingSimulator({ pillarId }: SimulatorProps) {
  switch (pillarId) {
    case 'pcb':
      return <PCBSimulator />;
    case 'hardware':
      return <CNCHardwareSimulator />;
    case 'drone':
      return <DroneAerodynamicsSimulator />;
    case 'car':
      return <EVPowertrainSimulator />;
    case 'bike':
      return <EBikeGradientSimulator />;
    case 'engine':
      return <RocketPropulsionSimulator />;
    case 'mobile':
      return <MobileRFSimulator />;
    case 'future-tech':
      return <FutureTechSimulator />;
    default:
      return <PCBSimulator />;
  }
}

/* =========================================================================
   1. PCB Impedance & Stackup Simulator
   ========================================================================= */
function PCBSimulator() {
  const [substrateEr, setSubstrateEr] = useState<number>(4.4); // FR4
  const [heightH, setHeightH] = useState<number>(0.2); // mm
  const [widthW, setWidthW] = useState<number>(0.38); // mm
  const copperT = 0.035; // 1oz = 35um
  const [layers, setLayers] = useState<number>(4);

  // Microstrip characteristic impedance formula:
  // Z0 = (87 / sqrt(Er + 1.41)) * ln( (5.98 * H) / (0.8 * W + T) )
  const effectiveW = 0.8 * widthW + copperT;
  const ratio = (5.98 * heightH) / (effectiveW > 0 ? effectiveW : 0.001);
  const z0 = Math.max(10, Math.round((87 / Math.sqrt(substrateEr + 1.41)) * Math.log(Math.max(1.05, ratio))));
  const isTarget50 = z0 >= 47 && z0 <= 53;

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="pcb-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-accent" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            50Ω Microstrip Impedance & Stackup Engine
          </h4>
        </div>
        <Badge tone={isTarget50 ? 'success' : 'warning'} variant="solid">
          {isTarget50 ? '50Ω Impedance Matched' : `${z0}Ω (Offset from 50Ω Target)`}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders & Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Substrate Dielectric (εr)</span>
              <span className="font-mono text-accent">{substrateEr} ({substrateEr > 4 ? 'FR-4' : 'Rogers 4350B'})</span>
            </div>
            <input
              type="range"
              min="2.5"
              max="5.0"
              step="0.1"
              value={substrateEr}
              onChange={(e) => setSubstrateEr(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Dielectric Thickness H (mm)</span>
              <span className="font-mono text-accent">{heightH} mm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.02"
              value={heightH}
              onChange={(e) => setHeightH(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Trace Width W (mm)</span>
              <span className="font-mono text-accent">{widthW} mm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={widthW}
              onChange={(e) => setWidthW(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-body-xs text-fg-subtle">Stackup Layers:</span>
            {[2, 4, 6, 8].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayers(l)}
                className={`px-2.5 py-1 text-caption rounded border ${
                  layers === l ? 'border-accent bg-accent/15 text-accent font-semibold' : 'border-hairline text-fg-muted'
                }`}
              >
                {l}-Layer
              </button>
            ))}
          </div>
        </div>

        {/* Live Visual Layer Stackup */}
        <div className="flex flex-col justify-between rounded border border-hairline bg-surface-2 p-4">
          <div>
            <div className="text-caption font-semibold uppercase tracking-wider text-fg-subtle mb-3 flex items-center gap-1.5">
              <Layers className="size-3.5" />
              <span>Layer Stackup Cross-Section ({layers}-Layer Standard)</span>
            </div>

            <div className="space-y-1.5 text-caption font-mono">
              <div className="flex items-center justify-between rounded bg-amber-500/20 border border-amber-500/40 p-2 text-amber-300">
                <span>L1: Top Signal (RF/Diff Microstrip: {widthW}mm)</span>
                <span className="text-body-xs font-bold text-fg">{z0} Ω</span>
              </div>
              <div className="h-4 rounded bg-emerald-950/40 border border-emerald-600/30 flex items-center justify-center text-emerald-400 text-[10px]">
                FR-4 Core / Prepreg ({heightH}mm, εr={substrateEr})
              </div>
              <div className="rounded bg-sky-500/20 border border-sky-500/40 p-1.5 text-sky-300">
                L2: Solid Ground Reference Plane (0V)
              </div>
              {layers >= 4 && (
                <>
                  <div className="h-4 rounded bg-emerald-950/40 border border-emerald-600/30 flex items-center justify-center text-emerald-400 text-[10px]">
                    Internal Dielectric Isolation (0.4mm)
                  </div>
                  <div className="rounded bg-rose-500/20 border border-rose-500/40 p-1.5 text-rose-300">
                    L3: Power Distribution Plane (+3.3V / +5V)
                  </div>
                </>
              )}
              {layers >= 4 && (
                <div className="rounded bg-amber-500/20 border border-amber-500/40 p-1.5 text-amber-300">
                  L{layers}: Bottom Signal Routing Layer
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-hairline/60 flex items-center justify-between text-body-xs text-fg-muted">
            <span>Target: 50.0 Ω ±10%</span>
            <span className="font-semibold text-fg">Calculated: {z0} Ω</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. CNC Machining Feeds & Speeds Simulator
   ========================================================================= */
function CNCHardwareSimulator() {
  const [material, setMaterial] = useState<'al6061' | 'mild_steel' | 'delrin' | 'titanium'>('al6061');
  const [toolDia, setToolDia] = useState<number>(6); // mm
  const [flutes, setFlutes] = useState<number>(2);

  const MAT_SPEEDS = {
    al6061: { name: 'Aluminum 6061-T6', vc: 150, fz: 0.04 },
    mild_steel: { name: 'Mild Steel 1018', vc: 80, fz: 0.03 },
    delrin: { name: 'Delrin / Acetal', vc: 220, fz: 0.08 },
    titanium: { name: 'Titanium Ti-6Al-4V', vc: 45, fz: 0.025 },
  };

  const selected = MAT_SPEEDS[material];
  // RPM = (Vc * 1000) / (pi * D)
  const rpm = Math.round((selected.vc * 1000) / (Math.PI * toolDia));
  // Feed = RPM * fz * flutes
  const feedRate = Math.round(rpm * selected.fz * flutes);
  // MRR (Material Removal Rate) approx
  const mrr = ((feedRate * toolDia * 1.5) / 1000).toFixed(1);

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="hardware-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Gauge className="size-4 text-make" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            CNC Milling Feeds & Speeds Engine
          </h4>
        </div>
        <Badge tone="make" variant="solid">
          {selected.name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-body-xs font-medium text-fg mb-1">Stock Material</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as keyof typeof MAT_SPEEDS)}
              className="w-full rounded border border-hairline bg-surface-2 px-3 py-1.5 text-body-sm text-fg"
            >
              <option value="al6061">Aluminum 6061-T6 (Vc = 150 m/min)</option>
              <option value="mild_steel">Mild Steel 1018 (Vc = 80 m/min)</option>
              <option value="delrin">Delrin / Acetal Polymer (Vc = 220 m/min)</option>
              <option value="titanium">Titanium Ti-6Al-4V (Vc = 45 m/min)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>End Mill Diameter (mm)</span>
              <span className="font-mono text-make">Ø {toolDia} mm</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={toolDia}
              onChange={(e) => setToolDia(parseInt(e.target.value, 10))}
              className="w-full accent-make"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Flute Count</span>
              <span className="font-mono text-make">{flutes} Flutes</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={flutes}
              onChange={(e) => setFlutes(parseInt(e.target.value, 10))}
              className="w-full accent-make"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3.5 space-y-1">
            <span className="text-caption text-fg-subtle">Spindle Speed</span>
            <div className="font-display text-headline-sm font-semibold text-make tabular-nums">
              {rpm.toLocaleString()} <span className="text-caption font-normal text-fg-muted">RPM</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Formula: (Vc * 1000) / (π * D)</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3.5 space-y-1">
            <span className="text-caption text-fg-subtle">Feed Rate (F)</span>
            <div className="font-display text-headline-sm font-semibold text-make tabular-nums">
              {feedRate.toLocaleString()} <span className="text-caption font-normal text-fg-muted">mm/min</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Formula: RPM * fz * z</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3.5 space-y-1">
            <span className="text-caption text-fg-subtle">Material Removal</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {mrr} <span className="text-caption font-normal text-fg-muted">cm³/min</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Depth of Cut = 1.5x D</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3.5 space-y-1">
            <span className="text-caption text-fg-subtle">Coolant Mode</span>
            <div className="font-display text-body-sm font-semibold text-accent">
              {material === 'delrin' ? 'Dry Air Blast' : 'Flood Coolant / Mist'}
            </div>
            <p className="text-[11px] text-fg-subtle">Zero thermal shock</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. Drone Thrust-to-Weight & Endurance Simulator
   ========================================================================= */
function DroneAerodynamicsSimulator() {
  const [motorCount, setMotorCount] = useState<number>(4);
  const [motorThrustG, setMotorThrustG] = useState<number>(850); // grams per motor
  const [frameWeightG, setFrameWeightG] = useState<number>(600); // grams
  const [batteryCapMah, setBatteryCapMah] = useState<number>(5000); // mAh
  const voltageS = 4; // 4S = 14.8V

  const totalMaxThrustG = motorCount * motorThrustG;
  const batteryWeightG = Math.round((batteryCapMah * voltageS * 3.7) / 140); // ~140 Wh/kg
  const totalAUWG = frameWeightG + batteryWeightG;
  const twr = (totalMaxThrustG / (totalAUWG > 0 ? totalAUWG : 1)).toFixed(2);
  const batteryWh = ((batteryCapMah / 1000) * voltageS * 3.7).toFixed(1);

  // Hover power approx: ~120W per kg of AUW
  const hoverPowerW = (totalAUWG / 1000) * 135;
  const hoverMinutes = Math.max(1, Math.round(((parseFloat(batteryWh) * 0.8) / hoverPowerW) * 60));

  const isDGCAMicro = totalAUWG <= 2000;

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="drone-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Plane className="size-4 text-code" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Drone Propulsion & Flight Endurance Simulator
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={parseFloat(twr) >= 2.0 ? 'success' : 'warning'} variant="solid">
            TWR {twr}:1
          </Badge>
          <Badge tone={isDGCAMicro ? 'neutral' : 'code'} variant="outline">
            {isDGCAMicro ? 'DGCA Micro (< 2kg)' : 'DGCA Small (2–25kg)'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-medium text-fg">Airframe Configuration</span>
            <div className="flex gap-1.5">
              {[4, 6, 8].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setMotorCount(c)}
                  className={`px-2.5 py-0.5 rounded text-caption border ${
                    motorCount === c ? 'border-code bg-code/15 text-code font-bold' : 'border-hairline text-fg-muted'
                  }`}
                >
                  {c === 4 ? 'Quad (4x)' : c === 6 ? 'Hexa (6x)' : 'Octo (8x)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Peak Motor Thrust (per arm)</span>
              <span className="font-mono text-code">{motorThrustG} g</span>
            </div>
            <input
              type="range"
              min="400"
              max="2500"
              step="50"
              value={motorThrustG}
              onChange={(e) => setMotorThrustG(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Battery Capacity</span>
              <span className="font-mono text-code">{batteryCapMah} mAh ({voltageS}S LiPo)</span>
            </div>
            <input
              type="range"
              min="1500"
              max="16000"
              step="500"
              value={batteryCapMah}
              onChange={(e) => setBatteryCapMah(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Dry Airframe + Payload Weight</span>
              <span className="font-mono text-code">{frameWeightG} g</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={frameWeightG}
              onChange={(e) => setFrameWeightG(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">All-Up Weight (AUW)</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {totalAUWG.toLocaleString()} <span className="text-caption font-normal text-fg-muted">g</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Frame + {batteryWeightG}g Battery</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Estimated Hover Time</span>
            <div className="font-display text-headline-sm font-semibold text-success tabular-nums">
              {hoverMinutes} <span className="text-caption font-normal text-fg-muted">mins</span>
            </div>
            <p className="text-[11px] text-fg-subtle">80% DoD Safety Margin</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Total Max Thrust</span>
            <div className="font-display text-headline-sm font-semibold text-code tabular-nums">
              {(totalMaxThrustG / 1000).toFixed(1)} <span className="text-caption font-normal text-fg-muted">kg</span>
            </div>
            <p className="text-[11px] text-fg-subtle">{motorCount}x {motorThrustG}g Motors</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Energy Stored</span>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {batteryWh} <span className="text-caption font-normal text-fg-muted">Wh</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Nominal 3.7V / cell</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. Electric Car Powertrain & Battery Simulator
   ========================================================================= */
function EVPowertrainSimulator() {
  const [cellsSeries, setCellsSeries] = useState<number>(24); // 24S = 86.4V
  const [cellsParallel, setCellsParallel] = useState<number>(10); // 10P
  const [vehicleWeightKg, setVehicleWeightKg] = useState<number>(450); // kg

  const cellVoltNom = 3.6; // 21700 NMC
  const cellCapAh = 4.8; // 4800mAh

  const packVoltage = (cellsSeries * cellVoltNom).toFixed(1);
  const packAh = (cellsParallel * cellCapAh).toFixed(1);
  const packKwh = ((parseFloat(packVoltage) * parseFloat(packAh)) / 1000).toFixed(2);

  // Consumption approx: 55 Wh/km + weight penalty
  const consumptionWhKm = 50 + (vehicleWeightKg / 100) * 8;
  const estimatedRangeKm = Math.round((parseFloat(packKwh) * 1000) / consumptionWhKm);
  const maxDischargeCurrent = Math.round(cellsParallel * cellCapAh * 3); // 3C pulse

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="car-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Car className="size-4 text-earn" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            EV Battery Pack Architecture & ARAI Range Simulator
          </h4>
        </div>
        <Badge tone="earn" variant="solid">
          {packVoltage}V / {packKwh} kWh Pack
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Cells in Series (Voltage)</span>
              <span className="font-mono text-earn">{cellsSeries}S ({packVoltage} V)</span>
            </div>
            <input
              type="range"
              min="16"
              max="96"
              step="2"
              value={cellsSeries}
              onChange={(e) => setCellsSeries(parseInt(e.target.value, 10))}
              className="w-full accent-earn"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Cells in Parallel (Capacity)</span>
              <span className="font-mono text-earn">{cellsParallel}P ({packAh} Ah)</span>
            </div>
            <input
              type="range"
              min="4"
              max="30"
              step="1"
              value={cellsParallel}
              onChange={(e) => setCellsParallel(parseInt(e.target.value, 10))}
              className="w-full accent-earn"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Curb Weight</span>
              <span className="font-mono text-earn">{vehicleWeightKg} kg</span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="25"
              value={vehicleWeightKg}
              onChange={(e) => setVehicleWeightKg(parseInt(e.target.value, 10))}
              className="w-full accent-earn"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Estimated ARAI Range</span>
            <div className="font-display text-headline-sm font-semibold text-success tabular-nums">
              {estimatedRangeKm} <span className="text-caption font-normal text-fg-muted">km</span>
            </div>
            <p className="text-[11px] text-fg-subtle">~{consumptionWhKm.toFixed(0)} Wh/km Consumption</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Total Stored Energy</span>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {packKwh} <span className="text-caption font-normal text-fg-muted">kWh</span>
            </div>
            <p className="text-[11px] text-fg-subtle">{cellsSeries * cellsParallel} total 21700 cells</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Max Pulse Current</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {maxDischargeCurrent} <span className="text-caption font-normal text-fg-muted">A</span>
            </div>
            <p className="text-[11px] text-fg-subtle">At 3C continuous discharge</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">AIS-156 Compliance</span>
            <div className="font-display text-body-sm font-semibold text-accent">
              Phase 2 Ready
            </div>
            <p className="text-[11px] text-fg-subtle">Thermal runaway alarm &lt; 5s</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. Electric Bike Gradient & Torque Simulator
   ========================================================================= */
function EBikeGradientSimulator() {
  const [riderWeightKg, setRiderWeightKg] = useState<number>(80);
  const [inclinePercent, setInclinePercent] = useState<number>(10); // 10% grade
  const [motorType, setMotorType] = useState<'hub' | 'mid_drive'>('mid_drive');

  const totalMass = riderWeightKg + 22; // 22kg bike
  // Angle in radians: arctan(incline / 100)
  const angleRad = Math.atan(inclinePercent / 100);
  // Gravity force = m * g * sin(theta)
  const fClimb = totalMass * 9.81 * Math.sin(angleRad);
  // Torque at wheel (R = 0.33m for 26" wheel)
  const wheelTorque = (fClimb * 0.33).toFixed(1);
  const motorRatingW = Math.round(fClimb * 4.5); // at 16 km/h speed

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="bike-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Bike className="size-4 text-code" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            E-Bike Hill-Climbing Torque & Motor Dyno
          </h4>
        </div>
        <Badge tone="code" variant="solid">
          {motorType === 'mid_drive' ? 'Mid-Drive (Crank Assist)' : 'BLDC Direct Hub'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-medium text-fg">Powertrain Topology</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMotorType('mid_drive')}
                className={`px-3 py-1 rounded text-caption border ${
                  motorType === 'mid_drive' ? 'border-code bg-code/15 text-code font-bold' : 'border-hairline text-fg-muted'
                }`}
              >
                Mid-Drive Motor
              </button>
              <button
                type="button"
                onClick={() => setMotorType('hub')}
                className={`px-3 py-1 rounded text-caption border ${
                  motorType === 'hub' ? 'border-code bg-code/15 text-code font-bold' : 'border-hairline text-fg-muted'
                }`}
              >
                Rear Hub Motor
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Road Incline Gradient (%)</span>
              <span className="font-mono text-code">{inclinePercent}% ({((angleRad * 180) / Math.PI).toFixed(1)}°)</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={inclinePercent}
              onChange={(e) => setInclinePercent(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Rider Weight (kg)</span>
              <span className="font-mono text-code">{riderWeightKg} kg</span>
            </div>
            <input
              type="range"
              min="50"
              max="130"
              step="5"
              value={riderWeightKg}
              onChange={(e) => setRiderWeightKg(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Wheel Torque Required</span>
            <div className="font-display text-headline-sm font-semibold text-code tabular-nums">
              {wheelTorque} <span className="text-caption font-normal text-fg-muted">Nm</span>
            </div>
            <p className="text-[11px] text-fg-subtle">On 26-inch standard wheel</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Climbing Power Needed</span>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {motorRatingW} <span className="text-caption font-normal text-fg-muted">W</span>
            </div>
            <p className="text-[11px] text-fg-subtle">At 16 km/h constant speed</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Regulatory Status</span>
            <div className="font-display text-body-sm font-semibold text-accent">
              {motorRatingW <= 250 ? 'ARAI Non-Motor Exempt' : 'Requires RTO License/Helmet'}
            </div>
            <p className="text-[11px] text-fg-subtle">CMVR Rule 126: 250W limit</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Heat Dissipation</span>
            <div className="font-display text-body-sm font-semibold text-fg">
              {inclinePercent > 15 && motorType === 'hub' ? 'Thermal Risk (Add FOC)' : 'Normal (< 60°C)'}
            </div>
            <p className="text-[11px] text-fg-subtle">Ambient: 40°C Indian climate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. Engine & De Laval Supersonic Nozzle Simulator
   ========================================================================= */
function RocketPropulsionSimulator() {
  const [chamberPressureBar, setChamberPressureBar] = useState<number>(30); // 30 bar
  const [ambientPressureBar, setAmbientPressureBar] = useState<number>(1.0); // 1.0 bar (sea level)
  const [throatDiaMm, setThroatDiaMm] = useState<number>(24); // mm

  const pressureRatio = chamberPressureBar / ambientPressureBar;
  // Expansion ratio formula approx for gamma = 1.2
  const expansionRatio = (0.9 * Math.pow(pressureRatio, 0.65)).toFixed(2);
  const throatAreaM2 = Math.PI * Math.pow((throatDiaMm / 1000) / 2, 2);
  const thrustKn = (throatAreaM2 * (chamberPressureBar * 1e5) * 1.45 / 1000).toFixed(2);
  const ispSec = Math.round(230 + Math.log(pressureRatio) * 22);

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="engine-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Flame className="size-4 text-danger" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            De Laval Supersonic Nozzle & Rocket Thrust Engine
          </h4>
        </div>
        <Badge tone="danger" variant="solid">
          {thrustKn} kN Thrust
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Chamber Pressure (Pc)</span>
              <span className="font-mono text-danger">{chamberPressureBar} Bar</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={chamberPressureBar}
              onChange={(e) => setChamberPressureBar(parseInt(e.target.value, 10))}
              className="w-full accent-danger"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Nozzle Throat Diameter (Dt)</span>
              <span className="font-mono text-danger">{throatDiaMm} mm</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="2"
              value={throatDiaMm}
              onChange={(e) => setThroatDiaMm(parseInt(e.target.value, 10))}
              className="w-full accent-danger"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Ambient Pressure (Pa)</span>
              <span className="font-mono text-danger">{ambientPressureBar} Bar ({ambientPressureBar === 1 ? 'Sea Level' : 'Vacuum'})</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={ambientPressureBar}
              onChange={(e) => setAmbientPressureBar(parseFloat(e.target.value))}
              className="w-full accent-danger"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Optimal Expansion Ratio (Ae/At)</span>
            <div className="font-display text-headline-sm font-semibold text-danger tabular-nums">
              {expansionRatio}x
            </div>
            <p className="text-[11px] text-fg-subtle">Shock-free exit boundary</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Specific Impulse (Isp)</span>
            <div className="font-display text-headline-sm font-semibold text-success tabular-nums">
              {ispSec} <span className="text-caption font-normal text-fg-muted">s</span>
            </div>
            <p className="text-[11px] text-fg-subtle">LOX / Ethanol propellant</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Peak Sea-Level Thrust</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {thrustKn} <span className="text-caption font-normal text-fg-muted">kN</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Throat Area = {(throatAreaM2 * 1e6).toFixed(0)} mm²</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Cooling Mode</span>
            <div className="font-display text-body-sm font-semibold text-accent">
              Regenerative (Inconel 718)
            </div>
            <p className="text-[11px] text-fg-subtle">Fuel spiral jacket circulation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   7. Mobile RF Link Budget & Thermal Simulator
   ========================================================================= */
function MobileRFSimulator() {
  const [freqGhz, setFreqGhz] = useState<number>(3.5); // 3.5 GHz (5G n78)
  const [distanceM, setDistanceM] = useState<number>(300); // meters
  const [txPowerDbm, setTxPowerDbm] = useState<number>(23); // 200mW standard phone TX

  // Free space path loss: FSPL = 20*log10(d) + 20*log10(f) + 32.44
  const fspl = Math.round(20 * Math.log10(distanceM / 1000) + 20 * Math.log10(freqGhz * 1000) + 32.44);
  const rxPowerDbm = txPowerDbm - fspl;
  const linkMargin = rxPowerDbm - (-105); // -105 dBm sensitivity threshold

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="mobile-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="size-4 text-accent" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            5G Cellular RF Link Budget & Antenna Propagation
          </h4>
        </div>
        <Badge tone={linkMargin > 10 ? 'success' : linkMargin > 0 ? 'warning' : 'danger'} variant="solid">
          {linkMargin > 0 ? `Link Margin: +${linkMargin} dB` : 'Disconnected (Below Sensitivity)'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Operating Frequency</span>
              <span className="font-mono text-accent">{freqGhz} GHz ({freqGhz > 20 ? '5G mmWave' : 'Sub-6GHz'})</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="28"
              step="0.5"
              value={freqGhz}
              onChange={(e) => setFreqGhz(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Tower Distance</span>
              <span className="font-mono text-accent">{distanceM} meters</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={distanceM}
              onChange={(e) => setDistanceM(parseInt(e.target.value, 10))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Phone Transmit Power</span>
              <span className="font-mono text-accent">+{txPowerDbm} dBm (200 mW)</span>
            </div>
            <input
              type="range"
              min="10"
              max="26"
              step="1"
              value={txPowerDbm}
              onChange={(e) => setTxPowerDbm(parseInt(e.target.value, 10))}
              className="w-full accent-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Free Space Path Loss</span>
            <div className="font-display text-headline-sm font-semibold text-accent tabular-nums">
              {fspl} <span className="text-caption font-normal text-fg-muted">dB</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Friis free space equation</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Received Signal (RSSI)</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {rxPowerDbm} <span className="text-caption font-normal text-fg-muted">dBm</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Threshold = -105 dBm</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">SAR Compliance</span>
            <div className="font-display text-body-sm font-semibold text-success">
              &lt; 1.2 W/kg (Safe)
            </div>
            <p className="text-[11px] text-fg-subtle">Indian DoT limit: 1.6 W/kg</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">SoC Vapor Chamber</span>
            <div className="font-display text-body-sm font-semibold text-fg">
              0.35mm Ultra-Thin
            </div>
            <p className="text-[11px] text-fg-subtle">Capillary sintered copper wick</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   8. Future Tech: Sodium-Ion vs Lithium & Humanoid Actuator Simulator
   ========================================================================= */
function FutureTechSimulator() {
  const [packSizeKwh, setPackSizeKwh] = useState<number>(20); // 20 kWh home/commercial pack

  const naEnergyDensityWhKg = 160;
  const liEnergyDensityWhKg = 240;

  const naWeightKg = Math.round((packSizeKwh * 1000) / naEnergyDensityWhKg);
  const liWeightKg = Math.round((packSizeKwh * 1000) / liEnergyDensityWhKg);

  const naCostInr = packSizeKwh * 3800; // ~₹3,800 per kWh
  const liCostInr = packSizeKwh * 9500; // ~₹9,500 per kWh
  const savingsPercent = Math.round(((liCostInr - naCostInr) / liCostInr) * 100);

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="future-simulator">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-earn" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Sodium-Ion vs Lithium Battery Density & Cost Analyzer
          </h4>
        </div>
        <Badge tone="earn" variant="solid">
          {savingsPercent}% Raw Material Cost Savings
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Energy Storage Pack Capacity</span>
              <span className="font-mono text-earn">{packSizeKwh} kWh</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={packSizeKwh}
              onChange={(e) => setPackSizeKwh(parseInt(e.target.value, 10))}
              className="w-full accent-earn"
            />
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 text-body-xs text-fg-muted space-y-1">
            <span className="font-semibold text-fg">Domestic Indian Supply Advantage:</span>
            <p>
              Sodium uses abundant sea-salt and iron-manganese cathode chemistry, eliminating reliance on imported lithium and cobalt supply chains.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Sodium-Ion Pack Weight</span>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {naWeightKg} <span className="text-caption font-normal text-fg-muted">kg</span>
            </div>
            <p className="text-[11px] text-fg-subtle">At 160 Wh/kg cell level</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Lithium NMC Weight</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {liWeightKg} <span className="text-caption font-normal text-fg-muted">kg</span>
            </div>
            <p className="text-[11px] text-fg-subtle">At 240 Wh/kg cell level</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Sodium Pack Cost</span>
            <div className="font-display text-headline-sm font-semibold text-success tabular-nums">
              ₹{(naCostInr / 1000).toFixed(0)}k
            </div>
            <p className="text-[11px] text-fg-subtle">Zero thermal runaway risk</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Lithium Pack Cost</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              ₹{(liCostInr / 1000).toFixed(0)}k
            </div>
            <p className="text-[11px] text-fg-subtle">Subject to metal import duties</p>
          </div>
        </div>
      </div>
    </div>
  );
}
