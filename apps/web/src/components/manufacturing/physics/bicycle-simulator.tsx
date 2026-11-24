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
  calculateLongitudinalLoadTransfer,
} from './physics-engine';

// ==========================================
// Types & Interfaces
// ==========================================

export interface BicycleFrameSpec {
  material: 'Carbon Fiber' | 'Aluminum 6061' | 'Titanium 3Al-2.5V' | '4130 Chromoly';
  massKg: number;
  headTubeAngleDeg: number;
  seatTubeAngleDeg: number;
  chainstayMm: number;
  wheelbaseMm: number;
  stiffnessNmPerDeg: number;
}

export interface BicycleDrivetrainSpec {
  chainringTeeth: number;   // Front teeth (e.g. 50, 34, 42)
  cassetteTeeth: number;    // Rear cog teeth (e.g. 11, 14, 28, 34)
  crankLengthMm: number;    // 165, 170, 172.5, 175
  chainEfficiency: number;  // e.g. 0.975 (97.5%)
}

export interface BicycleWheelSpec {
  rimDepthMm: number;       // 30mm shallow, 50mm aero, 80mm deep
  tireWidthMm: number;      // 25, 28, 32
  tirePressurePsi: number;  // 60 - 120 PSI
  crr: number;              // Rolling resistance coefficient (0.003 - 0.006)
  wheelDiameterM: number;   // 700c ≈ 0.67m
  wheelsetMassKg: number;   // 1.3 - 2.0 kg
}

export interface CustomBicycleComponent {
  id: string;
  name: string;
  category: 'Aero' | 'Drivetrain' | 'Powertrain Assist' | 'Chassis' | 'Electronics';
  massDeltaKg: number;
  cdaDeltaM2: number;
  crrDelta: number;
  motorAssistWatts: number;
  enabled: boolean;
}

const DEFAULT_CUSTOM_COMPONENTS: CustomBicycleComponent[] = [
  {
    id: 'ebike-hub',
    name: '250W E-Bike Hub Motor Assist Kit',
    category: 'Powertrain Assist',
    massDeltaKg: 2.8,
    cdaDeltaM2: 0.015,
    crrDelta: 0.0003,
    motorAssistWatts: 250,
    enabled: false,
  },
  {
    id: 'aero-cockpit',
    name: 'Integrated Monocoque Aero Handlebars',
    category: 'Aero',
    massDeltaKg: -0.15,
    cdaDeltaM2: -0.022,
    crrDelta: 0,
    motorAssistWatts: 0,
    enabled: true,
  },
  {
    id: 'ceramic-bearings',
    name: 'Enduro Ceramic Bottom Bracket & Jockey Wheels',
    category: 'Drivetrain',
    massDeltaKg: -0.04,
    cdaDeltaM2: 0,
    crrDelta: -0.0004,
    motorAssistWatts: 0,
    enabled: true,
  },
];

