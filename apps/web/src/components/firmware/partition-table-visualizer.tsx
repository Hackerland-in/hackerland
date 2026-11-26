'use client';

import { useMemo } from 'react';
import type { FirmwarePartition } from '@hackerland/core';
import { calculateFlashPartitionLayout, formatFirmwareBytes } from '@hackerland/core';

interface PartitionTableVisualizerProps {
  partitions: FirmwarePartition[];
  totalFlashBytes?: number;
}

export function PartitionTableVisualizer({
  partitions,
  totalFlashBytes = 4 * 1024 * 1024,
}: PartitionTableVisualizerProps) {
  const layout = useMemo(
    () => calculateFlashPartitionLayout(partitions, totalFlashBytes),
    [partitions, totalFlashBytes],
  );

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
        <div>
          <h4 className="font-display text-xs font-bold tracking-wider text-fg uppercase">
            FLASH MEMORY PARTITION MAP ({formatFirmwareBytes(totalFlashBytes)})
          </h4>
          <p className="text-[11px] text-fg-muted">
            Physical flash offset layout, memory bounds, and partition allocation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {layout.hasOverlap ? (
            <span className="rounded-full bg-danger/10 border border-danger/35 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-danger-fg">
              OVERLAP CONFLICT
            </span>
          ) : (
            <span className="rounded-full bg-success/10 border border-success/35 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-success-fg">
              {layout.utilizationPercent}% ALLOCATED
            </span>
          )}
        </div>
      </div>

      {/* Visual Memory Strip */}
      <div className="relative flex h-9 w-full overflow-hidden rounded-xl border border-hairline bg-sunken shadow-inner">
        {partitions.map((part) => {
          const widthPercent = Math.max(3, (part.sizeBytes / totalFlashBytes) * 100);
          return (
            <div
              key={part.name}
              title={`${part.name} (${part.offsetHex}) - ${formatFirmwareBytes(part.sizeBytes)}`}
              className="group relative flex items-center justify-center border-r border-surface-1 transition-opacity hover:opacity-90"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: part.color,
              }}
            >
              <span className="truncate px-1 text-[9px] font-mono font-bold text-slate-950">
                {part.name}
              </span>
            </div>
          );
        })}
        {layout.freeBytes > 0 && (
          <div
            title={`Unallocated Headroom: ${formatFirmwareBytes(layout.freeBytes)}`}
            className="flex flex-1 items-center justify-center bg-sunken text-[9px] font-mono text-fg-subtle"
          >
            FREE ({formatFirmwareBytes(layout.freeBytes)})
          </div>
        )}
      </div>

      {layout.warnings.map((w, idx) => (
        <div
          key={`warn-${idx}`}
          className="rounded-xl border border-danger/35 bg-danger/10 p-2 text-xs font-mono text-danger-fg"
        >
          ⚠ {w}
        </div>
      ))}

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="border-b border-hairline text-fg-subtle">
              <th className="pb-1.5 font-semibold">PARTITION</th>
              <th className="pb-1.5 font-semibold">TYPE</th>
              <th className="pb-1.5 font-semibold">SUBTYPE</th>
              <th className="pb-1.5 font-semibold">OFFSET</th>
              <th className="pb-1.5 font-semibold">SIZE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {partitions.map((p) => (
              <tr key={p.name} className="hover:bg-sunken/70">
                <td className="py-1.5 flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-semibold text-fg">{p.name}</span>
                </td>
                <td className="py-1.5 text-fg-muted">{p.type}</td>
                <td className="py-1.5 text-fg-muted">{p.subType}</td>
                <td className="py-1.5 text-accent-fg font-bold">{p.offsetHex}</td>
                <td className="py-1.5 text-fg">{formatFirmwareBytes(p.sizeBytes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
