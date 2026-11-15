'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import { Cpu, Zap, Activity, Radio, Sliders } from 'lucide-react';
import type { BenchTrack } from './bench-tracks-data';

export interface BenchCanvasProps {
  track: BenchTrack;
  potVoltage: number;
  buttonState: boolean;
  ledColor: string;
  oledText: string;
  isLoopRunning: boolean;
  onPotChange: (voltage: number) => void;
  onButtonPress: () => void;
  onButtonRelease: () => void;
}

export function BenchCanvas({
  track,
  potVoltage,
  buttonState,
  ledColor,
  oledText,
  isLoopRunning,
  onPotChange,
  onButtonPress,
  onButtonRelease,
}: BenchCanvasProps) {
  const [wireHover, setWireHover] = useState<string | null>(null);

  // Calculate raw 12-bit ADC count (0 - 4095)
  const adcCount = Math.round((potVoltage / 3.3) * 4095);
  const gaugePercent = Math.min(100, Math.max(0, (potVoltage / 3.3) * 100));

  return (
    <div className="relative rounded-xl border border-hairline bg-surface-1 p-5 shadow-inner overflow-hidden select-none" data-testid="bench-canvas">
      {/* Bench Header & Live Diagnostics */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-accent/15 border border-accent/30 text-accent">
            <Cpu className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-body-md font-bold text-fg">{track.targetMcu}</h3>
              <Badge tone="accent" variant="solid" className="text-[10px]">
                {track.clockSpeed}
              </Badge>
            </div>
            <p className="text-caption text-fg-muted font-mono">{track.protocols.join(' • ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-caption font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-hairline text-fg-muted">
            <span
              className={`size-2 rounded-full transition-colors ${
                isLoopRunning ? 'bg-success animate-pulse' : 'bg-fg-subtle'
              }`}
            />
            {isLoopRunning ? 'RUNNING (8kHz FreeRTOS)' : 'HALTED'}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-hairline text-accent">
            <Zap className="size-3" /> 3.30V RAIL OK
          </span>
        </div>
      </div>

      {/* Virtual Hardware Electronics Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Microcontroller Unit (MCU Board) */}
        <div className="lg:col-span-5 rounded-lg border border-accent/30 bg-surface-2/80 p-4 relative flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-hairline/60 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-caption font-mono font-bold text-fg">ESP32-S3 CORE BOARD</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-1 border border-hairline text-fg-subtle font-mono">
                Rev 1.2
              </span>
            </div>
            {/* Heartbeat Status LED */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-fg-subtle">STAT:</span>
              <span
                className={`size-2.5 rounded-full transition-all ${
                  isLoopRunning ? 'bg-accent shadow-[0_0_8px_var(--color-accent)] animate-ping' : 'bg-fg-subtle'
                }`}
              />
            </div>
          </div>

          {/* Microcontroller Chip Body */}
          <div className="relative my-2 mx-auto w-48 h-36 rounded-md bg-canvas border border-hairline-strong flex flex-col items-center justify-center p-3 shadow-md">
            {/* Chip Notch */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-b-full bg-surface-2" />

            <div className="text-center space-y-1">
              <span className="font-display text-body-xs font-bold tracking-widest text-fg-muted block">
                ESPRESSIF
              </span>
              <span className="font-mono text-caption font-bold text-accent block">
                ESP32-S3-WROOM-1
              </span>
              <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-fg-subtle pt-1">
                <span>WiFi 4</span>
                <span>•</span>
                <span>BLE 5.0</span>
                <span>•</span>
                <span>Xtensa LX7</span>
              </div>
            </div>

            {/* Chip Pin Outlines */}
            <div className="absolute -left-1.5 top-6 bottom-6 flex flex-col justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1 bg-warning rounded-l-sm" />
              ))}
            </div>
            <div className="absolute -right-1.5 top-6 bottom-6 flex flex-col justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-1 bg-warning rounded-r-sm" />
              ))}
            </div>
          </div>

          {/* Onboard WS2812B Addressable Smart LED */}
          <div className="mt-3 pt-3 border-t border-hairline/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-caption font-mono font-semibold text-fg block">WS2812B NeoPixel</span>
              <span className="text-[10px] text-fg-subtle font-mono">GPIO 48 (NZR 800kHz)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-fg-muted">{ledColor}</span>
              <div
                className="size-6 rounded-full border border-hairline transition-all duration-300"
                style={{
                  backgroundColor: ledColor,
                  boxShadow: `0 0 14px ${ledColor}`,
                }}
                title={`NeoPixel Color: ${ledColor}`}
              />
            </div>
          </div>
        </div>

        {/* Modular Breadboard Peripherals Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Virtual SSD1306 Monochrome 128x64 OLED Display Screen */}
          <div className="rounded-lg border border-hairline bg-surface-2 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-accent" />
                <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
                  SSD1306 0.96&quot; OLED (128x64 I2C 0x3C)
                </span>
              </div>
              <span className="text-[10px] font-mono text-fg-subtle">400 kHz Fast-Mode</span>
            </div>

            {/* OLED Glass Panel Viewport */}
            <div className="w-full h-32 rounded bg-canvas border-2 border-hairline-strong p-3 font-mono text-accent relative overflow-hidden flex flex-col justify-between shadow-inner">
              {/* Scanline CRT overlay effect */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between border-b border-accent/30 pb-1 text-[11px] font-bold">
                  <span>{oledText || 'HACKERLAND ESP32-S3'}</span>
                  <span className="text-fg-subtle text-[10px]">20 FPS</span>
                </div>
                <div className="text-[11px] text-fg-muted flex items-center justify-between pt-0.5">
                  <span>ADC1_CH0 (GPIO 1):</span>
                  <span className="text-accent font-bold">{potVoltage.toFixed(2)}V ({adcCount})</span>
                </div>
                <div className="text-[10px] text-fg-subtle flex items-center justify-between">
                  <span>BOOT_BTN (GPIO 0):</span>
                  <span className={buttonState ? 'text-error font-bold' : 'text-success'}>
                    {buttonState ? 'PRESSED (LOW)' : 'RELEASED (HIGH)'}
                  </span>
                </div>
              </div>

              {/* Dynamic Voltage Bar Gauge */}
              <div className="relative z-10 pt-1 space-y-1">
                <div className="w-full h-3 rounded-xs border border-accent/40 bg-surface-1/60 p-0.5 flex items-center">
                  <div
                    className="h-full bg-accent rounded-2xs transition-all duration-75"
                    style={{ width: `${gaugePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-fg-subtle">
                  <span>0.0V</span>
                  <span>1.65V</span>
                  <span>3.30V</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Bench Controls: Potentiometer Dial & Tactile Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 10k Precision Analog Potentiometer */}
            <div className="rounded-lg border border-hairline bg-surface-2 p-3.5 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sliders className="size-4 text-warning" />
                  <span className="text-caption font-display font-semibold text-fg">10kΩ Potentiometer</span>
                </div>
                <span className="font-mono text-caption text-warning font-bold">
                  {potVoltage.toFixed(2)}V
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max="3.3"
                  step="0.01"
                  value={potVoltage}
                  onChange={(e) => onPotChange(parseFloat(e.target.value))}
                  className="w-full accent-warning cursor-pointer h-2 bg-surface-1 rounded border border-hairline"
                  aria-label="Potentiometer analog voltage slider"
                />
                <div className="flex justify-between text-[10px] font-mono text-fg-subtle">
                  <span>0.00V (GND)</span>
                  <span>3.30V (VCC)</span>
                </div>
              </div>
              <p className="text-[11px] text-fg-muted">
                Drives ADC1_CH0 input pin with calibrated resistive voltage divider.
              </p>
            </div>

            {/* Tactile Momentary Pushbutton */}
            <div className="rounded-lg border border-hairline bg-surface-2 p-3.5 flex flex-col justify-between space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Radio className="size-4 text-accent" />
                  <span className="text-caption font-display font-semibold text-fg">Tactile Pushbutton</span>
                </div>
                <span className={`font-mono text-caption font-bold ${buttonState ? 'text-error' : 'text-success'}`}>
                  {buttonState ? 'ACTIVE' : 'IDLE'}
                </span>
              </div>

              <div className="flex items-center justify-center py-1">
                <button
                  type="button"
                  onMouseDown={onButtonPress}
                  onMouseUp={onButtonRelease}
                  onTouchStart={onButtonPress}
                  onTouchEnd={onButtonRelease}
                  className={`size-12 rounded-full border-2 transition-all transform flex items-center justify-center font-mono text-[10px] font-bold ${
                    buttonState
                      ? 'border-error bg-error/20 text-error scale-95 shadow-inner'
                      : 'border-accent bg-accent/15 text-accent hover:bg-accent/25 active:scale-90 shadow-md'
                  }`}
                  aria-label="Tactile pushbutton 1"
                >
                  {buttonState ? 'GND' : '3V3'}
                </button>
              </div>

              <p className="text-[11px] text-fg-muted text-center">
                Press and hold to pull GPIO 0 to GND (Triggers active-low ISR).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Breadboard Wire Connections Summary */}
      <div className="mt-5 pt-4 border-t border-hairline">
        <span className="text-[11px] font-mono font-semibold text-fg-subtle uppercase tracking-wider block mb-2">
          Physical Wiring Matrix (Breadboard Jumpers):
        </span>
        <div className="flex flex-wrap gap-2 text-caption font-mono">
          {track.pins.map((pin) => (
            <div
              key={pin.pinNumber}
              onMouseEnter={() => setWireHover(pin.label)}
              onMouseLeave={() => setWireHover(null)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-default ${
                wireHover === pin.label
                  ? 'border-accent bg-accent/20 text-fg'
                  : 'border-hairline bg-surface-2 text-fg-muted'
              }`}
            >
              <span className={`font-bold ${pin.wireColor}`}>{pin.label}</span>
              <span className="text-fg-subtle">→</span>
              <span>{pin.connectedTo || pin.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
