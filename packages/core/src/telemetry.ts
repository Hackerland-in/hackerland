import { z } from 'zod';

export const telemetryDeviceTypeSchema = z.enum([
  'drone_uav',
  'ev_bms',
  'iot_sensor',
  'cubesat_satellite',
  'custom',
]);
export type TelemetryDeviceType = z.infer<typeof telemetryDeviceTypeSchema>;

export const telemetryChannelTypeSchema = z.enum([
  'voltage',
  'current',
  'temperature',
  'altitude',
  'gyro',
  'accelerometer',
  'pressure',
  'rssi',
  'percentage',
  'rpm',
  'custom',
]);
export type TelemetryChannelType = z.infer<typeof telemetryChannelTypeSchema>;

export const telemetryChannelConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  unit: z.string(),
  type: telemetryChannelTypeSchema,
  minNominal: z.number(),
  maxNominal: z.number(),
  criticalMin: z.number().optional(),
  criticalMax: z.number().optional(),
  color: z.string(),
});
export type TelemetryChannelConfig = z.infer<typeof telemetryChannelConfigSchema>;

export const telemetrySampleSchema = z.object({
  timestampMs: z.number(),
  values: z.record(z.string(), z.number()),
  status: z.enum(['nominal', 'warning', 'critical']).optional(),
});
export type TelemetrySample = z.infer<typeof telemetrySampleSchema>;

export const telemetryAnomalySchema = z.object({
  timestampMs: z.number(),
  channelId: z.string(),
  channelName: z.string(),
  value: z.number(),
  threshold: z.number(),
  severity: z.enum(['warning', 'critical']),
  message: z.string(),
});
export type TelemetryAnomaly = z.infer<typeof telemetryAnomalySchema>;

export const telemetryProfileSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  deviceType: telemetryDeviceTypeSchema,
  hardwareBoard: z.string(),
  firmwareStack: z.string(),
  channels: z.array(telemetryChannelConfigSchema),
  sampleRateHz: z.number(),
  description: z.string(),
  recordedSamples: z.array(telemetrySampleSchema),
});
export type TelemetryProfile = z.infer<typeof telemetryProfileSchema>;

/**
 * Computes descriptive statistical summary for a specific channel across recorded samples.
 */
export function computeTelemetryStats(
  samples: TelemetrySample[],
  channelId: string,
): { min: number; max: number; mean: number; stdDev: number; current: number; count: number } {
  const values: number[] = [];
  for (const s of samples) {
    const val = s.values[channelId];
    if (typeof val === 'number' && !Number.isNaN(val)) {
      values.push(val);
    }
  }

  if (values.length === 0) {
    return { min: 0, max: 0, mean: 0, stdDev: 0, current: 0, count: 0 };
  }

  let min = values[0] ?? 0;
  let max = values[0] ?? 0;
  let sum = 0;

  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }

  const mean = sum / values.length;
  let varianceSum = 0;
  for (const v of values) {
    varianceSum += Math.pow(v - mean, 2);
  }
  const stdDev = Math.sqrt(varianceSum / values.length);
  const current = values[values.length - 1] ?? 0;

  return {
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    mean: Number(mean.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    current: Number(current.toFixed(2)),
    count: values.length,
  };
}

/**
 * Detects threshold excursions (warnings and critical anomalies) across telemetry samples.
 */
export function detectTelemetryAnomalies(
  samples: TelemetrySample[],
  channels: TelemetryChannelConfig[],
): TelemetryAnomaly[] {
  const channelMap = new Map<string, TelemetryChannelConfig>();
  for (const ch of channels) {
    channelMap.set(ch.id, ch);
  }

  const anomalies: TelemetryAnomaly[] = [];

  for (const sample of samples) {
    for (const [chId, val] of Object.entries(sample.values)) {
      const cfg = channelMap.get(chId);
      if (!cfg) continue;

      if (cfg.criticalMax !== undefined && val > cfg.criticalMax) {
        anomalies.push({
          timestampMs: sample.timestampMs,
          channelId: chId,
          channelName: cfg.name,
          value: Number(val.toFixed(2)),
          threshold: cfg.criticalMax,
          severity: 'critical',
          message: `${cfg.name} exceeded critical upper limit of ${cfg.criticalMax} ${cfg.unit} (recorded: ${val.toFixed(2)} ${cfg.unit})`,
        });
      } else if (cfg.criticalMin !== undefined && val < cfg.criticalMin) {
        anomalies.push({
          timestampMs: sample.timestampMs,
          channelId: chId,
          channelName: cfg.name,
          value: Number(val.toFixed(2)),
          threshold: cfg.criticalMin,
          severity: 'critical',
          message: `${cfg.name} dropped below critical lower limit of ${cfg.criticalMin} ${cfg.unit} (recorded: ${val.toFixed(2)} ${cfg.unit})`,
        });
      } else if (val > cfg.maxNominal) {
        anomalies.push({
          timestampMs: sample.timestampMs,
          channelId: chId,
          channelName: cfg.name,
          value: Number(val.toFixed(2)),
          threshold: cfg.maxNominal,
          severity: 'warning',
          message: `${cfg.name} exceeded nominal ceiling of ${cfg.maxNominal} ${cfg.unit}`,
        });
      } else if (val < cfg.minNominal) {
        anomalies.push({
          timestampMs: sample.timestampMs,
          channelId: chId,
          channelName: cfg.name,
          value: Number(val.toFixed(2)),
          threshold: cfg.minNominal,
          severity: 'warning',
          message: `${cfg.name} dropped below nominal floor of ${cfg.minNominal} ${cfg.unit}`,
        });
      }
    }
  }

  return anomalies;
}

