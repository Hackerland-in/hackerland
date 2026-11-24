'use client';

import React from 'react';

interface CanBusLoadSimulatorProps {
  busLoadPercent: number;
  busUtilizationHealth: 'optimal_safe' | 'heavy_traffic' | 'overloaded_hazard';
  frameTotalBits: number;
  maxFrameTransferTimeUs: number;
  totalMessageFrequencyHz: number;
  actualBaudRateKbps: number;
}

export function CanBusLoadSimulator({
  busLoadPercent,
  busUtilizationHealth,
  frameTotalBits,
  maxFrameTransferTimeUs,
  totalMessageFrequencyHz,
  actualBaudRateKbps,
}: CanBusLoadSimulatorProps) {
  // Arbitration demonstration frames
  const arbitrationFrames = [
    {
      idHex: '0x080',
      idBin: '00010000000',
      priority: 'Highest (Emergency)',
      node: 'BMS Cell Over-Temp Cutoff',
      outcome: 'Wins Arbitration (Transmits Immediately)',
      badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    },
    {
      idHex: '0x1C4',
      idBin: '00111000100',
      priority: 'High (Powertrain)',
      node: 'Inverter FOC Torque Cmd',
      outcome: 'Backed Off at Bit 2 (Dominant 0 Overwrite)',
      badgeClass: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      idHex: '0x380',
      idBin: '01110000000',
      priority: 'Normal (Telematics)',
      node: 'GPS & Dashboard Speedo',
      outcome: 'Backed Off at Bit 1 (Waits Next Interframe)',
      badgeClass: 'bg-slate-900 text-slate-300 border-slate-700',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col gap-4">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Bus Traffic Load &amp; Multi-Master Arbitration Simulator
        </h3>
        <p className="text-xs text-slate-400">
          Deterministic non-destructive bitwise arbitration (CSMA/CD + NBA) and bus bandwidth saturation
        </p>
      </div>

      {/* Bus Load Meter */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Total Bus Bandwidth Utilization:</span>
          <span className="text-lg font-bold">
            <span className={
              busUtilizationHealth === 'optimal_safe'
                ? 'text-emerald-400'
                : busUtilizationHealth === 'heavy_traffic'
                ? 'text-amber-400'
                : 'text-rose-400'
            }>
              {busLoadPercent}%
            </span>{' '}
            <span className="text-xs text-slate-500 font-normal">
              ({totalMessageFrequencyHz} msgs/sec @ {actualBaudRateKbps} kbps)
            </span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              busUtilizationHealth === 'optimal_safe'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                : busUtilizationHealth === 'heavy_traffic'
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-rose-600 to-rose-400'
            }`}
            style={{ width: `${Math.min(100, busLoadPercent)}%` }}
          />
          {/* Safe threshold marker line at 65% */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
            style={{ left: '65%' }}
            title="Max Recommended Automotive Load (65%)"
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0% (Idle)</span>
          <span className="text-amber-400">50% (CiA Recommended)</span>
          <span className="text-rose-400">65% (Automotive Ceiling)</span>
          <span>100% (Bus Saturated)</span>
        </div>
      </div>

      {/* Frame Transfer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Frame Length (Stuffed)</span>
          <span className="text-sky-400 font-bold text-sm mt-0.5 block">{frameTotalBits} bits</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">~1.15x Bit Stuffing factor</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Transfer Time Per Frame</span>
          <span className="text-emerald-400 font-bold text-sm mt-0.5 block">{maxFrameTransferTimeUs} μs</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Payload delivery latency</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[11px] block">Network Health Status</span>
          <span className={`font-bold text-sm mt-0.5 block uppercase ${
            busUtilizationHealth === 'optimal_safe'
              ? 'text-emerald-400'
              : busUtilizationHealth === 'heavy_traffic'
              ? 'text-amber-400'
              : 'text-rose-400'
          }`}>
            {busUtilizationHealth.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            {busLoadPercent < 65 ? 'Deterministic delivery guaranteed' : 'Arbitration queue delay warning'}
          </span>
        </div>
      </div>

      {/* Bitwise Arbitration Priority Resolution Demonstration */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Non-Destructive Bitwise Arbitration (CAN ID Priority)
        </h4>
        <div className="space-y-2 font-mono text-xs">
          {arbitrationFrames.map((f) => (
            <div
              key={f.idHex}
              className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-amber-300 bg-amber-950/40 border border-amber-800/60 font-bold text-[11px]">
                  {f.idHex}
                </span>
                <div>
                  <span className="text-slate-200 font-semibold block">{f.node}</span>
                  <span className="text-[10px] text-slate-400">ID Bits: <code className="text-sky-300">{f.idBin}</code></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${f.badgeClass}`}>
                  {f.outcome}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          CAN transceivers listen while transmitting. When a recessive bit (1) encounters a dominant bit (0) from another node on the bus, the recessive node halts immediately without corrupting the winning frame.
        </p>
      </div>
    </div>
  );
}
