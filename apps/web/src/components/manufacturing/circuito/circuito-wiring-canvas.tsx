'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import { Cpu, Zap, AlertTriangle, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { CircuitoComponent } from './circuito-data';

export interface CircuitoWiringCanvasProps {
  controller: CircuitoComponent;
  components: CircuitoComponent[];
  stepIndex: number;
}

export function CircuitoWiringCanvas({
  controller,
  components,
  stepIndex,
}: CircuitoWiringCanvasProps) {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Collect all passives required across components
  const requiredPassives = components.flatMap((c) =>
    (c.requiredPassives || []).map((p) => ({ ...p, componentName: c.name }))
  );

  // Total current calculation
  const totalCurrentMa = controller.currentDrawMa + components.reduce((sum, c) => sum + c.currentDrawMa, 0);

  // Check for 5V vs 3.3V logic level incompatibility
  const hasVoltageMismatch =
    controller.operatingVoltage === 3.3 && components.some((c) => c.operatingVoltage === 5);

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-5" data-testid="circuito-wiring-canvas">
      {/* Wiring Canvas Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-accent/15 border border-accent/30 text-accent">
            <Layers className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-body-md font-bold text-fg">
              Interactive Breadboard Wiring Diagram
            </h3>
            <p className="text-caption text-fg-muted font-mono">
              Auto-routed for {controller.name} + {components.length} connected modules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-caption">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-hairline text-accent">
            <Zap className="size-3.5" /> Total Load: {totalCurrentMa} mA
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-hairline text-fg-muted">
            Step {stepIndex + 1} of {Math.max(1, components.length + 2)}
          </span>
        </div>
      </div>

      {/* Logic Compatibility Alerts (Circuito.io Signature Feature) */}
      {hasVoltageMismatch && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3.5 flex items-start gap-3">
          <AlertTriangle className="size-5 text-warning shrink-0 mt-0.5" />
          <div className="space-y-1 text-caption">
            <span className="font-display font-bold text-fg block">
              Circuito Auto-Compensation: 5V to 3.3V Mixed-Voltage Logic Detected
            </span>
            <p className="text-fg-muted leading-relaxed">
              Your microcontroller ({controller.name}) uses 3.3V LVTTL logic, but one or more connected modules require 5.0V. Circuito has automatically injected a <strong>Voltage Divider (1kΩ + 2kΩ)</strong> and <strong>TXS0108E Bi-directional Level Shifter</strong> into your Bill of Materials to protect MCU input pins from overvoltage.
            </p>
          </div>
        </div>
      )}

      {/* Visual Breadboard Layout Viewport */}
      <div className="rounded-xl border border-hairline-strong bg-canvas p-6 relative overflow-x-auto shadow-inner select-none min-w-full">
        {/* Breadboard Power Rails (Top & Bottom) */}
        <div className="space-y-4">
          {/* Top Power Rails (+ and -) */}
          <div className="flex items-center gap-4 py-2 border-b border-hairline/40 font-mono text-[10px]">
            <div className="flex items-center gap-2 text-error font-bold">
              <span>+ (VCC {controller.operatingVoltage}V)</span>
              <div className="w-48 h-1 bg-error rounded-full" />
            </div>
            <div className="flex items-center gap-2 text-fg-subtle font-bold">
              <span>- (GND)</span>
              <div className="w-48 h-1 bg-fg-subtle rounded-full" />
            </div>
          </div>

          {/* Connected Modules Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-3">
            {/* Primary Controller Card */}
            <div className="rounded-lg border-2 border-accent bg-surface-2 p-4 shadow-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4 text-accent" />
                  <span className="font-display text-caption font-bold text-fg">MASTER MCU</span>
                </div>
                <Badge tone="accent" variant="solid" className="text-[10px]">
                  {controller.operatingVoltage}V Rail
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-mono text-body-xs font-bold text-fg">{controller.name}</h4>
                <p className="text-[11px] text-fg-muted line-clamp-2">{controller.description}</p>
              </div>

              <div className="pt-2 border-t border-hairline font-mono text-[10px] space-y-1">
                <div className="flex justify-between text-fg-subtle">
                  <span>Idle Current:</span>
                  <span className="text-fg font-bold">{controller.currentDrawMa} mA</span>
                </div>
                <div className="flex justify-between text-fg-subtle">
                  <span>Interface:</span>
                  <span className="text-accent font-bold">Main System Bus</span>
                </div>
              </div>
            </div>

            {/* User Added Peripheral Modules */}
            {components.map((comp, idx) => (
              <div
                key={comp.id}
                className="rounded-lg border border-hairline-strong bg-surface-2 p-4 shadow-sm flex flex-col justify-between space-y-3 hover:border-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-1 border border-hairline uppercase text-fg-subtle font-bold">
                    Module #{idx + 1} ({comp.category})
                  </span>
                  <Badge
                    tone={comp.operatingVoltage === 5 ? 'warning' : 'accent'}
                    variant="solid"
                    className="text-[10px]"
                  >
                    {comp.operatingVoltage}V Logic
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h4 className="font-mono text-body-xs font-bold text-fg">{comp.name}</h4>
                  <p className="text-[11px] text-fg-muted line-clamp-2">{comp.description}</p>
                </div>

                {/* Pin Connections Matrix */}
                <div className="space-y-1.5 pt-2 border-t border-hairline font-mono text-[10px]">
                  <span className="text-fg-subtle uppercase tracking-wider block font-bold text-[9px]">
                    Jumper Wire Routes:
                  </span>
                  {comp.suggestedPins.map((pin) => (
                    <div
                      key={pin.name}
                      onMouseEnter={() => setHoveredPin(`${comp.name}-${pin.name}`)}
                      onMouseLeave={() => setHoveredPin(null)}
                      className={`flex items-center justify-between px-2 py-0.5 rounded border transition-colors ${
                        hoveredPin === `${comp.name}-${pin.name}`
                          ? 'border-accent bg-accent/15 text-fg'
                          : 'border-hairline bg-surface-1 text-fg-muted'
                      }`}
                    >
                      <span className={`font-bold ${pin.wireColor}`}>{pin.name}</span>
                      <span className="text-fg-subtle">→</span>
                      <span className="text-fg font-semibold">{pin.defaultTargetPin}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Power Rails (+ and -) */}
          <div className="flex items-center gap-4 py-2 border-t border-hairline/40 font-mono text-[10px]">
            <div className="flex items-center gap-2 text-error font-bold">
              <span>+ (VCC {controller.operatingVoltage}V)</span>
              <div className="w-48 h-1 bg-error rounded-full" />
            </div>
            <div className="flex items-center gap-2 text-fg-subtle font-bold">
              <span>- (GND)</span>
              <div className="w-48 h-1 bg-fg-subtle rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Injected Passive Supporting Components (BOM Additions) */}
      {requiredPassives.length > 0 && (
        <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" />
            <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
              Circuito Automated Passive Supporting Circuitry:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-caption">
            {requiredPassives.map((pas, i) => (
              <div
                key={i}
                className="rounded border border-hairline bg-surface-1 p-2.5 space-y-1 font-mono text-[11px]"
              >
                <div className="flex items-center justify-between text-fg font-bold">
                  <span>{pas.name} ({pas.spec})</span>
                  <CheckCircle2 className="size-3.5 text-success" />
                </div>
                <p className="text-fg-subtle text-[10px]">{pas.reason}</p>
                <span className="text-accent text-[9px] block">For: {pas.componentName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
