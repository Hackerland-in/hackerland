'use client';

import { useState, useEffect } from 'react';
import { Badge, Button, Card, CardBody, CardHeader, StatusDot } from '@hackerland/ui';
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';

export interface WokwiSimulatorProps {
  projectTitle?: string;
  defaultMcu?: 'ESP32-S3' | 'RP2040' | 'STM32F4';
  className?: string;
}

export function WokwiSimulator({
  projectTitle = 'AeroGlide Telemetry & Sensor Mesh',
  defaultMcu = 'ESP32-S3',
  className = '',
}: WokwiSimulatorProps) {
  const [mcu, setMcu] = useState(defaultMcu);
  const [isRunning, setIsRunning] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [altitude, setAltitude] = useState(1420);
  const [voltage, setVoltage] = useState(4.18);
  const [flapAngle, setFlapAngle] = useState(12);

  const initialLogs = [
    `[BOOT] ${defaultMcu} (Dual-Core @ 240MHz) init: FreeRTOS v10.4.3`,
    '[I2C1] Probing bus @ 400kHz: found BNO085 (0x4A), MS5611 (0x77)',
    '[SENS] MS5611 Altimeter online: 1420.4m pressure altitude',
    '[LORA] SX1276 initialized @ 915.0MHz, SF=7, BW=125kHz, CR=4/5',
    '[TELE] Telemetry stream active on UART0 @ 115200 baud',
  ];

  const [logs, setLogs] = useState<string[]>(initialLogs);

  // Periodically emit telemetry while running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAltitude((alt) => alt + Math.floor(Math.random() * 5) - 2);
      setVoltage((v) => Math.max(3.6, +(v - 0.001).toFixed(3)));

      const time = new Date().toISOString().slice(14, 19);
      const rssi = -65 - Math.floor(Math.random() * 8);
      const newEntry = `[${time}] TX PKT #${Math.floor(Date.now() / 2000) % 9999}: ALT=${altitude}m VOLT=${voltage}V RSSI=${rssi}dBm`;

      setLogs((prev) => [...prev.slice(-14), newEntry]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isRunning, altitude, voltage]);

  const handleButtonPress = (btnName: string, action: () => void) => {
    setActiveButton(btnName);
    action();
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleTrigTelem = () => {
    const time = new Date().toISOString().slice(14, 19);
    setLogs((prev) => [
      ...prev.slice(-14),
      `[${time}] >>> USER BTN A: High-rate IMU burst TX (100Hz 32-bytes)`,
    ]);
  };

  const handleServoTest = () => {
    const newAngle = flapAngle === 12 ? 24 : 12;
    setFlapAngle(newAngle);
    const time = new Date().toISOString().slice(14, 19);
    setLogs((prev) => [
      ...prev.slice(-14),
      `[${time}] >>> USER BTN B: Flap actuator set to ${newAngle}° deflection`,
    ]);
  };

  const handleCalibrate = () => {
    const time = new Date().toISOString().slice(14, 19);
    setLogs((prev) => [
      ...prev.slice(-14),
      `[${time}] >>> USER BTN C: IMU zero-point re-calibrated. Gyro offset: ±0.02°/s`,
    ]);
  };

  const handleReset = () => {
    setLogs([
      `[RST] Microcontroller reset requested via hardware watchdog`,
      `[BOOT] ${mcu} booting from Flash 0x40000000...`,
      '[I2C1] Peripheral bus initialized cleanly',
    ]);
  };

  return (
    <Card
      accent="code"
      className={`min-w-0 overflow-hidden border border-hairline bg-surface-1 shadow-module ${className}`}
      role="region"
      aria-label="Wokwi Virtual Hardware Simulator"
    >
      <CardHeader className="border-b border-hairline pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-code/30 bg-code/10 text-code-fg">
              <Radio className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  Wokwi Virtual Twin
                </span>
                <StatusDot tone={isRunning ? 'success' : 'warning'} pulse={isRunning} />
                <span className="font-mono text-[10px] text-fg-muted">
                  {isRunning ? 'RUNNING (240MHz)' : 'PAUSED'}
                </span>
              </div>
              <h3 className="font-display text-headline-sm text-fg truncate">
                {projectTitle}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {/* MCU Chip Picker */}
            <select
              aria-label="Select Target MCU"
              value={mcu}
              onChange={(e) => setMcu(e.target.value as typeof defaultMcu)}
              className="h-8 rounded-sm border border-hairline bg-surface-2 px-2.5 font-mono text-label-xs text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <option value="ESP32-S3">ESP32-S3 (Xtensa LX7)</option>
              <option value="RP2040">RP2040 (Cortex-M0+)</option>
              <option value="STM32F4">STM32F401 (Cortex-M4)</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="h-8 px-2.5 text-label-xs gap-1"
            >
              {isRunning ? (
                <>
                  <Pause className="size-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="size-3" />
                  <span>Run</span>
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              aria-label="Reset simulation"
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-w-0">
          {/* Virtual Breadboard & OLED Bench */}
          <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-hairline bg-surface-2/40 p-5 space-y-5 min-w-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-label-xs uppercase tracking-wider text-fg-subtle">
                  Virtual 0.96″ I2C OLED Display (128×64)
                </span>
                <Badge tone="code" variant="outline" className="text-[10px] px-1 font-mono">
                  SSD1306 @ 0x3C
                </Badge>
              </div>

              {/* Simulated OLED Screen */}
              <div className="relative rounded-md border-2 border-line/80 bg-sunken p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] font-mono text-body-xs">
                {/* Subtle Pixel Screen Glow Overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-md bg-accent/5 opacity-50" />

                <div className="relative z-10 space-y-1.5 text-accent-fg">
                  <div className="flex items-center justify-between border-b border-accent/20 pb-1 text-[11px] font-bold">
                    <span>AEROGLIDE TELEMETRY</span>
                    <span>915MHz</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-fg-subtle">ALT: </span>
                      <span className="text-fg font-semibold">{altitude} m</span>
                    </div>
                    <div>
                      <span className="text-fg-subtle">FLAP: </span>
                      <span className="text-fg font-semibold">{flapAngle}°</span>
                    </div>
                    <div>
                      <span className="text-fg-subtle">BATT: </span>
                      <span className="text-fg font-semibold">{voltage}V</span>
                    </div>
                    <div>
                      <span className="text-fg-subtle">MODE: </span>
                      <span className="text-make-fg font-semibold">GLIDE</span>
                    </div>
                  </div>
                  <div className="pt-1.5 text-[10px] text-accent/80 border-t border-accent/15 flex items-center justify-between">
                    <span>SYS: NOMINAL</span>
                    <span>UPTIME: 00:14:32</span>
                  </div>
                </div>
              </div>

              {/* Virtual Hardware Controls (Tactile Buttons) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-label-xs font-display uppercase tracking-wider text-fg-subtle">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="size-3.5" />
                    <span>Hardware GPIO Inputs</span>
                  </div>
                  <span className="text-[10px] text-fg-subtle">Click to trigger GPIO</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleButtonPress('BTN_A', handleTrigTelem)}
                    className={`flex flex-col items-center justify-center rounded-sm border p-2.5 text-center font-mono text-label-xs transition-all active:scale-95 ${
                      activeButton === 'BTN_A'
                        ? 'border-accent bg-accent text-on-solid shadow-[0_0_12px_var(--color-accent)]'
                        : 'border-hairline bg-surface-1 text-fg hover:border-accent hover:bg-surface-2'
                    }`}
                  >
                    <span className="font-bold">BTN_A</span>
                    <span className="text-[10px] text-fg-subtle">GPIO 14</span>
                    <span className="text-[9px] mt-1 text-accent-fg">TX Burst</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleButtonPress('BTN_B', handleServoTest)}
                    className={`flex flex-col items-center justify-center rounded-sm border p-2.5 text-center font-mono text-label-xs transition-all active:scale-95 ${
                      activeButton === 'BTN_B'
                        ? 'border-make bg-make text-on-solid shadow-[0_0_12px_var(--color-make)]'
                        : 'border-hairline bg-surface-1 text-fg hover:border-make hover:bg-surface-2'
                    }`}
                  >
                    <span className="font-bold">BTN_B</span>
                    <span className="text-[10px] text-fg-subtle">GPIO 27</span>
                    <span className="text-[9px] mt-1 text-make-fg">Servo Flap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleButtonPress('BTN_C', handleCalibrate)}
                    className={`flex flex-col items-center justify-center rounded-sm border p-2.5 text-center font-mono text-label-xs transition-all active:scale-95 ${
                      activeButton === 'BTN_C'
                        ? 'border-success bg-success text-on-solid shadow-[0_0_12px_var(--color-success)]'
                        : 'border-hairline bg-surface-1 text-fg hover:border-success hover:bg-surface-2'
                    }`}
                  >
                    <span className="font-bold">BTN_C</span>
                    <span className="text-[10px] text-fg-subtle">GPIO 33</span>
                    <span className="text-[9px] mt-1 text-success-fg">Calibrate</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-body-xs font-mono text-fg-subtle pt-2 border-t border-hairline/60">
              <span className="flex items-center gap-1.5 text-accent-fg">
                <Sparkles className="size-3" />
                Zero physical hardware needed
              </span>
              <span>WASM Simulation Core</span>
            </div>
          </div>

          {/* Serial Terminal Output */}
          <div className="flex flex-col justify-between bg-surface-1 p-5 space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-display text-label-xs uppercase tracking-wider text-fg-subtle">
                <Terminal className="size-3.5 text-accent" />
                <span>Serial Telemetry Log (UART0 @ 115200)</span>
              </div>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="font-mono text-[10px] text-fg-subtle hover:text-accent transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Terminal Log Well */}
            <div
              className="flex-1 rounded-sm border border-hairline bg-sunken p-3 font-mono text-[11px] leading-relaxed text-fg-muted overflow-y-auto max-h-[220px] min-h-[180px] space-y-1 select-text"
              aria-live="polite"
            >
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`break-words ${
                    log.includes('>>>')
                      ? 'text-accent-fg font-semibold'
                      : log.includes('ERR')
                        ? 'text-danger-fg'
                        : log.includes('TX')
                          ? 'text-make-fg'
                          : 'text-fg-muted'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-body-xs font-mono text-fg-subtle">
              <span>BUFFER: {logs.length} / 500 lines</span>
              <span className="text-success-fg">PARSER: NMEA / MAVLink</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
