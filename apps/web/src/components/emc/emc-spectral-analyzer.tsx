'use client';

import { useState } from 'react';
import type { SpectralDataPoint } from '@hackerland/core';
import { evaluateEmcCompliance } from '@hackerland/core';

interface EmcSpectralAnalyzerProps {
  spectralTrace: SpectralDataPoint[];
  standardTitle: string;
}

export function EmcSpectralAnalyzer({
  spectralTrace,
  standardTitle,
}: EmcSpectralAnalyzerProps) {
  const [hoveredPoint, setHoveredPoint] = useState<SpectralDataPoint | null>(null);

  const evaluation = evaluateEmcCompliance(spectralTrace);

  // SVG Dimensioning
  const width = 640;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // X range: log scale or min/max
  const minFreq = Math.min(...spectralTrace.map((p) => p.frequencyMHz));
  const maxFreq = Math.max(...spectralTrace.map((p) => p.frequencyMHz));

  // Y range: 0 to max amplitude + 20 dB
  const maxY = Math.max(...spectralTrace.map((p) => Math.max(p.amplitudeDbuV, p.limitDbuV))) + 15;
  const minY = 0;

  const getX = (freq: number) => {
    // Semi-logarithmic or normalized linear mapping for broad spectrum
    if (minFreq === maxFreq) return paddingLeft + chartW / 2;
    const progress = (freq - minFreq) / (maxFreq - minFreq);
    return paddingLeft + progress * chartW;
  };

  const getY = (val: number) => {
    const progress = (val - minY) / (maxY - minY);
    return paddingTop + chartH - progress * chartH;
  };

  // Build path strings
  const tracePath = spectralTrace
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(pt.frequencyMHz)} ${getY(pt.amplitudeDbuV)}`)
    .join(' ');

  const limitPath = spectralTrace
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(pt.frequencyMHz)} ${getY(pt.limitDbuV)}`)
    .join(' ');

  const areaPath = `${tracePath} L ${getX(spectralTrace[spectralTrace.length - 1]!.frequencyMHz)} ${getY(minY)} L ${getX(spectralTrace[0]!.frequencyMHz)} ${getY(minY)} Z`;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            Rohde & Schwarz Spectrum Receiver Pre-Scan
          </span>
          <h3 className="text-base font-bold text-foreground mt-0.5">
            Measured Emissions vs {standardTitle}
          </h3>
        </div>

        {/* Compliance Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
              evaluation.isCompliant
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                evaluation.isCompliant ? 'bg-emerald-500' : 'bg-destructive animate-pulse'
              }`}
            />
            {evaluation.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Worst Margin: <strong className={evaluation.worstMarginDb >= 3 ? 'text-emerald-400' : 'text-amber-400'}>{evaluation.worstMarginDb} dB</strong>
          </span>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="relative flex items-center justify-center p-2 bg-background/80 rounded-xl border border-border/80 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Grid lines */}
          {[0, 20, 40, 60, 80].filter((v) => v <= maxY).map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth={0.8}
                  strokeDasharray="2,2"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize={9}
                  fill="rgba(148, 163, 184, 0.8)"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill under measured trace */}
          <path d={areaPath} fill="rgba(6, 182, 212, 0.1)" />

          {/* Limit Curve (Red Dashed) */}
          <path
            d={limitPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth={1.8}
            strokeDasharray="4,3"
          />

          {/* Measured Emission Curve (Cyan Solid) */}
          <path
            d={tracePath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth={2.2}
          />

          {/* Data Points / Markers */}
          {spectralTrace.map((pt, idx) => {
            const cx = getX(pt.frequencyMHz);
            const cy = getY(pt.amplitudeDbuV);
            const isViolating = pt.amplitudeDbuV > pt.limitDbuV;
            const isHovered = hoveredPoint?.frequencyMHz === pt.frequencyMHz;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : isViolating ? 5 : 3.5}
                  fill={isViolating ? '#ef4444' : '#06b6d4'}
                  stroke="#ffffff"
                  strokeWidth={1.2}
                  className="transition-all"
                />
              </g>
            );
          })}

          {/* X Axis labels */}
          {spectralTrace.map((pt, idx) => {
            const cx = getX(pt.frequencyMHz);
            return (
              <text
                key={idx}
                x={cx}
                y={height - 12}
                textAnchor="middle"
                fontSize={8.5}
                fill="rgba(148, 163, 184, 0.8)"
                fontFamily="monospace"
              >
                {pt.frequencyMHz >= 10 ? Math.round(pt.frequencyMHz) : pt.frequencyMHz.toFixed(1)}M
              </text>
            );
          })}

          {/* Axis Titles */}
          <text
            x={width / 2}
            y={height - 1}
            textAnchor="middle"
            fontSize={9.5}
            fill="rgba(148, 163, 184, 0.9)"
            fontFamily="monospace"
            className="font-bold uppercase"
          >
            Frequency (MHz)
          </text>
          <text
            x={14}
            y={height / 2}
            textAnchor="middle"
            fontSize={9.5}
            fill="rgba(148, 163, 184, 0.9)"
            fontFamily="monospace"
            transform={`rotate(-90, 14, ${height / 2})`}
            className="font-bold uppercase"
          >
            Amplitude (dBµV)
          </text>
        </svg>

        {/* Hovered Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-card/95 border border-primary/40 rounded-lg p-2.5 shadow-xl font-mono text-[11px] space-y-0.5 backdrop-blur-md pointer-events-none animate-in fade-in duration-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                {hoveredPoint.frequencyMHz} MHz
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  hoveredPoint.amplitudeDbuV <= hoveredPoint.limitDbuV
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {hoveredPoint.amplitudeDbuV <= hoveredPoint.limitDbuV ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="text-muted-foreground space-y-0.5 text-[10px]">
              <div>Measured: <strong className="text-foreground">{hoveredPoint.amplitudeDbuV} dBµV</strong></div>
              <div>Statutory Limit: <strong className="text-destructive">{hoveredPoint.limitDbuV} dBµV</strong></div>
              <div>
                Margin:{' '}
                <strong
                  className={
                    hoveredPoint.limitDbuV - hoveredPoint.amplitudeDbuV >= 0
                      ? 'text-emerald-400'
                      : 'text-destructive'
                  }
                >
                  {(hoveredPoint.limitDbuV - hoveredPoint.amplitudeDbuV).toFixed(1)} dB
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#06b6d4]" />
            <span className="text-muted-foreground">Measured Emission (Quasi-Peak)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#ef4444] border-dashed border-t" />
            <span className="text-muted-foreground">{standardTitle} Limit Line</span>
          </div>
        </div>

        <span className="text-muted-foreground text-[11px]">
          Bandwidth: 9 kHz (150k-30M) / 120 kHz (30M-1G)
        </span>
      </div>
    </div>
  );
}
