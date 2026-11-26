'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { TelemetryProfile } from '@hackerland/core';
import {
  computeTelemetryStats,
  detectTelemetryAnomalies,
  parseCsvTelemetry,
} from '@hackerland/core';
import { Button } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import { AttitudeIndicator } from './attitude-indicator';
import { BmsCellMatrix } from './bms-cell-matrix';
import { TelemetryChart } from './telemetry-chart';

interface TelemetryStudioProps {
  initialProfiles: TelemetryProfile[];
}

export function TelemetryStudio({ initialProfiles }: TelemetryStudioProps) {
  const labShell = useLabShell();
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `${activeProfile.title} Telemetry Log`,
        summary: `${samples.length} samples across ${activeProfile.channels.length} channels (${activeProfile.hardwareBoard}).`,
        tags: ['telemetry', activeProfile.deviceType],
        payload: { activeProfile },
      }),
      onLoad: (ws) => {
        const saved = ws.payload?.activeProfile as TelemetryProfile | undefined;
        if (saved && Array.isArray(saved.recordedSamples)) {
          setProfiles((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
          setSelectedProfileId(saved.id);
          setCurrentIndex(0);
        }
      },
    });
  }, [labShell, activeProfile, samples.length]);

  useEffect(() => {
    if (!isPlaying || samples.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(50, 500 / playbackSpeed);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= samples.length - 1 ? 0 : prev + 1));
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, samples.length]);

  const handleSelectProfile = (id: string) => {
    setSelectedProfileId(id);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const anomalies = useMemo(() => {
    return detectTelemetryAnomalies(samples, activeProfile.channels);
  }, [samples, activeProfile.channels]);

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
      setSerialConnected(true);
      setSerialLog((prev) => [
        ...prev,
        `[VIRTUAL BRIDGE] Started WebSerial virtual stream at ${baudRate} baud.`,
        `[UART] $GNGGA,123519,1258.1234,N,07735.4321,E,1,08,0.9,915.2,M,46.9,M,,*47`,
        `[UART] $BMS,V=57.42,I=-32.1,T_MAX=38.4,SOC=82.4,DELTA_MV=22*5A`,
      ]);
    }
  };

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
      subtitle: `Uploaded CSV with ${parsed.channels.length} channels and ${parsed.samples.length} samples`,
      deviceType: 'custom',
      hardwareBoard: 'Custom Serial / CSV Log',
      firmwareStack: 'Custom Firmware',
      sampleRateHz: 1,
      description: 'Custom timeseries telemetry stream imported directly into Hackerland Telemetry Studio.',
      channels: parsed.channels.map((ch, idx) => ({
        id: ch,
        name: ch.toUpperCase().replace(/_/g, ' '),
        unit: 'val',
        type: 'custom',
        minNominal: 0,
        maxNominal: 100,
        color: ['#e11d74', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2'][idx % 6] ?? '#e11d74',
      })),
      recordedSamples: parsed.samples,
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setSelectedProfileId(newProfile.id);
    setCurrentIndex(0);
    setShowCsvModal(false);
    setCsvInput('');

    void labShell?.saveWorkspace({
      title: newProfile.title,
      summary: newProfile.subtitle,
      tags: ['telemetry', 'csv-import'],
      payload: { activeProfile: newProfile },
    });
  };

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
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header and Profile Actions */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 shadow-xs flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full bg-accent/10 px-3 py-1">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-wider text-accent-fg uppercase">
              Hackerland Mission Control · Digital Twin Telemetry
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {activeProfile.title}
          </h1>
          <p className="mt-1 text-sm text-fg-muted max-w-3xl">{activeProfile.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={serialConnected ? 'soft' : 'secondary'}
            onClick={() => setShowWebSerial(!showWebSerial)}
          >
            <span className={`h-2 w-2 rounded-full ${serialConnected ? 'bg-success animate-ping' : 'bg-fg-subtle'}`} />
            <span>{serialConnected ? 'WebSerial Live' : 'Connect WebSerial'}</span>
          </Button>

          <Button type="button" size="sm" variant="secondary" onClick={() => setShowCsvModal(true)}>
            <span>Import CSV</span>
          </Button>

          <Button type="button" size="sm" variant="primary" onClick={handleExportCsv}>
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Profile Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {profiles.map((p) => {
          const isSelected = p.id === selectedProfileId;
          return (
            <button
              type="button"
              key={p.id}
              onClick={() => handleSelectProfile(p.id)}
              className={`rounded-xl px-4 py-2 text-xs text-left transition-all border ${
                isSelected
                  ? 'border-accent bg-accent-soft text-fg shadow-xs ring-1 ring-accent/25'
                  : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/35 hover:text-fg'
              }`}
            >
              <div className="font-display font-bold">{p.title.split(' ')[0]} {p.title.split(' ')[1]}</div>
              <div className="text-[10px] text-accent-fg font-mono">{p.deviceType.replace('_', ' ').toUpperCase()}</div>
            </button>
          );
        })}
      </div>

      {/* WebSerial Drawer */}
      {showWebSerial && (
        <div className="rounded-2xl border border-hairline bg-surface-1 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-fg">HARDWARE SERIAL BUS (UART / USB-CDC)</span>
              <span className="text-xs text-fg-muted">Direct physical hardware debugging</span>
            </div>
            <button
              type="button"
              onClick={() => setShowWebSerial(false)}
              className="text-fg-muted hover:text-fg text-xs font-mono"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-mono text-fg-muted">
              Baud Rate:
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                disabled={serialConnected}
                className="ml-2 rounded-lg border border-line bg-sunken px-2.5 py-1 text-xs font-mono text-fg"
              >
                <option value={9600}>9600</option>
                <option value={57600}>57600</option>
                <option value={115200}>115200 (Standard)</option>
                <option value={921600}>921600 (High-Speed)</option>
              </select>
            </label>

            <Button
              type="button"
              size="sm"
              variant={serialConnected ? 'secondary' : 'primary'}
              onClick={handleToggleWebSerial}
            >
              {serialConnected ? 'Disconnect Port' : 'Open Serial Port'}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="soft"
              onClick={() => {
                setSerialLog((prev) => [
                  ...prev,
                  `[UART INJECT] $SYS,STATUS=OK,V_IN=12.24,PWR=18.4W,CHKSUM=0x9A`,
                ]);
              }}
            >
              Inject Telemetry Packet
            </Button>
          </div>

          <div className="h-32 overflow-y-auto rounded-xl border border-hairline bg-sunken p-3 font-mono text-[11px] text-accent-fg space-y-1">
            {serialLog.length === 0 ? (
              <span className="text-fg-subtle">{`// No serial packets received yet. Click 'Open Serial Port' to listen.`}</span>
            ) : (
              serialLog.map((log, idx) => <div key={`log-${idx}`}>{log}</div>)
            )}
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-1 p-6 shadow-overlay space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-fg">Import Telemetry CSV Log</h3>
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="text-fg-subtle hover:text-fg font-mono text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-fg-muted">
              Paste standard CSV timeseries. The first column can be <code className="text-accent-fg font-mono">time_ms</code> or <code className="text-accent-fg font-mono">timestamp</code>, followed by numerical sensor channels.
            </p>

            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="time_ms,altitude_m,speed_mps,current_a&#10;0,10.2,4.5,12.0&#10;1000,15.8,7.2,18.4&#10;2000,22.1,9.8,24.1"
              className="w-full rounded-xl border border-line bg-sunken p-3 font-mono text-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
            />

            {csvError && (
              <div className="rounded-xl border border-danger/35 bg-danger/10 p-2 text-xs font-mono text-danger-fg">
                {csvError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setCsvInput(
                    `time_ms,voltage_v,current_a,temp_c\n0,12.4,1.2,28.4\n1000,12.2,2.8,31.2\n2000,11.9,4.5,35.6\n3000,11.5,5.8,39.1\n4000,11.1,6.2,42.5`,
                  );
                }}
                className="text-xs font-mono font-semibold text-accent-fg hover:underline"
              >
                Load Sample Drone Flight Log
              </button>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setShowCsvModal(false)}>
                  Cancel
                </Button>
                <Button type="button" size="sm" variant="primary" onClick={handleImportCsv}>
                  Parse &amp; Visualize
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playback Scrubber Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface-1 p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause stream' : 'Play stream'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <button
            type="button"
            onClick={() => setCurrentIndex(0)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-hairline bg-sunken text-fg-muted hover:text-fg"
            title="Rewind to start"
          >
            «
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-hairline bg-sunken text-fg-muted hover:text-fg"
            title="Step 1 frame back"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(samples.length - 1, prev + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-hairline bg-sunken text-fg-muted hover:text-fg"
            title="Step 1 frame forward"
          >
            ›
          </button>

          <div className="flex items-center space-x-1 rounded-xl border border-hairline bg-sunken p-1">
            {[0.5, 1, 2, 5].map((speed) => (
              <button
                type="button"
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded-lg px-2 py-0.5 text-xs font-mono font-medium transition-all ${
                  playbackSpeed === speed
                    ? 'bg-accent text-on-solid font-bold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center space-x-4 max-w-xl">
          <input
            type="range"
            min={0}
            max={Math.max(0, samples.length - 1)}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-2 accent-accent"
          />
          <span className="font-mono text-xs text-fg-muted whitespace-nowrap">
            {((currentSample?.timestampMs ?? 0) / 1000).toFixed(1)}s /{' '}
            {((samples[samples.length - 1]?.timestampMs ?? 0) / 1000).toFixed(1)}s
          </span>
        </div>

        <div className="font-mono text-xs text-fg-muted">
          Sample: <strong className="text-fg">{currentIndex + 1}</strong> / {samples.length}
        </div>
      </div>

      {/* Main Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <TelemetryChart
            channels={activeProfile.channels}
            samples={samples}
            currentIndex={currentIndex}
            onSelectIndex={setCurrentIndex}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeProfile.channels.slice(0, 4).map((ch) => {
              const stats = computeTelemetryStats(samples, ch.id);
              const currentVal = currentSample?.values[ch.id] ?? stats.current;

              return (
                <div
                  key={`stat-${ch.id}`}
                  className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted">
                    <span className="truncate">{ch.name}</span>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-fg tracking-tight">
                    {currentVal.toFixed(1)}
                    <span className="text-xs font-normal text-fg-subtle ml-1">{ch.unit}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-hairline pt-1.5 text-[10px] font-mono text-fg-subtle">
                    <span>MIN: {stats.min}</span>
                    <span>AVG: {stats.mean}</span>
                    <span>MAX: {stats.max}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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

              <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-2 shadow-xs">
                <h4 className="font-display text-xs font-bold text-fg uppercase tracking-wider">
                  Avionics &amp; GNSS RTK Lock
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                    <span className="text-fg-subtle block text-[10px]">FLIGHT STACK</span>
                    <span className="text-fg font-bold">{activeProfile.firmwareStack}</span>
                  </div>
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                    <span className="text-fg-subtle block text-[10px]">RTK SATELLITES</span>
                    <span className="text-success-fg font-bold">
                      {currentSample?.values['gps_sats'] ?? 24} Fixed (F9P)
                    </span>
                  </div>
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                    <span className="text-fg-subtle block text-[10px]">BARO ALTITUDE</span>
                    <span className="text-info-fg font-bold">
                      {currentSample?.values['altitude_m'] ?? 0} m
                    </span>
                  </div>
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                    <span className="text-fg-subtle block text-[10px]">PAYLOAD SPRAY</span>
                    <span className="text-accent-fg font-bold">
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

              <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-2 shadow-xs">
                <h4 className="font-display text-xs font-bold text-fg uppercase tracking-wider">
                  Powertrain Thermal Safety
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                    <span className="text-fg-subtle block text-[10px]">INVERTER MOSFET</span>
                    <span className="text-accent-fg font-bold">
                      {currentSample?.values['inverter_temp_c'] ?? 36} °C
                    </span>
                  </div>
                  <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                    <span className="text-fg-subtle block text-[10px]">MOTOR SPEED</span>
                    <span className="text-info-fg font-bold">
                      {currentSample?.values['motor_rpm'] ?? 0} RPM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'iot_sensor' && (
            <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-4 shadow-xs">
              <h4 className="font-display text-xs font-bold text-fg uppercase tracking-wider">
                RF Link &amp; Energy Harvester
              </h4>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-fg-muted mb-1">
                    <span>LoRa IN865 Signal (RSSI)</span>
                    <span className="text-accent-fg font-bold">
                      {currentSample?.values['lora_rssi_dbm'] ?? -90} dBm
                    </span>
                  </div>
                  <div className="h-2 w-full bg-sunken rounded-full overflow-hidden border border-hairline">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${Math.min(100, Math.max(10, ((Number(currentSample?.values['lora_rssi_dbm'] ?? -90) + 125) / 85) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-fg-muted mb-1">
                    <span>Supercapacitor Buffer</span>
                    <span className="text-success-fg font-bold">
                      {currentSample?.values['supercap_v'] ?? 2.8} V
                    </span>
                  </div>
                  <div className="h-2 w-full bg-sunken rounded-full overflow-hidden border border-hairline">
                    <div
                      className="h-full bg-success"
                      style={{
                        width: `${Math.min(100, Math.max(10, ((Number(currentSample?.values['supercap_v'] ?? 2.8) - 2.0) / 1.6) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-hairline bg-sunken p-3">
                  <div className="text-[10px] text-fg-subtle">INDIGENOUS SILICON</div>
                  <div className="text-fg font-bold">{activeProfile.hardwareBoard}</div>
                  <div className="text-[11px] text-accent-fg mt-1">
                    Solar Harvest: {currentSample?.values['solar_pv_mv'] ?? 0} mV
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'cubesat_satellite' && (
            <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-4 shadow-xs">
              <h4 className="font-display text-xs font-bold text-fg uppercase tracking-wider">
                ADCS &amp; Orbital Power
              </h4>
              <div className="space-y-2 font-mono text-xs">
                <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                  <span className="text-[10px] text-fg-subtle block">SUN ILLUMINATION FLUX</span>
                  <span className="text-warning-fg font-bold text-sm">
                    {(currentSample?.values['sun_sensor_lux'] ?? 0).toLocaleString()} lux
                  </span>
                </div>
                <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                  <span className="text-[10px] text-fg-subtle block">REACTION WHEEL MOMENTUM</span>
                  <span className="text-info-fg font-bold text-sm">
                    {currentSample?.values['reaction_wheel_rpm'] ?? 0} RPM
                  </span>
                </div>
                <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                  <span className="text-[10px] text-fg-subtle block">S-BAND TRANSMITTER PA TEMP</span>
                  <span className="text-danger-fg font-bold text-sm">
                    {currentSample?.values['pa_rf_temp_c'] ?? 0} °C
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeProfile.deviceType === 'custom' && (
            <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-2 shadow-xs">
              <h4 className="font-display text-xs font-bold text-fg uppercase tracking-wider">
                Imported Telemetry Log
              </h4>
              <p className="text-xs text-fg-muted">
                Playing back imported CSV trace with {activeProfile.channels.length} channels.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-hairline bg-surface-1 p-4 text-xs font-mono space-y-2 shadow-xs">
            <div className="text-[10px] font-bold tracking-wider text-fg-subtle uppercase">
              HARDWARE TESTBENCH
            </div>
            <div className="text-fg-muted">
              Board: <span className="text-fg font-semibold">{activeProfile.hardwareBoard}</span>
            </div>
            <div className="text-fg-muted">
              Stack: <span className="text-fg font-semibold">{activeProfile.firmwareStack}</span>
            </div>
            <div className="text-fg-subtle text-[11px] leading-relaxed pt-1 border-t border-hairline font-sans">
              {activeProfile.description}
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Engine */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
          <div className="flex items-center space-x-2">
            <span className={`h-2.5 w-2.5 rounded-full ${anomalies.length > 0 ? 'bg-warning' : 'bg-success'}`} />
            <h3 className="font-display text-sm font-bold text-fg uppercase tracking-wider">
              Automated Anomaly &amp; Threshold Excursion Engine
            </h3>
          </div>
          <span className="text-xs font-mono text-fg-muted">
            {anomalies.length} Anomaly Events Detected
          </span>
        </div>

        {anomalies.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-success-fg">
            ✓ All channels within nominal operating boundaries. Zero safety violations logged.
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {anomalies.map((anom, idx) => (
              <div
                key={`anom-${idx}`}
                className={`flex items-start justify-between rounded-xl border p-3 text-xs font-mono transition-all ${
                  anom.severity === 'critical'
                    ? 'border-danger/35 bg-danger/10 text-danger-fg'
                    : 'border-warning/35 bg-warning/10 text-warning-fg'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        anom.severity === 'critical'
                          ? 'bg-danger text-on-solid'
                          : 'bg-warning text-on-solid'
                      }`}
                    >
                      {anom.severity}
                    </span>
                    <span className="font-semibold text-fg">{anom.channelName}</span>
                    <span className="text-fg-subtle text-[10px]">
                      @ {(anom.timestampMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{anom.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sampleIdx = samples.findIndex((s) => s.timestampMs >= anom.timestampMs);
                    if (sampleIdx !== -1) {
                      setCurrentIndex(sampleIdx);
                      setIsPlaying(false);
                    }
                  }}
                  className="rounded-lg border border-hairline bg-surface-1 px-2.5 py-1 text-[10px] text-fg hover:border-accent"
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
