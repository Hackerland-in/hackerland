import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TelemetryStudio } from './telemetry-studio';
import { AttitudeIndicator } from './attitude-indicator';
import { BmsCellMatrix } from './bms-cell-matrix';
import { TELEMETRY_PROFILES } from '@/lib/data/telemetry-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Telemetry Studio & Digital Twin Components', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders TelemetryStudio with default profile and playback controls', () => {
    act(() => {
      root.render(<TelemetryStudio initialProfiles={TELEMETRY_PROFILES} />);
    });

    expect(container.textContent).toContain('Garuda Kisan Agrisprayer');
    expect(container.textContent).toContain('Hackerland Mission Control');
    expect(container.textContent).toContain('Connect WebSerial');
    expect(container.textContent).toContain('Import CSV');
    expect(container.textContent).toContain('Export CSV');
    expect(container.textContent).toContain('Baro Altitude');
    expect(container.textContent).toContain('Automated Anomaly & Threshold Excursion Engine');
  });

  it('renders AttitudeIndicator with roll and pitch angles', () => {
    act(() => {
      root.render(<AttitudeIndicator rollDeg={12.5} pitchDeg={-5.0} size={160} />);
    });

    expect(container.textContent).toContain('ATTITUDE GYRO');
    expect(container.textContent).toContain('Roll: 12.5°');
    expect(container.textContent).toContain('Pitch: -5.0°');
  });

  it('renders BmsCellMatrix with 16 cells and calculates AIS-156 cell spread', () => {
    act(() => {
      root.render(<BmsCellMatrix packVoltage={58.4} cellDeltaMv={25} cellCount={16} />);
    });

    expect(container.textContent).toContain('AIS-156 Phase 2: 16S Cell Voltage Balance');
    expect(container.textContent).toContain('C1');
    expect(container.textContent).toContain('C16');
    expect(container.textContent).toContain('58.40 V');
    expect(container.textContent).toContain('BALANCED: Δ 25 mV (Nominal)');
  });

  it('switches between profiles when profile tab is clicked', () => {
    act(() => {
      root.render(<TelemetryStudio initialProfiles={TELEMETRY_PROFILES} />);
    });

    const bmsTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Ather 450X')
    );
    expect(bmsTab).toBeTruthy();

    act(() => {
      bmsTab?.click();
    });

    expect(container.textContent).toContain('Ather 450X AIS-156 Smart EV Battery Pack');
    expect(container.textContent).toContain('Powertrain Thermal Safety');
  });
});
