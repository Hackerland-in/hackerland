'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@hackerland/ui';
import { Activity, Play, Pause, RotateCcw } from 'lucide-react';

export interface OscilloscopeProps {
  waveformHistory: number[]; // Array of voltage samples (0 - 15V)
  frequencyHz?: number;
  timeDivMs: number;
  voltsDiv: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onTimeDivChange: (val: number) => void;
  onVoltsDivChange: (val: number) => void;
}

export function Oscilloscope({
  waveformHistory,
  frequencyHz,
  timeDivMs,
  voltsDiv,
  isPaused,
  onTogglePause,
  onReset,
  onTimeDivChange,
  onVoltsDivChange,
}: OscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute live scope metrics
  const vMax = waveformHistory.length > 0 ? Math.max(...waveformHistory) : 0;
  const vMin = waveformHistory.length > 0 ? Math.min(...waveformHistory) : 0;
  const vPp = +(vMax - vMin).toFixed(2);
  const vRms = +(Math.sqrt(waveformHistory.reduce((s, v) => s + v * v, 0) / Math.max(1, waveformHistory.length))).toFixed(2);

  // Draw Grid and Waveform on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid (10 horizontal divisions, 8 vertical divisions)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Vertical grid lines
    const colWidth = width / 10;
    for (let x = 0; x <= width; x += colWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    const rowHeight = height / 8;
    for (let y = 0; y <= height; y += rowHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Center Crosshairs
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Trace CH1 (Phosphor Neon Emerald)
    if (waveformHistory.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const dx = width / Math.max(1, waveformHistory.length - 1);
      const zeroY = height - 20; // Ground line near bottom

      waveformHistory.forEach((voltage, i) => {
        const x = i * dx;
        // Scale voltage to pixels: each vertical div is rowHeight pixels
        const y = zeroY - (voltage / voltsDiv) * rowHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
      ctx.shadowBlur = 0; // Reset blur
    }
  }, [waveformHistory, voltsDiv]);

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="digital-oscilloscope">
      {/* Scope Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Digital Storage Oscilloscope (CH1)
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
            isPaused ? 'bg-warning/20 text-warning border border-warning/40' : 'bg-success/20 text-success border border-success/40'
          }`}>
            {isPaused ? 'HOLD / PAUSED' : 'AUTO TRIGGER'}
          </span>
        </div>

        {/* Oscilloscope Controls */}
        <div className="flex items-center gap-2">
          {/* Volts / Div */}
          <div className="flex items-center gap-1 font-mono text-caption">
            <span className="text-fg-subtle text-[11px]">V/Div:</span>
            <select
              value={voltsDiv}
              onChange={(e) => onVoltsDivChange(parseFloat(e.target.value))}
              className="rounded border border-hairline bg-surface-2 px-2 py-1 text-fg text-caption focus:outline-none focus:border-accent"
              aria-label="Volts per division"
            >
              <option value="0.5">0.5 V</option>
              <option value="1.0">1.0 V</option>
              <option value="2.0">2.0 V</option>
              <option value="5.0">5.0 V</option>
            </select>
          </div>

          {/* Time / Div */}
          <div className="flex items-center gap-1 font-mono text-caption">
            <span className="text-fg-subtle text-[11px]">Time/Div:</span>
            <select
              value={timeDivMs}
              onChange={(e) => onTimeDivChange(parseInt(e.target.value))}
              className="rounded border border-hairline bg-surface-2 px-2 py-1 text-fg text-caption focus:outline-none focus:border-accent"
              aria-label="Time per division"
            >
              <option value="50">50 ms</option>
              <option value="100">100 ms</option>
              <option value="200">200 ms</option>
              <option value="500">500 ms</option>
            </select>
          </div>

          <Button
            type="button"
            variant={isPaused ? 'primary' : 'secondary'}
            size="sm"
            onClick={onTogglePause}
            className="text-caption font-mono"
            aria-label={isPaused ? 'Resume oscilloscope trace' : 'Pause oscilloscope trace'}
          >
            {isPaused ? <Play className="size-3.5 mr-1" /> : <Pause className="size-3.5 mr-1" />}
            {isPaused ? 'Run' : 'Stop'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="text-caption font-mono"
            aria-label="Reset trace buffer"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Screen Viewport */}
      <div className="relative rounded-lg border-2 border-hairline-strong bg-[#090d16] p-2 overflow-hidden shadow-inner flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={240}
          className="w-full h-56 rounded block"
        />

        {/* Live CRT On-Screen Telemetry Overlays */}
        <div className="absolute top-4 left-4 font-mono text-[11px] text-[#10b981] space-y-0.5 pointer-events-none drop-shadow">
          <div>CH1: {voltsDiv.toFixed(1)}V/div DC</div>
          <div>TB: {timeDivMs}ms/div</div>
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[11px] text-right text-[#10b981] space-y-0.5 pointer-events-none drop-shadow">
          <div>Vpp: {vPp}V | Vrms: {vRms}V</div>
          <div>Vmax: {vMax.toFixed(2)}V | Vmin: {vMin.toFixed(2)}V</div>
          {frequencyHz !== undefined && frequencyHz > 0 && (
            <div className="text-warning font-bold">Freq: {frequencyHz} Hz</div>
          )}
        </div>
      </div>
    </div>
  );
}
