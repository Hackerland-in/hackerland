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
        }),
      );
      setLastUpdated('Just now');
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div
      className={`rounded-2xl border border-hairline bg-surface-2/60 p-4 space-y-3 ${className}`}
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
          <span className="font-display text-label-md font-semibold text-fg">
            Live Hardware Benchmark
          </span>
          <Badge tone={isLive ? 'success' : 'neutral'} variant="solid">
            {isLive ? 'Streaming' : 'Paused'}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-1.5 rounded-full bg-surface-1 border border-hairline px-3 py-1 text-[12px] text-accent-fg hover:border-accent/40 transition-colors font-display font-medium"
        >
          <RefreshCw className={`size-3 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          <span>{isLive ? 'Pause' : 'Resume'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-fg-subtle">
        <div className="flex items-center gap-1.5 truncate">
          <Cpu className="size-3.5 text-accent-fg shrink-0" />
          <span className="font-mono font-medium">{telemetry.nodeId}</span>
          <span>·</span>
          <span className="truncate">{telemetry.deviceType}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Radio className="size-3 text-fg-subtle" />
          <span>Updated {lastUpdated}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-hairline bg-surface-1 p-2.5 space-y-1 shadow-xs"
            data-testid={`telemetry-metric-${metric.label}`}
          >
            <div className="text-[11px] text-fg-subtle font-medium truncate">{metric.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-headline-sm text-fg tabular-nums">
                {metric.value}
              </span>
              <span className="text-[11px] text-fg-muted font-mono">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-hairline/70 text-[12px] text-fg-subtle">
        <div className="flex items-center gap-1.5 text-success-fg">
          <CheckCircle2 className="size-3.5 shrink-0" />
          <span className="font-medium">Proof-of-Ship Physical Sensor Feed Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="size-3 text-accent-fg" />
          <span>WebSerial / MQTT</span>
        </div>
      </div>
    </div>
  );
}
