import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { YoungInnovatorsHub } from './young-innovators-hub';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('YoungInnovatorsHub Component', () => {
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

  it('renders hero title, age progression tiers, and visual block simulator', () => {
    act(() => {
      root.render(<YoungInnovatorsHub />);
    });

    expect(container.textContent).toContain('From Curiosity to Real Physical Hardware');
    expect(container.textContent).toContain('Junior Tinkerers');
    expect(container.textContent).toContain('Intermediate Makers');
    expect(container.textContent).toContain('Junior Fellows');
    expect(container.textContent).toContain('Visual Logic to Real MicroPython & C++ Simulator');
    expect(container.textContent).toContain('Virtual Hardware Serial Monitor');
  });

  it('filters challenges by clicking the age bracket card', () => {
    act(() => {
      root.render(<YoungInnovatorsHub />);
    });

    const juniorCard = container.querySelectorAll('.cursor-pointer')[0] as HTMLDivElement;
    expect(juniorCard).toBeTruthy();

    act(() => {
      juniorCard.click();
    });

    expect(container.textContent).toContain('Smart Plant Hydration Alert Buddy');
    expect(container.textContent).not.toContain('Miniature CanSat Atmospheric Telemetry Probe');
  });

  it('switches visual code simulator tabs to MicroPython', () => {
    act(() => {
      root.render(<YoungInnovatorsHub />);
    });

    const pythonTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('MicroPython')
    );
    expect(pythonTab).toBeTruthy();

    act(() => {
      pythonTab?.click();
    });

    expect(container.textContent).toContain('from machine import Pin, ADC');
  });
});
