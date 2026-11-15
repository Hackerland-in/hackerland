'use client';

import { useState } from 'react';
import type { HdlSignal } from './hdl-engine';
import { ZoomIn, ZoomOut, Clock } from 'lucide-react';

export interface HdlWaveformViewerProps {
  signals: HdlSignal[];
  totalTimeNs: number;
}

export function HdlWaveformViewer({ signals, totalTimeNs }: HdlWaveformViewerProps) {
  const [cursorTimeNs, setCursorTimeNs] = useState(35);
  const [zoomScale, setZoomScale] = useState(1.0);

  // Time markers every 20ns
  const timeMarkers = [];
  for (let t = 0; t <= totalTimeNs; t += 20) {
    timeMarkers.push(t);
  }

  // Calculate signal value at cursor time
  const getSignalValueAt = (sig: HdlSignal, time: number) => {
    // Find closest point <= time
    const matches = sig.history.filter((h) => h.timeNs <= time);
    if (matches.length > 0) {
      return matches[matches.length - 1]!.value;
    }
    return sig.history[0]?.value ?? '-';
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.min(1, Math.max(0, clickX / rect.width));
    const newTime = Math.round(progress * totalTimeNs);
    setCursorTimeNs(newTime);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4 select-none" data-testid="hdl-waveform-viewer">
      {/* Waveform Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Digital Logic Waveform Viewer (GTKWave / ModelSim Style)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-hairline text-accent font-mono">
            IEEE 1364 Timebase
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-caption">
          {/* Cursor readout */}
          <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-2 border border-accent/40 text-accent font-bold">
            Cursor: {cursorTimeNs} ns
          </span>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.max(0.6, z - 0.2))}
              className="p-1 rounded border border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-[11px] text-fg-subtle">{zoomScale.toFixed(1)}x</span>
            <button
              type="button"
              onClick={() => setZoomScale((z) => Math.min(2.0, z + 0.2))}
              className="p-1 rounded border border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Waveform Grid Viewport */}
      <div className="rounded-lg border border-hairline-strong bg-canvas p-3 font-mono text-caption overflow-x-auto shadow-inner">
        <div className="min-w-[640px] space-y-3">
          {/* Time Graduation Axis */}
          <div className="grid grid-cols-12 gap-2 border-b border-hairline/60 pb-1 text-[10px] text-fg-subtle">
            <div className="col-span-3 font-bold text-fg-muted">SIGNAL / RADIX</div>
            <div
              className="col-span-9 relative h-4 cursor-crosshair"
              onClick={handleTimelineClick}
            >
              {timeMarkers.map((time) => {
                const leftPercent = (time / totalTimeNs) * 100;
                return (
                  <span
                    key={time}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${leftPercent}%` }}
                  >
                    {time}ns
                  </span>
                );
              })}
            </div>
          </div>

          {/* Signals Rows */}
          <div className="space-y-3 relative">
            {signals.map((sig) => {
              const currentValue = getSignalValueAt(sig, cursorTimeNs);
              return (
                <div key={sig.name} className="grid grid-cols-12 gap-2 items-center text-body-xs">
                  {/* Left Column: Signal Name, Width & Current Value */}
                  <div className="col-span-3 flex items-center justify-between pr-3 border-r border-hairline/60">
                    <span className="font-bold text-fg truncate" title={sig.name}>
                      {sig.name}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-2 text-accent font-bold">
                      {currentValue}
                    </span>
                  </div>

                  {/* Right Column: Waveform Graphic Canvas */}
                  <div
                    className="col-span-9 relative h-8 bg-surface-1/40 rounded border border-hairline/40 flex items-center px-1 cursor-crosshair overflow-hidden"
                    onClick={handleTimelineClick}
                  >
                    {/* Render Waveform Segments */}
                    {sig.isBus ? (
                      // Multi-bit Bus Representation (Hexagonal Cells)
                      <div className="w-full h-full flex items-center relative">
                        {sig.history.map((pt, idx) => {
                          const nextPt = sig.history[idx + 1];
                          const startLeft = (pt.timeNs / totalTimeNs) * 100;
                          const width = nextPt
                            ? ((nextPt.timeNs - pt.timeNs) / totalTimeNs) * 100
                            : 100 - startLeft;

                          return (
                            <div
                              key={idx}
                              className="absolute top-1 bottom-1 border-x border-accent/60 bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent truncate px-1"
                              style={{ left: `${startLeft}%`, width: `${width}%` }}
                              title={`${sig.name} = ${pt.value} at ${pt.timeNs}ns`}
                            >
                              {width > 6 ? pt.value : ''}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // 1-Bit Binary Waveform (Square Transitions)
                      <div className="w-full h-full relative">
                        {sig.history.map((pt, idx) => {
                          const nextPt = sig.history[idx + 1];
                          const startLeft = (pt.timeNs / totalTimeNs) * 100;
                          const width = nextPt
                            ? ((nextPt.timeNs - pt.timeNs) / totalTimeNs) * 100
                            : 100 - startLeft;

                          const isHigh = pt.value === 1 || pt.value === '1';

                          return (
                            <div
                              key={idx}
                              className={`absolute border-t-2 transition-all ${
                                isHigh ? 'top-1.5 border-emerald-400' : 'bottom-1.5 border-slate-500'
                              }`}
                              style={{ left: `${startLeft}%`, width: `${width}%` }}
                            >
                              {/* Vertical transition edge line */}
                              {idx > 0 && sig.history[idx - 1]?.value !== pt.value && (
                                <div className="absolute -left-[1px] -top-1 bottom-0 w-[2px] h-5 bg-emerald-400/80" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Interactive Cursor Vertical Marker Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_8px_var(--color-accent)] pointer-events-none z-10"
              style={{
                left: `calc(25% + ${(cursorTimeNs / totalTimeNs) * 75}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
