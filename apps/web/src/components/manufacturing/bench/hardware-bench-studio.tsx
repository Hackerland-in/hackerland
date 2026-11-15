'use client';

import { useState, useCallback } from 'react';
import { Badge, Button } from '@hackerland/ui';
import {
  Cpu,
  Terminal,
  Code2,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { BENCH_TRACKS, type BenchTrack } from './bench-tracks-data';
import { BenchCanvas } from './bench-canvas';
import { SerialMonitor } from './serial-monitor';
import { CodeStepper } from './code-stepper';
import { PinoutVisualizer } from './pinout-visualizer';

export interface HardwareBenchStudioProps {
  initialTrackId?: string;
}

export function HardwareBenchStudio({ initialTrackId }: HardwareBenchStudioProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    initialTrackId && BENCH_TRACKS.some((t) => t.pillarId === initialTrackId || t.id === initialTrackId)
      ? BENCH_TRACKS.find((t) => t.pillarId === initialTrackId || t.id === initialTrackId)!.id
      : BENCH_TRACKS[0]!.id
  );

  const [activeTab, setActiveTab] = useState<'bench' | 'serial' | 'code' | 'pinout'>('bench');

  const currentTrack: BenchTrack =
    BENCH_TRACKS.find((t) => t.id === selectedTrackId) ?? BENCH_TRACKS[0]!;

  // Dynamic Bench State
  const [potVoltage, setPotVoltage] = useState(currentTrack.defaultPotVoltage);
  const [buttonState, setButtonState] = useState(currentTrack.defaultButtonState);
  const [ledColor, setLedColor] = useState(currentTrack.defaultLedColor);
  const [oledText, setOledText] = useState('HACKERLAND ESP32-S3');
  const [isLoopRunning] = useState(true);
  const [logs, setLogs] = useState<string[]>(currentTrack.initialSerialLogs);
  const [activeLineIndex, setActiveLineIndex] = useState(14); // setup()

  // Change Track
  const handleTrackChange = (newTrackId: string) => {
    const t = BENCH_TRACKS.find((x) => x.id === newTrackId);
    if (!t) return;
    setSelectedTrackId(newTrackId);
    setPotVoltage(t.defaultPotVoltage);
    setButtonState(t.defaultButtonState);
    setLedColor(t.defaultLedColor);
    setLogs(t.initialSerialLogs);
    setActiveLineIndex(14);
    if (newTrackId === 'drone-fc-avionics') setOledText('BETAFLIGHT F405');
    else if (newTrackId === 'ev-bms-canbus') setOledText('ISO 11898 BMS CAN');
    else if (newTrackId === 'cnc-stepper-gcode') setOledText('GRBL-PIO CNC');
    else setOledText('HACKERLAND ESP32-S3');
  };

  // Potentiometer change
  const handlePotChange = (voltage: number) => {
    setPotVoltage(voltage);
  };

  // Pushbutton press
  const handleButtonPress = () => {
    setButtonState(true);
    setLogs((prev) => [
      ...prev,
      `[GPIO 0] Button PRESSED -> Interrupt ISR fired (Logic LOW 0.0V)`,
    ]);
  };

  // Pushbutton release
  const handleButtonRelease = () => {
    setButtonState(false);
    setLogs((prev) => [
      ...prev,
      `[GPIO 0] Button RELEASED -> Pulled to 3.3V by internal 45kΩ pull-up`,
    ]);
  };

  // Serial Monitor Command Dispatcher
  const handleSendCommand = useCallback((rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setLogs((prev) => [...prev, `>>> ${cmd}`]);

    const parts = cmd.split(' ');
    const command = parts[0]?.toUpperCase() ?? '';

    if (command === 'HELP') {
      setLogs((prev) => [
        ...prev,
        '--- HACKERLAND FIRMWARE SERIAL COMMANDS ---',
        '  HELP              : Prints this command list',
        '  STATUS            : Query system health, FreeRTOS heap & clock',
        '  SCAN              : Scans I2C bus for 7-bit peripheral addresses',
        '  ADC               : Reads live analog voltage on ADC1_CH0',
        '  LED <color>       : Sets WS2812B NeoPixel color (e.g. LED #3b82f6 or LED red)',
        '  DISPLAY <text>    : Writes custom text to 128x64 OLED display',
        '  ARM / DISARM      : (Drone Track) Toggles motor safety lock',
        '  CAN_DUMP          : (EV Track) Streams ISO 11898 500kbps CAN frames',
        '  $$ / ?            : (CNC Track) Prints GRBL machine coordinates',
        '  CLEAR             : Clears terminal history',
      ]);
    } else if (command === 'STATUS') {
      setLogs((prev) => [
        ...prev,
        `[STATUS] Target: ${currentTrack.targetMcu}`,
        `[STATUS] Clock: ${currentTrack.clockSpeed} | FreeRTOS Tick: 1000Hz`,
        `[STATUS] Free Heap SRAM: 412.8 KB | Flash: 8192 KB`,
        `[STATUS] VCC Rail: 3.302V | Potentiometer: ${potVoltage.toFixed(2)}V`,
      ]);
    } else if (command === 'SCAN') {
      setLogs((prev) => [
        ...prev,
        '[I2C] Scanning I2C bus (SDA: GPIO 21, SCL: GPIO 22)...',
        '[I2C] Device detected at 7-bit address 0x3C (SSD1306 128x64 OLED)',
        '[I2C] Bus scan complete: 1 active device acknowledged (ACK).',
      ]);
    } else if (command === 'ADC') {
      const rawCount = Math.round((potVoltage / 3.3) * 4095);
      setLogs((prev) => [
        ...prev,
        `[ADC] ADC1_CH0 Conversion: ${potVoltage.toFixed(3)}V (12-bit RAW: ${rawCount} / 4095)`,
      ]);
    } else if (command === 'LED' && parts[1]) {
      const colorArg = parts[1];
      let resolvedColor = colorArg;
      if (colorArg.toLowerCase() === 'red') resolvedColor = '#ef4444';
      else if (colorArg.toLowerCase() === 'green') resolvedColor = '#10b981';
      else if (colorArg.toLowerCase() === 'blue') resolvedColor = '#3b82f6';
      else if (colorArg.toLowerCase() === 'yellow') resolvedColor = '#eab308';
      else if (colorArg.toLowerCase() === 'purple') resolvedColor = '#a855f7';
      else if (colorArg.toLowerCase() === 'white') resolvedColor = '#f8fafc';

      setLedColor(resolvedColor);
      setLogs((prev) => [
        ...prev,
        `[NEOPIXEL] GPIO 48 WS2812B frame sent: Color locked to ${resolvedColor}`,
      ]);
    } else if (command === 'DISPLAY' && parts.slice(1).join(' ')) {
      const text = parts.slice(1).join(' ');
      setOledText(text);
      setLogs((prev) => [
        ...prev,
        `[SSD1306] Framebuffer updated with string: "${text}"`,
      ]);
    } else if (command === 'CLEAR') {
      setLogs([]);
    } else if (command === 'ARM') {
      setLedColor('#ef4444');
      setLogs((prev) => [
        ...prev,
        '[ARM] WARNING: Motors ARMED! DShot600 idle stream active (Beacon tone emitted)',
      ]);
    } else if (command === 'DISARM') {
      setLedColor('#10b981');
      setLogs((prev) => [
        ...prev,
        '[ARM] Motors DISARMED. Safety throttle lock engaged.',
      ]);
    } else if (command === 'CAN_DUMP') {
      setLogs((prev) => [
        ...prev,
        '[CAN0] 0x1806E5F4 [8] 0D 01 0D 02 0D 03 0D 04  (Pack V: 13.28V)',
        '[CAN0] 0x1807E5F4 [4] 1A 22 19 80              (Temp: 26.2°C)',
        '[CAN0] 0x7E8      [8] 03 7F 22 11 00 00 00 00  (UDS Diagnostic ACK)',
      ]);
    } else if (command === '$$' || command === '?') {
      setLogs((prev) => [
        ...prev,
        '<Idle|MPos:10.000,25.000,-2.000|FS:0,12000|WCO:0.000,0.000,0.000>',
        'ok',
      ]);
    } else {
      setLogs((prev) => [
        ...prev,
        `[WARN] Unknown command "${cmd}". Type "HELP" for valid commands.`,
      ]);
    }
  }, [currentTrack, potVoltage]);

  // Code Stepper action logger
  const handleExecuteHardwareAction = (actionText: string) => {
    setLogs((prev) => [
      ...prev,
      `[STEPPER] Executed: ${actionText}`,
    ]);
  };

  return (
    <div className="space-y-6 rounded-2xl border-2 border-accent/40 bg-surface-1 p-6 shadow-xl" data-testid="hardware-bench-studio">
      {/* Studio Header & Track Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hairline pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="accent" variant="solid" className="text-body-xs font-mono font-bold tracking-wider">
              <Sparkles className="size-3.5 mr-1" /> INTERACTIVE BENCH STUDIO
            </Badge>
            <span className="text-caption font-mono text-fg-subtle">
              Inspired by ESP-Labs Companion Architecture
            </span>
          </div>
          <h2 className="font-display text-headline-sm sm:text-headline-md font-bold text-fg">
            Cyber-Physical Hardware Workbench & Simulation Engine
          </h2>
          <p className="text-body-sm text-fg-muted max-w-3xl">
            Live microcontroller emulation with simulated I2C OLED display, addressable NeoPixel, analog sensors, bidirectional Serial UART monitor, step-by-step firmware code execution, and hardware pinout multiplexer.
          </p>
        </div>

        {/* Track Selector Dropdown / Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider">
            Active Bench Lab:
          </span>
          <select
            value={selectedTrackId}
            onChange={(e) => handleTrackChange(e.target.value)}
            className="rounded-lg border border-accent/40 bg-surface-2 px-3 py-2 text-body-xs font-mono font-bold text-fg focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Select hardware bench track"
          >
            {BENCH_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs (Bench, Serial, Code Stepper, Pinout) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('bench')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'bench'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Cpu className="size-4" />
            <span>Interactive Hardware Bench</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('serial')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'serial'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Terminal className="size-4" />
            <span>Live Serial Monitor (UART0)</span>
            <span className="size-2 rounded-full bg-success animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Code2 className="size-4" />
            <span>Firmware Code Stepper</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pinout')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'pinout'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Layers className="size-4" />
            <span>Pinout & Multiplexing Matrix</span>
          </button>
        </div>

        {/* Quick Reset State Button */}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => handleTrackChange(selectedTrackId)}
          className="text-caption font-mono"
        >
          <RefreshCw className="size-3.5 mr-1" /> Reset Bench
        </Button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'bench' && (
        <div className="space-y-6">
          <BenchCanvas
            track={currentTrack}
            potVoltage={potVoltage}
            buttonState={buttonState}
            ledColor={ledColor}
            oledText={oledText}
            isLoopRunning={isLoopRunning}
            onPotChange={handlePotChange}
            onButtonPress={handleButtonPress}
            onButtonRelease={handleButtonRelease}
          />

          {/* Quick Dual-view preview of the Serial Monitor directly on the bench */}
          <div className="pt-2">
            <SerialMonitor
              track={currentTrack}
              logs={logs}
              potVoltage={potVoltage}
              onSendCommand={handleSendCommand}
              onClearLogs={() => setLogs([])}
            />
          </div>
        </div>
      )}

      {activeTab === 'serial' && (
        <SerialMonitor
          track={currentTrack}
          logs={logs}
          potVoltage={potVoltage}
          onSendCommand={handleSendCommand}
          onClearLogs={() => setLogs([])}
        />
      )}

      {activeTab === 'code' && (
        <CodeStepper
          track={currentTrack}
          activeLineIndex={activeLineIndex}
          onLineChange={setActiveLineIndex}
          onExecuteHardwareAction={handleExecuteHardwareAction}
        />
      )}

      {activeTab === 'pinout' && (
        <PinoutVisualizer track={currentTrack} />
      )}
    </div>
  );
}
