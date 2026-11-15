import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LiveTelemetryPanel } from './live-telemetry-panel';
import type { TelemetryFeed } from '@/lib/data/types';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const MOCK_TELEMETRY: TelemetryFeed = {
  nodeId: 'TEST-NODE-01',
  deviceType: 'ESP32 Sensor Hub',
  status: 'streaming',
  lastPing: '1s ago',
  metrics: [
    { label: 'Airspeed', value: 18.2, unit: 'm/s' },
    { label: 'Voltage', value: 11.4, unit: 'V' },
  ],
};

describe('LiveTelemetryPanel', () => {
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

  it('renders hardware mission control telemetry metrics and status', () => {
    act(() => {
      root.render(<LiveTelemetryPanel telemetry={MOCK_TELEMETRY} />);
    });

    expect(container.textContent).toContain('Hardware Mission Control');
    expect(container.textContent).toContain('STREAMING');
    expect(container.textContent).toContain('TEST-NODE-01');
    expect(container.textContent).toContain('ESP32 Sensor Hub');
    expect(container.textContent).toContain('Airspeed');
    expect(container.textContent).toContain('18.2');
    expect(container.textContent).toContain('Voltage');
    expect(container.textContent).toContain('11.4');
  });

  it('toggles pause and resume streaming when button is clicked', () => {
    act(() => {
      root.render(<LiveTelemetryPanel telemetry={MOCK_TELEMETRY} />);
    });

    const toggleBtn = container.querySelector('button') as HTMLButtonElement;
    expect(toggleBtn.textContent).toContain('Pause Stream');

    act(() => {
      toggleBtn.click();
    });
    expect(toggleBtn.textContent).toContain('Resume Live Stream');
    expect(container.textContent).toContain('PAUSED');

    act(() => {
      toggleBtn.click();
    });
    expect(toggleBtn.textContent).toContain('Pause Stream');
    expect(container.textContent).toContain('STREAMING');
  });
});
