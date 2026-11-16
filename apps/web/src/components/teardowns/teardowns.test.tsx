import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PcbPinoutAnnotator } from './pcb-pinout-annotator';
import { TeardownSubmitStudio } from './teardown-submit-studio';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const SAMPLE_ANNOTATIONS = [
  {
    id: 'pin-afe-test',
    xPercent: 42,
    yPercent: 35,
    label: 'TI BQ76952 AFE',
    subsystem: 'Battery Management',
    partNumber: 'BQ76952',
    manufacturer: 'Texas Instruments',
    function: 'Monitors 16 series Li-Ion cells with 1mV resolution',
    package: '48-pin TQFP',
    voltageRating: '80V max',
    estimatedCostUsd: 4.2,
    openSourceAlternative: 'LTC6804 / BQ76940 breakout',
  },
  {
    id: 'pin-mcu-test',
    xPercent: 65,
    yPercent: 48,
    label: 'STM32F405 Safety MCU',
    subsystem: 'BMS Logic',
    partNumber: 'STM32F405RGT6',
    manufacturer: 'STMicroelectronics',
    function: '168MHz ARM Cortex-M4 with Coulomb counting DSP',
    package: '64-pin LQFP',
    voltageRating: '3.3V',
    estimatedCostUsd: 5.5,
    openSourceAlternative: 'RP2040 Dual Core / ESP32-S3',
  },
];

describe('PcbPinoutAnnotator Component', () => {
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

  it('renders interactive PCB canvas and pin hotspots', () => {
    act(() => {
      root.render(
        <PcbPinoutAnnotator
          initialAnnotations={SAMPLE_ANNOTATIONS}
          deviceTitle="Ather 450 BMS"
          allowEditing={true}
        />
      );
    });

    expect(container.textContent).toContain('INTERACTIVE CHIP-LEVEL PINOUT EXPLORER');
    expect(container.textContent).toContain('All Subsystems (2)');
    expect(container.textContent).toContain('TI BQ76952 AFE');
    expect(container.textContent).toContain('LTC6804 / BQ76940 breakout');
  });

  it('filters pin annotations by subsystem', () => {
    act(() => {
      root.render(
        <PcbPinoutAnnotator
          initialAnnotations={SAMPLE_ANNOTATIONS}
          deviceTitle="Ather 450 BMS"
        />
      );
    });

    const bmsBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('BMS Logic')
    );
    expect(bmsBtn).toBeTruthy();

    act(() => {
      bmsBtn?.click();
    });

    expect(container.textContent).toContain('STM32F405 Safety MCU');
  });
});

describe('TeardownSubmitStudio Component', () => {
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

  it('renders step 1 with margin calculations and allows step progression', () => {
    act(() => {
      root.render(<TeardownSubmitStudio />);
    });

    expect(container.textContent).toContain('Submit a Hardware Teardown');
    expect(container.textContent).toContain('MARKUP RATIO');
    expect(container.textContent).toContain('EST. GROSS MARGIN');

    const nextBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Next: Subsystems')
    );
    expect(nextBtn).toBeTruthy();

    act(() => {
      nextBtn?.click();
    });

    expect(container.textContent).toContain('Subsystems & Functional Tree');
  });
});
