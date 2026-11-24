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

export interface CustomRocketComponent {
  id: string;
  name: string;
  category: 'Propulsion' | 'Structures' | 'Avionics' | 'Boosters';
  dryMassDeltaKg: number;
  ispDeltaSec: number;
  thrustDeltaKn: number;
  enabled: boolean;
}

const DEFAULT_ROCKET_MODS: CustomRocketComponent[] = [
  {
    id: 'aerospike-nozzle',
    name: 'Altitude-Compensating Toroidal Aerospike Nozzle',
    category: 'Propulsion',
    dryMassDeltaKg: 120,
    ispDeltaSec: 22, // Increases sea-level efficiency
    thrustDeltaKn: 80,
    enabled: true,
  },
  {
    id: 'carbon-composite-tank',
    name: 'Autoclave-Cured Carbon-Composite Cryogenic Tanks',
    category: 'Structures',
    dryMassDeltaKg: -850,
    ispDeltaSec: 0,
    thrustDeltaKn: 0,
    enabled: true,
  },
  {
    id: 'grid-fins',
    name: 'Titanium Hypersonic Grid Fins & TVC Actuators',
    category: 'Avionics',
    dryMassDeltaKg: 180,
    ispDeltaSec: 0,
    thrustDeltaKn: 0,
    enabled: true,
  },
];

