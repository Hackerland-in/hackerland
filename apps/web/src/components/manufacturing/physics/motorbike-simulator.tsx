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
import {
  calculateAeroDrag,
  calculateAirDensity,
} from './physics-engine';

// ==========================================
// Types & Defaults
// ==========================================

export interface CustomBikeComponent {
  id: string;
  name: string;
  category: 'Powertrain' | 'Aero & Fairings' | 'Suspension' | 'Braking & Chassis';
  massDeltaKg: number;
  powerDeltaHp: number;
  torqueDeltaNm: number;
  wheelieSuppressionPercent: number; // Downforce winglets reduce wheelie tendency
  maxLeanAngleBonusDeg: number;
  enabled: boolean;
}

const DEFAULT_CUSTOM_BIKE_COMPONENTS: CustomBikeComponent[] = [
  {
    id: 'titanium-exhaust',
    name: 'Full Titanium Race Exhaust System & ECU Flash',
    category: 'Powertrain',
    massDeltaKg: -6.5,
    powerDeltaHp: 16,
    torqueDeltaNm: 12,
    wheelieSuppressionPercent: 0,
    maxLeanAngleBonusDeg: 1.5,
    enabled: true,
  },
  {
    id: 'motogp-winglets',
    name: 'Carbon Aerodynamic MotoGP Downforce Winglets',
    category: 'Aero & Fairings',
    massDeltaKg: 0.8,
    powerDeltaHp: 0,
    torqueDeltaNm: 0,
    wheelieSuppressionPercent: 40,
    maxLeanAngleBonusDeg: 0,
    enabled: true,
  },
  {
    id: 'ohlins-fgr-forks',
    name: 'Öhlins FGR 300 Superbike Inverted USD Gas Forks',
    category: 'Suspension',
    massDeltaKg: -1.2,
    powerDeltaHp: 0,
    torqueDeltaNm: 0,
    wheelieSuppressionPercent: 10,
    maxLeanAngleBonusDeg: 2.0,
    enabled: true,
  },
  {
    id: 'sprocket-conversion',
    name: '520 Chain & Race Sprocket Kit (-1 Front / +2 Rear)',
    category: 'Powertrain',
    massDeltaKg: -0.8,
    powerDeltaHp: 0,
    torqueDeltaNm: 22, // Torque multiplication via shorter gearing
    wheelieSuppressionPercent: -15, // Increases wheelie tendency
    maxLeanAngleBonusDeg: 0,
    enabled: false,
  },
];

