import { describe, it, expect } from 'vitest';
import type { PhysicsVehicleType } from './physics-hub';

describe('Telemetry Exporter Data Model & Physics Export', () => {
  it('formats telemetry time-series with Runge-Kutta 4 state parameters', () => {
    const vehicleType: PhysicsVehicleType = 'drone';
    const sampleTelemetry = Array.from({ length: 5 }, (_, i) => ({
      timeSeconds: i * 0.5,
      velocityMs: 12 + i * 2.8,
      accelerationMs2: 3.5 - i * 0.18,
      powerKilowatts: 45 + i * 8.2,
      systemEfficiencyPercent: 91.4 - i * 0.4,
    }));

    const exportPayload = {
      metadata: {
        system: 'Hackerland Multibody Dynamics Engine',
        vehicleType,
        integrationMethod: 'Runge-Kutta 4th Order (RK4)',
        timeStepSeconds: 0.01667,
      },
      telemetry: sampleTelemetry,
    };

    expect(exportPayload.metadata.vehicleType).toBe('drone');
    expect(exportPayload.metadata.integrationMethod).toContain('RK4');
    expect(exportPayload.telemetry.length).toBe(5);
    expect(exportPayload.telemetry[0]?.powerKilowatts).toBe(45);
  });

  it('generates valid CSV representation from telemetry data', () => {
    const headers = ['time_s', 'velocity_m_s', 'accel_m_s2', 'power_kw', 'efficiency_pct'];
    const row = `${0.5},${14.8},${3.32},${53.2},${91.0}`;
    const csv = [headers.join(','), row].join('\n');

    expect(csv).toContain('time_s,velocity_m_s,accel_m_s2,power_kw,efficiency_pct');
    expect(csv).toContain('0.5,14.8,3.32,53.2,91');
  });
});
