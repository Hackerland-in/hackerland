'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import {
  Layers,
  Thermometer,
  Zap,
  Box,
  RotateCw,
  ShieldAlert,
} from 'lucide-react';

/* =========================================================================
   1. Injection Molding Clamp Tonnage & Cooling Time Engine
   ========================================================================= */
export function InjectionMoldingSimulator() {
  const [partAreaCm2, setPartAreaCm2] = useState<number>(150); // cm2
  const [resin, setResin] = useState<'abs' | 'pc' | 'pp' | 'nylon'>('abs');
  const [wallThicknessMm, setWallThicknessMm] = useState<number>(2.5); // mm

  const RESIN_DATA = {
    abs: { name: 'ABS (Acrylonitrile Butadiene Styrene)', cavityBar: 400, alpha: 0.085, tmelt: 230, teject: 85 },
    pc: { name: 'Polycarbonate (PC High-Impact)', cavityBar: 650, alpha: 0.095, tmelt: 290, teject: 125 },
    pp: { name: 'Polypropylene (PP Semi-Crystalline)', cavityBar: 300, alpha: 0.070, tmelt: 210, teject: 70 },
    nylon: { name: 'Nylon PA66 (Engineering Polyamide)', cavityBar: 550, alpha: 0.080, tmelt: 280, teject: 110 },
  };

  const selected = RESIN_DATA[resin];
  // Clamp Tonnage = Projected Area (cm2) * Cavity Pressure (bar) / 1000 * Safety Margin (1.15)
  const requiredClampTons = Math.round((partAreaCm2 * selected.cavityBar * 1.15) / 1000);

  // Ballman-Shimon Cooling Time approx: t = (h^2 / (pi^2 * alpha)) * ln(4/pi * (Tmelt - Tmold) / (Teject - Tmold))
  const tmold = 40; // 40°C mold temp
  const tempRatio = ((4 / Math.PI) * (selected.tmelt - tmold)) / Math.max(5, selected.teject - tmold);
  const coolingTimeSec = Math.max(
    3,
    Math.round(((Math.pow(wallThicknessMm, 2) / (Math.pow(Math.PI, 2) * selected.alpha)) * Math.log(Math.max(1.1, tempRatio))))
  );
  const estimatedTotalCycleSec = coolingTimeSec + 6; // + 6s for injection + mold open/eject

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="injection-molding-sim">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Box className="size-4 text-accent" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Injection Molding Clamp Tonnage & Cycle Time Engine
          </h4>
        </div>
        <Badge tone="accent" variant="solid">
          {requiredClampTons} Ton Press Required
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="block text-body-xs font-medium text-fg mb-1">Thermoplastic Resin</label>
            <select
              value={resin}
              onChange={(e) => setResin(e.target.value as keyof typeof RESIN_DATA)}
              className="w-full rounded border border-hairline bg-surface-2 px-3 py-1.5 text-body-sm text-fg"
            >
              <option value="abs">ABS Plastic (Consumer Enclosures)</option>
              <option value="pc">Polycarbonate PC (Impact / Transparent)</option>
              <option value="pp">Polypropylene PP (Living Hinges / Containers)</option>
              <option value="nylon">Nylon PA66 (Gears / Structural Brackets)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Projected Surface Area (XY plane)</span>
              <span className="font-mono text-accent">{partAreaCm2} cm²</span>
            </div>
            <input
              type="range"
              min="20"
              max="800"
              step="10"
              value={partAreaCm2}
              onChange={(e) => setPartAreaCm2(parseInt(e.target.value, 10))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Nominal Wall Thickness</span>
              <span className="font-mono text-accent">{wallThicknessMm} mm</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="6.0"
              step="0.1"
              value={wallThicknessMm}
              onChange={(e) => setWallThicknessMm(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Recommended Press</span>
            <div className="font-display text-headline-sm font-semibold text-accent tabular-nums">
              {requiredClampTons >= 250 ? '300T Press' : requiredClampTons >= 120 ? '150T Press' : '80T Press'}
            </div>
            <p className="text-[11px] text-fg-subtle">Includes 15% hydraulic safety margin</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Cooling Phase Time</span>
            <div className="font-display text-headline-sm font-semibold text-success tabular-nums">
              {coolingTimeSec} <span className="text-caption font-normal text-fg-muted">sec</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Proportional to (thickness)²</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Total Part Cycle Time</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {estimatedTotalCycleSec} <span className="text-caption font-normal text-fg-muted">sec/part</span>
            </div>
            <p className="text-[11px] text-fg-subtle">~{Math.round(3600 / estimatedTotalCycleSec)} parts/hr per cavity</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Draft Angle Rule</span>
            <div className="font-display text-body-sm font-semibold text-fg">
              1.5° to 2.0° Per Side
            </div>
            <p className="text-[11px] text-fg-subtle">Prevents ejector pin drag marks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. Sheet Metal Bending & K-Factor Allowance Simulator
   ========================================================================= */
export function SheetMetalBendSimulator() {
  const [thicknessMm, setThicknessMm] = useState<number>(2.0); // mm
  const [bendAngleDeg, setBendAngleDeg] = useState<number>(90); // degrees
  const [insideRadiusMm, setInsideRadiusMm] = useState<number>(2.0); // mm
  const [kFactor, setKFactor] = useState<number>(0.44); // 0.33 to 0.50

  // Bend Allowance (BA) = (pi / 180) * Angle * (R + K * T)
  const ba = ((Math.PI / 180) * bendAngleDeg * (insideRadiusMm + kFactor * thicknessMm)).toFixed(2);
  // Setback = (R + T) * tan(Angle / 2)
  const angleRad = (bendAngleDeg * Math.PI) / 180;
  const setback = (insideRadiusMm + thicknessMm) * Math.tan(angleRad / 2);
  // Bend Deduction (BD) = 2 * Setback - BA
  const bd = (2 * setback - parseFloat(ba)).toFixed(2);
  // Minimum flange height = 4 * T
  const minFlangeMm = (4 * thicknessMm).toFixed(1);

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="sheet-metal-sim">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-make" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Sheet Metal Bend Allowance & K-Factor Flat Pattern Sizer
          </h4>
        </div>
        <Badge tone="make" variant="solid">
          BA: {ba} mm | BD: {bd} mm
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Sheet Thickness (T)</span>
              <span className="font-mono text-make">{thicknessMm} mm (Al / Steel)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={thicknessMm}
              onChange={(e) => setThicknessMm(parseFloat(e.target.value))}
              className="w-full accent-make"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Bend Angle (A)</span>
              <span className="font-mono text-make">{bendAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              step="5"
              value={bendAngleDeg}
              onChange={(e) => setBendAngleDeg(parseInt(e.target.value, 10))}
              className="w-full accent-make"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Inside Bend Radius (R)</span>
              <span className="font-mono text-make">{insideRadiusMm} mm</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={insideRadiusMm}
              onChange={(e) => setInsideRadiusMm(parseFloat(e.target.value))}
              className="w-full accent-make"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>K-Factor (Neutral Axis Shift)</span>
              <span className="font-mono text-make">{kFactor}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.50"
              step="0.02"
              value={kFactor}
              onChange={(e) => setKFactor(parseFloat(e.target.value))}
              className="w-full accent-make"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Bend Allowance (BA)</span>
            <div className="font-display text-headline-sm font-semibold text-make tabular-nums">
              {ba} <span className="text-caption font-normal text-fg-muted">mm</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Length along neutral axis</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Bend Deduction (BD)</span>
            <div className="font-display text-headline-sm font-semibold text-accent tabular-nums">
              {bd} <span className="text-caption font-normal text-fg-muted">mm</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Deducted from flat blank</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Min Flange Height</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {minFlangeMm} <span className="text-caption font-normal text-fg-muted">mm</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Minimum die lip engagement</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Hole-to-Bend Relief</span>
            <div className="font-display text-body-sm font-semibold text-fg">
              {(2.5 * thicknessMm + insideRadiusMm).toFixed(1)} mm Min
            </div>
            <p className="text-[11px] text-fg-subtle">Prevents hole ovalization</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. Battery Spot Welding & Nickel Strip Ampacity Simulator
   ========================================================================= */
export function BatteryWeldingSimulator() {
  const [stripWidthMm, setStripWidthMm] = useState<number>(8); // 8mm standard
  const [stripThickMm, setStripThickMm] = useState<number>(0.15); // 0.15mm standard
  const [stripMaterial, setStripMaterial] = useState<'pure_nickel' | 'nickel_plated_steel'>('pure_nickel');
  const [currentLoadA, setCurrentLoadA] = useState<number>(15); // 15 Amps

  // Resistivity: Pure Nickel = 6.99e-8 ohm-m, Steel = 1.43e-7 ohm-m
  const crossSectionMm2 = stripWidthMm * stripThickMm;
  const safeCurrentAmp = stripMaterial === 'pure_nickel' ? Math.round(crossSectionMm2 * 10) : Math.round(crossSectionMm2 * 5.5);

  // Power loss per meter = I^2 * R
  const resPerMeter = stripMaterial === 'pure_nickel' ? (0.07 / crossSectionMm2) : (0.15 / crossSectionMm2);
  const powerLossWPerMeter = (Math.pow(currentLoadA, 2) * resPerMeter).toFixed(1);
  const isOverheating = currentLoadA > safeCurrentAmp;

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="battery-welding-sim">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-earn" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Battery Spot Welding & Nickel Strip Ampacity Sizer
          </h4>
        </div>
        <Badge tone={isOverheating ? 'danger' : 'success'} variant="solid">
          {isOverheating ? 'Overheating Risk (> Safe Ampacity)' : `Safe Continuous: ${safeCurrentAmp}A`}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="block text-body-xs font-medium text-fg mb-1">Busbar Strip Composition</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStripMaterial('pure_nickel')}
                className={`px-3 py-1 rounded text-caption border ${
                  stripMaterial === 'pure_nickel' ? 'border-earn bg-earn/15 text-earn font-bold' : 'border-hairline text-fg-muted'
                }`}
              >
                99.6% Pure Nickel (Low Resistance)
              </button>
              <button
                type="button"
                onClick={() => setStripMaterial('nickel_plated_steel')}
                className={`px-3 py-1 rounded text-caption border ${
                  stripMaterial === 'nickel_plated_steel' ? 'border-earn bg-earn/15 text-earn font-bold' : 'border-hairline text-fg-muted'
                }`}
              >
                Nickel-Plated Steel (High Heat)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Strip Dimensions (Width x Thickness)</span>
              <span className="font-mono text-earn">{stripWidthMm}mm x {stripThickMm}mm</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={stripWidthMm}
                onChange={(e) => setStripWidthMm(parseInt(e.target.value, 10))}
                className="rounded border border-hairline bg-surface-2 px-2.5 py-1 text-body-xs text-fg"
              >
                <option value={6}>6 mm Width</option>
                <option value={8}>8 mm Width</option>
                <option value={10}>10 mm Width</option>
                <option value={15}>15 mm Width</option>
              </select>
              <select
                value={stripThickMm}
                onChange={(e) => setStripThickMm(parseFloat(e.target.value))}
                className="rounded border border-hairline bg-surface-2 px-2.5 py-1 text-body-xs text-fg"
              >
                <option value={0.10}>0.10 mm Thickness</option>
                <option value={0.15}>0.15 mm Thickness</option>
                <option value={0.20}>0.20 mm Thickness</option>
                <option value={0.30}>0.30 mm Thickness</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Continuous Current Load (Amps)</span>
              <span className="font-mono text-earn">{currentLoadA} A</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={currentLoadA}
              onChange={(e) => setCurrentLoadA(parseInt(e.target.value, 10))}
              className="w-full accent-earn"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Continuous Current Rating</span>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {safeCurrentAmp} <span className="text-caption font-normal text-fg-muted">A</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Cross-section = {crossSectionMm2.toFixed(2)} mm²</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">I²R Heat Dissipation</span>
            <div className="font-display text-headline-sm font-semibold text-danger tabular-nums">
              {powerLossWPerMeter} <span className="text-caption font-normal text-fg-muted">W/m</span>
            </div>
            <p className="text-[11px] text-fg-subtle">At {currentLoadA}A continuous</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Welder Pulse Energy</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {Math.round(stripThickMm * 320)} <span className="text-caption font-normal text-fg-muted">Joules</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Clean fusion nugget energy</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Spot Welding Tip Tip</span>
            <div className="font-display text-body-sm font-semibold text-accent">
              Alumina Copper (CuCrZr)
            </div>
            <p className="text-[11px] text-fg-subtle">Zero electrode sticking</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. BLDC Motor Winding & Kv Rating Simulator
   ========================================================================= */
export function BLDCMotorSimulator() {
  const statorSlots = 12; // 12N14P
  const rotorPoles = 14;
  const [turnsPerTooth, setTurnsPerTooth] = useState<number>(14); // turns
  const [statorDiaMm, setStatorDiaMm] = useState<number>(28); // mm (e.g. 2806 motor)

  // Kv is inversely proportional to turns per tooth and stator diameter
  // Kv approx = (320000) / (turnsPerTooth * statorDiaMm)
  const computedKv = Math.max(150, Math.round(340000 / (turnsPerTooth * statorDiaMm)));
  // Torque constant Kt = 60 / (2 * pi * Kv) = 9.55 / Kv (Nm/A)
  const torqueConstantKt = (9.55 / computedKv).toFixed(3);
  // Max RPM at 4S (14.8V)
  const noLoadRpm = Math.round(computedKv * 14.8);

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="bldc-motor-sim">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <RotateCw className="size-4 text-code" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            BLDC Motor Stator Winding & Kv Rating Designer
          </h4>
        </div>
        <Badge tone="code" variant="solid">
          {computedKv} RPM/V (Kv)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Turns Per Tooth (N)</span>
              <span className="font-mono text-code">{turnsPerTooth} Turns</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={turnsPerTooth}
              onChange={(e) => setTurnsPerTooth(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Stator Diameter (mm)</span>
              <span className="font-mono text-code">{statorDiaMm} mm</span>
            </div>
            <input
              type="range"
              min="14"
              max="60"
              step="2"
              value={statorDiaMm}
              onChange={(e) => setStatorDiaMm(parseInt(e.target.value, 10))}
              className="w-full accent-code"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-body-xs">
            <span className="text-fg-subtle">Topology:</span>
            <span className="font-mono font-semibold text-fg">{statorSlots}N {rotorPoles}P (dLRK Star Winding)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Motor Velocity (Kv)</span>
            <div className="font-display text-headline-sm font-semibold text-code tabular-nums">
              {computedKv} <span className="text-caption font-normal text-fg-muted">RPM/V</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Inversely scales with turns</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Torque Constant (Kt)</span>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {torqueConstantKt} <span className="text-caption font-normal text-fg-muted">Nm/A</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Formula: 9.55 / Kv</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">No-Load RPM (at 14.8V)</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {noLoadRpm.toLocaleString()} <span className="text-caption font-normal text-fg-muted">RPM</span>
            </div>
            <p className="text-[11px] text-fg-subtle">4S LiPo power rail</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Magnet Wire Spec</span>
            <div className="font-display text-body-sm font-semibold text-accent">
              Class H (180°C Enamel)
            </div>
            <p className="text-[11px] text-fg-subtle">Dual-coat polyurethane</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. Thermal Heatsink & Dissipation Simulator
   ========================================================================= */
export function ThermalHeatsinkSimulator() {
  const [powerWatts, setPowerWatts] = useState<number>(35); // 35 Watts
  const [ambientTempC, setAmbientTempC] = useState<number>(40); // 40°C Indian summer ambient
  const [coolingMode, setCoolingMode] = useState<'natural' | 'forced'>('natural');

  // Thermal resistances: R_theta_jc = 0.5 °C/W, R_theta_cs = 0.3 °C/W
  // Heatsink to ambient: Natural = 1.8 °C/W, Forced Air = 0.45 °C/W
  const rSa = coolingMode === 'natural' ? 1.8 : 0.45;
  const totalRtheta = 0.5 + 0.3 + rSa;
  const junctionTempC = Math.round(ambientTempC + powerWatts * totalRtheta);
  const isJunctionSafe = junctionTempC <= 110;

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="thermal-heatsink-sim">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Thermometer className="size-4 text-danger" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Power Semiconductor Heatsink & Junction Temp Engine
          </h4>
        </div>
        <Badge tone={isJunctionSafe ? 'success' : 'danger'} variant="solid">
          Junction: {junctionTempC}°C ({isJunctionSafe ? 'Safe < 110°C' : 'Thermal Throttling / Meltdown Risk'})
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="block text-body-xs font-medium text-fg mb-1">Airflow Convection Regime</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCoolingMode('natural')}
                className={`px-3 py-1 rounded text-caption border ${
                  coolingMode === 'natural' ? 'border-danger bg-danger/15 text-danger font-bold' : 'border-hairline text-fg-muted'
                }`}
              >
                Passive Natural Convection (No Fan)
              </button>
              <button
                type="button"
                onClick={() => setCoolingMode('forced')}
                className={`px-3 py-1 rounded text-caption border ${
                  coolingMode === 'forced' ? 'border-danger bg-danger/15 text-danger font-bold' : 'border-hairline text-fg-muted'
                }`}
              >
                Active Forced Air (40mm Fan)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Heat Dissipation (P_diss)</span>
              <span className="font-mono text-danger">{powerWatts} Watts</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={powerWatts}
              onChange={(e) => setPowerWatts(parseInt(e.target.value, 10))}
              className="w-full accent-danger"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Ambient Temperature (T_ambient)</span>
              <span className="font-mono text-danger">{ambientTempC}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              step="2"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(parseInt(e.target.value, 10))}
              className="w-full accent-danger"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Semiconductor Junction Temp (Tj)</span>
            <div className={`font-display text-headline-sm font-semibold tabular-nums ${isJunctionSafe ? 'text-success' : 'text-danger'}`}>
              {junctionTempC} <span className="text-caption font-normal text-fg-muted">°C</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Max rating: 125°C to 150°C</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Total Thermal Resistance</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {totalRtheta.toFixed(2)} <span className="text-caption font-normal text-fg-muted">°C/W</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Rθ_jc + Rθ_cs + Rθ_sa</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Heatsink Volume Needed</span>
            <div className="font-display text-headline-sm font-semibold text-accent tabular-nums">
              {coolingMode === 'natural' ? '85 cm³' : '22 cm³'}
            </div>
            <p className="text-[11px] text-fg-subtle">Extruded aluminum AL6063</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Interface Material</span>
            <div className="font-display text-body-sm font-semibold text-fg">
              Phase Change / Thermal Pad
            </div>
            <p className="text-[11px] text-fg-subtle">6.0 W/mK conductivity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. Cleanroom Particle Count & ISO 14644-1 Airflow Sizer
   ========================================================================= */
export function CleanroomSimulator() {
  const [roomAreaM2, setRoomAreaM2] = useState<number>(30); // 30 m2
  const [ceilingHeightM, setCeilingHeightM] = useState<number>(2.8); // 2.8m
  const [isoClass, setIsoClass] = useState<5 | 6 | 7 | 8>(6);

  const ISO_SPECS = {
    5: { name: 'ISO Class 5 (Class 100 - Silicon Photolithography)', ach: 240, maxParticles: 3520 },
    6: { name: 'ISO Class 6 (Class 1,000 - Micro-SMT & Optical Bonding)', ach: 90, maxParticles: 35200 },
    7: { name: 'ISO Class 7 (Class 10,000 - Mobile Box Build Assembly)', ach: 45, maxParticles: 352000 },
    8: { name: 'ISO Class 8 (Class 100,000 - General Electronics Inspection)', ach: 20, maxParticles: 3520000 },
  };

  const selected = ISO_SPECS[isoClass];
  const roomVolumeM3 = Math.round(roomAreaM2 * ceilingHeightM);
  // Total airflow in CFM: (Volume in m3 * 35.315 * ACH) / 60
  const airflowCfm = Math.round((roomVolumeM3 * 35.315 * selected.ach) / 60);
  // Standard 2ft x 4ft Fan Filter Unit (FFU) delivers ~650 CFM
  const ffuCount = Math.max(1, Math.ceil(airflowCfm / 650));

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-surface-1 p-5 shadow-sm" data-testid="cleanroom-sim">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-accent" />
          <h4 className="font-display text-body-md font-semibold text-fg">
            Cleanroom Particle Count & ISO 14644-1 HVAC Sizer
          </h4>
        </div>
        <Badge tone="accent" variant="solid">
          {ffuCount} HEPA Filter Units Required
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="block text-body-xs font-medium text-fg mb-1">Target Cleanroom Grade</label>
            <select
              value={isoClass}
              onChange={(e) => setIsoClass(parseInt(e.target.value, 10) as 5 | 6 | 7 | 8)}
              className="w-full rounded border border-hairline bg-surface-2 px-3 py-1.5 text-body-sm text-fg"
            >
              <option value={5}>ISO Class 5 (Class 100 - Wafer Fab / MEMS)</option>
              <option value={6}>ISO Class 6 (Class 1,000 - Micro-SMT & OLED)</option>
              <option value={7}>ISO Class 7 (Class 10,000 - Mobile Assembly)</option>
              <option value={8}>ISO Class 8 (Class 100,000 - General Inspection)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Cleanroom Floor Area</span>
              <span className="font-mono text-accent">{roomAreaM2} m² (Volume: {roomVolumeM3} m³)</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={roomAreaM2}
              onChange={(e) => setRoomAreaM2(parseInt(e.target.value, 10))}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <div className="flex justify-between text-body-xs font-medium text-fg mb-1">
              <span>Ceiling Height</span>
              <span className="font-mono text-accent">{ceilingHeightM} meters</span>
            </div>
            <input
              type="range"
              min="2.2"
              max="4.5"
              step="0.1"
              value={ceilingHeightM}
              onChange={(e) => setCeilingHeightM(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Air Changes / Hour (ACH)</span>
            <div className="font-display text-headline-sm font-semibold text-accent tabular-nums">
              {selected.ach} <span className="text-caption font-normal text-fg-muted">ACH</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Per ISO 14644-1 standard</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Total Supply Airflow</span>
            <div className="font-display text-headline-sm font-semibold text-fg tabular-nums">
              {airflowCfm.toLocaleString()} <span className="text-caption font-normal text-fg-muted">CFM</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Filtered laminar air column</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">Max 0.5µm Particles</span>
            <div className="font-display text-headline-sm font-semibold text-success tabular-nums">
              {(selected.maxParticles / 1000).toFixed(1)}k <span className="text-caption font-normal text-fg-muted">/ m³</span>
            </div>
            <p className="text-[11px] text-fg-subtle">Aerosol laser counter limit</p>
          </div>

          <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1">
            <span className="text-caption text-fg-subtle">HEPA Filter Standard</span>
            <div className="font-display text-body-sm font-semibold text-fg">
              H14 (99.995% at 0.3µm)
            </div>
            <p className="text-[11px] text-fg-subtle">With positive room pressure (+15Pa)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