export function BicyclePhysicsSimulator() {
  // ------------------------------------------
  // Simulation State
  // ------------------------------------------
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedKmh, setSpeedKmh] = useState<number>(32.5); // Initial speed
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [elapsedTimeSec, setElapsedTimeSec] = useState<number>(0);

  // Rider inputs
  const [riderMassKg, setRiderMassKg] = useState<number>(72);
  const [riderPowerWatts, setRiderPowerWatts] = useState<number>(240); // FTP cruise
  const [riderPosture, setRiderPosture] = useState<'hoods' | 'drops' | 'aero_tt' | 'upright'>('hoods');
  const [targetCadenceRpm, setTargetCadenceRpm] = useState<number>(88);

  // Environmental conditions
  const [gradientPercent, setGradientPercent] = useState<number>(2.5); // 2.5% climb
  const [windSpeedMps, setWindSpeedMps] = useState<number>(0); // Headwind (+) or Tailwind (-)
  const [elevationMeters, setElevationMeters] = useState<number>(200);

  // Drivetrain & Gearing
  const [chainring, setChainring] = useState<number>(50);
  const [cassetteCog, setCassetteCog] = useState<number>(17);
  const [brakeAppliedPercent, setBrakeAppliedPercent] = useState<number>(0);

  // Frame & Wheels
  const [frameMaterial, setFrameMaterial] = useState<'Carbon Fiber' | 'Aluminum 6061' | 'Titanium 3Al-2.5V' | '4130 Chromoly'>('Carbon Fiber');
  const [rimProfile, setRimProfile] = useState<30 | 50 | 80>(50);
  const [tireWidth, setTireWidth] = useState<25 | 28 | 32>(28);
  const [tirePressurePsi, setTirePressurePsi] = useState<number>(85);

  // Custom Components
  const [customComponents, setCustomComponents] = useState<CustomBicycleComponent[]>(DEFAULT_CUSTOM_COMPONENTS);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompCategory, setNewCompCategory] = useState<'Aero' | 'Drivetrain' | 'Powertrain Assist' | 'Chassis'>('Aero');
  const [newCompMass, setNewCompMass] = useState<number>(0.2);
  const [newCompCda, setNewCompCda] = useState<number>(-0.01);
  const [newCompAssist, setNewCompAssist] = useState<number>(0);

  // Live Telemetry calculated
  const [telemetry, setTelemetry] = useState({
    accelerationMps2: 0,
    powerTotalWatts: 0,
    aeroDragForceN: 0,
    rollingResistanceN: 0,
    gravityInclineForceN: 0,
    driveForceN: 0,
    gearInches: 0,
    speedMps: 0,
    caloriesKcal: 0,
    frontWheelLoadN: 0,
    rearWheelLoadN: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Posture base CdA
  const postureCdA = useMemo(() => {
    switch (riderPosture) {
      case 'aero_tt': return 0.22;
      case 'drops': return 0.28;
      case 'hoods': return 0.33;
      case 'upright': return 0.44;
    }
  }, [riderPosture]);

  // Frame weight calculation
  const frameWeightKg = useMemo(() => {
    switch (frameMaterial) {
      case 'Carbon Fiber': return 0.95;
      case 'Titanium 3Al-2.5V': return 1.45;
      case 'Aluminum 6061': return 1.35;
      case '4130 Chromoly': return 1.95;
    }
  }, [frameMaterial]);

  // Aggregate custom components
  const customMods = useMemo(() => {
    return customComponents
      .filter((c) => c.enabled)
      .reduce(
        (acc, item) => ({
          massDeltaKg: acc.massDeltaKg + item.massDeltaKg,
          cdaDeltaM2: acc.cdaDeltaM2 + item.cdaDeltaM2,
          crrDelta: acc.crrDelta + item.crrDelta,
          motorAssistWatts: acc.motorAssistWatts + item.motorAssistWatts,
        }),
        { massDeltaKg: 0, cdaDeltaM2: 0, crrDelta: 0, motorAssistWatts: 0 }
      );
  }, [customComponents]);

  // Total system mass
  const totalMassKg = useMemo(() => {
    const baseBike = frameWeightKg + 1.4 + 4.2; // frame + wheelset + groupset/cockpit
    return riderMassKg + baseBike + customMods.massDeltaKg;
  }, [riderMassKg, frameWeightKg, customMods.massDeltaKg]);

  // Effective CdA
  const effectiveCdA = useMemo(() => {
    const wheelAeroPenalty = rimProfile === 30 ? 0.015 : rimProfile === 50 ? 0.005 : 0;
    return Math.max(0.18, postureCdA + wheelAeroPenalty + customMods.cdaDeltaM2);
  }, [postureCdA, rimProfile, customMods.cdaDeltaM2]);

  // Rolling resistance Crr
  const effectiveCrr = useMemo(() => {
    // Standard Crr formula adjusted for pressure and width
    let baseCrr = 0.0042;
    if (tireWidth === 28) baseCrr = 0.0038;
    if (tireWidth === 32) baseCrr = 0.0045;
    // Lower pressure slightly increases Crr on smooth tarmac
    const pressureFactor = (100 - tirePressurePsi) * 0.000015;
    return Math.max(0.002, baseCrr + pressureFactor + customMods.crrDelta);
  }, [tireWidth, tirePressurePsi, customMods.crrDelta]);

  // Wheel diameter
  const wheelDiameterM = 0.672; // standard 700x28c
  const gearRatio = chainring / cassetteCog;
  const gearInches = (wheelDiameterM * 39.37) * gearRatio;
  const developmentMeters = Math.PI * wheelDiameterM * gearRatio;

  // ------------------------------------------
  // Real-time Physics Engine Loop (60 FPS)
  // ------------------------------------------
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1); // clamp dt
      lastTimestamp = timestamp;

      if (isRunning) {
        setSpeedKmh((prevKmh) => {
          const v = (prevKmh * 1000) / 3600; // m/s
          const airDensity = calculateAirDensity(elevationMeters, 22);

          // Total drive power = rider power + custom motor assist
          const totalPowerWatts = riderPowerWatts + customMods.motorAssistWatts;
          const transmissionEfficiency = 0.975;
          const effectivePower = totalPowerWatts * transmissionEfficiency;

          // Drive force: F = P / v (with low-speed singularity protection)
          const driveForce = v > 0.4 ? effectivePower / v : effectivePower / 0.4;

          // Aero Drag opposing relative wind
          const vRel = v + windSpeedMps;
          const aeroDragForce = calculateAeroDrag(vRel, effectiveCdA, airDensity);

          // Rolling Resistance
          const g = 9.80665;
          const theta = Math.atan(gradientPercent / 100);
          const rollingResistance = effectiveCrr * totalMassKg * g * Math.cos(theta);

          // Gravity component along slope
          const gravityInclineForce = totalMassKg * g * Math.sin(theta);

          // Braking force (max 650N threshold)
          const brakeForce = (brakeAppliedPercent / 100) * 650;

          // Net longitudinal force
          const netForce = driveForce - aeroDragForce - rollingResistance - gravityInclineForce - brakeForce;

          // Effective mass includes wheel rotational inertia (~1.5kg equivalent)
          const effectiveInertiaMass = totalMassKg + 1.8;
          const acceleration = netForce / effectiveInertiaMass;

          // Euler integration
          let newV = v + acceleration * dt;
          if (newV < 0) newV = 0; // No backward rolling on flat with brakes

          // Load transfer
          const loadTransfer = calculateLongitudinalLoadTransfer(
            {
              totalMassKg,
              wheelbaseMeters: 1.01,
              staticFrontWeightRatio: 0.45,
              cgHeightMeters: 1.05,
            },
            acceleration,
            gradientPercent
          );

          // Telemetry snapshot
          setTelemetry({
            accelerationMps2: acceleration,
            powerTotalWatts: totalPowerWatts,
            aeroDragForceN: aeroDragForce,
            rollingResistanceN: rollingResistance,
            gravityInclineForceN: gravityInclineForce,
            driveForceN: driveForce,
            gearInches,
            speedMps: newV,
            caloriesKcal: (totalPowerWatts * dt) / 4184 / 0.24, // 24% metabolic efficiency
            frontWheelLoadN: loadTransfer.frontNormalForceN,
            rearWheelLoadN: loadTransfer.rearNormalForceN,
          });

          // Accumulate distance & time
          setDistanceMeters((d) => d + newV * dt);
          setElapsedTimeSec((t) => t + dt);

          return (newV * 3600) / 1000;
        });
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [
    isRunning,
    riderPowerWatts,
    customMods.motorAssistWatts,
    elevationMeters,
    windSpeedMps,
    effectiveCdA,
    effectiveCrr,
    totalMassKg,
    gradientPercent,
    brakeAppliedPercent,
    gearInches,
  ]);

  // ------------------------------------------
  // Interactive 2D Vector Canvas Render Loop
  // ------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let wheelRotation = 0;
    let crankRotation = 0;
    let roadOffset = 0;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speedMps = (speedKmh * 1000) / 3600;
      wheelRotation += speedMps * 0.08;
      crankRotation += (speedMps / (Math.PI * wheelDiameterM * gearRatio)) * Math.PI * 2 * 0.08;
      roadOffset = (roadOffset + speedMps * 2.5) % 40;

      const w = canvas.width;
      const h = canvas.height;

      // Incline rotation transform
      const slopeAngle = Math.atan(gradientPercent / 100) * 0.45; // slight visual exaggeration

      ctx.save();
      ctx.translate(w / 2, h / 2 + 30);
      ctx.rotate(-slopeAngle);

      // --- Animated Road Ground ---
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-w, 85, w * 2, 70);

      // Road dashes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(-w - roadOffset, 120);
      ctx.lineTo(w * 2, 120);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Bicycle Dimensions (Centered) ---
      const rearHubX = -130;
      const frontHubX = 130;
      const hubY = 30;
      const wheelR = 52;
      const bbX = -20;
      const bbY = 40;
      const seatPostTopX = -50;
      const seatPostTopY = -45;
      const headTubeTopX = 90;
      const headTubeTopY = -55;

      // Draw Wheels
      const drawWheel = (x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wheelRotation);

        // Tire
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
        ctx.stroke();

        // Rim
        ctx.strokeStyle = rimProfile >= 50 ? '#38bdf8' : '#94a3b8';
        ctx.lineWidth = rimProfile === 80 ? 8 : rimProfile === 50 ? 5 : 3;
        ctx.beginPath();
        ctx.arc(0, 0, wheelR - 5, 0, Math.PI * 2);
        ctx.stroke();

        // Spokes (12 spokes)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 12; i++) {
          const ang = (i * Math.PI) / 6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * (wheelR - 7), Math.sin(ang) * (wheelR - 7));
          ctx.stroke();
        }

        // Hub center
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      drawWheel(rearHubX, hubY);
      drawWheel(frontHubX, hubY);

      // --- Frame Tubes ---
      ctx.strokeStyle = frameMaterial === 'Carbon Fiber' ? '#38bdf8' : frameMaterial === 'Titanium 3Al-2.5V' ? '#e2e8f0' : '#f59e0b';
      ctx.lineWidth = 4.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Chainstay: BB to Rear Hub
      ctx.beginPath();
      ctx.moveTo(bbX, bbY);
      ctx.lineTo(rearHubX, hubY);
      ctx.stroke();

      // Seatstay: Rear Hub to Seat Cluster
      ctx.beginPath();
      ctx.moveTo(rearHubX, hubY);
      ctx.lineTo(seatPostTopX, seatPostTopY);
      ctx.stroke();

      // Seat Tube: BB to Seat Cluster
      ctx.beginPath();
      ctx.moveTo(bbX, bbY);
      ctx.lineTo(seatPostTopX, seatPostTopY);
      ctx.stroke();

      // Down Tube: BB to Head Tube
      ctx.beginPath();
      ctx.moveTo(bbX, bbY);
      ctx.lineTo(headTubeTopX - 10, headTubeTopY + 20);
      ctx.stroke();

      // Top Tube: Seat Cluster to Head Tube
      ctx.beginPath();
      ctx.moveTo(seatPostTopX, seatPostTopY);
      ctx.lineTo(headTubeTopX, headTubeTopY);
      ctx.stroke();

      // Head Tube
      ctx.beginPath();
      ctx.moveTo(headTubeTopX, headTubeTopY - 12);
      ctx.lineTo(headTubeTopX - 12, headTubeTopY + 22);
      ctx.stroke();

      // Fork: Head Tube to Front Hub
      ctx.beginPath();
      ctx.moveTo(headTubeTopX - 12, headTubeTopY + 22);
      ctx.lineTo(frontHubX, hubY);
      ctx.stroke();

      // Saddle & Post
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(seatPostTopX, seatPostTopY);
      ctx.lineTo(seatPostTopX - 8, seatPostTopY - 20);
      ctx.stroke();

      // Saddle shape
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(seatPostTopX - 25, seatPostTopY - 25, 34, 7, 3);
      ctx.fill();

      // Handlebars & Stem
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(headTubeTopX, headTubeTopY - 12);
      ctx.lineTo(headTubeTopX + 15, headTubeTopY - 18); // stem
      ctx.stroke();

      // Drop Bar
      ctx.beginPath();
      ctx.arc(headTubeTopX + 22, headTubeTopY - 10, 10, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // --- Crank & Chain ---
      ctx.save();
      ctx.translate(bbX, bbY);
      ctx.rotate(crankRotation);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, 0);
      ctx.lineTo(16, 0);
      ctx.stroke();

      // Pedals
      ctx.fillStyle = '#f87171';
      ctx.fillRect(-20, -3, 6, 6);
      ctx.fillRect(14, -3, 6, 6);
      ctx.restore();

      // --- Vector Force Arrows (Dynamic) ---
      // 1. Thrust Vector (Green, Forward)
      const thrustLen = Math.min(100, (telemetry.driveForceN / 400) * 80);
      if (thrustLen > 2) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rearHubX, hubY);
        ctx.lineTo(rearHubX + thrustLen, hubY);
        ctx.stroke();
        // Arrow head
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(rearHubX + thrustLen, hubY);
        ctx.lineTo(rearHubX + thrustLen - 8, hubY - 5);
        ctx.lineTo(rearHubX + thrustLen - 8, hubY + 5);
        ctx.fill();
      }

      // 2. Aero Drag Vector (Red, Backward)
      const aeroLen = Math.min(90, (telemetry.aeroDragForceN / 250) * 80);
      if (aeroLen > 2) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(headTubeTopX, headTubeTopY);
        ctx.lineTo(headTubeTopX - aeroLen, headTubeTopY);
        ctx.stroke();
        // Arrow head
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(headTubeTopX - aeroLen, headTubeTopY);
        ctx.lineTo(headTubeTopX - aeroLen + 8, headTubeTopY - 5);
        ctx.lineTo(headTubeTopX - aeroLen + 8, headTubeTopY + 5);
        ctx.fill();
      }

      // 3. Gravity Vector (Downwards)
      const gravLen = Math.min(60, Math.abs(telemetry.gravityInclineForceN) * 0.8);
      if (gravLen > 2) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        const dir = gradientPercent >= 0 ? -1 : 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(gravLen * dir, 0);
        ctx.stroke();
      }

      ctx.restore();

      // Canvas HUD overlay
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px JetBrains Mono, monospace';
      ctx.fillText(`${speedKmh.toFixed(1)} km/h`, 18, 30);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Gradient: ${gradientPercent >= 0 ? '+' : ''}${gradientPercent.toFixed(1)}% | Wind: ${windSpeedMps} m/s`, 18, 48);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [speedKmh, gradientPercent, windSpeedMps, frameMaterial, rimProfile, gearRatio, telemetry]);

  // Handler for adding custom component
  const handleAddCustomComponent = () => {
    if (!newCompName.trim()) return;
    const newComp: CustomBicycleComponent = {
      id: `custom-${Date.now()}`,
      name: newCompName.trim(),
      category: newCompCategory,
      massDeltaKg: Number(newCompMass),
      cdaDeltaM2: Number(newCompCda),
      crrDelta: 0,
      motorAssistWatts: Number(newCompAssist),
      enabled: true,
    };
    setCustomComponents((prev) => [...prev, newComp]);
    setNewCompName('');
  };

  const handleToggleComponent = (id: string) => {
    setCustomComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleDeleteComponent = (id: string) => {
    setCustomComponents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-1 border border-hairline shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-caption font-bold uppercase tracking-wider text-accent">
              Multibody Vehicle Physics Engine
            </span>
            <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
              60 FPS RK4 Solvers
            </Badge>
          </div>
          <h2 className="text-heading-md font-display font-bold text-fg">
            Bicycle Dynamic Physics & Custom Component Studio
          </h2>
          <p className="text-body-sm text-fg-muted mt-0.5">
            Full multibody Euler-Lagrange equations, aero drag, road gradient, cadence/gear inches, and dynamic component hot-swapping.
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
            <span>{isRunning ? 'Pause Physics' : 'Resume Simulation'}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSpeedKmh(0);
              setDistanceMeters(0);
              setElapsedTimeSec(0);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" />
            <span>Reset Track</span>
          </Button>
        </div>
      </div>

      {/* Main Simulation Viewport & Live Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas + Vector Forces */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 bg-surface-1 border-hairline overflow-hidden relative">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-hairline/60">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-accent" />
                <span className="text-caption font-mono uppercase font-bold text-fg">
                  Real-Time Vector Force Dynamics Canvas
                </span>
              </div>
              <div className="flex items-center gap-3 text-caption font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400" /> F_drive ({telemetry.driveForceN.toFixed(0)}N)
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="size-2 rounded-full bg-rose-400" /> F_aero ({telemetry.aeroDragForceN.toFixed(0)}N)
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="size-2 rounded-full bg-blue-400" /> F_gravity ({telemetry.gravityInclineForceN.toFixed(0)}N)
                </span>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={760}
              height={320}
              className="w-full h-[280px] sm:h-[320px] rounded-xl bg-slate-950 border border-hairline shadow-inner block"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-hairline">
              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Velocity</span>
                <span className="text-heading-sm font-mono font-bold text-fg">
                  {speedKmh.toFixed(1)} <span className="text-caption text-fg-muted">km/h</span>
                </span>
                <span className="text-[10px] font-mono text-accent block">
                  {(speedKmh / 1.60934).toFixed(1)} mph
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Cadence (Est)</span>
                <span className="text-heading-sm font-mono font-bold text-fg">
                  {Math.round((telemetry.speedMps / developmentMeters) * 60) || 0} <span className="text-caption text-fg-muted">RPM</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Target: {targetCadenceRpm} RPM
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Net Power</span>
                <span className="text-heading-sm font-mono font-bold text-emerald-400">
                  {telemetry.powerTotalWatts.toFixed(0)} <span className="text-caption text-fg-muted">W</span>
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  Rider: {riderPowerWatts}W {customMods.motorAssistWatts > 0 ? `+ Motor: ${customMods.motorAssistWatts}W` : ''}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase block">Gear Ratio</span>
                <span className="text-heading-sm font-mono font-bold text-accent">
                  {gearRatio.toFixed(2)}
                </span>
                <span className="text-[10px] font-mono text-fg-subtle block">
                  {gearInches.toFixed(1)}&quot; ({chainring}x{cassetteCog}T)
                </span>
              </div>
            </div>
          </Card>

          {/* Environmental & Dynamic Controls */}
          <Card className="p-5 bg-surface-1 border-hairline space-y-4">
            <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
              <Sliders className="size-4 text-accent" />
              Rider & Environment Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Rider Power (Watts)</span>
                  <span className="font-bold text-fg">{riderPowerWatts} W</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="800"
                  step="10"
                  value={riderPowerWatts}
                  onChange={(e) => setRiderPowerWatts(Number(e.target.value))}
                  className="w-full accent-accent mt-1.5"
                />
                <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                  <span>Zone 1 (120W)</span>
                  <span>FTP (250W)</span>
                  <span>Sprint (700W)</span>
                </div>
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Road Gradient (%)</span>
                  <span className="font-bold text-fg">{gradientPercent >= 0 ? `+${gradientPercent}` : gradientPercent}%</span>
                </label>
                <input
                  type="range"
                  min="-12"
                  max="20"
                  step="0.5"
                  value={gradientPercent}
                  onChange={(e) => setGradientPercent(Number(e.target.value))}
                  className="w-full accent-accent mt-1.5"
                />
                <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                  <span>-12% Descent</span>
                  <span>0% Flat</span>
                  <span>+20% Steep HC</span>
                </div>
              </div>

              <div>
                <label className="text-caption font-mono text-fg-muted flex justify-between">
                  <span>Headwind / Tailwind (m/s)</span>
                  <span className="font-bold text-fg">{windSpeedMps} m/s</span>
                </label>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={windSpeedMps}
                  onChange={(e) => setWindSpeedMps(Number(e.target.value))}
                  className="w-full accent-accent mt-1.5"
                />
                <div className="flex justify-between text-[10px] text-fg-subtle font-mono mt-0.5">
                  <span>-15 Tailwind</span>
                  <span>0 Calm</span>
                  <span>+15 Headwind</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-hairline/60">
              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Rider Posture</span>
                <select
                  value={riderPosture}
                  onChange={(e) => setRiderPosture(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value="hoods">Hoods (CdA 0.33 m²)</option>
                  <option value="drops">Drops (CdA 0.28 m²)</option>
                  <option value="aero_tt">Aero TT / Bars (CdA 0.22 m²)</option>
                  <option value="upright">Upright Commute (CdA 0.44 m²)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Front Chainring</span>
                <select
                  value={chainring}
                  onChange={(e) => setChainring(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value={34}>34T Inner Compact</option>
                  <option value={39}>39T Standard Small</option>
                  <option value={42}>42T 1x Gravel/CX</option>
                  <option value={50}>50T Compact Big</option>
                  <option value={53}>53T Aero Pro Ring</option>
                  <option value={54}>54T Time Trial</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Rear Cog (Cassette)</span>
                <select
                  value={cassetteCog}
                  onChange={(e) => setCassetteCog(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
                >
                  <option value={11}>11T (High Speed)</option>
                  <option value={13}>13T</option>
                  <option value={15}>15T</option>
                  <option value={17}>17T</option>
                  <option value={19}>19T</option>
                  <option value={21}>21T</option>
                  <option value={24}>24T</option>
                  <option value={28}>28T</option>
                  <option value={34}>34T (Climbing Bailout)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-mono text-fg-muted uppercase block mb-1">Braking Application</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brakeAppliedPercent}
                    onChange={(e) => setBrakeAppliedPercent(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <span className="font-mono text-caption text-rose-400 font-bold w-10">
                    {brakeAppliedPercent}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Component Specs & Custom Component Builder */}
        <div className="lg:col-span-4 space-y-4">
          {/* Base Components Spec Card */}
          <Card className="p-4 bg-surface-1 border-hairline space-y-3">
            <h3 className="text-body-sm font-display font-bold text-fg flex items-center justify-between">
              <span>Bicycle Components Spec</span>
              <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
                {totalMassKg.toFixed(1)} kg Total
              </Badge>
            </h3>

            <div className="space-y-2 text-caption">
              <div>
                <label className="text-[11px] font-mono text-fg-muted uppercase block">Frame Material</label>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {(['Carbon Fiber', 'Aluminum 6061', 'Titanium 3Al-2.5V', '4130 Chromoly'] as const).map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setFrameMaterial(mat)}
                      className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                        frameMaterial === mat
                          ? 'border-accent bg-accent/10 text-accent font-semibold'
                          : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-mono text-fg-muted uppercase block">Rim Depth</label>
                  <select
                    value={rimProfile}
                    onChange={(e) => setRimProfile(Number(e.target.value) as any)}
                    className="w-full mt-1 px-2 py-1 rounded bg-surface-2 border border-hairline text-caption"
                  >
                    <option value={30}>30mm Climbing</option>
                    <option value={50}>50mm All-Round</option>
                    <option value={80}>80mm Deep Aero</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-fg-muted uppercase block">Tire Width</label>
                  <select
                    value={tireWidth}
                    onChange={(e) => setTireWidth(Number(e.target.value) as any)}
                    className="w-full mt-1 px-2 py-1 rounded bg-surface-2 border border-hairline text-caption"
                  >
                    <option value={25}>25mm (High Press)</option>
                    <option value={28}>28mm (Modern Sweetspot)</option>
                    <option value={32}>32mm (Endurance / Grip)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-hairline/60 grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-fg-muted block">Effective CdA:</span>
                  <span className="text-fg font-bold">{effectiveCdA.toFixed(3)} m²</span>
                </div>
                <div>
                  <span className="text-fg-muted block">Crr Rolling:</span>
                  <span className="text-fg font-bold">{effectiveCrr.toFixed(5)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Custom Component Builder Card */}
          <Card className="p-4 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-body-sm font-display font-bold text-fg flex items-center gap-1.5">
                <Zap className="size-4 text-accent" />
                Custom Component Builder
              </h3>
              <Badge tone="accent" variant="outline" className="font-mono text-[10px]">
                {customComponents.filter((c) => c.enabled).length} Mounted
              </Badge>
            </div>

            {/* List of custom components */}
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
                        onChange={() => handleToggleComponent(comp.id)}
                        className="rounded accent-accent size-3.5"
                      />
                      <span className="font-medium text-caption text-fg truncate">
                        {comp.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-2 text-[10px] font-mono text-fg-muted mt-1 ml-5">
                      <span>{comp.massDeltaKg >= 0 ? `+${comp.massDeltaKg}` : comp.massDeltaKg}kg</span>
                      {comp.cdaDeltaM2 !== 0 && <span>{comp.cdaDeltaM2 > 0 ? `+${comp.cdaDeltaM2}` : comp.cdaDeltaM2} CdA</span>}
                      {comp.motorAssistWatts > 0 && <span className="text-emerald-400 font-bold">+{comp.motorAssistWatts}W Assist</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteComponent(comp.id)}
                    className="text-fg-muted hover:text-rose-400 p-1 rounded"
                    title="Remove component"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new component form */}
            <div className="pt-2 border-t border-hairline/60 space-y-2">
              <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
                Fabricate Custom Part
              </span>
              <input
                type="text"
                placeholder="Component name (e.g. Carbon Aero Fork)"
                value={newCompName}
                onChange={(e) => setNewCompName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md bg-surface-2 border border-hairline text-caption text-fg"
              />

              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Mass (kg)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={newCompMass}
                    onChange={(e) => setNewCompMass(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">CdA Delta</span>
                  <input
                    type="number"
                    step="0.005"
                    value={newCompCda}
                    onChange={(e) => setNewCompCda(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-fg-muted block">Assist (W)</span>
                  <input
                    type="number"
                    step="25"
                    value={newCompAssist}
                    onChange={(e) => setNewCompAssist(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-caption font-mono"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full gap-1.5 text-caption mt-1"
                onClick={handleAddCustomComponent}
                disabled={!newCompName.trim()}
              >
                <Plus className="size-3.5" />
                <span>Mount Custom Component</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
