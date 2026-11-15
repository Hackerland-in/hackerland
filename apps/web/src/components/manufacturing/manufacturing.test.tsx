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
import { ActualHardwareSimulator } from './hardware-simulator/actual-hardware-simulator';
import { CIRCUIT_PRESETS, solveCircuitStep } from './hardware-simulator/circuit-engine';
import { FalstadSimulator } from './falstad/falstad-simulator';
import { FALSTAD_PRESETS, parseSpiceNetlist, solveCircuitJsStep } from './falstad/circuitjs-engine';
import { HdlSimulator } from './hdl/hdl-simulator';
import { HDL_PRESETS, runHdlSimulation, generateVcdFile } from './hdl/hdl-engine';
import { IssSimulator } from './iss/iss-simulator';
import { ISS_PRESETS, parseAssembly, initCpuState, stepCpu } from './iss/iss-engine';

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

  it('runs solveCircuitStep and computes Ohm law nodal voltages and LED burnout', () => {
    const ohmsPreset = CIRCUIT_PRESETS[0]!;
    
    // Normal 5V through 220 ohm: (5 - 2) / 220 = 13.6 mA -> Normal conduction
    const normalResult = solveCircuitStep(ohmsPreset, ohmsPreset.components, 0, 0.05);
    expect(normalResult.statusMessage).toContain('Normal conduction');
    expect(normalResult.components.find((c) => c.type === 'led')?.isBurnedOut).toBeFalsy();

    // Overdrive: 12V through 10 ohm: (12 - 2) / 10 = 1000 mA -> Burned out
    const overdrivenComponents = ohmsPreset.components.map((c) => {
      if (c.type === 'dc_source') return { ...c, value: 12.0 };
      if (c.type === 'resistor') return { ...c, value: 10 };
      return c;
    });

    const burnedResult = solveCircuitStep(ohmsPreset, overdrivenComponents, 0, 0.05);
    expect(burnedResult.statusMessage).toContain('OVER-CURRENT WARNING');
    expect(burnedResult.components.find((c) => c.type === 'led')?.isBurnedOut).toBe(true);
  });

  it('renders ActualHardwareSimulator with interactive schematic and digital oscilloscope', () => {
    act(() => {
      root.render(<ActualHardwareSimulator />);
    });

    expect(container.textContent).toContain('REAL SPICE HARDWARE SIMULATOR');
    expect(container.textContent).toContain('Actual Interactive Circuit & Component Physics Simulator');
    expect(container.textContent).toContain('Interactive Circuit Schematic');
    expect(container.textContent).toContain('Benchtop Digital Multimeter');
    expect(container.textContent).toContain('Digital Storage Oscilloscope');
    expect(container.textContent).toContain('TRUE RMS DC');

    // Switch experiment to 555 Timer
    const selectEl = container.querySelector('select[aria-label="Select circuit experiment"]') as HTMLSelectElement;
    expect(selectEl).toBeDefined();

    act(() => {
      selectEl.value = 'timer-555-astable';
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('NE555 Precision Timer Astable Multivibrator');
    expect(container.textContent).toContain('f = \\frac{1.44}{(R_1 + 2R_2) \\cdot C_1}');
  });

  it('parses Berkeley SPICE netlist syntax and executes full bridge rectifier simulation', () => {
    const preset = FALSTAD_PRESETS[0]!;
    const elements = parseSpiceNetlist(preset.spiceNetlist);
    expect(elements.length).toBeGreaterThan(3);
    expect(elements.some((e) => e.label === 'VAC')).toBe(true);
    expect(elements.some((e) => e.label === 'C1')).toBe(true);

    const stepResult = solveCircuitJsStep(preset.id, elements, 0.01, 0.0002);
    expect(stepResult.nodeVoltages['DC_POS']).toBeDefined();
    expect(stepResult.sourceWaveform).toBeDefined();
    expect(stepResult.outputWaveform).toBeGreaterThan(0);
  });

  it('renders FalstadSimulator with moving current canvas and SPICE netlist editor', () => {
    act(() => {
      root.render(<FalstadSimulator />);
    });

    expect(container.textContent).toContain('FALSTAD & NGSPICE ENGINE');
    expect(container.textContent).toContain('Visual Interactive Electronics & SPICE Circuit Simulator');
    expect(container.textContent).toContain('Falstad Visual Current & Voltage Animation Canvas');
    expect(container.textContent).toContain('Full-Wave Bridge Rectifier & Filter Capacitor');

    // Switch to SPICE Deck tab
    const spiceTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('SPICE Netlist Deck')
    );
    expect(spiceTab).toBeDefined();

    act(() => {
      spiceTab?.click();
    });

    expect(container.textContent).toContain('Berkeley SPICE / ngspice Netlist Deck');
    expect(container.textContent).toContain('Standard SPICE 3f5');
    expect(container.textContent).toContain('D1N4007');

    // Switch to Waveform Scope tab
    const scopeTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Transient Waveform Scope')
    );
    expect(scopeTab).toBeDefined();

    act(() => {
      scopeTab?.click();
    });

    expect(container.textContent).toContain('Dual-Trace Transient Voltage Waveforms');
    expect(container.textContent).toContain('Channel 1: AC Source Input');
    expect(container.textContent).toContain('Channel 2: Rectified / Filtered Output');
  });

  it('runs HDL simulation engine and verifies register transitions for all 3 topologies', () => {
    // 1. 4-bit Counter
    const counterPreset = HDL_PRESETS.find((p) => p.id === 'counter-4bit')!;
    const counterSignals = runHdlSimulation(counterPreset);
    expect(counterSignals.length).toBe(5);
    const qSignal = counterSignals.find((s) => s.name === 'q[3:0]');
    expect(qSignal).toBeDefined();
    expect(qSignal!.history.length).toBeGreaterThan(10);
    // Initial reset state
    expect(qSignal!.history[0]?.value).toBe('0x0');

    // 2. FSM Traffic Light
    const fsmPreset = HDL_PRESETS.find((p) => p.id === 'fsm-traffic-light')!;
    const fsmSignals = runHdlSimulation(fsmPreset);
    expect(fsmSignals.length).toBe(4);
    const stateSignal = fsmSignals.find((s) => s.name === 'state[1:0]');
    expect(stateSignal).toBeDefined();
    expect(stateSignal!.history.some((h) => h.value === 'GREEN')).toBe(true);

    // 3. 8-bit ALU
    const aluPreset = HDL_PRESETS.find((p) => p.id === 'alu-8bit')!;
    const aluSignals = runHdlSimulation(aluPreset);
    expect(aluSignals.length).toBe(6);
    const resultSignal = aluSignals.find((s) => s.name === 'result[7:0]');
    expect(resultSignal).toBeDefined();
    expect(resultSignal!.history.some((h) => h.value === '0x23')).toBe(true); // 35 = 0x23
  });

  it('generates valid IEEE 1364 Value Change Dump (VCD) file for GTKWave', () => {
    const counterPreset = HDL_PRESETS[0]!;
    const signals = runHdlSimulation(counterPreset);
    const vcd = generateVcdFile(counterPreset, signals);

    expect(vcd).toContain('$date');
    expect(vcd).toContain('$timescale 1ns $end');
    expect(vcd).toContain('$scope module counter-4bit $end');
    expect(vcd).toContain('$var wire');
    expect(vcd).toContain('$upscope $end');
    expect(vcd).toContain('$enddefinitions $end');
    expect(vcd).toContain('$dumpvars');
    expect(vcd).toContain('#0');
  });

  it('renders HdlSimulator with waveform viewer, timing diagram, and Verilog editor', () => {
    act(() => {
      root.render(<HdlSimulator />);
    });

    expect(container.textContent).toContain('Hardware Description Language (HDL) Digital Simulator');
    expect(container.textContent).toContain('Digital Logic Waveform Viewer (GTKWave / ModelSim Style)');
    expect(container.textContent).toContain('4-Bit Synchronous Binary Up-Counter');
    expect(container.textContent).toContain('4 LUT6');
    expect(container.textContent).toContain('4 D-FFs');
    expect(container.textContent).toContain('IEEE 1364 Timebase');

    // Test switching preset to FSM
    const fsmButton = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Finite State Machine')
    );
    expect(fsmButton).toBeDefined();

    act(() => {
      fsmButton?.click();
    });

    expect(container.textContent).toContain('Finite State Machine (FSM) Traffic Light Controller');
    expect(container.textContent).toContain('12 LUT6');
    expect(container.textContent).toContain('6 D-FFs');

    // Test clicking Verilog / VCD tab
    const codeTab = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Verilog / VCD'
    );
    expect(codeTab).toBeDefined();

    act(() => {
      codeTab?.click();
    });

    expect(container.textContent).toContain('Design Module (Verilog)');
    expect(container.textContent).toContain('traffic_light_fsm');
  });

  it('parses RISC-V assembly and executes cycle-accurate instruction steps in ISS engine', () => {
    const fibPreset = ISS_PRESETS.find((p) => p.id === 'fibonacci')!;
    const instructions = parseAssembly(fibPreset.sourceCode);

    expect(instructions.length).toBeGreaterThan(5);
    expect(instructions[0]?.mnemonic).toBe('ADDI');
    expect(instructions[0]?.address).toBe(0x0000);
    expect(instructions[0]?.machineCode).toBeDefined();

    let state = initCpuState(fibPreset);
    expect(state.pc).toBe(0x0000);
    expect(state.cycles).toBe(0);

    // Step 1: addi t0, zero, 0x1000
    state = stepCpu(state, instructions);
    expect(state.pc).toBe(0x0004);
    expect(state.cycles).toBe(1);
    expect(state.registers[5]).toBe(0x1000); // t0 is x5

    // Step 2: addi a0, zero, 0
    state = stepCpu(state, instructions);
    expect(state.registers[10]).toBe(0); // a0 is x10

    // Step 3: addi a1, zero, 1
    state = stepCpu(state, instructions);
    expect(state.registers[11]).toBe(1); // a1 is x11

    // Step 4: addi t1, zero, 7
    state = stepCpu(state, instructions);
    expect(state.registers[6]).toBe(7); // t1 is x6
  });

  it('executes full array summation and stores final accumulated sum to data memory', () => {
    const arrayPreset = ISS_PRESETS.find((p) => p.id === 'array-sum')!;
    const instructions = parseAssembly(arrayPreset.sourceCode);

    let state = initCpuState(arrayPreset);

    // Run until halted or max 200 steps
    let steps = 0;
    while (!state.isHalted && steps < 200) {
      state = stepCpu(state, instructions);
      steps++;
    }

    expect(state.isHalted).toBe(true);
    // s0 (x8) should have accumulated sum: 10 + 25 + 40 + 5 + 100 = 180
    expect(state.registers[8]).toBe(180);
    // Memory at 0x1014 should be stored with 180
    expect(state.memory[0x1014]).toBe(180);
  });

  it('renders IssSimulator with 32 registers, 5-stage pipeline, memory inspector, and controls', () => {
    act(() => {
      root.render(<IssSimulator />);
    });

    expect(container.textContent).toContain('RISC-V Instruction Set Simulator (ISS) Studio');
    expect(container.textContent).toContain('Classic 5-Stage RISC Microarchitecture Pipeline');
    expect(container.textContent).toContain('RV32I Architectural Register File (32 × 32-Bit)');
    expect(container.textContent).toContain('Data RAM Segment & Hex Memory Inspector');
    expect(container.textContent).toContain('Disassembled Machine Code');
    expect(container.textContent).toContain('zero');
    expect(container.textContent).toContain('sp');

    // Test clicking Step Single Clock button
    const stepBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Step Single Clock')
    );
    expect(stepBtn).toBeDefined();

    act(() => {
      stepBtn?.click();
    });

    expect(container.textContent).toContain('CYCLES:');
    expect(container.textContent).toContain('RETIRED:');

    // Test switching preset to Array Summation
    const arrayBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Array Summation')
    );
    expect(arrayBtn).toBeDefined();

    act(() => {
      arrayBtn?.click();
    });

    expect(container.textContent).toContain('Array Summation & Memory Load/Store (LW / SW)');
    expect(container.textContent).toContain('0x000000B4');
  });
});
