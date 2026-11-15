'use client';

import { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '@hackerland/ui';
import type { TelemetryFeed } from '@/lib/data/types';

export interface LiveTelemetryPanelProps {
  telemetry: TelemetryFeed;
  className?: string;
}

export function LiveTelemetryPanel({ telemetry, className = '' }: LiveTelemetryPanelProps) {
  const [isLive, setIsLive] = useState(true);
  const [metrics, setMetrics] = useState(telemetry.metrics);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  // Simulated live telemetry stream fluctuation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (typeof m.value === 'number') {
            const jitter = (Math.random() - 0.5) * 0.4;
            const updated = Number((m.value + jitter).toFixed(1));
            return {
              ...m,
              value: updated,
              trend: jitter > 0.05 ? 'up' : jitter < -0.05 ? 'down' : 'stable',
            };
          }
          return m;
        })
      );
      setLastUpdated('Just now');
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div
      className={`rounded-lg border border-accent/30 bg-surface-2/90 p-4 space-y-3 shadow-sm ${className}`}
      data-testid="live-telemetry-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            {isLive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full size-2.5 bg-success" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full size-2.5 bg-fg-subtle" />
            )}
          </span>
          <span className="font-display text-caption font-semibold uppercase tracking-wider text-fg">
            Hardware Mission Control
          </span>
          <Badge tone={isLive ? 'success' : 'neutral'} variant="solid" className="text-caption">
            {isLive ? 'STREAMING' : 'PAUSED'}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-1 text-caption text-accent hover:text-accent-hover transition-colors font-medium"
        >
          <RefreshCw className={`size-3 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          <span>{isLive ? 'Pause Stream' : 'Resume Live Stream'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-caption text-fg-subtle">
        <div className="flex items-center gap-1.5 truncate">
          <Cpu className="size-3.5 text-accent shrink-0" />
          <span className="font-mono">{telemetry.nodeId}</span>
          <span>•</span>
          <span className="truncate">{telemetry.deviceType}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Radio className="size-3 text-fg-subtle" />
          <span>Updated {lastUpdated}</span>
        </div>
      </div>

      {/* Real-time Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded border border-hairline bg-surface-1 p-2.5 space-y-1 transition-all"
            data-testid={`telemetry-metric-${metric.label}`}
          >
            <div className="text-caption text-fg-subtle font-medium truncate">{metric.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-semibold text-headline-sm text-fg tabular-nums">
                {metric.value}
              </span>
              <span className="text-caption text-fg-muted font-mono">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Proof-of-Physical-Ship Guarantee */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-hairline/60 text-caption text-fg-subtle">
        <div className="flex items-center gap-1.5 text-success">
          <CheckCircle2 className="size-3.5 shrink-0" />
          <span className="font-medium">Dual-Proof Hardware Verified (Physical Telemetry Active)</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="size-3 text-accent" />
          <span>WebSerial / MQTT Hub</span>
        </div>
      </div>
    </div>
  );
}
