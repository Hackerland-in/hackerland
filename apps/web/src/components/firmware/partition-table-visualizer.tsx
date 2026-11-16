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
  totalFlashBytes = 4 * 1024 * 1024, // 4MB
}: PartitionTableVisualizerProps) {
  const layout = useMemo(
    () => calculateFlashPartitionLayout(partitions, totalFlashBytes),
    [partitions, totalFlashBytes],
  );

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
        <div>
          <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            FLASH MEMORY PARTITION MAP ({formatFirmwareBytes(totalFlashBytes)})
          </h4>
          <p className="text-[11px] text-stone-400">
            Physical flash offset layout, memory bounds, and partition allocation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {layout.hasOverlap ? (
            <span className="rounded-full bg-red-950/80 border border-red-500/50 px-2.5 py-0.5 text-[10px] font-mono text-red-300">
              OVERLAP CONFLICT
            </span>
          ) : (
            <span className="rounded-full bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
              {layout.utilizationPercent}% ALLOCATED
            </span>
          )}
        </div>
      </div>

      {/* Visual Memory Strip Bar */}
      <div className="relative flex h-8 w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900 shadow-inner">
        {partitions.map((part) => {
          const widthPercent = Math.max(3, (part.sizeBytes / totalFlashBytes) * 100);
          return (
            <div
              key={part.name}
              title={`${part.name} (${part.offsetHex}) - ${formatFirmwareBytes(part.sizeBytes)}`}
              className="group relative flex items-center justify-center border-r border-stone-950/60 transition-opacity hover:opacity-90"
              style={{
                width: `${widthPercent}%`,
                backgroundColor: part.color,
              }}
            >
              <span className="truncate px-1 text-[9px] font-mono font-bold text-stone-950">
                {part.name}
              </span>
            </div>
          );
        })}
        {/* Free space segment */}
        {layout.freeBytes > 0 && (
          <div
            title={`Unallocated Headroom: ${formatFirmwareBytes(layout.freeBytes)}`}
            className="flex flex-1 items-center justify-center bg-stone-900/80 text-[9px] font-mono text-stone-500"
          >
            FREE ({formatFirmwareBytes(layout.freeBytes)})
          </div>
        )}
      </div>

      {/* Warnings if any */}
      {layout.warnings.map((w, idx) => (
        <div
          key={`warn-${idx}`}
          className="rounded-xl border border-red-500/40 bg-red-950/30 p-2 text-xs font-mono text-red-300"
        >
          ⚠ {w}
        </div>
      ))}

      {/* Detailed partition table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="border-b border-stone-800/80 text-stone-500">
              <th className="pb-1.5 font-medium">PARTITION</th>
              <th className="pb-1.5 font-medium">TYPE</th>
              <th className="pb-1.5 font-medium">SUBTYPE</th>
              <th className="pb-1.5 font-medium">OFFSET</th>
              <th className="pb-1.5 font-medium">SIZE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-900">
            {partitions.map((p) => (
              <tr key={p.name} className="hover:bg-stone-900/40">
                <td className="py-1.5 flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-semibold text-white">{p.name}</span>
                </td>
                <td className="py-1.5 text-stone-400">{p.type}</td>
                <td className="py-1.5 text-stone-400">{p.subType}</td>
                <td className="py-1.5 text-amber-400 font-bold">{p.offsetHex}</td>
                <td className="py-1.5 text-stone-300">{formatFirmwareBytes(p.sizeBytes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
