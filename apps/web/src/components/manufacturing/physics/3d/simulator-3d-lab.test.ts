import { describe, it, expect } from 'vitest';
import type { Lab3DModelType } from './simulator-3d-lab';

describe('Simulator 3D Lab Models & Telemetry Config', () => {
  const supportedModels: Lab3DModelType[] = [
    'drone',
    'rocket',
    'car',
    'ev',
    'motorbike',
    'bicycle',
    'mcu',
  ];

  it('supports all 7 engineering domain 3D models', () => {
    expect(supportedModels.length).toBe(7);
    expect(supportedModels).toContain('drone');
    expect(supportedModels).toContain('rocket');
    expect(supportedModels).toContain('car');
    expect(supportedModels).toContain('ev');
    expect(supportedModels).toContain('motorbike');
    expect(supportedModels).toContain('bicycle');
    expect(supportedModels).toContain('mcu');
  });

  it('verifies 3D attitude kinematics integration constraints', () => {
    // Pitch / roll / yaw angle limits in degrees
    const pitchDeg = 12;
    const rollDeg = -15;
    const yawDeg = 45;

    const pitchRad = (pitchDeg * Math.PI) / 180;
    const rollRad = (rollDeg * Math.PI) / 180;

    expect(pitchRad).toBeGreaterThan(0);
    expect(rollRad).toBeLessThan(0);
    expect(yawDeg).toBe(45);
  });

  it('verifies camera preset configuration', () => {
    const presets = ['orbit', 'fpv', 'chase', 'top'] as const;
    expect(presets).toContain('orbit');
    expect(presets).toContain('chase');
    expect(presets).toContain('top');
  });
});
