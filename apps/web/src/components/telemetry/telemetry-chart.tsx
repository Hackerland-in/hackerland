'use client';

import { useState } from 'react';
import type { TelemetryChannelConfig, TelemetrySample } from '@hackerland/core';

interface TelemetryChartProps {
  channels: TelemetryChannelConfig[];
  samples: TelemetrySample[];
  currentIndex: number;
  onSelectIndex?: (index: number) => void;
}

export function TelemetryChart({
  channels,
  samples,
  currentIndex,
  onSelectIndex,
}: TelemetryChartProps) {
  const [activeChannels, setActiveChannels] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    channels.forEach((ch, idx) => {
      init[ch.id] = idx < 3;
    });
    return init;
  });

  const toggleChannel = (chId: string) => {
    setActiveChannels((prev) => ({
      ...prev,
      [chId]: !prev[chId],
    }));
  };

  const visibleChannels = channels.filter((ch) => activeChannels[ch.id]);

  if (samples.length === 0 || visibleChannels.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-hairline bg-surface-1 p-6 text-fg-subtle font-mono text-xs">
        No active channels selected or no samples recorded.
      </div>
    );
  }

  const width = 800;
  const height = 260;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  let globalMin = Number.POSITIVE_INFINITY;
  let globalMax = Number.NEGATIVE_INFINITY;

  for (const ch of visibleChannels) {
    for (const s of samples) {
      const val = s.values[ch.id];
      if (val !== undefined && !Number.isNaN(val)) {
        if (val < globalMin) globalMin = val;
        if (val > globalMax) globalMax = val;
      }
    }
  }

  if (globalMin === Number.POSITIVE_INFINITY || globalMax === Number.NEGATIVE_INFINITY) {
    globalMin = 0;
    globalMax = 100;
  }

  const range = globalMax - globalMin || 1;
  const yMin = globalMin - range * 0.1;
  const yMax = globalMax + range * 0.1;
  const effectiveRange = yMax - yMin;

  const getX = (index: number) => {
    if (samples.length <= 1) return paddingLeft;
    return paddingLeft + (index / (samples.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - yMin) / effectiveRange) * chartHeight;
  };

  const scrubberX = getX(currentIndex);

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs">
      {/* Channel toggles */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono font-semibold text-fg-muted mr-2">CHANNELS:</span>
        {channels.map((ch) => {
          const isActive = activeChannels[ch.id] ?? false;
          return (
            <button
              type="button"
              key={ch.id}
              onClick={() => toggleChannel(ch.id)}
              className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-mono transition-all ${
                isActive
                  ? 'border-accent/40 bg-accent-soft text-fg font-semibold shadow-xs'
                  : 'border-hairline bg-sunken text-fg-subtle hover:text-fg'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: isActive ? ch.color : '#cbd5e1' }}
              />
              <span>{ch.name}</span>
              <span className="text-[10px] text-fg-muted">({ch.unit})</span>
            </button>
          );
        })}
      </div>

      {/* Scientific SVG Waveform Plot */}
      <div className="relative w-full overflow-hidden rounded-xl border border-hairline bg-sunken/60 p-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onClick={(e) => {
            if (!onSelectIndex || samples.length <= 1) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = (clickX / rect.width) * width;
            const adjustedRatio = Math.max(0, Math.min(1, (ratio - paddingLeft) / chartWidth));
            const newIndex = Math.round(adjustedRatio * (samples.length - 1));
            onSelectIndex(newIndex);
          }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * chartHeight;
            const valueAtY = yMax - ratio * effectiveRange;
            return (
              <g key={`grid-y-${ratio}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e5d5de"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {valueAtY.toFixed(1)}
                </text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const idx = Math.min(samples.length - 1, Math.round(ratio * (samples.length - 1)));
            const s = samples[idx];
            const x = getX(idx);
            const timeSec = s ? (s.timestampMs / 1000).toFixed(0) : '0';
            return (
              <text
                key={`grid-x-${ratio}`}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {timeSec}s
              </text>
            );
          })}

          {visibleChannels.map((ch) => {
            const points: string[] = [];
            samples.forEach((s, i) => {
              const val = s.values[ch.id];
              if (val !== undefined && !Number.isNaN(val)) {
                points.push(`${getX(i)},${getY(val)}`);
              }
            });

            if (points.length === 0) return null;

            return (
              <polyline
                key={`line-${ch.id}`}
                fill="none"
                stroke={ch.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points.join(' ')}
              />
            );
          })}

          {/* Scrubber Playback Cursor */}
          <line
            x1={scrubberX}
            y1={paddingTop}
            x2={scrubberX}
            y2={height - paddingBottom}
            stroke="#e11d74"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {visibleChannels.map((ch) => {
            const currentSample = samples[currentIndex];
            if (!currentSample) return null;
            const val = currentSample.values[ch.id];
            if (val === undefined || Number.isNaN(val)) return null;

            return (
              <circle
                key={`point-${ch.id}`}
                cx={scrubberX}
                cy={getY(val)}
                r="4.5"
                fill={ch.color}
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Live readout strip */}
      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-hairline pt-3">
        <span className="text-xs font-mono text-fg-muted">
          T: <strong className="text-fg">{((samples[currentIndex]?.timestampMs ?? 0) / 1000).toFixed(1)}s</strong>
        </span>
        {visibleChannels.map((ch) => {
          const val = samples[currentIndex]?.values[ch.id];
          return (
            <div key={`readout-${ch.id}`} className="flex items-center space-x-1.5 text-xs font-mono">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
              <span className="text-fg-muted">{ch.name}:</span>
              <span className="font-bold text-fg">
                {val !== undefined ? val.toFixed(2) : '--'} {ch.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
