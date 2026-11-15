'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import { Cpu, Zap, Info } from 'lucide-react';
import type { BenchTrack, BenchPin } from './bench-tracks-data';

export interface PinoutVisualizerProps {
  track: BenchTrack;
}

export function PinoutVisualizer({ track }: PinoutVisualizerProps) {
  const [selectedPin, setSelectedPin] = useState<BenchPin | null>(track.pins[0] ?? null);

  const getPinTypeBadge = (type: BenchPin['type']) => {
    switch (type) {
      case 'power':
        return <Badge tone="danger" variant="solid" className="text-[10px]">3.3V / 5V</Badge>;
      case 'ground':
        return <Badge tone="neutral" variant="solid" className="text-[10px]">GND</Badge>;
      case 'i2c':
        return <Badge tone="accent" variant="solid" className="text-[10px]">I2C BUS</Badge>;
      case 'spi':
        return <Badge tone="accent" variant="solid" className="text-[10px]">SPI BUS</Badge>;
      case 'uart':
        return <Badge tone="code" variant="solid" className="text-[10px]">UART TX/RX</Badge>;
      case 'analog':
        return <Badge tone="warning" variant="solid" className="text-[10px]">ADC 12-BIT</Badge>;
      default:
        return <Badge tone="neutral" variant="outline" className="text-[10px]">GPIO</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-5" data-testid="pinout-visualizer">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Interactive Pinout & Bus Multiplexing Matrix
          </h3>
        </div>
        <span className="text-caption font-mono text-fg-subtle">
          {track.targetMcu}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pin List Grid */}
        <div className="lg:col-span-7 space-y-2">
          <span className="text-[11px] font-mono text-fg-subtle uppercase tracking-wider block mb-1">
            Click Pin to Inspect Hardware Multiplexer:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {track.pins.map((pin) => {
              const isSelected = selectedPin?.pinNumber === pin.pinNumber;
              return (
                <button
                  key={pin.pinNumber}
                  type="button"
                  onClick={() => setSelectedPin(pin)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/15 ring-1 ring-accent'
                      : 'border-hairline bg-surface-2 hover:border-hairline-strong'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono text-caption font-bold text-fg">
                      <span className={pin.wireColor}>{pin.label}</span>
                      <span className="text-[10px] text-fg-subtle font-normal">({pin.gpio})</span>
                    </div>
                    <span className="text-[10px] text-fg-muted font-mono block truncate max-w-[150px]">
                      {pin.connectedTo || 'Unconnected'}
                    </span>
                  </div>

                  {getPinTypeBadge(pin.type)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Detailed Electrical Properties */}
        <div className="lg:col-span-5 rounded-lg border border-accent/30 bg-surface-2 p-4 flex flex-col justify-between space-y-4">
          {selectedPin ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-hairline/60 pb-2">
                <div>
                  <h4 className="font-display text-body-md font-bold text-fg">
                    {selectedPin.label} ({selectedPin.gpio})
                  </h4>
                  <span className="text-caption font-mono text-accent">
                    Pin #{selectedPin.pinNumber} on Header
                  </span>
                </div>
                {getPinTypeBadge(selectedPin.type)}
              </div>

              <div className="space-y-2 text-caption font-mono">
                <div className="flex justify-between border-b border-hairline/40 pb-1">
                  <span className="text-fg-subtle">Logic Level:</span>
                  <span className="text-fg font-bold">{selectedPin.voltage} (LVTTL)</span>
                </div>
                <div className="flex justify-between border-b border-hairline/40 pb-1">
                  <span className="text-fg-subtle">Breadboard Net:</span>
                  <span className="text-fg font-bold">{selectedPin.connectedTo || 'Floating'}</span>
                </div>
                <div className="flex justify-between border-b border-hairline/40 pb-1">
                  <span className="text-fg-subtle">Pull-up / Pull-down:</span>
                  <span className="text-success font-bold">Internal 45kΩ Software-Selectable</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-1 text-fg font-semibold text-caption font-display">
                  <Info className="size-3.5 text-accent" />
                  <span>Hardware Documentation:</span>
                </div>
                <p className="text-body-xs text-fg-muted leading-relaxed">
                  {selectedPin.description}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-caption text-fg-subtle italic">Select a pin to inspect electrical properties.</p>
          )}

          <div className="rounded border border-hairline bg-surface-1 p-2.5 text-[11px] text-fg-subtle flex items-center gap-2">
            <Zap className="size-3.5 text-warning shrink-0" />
            <span>ESD Protected to 2kV HBM. Operating temperature: -40°C to +105°C.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
