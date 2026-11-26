'use client';

import { useState, useMemo, useEffect } from 'react';
import type { CanProtocolStandard, TerminationTopology } from '@hackerland/core';
import { simulateCanBus } from '@hackerland/core';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import { CanBitTimingDiagram } from './can-bit-timing-diagram';
import { CanBusLoadSimulator } from './can-bus-load-simulator';

interface CanBusWorkbenchProps {
  initialStandard?: CanProtocolStandard;
  initialBaudRateKbps?: number;
  initialBusLengthM?: number;
  initialNodes?: number;
  initialTermination?: TerminationTopology;
}

export function CanBusWorkbench({
  initialStandard = 'can_2_0b_standard',
  initialBaudRateKbps = 500,
  initialBusLengthM = 10,
  initialNodes = 8,
  initialTermination = 'split_termination_filtered',
}: CanBusWorkbenchProps) {
  const labShell = useLabShell();

  const [standard, setStandard] = useState<CanProtocolStandard>(initialStandard);
  const [baudRateKbps, setBaudRateKbps] = useState<number>(initialBaudRateKbps);
  const [clockFreqMhz, setClockFreqMhz] = useState<number>(40);
  const [busLengthM, setBusLengthM] = useState<number>(initialBusLengthM);
  const [nodeCount, setNodeCount] = useState<number>(initialNodes);
  const [payloadBytes, setPayloadBytes] = useState<number>(8);
  const [messageFreqHz, setMessageFreqHz] = useState<number>(500);
  const [termination, setTermination] = useState<TerminationTopology>(initialTermination);

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
  }, [
    standard,
    baudRateKbps,
    clockFreqMhz,
    busLengthM,
    nodeCount,
    payloadBytes,
    messageFreqHz,
    termination,
  ]);

  useEffect(() => {
    if (!labShell) return;
    labShell.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `CAN Timing (${standard.toUpperCase()} @ ${baudRateKbps} kbps)`,
        summary: `${busLengthM}m bus, ${nodeCount} nodes, sample point ${simResult.samplePointPercent}%, load ${simResult.busLoadPercent}%`,
        tags: ['can-bus', standard],
        payload: {
          standard,
          baudRateKbps,
          clockFreqMhz,
          busLengthM,
          nodeCount,
          payloadBytes,
          messageFreqHz,
          termination,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload ?? {};
        if (typeof p.standard === 'string') setStandard(p.standard as CanProtocolStandard);
        if (typeof p.baudRateKbps === 'number') setBaudRateKbps(p.baudRateKbps);
        if (typeof p.clockFreqMhz === 'number') setClockFreqMhz(p.clockFreqMhz);
        if (typeof p.busLengthM === 'number') setBusLengthM(p.busLengthM);
        if (typeof p.nodeCount === 'number') setNodeCount(p.nodeCount);
        if (typeof p.payloadBytes === 'number') setPayloadBytes(p.payloadBytes);
        if (typeof p.messageFreqHz === 'number') setMessageFreqHz(p.messageFreqHz);
        if (typeof p.termination === 'string') setTermination(p.termination as TerminationTopology);
      },
    });
  }, [
    labShell,
    standard,
    baudRateKbps,
    clockFreqMhz,
    busLengthM,
    nodeCount,
    payloadBytes,
    messageFreqHz,
    termination,
    simResult.samplePointPercent,
    simResult.busLoadPercent,
  ]);

  const applyPreset = (
    preset: 'ather_450x' | 'nexon_ev' | 'uavcan_drone' | 'telecom_bms' | 'ladakh_post',
  ) => {
    switch (preset) {
      case 'ather_450x':
        setStandard('can_2_0b_standard');
        setBaudRateKbps(500);
        setClockFreqMhz(40);
        setBusLengthM(4.2);
        setNodeCount(6);
        setPayloadBytes(8);
        setMessageFreqHz(450);
        setTermination('split_termination_filtered');
        break;
      case 'nexon_ev':
        setStandard('can_fd_iso');
        setBaudRateKbps(500);
        setClockFreqMhz(80);
        setBusLengthM(12);
        setNodeCount(14);
        setPayloadBytes(32);
        setMessageFreqHz(850);
        setTermination('split_termination_filtered');
        break;
      case 'uavcan_drone':
        setStandard('can_fd_iso');
        setBaudRateKbps(1000);
        setClockFreqMhz(80);
        setBusLengthM(2.5);
        setNodeCount(8);
        setPayloadBytes(16);
        setMessageFreqHz(1200);
        setTermination('standard_120_ohm');
        break;
      case 'telecom_bms':
        setStandard('can_2_0b_extended');
        setBaudRateKbps(250);
        setClockFreqMhz(24);
        setBusLengthM(35);
        setNodeCount(18);
        setPayloadBytes(8);
        setMessageFreqHz(300);
        setTermination('standard_120_ohm');
        break;
      case 'ladakh_post':
        setStandard('can_2_0b_standard');
        setBaudRateKbps(125);
        setClockFreqMhz(16);
        setBusLengthM(180);
        setNodeCount(10);
        setPayloadBytes(8);
        setMessageFreqHz(140);
        setTermination('split_termination_filtered');
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-fg">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3.5 bg-surface-1 border border-hairline rounded-2xl shadow-xs">
        <span className="text-xs font-semibold text-fg-muted mr-2 flex items-center gap-1.5">
          <span className="text-accent-fg">⚡</span> Real-World Automotive Presets:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('ather_450x')}
          className="px-3 py-1.5 text-xs rounded-xl bg-sunken hover:bg-accent-soft hover:text-accent-fg hover:border-accent/30 text-fg border border-hairline transition cursor-pointer"
        >
          Ather 450X (500 kbps)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('nexon_ev')}
          className="px-3 py-1.5 text-xs rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition cursor-pointer"
        >
          Tata Nexon EV CAN-FD
        </button>
        <button
          type="button"
          onClick={() => applyPreset('uavcan_drone')}
          className="px-3 py-1.5 text-xs rounded-xl bg-accent-soft hover:bg-accent/15 text-accent-fg border border-accent/25 transition cursor-pointer"
        >
          Agri Drone UAVCAN (1000 kbps)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('telecom_bms')}
          className="px-3 py-1.5 text-xs rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
        >
          Telecom Tower BMS (250 kbps)
        </button>
        <button
          type="button"
          onClick={() => applyPreset('ladakh_post')}
          className="px-3 py-1.5 text-xs rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
        >
          Ladakh Border Post (125 kbps Long Bus)
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-surface-1 border border-hairline rounded-2xl p-5 shadow-xs flex flex-col gap-5">
          <div className="border-b border-hairline pb-3">
            <h3 className="font-display text-base font-semibold text-fg flex items-center gap-2">
              ⚙ Physical Layer &amp; Timing Controls
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Synthesize CiA 301 time quanta prescalers, loop delay margin, and differential impedance
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="standard-select" className="text-xs font-medium text-fg-muted">
              Protocol Standard
            </label>
            <select
              id="standard-select"
              value={standard}
              onChange={(e) => setStandard(e.target.value as CanProtocolStandard)}
              className="bg-sunken border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
            >
              <option value="can_2_0b_standard">CAN 2.0B Standard (11-bit ID, 8B Max)</option>
              <option value="can_2_0b_extended">CAN 2.0B Extended (29-bit J1939, 8B Max)</option>
              <option value="can_fd_iso">ISO 11898-1 CAN-FD (64B Payload, Fast Data Phase)</option>
              <option value="can_fd_non_iso">Non-ISO Legacy CAN-FD</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="baud-select" className="text-xs font-medium text-fg-muted">
                Nominal Baud Rate
              </label>
              <select
                id="baud-select"
                value={baudRateKbps}
                onChange={(e) => setBaudRateKbps(Number(e.target.value))}
                className="bg-sunken border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value={125}>125 kbps</option>
                <option value={250}>250 kbps</option>
                <option value={500}>500 kbps</option>
                <option value={1000}>1000 kbps</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="clock-select" className="text-xs font-medium text-fg-muted">
                CAN Controller Clock
              </label>
              <select
                id="clock-select"
                value={clockFreqMhz}
                onChange={(e) => setClockFreqMhz(Number(e.target.value))}
                className="bg-sunken border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
              >
                <option value={16}>16 MHz</option>
                <option value={24}>24 MHz</option>
                <option value={40}>40 MHz</option>
                <option value={80}>80 MHz</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="bus-length-slider" className="font-medium text-fg-muted">
                Bus Harness Length
              </label>
              <span className="font-mono text-accent-fg font-bold">{busLengthM} m</span>
            </div>
            <input
              id="bus-length-slider"
              type="range"
              min="1"
              max="300"
              step="1"
              value={busLengthM}
              onChange={(e) => setBusLengthM(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-fg-subtle font-mono">
              <span>1m (PCB/Drone)</span>
              <span>Max Safe: {simResult.maxAllowableBusLengthMeters.toFixed(1)}m</span>
              <span>300m (Stationary)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="nodes-slider" className="font-medium text-fg-muted">
                Connected ECU Nodes
              </label>
              <span className="font-mono text-sky-700 font-bold">{nodeCount} nodes</span>
            </div>
            <input
              id="nodes-slider"
              type="range"
              min="2"
              max="48"
              step="1"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="freq-slider" className="font-medium text-fg-muted">
                Aggregate Bus Traffic Rate
              </label>
              <span className="font-mono text-fg font-bold">{messageFreqHz} frames/s</span>
            </div>
            <input
              id="freq-slider"
              type="range"
              min="50"
              max="3000"
              step="50"
              value={messageFreqHz}
              onChange={(e) => setMessageFreqHz(Number(e.target.value))}
              className="accent-accent cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="term-select" className="text-xs font-medium text-fg-muted">
              Termination Network Topology
            </label>
            <select
              id="term-select"
              value={termination}
              onChange={(e) => setTermination(e.target.value as TerminationTopology)}
              className="bg-sunken border border-line rounded-xl px-3 py-2 text-xs font-mono text-fg focus:outline-none focus:border-accent"
            >
              <option value="split_termination_filtered">Split Termination (2×60Ω + 4.7nF CMC Filter)</option>
              <option value="standard_120_ohm">Standard Dual 120Ω End Resistors</option>
              <option value="single_end_high_z_unterminated">Single-End / Reflection Risk (Unterminated)</option>
            </select>
          </div>

          {/* Physical Timing Metrics */}
          <div className="bg-sunken rounded-xl p-3.5 border border-hairline font-mono text-xs space-y-2.5">
            <div className="text-[11px] font-bold text-accent-fg uppercase tracking-wider">
              Propagation &amp; Physical Layer Margins
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <div>
                <span className="text-fg-subtle block">Effective Baud:</span>
                <span className="font-bold text-fg">{simResult.actualBaudRateKbps} kbps</span>
              </div>
              <div>
                <span className="text-fg-subtle block">Round-Trip Delay:</span>
                <span className="font-bold text-sky-700">{simResult.roundTripDelayNs.toFixed(0)} ns</span>
              </div>
              <div>
                <span className="text-fg-subtle block">Termination Req:</span>
                <span className="font-bold text-fg">{simResult.terminationImpedanceOhms} Ω</span>
              </div>
              <div>
                <span className="text-fg-subtle block">CM Filter Cutoff:</span>
                <span className="font-bold text-emerald-700">{simResult.commonModeFilterCutoffKhz} kHz</span>
              </div>
            </div>
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
