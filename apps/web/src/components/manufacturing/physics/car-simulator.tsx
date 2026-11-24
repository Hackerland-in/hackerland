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
  Disc,
} from 'lucide-react';
import {
  calculateAeroDrag,
  calculateAeroDownforce,
  calculateAirDensity,
} from './physics-engine';

// ==========================================
// Types & Defaults
// ==========================================

export interface CustomCarComponent {
  id: string;
  name: string;
  category: 'Powertrain' | 'Aero & Body' | 'Suspension' | 'Braking & Tires';
  massDeltaKg: number;
  powerDeltaHp: number;
  torqueDeltaNm: number;
  downforceDeltaClA: number;
  dragDeltaCdA: number;
  tireMuDelta: number;
  enabled: boolean;
}

const DEFAULT_CUSTOM_CAR_COMPONENTS: CustomCarComponent[] = [
  {
    id: 'stage2-turbo',
    name: 'Stage 2 Twin-Scroll Ball-Bearing Turbocharger',
    category: 'Powertrain',
    massDeltaKg: 4.5,
    powerDeltaHp: 95,
    torqueDeltaNm: 130,
    downforceDeltaClA: 0,
    dragDeltaCdA: 0,
    tireMuDelta: 0,
    enabled: true,
  },
  {
    id: 'carbon-gt-wing',
    name: 'Dry Carbon High-Downforce GT Wing & Front Splitter',
    category: 'Aero & Body',
    massDeltaKg: -8.0,
    powerDeltaHp: 0,
    torqueDeltaNm: 0,
    downforceDeltaClA: 0.45,
    dragDeltaCdA: 0.035,
    tireMuDelta: 0,
    enabled: true,
  },
  {
    id: 'cup2r-slicks',
    name: 'Track-Spec Semi-Slick Tire Package (Michelin Cup 2R)',
    category: 'Braking & Tires',
    massDeltaKg: -2.0,
    powerDeltaHp: 0,
    torqueDeltaNm: 0,
    downforceDeltaClA: 0,
    dragDeltaCdA: 0,
    tireMuDelta: 0.35,
    enabled: true,
  },
  {
    id: 'ceramic-brakes',
    name: '410mm Carbon-Ceramic Rotors & 10-Piston Calipers',
    category: 'Braking & Tires',
    massDeltaKg: -14.0,
    powerDeltaHp: 0,
    torqueDeltaNm: 0,
    downforceDeltaClA: 0,
    dragDeltaCdA: 0,
    tireMuDelta: 0.05,
    enabled: false,
  },
];

