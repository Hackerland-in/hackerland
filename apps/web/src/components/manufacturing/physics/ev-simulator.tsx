'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Badge, Button } from '@hackerland/ui';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  Plus,
  Trash2,
  Sliders,
} from 'lucide-react';
import { calculateAeroDrag } from './physics-engine';

export interface CustomEvComponent {
  id: string;
  name: string;
  category: 'Battery' | 'Inverter' | 'Motors' | 'Thermal';
  capacityDeltaKwh: number;
  powerDeltaKw: number;
  efficiencyGainPercent: number;
  regenBonusPercent: number;
  enabled: boolean;
}

const DEFAULT_EV_MODS: CustomEvComponent[] = [
  {
    id: 'sic-inverter',
    name: '800V Silicon-Carbide (SiC) Dual Inverters',
    category: 'Inverter',
    capacityDeltaKwh: 0,
    powerDeltaKw: 45,
    efficiencyGainPercent: 4.2,
    regenBonusPercent: 8,
    enabled: true,
  },
  {
    id: 'liquid-chiller',
    name: 'Direct-to-Cell Dielectric Immersion Cooling System',
    category: 'Thermal',
    capacityDeltaKwh: 0,
    powerDeltaKw: 0,
    efficiencyGainPercent: 2.5,
    regenBonusPercent: 12, // Prevents thermal derating under heavy regen
    enabled: true,
  },
  {
    id: 'solid-state-pack',
    name: 'Next-Gen Silicon-Anode Solid-State Cells (+25 kWh)',
    category: 'Battery',
    capacityDeltaKwh: 25,
    powerDeltaKw: 60,
    efficiencyGainPercent: 3.0,
    regenBonusPercent: 5,
    enabled: false,
  },
];

