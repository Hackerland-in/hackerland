export type ComponentType =
  | 'dc_source'
  | 'resistor'
  | 'potentiometer'
  | 'led'
  | 'capacitor'
  | 'switch'
  | 'transistor_npn'
  | 'timer_555'
  | 'logic_gate';

export interface CircuitNode {
  id: string;
  voltage: number;
}

export interface CircuitComponentState {
  id: string;
  name: string;
  type: ComponentType;
  value: number; // Resistance in Ohms, Capacitance in Farads, Voltage in Volts
  unit: string;
  nodeA: string;
  nodeB: string;
  nodeC?: string; // e.g. base for transistor or output for gate
  currentMa: number;
  voltageDrop: number;
  powerMw: number;
  isBurnedOut?: boolean;
  isActive?: boolean;
  extraState?: Record<string, unknown>;
}

export interface CircuitPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  theory: string;
  formula: string;
  components: CircuitComponentState[];
  nodes: string[];
}

export const CIRCUIT_PRESETS: CircuitPreset[] = [
  {
    id: 'ohms-law-led',
    title: "Ohm's Law & LED Current Limiting",
    category: 'Foundations',
    description: 'Direct current circuit demonstrating V = I * R and LED forward bias characteristics.',
    theory: 'An LED requires a forward voltage drop (V_f ≈ 2.0V) and safe operating current (10mA - 25mA). If current exceeds 35mA without an adequate series resistor, the semiconductor junction overheats and burns out.',
    formula: 'R_{limit} = \\frac{V_{source} - V_f}{I_{desired}}',
    nodes: ['VCC', 'N_LED', 'GND'],
    components: [
      { id: 'v1', name: 'DC Voltage Source', type: 'dc_source', value: 5.0, unit: 'V', nodeA: 'VCC', nodeB: 'GND', currentMa: 0, voltageDrop: 5.0, powerMw: 0 },
      { id: 'sw1', name: 'SPST Switch', type: 'switch', value: 1, unit: 'STATE', nodeA: 'VCC', nodeB: 'N_SW', currentMa: 0, voltageDrop: 0, powerMw: 0, isActive: true },
      { id: 'r1', name: 'Current Limiting Resistor', type: 'resistor', value: 220, unit: 'Ω', nodeA: 'N_SW', nodeB: 'N_LED', currentMa: 0, voltageDrop: 0, powerMw: 0 },
      { id: 'led1', name: 'Gallium Phosphide Red LED', type: 'led', value: 2.0, unit: 'V_f', nodeA: 'N_LED', nodeB: 'GND', currentMa: 0, voltageDrop: 2.0, powerMw: 0, isActive: true },
    ],
  },
  {
    id: 'rc-charging',
    title: 'RC Low-Pass Filter & Capacitor Charging Curve',
    category: 'Transient Dynamics',
    description: 'Exponential charging and discharging of an electrolytic capacitor through a resistor.',
    theory: 'When voltage is applied, charge accumulates on capacitor plates exponentially governed by time constant τ = R * C. At t = 1τ, voltage reaches 63.2% of supply. At t = 5τ, it reaches 99.3% (fully charged).',
    formula: 'V(t) = V_{max} \\left(1 - e^{-t / RC}\\right)',
    nodes: ['VCC', 'N_RC', 'GND'],
    components: [
      { id: 'v1', name: 'DC Voltage Source', type: 'dc_source', value: 5.0, unit: 'V', nodeA: 'VCC', nodeB: 'GND', currentMa: 0, voltageDrop: 5.0, powerMw: 0 },
      { id: 'sw1', name: 'Charge/Discharge Switch', type: 'switch', value: 1, unit: 'STATE', nodeA: 'VCC', nodeB: 'N_SW', currentMa: 0, voltageDrop: 0, powerMw: 0, isActive: true },
      { id: 'r1', name: 'Charging Resistor', type: 'resistor', value: 10000, unit: 'Ω', nodeA: 'N_SW', nodeB: 'N_RC', currentMa: 0, voltageDrop: 0, powerMw: 0 },
      { id: 'c1', name: 'Filter Capacitor', type: 'capacitor', value: 0.0001, unit: 'F (100μF)', nodeA: 'N_RC', nodeB: 'GND', currentMa: 0, voltageDrop: 0, powerMw: 0, extraState: { chargeVoltage: 0.0 } },
    ],
  },
  {
    id: 'timer-555-astable',
    title: 'NE555 Precision Timer Astable Multivibrator',
    category: 'Oscillators & Clocks',
    description: 'Hardware square wave generator producing continuous clock pulses for microcontrollers.',
    theory: 'The internal comparator triggers flip-flop transitions between 1/3 VCC and 2/3 VCC. Capacitor C1 charges through (R1 + R2) and discharges through R2 into pin 7 (Discharge transistor).',
    formula: 'f = \\frac{1.44}{(R_1 + 2R_2) \\cdot C_1}',
    nodes: ['VCC', 'OUT', 'GND'],
    components: [
      { id: 'v1', name: 'DC Supply', type: 'dc_source', value: 5.0, unit: 'V', nodeA: 'VCC', nodeB: 'GND', currentMa: 0, voltageDrop: 5.0, powerMw: 0 },
      { id: 'r1', name: 'Timing Resistor R1', type: 'resistor', value: 4700, unit: 'Ω', nodeA: 'VCC', nodeB: 'N_R1', currentMa: 0, voltageDrop: 0, powerMw: 0 },
      { id: 'r2', name: 'Timing Resistor R2', type: 'resistor', value: 10000, unit: 'Ω', nodeA: 'N_R1', nodeB: 'N_C1', currentMa: 0, voltageDrop: 0, powerMw: 0 },
      { id: 'c1', name: 'Timing Capacitor C1', type: 'capacitor', value: 0.00001, unit: 'F (10μF)', nodeA: 'N_C1', nodeB: 'GND', currentMa: 0, voltageDrop: 0, powerMw: 0, extraState: { chargeVoltage: 2.5 } },
      { id: 't555', name: 'NE555 Timer IC', type: 'timer_555', value: 5.0, unit: 'V', nodeA: 'VCC', nodeB: 'OUT', nodeC: 'GND', currentMa: 12, voltageDrop: 0, powerMw: 60, isActive: true },
      { id: 'led1', name: 'Output Pulse LED', type: 'led', value: 2.0, unit: 'V_f', nodeA: 'OUT', nodeB: 'GND', currentMa: 0, voltageDrop: 2.0, powerMw: 0, isActive: true },
    ],
  },
  {
    id: 'transistor-switch',
    title: 'BJT NPN Transistor High-Current Switch',
    category: 'Power Electronics',
    description: 'Using a small 3.3V microcontroller logic signal to drive a high-power 12V inductive motor load.',
    theory: 'A 2N2222 NPN transistor operates in saturation mode. A tiny base current (Ib ≈ 2mA) drives collector into saturation, switching 500mA through the motor. A 1N4007 flyback diode prevents inductive back-EMF spike damage.',
    formula: 'I_c = \\beta \\cdot I_b \\quad (\\text{Saturation condition: } I_b > \\frac{I_c}{\\beta_{sat}})',
    nodes: ['VCC_12V', 'V_LOGIC', 'N_BASE', 'N_COLLECTOR', 'GND'],
    components: [
      { id: 'v1', name: '12V Motor Rail', type: 'dc_source', value: 12.0, unit: 'V', nodeA: 'VCC_12V', nodeB: 'GND', currentMa: 0, voltageDrop: 12.0, powerMw: 0 },
      { id: 'v2', name: '3.3V Logic Signal', type: 'dc_source', value: 3.3, unit: 'V', nodeA: 'V_LOGIC', nodeB: 'GND', currentMa: 0, voltageDrop: 3.3, powerMw: 0 },
      { id: 'rb', name: 'Base Current Resistor', type: 'resistor', value: 1000, unit: 'Ω', nodeA: 'V_LOGIC', nodeB: 'N_BASE', currentMa: 0, voltageDrop: 0, powerMw: 0 },
      { id: 'q1', name: '2N2222 NPN BJT Transistor', type: 'transistor_npn', value: 100, unit: 'hFE', nodeA: 'N_COLLECTOR', nodeB: 'N_BASE', nodeC: 'GND', currentMa: 0, voltageDrop: 0.2, powerMw: 0, isActive: true },
      { id: 'm1', name: 'DC Motor / Inductive Coil', type: 'resistor', value: 40, unit: 'Ω (Load)', nodeA: 'VCC_12V', nodeB: 'N_COLLECTOR', currentMa: 0, voltageDrop: 0, powerMw: 0 },
    ],
  },
];

