'use client';

import { Cpu, Bookmark, HelpCircle } from 'lucide-react';
import {
  ABI_REGISTER_NAMES,
  REGISTER_ROLES,
  type CpuState,
} from './iss-engine';

export interface IssRegisterViewProps {
  cpuState: CpuState;
}

export function IssRegisterView({ cpuState }: IssRegisterViewProps) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="iss-register-view">
      {/* Top Banner: PC & Status Flags */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Cpu className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-body-md font-bold text-fg">
              RV32I Architectural Register File (32 × 32-Bit)
            </h3>
            <p className="text-caption text-fg-muted">
              General Purpose Integer Registers with Standard RISC-V ABI Mappings
            </p>
          </div>
        </div>

        {/* Program Counter & ALU Flags */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PC */}
          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-3 py-1.5">
            <Bookmark className="size-4 text-accent" />
            <span className="text-caption font-semibold uppercase text-fg-muted">PC:</span>
            <span className="font-mono text-body-sm font-bold text-accent">
              0x{cpuState.pc.toString(16).padStart(8, '0').toUpperCase()}
            </span>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-1 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1.5 font-mono text-caption">
            <span className="text-fg-muted font-bold mr-1">FLAGS:</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                cpuState.flags.zero
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-surface-3 text-fg-subtle'
              }`}
              title="Zero Flag (Z)"
            >
              Z
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                cpuState.flags.negative
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : 'bg-surface-3 text-fg-subtle'
              }`}
              title="Negative Flag (N)"
            >
              N
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                cpuState.flags.overflow
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-surface-3 text-fg-subtle'
              }`}
              title="Overflow Flag (V)"
            >
              V
            </span>
          </div>
        </div>
      </div>

      {/* 32-Register Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-h-[460px] overflow-y-auto pr-1">
        {cpuState.registers.map((val, idx) => {
          const abi = ABI_REGISTER_NAMES[idx] ?? `x${idx}`;
          const role = REGISTER_ROLES[abi] ?? 'General register';
          const isModified = cpuState.lastModifiedReg === idx;
          const hexVal = '0x' + (val >>> 0).toString(16).padStart(8, '0').toUpperCase();

          return (
            <div
              key={idx}
              className={`group relative rounded-lg border p-2.5 transition-all text-left ${
                isModified
                  ? 'border-accent bg-accent/10 ring-1 ring-accent'
                  : 'border-hairline bg-surface-2/60 hover:bg-surface-2 hover:border-hairline-strong'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-body-xs font-bold text-fg">
                    x{idx}
                  </span>
                  <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-surface-3 text-accent font-semibold">
                    {abi}
                  </span>
                </div>
                {isModified && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent px-1 rounded bg-accent/20">
                    UPDATED
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-1">
                <span className="font-mono text-body-xs font-bold text-fg truncate">
                  {hexVal}
                </span>
                <span className="font-mono text-[11px] text-fg-muted shrink-0">
                  {val}
                </span>
              </div>

              {/* Role Tooltip on hover */}
              <div className="mt-1 flex items-center gap-1 text-[10px] text-fg-subtle truncate">
                <HelpCircle className="size-2.5 shrink-0" />
                <span className="truncate">{role}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
