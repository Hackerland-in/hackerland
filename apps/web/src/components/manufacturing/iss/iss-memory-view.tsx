'use client';

import { Database, ArrowDownUp, Check } from 'lucide-react';
import type { CpuState } from './iss-engine';

export interface IssMemoryViewProps {
  cpuState: CpuState;
}

export function IssMemoryView({ cpuState }: IssMemoryViewProps) {
  // Generate address range around 0x1000 (Data Segment)
  const baseAddresses: number[] = [];
  for (let addr = 0x1000; addr <= 0x103c; addr += 4) {
    baseAddresses.push(addr);
  }

  // Also include any addresses present in memory
  Object.keys(cpuState.memory).forEach((key) => {
    const numKey = parseInt(key, 10);
    if (!baseAddresses.includes(numKey)) {
      baseAddresses.push(numKey);
    }
  });

  baseAddresses.sort((a, b) => a - b);

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="iss-memory-view">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Database className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Data RAM Segment & Hex Memory Inspector (32-Bit Words)
          </h3>
        </div>

        {cpuState.lastMemoryAccess && (
          <div className="flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-3 py-1 font-mono text-caption text-accent">
            <ArrowDownUp className="size-3.5" />
            <span>
              Last Access: {cpuState.lastMemoryAccess.isWrite ? 'STORE (SW)' : 'LOAD (LW)'} @ 0x
              {cpuState.lastMemoryAccess.address.toString(16).toUpperCase()} = {cpuState.lastMemoryAccess.value}
            </span>
          </div>
        )}
      </div>

      {/* Memory Table */}
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-2/40">
        <table className="w-full text-left font-mono text-body-xs">
          <thead>
            <tr className="border-b border-hairline bg-surface-3/60 text-fg-muted">
              <th className="py-2.5 px-3">Memory Address</th>
              <th className="py-2.5 px-3">Hex Value</th>
              <th className="py-2.5 px-3">Decimal Value</th>
              <th className="py-2.5 px-3">ASCII Representation</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {baseAddresses.map((addr) => {
              const val = cpuState.memory[addr] ?? 0;
              const hexVal = '0x' + (val >>> 0).toString(16).padStart(8, '0').toUpperCase();
              const isAccessed = cpuState.lastMemoryAccess?.address === addr;

              // ASCII interpretation of 4 bytes
              const bytes = [
                val & 0xff,
                (val >> 8) & 0xff,
                (val >> 16) & 0xff,
                (val >> 24) & 0xff,
              ];
              const ascii = bytes
                .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
                .join('');

              return (
                <tr
                  key={addr}
                  className={`transition-colors ${
                    isAccessed
                      ? 'bg-accent/15 font-bold text-accent'
                      : 'hover:bg-surface-2'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-fg">
                    0x{addr.toString(16).padStart(8, '0').toUpperCase()}
                  </td>
                  <td className="py-2 px-3 text-accent font-semibold">{hexVal}</td>
                  <td className="py-2 px-3 text-fg">{val}</td>
                  <td className="py-2 px-3 text-fg-muted font-mono">{ascii}</td>
                  <td className="py-2 px-3">
                    {isAccessed ? (
                      <span className="inline-flex items-center gap-1 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent uppercase">
                        <Check className="size-2.5" />
                        {cpuState.lastMemoryAccess?.isWrite ? 'Written' : 'Read'}
                      </span>
                    ) : val !== 0 ? (
                      <span className="text-[10px] text-fg-subtle">Populated</span>
                    ) : (
                      <span className="text-[10px] text-fg-subtle/50">Zero</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