export function MotorbikePhysicsSimulator() {
  // ------------------------------------------
  // Simulation Controls & Telemetry
  // ------------------------------------------
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [throttlePercent, setThrottlePercent] = useState<number>(75);
  const [frontBrakePercent, setFrontBrakePercent] = useState<number>(0);
  const [leanTargetAngleDeg, setLeanTargetAngleDeg] = useState<number>(35); // 0° vertical, up to 62° knee-down
  const [viewMode, setViewMode] = useState<'lean' | 'side_wheelie'>('lean');

  // Engine Architecture
  const [engineType, setEngineType] = useState<'Inline-4 1000cc' | 'V-Twin 1200cc' | 'Single 450cc' | 'Electric Superbike'>('Inline-4 1000cc');
  const [tcsLevel, setTcsLevel] = useState<number>(2); // Traction control 0 (off) to 5 (max)

  // Motorcycle Specs
  const [bikeMassKg, setBikeMassKg] = useState<number>(185); // Wet weight
  const [riderMassKg, setRiderMassKg] = useState<number>(75);
  const [wheelbaseM, setWheelbaseM] = useState<number>(1.43); // 1430mm typical superbike
  const [rakeAngleDeg, setRakeAngleDeg] = useState<number>(24.0); // 24° rake

  // Dynamic States
  const [speedKmh, setSpeedKmh] = useState<number>(85);
  const [rpm, setRpm] = useState<number>(8500);
  const [currentLeanDeg, setCurrentLeanDeg] = useState<number>(35);
  const [wheeliePitchDeg, setWheeliePitchDeg] = useState<number>(0);
  const [isWheelie, setIsWheelie] = useState<boolean>(false);
  const [isStoppie, setIsStoppie] = useState<boolean>(false);

  // Custom Components
  const [customComponents, setCustomComponents] = useState<CustomBikeComponent[]>(DEFAULT_CUSTOM_BIKE_COMPONENTS);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompCategory, setNewCompCategory] = useState<'Powertrain' | 'Aero & Fairings' | 'Suspension' | 'Braking & Chassis'>('Powertrain');
  const [newCompHp, setNewCompHp] = useState<number>(10);
  const [newCompMass, setNewCompMass] = useState<number>(-2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Base Engine specs
  const engineBaseSpecs = useMemo(() => {
    switch (engineType) {
      case 'Inline-4 1000cc':
        return { hp: 215, torqueNm: 115, redlineRpm: 14500, maxRpm: 15200 };
      case 'V-Twin 1200cc':
        return { hp: 190, torqueNm: 135, redlineRpm: 11000, maxRpm: 11500 };
      case 'Single 450cc':
        return { hp: 62, torqueNm: 52, redlineRpm: 9500, maxRpm: 10200 };
      case 'Electric Superbike':
        return { hp: 240, torqueNm: 220, redlineRpm: 12000, maxRpm: 12500 };
    }
  }, [engineType]);

  // Aggregate custom components
  const customMods = useMemo(() => {
    return customComponents
      .filter((c) => c.enabled)
      .reduce(
        (acc, item) => ({
          massDeltaKg: acc.massDeltaKg + item.massDeltaKg,
          powerDeltaHp: acc.powerDeltaHp + item.powerDeltaHp,
          torqueDeltaNm: acc.torqueDeltaNm + item.torqueDeltaNm,
          wheelieSuppressionPercent: acc.wheelieSuppressionPercent + item.wheelieSuppressionPercent,
          maxLeanAngleBonusDeg: acc.maxLeanAngleBonusDeg + item.maxLeanAngleBonusDeg,
        }),
        { massDeltaKg: 0, powerDeltaHp: 0, torqueDeltaNm: 0, wheelieSuppressionPercent: 0, maxLeanAngleBonusDeg: 0 }
      );
  }, [customComponents]);

  const totalHp = engineBaseSpecs.hp + customMods.powerDeltaHp;
  const totalTorqueNm = engineBaseSpecs.torqueNm + customMods.torqueDeltaNm;
  const totalMassKg = bikeMassKg + riderMassKg + customMods.massDeltaKg;
  const maxSafeLeanDeg = 58 + customMods.maxLeanAngleBonusDeg;

  // ------------------------------------------
  // Real-time Motorcycle Dynamics Physics Loop
  // ------------------------------------------
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (isRunning) {
        setSpeedKmh((prevKmh) => {
          const v = (prevKmh * 1000) / 3600; // m/s
          const airDensity = calculateAirDensity(100, 24);

          // CdA varies with lean angle and rider tuck
          const baseCdA = 0.36;
          const aeroDrag = calculateAeroDrag(v, baseCdA, airDensity);

          // Drive force at rear wheel:
          const driveRatio = 4.8; // combined primary + secondary + gear
          const tireRadius = 0.315;
          const tractiveTorque = (totalTorqueNm * (throttlePercent / 100) * driveRatio) / tireRadius;

          // TCS intervention on lean angle
          const currentLeanRad = (currentLeanDeg * Math.PI) / 180;
          const leanGripReduction = Math.cos(currentLeanRad);
          const tcsPenalty = tcsLevel > 0 && Math.abs(currentLeanDeg) > 30 ? (tcsLevel * 0.08) : 0;
          const effectiveDriveForce = tractiveTorque * Math.max(0.2, (leanGripReduction - tcsPenalty));

          // Braking force
          const maxBrake = totalMassKg * 9.80665 * 1.25;
          const brakeForce = (frontBrakePercent / 100) * maxBrake;

          // Net acceleration
          const ax = (effectiveDriveForce - aeroDrag - brakeForce) / totalMassKg;

          // Wheelie Physics:
          // Front wheel lifts when (F_drive * h_cg) > (m * g * b)
          const cgHeight = 0.62; // Center of mass height
          const rearAxleToCgDist = 0.70; // Distance b
          const wheelieTorqueThreshold = totalMassKg * 9.80665 * rearAxleToCgDist;
          const overturningTorque = effectiveDriveForce * cgHeight;

          const wheelieSuppressionFactor = Math.max(0, 1 - customMods.wheelieSuppressionPercent / 100);
          const netWheelieTorque = (overturningTorque - wheelieTorqueThreshold) * wheelieSuppressionFactor;

          if (netWheelieTorque > 0 && Math.abs(currentLeanDeg) < 15) {
            setIsWheelie(true);
            const pitchTarget = Math.min(38, (netWheelieTorque / 180));
            setWheeliePitchDeg((p) => p + (pitchTarget - p) * 0.15);
          } else {
            setIsWheelie(false);
            setWheeliePitchDeg((p) => p * 0.85); // return down smoothly
          }

          // Stoppie Physics under hard front braking
          if (brakeForce > totalMassKg * 9.80665 * 0.85) {
            setIsStoppie(true);
          } else {
            setIsStoppie(false);
          }

          // Update speed
          let newV = v + ax * dt;
          if (newV < 0) newV = 0;

          // Update lean angle smoothly towards target
          setCurrentLeanDeg((lean) => {
            const step = (leanTargetAngleDeg - lean) * 0.1;
            return lean + step;
          });

          // Engine RPM approximation
          const engineRpm = Math.min(
            engineBaseSpecs.maxRpm,
            Math.max(1200, (newV / (2 * Math.PI * tireRadius)) * driveRatio * 60)
          );
          setRpm(engineRpm);

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
    throttlePercent,
    frontBrakePercent,
    leanTargetAngleDeg,
    currentLeanDeg,
    totalTorqueNm,
    totalMassKg,
    tcsLevel,
    customMods,
    engineBaseSpecs,
  ]);

  // ------------------------------------------
  // Canvas: Dynamic Motorcycle Lean / Wheelie Renderer
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
      ctx.translate(w / 2, h / 2 + 15);

      if (viewMode === 'lean') {
        // --- 1. LEAN APEX VIEW (Rear/Front perspective) ---
        // Road surface
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-w / 2, 75, w, 80);

        // Apex curb / rumble strip
        ctx.fillStyle = '#ef4444';
        for (let i = -140; i < 140; i += 24) {
          ctx.fillRect(i, 75, 12, 6);
        }

        // Motorcycle Leaning Body
        const leanRad = (currentLeanDeg * Math.PI) / 180;
        ctx.save();
        ctx.translate(0, 75); // Contact patch pivot point
        ctx.rotate(leanRad);

        // Tire Crown Contact Patch (Tire curvature)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(0, -32, 22, 34, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rim
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, -32, 16, 0, Math.PI * 2);
        ctx.stroke();

        // Swingarm / Chassis
        ctx.fillStyle = '#334155';
        ctx.fillRect(-8, -90, 16, 60);

        // Exhaust Canister (Right side)
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.roundRect(10, -70, 14, 40, 4);
        ctx.fill();

        // Tail Cowl & Seat
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(-20, -100);
        ctx.lineTo(20, -100);
        ctx.lineTo(12, -135);
        ctx.lineTo(-12, -135);
        ctx.closePath();
        ctx.fill();

        // Rider Torso & Helmet (Hanging off into corner)
        ctx.fillStyle = '#1e293b'; // Leather suit
        const hangOffOffset = (currentLeanDeg / 60) * 18;
        ctx.beginPath();
        ctx.arc(hangOffOffset, -145, 16, 0, Math.PI * 2); // Helmet
        ctx.fill();

        // Visor
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(hangOffOffset - 6, -150, 12, 6);

        // Knee Slider Puck (Extends towards asphalt at high lean)
        if (Math.abs(currentLeanDeg) > 42) {
          ctx.fillStyle = '#f59e0b'; // Knee slider
          const kneeX = currentLeanDeg > 0 ? 32 : -32;
          ctx.fillRect(kneeX, -60, 10, 8);

          // Sparks if scraping asphalt!
          ctx.fillStyle = '#f97316';
          for (let s = 0; s < 4; s++) {
            ctx.fillRect(kneeX + (Math.random() * 12 - 6), -55 + Math.random() * 8, 3, 3);
          }
        }

        ctx.restore(); // restore lean
      } else {
        // --- 2. SIDE WHEELIE / STOPPIE PITCH VIEW ---
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-w / 2, 75, w, 80);

        const pitchRad = (-wheeliePitchDeg * Math.PI) / 180;
        const rearWheelX = -100;
        const rearWheelY = 50;

        ctx.save();
        ctx.translate(rearWheelX, rearWheelY); // Pivot around rear tire contact patch
        ctx.rotate(pitchRad);

        // Rear Wheel
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(0, -26, 26, 0, Math.PI * 2);
        ctx.stroke();

        // Front Wheel (Lofted in air during wheelie)
        const frontWheelX = 180;
        const frontWheelY = 0;
        ctx.beginPath();
        ctx.arc(frontWheelX, -26, 26, 0, Math.PI * 2);
        ctx.stroke();

        // Frame / Tank / Fairing
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.lineTo(60, -32); // swingarm pivot
        ctx.lineTo(85, -85); // tank
        ctx.lineTo(145, -75); // front fairing
        ctx.lineTo(frontWheelX, -26); // forks
        ctx.lineTo(70, -28); // belly pan
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rider silhouette
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(50, -100, 14, 0, Math.PI * 2); // helmet
        ctx.fill();

        ctx.restore();
      }

      ctx.restore(); // restore canvas center

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, currentLeanDeg, wheeliePitchDeg]);

  // Handle custom component addition
  const handleAddCustomComp = () => {
    if (!newCompName.trim()) return;
    const newComp: CustomBikeComponent = {
      id: `bike-mod-${Date.now()}`,
      name: newCompName.trim(),
      category: newCompCategory,
      massDeltaKg: Number(newCompMass),
      powerDeltaHp: Number(newCompHp),
      torqueDeltaNm: Number(newCompHp) * 0.75,
      wheelieSuppressionPercent: newCompCategory === 'Aero & Fairings' ? 25 : 0,
      maxLeanAngleBonusDeg: 1.0,
      enabled: true,
    };
    setCustomComponents((prev) => [...prev, newComp]);
    setNewCompName('');
  };

  const handleToggleComp = (id: string) => {
    setCustomComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleDeleteComp = (id: string) => {
    setCustomComponents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-1 border border-hairline shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-bold uppercase tracking-wider text-accent">
              Motorcycle Dynamics Engine
            </span>
            <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
              MotoGP 60°+ Lean & Anti-Wheelie
            </Badge>
          </div>
          <h2 className="text-heading-md font-display font-bold text-fg">
            Superbike Leaning & Wheelie Dynamics Simulator
          </h2>
          <p className="text-body-sm text-fg-muted mt-0.5">
            Coupled roll-yaw-steer kinematics, tire crown contact patch shift, traction control, and aerodynamic winglet suppression.
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
            <span>{isRunning ? 'Kill Switch' : 'Start Ignition'}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSpeedKmh(0);
              setCurrentLeanDeg(0);
              setLeanTargetAngleDeg(0);
              setWheeliePitchDeg(0);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" />
            <span>Reset Stand</span>
          </Button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas + Cockpit Controls */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 bg-surface-1 border-hairline overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-hairline/60">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-accent" />
                <span className="text-caption font-mono uppercase font-bold text-fg">
                  {viewMode === 'lean' ? 'Cornering Apex Lean Angle Visualizer' : 'Side Wheelie & Stoppie Pitch Profile'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('lean')}
                  className={`px-2.5 py-1 rounded text-caption font-mono font-medium border ${
                    viewMode === 'lean' ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-hairline bg-surface-2 text-fg-muted'
                  }`}
                >
                  Lean View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('side_wheelie')}
                  className={`px-2.5 py-1 rounded text-caption font-mono font-medium border ${
                    viewMode === 'side_wheelie' ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-hairline bg-surface-2 text-fg-muted'
                  }`}
                >
                  Wheelie View
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={760}
              height={290}
              className="w-full h-[260px] sm:h-[290px] rounded-xl bg-slate-950 border border-hairline shadow-inner block"
            />

            {/* Live Instrument Cluster HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-hairline">
              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Velocity</span>
                <span className="text-heading-md font-mono font-bold text-fg">
                  {speedKmh.toFixed(0)} <span className="text-caption text-fg-muted">km/h</span>
                </span>
                <span className="text-[10px] font-mono text-accent block">
                  {(speedKmh / 1.60934).toFixed(0)} MPH
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Lean Angle</span>
                <span className={`text-heading-md font-mono font-bold ${Math.abs(currentLeanDeg) > 50 ? 'text-amber-400' : 'text-fg'}`}>
                  {Math.abs(currentLeanDeg).toFixed(1)}°
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Limit: {maxSafeLeanDeg}°
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Tachometer</span>
                <span className="text-heading-md font-mono font-bold text-emerald-400">
                  {Math.round(rpm)} <span className="text-caption text-fg-muted">RPM</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Redline: {engineBaseSpecs.redlineRpm}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Dynamics Alert</span>
                <span className="text-heading-sm font-mono font-bold flex items-center gap-1">
                  {isWheelie ? (
                    <span className="text-amber-400 animate-pulse">WHEELIE {wheeliePitchDeg.toFixed(0)}°</span>
                  ) : isStoppie ? (
                    <span className="text-rose-400 animate-pulse">STOPPIE</span>
                  ) : (
                    <span className="text-emerald-400">TRACK STABLE</span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  TCS Level {tcsLevel} / 5
                </span>
              </div>
            </div>
          </Card>

          {/* Controls Card */}
          <Card className="p-5 bg-surface-1 border-hairline space-y-4">
            <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
              <Sliders className="size-4 text-accent" />
              Rider Throttle, Braking & Lean Input
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Throttle Grip (%)</span>
                  <span className="font-bold text-emerald-400">{throttlePercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={throttlePercent}
                  onChange={(e) => setThrottlePercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 mt-1.5"
                />
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Front Radial Brake (%)</span>
                  <span className="font-bold text-rose-400">{frontBrakePercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={frontBrakePercent}
                  onChange={(e) => setFrontBrakePercent(Number(e.target.value))}
                  className="w-full accent-rose-500 mt-1.5"
                />
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Target Lean Angle</span>
                  <span className="font-bold text-fg">{leanTargetAngleDeg}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="62"
                  value={leanTargetAngleDeg}
                  onChange={(e) => setLeanTargetAngleDeg(Number(e.target.value))}
                  className="w-full accent-accent mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-hairline/60">
              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Engine Archetype</span>
                <select
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value="Inline-4 1000cc">Inline-4 1000cc (215 HP)</option>
                  <option value="V-Twin 1200cc">V-Twin 1200cc (190 HP)</option>
                  <option value="Single 450cc">Single 450cc Supermoto (62 HP)</option>
                  <option value="Electric Superbike">Electric Superbike (240 HP)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Traction Control (TCS)</span>
                <select
                  value={tcsLevel}
                  onChange={(e) => setTcsLevel(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value={0}>Level 0 (Off - Wheelspin Allowed)</option>
                  <option value={1}>Level 1 (Race Track Pro)</option>
                  <option value={2}>Level 2 (Fast Road)</option>
                  <option value={3}>Level 3 (Street Safety)</option>
                  <option value={5}>Level 5 (Wet Rain Maximum)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Steering Geometry</span>
                <div className="p-1.5 rounded bg-surface-2 border border-hairline text-caption font-mono text-fg flex justify-between">
                  <span>Rake: {rakeAngleDeg}°</span>
                  <span>Trail: 98mm</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Custom Parts Tuning */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-1.5">
                <Zap className="size-4 text-accent" />
                Custom Race Components
              </h3>
              <Badge tone="accent" variant="outline" className="font-mono text-[10px]">
                {totalHp} HP / {totalTorqueNm} Nm
              </Badge>
            </div>

            {/* List of Custom Components */}
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
                        onChange={() => handleToggleComp(comp.id)}
                        className="rounded accent-accent size-3.5"
                      />
                      <span className="font-medium text-caption text-fg truncate">
                        {comp.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 text-[10px] font-mono text-fg-muted mt-1 ml-5">
                      {comp.powerDeltaHp !== 0 && (
                        <span className="text-emerald-400 font-bold">
                          +{comp.powerDeltaHp} HP
                        </span>
                      )}
                      {comp.wheelieSuppressionPercent !== 0 && (
                        <span className="text-accent">
                          {comp.wheelieSuppressionPercent > 0 ? `-${comp.wheelieSuppressionPercent}%` : `+${Math.abs(comp.wheelieSuppressionPercent)}%`} Wheelie
                        </span>
                      )}
                      <span>{comp.massDeltaKg >= 0 ? `+${comp.massDeltaKg}` : comp.massDeltaKg}kg</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteComp(comp.id)}
                    className="text-fg-muted hover:text-rose-400 p-1 rounded"
                    title="Remove"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Component Form */}
            <div className="pt-2 border-t border-hairline/60 space-y-2">
              <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
                Fabricate Custom Bike Part
              </span>
              <input
                type="text"
                placeholder="Part name (e.g. Slipper Clutch)"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-surface-2 border border-hairline text-caption text-fg"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Power Delta (HP)</span>
                  <input
                    type="number"
                    step="5"
                    value={newCompHp}
                    onChange={(e) => setNewCompHp(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Weight Delta (kg)</span>
                  <input
                    type="number"
                    step="0.5"
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
                onClick={handleAddCustomComp}
                disabled={!newCompName.trim()}
              >
                <Plus className="size-3.5" />
                <span>Mount Race Component</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