export function RocketTrajectorySimulator() {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [throttlePercent, setThrottlePercent] = useState<number>(100);
  const [currentStage, setCurrentStage] = useState<1 | 2>(1);

  // Flight Telemetry States
  const [altitudeMeters, setAltitudeMeters] = useState<number>(0);
  const [velocityMps, setVelocityMps] = useState<number>(0);
  const [flightTimeSec, setFlightTimeSec] = useState<number>(0);
  const [propellantMassKg, setPropellantMassKg] = useState<number>(45000); // 45 tonnes fuel
  const [dynamicPressureKpa, setDynamicPressureKpa] = useState<number>(0);
  const [isMaxQPassed, setIsMaxQPassed] = useState<boolean>(false);
  const [stageSeparationDone, setStageSeparationDone] = useState<boolean>(false);

  // Custom Components
  const [customComponents, setCustomComponents] = useState<CustomRocketComponent[]>(DEFAULT_ROCKET_MODS);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompCategory, setNewCompCategory] = useState<'Propulsion' | 'Structures' | 'Avionics' | 'Boosters'>('Propulsion');
  const [newCompThrust, setNewCompThrust] = useState<number>(50);
  const [newCompMass, setNewCompMass] = useState<number>(-200);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Aggregate custom mods
  const customMods = useMemo(() => {
    return customComponents
      .filter((c) => c.enabled)
      .reduce(
        (acc, item) => ({
          dryMassDeltaKg: acc.dryMassDeltaKg + item.dryMassDeltaKg,
          ispDeltaSec: acc.ispDeltaSec + item.ispDeltaSec,
          thrustDeltaKn: acc.thrustDeltaKn + item.thrustDeltaKn,
        }),
        { dryMassDeltaKg: 0, ispDeltaSec: 0, thrustDeltaKn: 0 }
      );
  }, [customComponents]);

  // Rocket Stage Specs
  const stage1DryMass = 3200 + customMods.dryMassDeltaKg;
  const stage1ThrustKn = 780 + customMods.thrustDeltaKn;
  const stage1IspSec = 310 + customMods.ispDeltaSec;

  const totalCurrentMassKg = stage1DryMass + propellantMassKg;
  const targetOrbitalVelocityMps = 7800; // ~7.8 km/s LEO orbital velocity

  // ------------------------------------------
  // Real-time Rocket Launch Flight Dynamics Loop
  // ------------------------------------------
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (isRunning && propellantMassKg > 0) {
        // Thrust force
        const thrustN = (stage1ThrustKn * 1000) * (throttlePercent / 100);

        // Mass burn rate: m_dot = Thrust / (Isp * g0)
        const g0 = 9.80665;
        const massFlowRateKgPerSec = thrustN / (stage1IspSec * g0);
        const fuelBurnedStep = massFlowRateKgPerSec * dt;

        setPropellantMassKg((m) => Math.max(0, m - fuelBurnedStep));
        setFlightTimeSec((t) => t + dt);

        // Atmospheric density based on altitude (barometric exponential decay)
        const scaleHeight = 8500; // 8.5 km
        const seaLevelRho = 1.225;
        const rho = seaLevelRho * Math.exp(-altitudeMeters / scaleHeight);

        // Dynamic pressure Q = 0.5 * rho * v^2
        const qPa = 0.5 * rho * (velocityMps * velocityMps);
        setDynamicPressureKpa(qPa / 1000);
        if (qPa / 1000 > 35) {
          setIsMaxQPassed(true);
        }

        // Aerodynamic drag
        const rocketCd = 0.28;
        const crossSectionArea = Math.PI * Math.pow(1.85, 2); // 3.7m diameter
        const aeroDragN = 0.5 * rho * (velocityMps * velocityMps) * rocketCd * crossSectionArea;

        // Gravity varies slightly with altitude
        const earthRadius = 6371000;
        const g = g0 * Math.pow(earthRadius / (earthRadius + altitudeMeters), 2);
        const gravityForceN = totalCurrentMassKg * g;

        // Pitch schedule (Gravity Turn): pitch angles over from 90° vertical to 25° horizontal
        const pitchAngleDeg = Math.max(25, 90 - (altitudeMeters / 1500));
        const pitchRad = (pitchAngleDeg * Math.PI) / 180;

        // Net vertical & horizontal acceleration
        const netThrustAlongTrajectory = thrustN - aeroDragN;
        const verticalForce = netThrustAlongTrajectory * Math.sin(pitchRad) - gravityForceN;
        const accMps2 = verticalForce / totalCurrentMassKg;

        setVelocityMps((v) => Math.max(0, v + accMps2 * dt));
        setAltitudeMeters((alt) => alt + velocityMps * Math.sin(pitchRad) * dt);

        // Stage 1 burnout & staging check
        if (propellantMassKg < 500 && !stageSeparationDone) {
          setStageSeparationDone(true);
          setCurrentStage(2);
        }
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [
    isRunning,
    propellantMassKg,
    throttlePercent,
    stage1ThrustKn,
    stage1IspSec,
    altitudeMeters,
    velocityMps,
    totalCurrentMassKg,
    stageSeparationDone,
  ]);

  // ------------------------------------------
  // Canvas: Rocket Ascent & Plume Visualizer
  // ------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      ctx.save();
      ctx.translate(w / 2, h / 2);

      // Sky background gradient according to altitude (Day sky -> Stratosphere -> Space black)
      const spaceAltitudeRatio = Math.min(1, altitudeMeters / 80000); // 80km Karman boundary
      const skyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      if (spaceAltitudeRatio > 0.8) {
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(1, '#090d16');
      } else if (spaceAltitudeRatio > 0.3) {
        skyGrad.addColorStop(0, '#0c4a6e');
        skyGrad.addColorStop(1, '#0284c7');
      } else {
        skyGrad.addColorStop(0, '#0369a1');
        skyGrad.addColorStop(1, '#38bdf8');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Stars if high altitude
      if (spaceAltitudeRatio > 0.5) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 25; i++) {
          const sx = Math.sin(i * 123) * (w / 2);
          const sy = Math.cos(i * 456) * (h / 2);
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }

      // Rocket Pitch Orientation
      const pitchAngleDeg = Math.max(25, 90 - (altitudeMeters / 1500));
      const pitchRad = ((90 - pitchAngleDeg) * Math.PI) / 180;
      ctx.rotate(pitchRad);

      // Rocket Body (Stage 1 + Stage 2)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      // Stage 1 Booster
      ctx.fillRect(-14, 0, 28, 70);
      ctx.strokeRect(-14, 0, 28, 70);

      // Stage 2 & Interstage
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-13, -40, 26, 40);

      // Payload Fairing Nosecone
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-13, -40);
      ctx.lineTo(0, -75);
      ctx.lineTo(13, -40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rocket Engine Exhaust Plume (Flames)
      if (propellantMassKg > 0 && throttlePercent > 10) {
        const flameLength = 40 + Math.random() * 25;
        const flameGrad = ctx.createLinearGradient(0, 70, 0, 70 + flameLength);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#f59e0b');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-10, 70);
        ctx.lineTo(0, 70 + flameLength);
        ctx.lineTo(10, 70);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [altitudeMeters, propellantMassKg, throttlePercent]);

  // Handle custom component addition
  const handleAddCustomMod = () => {
    if (!newCompName.trim()) return;
    const newComp: CustomRocketComponent = {
      id: `rocket-mod-${Date.now()}`,
      name: newCompName.trim(),
      category: newCompCategory,
      dryMassDeltaKg: Number(newCompMass),
      thrustDeltaKn: Number(newCompThrust),
      ispDeltaSec: 15,
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
              Aerospace Orbital Mechanics Studio
            </span>
            <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
              Tsiolkovsky Equation & Max-Q Aerodynamics
            </Badge>
          </div>
          <h2 className="text-heading-md font-display font-bold text-fg">
            Multi-Stage Rocket Launch & Orbital Trajectory Simulator
          </h2>
          <p className="text-body-sm text-fg-muted mt-0.5">
            Variable mass fuel depletion (dm/dt), barometric air density lapse, aerodynamic Max-Q dynamic pressure, and gravity-turn pitch to orbit.
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
            <span>{isRunning ? 'Hold Countdown' : 'Ignition & Launch'}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setAltitudeMeters(0);
              setVelocityMps(0);
              setFlightTimeSec(0);
              setPropellantMassKg(45000);
              setIsMaxQPassed(false);
              setStageSeparationDone(false);
              setCurrentStage(1);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" />
            <span>Reset Pad T-0</span>
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
                  Atmospheric Ascent Profile & Plume Trajectory
                </span>
              </div>
              <Badge tone={dynamicPressureKpa > 32 ? 'danger' : 'accent'} variant="outline" className="font-mono text-caption">
                Q: {dynamicPressureKpa.toFixed(1)} kPa {dynamicPressureKpa > 32 ? '(Max-Q Stress)' : ''}
              </Badge>
            </div>

            <canvas
              ref={canvasRef}
              width={760}
              height={290}
              className="w-full h-[260px] sm:h-[290px] rounded-xl bg-slate-950 border border-hairline shadow-inner block"
            />

            {/* Orbital Flight Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-hairline">
              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Altitude</span>
                <span className="text-heading-md font-mono font-bold text-fg">
                  {(altitudeMeters / 1000).toFixed(2)} <span className="text-caption text-fg-muted">km</span>
                </span>
                <span className="text-[10px] font-mono text-accent block">
                  {altitudeMeters > 80000 ? 'Space (Karman Line)' : 'Troposphere / Meso'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Velocity</span>
                <span className="text-heading-md font-mono font-bold text-emerald-400">
                  {velocityMps.toFixed(0)} <span className="text-caption text-fg-muted">m/s</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Mach {(velocityMps / 340).toFixed(1)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Propellant Mass</span>
                <span className={`text-heading-md font-mono font-bold ${propellantMassKg < 5000 ? 'text-rose-400' : 'text-fg'}`}>
                  {(propellantMassKg / 1000).toFixed(1)} <span className="text-caption text-fg-muted">T</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Stage {currentStage} Burning
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Orbital Target</span>
                <span className="text-heading-md font-mono font-bold text-accent">
                  {((velocityMps / targetOrbitalVelocityMps) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  LEO: {targetOrbitalVelocityMps} m/s
                </span>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <Card className="p-5 bg-surface-1 border-hairline space-y-4">
            <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
              <Sliders className="size-4 text-accent" />
              Main Engine Cutoff (MECO) & Throttle
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>First-Stage Throttle (%)</span>
                  <span className="font-bold text-emerald-400">{throttlePercent}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={throttlePercent}
                  onChange={(e) => setThrottlePercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 mt-1.5"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-surface-2 border border-hairline flex-1">
                  <span className="text-[11px] font-mono text-fg-muted block uppercase">Flight Clock</span>
                  <span className="text-heading-sm font-mono font-bold text-fg">
                    T+ {flightTimeSec.toFixed(1)}s
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-2 border border-hairline flex-1">
                  <span className="text-[11px] font-mono text-fg-muted block uppercase">Staging Status</span>
                  <span className={`text-caption font-mono font-bold ${stageSeparationDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {stageSeparationDone ? 'Stage 2 Active' : 'Booster Attached'}
                  </span>
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
                Custom Rocket Components
              </h3>
              <Badge tone="accent" variant="outline" className="font-mono text-[10px]">
                {stage1ThrustKn} kN / {stage1IspSec}s Isp
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
                      {comp.thrustDeltaKn > 0 && <span className="text-emerald-400 font-bold">+{comp.thrustDeltaKn} kN Thrust</span>}
                      {comp.ispDeltaSec > 0 && <span className="text-accent">+{comp.ispDeltaSec}s Isp</span>}
                      <span>{comp.dryMassDeltaKg >= 0 ? `+${comp.dryMassDeltaKg}` : comp.dryMassDeltaKg}kg Dry</span>
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
                Manufacture Aerospace Hardware
              </span>
              <input
                type="text"
                placeholder="Component name (e.g. Methane Engine)"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-surface-2 border border-hairline text-caption text-fg"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Thrust Delta (kN)</span>
                  <input
                    type="number"
                    value={newCompThrust}
                    onChange={(e) => setNewCompThrust(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Dry Mass Delta (kg)</span>
                  <input
                    type="number"
                    value={newCompMass}
                    onChange={(e) => setNewCompMass(Number(e.target.value))}
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
                <span>Integrate Rocket Stage Mod</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