export interface SimulationStepResult {
  nodeVoltages: Record<string, number>;
  components: CircuitComponentState[];
  oscillatorVoltage: number;
  frequencyHz?: number;
  statusMessage: string;
}

export function solveCircuitStep(
  preset: CircuitPreset,
  components: CircuitComponentState[],
  timeSec: number,
  stepDeltaSec = 0.05
): SimulationStepResult {
  const updatedComponents = components.map((c) => ({ ...c }));
  const nodeVoltages: Record<string, number> = { GND: 0.0 };

  const dcSource = updatedComponents.find((c) => c.type === 'dc_source');
  const supplyVoltage = dcSource ? dcSource.value : 5.0;
  nodeVoltages['VCC'] = supplyVoltage;
  nodeVoltages['VCC_12V'] = 12.0;
  nodeVoltages['V_LOGIC'] = 3.3;

  let oscVoltage = 0.0;
  let frequencyHz = 0;
  let statusMessage = 'Nominal operation';

  if (preset.id === 'ohms-law-led') {
    const sw = updatedComponents.find((c) => c.id === 'sw1');
    const r1 = updatedComponents.find((c) => c.id === 'r1');
    const led = updatedComponents.find((c) => c.id === 'led1');

    const isClosed = sw ? sw.value === 1 : true;

    if (!isClosed) {
      nodeVoltages['N_SW'] = 0;
      nodeVoltages['N_LED'] = 0;
      if (r1) { r1.currentMa = 0; r1.voltageDrop = 0; r1.powerMw = 0; }
      if (led) { led.currentMa = 0; led.voltageDrop = 0; led.powerMw = 0; led.isActive = false; }
      statusMessage = 'Switch OPEN: Zero current flowing.';
    } else {
      nodeVoltages['N_SW'] = supplyVoltage;
      const resistance = Math.max(1, r1 ? r1.value : 220);
      const vf = led ? led.value : 2.0;

      if (supplyVoltage <= vf) {
        // Forward voltage not reached
        nodeVoltages['N_LED'] = supplyVoltage;
        if (r1) { r1.currentMa = 0; r1.voltageDrop = 0; r1.powerMw = 0; }
        if (led) { led.currentMa = 0; led.voltageDrop = 0; led.powerMw = 0; led.isActive = false; }
        statusMessage = `Under-voltage: ${supplyVoltage}V is below LED threshold (V_f = ${vf}V).`;
      } else {
        const currentA = (supplyVoltage - vf) / resistance;
        const currentMa = +(currentA * 1000).toFixed(1);

        nodeVoltages['N_LED'] = vf;

        if (r1) {
          r1.currentMa = currentMa;
          r1.voltageDrop = +(supplyVoltage - vf).toFixed(2);
          r1.powerMw = +(currentA * (supplyVoltage - vf) * 1000).toFixed(1);
        }

        if (led) {
          led.currentMa = currentMa;
          led.voltageDrop = vf;
          led.powerMw = +(currentA * vf * 1000).toFixed(1);
          led.isActive = currentMa > 1;

          if (currentMa > 35) {
            led.isBurnedOut = true;
            statusMessage = `OVER-CURRENT WARNING: ${currentMa}mA exceeded max LED rating (30mA)! Junction destroyed.`;
          } else {
            led.isBurnedOut = false;
            statusMessage = `Normal conduction: ${currentMa}mA current flowing (LED brightness: ${Math.min(100, Math.round((currentMa / 25) * 100))}%).`;
          }
        }
      }
    }
    oscVoltage = nodeVoltages['N_LED'] ?? 0;
  } else if (preset.id === 'rc-charging') {
    const sw = updatedComponents.find((c) => c.id === 'sw1');
    const r1 = updatedComponents.find((c) => c.id === 'r1');
    const c1 = updatedComponents.find((c) => c.id === 'c1');

    const isCharging = sw ? sw.value === 1 : true;
    const rVal = r1 ? r1.value : 10000;
    const cVal = c1 ? c1.value : 0.0001;
    const tau = rVal * cVal; // Time constant in seconds

    let currentVc = (c1?.extraState?.chargeVoltage as number) ?? 0.0;

    if (isCharging) {
      // Exponential charge towards supplyVoltage: dV = (V_target - V) * (dt / tau)
      currentVc += (supplyVoltage - currentVc) * (stepDeltaSec / Math.max(0.01, tau));
      if (currentVc > supplyVoltage) currentVc = supplyVoltage;
    } else {
      // Discharge towards 0V
      currentVc -= currentVc * (stepDeltaSec / Math.max(0.01, tau));
      if (currentVc < 0) currentVc = 0;
    }

    if (c1) {
      c1.extraState = { chargeVoltage: currentVc };
      c1.voltageDrop = +currentVc.toFixed(2);
      c1.currentMa = +(((supplyVoltage - currentVc) / rVal) * 1000).toFixed(2);
    }
    if (r1) {
      r1.voltageDrop = +(supplyVoltage - currentVc).toFixed(2);
      r1.currentMa = +(((supplyVoltage - currentVc) / rVal) * 1000).toFixed(2);
    }

    nodeVoltages['N_RC'] = +currentVc.toFixed(2);
    oscVoltage = currentVc;
    statusMessage = `Capacitor: ${currentVc.toFixed(2)}V (${((currentVc / supplyVoltage) * 100).toFixed(0)}% charged, τ = ${tau.toFixed(2)}s).`;
  } else if (preset.id === 'timer-555-astable') {
    const r1 = updatedComponents.find((c) => c.id === 'r1')?.value ?? 4700;
    const r2 = updatedComponents.find((c) => c.id === 'r2')?.value ?? 10000;
    const c1 = updatedComponents.find((c) => c.id === 'c1')?.value ?? 0.00001;

    frequencyHz = +(1.44 / ((r1 + 2 * r2) * c1)).toFixed(1);
    const period = 1 / Math.max(0.1, frequencyHz);
    const timeInPeriod = timeSec % period;
    const dutyCycle = (r1 + r2) / (r1 + 2 * r2);
    const isHigh = timeInPeriod < period * dutyCycle;

    oscVoltage = isHigh ? supplyVoltage - 0.2 : 0.1;
    nodeVoltages['OUT'] = +oscVoltage.toFixed(2);

    const led = updatedComponents.find((c) => c.id === 'led1');
    if (led) {
      led.isActive = isHigh;
      led.voltageDrop = isHigh ? 2.0 : 0;
      led.currentMa = isHigh ? 15.0 : 0;
    }

    statusMessage = `555 Oscillation at ${frequencyHz} Hz (Duty Cycle: ${(dutyCycle * 100).toFixed(1)}%). State: ${isHigh ? 'HIGH (3V3)' : 'LOW (0V)'}`;
  } else if (preset.id === 'transistor-switch') {
    const vLogic = 3.3;
    const rb = updatedComponents.find((c) => c.id === 'rb')?.value ?? 1000;
    const mLoad = updatedComponents.find((c) => c.id === 'm1')?.value ?? 40;

    const ibMa = +(((vLogic - 0.7) / rb) * 1000).toFixed(2); // Vbe ≈ 0.7V
    const vceSat = 0.2;
    const icMa = +(((12.0 - vceSat) / mLoad) * 1000).toFixed(1);

    nodeVoltages['N_BASE'] = 0.7;
    nodeVoltages['N_COLLECTOR'] = vceSat;

    const q1 = updatedComponents.find((c) => c.id === 'q1');
    if (q1) {
      q1.currentMa = icMa;
      q1.voltageDrop = vceSat;
      q1.powerMw = +(icMa * vceSat).toFixed(1);
    }

    const m1 = updatedComponents.find((c) => c.id === 'm1');
    if (m1) {
      m1.currentMa = icMa;
      m1.voltageDrop = 12.0 - vceSat;
      m1.powerMw = +(icMa * (12.0 - vceSat)).toFixed(1);
    }

    oscVoltage = vceSat;
    statusMessage = `BJT Saturated: Base current ${ibMa}mA drives Collector load ${icMa}mA (Motor spinning).`;
  }

  return {
    nodeVoltages,
    components: updatedComponents,
    oscillatorVoltage: oscVoltage,
    frequencyHz,
    statusMessage,
  };
}
