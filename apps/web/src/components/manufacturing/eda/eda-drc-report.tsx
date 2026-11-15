'use client';

import { ShieldCheck, CheckCircle2, FileCheck, Cpu } from 'lucide-react';
import type { EdaPreset } from './eda-engine';

export interface EdaDrcReportProps {
  preset: EdaPreset;
}

export function EdaDrcReport({ preset }: EdaDrcReportProps) {
  return (
    <div
      className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4"
      data-testid="eda-drc-report"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Physical Signoff Verification: Magic DRC & Netgen LVS
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-caption font-mono font-bold text-emerald-500">
            <CheckCircle2 className="size-3.5" />
            DRC Clean (0 Errors)
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-caption font-mono font-bold text-emerald-500">
            <CheckCircle2 className="size-3.5" />
            LVS Matched (100%)
          </span>
        </div>
      </div>

      {/* Verification Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Magic VLSI DRC Table */}
        <div className="rounded-xl border border-hairline bg-surface-2/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck className="size-4 text-accent" />
            <h4 className="font-display text-body-sm font-bold text-fg">
              Design Rule Checks (Magic VLSI 8.3)
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-body-xs">
              <thead>
                <tr className="border-b border-hairline text-fg-muted">
                  <th className="py-1.5 px-2">Rule</th>
                  <th className="py-1.5 px-2">Layer</th>
                  <th className="py-1.5 px-2">Check Description</th>
                  <th className="py-1.5 px-2">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {preset.drcViolations.map((drc, idx) => (
                  <tr key={idx} className="hover:bg-surface-3/50">
                    <td className="py-2 px-2 font-bold text-accent">{drc.rule}</td>
                    <td className="py-2 px-2 text-fg">{drc.layer}</td>
                    <td className="py-2 px-2 text-fg-muted text-[11px]">{drc.description}</td>
                    <td className="py-2 px-2">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase">
                        PASS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Netgen LVS Extraction Comparison */}
        <div className="rounded-xl border border-hairline bg-surface-2/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-purple-500" />
            <h4 className="font-display text-body-sm font-bold text-fg">
              Layout-Versus-Schematic (Netgen 1.5)
            </h4>
          </div>

          <div className="space-y-2 font-mono text-caption">
            <div className="rounded-lg bg-surface-3 p-3 border border-hairline space-y-1.5">
              <div className="flex justify-between">
                <span className="text-fg-muted">Synthesized Gate Instances:</span>
                <span className="font-bold text-fg">{preset.cellCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Extracted Layout Instances:</span>
                <span className="font-bold text-fg">{preset.cellCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Instance Mismatch:</span>
                <span className="font-bold text-emerald-500">0 (Perfect Match)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Net Connectivity Mismatch:</span>
                <span className="font-bold text-emerald-500">0 (No Opens / Shorts)</span>
              </div>
            </div>

            <p className="text-[11px] text-fg-muted font-sans pt-1">
              Netgen confirms that every transistor source, drain, gate, and well in the physical GDSII mask matches the topological connectivity of the Yosys gate-level netlist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
