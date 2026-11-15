'use client';

import { Layers, Activity, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import type { CpuState } from './iss-engine';

export interface IssPipelineViewProps {
  cpuState: CpuState;
}

export function IssPipelineView({ cpuState }: IssPipelineViewProps) {
  const cpi =
    cpuState.instructionCount > 0
      ? (cpuState.cycles / cpuState.instructionCount).toFixed(2)
      : '1.00';

  const stages = [
    {
      code: 'IF',
      title: 'Instruction Fetch',
      desc: 'Fetch PC instruction from code memory bus',
      content: cpuState.pipeline.fetch,
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-500',
    },
    {
      code: 'ID',
      title: 'Instruction Decode',
      desc: 'Decode opcode, read source registers (rs1, rs2)',
      content: cpuState.pipeline.decode,
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-500',
    },
    {
      code: 'EX',
      title: 'Execute (ALU)',
      desc: '32-bit Integer ALU & branch condition evaluation',
      content: cpuState.pipeline.execute,
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500',
    },
    {
      code: 'MEM',
      title: 'Memory Access',
      desc: 'Load Word (LW) / Store Word (SW) data transfer',
      content: cpuState.pipeline.memory,
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-500',
    },
    {
      code: 'WB',
      title: 'Writeback',
      desc: 'Commit result to architectural register (rd)',
      content: cpuState.pipeline.writeback,
      color: 'border-rose-500/30 bg-rose-500/5 text-rose-500',
    },
  ];

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="iss-pipeline-view">
      {/* Header & CPI Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Classic 5-Stage RISC Microarchitecture Pipeline
          </h3>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3 font-mono text-caption">
          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1">
            <Activity className="size-3.5 text-accent" />
            <span className="text-fg-muted">CYCLES:</span>
            <span className="font-bold text-fg">{cpuState.cycles}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1">
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span className="text-fg-muted">RETIRED:</span>
            <span className="font-bold text-fg">{cpuState.instructionCount}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1">
            <Zap className="size-3.5 text-amber-500" />
            <span className="text-fg-muted">CPI:</span>
            <span className="font-bold text-accent">{cpi}</span>
          </div>
        </div>
      </div>

      {/* 5-Stage Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {stages.map((stage, idx) => (
          <div
            key={stage.code}
            className={`rounded-xl border p-3.5 flex flex-col justify-between space-y-3 transition-all ${stage.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-body-sm font-extrabold tracking-wider">
                  {stage.code}
                </span>
                {idx < 4 && <ArrowRight className="size-3 text-fg-subtle hidden md:block" />}
              </div>
              <h4 className="font-display text-caption font-bold text-fg leading-tight">
                {stage.title}
              </h4>
              <p className="text-[11px] text-fg-muted mt-0.5 line-clamp-2">
                {stage.desc}
              </p>
            </div>

            <div className="rounded-lg bg-surface-1/90 border border-hairline p-2">
              <span className="text-[10px] uppercase font-bold text-fg-subtle block">Stage State</span>
              <p className="font-mono text-[11px] font-semibold text-fg break-all line-clamp-2 mt-0.5">
                {stage.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
