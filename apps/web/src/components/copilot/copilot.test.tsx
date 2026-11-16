import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HardwareCopilotStudio } from './hardware-copilot-studio';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('HardwareCopilotStudio Component', () => {
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

  it('renders tab triggers and default calculators view', () => {
    act(() => {
      root.render(<HardwareCopilotStudio />);
    });

    expect(container.textContent).toContain('Engineering Calculators');
    expect(container.textContent).toContain('Domestic Indian Sourcing Engine');
    expect(container.textContent).toContain('BOM Risk Scrubber');
    expect(container.textContent).toContain('Hardware Co-Pilot Terminal');
    expect(container.textContent).toContain('PCB Trace Width & Ampacity Sizing');
    expect(container.textContent).toContain('Buck Converter LC Filter Sizing');
    expect(container.textContent).toContain('Heatsink Thermal Resistance Calculator');
  });

  it('switches to Domestic Indian Sourcing tab and displays component catalog', () => {
    act(() => {
      root.render(<HardwareCopilotStudio />);
    });

    const sourcingTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Domestic Indian Sourcing Engine')
    );
    expect(sourcingTab).toBeTruthy();

    act(() => {
      sourcingTab?.click();
    });

    expect(container.textContent).toContain('STM32F401CCU6');
    expect(container.textContent).toContain('ESP32-WROOM-32E');
    expect(container.textContent).toContain('Robu.in (Pune)');
    expect(container.textContent).toContain('Element14 India');
  });

  it('switches to BOM Risk Scrubber tab and runs BOM audit', () => {
    act(() => {
      root.render(<HardwareCopilotStudio />);
    });

    const bomTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('BOM Risk Scrubber')
    );
    expect(bomTab).toBeTruthy();

    act(() => {
      bomTab?.click();
    });

    expect(container.textContent).toContain('Bill of Materials (BOM) Single-Source & Obsolescence Auditor');
    expect(container.textContent).toContain('STM32F401CCU6');
    expect(container.textContent).toContain('MPU-6050');
  });
});
