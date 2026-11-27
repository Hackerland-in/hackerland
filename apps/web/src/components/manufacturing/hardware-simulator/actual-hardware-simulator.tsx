'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import {
  Zap,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Flame,
  Gauge,
} from 'lucide-react';
import {
  CIRCUIT_PRESETS,
  type CircuitPreset,
  type CircuitComponentState,
  solveCircuitStep,
} from './circuit-engine';
import { Oscilloscope } from './oscilloscope';

export function ActualHardwareSimulator() {
  const labShell = useLabShell();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ohms-law-led');
  const activePreset: CircuitPreset =
    CIRCUIT_PRESETS.find((p) => p.id === selectedPresetId) ?? CIRCUIT_PRESETS[0]!;

  const [components, setComponents] = useState<CircuitComponentState[]>(activePreset.components);
  const [isPaused, setIsPaused] = useState(false);
  const [timeDivMs, setTimeDivMs] = useState(100);
  const [voltsDiv, setVoltsDiv] = useState(1.0);
  const [waveformHistory, setWaveformHistory] = useState<number[]>([]);
  const [selectedProbeNode, setSelectedProbeNode] = useState<string>('N_LED');
  const [simTime, setSimTime] = useState(0);

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `SPICE: ${activePreset.title}`,
        summary: `Probe ${selectedProbeNode} · ${components.length} components · ${timeDivMs}ms/div`,
        tags: ['spice', 'circuit-sim', selectedPresetId],
        payload: {
          selectedPresetId,
          components,
          timeDivMs,
          voltsDiv,
          selectedProbeNode,
          isPaused,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload ?? {};
        if (typeof p.selectedPresetId === 'string') setSelectedPresetId(p.selectedPresetId);
        if (Array.isArray(p.components)) {
          setComponents(p.components as CircuitComponentState[]);
        }
        if (typeof p.timeDivMs === 'number') setTimeDivMs(p.timeDivMs);
        if (typeof p.voltsDiv === 'number') setVoltsDiv(p.voltsDiv);
        if (typeof p.selectedProbeNode === 'string') setSelectedProbeNode(p.selectedProbeNode);
        if (typeof p.isPaused === 'boolean') setIsPaused(p.isPaused);
        setWaveformHistory([]);
        setSimTime(0);
      },
    });
  }, [
    labShell,
    activePreset.title,
    selectedPresetId,
    components,
    timeDivMs,
    voltsDiv,
    selectedProbeNode,
    isPaused,
  ]);

  // Reset preset
  const handlePresetChange = (newPresetId: string) => {
    const p = CIRCUIT_PRESETS.find((x) => x.id === newPresetId);
    if (!p) return;
    setSelectedPresetId(newPresetId);
    setComponents(p.components.map((c) => ({ ...c })));
    setWaveformHistory([]);
    setSimTime(0);
    if (newPresetId === 'rc-charging') setSelectedProbeNode('N_RC');
    else if (newPresetId === 'timer-555-astable') setSelectedProbeNode('OUT');
    else if (newPresetId === 'transistor-switch') setSelectedProbeNode('N_COLLECTOR');
    else setSelectedProbeNode('N_LED');
  };

  // Toggle switch
  const handleToggleSwitch = (switchId: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === switchId ? { ...c, value: c.value === 1 ? 0 : 1 } : c))
    );
  };

  // Update component parameter value
  const handleUpdateValue = (compId: string, newVal: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === compId ? { ...c, value: newVal } : c))
    );
  };

  // Real-time Physics Engine Simulation Loop (runs every 50ms)
  const simResult = solveCircuitStep(
    activePreset,
    components,
    simTime,
    0.05
  );

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSimTime((t) => {
        const nextTime = t + 0.05;

        const step = solveCircuitStep(
          activePreset,
          components,
          nextTime,
          0.05
        );

        const probeVoltage = step.nodeVoltages[selectedProbeNode] ?? step.oscillatorVoltage;

        setWaveformHistory((prev) => {
          const next = [...prev, probeVoltage];
          return next.length > 80 ? next.slice(-80) : next;
        });

        return nextTime;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activePreset, components, isPaused, selectedProbeNode]);

  // Multimeter reading at probe node
  const measuredNodeVoltage = simResult.nodeVoltages[selectedProbeNode] ?? 0;
  const isSwitchClosed = components.find((c) => c.type === 'switch')?.value === 1;
  const ledComponent = simResult.components.find((c) => c.type === 'led');
  const resistorComponent = components.find((c) => c.id === 'r1' || c.id === 'rb');
  const dcSource = components.find((c) => c.type === 'dc_source');

  return (
    <div className="space-y-6 rounded-2xl border-2 border-accent/40 bg-surface-1 p-6 shadow-xl select-none" data-testid="actual-hardware-simulator">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hairline pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="accent" variant="solid" className="text-body-xs font-mono font-bold tracking-wider">
              <Sparkles className="size-3.5 mr-1" /> REAL SPICE HARDWARE SIMULATOR
            </Badge>
            <span className="text-caption font-mono text-fg-subtle">
              True Kirchhoff / Ohm Nodal Physics Engine
            </span>
          </div>
          <h2 className="font-display text-headline-sm sm:text-headline-md font-bold text-fg">
            Actual Interactive Circuit & Component Physics Simulator
          </h2>
          <p className="text-body-sm text-fg-muted max-w-3xl">
            Real electrical calculation with animated current flow, live multimeter probing, digital oscilloscope waveform capture, and actual semiconductor junction behavior (including LED burnout and 555 timer oscillation).
          </p>
        </div>

        {/* Experiment Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider">
            Circuit Experiment:
          </span>
          <select
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="rounded-lg border border-accent/40 bg-surface-2 px-3 py-2 text-body-xs font-mono font-bold text-fg focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Select circuit experiment"
          >
            {CIRCUIT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Physics Theory Callout */}
      <div className="rounded-xl border border-hairline bg-surface-2 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
            {activePreset.title} — Governing Physics:
          </span>
          <Badge tone="code" variant="outline" className="text-[10px] font-mono">
            {activePreset.category}
          </Badge>
        </div>
        <p className="text-body-sm text-fg-muted leading-relaxed">
          {activePreset.theory}
        </p>
        <div className="rounded border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-caption text-accent font-bold inline-block">
          Formula: {activePreset.formula}
        </div>
      </div>

      {/* Main Interactive Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Circuit Schematic Canvas & Interactive Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-xl border border-hairline-strong bg-canvas p-5 shadow-inner space-y-4">
            <div className="flex items-center justify-between border-b border-hairline/60 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-warning" />
                <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
                  Interactive Circuit Schematic (Click to Toggle)
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                ledComponent?.isBurnedOut
                  ? 'bg-error/20 text-error border border-error/40 animate-pulse'
                  : 'bg-surface-2 border border-hairline text-fg-muted'
              }`}>
                {simResult.statusMessage}
              </span>
            </div>

            {/* Visual Schematic Diagram with Animated Current Flow */}
            <div className="relative rounded-lg border border-hairline bg-surface-1 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[160px]">
              {/* DC Power Supply */}
              <div className="flex flex-col items-center p-3 rounded-lg border border-hairline bg-surface-2 shadow-sm min-w-[100px] text-center">
                <span className="text-[10px] font-mono text-fg-subtle uppercase">DC Source</span>
                <span className="font-mono text-body-md font-bold text-warning">
                  {dcSource ? dcSource.value.toFixed(1) : '5.0'}V
                </span>
                <span className="text-[9px] text-fg-muted font-mono mt-0.5">+ Rail (VCC)</span>
              </div>

              {/* SPST Switch (Clickable) */}
              <button
                type="button"
                onClick={() => handleToggleSwitch('sw1')}
                className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer min-w-[90px] text-center ${
                  isSwitchClosed
                    ? 'border-success bg-success/15 text-success'
                    : 'border-fg-subtle bg-surface-2 text-fg-muted hover:border-accent'
                }`}
                title="Click to Toggle Switch"
              >
                {isSwitchClosed ? (
                  <ToggleRight className="size-6 text-success" />
                ) : (
                  <ToggleLeft className="size-6 text-fg-subtle" />
                )}
                <span className="text-[10px] font-mono font-bold mt-1">
                  {isSwitchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                </span>
              </button>

              {/* Resistor Component with Color Bands */}
              {resistorComponent && (
                <div className="flex flex-col items-center p-3 rounded-lg border border-hairline bg-surface-2 shadow-sm min-w-[100px] text-center">
                  <span className="text-[10px] font-mono text-fg-subtle uppercase">Resistor R1</span>
                  <span className="font-mono text-body-sm font-bold text-fg">
                    {resistorComponent.value} Ω
                  </span>
                  {/* Resistor color bands */}
                  <div className="flex gap-1 my-1 p-1 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300">
                    <span className="w-1.5 h-3 bg-red-600 rounded-2xs" />
                    <span className="w-1.5 h-3 bg-red-600 rounded-2xs" />
                    <span className="w-1.5 h-3 bg-amber-500 rounded-2xs" />
                    <span className="w-1.5 h-3 bg-yellow-400 rounded-2xs" />
                  </div>
                  <span className="text-[9px] font-mono text-fg-muted">
                    {resistorComponent.currentMa.toFixed(1)} mA
                  </span>
                </div>
              )}

              {/* Output Component (LED, Capacitor, or Transistor) */}
              {ledComponent && (
                <div className={`flex flex-col items-center p-3 rounded-lg border transition-all min-w-[100px] text-center ${
                  ledComponent.isBurnedOut
                    ? 'border-error bg-error/20 text-error'
                    : ledComponent.isActive
                    ? 'border-error bg-error/15 text-error shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                    : 'border-hairline bg-surface-2 text-fg-subtle'
                }`}>
                  {ledComponent.isBurnedOut ? (
                    <Flame className="size-6 text-error animate-bounce" />
                  ) : (
                    <div
                      className={`size-6 rounded-full border border-line transition-all ${
                        ledComponent.isActive ? 'bg-error shadow-[0_0_12px_#ef4444]' : 'bg-surface-3'
                      }`}
                    />
                  )}
                  <span className="text-[10px] font-mono font-bold mt-1">
                    {ledComponent.isBurnedOut ? 'BURNED OUT' : ledComponent.isActive ? 'LIT (ON)' : 'OFF'}
                  </span>
                  <span className="text-[9px] font-mono text-fg-muted">
                    Vf: {ledComponent.voltageDrop.toFixed(2)}V
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Parameter Sliders */}
            <div className="space-y-3 pt-3 border-t border-hairline/60">
              <span className="text-[11px] font-mono text-fg-subtle uppercase tracking-wider block">
                Adjust Physical Parameters in Real Time:
              </span>

              {/* Voltage Slider */}
              {dcSource && (
                <div className="space-y-1">
                  <div className="flex justify-between text-caption font-mono">
                    <span className="text-fg-muted">Supply Voltage (V_source):</span>
                    <span className="text-warning font-bold">{dcSource.value.toFixed(1)} V</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={dcSource.value}
                    onChange={(e) => handleUpdateValue(dcSource.id, parseFloat(e.target.value))}
                    className="w-full accent-warning cursor-pointer h-2 bg-surface-2 rounded border border-hairline"
                    aria-label="DC source voltage"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-fg-subtle">
                    <span>0.0V</span>
                    <span>5.0V (Standard)</span>
                    <span>15.0V (Overdrive)</span>
                  </div>
                </div>
              )}

              {/* Resistance Slider */}
              {resistorComponent && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-caption font-mono">
                    <span className="text-fg-muted">Series Resistance (R1):</span>
                    <span className="text-accent font-bold">{resistorComponent.value} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={resistorComponent.value}
                    onChange={(e) => handleUpdateValue(resistorComponent.id, parseFloat(e.target.value))}
                    className="w-full accent-accent cursor-pointer h-2 bg-surface-2 rounded border border-hairline"
                    aria-label="Series resistance"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-fg-subtle">
                    <span>10Ω (Overcurrent Hazard!)</span>
                    <span>220Ω (Safe)</span>
                    <span>2000Ω (Dim)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Virtual Digital Multimeter (DMM) */}
          <div className="rounded-xl border border-hairline bg-surface-1 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <div className="flex items-center gap-2">
                <Gauge className="size-4 text-accent" />
                <h4 className="font-display text-caption font-bold text-fg uppercase tracking-wider">
                  Benchtop Digital Multimeter (DMM Probe)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-success font-bold">TRUE RMS DC</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Multimeter 7-Segment Digital Readout Viewport */}
              <div className="w-full sm:w-56 h-16 rounded-lg bg-canvas border-2 border-hairline-strong p-2 flex flex-col justify-center items-center font-mono shadow-inner">
                <div className="text-headline-md font-bold tracking-widest text-[#10b981] drop-shadow">
                  {measuredNodeVoltage.toFixed(3)}
                  <span className="text-body-sm font-normal ml-1">V DC</span>
                </div>
                <div className="text-[9px] text-fg-subtle uppercase">
                  Measured at Node: {selectedProbeNode}
                </div>
              </div>

              {/* Probe Selector Node Switcher */}
              <div className="flex-1 space-y-1.5 w-full">
                <span className="text-[10px] font-mono text-fg-subtle uppercase block">
                  Connect Red Test Probe (+) to Node:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePreset.nodes.map((node) => (
                    <button
                      key={node}
                      type="button"
                      onClick={() => setSelectedProbeNode(node)}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold border transition-colors ${
                        selectedProbeNode === node
                          ? 'border-error bg-error/20 text-error ring-1 ring-error'
                          : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg'
                      }`}
                    >
                      {node}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-fg-subtle font-mono">
                  Black probe (-) clamped to system GND (0.00V reference).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Digital Oscilloscope */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <Oscilloscope
            waveformHistory={waveformHistory}
            frequencyHz={simResult.frequencyHz}
            timeDivMs={timeDivMs}
            voltsDiv={voltsDiv}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
            onReset={() => setWaveformHistory([])}
            onTimeDivChange={setTimeDivMs}
            onVoltsDivChange={setVoltsDiv}
          />
        </div>
      </div>
    </div>
  );
}
