'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { TelemetryProfile, TelemetrySample } from '@hackerland/core';
import {
  computeTelemetryStats,
  detectTelemetryAnomalies,
  parseCsvTelemetry,
} from '@hackerland/core';
import { AttitudeIndicator } from './attitude-indicator';
import { BmsCellMatrix } from './bms-cell-matrix';
import { TelemetryChart } from './telemetry-chart';

interface TelemetryStudioProps {
  initialProfiles: TelemetryProfile[];
}

export function TelemetryStudio({ initialProfiles }: TelemetryStudioProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    initialProfiles[0]?.id ?? 'tel_garuda_drone',
  );
  const [profiles, setProfiles] = useState<TelemetryProfile[]>(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showWebSerial, setShowWebSerial] = useState<boolean>(false);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [serialConnected, setSerialConnected] = useState<boolean>(false);
  const [serialLog, setSerialLog] = useState<string[]>([]);
  const [showCsvModal, setShowCsvModal] = useState<boolean>(false);
  const [csvInput, setCsvInput] = useState<string>('');
  const [csvError, setCsvError] = useState<string | null>(null);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === selectedProfileId) ?? profiles[0]!,
    [profiles, selectedProfileId],
  );

  const samples = activeProfile.recordedSamples;
  const currentSample = samples[currentIndex] ?? samples[0];

  // Playback timer loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying || samples.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(50, 500 / playbackSpeed);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= samples.length - 1) {
          return 0; // loop back to beginning
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, samples.length]);

  // When profile changes, reset index to 0
  const handleSelectProfile = (id: string) => {
    setSelectedProfileId(id);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  // Compute anomalies across profile
  const anomalies = useMemo(() => {
    return detectTelemetryAnomalies(samples, activeProfile.channels);
  }, [samples, activeProfile.channels]);

  // WebSerial handler
  const handleToggleWebSerial = async () => {
    if (serialConnected) {
      setSerialConnected(false);
      setSerialLog((prev) => [...prev, `[SYSTEM] Serial port disconnected.`]);
      return;
    }

    if (typeof window !== 'undefined' && 'serial' in navigator) {
      try {
        setSerialLog((prev) => [
          ...prev,
          `[SYSTEM] Requesting WebSerial port at ${baudRate} baud...`,
        ]);
        // Request port in modern Chromium/Edge
        const nav = navigator as unknown as { serial: { requestPort: () => Promise<unknown> } };
        await nav.serial.requestPort();
        setSerialConnected(true);
        setSerialLog((prev) => [
          ...prev,
          `[SYSTEM] Connected to hardware UART. Receiving telemetry frames...`,
        ]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setSerialLog((prev) => [...prev, `[ERROR] Serial connection aborted: ${msg}`]);
      }
    } else {
      // Browser fallback simulation
      setSerialConnected(true);
      setSerialLog((prev) => [
        ...prev,
        `[FALLBACK] WebSerial API not natively supported on this browser engine. Starting virtual hardware bridge at ${baudRate} baud.`,
        `[UART] $GNGGA,123519,1258.1234,N,07735.4321,E,1,08,0.9,915.2,M,46.9,M,,*47`,
        `[UART] $BMS,V=57.42,I=-32.1,T_MAX=38.4,SOC=82.4,DELTA_MV=22*5A`,
      ]);
    }
  };

  // CSV Importer
  const handleImportCsv = () => {
    setCsvError(null);
    if (!csvInput.trim()) {
      setCsvError('Please paste CSV text or load sample.');
      return;
    }

    const parsed = parseCsvTelemetry(csvInput);
    if (parsed.parseError) {
      setCsvError(parsed.parseError);
      return;
    }

    if (parsed.samples.length === 0) {
      setCsvError('No valid data rows found in CSV.');
      return;
    }

    const newProfile: TelemetryProfile = {
      id: `tel_custom_${Date.now()}`,
      slug: `custom-telemetry-${Date.now()}`,
      title: 'Imported Custom Telemetry Stream',
      subtitle: `User uploaded log with ${parsed.channels.length} channels and ${parsed.samples.length} samples`,
      deviceType: 'custom',
      hardwareBoard: 'Custom Serial / CSV Log',
      firmwareStack: 'Custom Firmware',
      sampleRateHz: 1,
      description: 'Custom timeseries telemetry stream imported directly into Hackerland OS.',
      channels: parsed.channels.map((ch, idx) => ({
        id: ch,
        name: ch.toUpperCase().replace(/_/g, ' '),
        unit: 'val',
        type: 'custom',
        minNominal: 0,
        maxNominal: 100,
        color: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][idx % 6] ?? '#3b82f6',
      })),
      recordedSamples: parsed.samples,
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setSelectedProfileId(newProfile.id);
    setCurrentIndex(0);
    setShowCsvModal(false);
    setCsvInput('');
  };

  // Export current telemetry to CSV
  const handleExportCsv = () => {
    if (samples.length === 0) return;
    const headers = ['time_ms', ...activeProfile.channels.map((c) => c.id)];
    const rows = samples.map((s) => {
      const vals = activeProfile.channels.map((c) => s.values[c.id] ?? '');
      return [s.timestampMs, ...vals].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeProfile.slug}-telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Profile Switcher */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 uppercase">
              Hackerland Mission Control // Digital Twin Telemetry
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {activeProfile.title}
          </h1>
          <p className="mt-1 text-sm text-stone-400 max-w-3xl">{activeProfile.subtitle}</p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowWebSerial(!showWebSerial)}
            className={`inline-flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono font-medium transition-all ${
              serialConnected
                ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                : 'border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-600 hover:text-white'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${serialConnected ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
            <span>{serialConnected ? 'WebSerial Live' : 'Connect WebSerial'}</span>
          </button>

          <button
            onClick={() => setShowCsvModal(true)}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 hover:border-stone-600 hover:text-white transition-all"
          >
            <svg className="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 hover:border-stone-600 hover:text-white transition-all"
          >
            <svg className="h-3.5 w-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Profile Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        {profiles.map((p) => {
          const isSelected = p.id === selectedProfileId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectProfile(p.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? 'border border-amber-500/50 bg-amber-500/10 text-amber-300 shadow-sm'
                  : 'border border-stone-800 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              <div className="font-semibold">{p.title.split(' ')[0]} {p.title.split(' ')[1]}</div>
              <div className="text-[10px] text-stone-500 font-mono">{p.deviceType.replace('_', ' ').toUpperCase()}</div>
            </button>
          );
        })}
      </div>

      {/* WebSerial Connect Modal / Drawer */}
      {showWebSerial && (
        <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-white">HARDWARE SERIAL BUS (UART / USB-CDC)</span>
              <span className="text-xs text-stone-400">Direct physical hardware debugging</span>
            </div>
            <button
              onClick={() => setShowWebSerial(false)}
              className="text-stone-400 hover:text-white text-xs font-mono"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-mono text-stone-400">
              Baud Rate:
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                disabled={serialConnected}
                className="ml-2 rounded-lg border border-stone-700 bg-stone-900 px-2.5 py-1 text-xs font-mono text-white"
              >
                <option value={9600}>9600</option>
                <option value={57600}>57600</option>
                <option value={115200}>115200 (Standard)</option>
                <option value={921600}>921600 (High-Speed)</option>
              </select>
            </label>

            <button
              onClick={handleToggleWebSerial}
              className={`rounded-xl px-4 py-1.5 text-xs font-mono font-medium transition-all ${
                serialConnected
                  ? 'bg-red-900/40 text-red-300 border border-red-700/60 hover:bg-red-900/60'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {serialConnected ? 'Disconnect Port' : 'Open Serial Port'}
            </button>

            <button
              onClick={() => {
                setSerialLog((prev) => [
                  ...prev,
                  `[UART INJECT] $SYS,STATUS=OK,V_IN=12.24,PWR=18.4W,CHKSUM=0x9A`,
                ]);
              }}
              className="rounded-xl border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 hover:text-white"
            >
              Inject Telemetry Packet
            </button>
          </div>

          {/* Serial Terminal View */}
          <div className="h-32 overflow-y-auto rounded-xl border border-stone-900 bg-black p-3 font-mono text-[11px] text-emerald-400 space-y-1">
            {serialLog.length === 0 ? (
              <span className="text-stone-600">// No serial packets received yet. Click &apos;Open Serial Port&apos; to listen.</span>
            ) : (
              serialLog.map((log, idx) => <div key={`log-${idx}`}>{log}</div>)
            )}
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Import Telemetry CSV Log</h3>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-stone-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-400">
              Paste standard CSV timeseries. The first column can be <code className="text-amber-400 font-mono">time_ms</code> or <code className="text-amber-400 font-mono">timestamp</code>, followed by numerical sensor channels.
            </p>

            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="time_ms,altitude_m,speed_mps,current_a&#10;0,10.2,4.5,12.0&#10;1000,15.8,7.2,18.4&#10;2000,22.1,9.8,24.1"
              className="w-full rounded-xl border border-stone-800 bg-stone-900 p-3 font-mono text-xs text-stone-200 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none"
            />

            {csvError && (
              <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-2 text-xs font-mono text-red-300">
                {csvError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCsvInput(
                    `time_ms,voltage_v,current_a,temp_c\n0,12.4,1.2,28.4\n1000,12.2,2.8,31.2\n2000,11.9,4.5,35.6\n3000,11.5,5.8,39.1\n4000,11.1,6.2,42.5`
                  );
                }}
                className="text-xs font-mono text-amber-400 hover:underline"
              >
                Load Sample Drone Flight Log
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setShowCsvModal(false)}
                  className="rounded-xl border border-stone-800 px-4 py-2 text-xs font-mono text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportCsv}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-mono font-bold text-stone-950 hover:bg-amber-400"
                >
                  Parse &amp; Visualize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Mission Control Playback Scrubber Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-stone-950 hover:bg-stone-200 transition-all"
            title={isPlaying ? 'Pause stream' : 'Play stream'}
          >
            {isPlaying ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Reset / Rewind */}
          <button
            onClick={() => setCurrentIndex(0)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-white"
            title="Rewind to start"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* Step Back */}
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-white"
            title="Step 1 frame back"
          >
            ‹
          </button>

          {/* Step Forward */}
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(samples.length - 1, prev + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-white"
            title="Step 1 frame forward"
          >
            ›
          </button>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1 rounded-xl border border-stone-800 bg-stone-900 p-1">
            {[0.5, 1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded-lg px-2 py-0.5 text-xs font-mono font-medium transition-all ${
                  playbackSpeed === speed
                    ? 'bg-stone-800 text-white font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Slider and Timestamp Readout */}
        <div className="flex flex-1 items-center space-x-4 max-w-xl">
          <input
            type="range"
            min={0}
            max={Math.max(0, samples.length - 1)}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-800 accent-amber-500"
          />
          <span className="font-mono text-xs text-stone-400 whitespace-nowrap">
            {((currentSample?.timestampMs ?? 0) / 1000).toFixed(1)}s /{' '}
            {((samples[samples.length - 1]?.timestampMs ?? 0) / 1000).toFixed(1)}s
          </span>
        </div>

        {/* Frame Count */}
        <div className="font-mono text-xs text-stone-500">
          Sample: <strong className="text-white">{currentIndex + 1}</strong> / {samples.length}
        </div>
      </div>

      {/* Main Grid: Telemetry Graph & Domain Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Timeseries Oscilloscope */}
        <div className="lg:col-span-2 space-y-4">
          <TelemetryChart
            channels={activeProfile.channels}
            samples={samples}
            currentIndex={currentIndex}
            onSelectIndex={setCurrentIndex}
          />

          {/* Channel Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeProfile.channels.slice(0, 4).map((ch) => {
              const stats = computeTelemetryStats(samples, ch.id);
              const currentVal = currentSample?.values[ch.id] ?? stats.current;

              return (
                <div
                  key={`stat-${ch.id}`}
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-3.5 shadow-sm"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span className="truncate">{ch.name}</span>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ch.color }} />
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-white tracking-tight">
                    {currentVal.toFixed(1)}
                    <span className="text-xs font-normal text-stone-400 ml-1">{ch.unit}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-stone-800/80 pt-1.5 text-[10px] font-mono text-stone-500">
                    <span>MIN: {stats.min}</span>
                    <span>AVG: {stats.mean}</span>
                    <span>MAX: {stats.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Dynamic Hardware Physical Twin Visualizers */}
        <div className="space-y-4">
          {activeProfile.deviceType === 'drone_uav' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <AttitudeIndicator
                  rollDeg={currentSample?.values['roll_deg'] ?? 0}
                  pitchDeg={currentSample?.values['pitch_deg'] ?? 0}
                  size={200}
                />
              </div>

              {/* Avionics Info */}
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-2">
                <h4 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
                  Avionics &amp; GNSS RTK Lock
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2">
                    <span className="text-stone-500 block text-[10px]">FLIGHT STACK</span>
                    <span className="text-white font-bold">{activeProfile.firmwareStack}</span>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2">
                    <span className="text-stone-500 block text-[10px]">RTK SATELLITES</span>
                    <span className="text-emerald-400 font-bold">
                      {currentSample?.values['gps_sats'] ?? 24} Fixed (F9P)
                    </span>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2">
                    <span className="text-stone-500 block text-[10px]">BARO ALTITUDE</span>
                    <span className="text-sky-400 font-bold">
                      {currentSample?.values['altitude_m'] ?? 0} m
                    </span>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2">
                    <span className="text-stone-500 block text-[10px]">PAYLOAD SPRAY</span>
                    <span className="text-cyan-400 font-bold">
                      {currentSample?.values['payload_liters'] ?? 16} L
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'ev_bms' && (
            <div className="space-y-4">
              <BmsCellMatrix
                packVoltage={currentSample?.values['pack_voltage_v'] ?? 57.6}
                cellDeltaMv={currentSample?.values['cell_delta_mv'] ?? 18}
                cellCount={16}
              />

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-2">
                <h4 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
                  Powertrain Thermal Safety
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2">
                    <span className="text-stone-500 block text-[10px]">INVERTER MOSFET</span>
                    <span className="text-rose-400 font-bold">
                      {currentSample?.values['inverter_temp_c'] ?? 36} °C
                    </span>
                  </div>
                  <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2">
                    <span className="text-stone-500 block text-[10px]">MOTOR SPEED</span>
                    <span className="text-purple-400 font-bold">
                      {currentSample?.values['motor_rpm'] ?? 0} RPM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'iot_sensor' && (
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-4">
              <h4 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
                RF Link &amp; Energy Harvester
              </h4>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>LoRa IN865 Signal (RSSI)</span>
                    <span className="text-purple-400 font-bold">
                      {currentSample?.values['lora_rssi_dbm'] ?? -90} dBm
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${Math.min(100, Math.max(10, ((Number(currentSample?.values['lora_rssi_dbm'] ?? -90) + 125) / 85) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Supercapacitor Buffer</span>
                    <span className="text-emerald-400 font-bold">
                      {currentSample?.values['supercap_v'] ?? 2.8} V
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${Math.min(100, Math.max(10, ((Number(currentSample?.values['supercap_v'] ?? 2.8) - 2.0) / 1.6) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
                  <div className="text-[10px] text-stone-500">INDIGENOUS SILICON</div>
                  <div className="text-white font-bold">{activeProfile.hardwareBoard}</div>
                  <div className="text-[11px] text-amber-400 mt-1">
                    Solar Harvest: {currentSample?.values['solar_pv_mv'] ?? 0} mV
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'cubesat_satellite' && (
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-4">
              <h4 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
                ADCS &amp; In-Orbit Solar Orbit
              </h4>
              <div className="space-y-2 font-mono text-xs">
                <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                  <span className="text-[10px] text-stone-500 block">SUN ILLUMINATION FLUX</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {(currentSample?.values['sun_sensor_lux'] ?? 0).toLocaleString()} lux
                  </span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                  <span className="text-[10px] text-stone-500 block">REACTION WHEEL MOMENTUM</span>
                  <span className="text-purple-400 font-bold text-sm">
                    {currentSample?.values['reaction_wheel_rpm'] ?? 0} RPM
                  </span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                  <span className="text-[10px] text-stone-500 block">S-BAND TRANSMITTER PA TEMP</span>
                  <span className="text-red-400 font-bold text-sm">
                    {currentSample?.values['pa_rf_temp_c'] ?? 0} °C
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'custom' && (
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 space-y-2">
              <h4 className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
                Imported Telemetry Log
              </h4>
              <p className="text-xs text-stone-400">
                Playing back user imported CSV trace with {activeProfile.channels.length} channels.
              </p>
            </div>
          )}

          {/* Hardware & Spec Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-xs font-mono space-y-2">
            <div className="text-[10px] font-bold tracking-wider text-stone-500 uppercase">
              HARDWARE TESTBENCH
            </div>
            <div className="text-stone-300">
              Board: <span className="text-white font-semibold">{activeProfile.hardwareBoard}</span>
            </div>
            <div className="text-stone-300">
              Stack: <span className="text-white font-semibold">{activeProfile.firmwareStack}</span>
            </div>
            <div className="text-stone-400 text-[11px] leading-relaxed pt-1 border-t border-stone-900">
              {activeProfile.description}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Anomaly Detection Audit Feed */}
      <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${anomalies.length > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Automated Anomaly &amp; Threshold Excursion Engine
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-400">
            {anomalies.length} Anomaly Events Detected
          </span>
        </div>

        {anomalies.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-stone-500">
            ✓ All channels within nominal operating boundaries. Zero safety violations logged.
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {anomalies.map((anom, idx) => (
              <div
                key={`anom-${idx}`}
                className={`flex items-start justify-between rounded-xl border p-2.5 text-xs font-mono transition-all ${
                  anom.severity === 'critical'
                    ? 'border-red-900/50 bg-red-950/20 text-red-300'
                    : 'border-amber-900/50 bg-amber-950/20 text-amber-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        anom.severity === 'critical' ? 'bg-red-800/60 text-white' : 'bg-amber-800/60 text-stone-200'
                      }`}
                    >
                      {anom.severity}
                    </span>
                    <span className="font-semibold">{anom.channelName}</span>
                    <span className="text-stone-400 text-[10px]">
                      @ {(anom.timestampMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{anom.message}</p>
                </div>
                <button
                  onClick={() => {
                    const sampleIdx = samples.findIndex((s) => s.timestampMs >= anom.timestampMs);
                    if (sampleIdx !== -1) {
                      setCurrentIndex(sampleIdx);
                      setIsPlaying(false);
                    }
                  }}
                  className="rounded border border-stone-700/80 bg-stone-900/60 px-2 py-1 text-[10px] text-stone-300 hover:text-white"
                >
                  Seek
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
