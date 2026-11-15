'use client';

import { useRef, useEffect, useState } from 'react';
import type { CircuitState, SpiceElement } from './circuitjs-engine';

export interface FalstadCanvasProps {
  circuitState: CircuitState;
  isPaused: boolean;
}

export function FalstadCanvas({ circuitState, isPaused }: FalstadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredElement, setHoveredElement] = useState<SpiceElement | null>(null);
  const dotOffsetRef = useRef(0);

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark Falstad background
      ctx.fillStyle = '#060910';
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update current dot animation offset
      if (!isPaused) {
        dotOffsetRef.current = (dotOffsetRef.current + 1.5) % 20;
      }

      // Helper to determine wire color based on voltage
      const getVoltageColor = (v: number) => {
        if (v > 0.5) return '#10b981'; // Positive: Emerald
        if (v < -0.5) return '#f43f5e'; // Negative: Rose
        return '#64748b'; // Near Ground: Slate
      };

      // Draw Main Circuit Loop Branches
      const vSource = circuitState.sourceWaveform;
      const vOut = circuitState.outputWaveform;

      // Left Rail (Source branch)
      ctx.strokeStyle = getVoltageColor(vSource);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 60);
      ctx.lineTo(80, 220);
      ctx.stroke();

      // Top Rail (Forward branch)
      ctx.strokeStyle = getVoltageColor(vSource);
      ctx.beginPath();
      ctx.moveTo(80, 60);
      ctx.lineTo(340, 60);
      ctx.stroke();

      // Load Branch (Right vertical)
      ctx.strokeStyle = getVoltageColor(vOut);
      ctx.beginPath();
      ctx.moveTo(340, 60);
      ctx.lineTo(340, 220);
      ctx.stroke();

      // Bottom Rail (Ground / Return)
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(340, 220);
      ctx.lineTo(80, 220);
      ctx.stroke();

      // Draw Falstad Animated Current Dots on Branches
      const drawCurrentDots = (x1: number, y1: number, x2: number, y2: number, currentA: number) => {
        if (Math.abs(currentA) < 0.0001) return; // Zero current -> no dots
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const numDots = Math.floor(dist / 16);

        ctx.fillStyle = '#fde047'; // Bright yellow electron dots
        for (let i = 0; i < numDots; i++) {
          const progress = ((i * 16 + dotOffsetRef.current) % dist) / dist;
          const px = x1 + dx * progress;
          const py = y1 + dy * progress;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const primaryCurrent = circuitState.elements[0]?.currentA ?? 0.05;
      drawCurrentDots(80, 220, 80, 60, primaryCurrent);
      drawCurrentDots(80, 60, 340, 60, primaryCurrent);
      drawCurrentDots(340, 60, 340, 220, primaryCurrent);
      drawCurrentDots(340, 220, 80, 220, primaryCurrent);

      // Draw Schematic Symbols
      // 1. AC / DC Source on Left Branch (at 80, 140)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = getVoltageColor(vSource);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(80, 140, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sine wave symbol inside source
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(68, 140);
      ctx.bezierCurveTo(74, 130, 74, 150, 80, 140);
      ctx.bezierCurveTo(86, 130, 86, 150, 92, 140);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${vSource.toFixed(1)}V`, 80, 175);

      // 2. Resistor / Diode Network on Top Branch (at 210, 60)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      // Draw zigzag resistor
      ctx.moveTo(180, 60);
      ctx.lineTo(187, 50);
      ctx.lineTo(195, 70);
      ctx.lineTo(203, 50);
      ctx.lineTo(211, 70);
      ctx.lineTo(219, 50);
      ctx.lineTo(227, 70);
      ctx.lineTo(235, 60);
      ctx.stroke();

      ctx.fillText('R_SERIES', 210, 42);

      // 3. Load / Filter on Right Branch (at 340, 140)
      // Parallel Capacitor Plates
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(325, 135);
      ctx.lineTo(355, 135);
      ctx.moveTo(325, 145);
      ctx.lineTo(355, 145);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`V_OUT: ${vOut.toFixed(2)}V`, 340, 175);

      // 4. Ground Symbol at (80, 240)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, 225);
      ctx.lineTo(90, 225);
      ctx.moveTo(74, 230);
      ctx.lineTo(86, 230);
      ctx.moveTo(78, 235);
      ctx.lineTo(82, 235);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [circuitState, isPaused]);

  return (
    <div className="relative rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-3" data-testid="falstad-canvas">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
            Falstad Visual Current & Voltage Animation Canvas
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-hairline text-accent font-mono">
            60 FPS Electron Flow
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-fg-subtle">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> +V (Positive)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" /> -V (Negative)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-yellow-300" /> Current Dots
          </span>
        </div>
      </div>

      <div className="relative rounded-lg border-2 border-hairline-strong overflow-hidden bg-[#060910] shadow-inner flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={580}
          height={260}
          className="w-full h-64 block cursor-crosshair"
          onClick={() => {
            const first = circuitState.elements[0];
            if (first) setHoveredElement(first);
          }}
        />

        {hoveredElement && (
          <div className="absolute bottom-3 left-3 rounded bg-surface-2/95 border border-accent p-2.5 font-mono text-caption text-fg space-y-1 shadow-lg">
            <div className="font-bold text-accent">{hoveredElement.label} ({hoveredElement.type})</div>
            <div>Voltage Drop: {hoveredElement.voltageDrop.toFixed(2)} V</div>
            <div>Current: {(hoveredElement.currentA * 1000).toFixed(1)} mA</div>
          </div>
        )}
      </div>
    </div>
  );
}
