import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CanCatalog } from './can-catalog';
import { CanBitTimingDiagram } from './can-bit-timing-diagram';
import { CanBusLoadSimulator } from './can-bus-load-simulator';
import { CanBusWorkbench } from './can-bus-workbench';
import { CanDetailView } from './can-detail-view';
import { CAN_BUS_PROJECTS_REGISTRY } from '@/lib/data/can-bus-data';
import { simulateCanBus } from '@hackerland/core';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Automotive CAN Bus & ISO 11898 Network Protocol Simulator Components', () => {
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

  it('renders CanCatalog with curated Indian automotive networks', () => {
    act(() => {
      root.render(<CanCatalog initialProjects={CAN_BUS_PROJECTS_REGISTRY} />);
    });

    expect(container.textContent).toContain('Automotive CAN Bus & ISO 11898 Network Protocol Simulator');
    expect(container.textContent).toContain('Curated Indian Automotive Networks');
    expect(container.textContent).toContain('Ather 450X ISO 11898-2 Powertrain & Telematics CAN Bus');
    expect(container.textContent).toContain('Tata Nexon EV High-Voltage Powertrain CAN-FD Architecture');
    expect(container.textContent).toContain('Telecom Tower');
  });

  it('filters CanCatalog by search keyword', () => {
    act(() => {
      root.render(<CanCatalog initialProjects={CAN_BUS_PROJECTS_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Ladakh');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Sub-Zero High-Altitude Defence Post CAN Bus');
    expect(container.textContent).not.toContain('Ather 450X ISO 11898-2');
  });

  it('renders CanBitTimingDiagram with segments breakdown and oscilloscope differential toggle', () => {
    const simResult = simulateCanBus({
      standard: 'can_2_0b_standard',
      baudRateKbps: 500,
      clockFrequencyMhz: 40,
      busLengthMeters: 4.2,
      numberOfNodes: 6,
      averagePayloadBytes: 8,
      totalMessageFrequencyHz: 400,
      termination: 'split_termination_filtered',
    });

    act(() => {
      root.render(
        <CanBitTimingDiagram
          nominalBitTimeNs={simResult.nominalBitTimeNs}
          timeQuantumNs={simResult.timeQuantumNs}
          totalTimeQuantaPerBit={simResult.totalTimeQuantaPerBit}
          samplePointPercent={simResult.samplePointPercent}
          samplePointStatus={simResult.samplePointStatus}
          waveforms={simResult.waveforms}
        />
      );
    });

    expect(container.textContent).toContain('CAN Bit Timing & Physical Layer Differential Oscilloscope');
    expect(container.textContent).toContain('Sync');
    expect(container.textContent).toContain('Prop');
    expect(container.textContent).toContain('Phase 1');
    expect(container.textContent).toContain('Phase 2');
    expect(container.querySelector('svg')).toBeTruthy();

    // Toggle to differential oscilloscope
    const oscButton = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Differential Scope')
    );
    expect(oscButton).toBeTruthy();

    act(() => {
      oscButton?.click();
    });

    expect(container.textContent).toContain('CAN_H');
    expect(container.textContent).toContain('CAN_L');
    expect(container.textContent).toContain('V_diff (H - L)');
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders CanBusLoadSimulator with bus load meter and arbitration priority frame resolution', () => {
    act(() => {
      root.render(
        <CanBusLoadSimulator
          busLoadPercent={28.5}
          busUtilizationHealth="optimal_safe"
          frameTotalBits={128}
          maxFrameTransferTimeUs={256}
          totalMessageFrequencyHz={400}
          actualBaudRateKbps={500}
        />
      );
    });

    expect(container.textContent).toContain('Total Bus Bandwidth Utilization:');
    expect(container.textContent).toContain('28.5%');
    expect(container.textContent).toContain('Deterministic delivery guaranteed');
    expect(container.textContent).toContain('Non-Destructive Bitwise Arbitration (CAN ID Priority)');
    expect(container.textContent).toContain('BMS Cell Over-Temp Cutoff');
    expect(container.textContent).toContain('Wins Arbitration');
  });

  it('renders CanBusWorkbench and responds to preset clicks', () => {
    act(() => {
      root.render(
        <CanBusWorkbench
          initialStandard="can_2_0b_standard"
          initialBaudRateKbps={500}
          initialBusLengthM={10}
          initialNodes={8}
        />
      );
    });

    expect(container.textContent).toContain('⚙ Physical Layer & Timing Controls');
    expect(container.textContent).toContain('Nominal Baud Rate');
    expect(container.textContent).toContain('⚡ Real-World Automotive Presets');

    // Click Agri Drone UAVCAN preset
    const buttons = Array.from(container.querySelectorAll('button'));
    const droneBtn = buttons.find((b) => b.textContent?.includes('Agri Drone UAVCAN'));
    expect(droneBtn).toBeTruthy();

    act(() => {
      droneBtn?.click();
    });

    expect(container.textContent).toContain('1000 kbps');
  });

  it('renders CanDetailView with NABL test facility, directives, and embedded workbench', () => {
    const project = CAN_BUS_PROJECTS_REGISTRY[0]!;

    act(() => {
      root.render(<CanDetailView project={project} />);
    });

    expect(container.textContent).toContain(project.title);
    expect(container.textContent).toContain(project.indianContextFacility);
    expect(container.textContent).toContain(project.standardsCompliance);
    expect(container.textContent).toContain('Engineering Directives & Design Archaeology');
    expect(container.textContent).toContain(project.designDirectives[0]);
    expect(container.textContent).toContain('Interactive Bit Timing & Load Simulator');
  });
});
