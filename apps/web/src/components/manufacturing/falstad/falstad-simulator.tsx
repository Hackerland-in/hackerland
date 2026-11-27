'use client';

import { useState, useEffect } from 'react';
import { Badge, Button } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Layers,
  Terminal,
  Radio,
} from 'lucide-react';
import {
  FALSTAD_PRESETS,
  type CircuitJsPreset,
  parseSpiceNetlist,
  solveCircuitJsStep,
  type CircuitState,
} from './circuitjs-engine';
import { FalstadCanvas } from './falstad-canvas';
import { SpiceNetlistEditor } from './spice-netlist-editor';

export function FalstadSimulator() {
  const labShell = useLabShell();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('full-bridge-rectifier');
  const activePreset: CircuitJsPreset =
    FALSTAD_PRESETS.find((p) => p.id === selectedPresetId) ?? FALSTAD_PRESETS[0]!;

  const [netlistText, setNetlistText] = useState(activePreset.spiceNetlist);
  const [activeTab, setActiveTab] = useState<'canvas' | 'scope' | 'spice'>('canvas');
  const [isPaused, setIsPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [simTime, setSimTime] = useState(0);

  // Parsed elements
  const [elements, setElements] = useState(() => parseSpiceNetlist(activePreset.spiceNetlist));

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `Falstad SPICE: ${activePreset.name}`,
        summary: `Speed ${simSpeed}x · ${elements.length} circuit elements · view=${activeTab}`,
        tags: ['falstad', 'ngspice', selectedPresetId],
        payload: {
          selectedPresetId,
          netlistText,
          activeTab,
          simSpeed,
          isPaused,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload ?? {};
        if (typeof p.selectedPresetId === 'string') setSelectedPresetId(p.selectedPresetId);
        if (typeof p.netlistText === 'string') {
          setNetlistText(p.netlistText);
          setElements(parseSpiceNetlist(p.netlistText));
        }
        if (p.activeTab === 'canvas' || p.activeTab === 'scope' || p.activeTab === 'spice') {
          setActiveTab(p.activeTab);
        }
        if (typeof p.simSpeed === 'number') setSimSpeed(p.simSpeed);
        if (typeof p.isPaused === 'boolean') setIsPaused(p.isPaused);
        setSimTime(0);
      },
    });
  }, [labShell, activePreset.name, selectedPresetId, netlistText, activeTab, simSpeed, isPaused, elements.length]);

  // Change preset
  const handlePresetChange = (newPresetId: string) => {
    const p = FALSTAD_PRESETS.find((x) => x.id === newPresetId);
    if (!p) return;
    setSelectedPresetId(newPresetId);
    setNetlistText(p.spiceNetlist);
    setElements(parseSpiceNetlist(p.spiceNetlist));
    setSimTime(0);
  };

  // Re-run SPICE netlist
  const handleRunNetlist = () => {
    setElements(parseSpiceNetlist(netlistText));
    setSimTime(0);
  };

  // Active Circuit Physics State
  const circuitState: CircuitState = solveCircuitJsStep(
    activePreset.id,
    elements,
    simTime,
    activePreset.defaultTimeStepSec * simSpeed
  );

  // Time integration loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSimTime((prev) => prev + activePreset.defaultTimeStepSec * simSpeed * 4);
    }, 40);

    return () => clearInterval(interval);
  }, [activePreset, isPaused, simSpeed]);

  return (
    <div className="space-y-6 rounded-2xl border-2 border-accent/40 bg-surface-1 p-6 shadow-xl select-none" data-testid="falstad-simulator">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hairline pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="code" variant="solid" className="text-body-xs font-mono font-bold tracking-wider">
              <Sparkles className="size-3.5 mr-1" /> FALSTAD &amp; NGSPICE ENGINE
            </Badge>
            <span className="text-caption font-mono text-fg-subtle">
              Based on Wikipedia Free Electronics Circuit Simulators Architecture
            </span>
          </div>
          <h2 className="font-display text-headline-sm sm:text-headline-md font-bold text-fg">
            Visual Interactive Electronics &amp; SPICE Circuit Simulator
          </h2>
          <p className="text-body-sm text-fg-muted max-w-3xl">
            Real-time visual current flow simulation with animated electron dots, voltage color-mapping, standard Berkeley SPICE netlist deck parser, and AC transient frequency response.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider">
            Simulated Topology:
          </span>
          <select
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="rounded-lg border border-accent/40 bg-surface-2 px-3 py-2 text-body-xs font-mono font-bold text-fg focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Select circuit topology"
          >
            {FALSTAD_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Physics Theory Bar */}
      <div className="rounded-xl border border-hairline bg-surface-2 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
            {activePreset.name} — Theory &amp; Governing Equations:
          </span>
          <Badge tone="accent" variant="outline" className="text-[10px] font-mono">
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

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'canvas'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Layers className="size-4" />
            <span>Falstad Visual Canvas</span>
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scope')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'scope'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Activity className="size-4" />
            <span>Transient Waveform Scope</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('spice')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'spice'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Terminal className="size-4" />
            <span>SPICE Netlist Deck</span>
          </button>
        </div>

        {/* Master Simulation Speed & Run Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 font-mono text-caption">
            <span className="text-fg-subtle text-[11px]">Speed:</span>
            <select
              value={simSpeed}
              onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
              className="rounded border border-hairline bg-surface-2 px-2 py-1 text-fg text-caption focus:outline-none focus:border-accent"
              aria-label="Simulation speed multiplier"
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1.0">1.0x (Real-time)</option>
              <option value="2.0">2.0x</option>
            </select>
          </div>

          <Button
            type="button"
            variant={isPaused ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="text-caption font-mono"
            aria-label={isPaused ? 'Resume simulation' : 'Pause simulation'}
          >
            {isPaused ? <Play className="size-3.5 mr-1" /> : <Pause className="size-3.5 mr-1" />}
            {isPaused ? 'Run' : 'Pause'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSimTime(0)}
            className="text-caption font-mono"
            aria-label="Reset simulation clock"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'canvas' && (
        <FalstadCanvas circuitState={circuitState} isPaused={isPaused} />
      )}

      {activeTab === 'scope' && (
        <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="falstad-scope">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-accent" />
              <h3 className="font-display text-body-md font-bold text-fg">
                Dual-Trace Transient Voltage Waveforms
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-caption">
              <span className="text-accent font-bold">CH1: Source ({circuitState.sourceWaveform.toFixed(2)}V)</span>
              <span className="text-success font-bold">CH2: Load ({circuitState.outputWaveform.toFixed(2)}V)</span>
              {circuitState.resonantFreqHz && (
                <span className="text-warning font-bold">f0: {circuitState.resonantFreqHz} Hz</span>
              )}
            </div>
          </div>

          {/* Graphical Scope View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-2">
              <span className="text-caption font-mono text-accent font-bold block">
                Channel 1: AC Source Input (V_in)
              </span>
              <div className="font-mono text-headline-sm font-bold text-fg">
                {circuitState.sourceWaveform.toFixed(3)} V
              </div>
              <p className="text-caption text-fg-muted">
                50Hz sinusoidal source waveform driving circuit input terminals.
              </p>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-2">
              <span className="text-caption font-mono text-success font-bold block">
                Channel 2: Rectified / Filtered Output (V_out)
              </span>
              <div className="font-mono text-headline-sm font-bold text-success">
                {circuitState.outputWaveform.toFixed(3)} V
              </div>
              <p className="text-caption text-fg-muted">
                Smoothed DC voltage across reservoir capacitor and load resistor.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'spice' && (
        <SpiceNetlistEditor
          netlistText={netlistText}
          onUpdateNetlist={setNetlistText}
          onRunSimulation={handleRunNetlist}
        />
      )}
    </div>
  );
}
