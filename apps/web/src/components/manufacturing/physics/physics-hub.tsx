'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@hackerland/ui';
import {
  Bike,
  Car,
  Rocket,
  Compass,
  Zap,
  Layers,
  ArrowRight,
  ExternalLink,
  Activity,
  Sliders,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { BicyclePhysicsSimulator } from './bicycle-simulator';
import { CarPhysicsSimulator } from './car-simulator';
import { MotorbikePhysicsSimulator } from './motorbike-simulator';
import { DronePhysicsSimulator } from './drone-simulator';
import { EvPowertrainSimulator } from './ev-simulator';
import { RocketTrajectorySimulator } from './rocket-simulator';
import { TelemetryExporter } from './telemetry-exporter';

export type PhysicsVehicleType = 'bicycle' | 'car' | 'motorbike' | 'drone' | 'ev' | 'rocket';

export interface PhysicsHubProps {
  initialVehicle?: PhysicsVehicleType;
}

const VEHICLES = [
  {
    id: 'bicycle' as const,
    name: 'Bicycle Physics',
    category: 'Human & E-Bike',
    badge: 'Vector Forces & Gears',
    desc: 'Multibody frame geometry, crank cadence, gear inches, rolling resistance, and e-bike assist kit builder.',
    href: '/manufacturing/physics/bicycle',
  },
  {
    id: 'car' as const,
    name: 'High-Performance Car',
    category: 'Automotive Dynamics',
    badge: 'Pacejka Tires & G-G Circle',
    desc: 'Coupled engine torque maps, transmission gear steps, aerodynamic downforce, chassis squat/dive, and live friction circle.',
    href: '/manufacturing/physics/car',
  },
  {
    id: 'motorbike' as const,
    name: 'Superbike Motorcycle',
    category: 'Two-Wheel Dynamics',
    badge: '60°+ Lean & Anti-Wheelie',
    desc: 'Coupled roll-yaw-steer kinematics, tire crown contact patch shift, traction control, and aerodynamic winglets.',
    href: '/manufacturing/physics/motorbike',
  },
  {
    id: 'drone' as const,
    name: 'Quadcopter Drone',
    category: 'Aeronautics (6-DOF)',
    badge: 'Rotor Aerodynamics & PID',
    desc: 'Individual brushless motor thrust, Euler angle attitude integration, battery voltage sag, and PID response.',
    href: '/manufacturing/physics/drone',
  },
  {
    id: 'ev' as const,
    name: 'EV Powertrain & Battery',
    category: 'Electrification',
    badge: '800V SiC & One-Pedal Regen',
    desc: 'Electrochemical pack degradation, cell internal resistance ($I^2R$), instantaneous kW power flow, and regen capture.',
    href: '/manufacturing/physics/ev',
  },
  {
    id: 'rocket' as const,
    name: 'Aerospace Rocket Launch',
    category: 'Orbital Mechanics',
    badge: 'Tsiolkovsky & Max-Q',
    desc: 'Variable mass fuel burn ($\dot{m}$), barometric air density lapse, aerodynamic Max-Q dynamic pressure, and gravity-turn to orbit.',
    href: '/manufacturing/physics/rocket',
  },
];

export function PhysicsHub({ initialVehicle = 'bicycle' }: PhysicsHubProps) {
  const [activeVehicle, setActiveVehicle] = useState<PhysicsVehicleType>(initialVehicle);

  return (
    <div className="space-y-6">
      {/* Vehicle Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {VEHICLES.map((v) => {
          const isSelected = activeVehicle === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVehicle(v.id)}
              className={`p-3.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-sm'
                  : 'border-hairline bg-surface-1 hover:border-hairline-strong hover:bg-surface-2'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-fg-muted uppercase font-bold">
                  {v.category}
                </span>
                {isSelected && (
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <h3 className="text-caption font-bold text-fg block truncate">
                {v.name}
              </h3>
              <span className="text-[10px] font-mono text-accent block mt-1">
                {v.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Direct Link Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-2 border border-hairline">
        <div className="flex items-center gap-2">
          <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
            Dedicated Route
          </Badge>
          <span className="text-caption text-fg font-medium">
            Viewing {VEHICLES.find((v) => v.id === activeVehicle)?.name} inline simulator.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="primary" size="sm" className="gap-1.5 text-caption font-mono shadow-glow-accent">
            <Link href="/manufacturing/physics/3d">
              <Box className="size-3.5" />
              <span>Launch 3D WebGL Lab</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="gap-1.5 text-caption font-mono">
            <Link href={VEHICLES.find((v) => v.id === activeVehicle)?.href || '/manufacturing/physics'}>
              <span>Full-Screen Page</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Engineering Presets & Telemetry Exporter */}
      <TelemetryExporter
        vehicleType={activeVehicle}
        vehicleName={VEHICLES.find((v) => v.id === activeVehicle)?.name || 'Simulator'}
      />

      {/* Render Active Simulator */}
      {activeVehicle === 'bicycle' && <BicyclePhysicsSimulator />}
      {activeVehicle === 'car' && <CarPhysicsSimulator />}
      {activeVehicle === 'motorbike' && <MotorbikePhysicsSimulator />}
      {activeVehicle === 'drone' && <DronePhysicsSimulator />}
      {activeVehicle === 'ev' && <EvPowertrainSimulator />}
      {activeVehicle === 'rocket' && <RocketTrajectorySimulator />}
    </div>
  );
}
