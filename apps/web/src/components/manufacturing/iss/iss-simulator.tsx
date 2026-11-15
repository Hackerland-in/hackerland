'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Badge, Button } from '@hackerland/ui';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import {
  ISS_PRESETS,
  parseAssembly,
  initCpuState,
  stepCpu,
  type IssProgramPreset,
  type CpuState,
} from './iss-engine';
import { IssRegisterView } from './iss-register-view';
import { IssPipelineView } from './iss-pipeline-view';
import { IssMemoryView } from './iss-memory-view';
import { IssEditor } from './iss-editor';

export function IssSimulator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fibonacci');
  const [activeTab, setActiveTab] = useState<'all' | 'pipeline' | 'memory' | 'disasm'>('all');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simSpeedHz, setSimSpeedHz] = useState<number>(4);

  const activePreset: IssProgramPreset = useMemo(
    () => ISS_PRESETS.find((p) => p.id === selectedPresetId) ?? ISS_PRESETS[0]!,
    [selectedPresetId]
  );

  const instructions = useMemo(
    () => parseAssembly(activePreset.sourceCode),
    [activePreset.sourceCode]
  );

  const [cpuState, setCpuState] = useState<CpuState>(() => initCpuState(activePreset));

  // Switch preset
  const handleSelectPreset = (presetId: string) => {
    const p = ISS_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setIsRunning(false);
    setSelectedPresetId(presetId);
    setCpuState(initCpuState(p));
  };

  // Reset current program
  const handleReset = () => {
    setIsRunning(false);
    setCpuState(initCpuState(activePreset));
  };

  // Step instruction
  const handleStep = useCallback(() => {
    setCpuState((prev) => {
      if (prev.isHalted) {
        setIsRunning(false);
        return prev;
      }
      const next = stepCpu(prev, instructions);
      if (next.isHalted) {
        setIsRunning(false);
      }
      return next;
    });
  }, [instructions]);

  // Run loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalTime = Math.max(50, Math.round(1000 / simSpeedHz));
    const interval = setInterval(() => {
      handleStep();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isRunning, simSpeedHz, handleStep]);

  return (
    <div className="space-y-6" data-testid="iss-simulator">
      {/* Top Banner */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Cpu className="size-5" />
              </div>
              <h2 className="font-display text-heading-md font-bold text-fg">
                RISC-V Instruction Set Simulator (ISS) Studio
              </h2>
            </div>
            <p className="text-body-sm text-fg-muted max-w-2xl">
              Cycle-accurate microarchitecture execution workbench modeled after Spike, QEMU, gem5,
              and CPU Sim. Inspect 32 general-purpose registers, 5-stage pipeline hazards, RAM load/stores, and disassembly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">RISC-V RV32I</Badge>
            <Badge tone="neutral">gem5 / QEMU Model</Badge>
            <Badge tone="neutral">Spike ISS Spec</Badge>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-6 border-t border-hairline pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-fg-muted text-caption font-medium uppercase tracking-wider">
              <Terminal className="size-4 text-accent" />
              <span>Assembly Benchmark Programs</span>
            </div>

            {/* View Filter Buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                variant={activeTab === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All Panes
              </Button>
              <Button
                variant={activeTab === 'pipeline' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('pipeline')}
              >
                Registers & Pipeline
              </Button>
              <Button
                variant={activeTab === 'memory' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('memory')}
              >
                Data RAM
              </Button>
              <Button
                variant={activeTab === 'disasm' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setActiveTab('disasm')}
              >
                Disassembly
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ISS_PRESETS.map((preset) => {
              const isSelected = preset.id === activePreset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
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

        {/* Stepper Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleStep}
              disabled={cpuState.isHalted}
            >
              <StepForward className="size-4 mr-1.5" />
              Step Single Clock
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRunning((r) => !r)}
              disabled={cpuState.isHalted}
            >
              {isRunning ? (
                <>
                  <Pause className="size-4 mr-1.5 text-amber-500" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4 mr-1.5 text-emerald-500" />
                  Run Continuous
                </>
              )}
            </Button>

            <Button variant="secondary" size="sm" onClick={handleReset}>
              <RotateCcw className="size-4 mr-1.5" />
              Reset CPU
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-caption text-fg-muted font-medium">
              <span>Clock Speed:</span>
              <select
                value={simSpeedHz}
                onChange={(e) => setSimSpeedHz(Number(e.target.value))}
                className="rounded-lg border border-hairline bg-surface-1 px-2.5 py-1 font-mono text-body-xs text-fg focus:outline-none focus:border-accent"
              >
                <option value={1}>1 Hz (Slow Trace)</option>
                <option value={4}>4 Hz (Default)</option>
                <option value={10}>10 Hz (Fast Trace)</option>
                <option value={20}>20 Hz (Max)</option>
              </select>
            </div>

            {cpuState.isHalted && (
              <Badge tone="danger" variant="solid" className="uppercase font-mono text-[10px]">
                CPU HALTED (ECALL)
              </Badge>
            )}
          </div>
        </div>

        {/* Theory & Expected Outcome Callout */}
        <div className="mt-4 rounded-xl border border-hairline bg-surface-2/60 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-caption font-bold uppercase tracking-wider text-accent">
              Instruction Set Architecture (ISA) Physics & Theory
            </span>
          </div>
          <p className="text-body-sm text-fg-muted">{activePreset.theory}</p>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="flex-1 rounded-lg bg-surface-3 p-2.5 font-mono text-caption text-accent border border-hairline">
              <code>{activePreset.formula}</code>
            </div>
            <div className="flex-1 rounded-lg bg-surface-3 p-2.5 font-mono text-caption text-fg border border-hairline">
              <span className="text-fg-muted">Expected Result: </span>
              <span>{activePreset.expectedResult}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Microarchitecture */}
      {(activeTab === 'all' || activeTab === 'pipeline') && (
        <IssPipelineView cpuState={cpuState} />
      )}

      {/* 32 Architectural Registers */}
      {(activeTab === 'all' || activeTab === 'pipeline') && (
        <IssRegisterView cpuState={cpuState} />
      )}

      {/* Data RAM Memory Segment */}
      {(activeTab === 'all' || activeTab === 'memory') && (
        <IssMemoryView cpuState={cpuState} />
      )}

      {/* Disassembly & Assembly Editor */}
      {(activeTab === 'all' || activeTab === 'disasm') && (
        <IssEditor
          preset={activePreset}
          instructions={instructions}
          currentPc={cpuState.pc}
          onStep={handleStep}
        />
      )}
    </div>
  );
}