export function CarPhysicsSimulator() {
  // ------------------------------------------
  // Simulation Controls & Telemetry
  // ------------------------------------------
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [throttlePercent, setThrottlePercent] = useState<number>(85); // Throttle pedal 0-100%
  const [brakePercent, setBrakePercent] = useState<number>(0);       // Brake pedal 0-100%
  const [steeringAngleDeg, setSteeringAngleDeg] = useState<number>(0); // Steering -35° to +35°
  const [gear, setGear] = useState<number>(1);                       // Current gear (1-6)
  const [transmissionMode, setTransmissionMode] = useState<'Auto' | 'Manual'>('Auto');

  // Engine Architecture
  const [engineType, setEngineType] = useState<'Turbo I4' | 'NA Flat-6' | 'Twin-Turbo V8' | 'Dual-Motor EV'>('Twin-Turbo V8');
  const [tireCompound, setTireCompound] = useState<'Racing Slick' | 'Summer Sport' | 'All-Season' | 'Wet Track'>('Summer Sport');

  // Chassis Specs
  const [curbWeightKg] = useState<number>(1420);
  const [frontWeightDistPercent] = useState<number>(51); // 51% front / 49% rear
  const [wheelbaseM] = useState<number>(2.55);

  // Dynamic States
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [rpm, setRpm] = useState<number>(1000); // Idle RPM
  const [longitudinalG, setLongitudinalG] = useState<number>(0);
  const [lateralG, setLateralG] = useState<number>(0);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [brakeTempCelsius, setBrakeTempCelsius] = useState<number>(85);

  // Performance Benchmarks
  const [zeroTo100Time, setZeroTo100Time] = useState<number | null>(null);
  const [, setQuarterMileTime] = useState<number | null>(null);
  const [runStartTime, setRunStartTime] = useState<number | null>(null);

  // Custom Components
  const [customComponents, setCustomComponents] = useState<CustomCarComponent[]>(DEFAULT_CUSTOM_CAR_COMPONENTS);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompCategory] = useState<'Powertrain' | 'Aero & Body' | 'Suspension' | 'Braking & Tires'>('Powertrain');
  const [newCompHp, setNewCompHp] = useState<number>(50);
  const [newCompMass, setNewCompMass] = useState<number>(-5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ggCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Engine base output parameters
  const engineBaseSpecs = useMemo(() => {
    switch (engineType) {
      case 'Turbo I4':
        return { baseHp: 310, baseTorqueNm: 420, idleRpm: 850, redlineRpm: 6800, revLimitRpm: 7200 };
      case 'NA Flat-6':
        return { baseHp: 500, baseTorqueNm: 470, idleRpm: 950, redlineRpm: 9000, revLimitRpm: 9200 };
      case 'Twin-Turbo V8':
        return { baseHp: 640, baseTorqueNm: 800, idleRpm: 800, redlineRpm: 7400, revLimitRpm: 7800 };
      case 'Dual-Motor EV':
        return { baseHp: 750, baseTorqueNm: 1050, idleRpm: 0, redlineRpm: 18000, revLimitRpm: 19000 };
    }
  }, [engineType]);

  // Aggregate custom mods
  const customMods = useMemo(() => {
    return customComponents
      .filter((c) => c.enabled)
      .reduce(
        (acc, item) => ({
          massDeltaKg: acc.massDeltaKg + item.massDeltaKg,
          powerDeltaHp: acc.powerDeltaHp + item.powerDeltaHp,
          torqueDeltaNm: acc.torqueDeltaNm + item.torqueDeltaNm,
          downforceDeltaClA: acc.downforceDeltaClA + item.downforceDeltaClA,
          dragDeltaCdA: acc.dragDeltaCdA + item.dragDeltaCdA,
          tireMuDelta: acc.tireMuDelta + item.tireMuDelta,
        }),
        { massDeltaKg: 0, powerDeltaHp: 0, torqueDeltaNm: 0, downforceDeltaClA: 0, dragDeltaCdA: 0, tireMuDelta: 0 }
      );
  }, [customComponents]);

  // Total Peak HP & Torque
  const totalHp = engineBaseSpecs.baseHp + customMods.powerDeltaHp;
  const totalTorqueNm = engineBaseSpecs.baseTorqueNm + customMods.torqueDeltaNm;
  const totalMassKg = curbWeightKg + customMods.massDeltaKg;

  // Base tire friction coefficient
  const baseTireMu = useMemo(() => {
    switch (tireCompound) {
      case 'Racing Slick': return 1.45;
      case 'Summer Sport': return 1.15;
      case 'All-Season': return 0.90;
      case 'Wet Track': return 0.72;
    }
  }, [tireCompound]);

  const effectiveTireMu = Math.max(0.6, baseTireMu + customMods.tireMuDelta);

  // Transmission Ratios (6-speed + final drive)
  const gearRatios = [3.82, 2.36, 1.69, 1.31, 1.05, 0.84];
  const finalDriveRatio = 3.65;
  const tireRadiusM = 0.335; // 265/35R19 ≈ 0.335m

  // ------------------------------------------
  // Real-time Vehicle Dynamics Physics Loop
  // ------------------------------------------
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (isRunning) {
        setSpeedKmh((prevKmh) => {
          const v = (prevKmh * 1000) / 3600; // m/s
          const airDensity = calculateAirDensity(50, 20);

          // Transmission & Engine RPM calculation
          const currentGearRatio = gearRatios[gear - 1] ?? 1.0;
          const wheelRps = v / (2 * Math.PI * tireRadiusM);
          let targetRpm = engineType === 'Dual-Motor EV'
            ? v * 120
            : Math.max(engineBaseSpecs.idleRpm, wheelRps * currentGearRatio * finalDriveRatio * 60);

          // Auto-shifting logic
          if (transmissionMode === 'Auto' && engineType !== 'Dual-Motor EV') {
            if (targetRpm >= engineBaseSpecs.redlineRpm && gear < 6) {
              setGear((g) => Math.min(6, g + 1));
            } else if (targetRpm < 2200 && gear > 1) {
              setGear((g) => Math.max(1, g - 1));
            }
          }

          if (targetRpm > engineBaseSpecs.revLimitRpm) {
            targetRpm = engineBaseSpecs.revLimitRpm;
          }
          setRpm(targetRpm);

          // Engine torque curve fraction based on RPM
          const rpmNormalized = (targetRpm - engineBaseSpecs.idleRpm) / (engineBaseSpecs.redlineRpm - engineBaseSpecs.idleRpm);
          const torqueFactor = Math.sin(Math.max(0.1, Math.min(1.0, rpmNormalized)) * Math.PI * 0.85);
          const currentEngineTorque = totalTorqueNm * Math.max(0.4, torqueFactor) * (throttlePercent / 100);

          // Wheel drive force: F = (Torque * GearRatio * FinalDrive * eta) / r_wheel
          const driveTorque = currentEngineTorque * currentGearRatio * finalDriveRatio * 0.92;
          const tractiveForceDrive = driveTorque / tireRadiusM;

          // Aero Drag & Downforce
          const baseCdA = 0.32 * 2.15; // Cd * Area
          const effectiveCdA = baseCdA + customMods.dragDeltaCdA;
          const effectiveClA = 0.15 + customMods.downforceDeltaClA;

          const aeroDrag = calculateAeroDrag(v, effectiveCdA, airDensity);
          const aeroDownforce = calculateAeroDownforce(v, effectiveClA, airDensity);

          // Rolling resistance
          const rollResistance = 0.012 * totalMassKg * 9.80665;

          // Braking force (ventilated 4-piston brakes)
          const maxBrakingForce = totalMassKg * 9.80665 * effectiveTireMu * 1.1;
          const appliedBrakeForce = (brakePercent / 100) * maxBrakingForce;

          // Normal force and load transfer
          const normalGravityTotal = totalMassKg * 9.80665 + aeroDownforce;
          const staticRear = normalGravityTotal * (1 - frontWeightDistPercent / 100);

          // Max traction limit (Pacejka tire grip on drive wheels - RWD / AWD)
          const rearGripLimit = staticRear * effectiveTireMu;
          const actualDriveForce = Math.min(tractiveForceDrive, rearGripLimit);

          // Net longitudinal force
          const netLongitudinalForce = actualDriveForce - aeroDrag - rollResistance - appliedBrakeForce;
          const ax = netLongitudinalForce / totalMassKg;

          // Integrate speed
          let newV = v + ax * dt;
          if (newV < 0) newV = 0;

          // Accelerations in Gs
          const longG = ax / 9.80665;
          setLongitudinalG(longG);

          // Lateral G from steering angle & velocity (Bicycle handling model)
          const steerRad = (steeringAngleDeg * Math.PI) / 180;
          const turningRadius = Math.abs(steerRad) > 0.01 ? wheelbaseM / Math.sin(Math.abs(steerRad)) : 99999;
          const centripetalAcc = (newV * newV) / turningRadius;
          const maxLatG = effectiveTireMu;
          const latG = Math.min(maxLatG, centripetalAcc / 9.80665) * Math.sign(steerRad);
          setLateralG(latG);

          // Benchmark timers: 0-100 km/h and 1/4 mile (402m)
          const newKmh = (newV * 3600) / 1000;
          if (throttlePercent > 50 && v < 0.2 && runStartTime === null) {
            setRunStartTime(performance.now());
          }
          if (runStartTime !== null) {
            const currentRunElapsed = (performance.now() - runStartTime) / 1000;
            if (newKmh >= 100 && zeroTo100Time === null) {
              setZeroTo100Time(Number(currentRunElapsed.toFixed(2)));
            }
          }

          // Brake disc temperature heating/cooling
          if (appliedBrakeForce > 50) {
            setBrakeTempCelsius((temp) => Math.min(850, temp + appliedBrakeForce * 0.0003));
          } else {
            setBrakeTempCelsius((temp) => Math.max(30, temp - 0.25));
          }

          setDistanceMeters((d) => d + newV * dt);

          return newKmh;
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
    brakePercent,
    steeringAngleDeg,
    gear,
    transmissionMode,
    engineType,
    totalTorqueNm,
    totalMassKg,
    effectiveTireMu,
    frontWeightDistPercent,
    wheelbaseM,
    customMods,
    runStartTime,
    zeroTo100Time,
    engineBaseSpecs,
  ]);

  // ------------------------------------------
  // Canvas 1: Dynamic Chassis Pitch / Squat / Dive Visualizer
  // ------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let wheelAngle = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      wheelAngle += (speedKmh / 3.6) * 0.08;

      // Chassis dynamic pitch from longitudinal acceleration
      // Acceleration causes squat (rear dips, front rises); braking causes dive
      const pitchAngleDeg = -longitudinalG * 3.8; // degrees
      const pitchRad = (pitchAngleDeg * Math.PI) / 180;

      ctx.save();
      ctx.translate(w / 2, h / 2 + 10);

      // --- Road & Track Surface ---
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-w / 2, 75, w, 80);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(-w / 2, 75, w, 80);

      // --- Car Wheels (On Ground) ---
      const wheelBasePx = 240;
      const frontWheelX = wheelBasePx / 2;
      const rearWheelX = -wheelBasePx / 2;
      const wheelY = 48;
      const wheelRadius = 32;

      const drawCarWheel = (x: number, y: number, _isBraking: boolean) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wheelAngle);

        // Tire rubber
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Rim
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius - 7, 0, Math.PI * 2);
        ctx.stroke();

        // Multi-spokes
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * (wheelRadius - 8), Math.sin(a) * (wheelRadius - 8));
          ctx.stroke();
        }

        // Glowing Brake Disc under heavy braking
        if (brakeTempCelsius > 350) {
          ctx.fillStyle = brakeTempCelsius > 600 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(249, 115, 22, 0.7)';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      };

      drawCarWheel(rearWheelX, wheelY, brakePercent > 20);
      drawCarWheel(frontWheelX, wheelY, brakePercent > 20);

      // --- Pitched Car Body (Rotates around CG) ---
      ctx.save();
      ctx.rotate(pitchRad);

      // Car body silhouette (Sports coupe aerodynamic profile)
      ctx.fillStyle = '#0284c7'; // Primary sports blue
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      // Rear bumper
      ctx.moveTo(-160, 42);
      // Diffuser
      ctx.lineTo(-170, 30);
      // Trunk / Decklid
      ctx.lineTo(-145, 0);
      // Fastback roofline
      ctx.lineTo(-65, -38);
      ctx.lineTo(35, -38);
      // Windshield
      ctx.lineTo(95, 2);
      // Hood line
      ctx.lineTo(155, 12);
      // Front nose / splitter
      ctx.lineTo(175, 42);
      // Bottom rocker
      ctx.lineTo(135, 42);
      ctx.arc(frontWheelX, wheelY, wheelRadius + 8, Math.PI, 0, false);
      ctx.lineTo(-wheelBasePx / 2 + wheelRadius + 8, 42);
      ctx.arc(rearWheelX, wheelY, wheelRadius + 8, Math.PI, 0, false);
      ctx.lineTo(-160, 42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cabin Glass
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-55, -34);
      ctx.lineTo(30, -34);
      ctx.lineTo(80, 2);
      ctx.lineTo(-50, 2);
      ctx.closePath();
      ctx.fill();

      // GT Wing (if mounted)
      const hasGtWing = customComponents.some((c) => c.id === 'carbon-gt-wing' && c.enabled);
      if (hasGtWing) {
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        // Wing uprights
        ctx.beginPath();
        ctx.moveTo(-140, 0);
        ctx.lineTo(-145, -28);
        ctx.moveTo(-130, 0);
        ctx.lineTo(-135, -28);
        ctx.stroke();
        // Airfoil
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-165, -32, 45, 6);
      }

      // Exhaust flame on high throttle/RPM
      if (throttlePercent > 80 && rpm > 5500 && engineType !== 'Dual-Motor EV') {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-170, 34);
        ctx.lineTo(-200 + Math.random() * 15, 36);
        ctx.lineTo(-170, 38);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore(); // restore pitched body
      ctx.restore(); // restore canvas center

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speedKmh, longitudinalG, brakePercent, throttlePercent, rpm, engineType, customComponents, brakeTempCelsius]);

  // ------------------------------------------
  // Canvas 2: G-G Friction Circle Diagram
  // ------------------------------------------
  useEffect(() => {
    const canvas = ggCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = canvas.width;
    const center = size / 2;
    const maxG = 1.6; // Max G scale
    const radius = center - 18;

    // Background circle (friction limits)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // 0.5G circle
    ctx.beginPath();
    ctx.arc(center, center, (0.5 / maxG) * radius, 0, Math.PI * 2);
    ctx.stroke();

    // 1.0G circle
    ctx.beginPath();
    ctx.arc(center, center, (1.0 / maxG) * radius, 0, Math.PI * 2);
    ctx.stroke();

    // Tire grip friction limit ellipse (effectiveTireMu)
    ctx.setLineDash([]);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center, center, (effectiveTireMu / maxG) * radius, 0, Math.PI * 2);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center, 10);
    ctx.lineTo(center, size - 10);
    ctx.moveTo(10, center);
    ctx.lineTo(size - 10, center);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('+Acc', center + 4, 18);
    ctx.fillText('Brake', center + 4, size - 12);
    ctx.fillText('Left', 12, center - 4);
    ctx.fillText('Right', size - 32, center - 4);

    // Instantaneous G-dot cursor
    const gDotX = center + (lateralG / maxG) * radius;
    const gDotY = center - (longitudinalG / maxG) * radius;

    // Trail / line to center
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(gDotX, gDotY);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(gDotX, gDotY, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [longitudinalG, lateralG, effectiveTireMu]);

  // Handle custom component addition
  const handleAddCustomComp = () => {
    if (!newCompName.trim()) return;
    const newComp: CustomCarComponent = {
      id: `car-mod-${Date.now()}`,
      name: newCompName.trim(),
      category: newCompCategory,
      massDeltaKg: Number(newCompMass),
      powerDeltaHp: Number(newCompHp),
      torqueDeltaNm: Number(newCompHp) * 1.3,
      downforceDeltaClA: 0,
      dragDeltaCdA: 0,
      tireMuDelta: 0,
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
              Automotive Physics Studio
            </span>
            <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
              Pacejka Magic Formula & G-G Circle
            </Badge>
          </div>
          <h2 className="text-heading-md font-display font-bold text-fg">
            High-Performance Vehicle Dynamics & Powertrain Simulator
          </h2>
          <p className="text-body-sm text-fg-muted mt-0.5">
            Coupled engine torque maps, transmission gear steps, aerodynamic downforce, chassis squat/dive, and live friction circle.
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
            <span>{isRunning ? 'Pause Engine' : 'Start Ignition'}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSpeedKmh(0);
              setDistanceMeters(0);
              setZeroTo100Time(null);
              setQuarterMileTime(null);
              setRunStartTime(null);
              setGear(1);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" />
            <span>Reset Run</span>
          </Button>
        </div>
      </div>

      {/* Main Viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Chassis Visualizer & Dynamic Cockpit */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 bg-surface-1 border-hairline overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-hairline/60">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-accent" />
                <span className="text-caption font-mono uppercase font-bold text-fg">
                  Chassis Pitch, Squat & Dive Kinematics
                </span>
              </div>
              <div className="flex items-center gap-2 text-caption font-mono">
                <Badge tone={longitudinalG >= 0 ? 'accent' : 'danger'} variant="outline">
                  {longitudinalG >= 0 ? `+${longitudinalG.toFixed(2)}G (Squat)` : `${longitudinalG.toFixed(2)}G (Dive)`}
                </Badge>
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
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Speedometer</span>
                <span className="text-heading-md font-mono font-bold text-fg">
                  {speedKmh.toFixed(0)} <span className="text-caption text-fg-muted">km/h</span>
                </span>
                <span className="text-[10px] font-mono text-accent block">
                  {(speedKmh / 1.60934).toFixed(0)} MPH
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Tachometer</span>
                <span className={`text-heading-md font-mono font-bold ${rpm > engineBaseSpecs.redlineRpm ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                  {Math.round(rpm)} <span className="text-caption text-fg-muted">RPM</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Gear {gear} / 6 ({transmissionMode})
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">0-100 km/h</span>
                <span className="text-heading-md font-mono font-bold text-accent">
                  {zeroTo100Time !== null ? `${zeroTo100Time}s` : speedKmh > 5 ? 'Timing...' : '--'}
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Distance: {distanceMeters.toFixed(0)}m
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Brake Rotor Temp</span>
                <span className={`text-heading-md font-mono font-bold ${brakeTempCelsius > 500 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {Math.round(brakeTempCelsius)}°C
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  {brakeTempCelsius > 550 ? 'Brake Fade Warning' : 'Optimal Operating'}
                </span>
              </div>
            </div>
          </Card>

          {/* Pedals & Cockpit Controls */}
          <Card className="p-5 bg-surface-1 border-hairline space-y-4">
            <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
              <Sliders className="size-4 text-accent" />
              Cockpit Throttle, Braking & Steering Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Throttle Pedal (%)</span>
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
                  <span>Threshold Braking (%)</span>
                  <span className="font-bold text-rose-400">{brakePercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brakePercent}
                  onChange={(e) => setBrakePercent(Number(e.target.value))}
                  className="w-full accent-rose-500 mt-1.5"
                />
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Steering Angle (deg)</span>
                  <span className="font-bold text-fg">{steeringAngleDeg}°</span>
                </label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={steeringAngleDeg}
                  onChange={(e) => setSteeringAngleDeg(Number(e.target.value))}
                  className="w-full accent-accent mt-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-hairline/60">
              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Engine Type</span>
                <select
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value as typeof engineType)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value="Turbo I4">2.0L Turbo I4 (310 HP)</option>
                  <option value="NA Flat-6">4.0L NA Flat-6 (500 HP)</option>
                  <option value="Twin-Turbo V8">4.4L Twin-Turbo V8 (640 HP)</option>
                  <option value="Dual-Motor EV">Dual-Motor Electric (750 HP)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Tire Compound</span>
                <select
                  value={tireCompound}
                  onChange={(e) => setTireCompound(e.target.value as typeof tireCompound)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value="Racing Slick">Racing Slick (μ ≈ 1.45)</option>
                  <option value="Summer Sport">Summer Sport (μ ≈ 1.15)</option>
                  <option value="All-Season">All-Season (μ ≈ 0.90)</option>
                  <option value="Wet Track">Wet Track (μ ≈ 0.72)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Transmission</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTransmissionMode('Auto')}
                    className={`flex-1 py-1.5 rounded text-caption font-mono font-medium border ${
                      transmissionMode === 'Auto' ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-hairline bg-surface-2 text-fg-muted'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransmissionMode('Manual')}
                    className={`flex-1 py-1.5 rounded text-caption font-mono font-medium border ${
                      transmissionMode === 'Manual' ? 'border-accent bg-accent/10 text-accent font-bold' : 'border-hairline bg-surface-2 text-fg-muted'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Manual Shift</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setTransmissionMode('Manual');
                        setGear(g);
                      }}
                      className={`flex-1 py-1 text-[11px] font-mono rounded border ${
                        gear === g ? 'border-accent bg-accent text-slate-950 font-bold' : 'border-hairline bg-surface-2 text-fg'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: G-G Diagram & Custom Component Builder */}
        <div className="lg:col-span-4 space-y-4">
          {/* G-G Diagram Card */}
          <Card className="p-4 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-1.5">
                <Disc className="size-4 text-accent" />
                G-G Friction Ellipse Circle
              </h3>
              <Badge tone="accent" variant="outline" className="font-mono text-[10px]">
                μ = {effectiveTireMu.toFixed(2)}
              </Badge>
            </div>

            <div className="flex justify-center py-1">
              <canvas
                ref={ggCanvasRef}
                width={200}
                height={200}
                className="rounded-xl bg-slate-950 border border-hairline shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono text-caption">
              <div className="p-2 rounded bg-surface-2 border border-hairline">
                <span className="text-[10px] text-fg-muted block uppercase">Longitudinal G</span>
                <span className="font-bold text-fg">{longitudinalG.toFixed(2)} G</span>
              </div>
              <div className="p-2 rounded bg-surface-2 border border-hairline">
                <span className="text-[10px] text-fg-muted block uppercase">Lateral G</span>
                <span className="font-bold text-fg">{lateralG.toFixed(2)} G</span>
              </div>
            </div>
          </Card>

          {/* Custom Performance Mod Builder */}
          <Card className="p-4 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-1.5">
                <Zap className="size-4 text-accent" />
                Custom Tuning Components
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
                      {comp.downforceDeltaClA > 0 && <span>+{comp.downforceDeltaClA} ClA</span>}
                      {comp.tireMuDelta > 0 && <span>+{comp.tireMuDelta} μ Grip</span>}
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
                Install Custom Performance Part
              </span>
              <input
                type="text"
                placeholder="Part name (e.g. Titanium Full Exhaust)"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-surface-2 border border-hairline text-caption text-fg"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Power Delta (HP)</span>
                  <input
                    type="number"
                    step="10"
                    value={newCompHp}
                    onChange={(e) => setNewCompHp(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Weight Delta (kg)</span>
                  <input
                    type="number"
                    step="1"
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
                <span>Bolt On Custom Component</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
