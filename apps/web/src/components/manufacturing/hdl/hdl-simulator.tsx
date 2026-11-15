'use client';

import { useState, useMemo } from 'react';
import { Badge, Button } from '@hackerland/ui';
import {
  Cpu,
  Binary,
  Layers,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Gauge,
} from 'lucide-react';
import {
  HDL_PRESETS,
  runHdlSimulation,
  generateVcdFile,
  type HdlPreset,
} from './hdl-engine';
import { HdlWaveformViewer } from './hdl-waveform-viewer';
import { HdlEditor } from './hdl-editor';

export function HdlSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('counter-4bit');
  const [activeTab, setActiveTab] = useState<'all' | 'waveform' | 'code'>('all');
  const [simKey, setSimKey] = useState(0);

  const activePreset: HdlPreset = useMemo(
    () => HDL_PRESETS.find((p) => p.id === selectedPresetId) ?? HDL_PRESETS[0]!,
    [selectedPresetId]
  );

  // Run simulation and generate VCD
  const signals = useMemo(() => {
    // simKey allows forcing re-run
    void simKey;
    return runHdlSimulation(activePreset);
  }, [activePreset, simKey]);

  const vcdContent = useMemo(() => {
    return generateVcdFile(activePreset, signals);
  }, [activePreset, signals]);

  const handleRunSimulation = () => {
    setSimKey((k) => k + 1);
  };

  return (
    <div className="space-y-6" data-testid="hdl-simulator">
      {/* Header Banner */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Binary className="size-5" />
              </div>
              <h2 className="font-display text-heading-md font-bold text-fg">
                Hardware Description Language (HDL) Digital Simulator
              </h2>
            </div>
            <p className="text-body-sm text-fg-muted max-w-2xl">
              Cycle-accurate Verilog synthesis & testbench simulation workbench modeled after
              Verilator, Icarus Verilog, ModelSim, and GTKWave. View register transitions, multi-bit
              bus decodes, and export standard IEEE 1364 VCD files.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">IEEE 1364-2001 Verilog</Badge>
            <Badge tone="neutral">ModelSim / Questa</Badge>
            <Badge tone="neutral">GTKWave VCD</Badge>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-6 border-t border-hairline pt-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-fg-muted text-caption font-medium uppercase tracking-wider">
              <Cpu className="size-4 text-accent" />
              <span>Digital Circuit Topologies</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                Full Studio
              </Button>
              <Button
                variant={activeTab === 'waveform' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('waveform')}
              >
                Waveform Only
              </Button>
              <Button
                variant={activeTab === 'code' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('code')}
              >
                Verilog / VCD
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {HDL_PRESETS.map((preset) => {
              const isSelected = preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/5 ring-1 ring-accent shadow-sm'
                      : 'border-hairline bg-surface-2 hover:border-hairline-strong'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-caption font-semibold uppercase tracking-wider text-accent">
                      {preset.category}
                    </span>
                    {isSelected && <CheckCircle2 className="size-4 text-accent" />}
                  </div>
                  <h4 className="font-display text-body-sm font-bold text-fg line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-caption text-fg-muted line-clamp-1 mt-0.5">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* FPGA Synthesis Metrics Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-hairline bg-surface-2 p-3">
            <div className="flex items-center gap-1.5 text-caption text-fg-muted">
              <Layers className="size-3.5 text-accent" />
              <span>Logic LUTs</span>
            </div>
            <div className="font-mono text-body-lg font-bold text-fg mt-1">
              {activePreset.estimatedLuts}{' '}
              <span className="text-caption text-fg-muted font-normal">LUT6</span>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-2 p-3">
            <div className="flex items-center gap-1.5 text-caption text-fg-muted">
              <Zap className="size-3.5 text-emerald-500" />
              <span>Registers (FF)</span>
            </div>
            <div className="font-mono text-body-lg font-bold text-fg mt-1">
              {activePreset.estimatedFlipFlops}{' '}
              <span className="text-caption text-fg-muted font-normal">D-FFs</span>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-2 p-3">
            <div className="flex items-center gap-1.5 text-caption text-fg-muted">
              <Gauge className="size-3.5 text-amber-500" />
              <span>Clock Timebase</span>
            </div>
            <div className="font-mono text-body-lg font-bold text-fg mt-1">
              {activePreset.clockPeriodNs} ns{' '}
              <span className="text-caption text-fg-muted font-normal">
                ({Math.round(1000 / activePreset.clockPeriodNs)} MHz)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-2 p-3">
            <div className="flex items-center gap-1.5 text-caption text-fg-muted">
              <Sparkles className="size-3.5 text-purple-500" />
              <span>Total Duration</span>
            </div>
            <div className="font-mono text-body-lg font-bold text-fg mt-1">
              {activePreset.totalTimeNs} ns{' '}
              <span className="text-caption text-fg-muted font-normal">Simulated</span>
            </div>
          </div>
        </div>

        {/* Physics and Theory Formula Callout */}
        <div className="mt-4 rounded-xl border border-hairline bg-surface-2/60 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold uppercase tracking-wider text-accent">
              Hardware Synthesis Theory & RTL Logic
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={handleRunSimulation}>
                <Play className="size-3.5 mr-1.5 text-emerald-500" />
                Re-Run Testbench
              </Button>
            </div>
          </div>
          <p className="text-body-sm text-fg-muted">{activePreset.theory}</p>
          <div className="rounded-lg bg-surface-3 p-2.5 font-mono text-caption text-accent overflow-x-auto border border-hairline">
            <code>{activePreset.formula}</code>
          </div>
        </div>
      </div>

      {/* Main Studio View */}
      {(activeTab === 'all' || activeTab === 'waveform') && (
        <HdlWaveformViewer signals={signals} totalTimeNs={activePreset.totalTimeNs} />
      )}

      {(activeTab === 'all' || activeTab === 'code') && (
        <HdlEditor
          preset={activePreset}
          vcdContent={vcdContent}
          onRunSimulation={handleRunSimulation}
        />
      )}
    </div>
  );
}
