'use client';

import { useState, useMemo } from 'react';
import type {
  CanProtocolStandard,
  TerminationTopology,
} from '@hackerland/core';
import { simulateCanBus } from '@hackerland/core';
import { CanBitTimingDiagram } from './can-bit-timing-diagram';
import { CanBusLoadSimulator } from './can-bus-load-simulator';

interface CanBusWorkbenchProps {
  initialStandard?: CanProtocolStandard;
  initialBaudRateKbps?: number;
  initialBusLengthM?: number;
  initialNodes?: number;
  initialPayloadBytes?: number;
  initialTermination?: TerminationTopology;
}

export function CanBusWorkbench({
  initialStandard = 'can_2_0b_standard',
  initialBaudRateKbps = 500,
  initialBusLengthM = 15,
  initialNodes = 8,
  initialPayloadBytes = 8,
  initialTermination = 'split_termination_filtered',
}: CanBusWorkbenchProps) {
  const [standard, setStandard] = useState<CanProtocolStandard>(initialStandard);
  const [baudRateKbps, setBaudRateKbps] = useState<number>(initialBaudRateKbps);
  const [clockFreqMhz, setClockFreqMhz] = useState<number>(40);
  const [busLengthM, setBusLengthM] = useState<number>(initialBusLengthM);
  const [nodeCount, setNodeCount] = useState<number>(initialNodes);
  const [payloadBytes, setPayloadBytes] = useState<number>(initialPayloadBytes);
  const [messageFreqHz, setMessageFreqHz] = useState<number>(400);
  const [termination, setTermination] = useState<TerminationTopology>(initialTermination);

  // Compute live CAN simulation
  const simResult = useMemo(() => {
    return simulateCanBus({
      standard,
      baudRateKbps,
      clockFrequencyMhz: clockFreqMhz,
      busLengthMeters: busLengthM,
      numberOfNodes: nodeCount,
      averagePayloadBytes: payloadBytes,
      totalMessageFrequencyHz: messageFreqHz,
      termination,
    });
  }, [standard, baudRateKbps, clockFreqMhz, busLengthM, nodeCount, payloadBytes, messageFreqHz, termination]);

  const applyPreset = (preset: 'ather' | 'nexon' | 'telecom' | 'drone' | 'ladakh') => {
    switch (preset) {
      case 'ather':
        setStandard('can_2_0b_standard');
        setBaudRateKbps(500);
        setClockFreqMhz(40);
        setBusLengthM(4.2);
        setNodeCount(6);
        setPayloadBytes(8);
        setMessageFreqHz(450);
        setTermination('split_termination_filtered');
        break;
      case 'nexon':
        setStandard('can_fd_iso');
        setBaudRateKbps(500);
        setClockFreqMhz(80);
        setBusLengthM(9.5);
        setNodeCount(12);
        setPayloadBytes(32);
        setMessageFreqHz(750);
        setTermination('split_termination_filtered');
        break;
      case 'telecom':
        setStandard('can_2_0b_standard');
        setBaudRateKbps(250);
        setClockFreqMhz(24);
        setBusLengthM(25);
        setNodeCount(16);
        setPayloadBytes(8);
        setMessageFreqHz(200);
        setTermination('split_termination_filtered');
        break;
      case 'drone':
        setStandard('can_2_0b_extended');
        setBaudRateKbps(1000);
        setClockFreqMhz(40);
        setBusLengthM(2.8);
        setNodeCount(8);
        setPayloadBytes(8);
        setMessageFreqHz(900);
        setTermination('standard_120_ohm');
        break;
      case 'ladakh':
        setStandard('can_2_0b_extended');
        setBaudRateKbps(125);
        setClockFreqMhz(16);
        setBusLengthM(120);
        setNodeCount(14);
        setPayloadBytes(8);
        setMessageFreqHz(80);
        setTermination('split_termination_filtered');
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-slate-100">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <span>⚡</span> Real-World Automotive Presets:
        </span>
        <button
          onClick={() => applyPreset('ather')}
          className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          Ather 450X (500 kbps, 4.2m)
        </button>
        <button
          onClick={() => applyPreset('nexon')}
          className="px-3 py-1 text-xs rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 transition"
        >
          Tata Nexon EV CAN-FD (500k/2M)
        </button>
        <button
          onClick={() => applyPreset('drone')}
          className="px-3 py-1 text-xs rounded-lg bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 transition"
        >
          Agri Drone UAVCAN (1 Mbps, 2.8m)
        </button>
        <button
          onClick={() => applyPreset('telecom')}
          className="px-3 py-1 text-xs rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 transition"
        >
          Telecom Tower BMS (250 kbps, 25m)
        </button>
        <button
          onClick={() => applyPreset('ladakh')}
          className="px-3 py-1 text-xs rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition"
        >
          Ladakh Border Post (125 kbps, 120m)
        </button>
      </div>

      {/* Main Grid: Controls vs Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="text-emerald-400">⚙</span> Physical Layer &amp; Timing Controls
            </h3>
            <p className="text-xs text-slate-400">
              Tune bit quanta, sample point, cable harness length, and termination filter
            </p>
          </div>

          {/* Standard & Baud Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="standard-select" className="text-xs font-medium text-slate-300">
                Protocol Standard
              </label>
              <select
                id="standard-select"
                value={standard}
                onChange={(e) => setStandard(e.target.value as CanProtocolStandard)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400"
              >
                <option value="can_2_0b_standard">CAN 2.0B (11-bit ID)</option>
                <option value="can_2_0b_extended">CAN 2.0B Extended (29-bit)</option>
                <option value="can_fd_iso">ISO CAN-FD</option>
                <option value="can_fd_non_iso">Non-ISO CAN-FD (Bosch)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="baud-select" className="text-xs font-medium text-slate-300">
                Nominal Baud Rate
              </label>
              <select
                id="baud-select"
                value={baudRateKbps}
                onChange={(e) => setBaudRateKbps(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400"
              >
                <option value={1000}>1000 kbps (1 Mbps)</option>
                <option value={500}>500 kbps (Standard)</option>
                <option value={250}>250 kbps (Commercial)</option>
                <option value={125}>125 kbps (Long Range)</option>
              </select>
            </div>
          </div>

          {/* Clock Frequency */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="clock-select" className="text-xs font-medium text-slate-300">
              CAN Controller Peripheral Clock (f_clk)
            </label>
            <select
              id="clock-select"
              value={clockFreqMhz}
              onChange={(e) => setClockFreqMhz(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value={80}>80 MHz (Infineon TriCore / NXP S32K3)</option>
              <option value={40}>40 MHz (STM32F4 / ESP32-S3 TWAI)</option>
              <option value={24}>24 MHz (Microchip MCP2515 External SPI)</option>
              <option value={16}>16 MHz (Automotive 8/16-bit ECU)</option>
            </select>
          </div>

          {/* Bus Length Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="bus-length-slider" className="font-medium text-slate-300">
                Total Bus Harness Length
              </label>
              <span className="font-mono text-emerald-400 font-bold">{busLengthM} meters</span>
            </div>
            <input
              id="bus-length-slider"
              type="range"
              min="1"
              max="150"
              step="1"
              value={busLengthM}
              onChange={(e) => setBusLengthM(Number(e.target.value))}
              className="accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1m (Local Bench)</span>
              <span>15m (Passenger Car)</span>
              <span>150m (Plant / Outpost)</span>
            </div>
          </div>

          {/* Number of Nodes Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="nodes-slider" className="font-medium text-slate-300">
                Connected Nodes (ECUs)
              </label>
              <span className="font-mono text-sky-400 font-bold">{nodeCount} Nodes</span>
            </div>
            <input
              id="nodes-slider"
              type="range"
              min="2"
              max="32"
              step="1"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              className="accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Message Frequency Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="freq-slider" className="font-medium text-slate-300">
                Aggregate Broadcast Message Rate
              </label>
              <span className="font-mono text-amber-400 font-bold">{messageFreqHz} frames/sec</span>
            </div>
            <input
              id="freq-slider"
              type="range"
              min="50"
              max="2000"
              step="25"
              value={messageFreqHz}
              onChange={(e) => setMessageFreqHz(Number(e.target.value))}
              className="accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Termination Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="term-select" className="text-xs font-medium text-slate-300">
              Bus End Termination Topology
            </label>
            <select
              id="term-select"
              value={termination}
              onChange={(e) => setTermination(e.target.value as TerminationTopology)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="split_termination_filtered">Split Termination (2x 60Ω + 4.7nF to GND)</option>
              <option value="standard_120_ohm">Standard 120Ω Non-Filtered</option>
              <option value="single_end_high_z_unterminated">Unterminated / Missing End Resistor</option>
            </select>
          </div>

          {/* Physical Layer Delay Sizing Card */}
          <div className="bg-slate-950/80 rounded-lg p-3.5 border border-slate-800 flex flex-col gap-2.5 font-mono text-xs">
            <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Propagation Delay &amp; Arbitration Margin
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Round-Trip Delay:</span>
                <span className="font-bold text-slate-100">{simResult.roundTripDelayNs} ns</span>
              </div>
              <div>
                <span className="text-slate-400 block">Max Allowable Bus:</span>
                <span className={`font-bold ${busLengthM > simResult.maxAllowableBusLengthMeters ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {simResult.maxAllowableBusLengthMeters} meters
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Termination:</span>
                <span className="font-bold text-slate-100">{simResult.terminationImpedanceOhms} Ω</span>
              </div>
              <div>
                <span className="text-slate-400 block">CM Filter Cutoff:</span>
                <span className="font-bold text-sky-400">{simResult.commonModeFilterCutoffKhz} kHz</span>
              </div>
            </div>

            {busLengthM > simResult.maxAllowableBusLengthMeters && (
              <div className="mt-1 pt-1.5 border-t border-slate-800 text-[10px] text-rose-400 font-bold">
                ⚠ WARNING: Cable delay exceeds Propagation Segment window. Increase Prop_Seg or lower baud rate to avoid arbitration bit corruption.
              </div>
            )}
          </div>
        </div>

        {/* Visualizers Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <CanBitTimingDiagram
            nominalBitTimeNs={simResult.nominalBitTimeNs}
            timeQuantumNs={simResult.timeQuantumNs}
            totalTimeQuantaPerBit={simResult.totalTimeQuantaPerBit}
            samplePointPercent={simResult.samplePointPercent}
            samplePointStatus={simResult.samplePointStatus}
            waveforms={simResult.waveforms}
          />

          <CanBusLoadSimulator
            busLoadPercent={simResult.busLoadPercent}
            busUtilizationHealth={simResult.busUtilizationHealth}
            frameTotalBits={simResult.frameTotalBits}
            maxFrameTransferTimeUs={simResult.maxFrameTransferTimeUs}
            totalMessageFrequencyHz={messageFreqHz}
            actualBaudRateKbps={simResult.actualBaudRateKbps}
          />
        </div>
      </div>
    </div>
  );
}
