import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ManufacturingHub } from './manufacturing-hub';
import { ManufacturingSimulator } from './simulators/manufacturing-simulators';
import { InteractiveLab } from './interactive-lab';
import { MANUFACTURING_PILLARS } from './manufacturing-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Manufacturing Hub & Simulation Engines', () => {
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

  it('renders all 8 manufacturing pillars in the navigation bar', () => {
    act(() => {
      root.render(<ManufacturingHub />);
    });

    expect(container.textContent).toContain('Select Manufacturing Domain');
    expect(container.textContent).toContain('8 Pillars Active');
    expect(container.textContent).toContain('Printed Circuit Boards');
    expect(container.textContent).toContain('Hardware & Enclosures');
    expect(container.textContent).toContain('Autonomous Drone Systems');
    expect(container.textContent).toContain('Electric Vehicles & Automotive');
    expect(container.textContent).toContain('Electric Two-Wheelers & Smart Bikes');
    expect(container.textContent).toContain('Engines & Advanced Propulsion');
    expect(container.textContent).toContain('Mobile Devices & Wearable Hardware');
    expect(container.textContent).toContain('Future Tech & Frontiers');
  });

  it('switches pillar when navigation button is clicked', () => {
    act(() => {
      root.render(<ManufacturingHub />);
    });

    const droneBtn = container.querySelector('[data-testid="pillar-btn-drone"]') as HTMLButtonElement;
    expect(droneBtn).toBeDefined();

    act(() => {
      droneBtn.click();
    });

    expect(container.textContent).toContain('Autonomous Drone Systems');
    expect(container.textContent).toContain('Drone Propulsion & Flight Endurance Simulator');
  });

  it('runs PCB simulator and calculates impedance matching', () => {
    act(() => {
      root.render(<ManufacturingSimulator pillarId="pcb" />);
    });

    expect(container.textContent).toContain('50Ω Microstrip Impedance & Stackup Engine');
    expect(container.textContent).toContain('Substrate Dielectric (εr)');
    expect(container.textContent).toContain('FR-4');
  });

  it('runs Drone simulator and calculates thrust to weight', () => {
    act(() => {
      root.render(<ManufacturingSimulator pillarId="drone" />);
    });

    expect(container.textContent).toContain('Drone Propulsion & Flight Endurance Simulator');
    expect(container.textContent).toContain('All-Up Weight (AUW)');
    expect(container.textContent).toContain('Estimated Hover Time');
  });

  it('runs Car EV simulator and displays ARAI estimated range', () => {
    act(() => {
      root.render(<ManufacturingSimulator pillarId="car" />);
    });

    expect(container.textContent).toContain('EV Battery Pack Architecture & ARAI Range Simulator');
    expect(container.textContent).toContain('Estimated ARAI Range');
    expect(container.textContent).toContain('AIS-156 Compliance');
  });

  it('runs Engine De Laval nozzle simulator', () => {
    act(() => {
      root.render(<ManufacturingSimulator pillarId="engine" />);
    });

    expect(container.textContent).toContain('De Laval Supersonic Nozzle & Rocket Thrust Engine');
    expect(container.textContent).toContain('Optimal Expansion Ratio');
    expect(container.textContent).toContain('Specific Impulse');
  });

  it('runs Mobile 5G RF simulator and calculates link margin', () => {
    act(() => {
      root.render(<ManufacturingSimulator pillarId="mobile" />);
    });

    expect(container.textContent).toContain('5G Cellular RF Link Budget & Antenna Propagation');
    expect(container.textContent).toContain('Free Space Path Loss');
    expect(container.textContent).toContain('SAR Compliance');
  });

  it('runs Future Tech simulator comparing sodium-ion and lithium', () => {
    act(() => {
      root.render(<ManufacturingSimulator pillarId="future-tech" />);
    });

    expect(container.textContent).toContain('Sodium-Ion vs Lithium Battery Density & Cost Analyzer');
    expect(container.textContent).toContain('Raw Material Cost Savings');
    expect(container.textContent).toContain('Sodium-Ion Pack Weight');
  });

  it('allows completing interactive lab checkpoints and verifies certification', () => {
    const pcbPillar = MANUFACTURING_PILLARS[0]!;
    act(() => {
      root.render(<InteractiveLab pillar={pcbPillar} />);
    });

    expect(container.textContent).toContain('Interactive Lab Challenge');
    expect(container.textContent).toContain('0 of 3 Steps Validated');

    // Click all 3 step buttons
    const stepButtons = container.querySelectorAll('button[aria-label^="Toggle step"]');
    expect(stepButtons.length).toBe(3);

    act(() => {
      stepButtons.forEach((btn) => (btn as HTMLButtonElement).click());
    });

    expect(container.textContent).toContain('Lab Certified');
    expect(container.textContent).toContain('Congratulations! You have completed the Printed Circuit Boards (PCB) Lab!');
  });
});