/**
 * Calculates battery pack cell voltage imbalance according to AIS-156 EV safety standard.
 */
export function calculateBmsCellSpread(cellVoltages: number[]): {
  minCell: number;
  maxCell: number;
  deltaMv: number;
  isBalancingNeeded: boolean;
  isHazardous: boolean;
} {
  if (cellVoltages.length === 0) {
    return { minCell: 0, maxCell: 0, deltaMv: 0, isBalancingNeeded: false, isHazardous: false };
  }

  let min = cellVoltages[0] ?? 0;
  let max = cellVoltages[0] ?? 0;

  for (const v of cellVoltages) {
    if (v < min) min = v;
    if (v > max) max = v;
  }

  const deltaMv = Math.round((max - min) * 1000);
  const isBalancingNeeded = deltaMv >= 40; // > 40mV requires passive/active cell equalization
  const isHazardous = deltaMv >= 150; // > 150mV indicates weak/damaged cell or thermal runway precursor

  return {
    minCell: Number(min.toFixed(3)),
    maxCell: Number(max.toFixed(3)),
    deltaMv,
    isBalancingNeeded,
    isHazardous,
  };
}

/**
 * Calculates estimated pitch and roll attitude angles from 3-axis accelerometer readings (in G or m/s²).
 */
export function calculateAttitudeAngles(
  accelX: number,
  accelY: number,
  accelZ: number,
): { pitchDeg: number; rollDeg: number } {
  const pitchRad = Math.atan2(accelX, Math.sqrt(accelY * accelY + accelZ * accelZ));
  const rollRad = Math.atan2(accelY, accelZ);

  const pitchDeg = (pitchRad * 180) / Math.PI;
  const rollDeg = (rollRad * 180) / Math.PI;

  return {
    pitchDeg: Number(pitchDeg.toFixed(1)),
    rollDeg: Number(rollDeg.toFixed(1)),
  };
}

/**
 * Parses raw CSV telemetry text into numerical samples safely with fallback detection.
 */
export function parseCsvTelemetry(
  csvText: string,
  timeColumnName: string = 'time_ms',
): { channels: string[]; samples: TelemetrySample[]; parseError?: string } {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { channels: [], samples: [], parseError: 'CSV must contain a header row and at least one data row' };
  }

  const headerRow = lines[0];
  if (!headerRow) {
    return { channels: [], samples: [], parseError: 'Missing header row' };
  }

  const headers = headerRow.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  const timeIndex = headers.findIndex(
    (h) => h.toLowerCase() === timeColumnName.toLowerCase() || h.toLowerCase() === 'timestamp' || h.toLowerCase() === 'time',
  );

  const channelKeys = headers.filter((_, idx) => idx !== timeIndex);
  const samples: TelemetrySample[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length < headers.length) continue;

    let timestampMs = (i - 1) * 100; // default 10Hz step if no explicit time column
    if (timeIndex !== -1) {
      const parsedTime = Number(parts[timeIndex]);
      if (!Number.isNaN(parsedTime)) {
        timestampMs = parsedTime;
      }
    }

    const values: Record<string, number> = {};
    for (let c = 0; c < headers.length; c++) {
      if (c === timeIndex) continue;
      const key = headers[c];
      if (!key) continue;
      const numVal = Number(parts[c]);
      if (!Number.isNaN(numVal)) {
        values[key] = numVal;
      }
    }

    if (Object.keys(values).length > 0) {
      samples.push({
        timestampMs,
        values,
      });
    }
  }

  return {
    channels: channelKeys,
    samples,
  };
}