export function EvPowertrainSimulator() {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [acceleratorPercent, setAcceleratorPercent] = useState<number>(65);
  const [regenLevel, setRegenLevel] = useState<number>(3); // 0 (coast) to 3 (one-pedal max regen)

  // Architecture Specs
  const [systemVoltage, setSystemVoltage] = useState<400 | 800>(800);
  const [baseCapacityKwh] = useState<number>(85); // 85 kWh pack
  const [frontMotorKw] = useState<number>(180);
  const [rearMotorKw] = useState<number>(320);

  // Dynamic States
  const [, setSpeedKmh] = useState<number>(105);
  const [batterySocPercent, setBatterySocPercent] = useState<number>(78.4);
  const [packTempCelsius, setPackTempCelsius] = useState<number>(34.2);
  const [instantKwPower, setInstantKwPower] = useState<number>(28); // Positive = discharge, negative = regen
  const [, setDistanceKm] = useState<number>(142.5);
  const [, setTotalEnergyConsumedKwh] = useState<number>(24.8);
  const [energyRegeneratedKwh, setEnergyRegeneratedKwh] = useState<number>(4.2);

  // Custom Components
  const [customComponents, setCustomComponents] = useState<CustomEvComponent[]>(DEFAULT_EV_MODS);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompCategory] = useState<'Battery' | 'Inverter' | 'Motors' | 'Thermal'>('Battery');
  const [newCompKwh, setNewCompKwh] = useState<number>(15);
  const [newCompKw, setNewCompKw] = useState<number>(30);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Aggregate custom mods
  const customMods = useMemo(() => {
    return customComponents
      .filter((c) => c.enabled)
      .reduce(
        (acc, item) => ({
          capacityDeltaKwh: acc.capacityDeltaKwh + item.capacityDeltaKwh,
          powerDeltaKw: acc.powerDeltaKw + item.powerDeltaKw,
          efficiencyGainPercent: acc.efficiencyGainPercent + item.efficiencyGainPercent,
          regenBonusPercent: acc.regenBonusPercent + item.regenBonusPercent,
        }),
        { capacityDeltaKwh: 0, powerDeltaKw: 0, efficiencyGainPercent: 0, regenBonusPercent: 0 }
      );
  }, [customComponents]);

  const totalPackCapacityKwh = baseCapacityKwh + customMods.capacityDeltaKwh;
  const totalMaxPowerKw = frontMotorKw + rearMotorKw + customMods.powerDeltaKw;
  const totalHpEquivalent = Math.round(totalMaxPowerKw * 1.34102);

  // Range estimation
  const avgWhPerKm = 175 * (1 - customMods.efficiencyGainPercent / 100);
  const remainingRangeKm = Math.max(0, (totalPackCapacityKwh * (batterySocPercent / 100) * 1000) / avgWhPerKm);

  // ------------------------------------------
  // Real-time EV Powertrain Physics Loop
  // ------------------------------------------
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (isRunning) {
        setSpeedKmh((prevKmh) => {
          const v = (prevKmh * 1000) / 3600; // m/s
          const totalVehicleMassKg = 2150; // EV battery mass
          const cdA = 0.23 * 2.35; // Aerodynamic drag
          const aeroDrag = calculateAeroDrag(v, cdA, 1.225);
          const rollResistance = 0.010 * totalVehicleMassKg * 9.80665;

          // Power draw / Regen
          let powerKw = 0;
          let ax = 0;

          if (acceleratorPercent > 5) {
            // Acceleration mode
            const demandKw = totalMaxPowerKw * (acceleratorPercent / 100);
            powerKw = demandKw;
            const tractiveForceN = v > 1 ? (demandKw * 1000 * 0.94) / v : (demandKw * 1000 * 0.94);
            ax = (tractiveForceN - aeroDrag - rollResistance) / totalVehicleMassKg;
          } else {
            // One-pedal regen braking
            const maxRegenKw = 150 * (1 + customMods.regenBonusPercent / 100);
            const appliedRegenKw = (regenLevel / 3) * maxRegenKw;
            powerKw = -appliedRegenKw; // negative = charging
            const regenBrakingForceN = v > 1 ? (appliedRegenKw * 1000) / v : 1200;
            ax = -(regenBrakingForceN + aeroDrag + rollResistance) / totalVehicleMassKg;
          }

          setInstantKwPower(powerKw);

          // Energy consumption & Battery SOC update
          const energyKwhStep = (powerKw * (dt / 3600));
          setBatterySocPercent((soc) => {
            const deltaSoc = (energyKwhStep / totalPackCapacityKwh) * 100;
            return Math.max(0, Math.min(100, soc - deltaSoc));
          });

          if (powerKw > 0) {
            setTotalEnergyConsumedKwh((e) => e + energyKwhStep);
          } else {
            setEnergyRegeneratedKwh((e) => e - energyKwhStep);
          }

          // Battery pack thermal accumulation (I^2 * R heating)
          const currentAmps = (Math.abs(powerKw) * 1000) / systemVoltage;
          const heatRate = Math.pow(currentAmps, 1.4) * 0.0001;
          const coolingRate = 0.035;
          setPackTempCelsius((temp) => Math.min(65, Math.max(22, temp + (heatRate - coolingRate) * dt)));

          let newV = v + ax * dt;
          if (newV < 0) newV = 0;

          setDistanceKm((d) => d + (newV * dt) / 1000);
          return (newV * 3600) / 1000;
        });
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [
    isRunning,
    acceleratorPercent,
    regenLevel,
    totalMaxPowerKw,
    totalPackCapacityKwh,
    systemVoltage,
    customMods,
  ]);

  // ------------------------------------------
  // Canvas: Energy Flow & Inverter Schematic Visualizer
  // ------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleOffset = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      const isDischarging = instantKwPower >= 0;
      particleOffset += isDischarging ? 1.5 : -1.5;

      ctx.save();
      ctx.translate(w / 2, h / 2);

      // --- Nodes Coordinates ---
      const batteryX = -220;
      const inverterX = -40;
      const frontMotorX = 140;
      const rearMotorX = 220;

      // Connecting High-Voltage Bus Lines
      ctx.strokeStyle = isDischarging ? '#38bdf8' : '#10b981';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -particleOffset;

      ctx.beginPath();
      // Battery to Inverter
      ctx.moveTo(batteryX + 50, 0);
      ctx.lineTo(inverterX - 40, 0);
      // Inverter to Motors
      ctx.moveTo(inverterX + 40, 0);
      ctx.lineTo(frontMotorX - 30, -40);
      ctx.moveTo(inverterX + 40, 0);
      ctx.lineTo(rearMotorX - 30, 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // 1. High-Voltage Battery Pack Node
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(batteryX - 50, -45, 100, 90, 8);
      ctx.fill();
      ctx.stroke();

      // SOC fill bar
      ctx.fillStyle = batterySocPercent > 20 ? '#10b981' : '#f43f5e';
      const socFillHeight = (batterySocPercent / 100) * 76;
      ctx.fillRect(batteryX - 44, 40 - socFillHeight, 88, socFillHeight);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${batterySocPercent.toFixed(1)}%`, batteryX, 5);
      ctx.font = '9px sans-serif';
      ctx.fillText(`${totalPackCapacityKwh} kWh`, batteryX, 20);

      // 2. SiC Dual Inverter Node
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(inverterX - 40, -40, 80, 80, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('SiC Inverter', inverterX, -10);
      ctx.fillText(`${systemVoltage}V Arch`, inverterX, 6);
      ctx.fillStyle = '#a855f7';
      ctx.fillText('98.5% Eff', inverterX, 22);

      // 3. Front E-Motor Node
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(frontMotorX - 30, -75, 70, 50, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('Front Motor', frontMotorX + 5, -55);
      ctx.fillText(`${frontMotorKw} kW`, frontMotorX + 5, -40);

      // 4. Rear E-Motor Node
      ctx.beginPath();
      ctx.roundRect(rearMotorX - 30, 25, 70, 50, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillText('Rear Motor', rearMotorX + 5, 45);
      ctx.fillText(`${rearMotorKw} kW`, rearMotorX + 5, 60);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [instantKwPower, batterySocPercent, systemVoltage, totalPackCapacityKwh, frontMotorKw, rearMotorKw]);

  // Handle custom component addition
  const handleAddCustomMod = () => {
    if (!newCompName.trim()) return;
    const newComp: CustomEvComponent = {
      id: `ev-mod-${Date.now()}`,
      name: newCompName.trim(),
      category: newCompCategory,
      capacityDeltaKwh: Number(newCompKwh),
      powerDeltaKw: Number(newCompKw),
      efficiencyGainPercent: 3.5,
      regenBonusPercent: 5,
      enabled: true,
    };
    setCustomComponents((prev) => [...prev, newComp]);
    setNewCompName('');
  };

  const handleToggleMod = (id: string) => {
    setCustomComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleDeleteMod = (id: string) => {
    setCustomComponents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-1 border border-hairline shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-bold uppercase tracking-wider text-accent">
              Electric Vehicle Powertrain Studio
            </span>
            <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
              800V SiC & Regenerative Braking
            </Badge>
          </div>
          <h2 className="text-heading-md font-display font-bold text-fg">
            EV Battery, Inverter & Dual-Motor Powertrain Simulator
          </h2>
          <p className="text-body-sm text-fg-muted mt-0.5">
            Electrochemical pack degradation, cell internal resistance ($I^2R$), instantaneous kW power flow, and kinetic regenerative capture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="gap-1.5"
          >
            {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
            <span>{isRunning ? 'Power Down EV' : 'Power On HV Contactors'}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setBatterySocPercent(100);
              setTotalEnergyConsumedKwh(0);
              setEnergyRegeneratedKwh(0);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" />
            <span>Supercharge 100%</span>
          </Button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 bg-surface-1 border-hairline overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-hairline/60">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-accent" />
                <span className="text-caption font-mono uppercase font-bold text-fg">
                  High-Voltage Energy Flow & Inverter Bus
                </span>
              </div>
              <Badge tone={instantKwPower >= 0 ? 'accent' : 'success'} variant="outline" className="font-mono text-caption">
                {instantKwPower >= 0 ? `Discharging: ${instantKwPower.toFixed(0)} kW` : `Regenerating: ${Math.abs(instantKwPower).toFixed(0)} kW`}
              </Badge>
            </div>

            <canvas
              ref={canvasRef}
              width={760}
              height={290}
              className="w-full h-[260px] sm:h-[290px] rounded-xl bg-slate-950 border border-hairline shadow-inner block"
            />

            {/* EV Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-hairline">
              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Estimated Range</span>
                <span className="text-heading-md font-mono font-bold text-emerald-400">
                  {Math.round(remainingRangeKm)} <span className="text-caption text-fg-muted">km</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Consumption: {avgWhPerKm.toFixed(0)} Wh/km
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Pack Temperature</span>
                <span className={`text-heading-md font-mono font-bold ${packTempCelsius > 48 ? 'text-rose-400' : 'text-fg'}`}>
                  {packTempCelsius.toFixed(1)}°C
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Active Chiller: Running
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Energy Recaptured</span>
                <span className="text-heading-md font-mono font-bold text-accent">
                  {energyRegeneratedKwh.toFixed(2)} <span className="text-caption text-fg-muted">kWh</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  One-Pedal Regen Level {regenLevel}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Total Output</span>
                <span className="text-heading-md font-mono font-bold text-fg">
                  {totalHpEquivalent} <span className="text-caption text-fg-muted">HP</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Dual PMSM ({totalMaxPowerKw} kW)
                </span>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <Card className="p-5 bg-surface-1 border-hairline space-y-4">
            <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
              <Sliders className="size-4 text-accent" />
              Powertrain Drive By Wire Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Accelerator Pedal (%)</span>
                  <span className="font-bold text-emerald-400">{acceleratorPercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={acceleratorPercent}
                  onChange={(e) => setAcceleratorPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 mt-1.5"
                />
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Regenerative Braking Level</span>
                  <span className="font-bold text-accent">Level {regenLevel}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={regenLevel}
                  onChange={(e) => setRegenLevel(Number(e.target.value))}
                  className="w-full accent-accent mt-1.5"
                />
                <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                  <span>0 (Coast)</span>
                  <span>1 (Low)</span>
                  <span>2 (Medium)</span>
                  <span>3 (One-Pedal)</span>
                </div>
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Voltage Architecture</span>
                  <span className="font-bold text-fg">{systemVoltage}V</span>
                </label>
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setSystemVoltage(400)}
                    className={`flex-1 py-1.5 rounded text-caption font-mono font-medium border ${
                      systemVoltage === 400 ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-hairline bg-surface-2 text-fg-muted'
                    }`}
                  >
                    400V Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemVoltage(800)}
                    className={`flex-1 py-1.5 rounded text-caption font-mono font-medium border ${
                      systemVoltage === 800 ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-hairline bg-surface-2 text-fg-muted'
                    }`}
                  >
                    800V Ultra-Fast
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Custom Components */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-1.5">
                <Zap className="size-4 text-accent" />
                Custom EV Components
              </h3>
              <Badge tone="accent" variant="outline" className="font-mono text-[10px]">
                {totalPackCapacityKwh} kWh / {totalMaxPowerKw} kW
              </Badge>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {customComponents.map((comp) => (
                <div
                  key={comp.id}
                  className={`p-2.5 rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                    comp.enabled
                      ? 'border-hairline-strong bg-surface-2'
                      : 'border-hairline/40 bg-surface-2/40 opacity-60'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={comp.enabled}
                        onChange={() => handleToggleMod(comp.id)}
                        className="rounded accent-accent size-3.5"
                      />
                      <span className="font-medium text-caption text-fg truncate">
                        {comp.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 text-[10px] font-mono text-fg-muted mt-1 ml-5">
                      {comp.capacityDeltaKwh > 0 && <span className="text-emerald-400 font-bold">+{comp.capacityDeltaKwh} kWh Pack</span>}
                      {comp.powerDeltaKw > 0 && <span className="text-accent">+{comp.powerDeltaKw} kW Motor</span>}
                      {comp.efficiencyGainPercent > 0 && <span>+{comp.efficiencyGainPercent}% Efficiency</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMod(comp.id)}
                    className="text-fg-muted hover:text-rose-400 p-1 rounded"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-hairline/60 space-y-2">
              <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
                Fabricate Custom EV Subsystem
              </span>
              <input
                type="text"
                placeholder="Component name (e.g. SiC Inverter)"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-surface-2 border border-hairline text-caption text-fg"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Capacity Delta (kWh)</span>
                  <input
                    type="number"
                    value={newCompKwh}
                    onChange={(e) => setNewCompKwh(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Power Delta (kW)</span>
                  <input
                    type="number"
                    value={newCompKw}
                    onChange={(e) => setNewCompKw(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full gap-1.5 text-caption mt-1"
                onClick={handleAddCustomMod}
                disabled={!newCompName.trim()}
              >
                <Plus className="size-3.5" />
                <span>Integrate High-Voltage Mod</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
