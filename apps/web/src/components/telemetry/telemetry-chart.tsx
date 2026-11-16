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
  // Enabled channels map (by default show first 3 channels)
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
      <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-800 bg-stone-950 p-6 text-stone-500 font-mono text-xs">
        No active channels selected or no samples recorded.
      </div>
    );
  }

  // Chart dimensions
  const width = 800;
  const height = 260;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute global min and max among all currently visible channels
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

  // Add 10% breathing room on top and bottom
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

  // Playhead scrubber position
  const scrubberX = getX(currentIndex);

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm">
      {/* Channel toggle chips */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-stone-400 mr-2">CHANNELS:</span>
        {channels.map((ch) => {
          const isActive = activeChannels[ch.id] ?? false;
          return (
            <button
              key={ch.id}
              onClick={() => toggleChannel(ch.id)}
              className={`inline-flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono transition-all ${
                isActive
                  ? 'border-stone-700 bg-stone-800 text-white shadow-sm'
                  : 'border-stone-800 bg-stone-900/40 text-stone-500 hover:text-stone-300'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isActive ? ch.color : '#525252' }}
              />
              <span>{ch.name}</span>
              <span className="text-[10px] text-stone-400">({ch.unit})</span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
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
          {/* Background Grid Lines */}
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
                  stroke="#262626"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#737373"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {valueAtY.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Time axis labels */}
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
                fill="#737373"
                fontSize="10"
                fontFamily="monospace"
              >
                {timeSec}s
              </text>
            );
          })}

          {/* Traces for visible channels */}
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points.join(' ')}
              />
            );
          })}

          {/* Current scrubber playback line */}
          <line
            x1={scrubberX}
            y1={paddingTop}
            x2={scrubberX}
            y2={height - paddingBottom}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Scrubber pointer circle on active traces */}
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
                stroke="#171717"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Live readout strip below chart */}
      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-stone-800/80 pt-3">
        <span className="text-xs font-mono text-stone-400">
          T: <strong className="text-white">{((samples[currentIndex]?.timestampMs ?? 0) / 1000).toFixed(1)}s</strong>
        </span>
        {visibleChannels.map((ch) => {
          const val = samples[currentIndex]?.values[ch.id];
          return (
            <div key={`readout-${ch.id}`} className="flex items-center space-x-1.5 text-xs font-mono">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ch.color }} />
              <span className="text-stone-400">{ch.name}:</span>
              <span className="font-bold text-white">
                {val !== undefined ? val.toFixed(2) : '--'} {ch.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
