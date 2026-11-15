'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { Simulator3DLab, type Lab3DModelType } from '@/components/manufacturing/physics/3d/simulator-3d-lab';
import { TelemetryExporter } from '@/components/manufacturing/physics/telemetry-exporter';
import { Badge, Button, Card, cn } from '@hackerland/ui';
import {
  Box,
  Compass,
  Cpu,
  Zap,
  Activity,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Gauge,
  Layers,
} from 'lucide-react';

const LAB_DOMAINS: {
  id: Lab3DModelType;
  name: string;
  category: string;
  badge: string;
  desc: string;
  specs: { label: string; value: string }[];
}[] = [
  {
    id: 'drone',
    name: 'Quadcopter Drone (6-DOF)',
    category: 'Aeronautics',
    badge: '4x Brushless & PID',
    desc: 'Full 6 degrees-of-freedom attitude kinematics, thrust vector projection, motor RPM synchronization, and FPV gimbal pitch.',
    specs: [
      { label: 'AUW Mass', value: '650 g' },
      { label: 'Max Thrust', value: '3,800 g' },
      { label: 'Propeller Pitch', value: '5.1x4.6x3' },
      { label: 'Battery', value: '6S 1400mAh 150C' },
    ],
  },
  {
    id: 'rocket',
    name: 'Aerospace Orbital Rocket',
    category: 'Orbital Mechanics',
    badge: 'Tsiolkovsky & Max-Q',
    desc: 'Supersonic exhaust plume particle simulation, staging separation ring, 4 grid fin steering, and gravity-turn trajectory.',
    specs: [
      { label: 'Wet Mass', value: '18,500 kg' },
      { label: 'Sea-Level Thrust', value: '240 kN' },
      { label: 'Specific Impulse', value: '315 s' },
      { label: 'Target Apogee', value: '250 km LEO' },
    ],
  },
  {
    id: 'car',
    name: 'High-Performance GT3 Racecar',
    category: 'Vehicle Dynamics',
    badge: 'Pacejka Tires & Aero',
    desc: '4 rotating alloy wheels, carbon GT rear wing downforce, front aerodynamic splitter, chassis roll/pitch squat, and tire slip angle.',
    specs: [
      { label: 'Curb Weight', value: '1,240 kg' },
      { label: 'Downforce', value: '450 kg @ 200 km/h' },
      { label: 'Power Output', value: '520 bhp' },
      { label: 'Braking G', value: '1.85 g' },
    ],
  },
  {
    id: 'ev',
    name: '800V SiC Electric Vehicle',
    category: 'Electrification',
    badge: 'Skateboard Pack & Regen',
    desc: 'Transparent chassis revealing the modular 800V skateboard battery pack, dual in-wheel electric motors, and power flow vectors.',
    specs: [
      { label: 'Battery Capacity', value: '100 kWh' },
      { label: 'Voltage Architecture', value: '800 V' },
      { label: 'Peak Regen', value: '250 kW' },
      { label: 'Inverter', value: 'Silicon Carbide (SiC)' },
    ],
  },
  {
    id: 'motorbike',
    name: 'Superbike Motorcycle (60° Lean)',
    category: 'Two-Wheel Dynamics',
    badge: 'Contact Patch Shift',
    desc: 'Coupled roll-yaw-steer kinematics, dual floating disc brakes, front fork suspension geometry, and high-lean tire displacement.',
    specs: [
      { label: 'Dry Weight', value: '168 kg' },
      { label: 'Peak Lean Angle', value: '64.5°' },
      { label: 'Engine', value: '998cc 16V Inline-4' },
      { label: 'Top Speed', value: '315 km/h' },
    ],
  },
  {
    id: 'bicycle',
    name: 'Aero Diamond Bicycle & E-Bike',
    category: 'Human & Assist Drive',
    badge: 'Vector Forces & Gears',
    desc: 'Lightweight diamond carbon frame, deep-section aero wheels with rotating spokes, crankset torque transfer, and pedal cadence.',
    specs: [
      { label: 'Frame Weight', value: '820 g' },
      { label: 'Drag Area (CdA)', value: '0.225 m²' },
      { label: 'Chainring', value: '54T Aero' },
      { label: 'E-Assist Motor', value: '250 W Mid-Drive' },
    ],
  },
  {
    id: 'mcu',
    name: 'Cyber-Physical Microcontroller Lab',
    category: 'Embedded & PCB',
    badge: '4-Layer PCB & SMT IC',
    desc: 'Interactive 3D PCB board with active pulsing status LEDs, ARM Cortex microcontroller QFP package, USB-C port, and test headers.',
    specs: [
      { label: 'PCB Layers', value: '4-Layer FR4' },
      { label: 'Clock Speed', value: '168 MHz' },
      { label: 'Logic Level', value: '3.3 V CMOS' },
      { label: 'Interfaces', value: 'CAN, SPI, I2C, UART' },
    ],
  },
];

