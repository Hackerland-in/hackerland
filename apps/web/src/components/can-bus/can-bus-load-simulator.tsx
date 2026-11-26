'use client';

import React from 'react';

interface CanBusLoadSimulatorProps {
  busLoadPercent: number;
  busUtilizationHealth: 'optimal_safe' | 'heavy_traffic' | 'overloaded_hazard' | string;
  frameTotalBits: number;
  maxFrameTransferTimeUs: number;
  totalMessageFrequencyHz: number;
  actualBaudRateKbps: number;
}

const ARBITRATION_FRAMES = [
  {
    idHex: '0x080',
    sourceEcu: 'BMS Master (Pack Protection)',
    signal: 'BMS Cell Over-Temp Cutoff',
    binaryId: '000 1000 0000',
    result: 'Wins Arbitration (Highest Priority)',
    statusTone: 'win' as const,
  },
  {
    idHex: '0x1C4',
    sourceEcu: 'MCU Traction Inverter',
    signal: 'Motor Torque & RPM Command',
    binaryId: '001 1100 0100',
    result: 'Defers after dominant bit 0',
    statusTone: 'yield' as const,
  },
  {
    idHex: '0x380',
    sourceEcu: 'Instrument Cluster / TCU',
    signal: 'Telemetry / Cluster SOC Broadcast',
    binaryId: '011 1000 0000',
    result: 'Queues until bus idle (11 recessive bits)',
    statusTone: 'queue' as const,
  },
];

export function CanBusLoadSimulator({
  busLoadPercent,
  busUtilizationHealth,
  frameTotalBits,
  maxFrameTransferTimeUs,
  totalMessageFrequencyHz,
  actualBaudRateKbps,
}: CanBusLoadSimulatorProps) {
  const clampedLoad = Math.min(100, Math.max(0, busLoadPercent));

  const healthBanner =
    busUtilizationHealth === 'optimal_safe'
      ? {
          label: 'Optimal Safe (< 50%) — Deterministic delivery guaranteed',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          barClass: 'bg-emerald-500',
        }
      : busUtilizationHealth === 'heavy_traffic'
        ? {
            label: 'Heavy Traffic (50–75%) — Monitor low-priority frame jitter',
            badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
            barClass: 'bg-amber-500',
          }
        : {
            label: 'Overloaded Hazard (> 75%) — Risk of arbitration starvation & latency spikes',
            badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
            barClass: 'bg-rose-500',
          };

  return (
    <div className="bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs text-fg flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <h3 className="font-display text-base font-semibold text-accent-fg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            Bus Load &amp; Bitwise Arbitration Resolution
          </h3>
          <p className="text-xs text-fg-muted mt-0.5">
            ISO 11898 bandwidth headroom and CSMA/CR non-destructive arbitration priority matrix
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-sunken border border-hairline font-mono text-[11px] font-semibold text-fg capitalize">
          {busUtilizationHealth.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Bandwidth Meter */}
      <div className="bg-sunken rounded-xl p-4 border border-hairline space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-xs font-medium text-fg-muted">
            Total Bus Bandwidth Utilization:
          </span>
          <span className="font-mono text-lg font-bold text-accent-fg">
            {busLoadPercent.toFixed(1)}%
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-surface-2 border border-hairline overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${healthBanner.barClass}`}
            style={{ width: `${clampedLoad}%` }}
          />
        </div>

        <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${healthBanner.badgeClass}`}>
          {healthBanner.label}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 font-mono text-xs">
          <div className="bg-surface-1 border border-hairline rounded-lg p-2.5">
            <span className="text-[10px] text-fg-subtle block">Worst-Case Frame Bits</span>
            <span className="font-bold text-fg">{frameTotalBits} bits</span>
          </div>
          <div className="bg-surface-1 border border-hairline rounded-lg p-2.5">
            <span className="text-[10px] text-fg-subtle block">Max Frame Time</span>
            <span className="font-bold text-sky-700">{maxFrameTransferTimeUs.toFixed(1)} μs</span>
          </div>
          <div className="bg-surface-1 border border-hairline rounded-lg p-2.5">
            <span className="text-[10px] text-fg-subtle block">Aggregate Rate</span>
            <span className="font-bold text-fg">{totalMessageFrequencyHz} fps</span>
          </div>
          <div className="bg-surface-1 border border-hairline rounded-lg p-2.5">
            <span className="text-[10px] text-fg-subtle block">Effective Baud</span>
            <span className="font-bold text-accent-fg">{actualBaudRateKbps} kbps</span>
          </div>
        </div>
      </div>

      {/* Arbitration Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-fg-muted">
          Non-Destructive Bitwise Arbitration (CAN ID Priority)
        </h4>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-sunken text-fg-subtle border-b border-hairline">
              <tr>
                <th className="py-2 px-3 font-semibold">ID</th>
                <th className="py-2 px-3 font-semibold">ECU / Signal</th>
                <th className="py-2 px-3 font-semibold hidden sm:table-cell">11-Bit Field</th>
                <th className="py-2 px-3 font-semibold">Arbitration Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-surface-1">
              {ARBITRATION_FRAMES.map((row) => (
                <tr key={row.idHex}>
                  <td className="py-2.5 px-3 font-bold text-accent-fg whitespace-nowrap">
                    {row.idHex}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-fg">{row.signal}</div>
                    <div className="text-[10px] text-fg-subtle">{row.sourceEcu}</div>
                  </td>
                  <td className="py-2.5 px-3 text-fg-muted hidden sm:table-cell whitespace-nowrap">
                    {row.binaryId}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={
                        row.statusTone === 'win'
                          ? 'inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.statusTone === 'yield'
                            ? 'inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200'
                            : 'inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sunken text-fg-muted border border-hairline'
                      }
                    >
                      {row.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
