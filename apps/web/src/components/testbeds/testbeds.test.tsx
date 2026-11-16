import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestbedCatalog } from './testbed-catalog';
import { ScpiScriptConsole } from './scpi-script-console';
import { TestbedBookingModal } from './testbed-booking-modal';
import { TestbedDetailView } from './testbed-detail-view';
import { TESTBED_FACILITIES } from '@/lib/data/testbeds-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Remote HIL Testbeds & Lab Benches Components', () => {
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

  it('renders TestbedCatalog with equipment items and rates', () => {
    act(() => {
      root.render(<TestbedCatalog initialTestbeds={TESTBED_FACILITIES} />);
    });

    expect(container.textContent).toContain('Remote Hardware-in-the-Loop Testbeds');
    expect(container.textContent).toContain('TOTAL TESTBEDS');
    expect(container.textContent).toContain('REMOTE SCPI');
    expect(container.textContent).toContain('Keysight N9020B MXA 20 GHz');
    expect(container.textContent).toContain('Chroma 17020 Regenerative Battery Pack Cycler');
    expect(container.textContent).toContain('Rohde & Schwarz 3m Semi-Anechoic EMI/EMC Chamber');
  });

  it('renders ScpiScriptConsole and executes simulated commands', async () => {
    const item = TESTBED_FACILITIES[0]!;
    act(() => {
      root.render(
        <ScpiScriptConsole
          scriptRunner={item.scriptRunner}
          equipmentName={item.name}
        />,
      );
    });

    expect(container.textContent).toContain('REMOTE INSTRUMENTATION SCRIPT RUNNER');
    expect(container.textContent).toContain('SYNTAX VALID');

    const execBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Execute SCPI Sequence'),
    );
    expect(execBtn).toBeTruthy();

    await act(async () => {
      execBtn?.click();
    });

    expect(container.textContent).toContain('[CLIENT] Connecting to instrument socket');
  });

  it('renders TestbedBookingModal and calculates subsidized rates', () => {
    const item = TESTBED_FACILITIES[0]!;
    act(() => {
      root.render(
        <TestbedBookingModal
          testbed={item}
          isOpen={true}
          onClose={() => {}}
        />,
      );
    });

    expect(container.textContent).toContain('Reserve Equipment Test Slot');
    expect(container.textContent).toContain('Apply DPIIT Startup / Student Subsidy Rate');
    expect(container.textContent).toContain('Total Reservation Fee');
  });

  it('renders TestbedDetailView with specifications and guidelines', () => {
    const item = TESTBED_FACILITIES[1]!; // Chroma battery cycler
    act(() => {
      root.render(<TestbedDetailView testbed={item} />);
    });

    expect(container.textContent).toContain('Chroma 17020 Regenerative Battery Pack Cycler');
    expect(container.textContent).toContain('COMMERCIAL RATE');
    expect(container.textContent).toContain('DPIIT / STUDENT RATE');
    expect(container.textContent).toContain('LABORATORY RULES & EQUIPMENT SAFETY INTERLOCKS');
    expect(container.textContent).toContain('INSTRUMENT SPECIFICATIONS');
  });
});
