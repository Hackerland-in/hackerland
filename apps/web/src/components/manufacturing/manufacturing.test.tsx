import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ManufacturingHub } from './manufacturing-hub';
import { ManufacturingSimulator } from './simulators/manufacturing-simulators';
import {
  InjectionMoldingSimulator,
  SheetMetalBendSimulator,
  BatteryWeldingSimulator,
  BLDCMotorSimulator,
  ThermalHeatsinkSimulator,
  CleanroomSimulator,
} from './simulators/advanced-industrial-simulators';
import { InteractiveLab } from './interactive-lab';
import { MANUFACTURING_PILLARS } from './manufacturing-data';
import { HardwareBenchStudio } from './bench/hardware-bench-studio';
import { CircuitoBuilder } from './circuito/circuito-builder';

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

  it('runs Injection Molding simulator and calculates clamp tonnage', () => {
    act(() => {
      root.render(<InjectionMoldingSimulator />);
    });
    expect(container.textContent).toContain('Injection Molding Clamp Tonnage & Cycle Time Engine');
    expect(container.textContent).toContain('Ton Press Required');
    expect(container.textContent).toContain('Cooling Phase Time');
  });

  it('runs Sheet Metal bend simulator and calculates bend allowance', () => {
    act(() => {
      root.render(<SheetMetalBendSimulator />);
    });
    expect(container.textContent).toContain('Sheet Metal Bend Allowance & K-Factor Flat Pattern Sizer');
    expect(container.textContent).toContain('Bend Allowance (BA)');
    expect(container.textContent).toContain('Bend Deduction (BD)');
  });

  it('runs Battery Spot Welding simulator and calculates ampacity', () => {
    act(() => {
      root.render(<BatteryWeldingSimulator />);
    });
    expect(container.textContent).toContain('Battery Spot Welding & Nickel Strip Ampacity Sizer');
    expect(container.textContent).toContain('Continuous Current Rating');
    expect(container.textContent).toContain('Pure Nickel');
  });

  it('runs BLDC Motor winding simulator and calculates Kv rating', () => {
    act(() => {
      root.render(<BLDCMotorSimulator />);
    });
    expect(container.textContent).toContain('BLDC Motor Stator Winding & Kv Rating Designer');
    expect(container.textContent).toContain('RPM/V (Kv)');
    expect(container.textContent).toContain('Torque Constant');
  });

  it('runs Thermal Heatsink simulator and calculates junction temperature', () => {
    act(() => {
      root.render(<ThermalHeatsinkSimulator />);
    });
    expect(container.textContent).toContain('Power Semiconductor Heatsink & Junction Temp Engine');
    expect(container.textContent).toContain('Semiconductor Junction Temp');
    expect(container.textContent).toContain('Total Thermal Resistance');
  });

  it('runs Cleanroom simulator and calculates air changes and HEPA units', () => {
    act(() => {
      root.render(<CleanroomSimulator />);
    });
    expect(container.textContent).toContain('Cleanroom Particle Count & ISO 14644-1 HVAC Sizer');
    expect(container.textContent).toContain('Air Changes / Hour (ACH)');
    expect(container.textContent).toContain('HEPA Filter Units Required');
  });

  it('renders HardwareBenchStudio and simulates live OLED, pot and serial monitor', () => {
    act(() => {
      root.render(<HardwareBenchStudio initialTrackId="pcb" />);
    });

    // Verify studio header and ESP-labs companion banner
    expect(container.textContent).toContain('INTERACTIVE BENCH STUDIO');
    expect(container.textContent).toContain('Inspired by ESP-Labs Companion Architecture');
    expect(container.textContent).toContain('ESP32-S3-WROOM-1');

    // Verify OLED viewport is rendered
    expect(container.textContent).toContain('SSD1306 0.96" OLED (128x64 I2C 0x3C)');
    expect(container.textContent).toContain('ADC1_CH0 (GPIO 1)');

    // Verify Serial Terminal is active
    expect(container.textContent).toContain('Serial Terminal (UART0)');
    expect(container.textContent).toContain('115200 baud');

    // Test sending quick command
    const quickHelpBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'HELP'
    );
    expect(quickHelpBtn).toBeDefined();

    act(() => {
      quickHelpBtn?.click();
    });

    expect(container.textContent).toContain('HACKERLAND FIRMWARE SERIAL COMMANDS');
  });

  it('navigates across tabs in HardwareBenchStudio (Code Stepper & Pinout)', () => {
    act(() => {
      root.render(<HardwareBenchStudio initialTrackId="pcb" />);
    });

    // Switch to Code Stepper tab
    const codeTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Firmware Code Stepper')
    );
    expect(codeTab).toBeDefined();

    act(() => {
      codeTab?.click();
    });

    expect(container.textContent).toContain('PlatformIO / Embedded C++');
    expect(container.textContent).toContain('Adafruit_SSD1306.h');

    // Switch to Pinout tab
    const pinoutTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Pinout & Multiplexing Matrix')
    );
    expect(pinoutTab).toBeDefined();

    act(() => {
      pinoutTab?.click();
    });

    expect(container.textContent).toContain('Interactive Pinout & Bus Multiplexing Matrix');
    expect(container.textContent).toContain('Click Pin to Inspect Hardware Multiplexer');
  });

  it('renders CircuitoBuilder and simulates autonomous circuit design with auto-injected passives', () => {
    act(() => {
      root.render(<CircuitoBuilder />);
    });

    expect(container.textContent).toContain('CIRCUITO GENERATOR ENGINE');
    expect(container.textContent).toContain('Inspired by Circuito.io Autonomous Hardware Design');
    expect(container.textContent).toContain('Interactive Breadboard Wiring Diagram');
    expect(container.textContent).toContain('ESP32-S3-WROOM-1');

    // Verify auto-injected passives are displayed
    expect(container.textContent).toContain('Circuito Automated Passive Supporting Circuitry');

    // Switch to Power & Logic tab
    const logicTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Power & Logic Compatibility Engine')
    );
    expect(logicTab).toBeDefined();

    act(() => {
      logicTab?.click();
    });

    expect(container.textContent).toContain('Automated Electrical Calculation & Power Budget');
    expect(container.textContent).toContain('Total Current Draw');
    expect(container.textContent).toContain('Estimated Runtime');

    // Switch to Generated Code tab
    const codeTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Generated Test Firmware')
    );
    expect(codeTab).toBeDefined();

    act(() => {
      codeTab?.click();
    });

    expect(container.textContent).toContain('Generated Hardware Test Sketch');
    expect(container.textContent).toContain('hackerland_circuito_test.ino');
    expect(container.textContent).toContain('HACKERLAND CIRCUITO ENGINE GENERATED CODE');

    // Switch to BOM tab
    const bomTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Bill of Materials (BOM)')
    );
    expect(bomTab).toBeDefined();

    act(() => {
      bomTab?.click();
    });

    expect(container.textContent).toContain('Itemized Bill of Materials (BOM) & Domestic Sourcing');
    expect(container.textContent).toContain('Robu.in');
    expect(container.textContent).toContain('Quartzcomponents');
    expect(container.textContent).toContain('ElectronicsComp');
  });
});