export default function Simulator3DLabPage() {
  const [activeDomain, setActiveDomain] = useState<Lab3DModelType>('drone');
  const [throttle, setThrottle] = useState(65);
  const [pitch, setPitch] = useState(12);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(0);

  const currentDomain = LAB_DOMAINS.find((d) => d.id === activeDomain) || LAB_DOMAINS[0]!;

  // Dynamic calculated metrics based on sliders
  const calculatedSpeed = (throttle * 1.6 + Math.abs(pitch) * 0.8);
  const calculatedAltitude = (throttle > 50 ? (throttle - 50) * 1.2 + 8 : 4);
  const calculatedPower = (throttle * 9.5 + 45);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <StudioBreadcrumb
        title="3D Virtual Simulator Labs"
        category="Simulation Studio"
        badge="WebGL 2.0 · 60 FPS"
        activeId="3d"
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-hairline bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-accent uppercase font-bold tracking-wider">
              High-Fidelity 3D Simulation Engine
            </span>
            <Badge tone="accent" variant="solid" className="font-mono text-[9px]">
              Hardware & Physics
            </Badge>
          </div>
          <h1 className="font-display text-headline-lg font-bold text-fg">
            Interactive 3D Virtual Labs for All Engineering Domains
          </h1>
          <p className="text-body-sm text-fg-muted max-w-3xl">
            Simulate multicopter drones, aerospace rockets, race vehicles, 800V EV powertrains, superbikes, bicycles, and embedded microcontroller PCBs in full 3D with Runge-Kutta 4 dynamic telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="secondary" size="sm">
            <Link href="/manufacturing/physics">
              <span>2D Kinematics View</span>
            </Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/manufacturing">
              <span>Manufacturing Hub</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Domain Selection Tabs (7 Models) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {LAB_DOMAINS.map((domain) => {
          const isSelected = activeDomain === domain.id;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => {
                setActiveDomain(domain.id);
                if (domain.id === 'rocket') {
                  setPitch(0);
                  setRoll(0);
                }
              }}
              className={cn(
                'p-3 rounded-xl border text-left transition-all relative overflow-hidden',
                isSelected
                  ? 'border-accent bg-accent/15 shadow-sm ring-1 ring-accent/30'
                  : 'border-hairline bg-surface-1 hover:border-hairline-strong hover:bg-surface-2 text-fg-muted hover:text-fg'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono uppercase text-fg-subtle truncate">
                  {domain.category}
                </span>
                {isSelected && <span className="size-1.5 rounded-full bg-accent animate-pulse" />}
              </div>
              <h3 className={cn('text-caption font-bold truncate', isSelected ? 'text-accent' : 'text-fg')}>
                {domain.name.split(' (')[0]}
              </h3>
              <span className="text-[9px] font-mono text-accent truncate block mt-0.5">
                {domain.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Simulator Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Left: 3D WebGL Canvas Component */}
        <div className="space-y-4">
          <Simulator3DLab
            modelType={activeDomain}
            throttle={throttle}
            speedKmh={calculatedSpeed}
            altitude={calculatedAltitude}
            pitchDeg={pitch}
            rollDeg={roll}
            yawDeg={yaw}
            height={520}
          />

          {/* Quick Specifications Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentDomain.specs.map((s) => (
              <div key={s.label} className="p-3 rounded-xl border border-hairline bg-surface-1 text-center">
                <span className="text-[10px] font-mono text-fg-subtle uppercase block">{s.label}</span>
                <span className="font-display font-bold text-body-sm text-fg mt-0.5 block">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Physics Sliders & Dynamic Telemetry Controls */}
        <div className="space-y-4">
          <Card className="p-5 space-y-5 border-hairline bg-surface-1">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-accent" />
                <h3 className="font-display text-body-sm font-bold text-fg">Physics Telemetry Controls</h3>
              </div>
              <Badge tone="accent" variant="outline" className="font-mono text-[9px]">
                60 FPS Live
              </Badge>
            </div>

            {/* Throttle Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-caption font-mono">
                <span className="text-fg-subtle">Engine Throttle:</span>
                <span className="font-bold text-accent">{throttle}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={throttle}
                onChange={(e) => setThrottle(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-fg-subtle">
                <span>Idle (0%)</span>
                <span>Cruising (50%)</span>
                <span>Max Power (100%)</span>
              </div>
            </div>

            {/* Pitch / Elevation Angle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-caption font-mono">
                <span className="text-fg-subtle">Pitch / Attack Angle:</span>
                <span className="font-bold text-fg">{pitch}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-fg-subtle">
                <span>Nose Down (-45°)</span>
                <span>Level (0°)</span>
                <span>Nose Up (+45°)</span>
              </div>
            </div>

            {/* Roll / Lean Angle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-caption font-mono">
                <span className="text-fg-subtle">Roll / Lean Angle:</span>
                <span className="font-bold text-fg">{roll}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={roll}
                onChange={(e) => setRoll(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-fg-subtle">
                <span>Left (-60°)</span>
                <span>Upright (0°)</span>
                <span>Right (+60°)</span>
              </div>
            </div>

            {/* Quick Reset Controls Button */}
            <div className="pt-2 border-t border-hairline flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setThrottle(50);
                  setPitch(0);
                  setRoll(0);
                  setYaw(0);
                }}
                className="inline-flex items-center gap-1.5 text-caption font-mono text-fg-subtle hover:text-fg transition-colors"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Trim & Sliders</span>
              </button>

              <span className="text-[10px] font-mono text-fg-subtle">
                Est. Power: {calculatedPower.toFixed(0)} kW
              </span>
            </div>
          </Card>

          {/* Model Description Box */}
          <div className="p-4 rounded-xl border border-hairline bg-surface-2/60 space-y-2">
            <span className="font-mono text-[10px] uppercase text-accent font-bold">
              Engineering Domain Overview
            </span>
            <p className="text-body-sm text-fg-muted leading-relaxed">
              {currentDomain.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Export & Telemetry Action Strip */}
      <TelemetryExporter
        vehicleType={activeDomain === 'mcu' ? 'drone' : activeDomain}
        vehicleName={currentDomain.name}
      />
    </div>
  );
}
