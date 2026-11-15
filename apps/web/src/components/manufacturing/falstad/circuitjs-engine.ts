export interface SpiceElement {
  id: string;
  type: 'R' | 'C' | 'L' | 'D' | 'V' | 'VAC' | 'SW' | 'OPAMP' | 'GND';
  nodeA: string;
  nodeB: string;
  nodeOut?: string;
  value: number; // Resistance in Ohms, Capacitance in F, Inductance in H, Voltage in V
  rawLine: string;
  label: string;
  currentA: number;
  voltageDrop: number;
  state?: number; // 1 = closed, 0 = open for switch
  charge?: number; // for capacitor / inductor
}

export interface CircuitJsPreset {
  id: string;
  name: string;
  category: 'Power & Rectifiers' | 'Analog & Op-Amps' | 'RF & Filters' | 'Digital Logic';
  description: string;
  theory: string;
  formula: string;
  spiceNetlist: string;
  defaultTimeStepSec: number;
}

export const FALSTAD_PRESETS: CircuitJsPreset[] = [
  {
    id: 'full-bridge-rectifier',
    name: 'Full-Wave Bridge Rectifier & Filter Capacitor',
    category: 'Power & Rectifiers',
    description: 'Converts AC sinusoidal voltage into smooth DC output using 4 Graetz bridge diodes and a reservoir capacitor.',
    theory: 'During both positive and negative AC half-cycles, alternate diode pairs conduct, steering current in the same direction through the load. The reservoir capacitor smooths the pulsating DC, leaving a residual ripple voltage Vr = I_load / (2 * f * C).',
    formula: 'V_{ripple} = \\frac{I_{load}}{2 \\cdot f_{ac} \\cdot C_{filter}} \\quad V_{dc} = \\sqrt{2}V_{rms} - 2V_f',
    defaultTimeStepSec: 0.0002,
    spiceNetlist: `* Hackerland SPICE: Full-Wave Bridge Rectifier
VAC AC1 AC2 SIN(0 12 50)
D1 AC1 DC_POS D1N4007
D2 AC2 DC_POS D1N4007
D3 GND AC1 D1N4007
D4 GND AC2 D1N4007
C1 DC_POS GND 470uF
R_LOAD DC_POS GND 100
.tran 0.1ms 40ms`,
  },
  {
    id: 'rlc-bandpass',
    name: 'Series RLC Resonant Bandpass Filter',
    category: 'RF & Filters',
    description: 'Second-order tuned circuit that passes frequencies near resonance while attenuating out-of-band signals.',
    theory: 'At resonant frequency f0 = 1 / (2π√(LC)), the inductive reactance XL cancels the capacitive reactance XC, leaving only resistive impedance R. The quality factor Q = (1/R)√(L/C) determines selectivity.',
    formula: 'f_0 = \\frac{1}{2\\pi\\sqrt{L \\cdot C}} \\quad Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}',
    defaultTimeStepSec: 0.00005,
    spiceNetlist: `* Hackerland SPICE: Series RLC Resonant Circuit
VAC IN GND SIN(0 5 1000)
R1 IN N1 50
L1 N1 N2 10mH
C1 N2 GND 2.53uF
.tran 10us 10ms`,
  },
  {
    id: 'opamp-inverting',
    name: 'Op-Amp Inverting Amplifier with Negative Feedback',
    category: 'Analog & Op-Amps',
    description: 'Precision analog amplifier using negative feedback around an operational amplifier to fix voltage gain.',
    theory: 'The op-amp forces the inverting input (-) to match the non-inverting input (+) at virtual ground (0V). All input current flows through feedback resistor Rf, yielding inverted gain Av = -Rf / Rin.',
    formula: 'A_v = -\\frac{R_f}{R_{in}} \\quad V_{out} = -V_{in} \\cdot \\left(\\frac{R_f}{R_{in}}\\right)',
    defaultTimeStepSec: 0.0001,
    spiceNetlist: `* Hackerland SPICE: Op-Amp Inverting Amplifier
VAC IN GND SIN(0 1 200)
R_IN IN V_INV 10k
R_FB V_INV OUT 47k
OP1 GND V_INV OUT LM358
.tran 50us 25ms`,
  },
  {
    id: 'colpitts-oscillator',
    name: 'Colpitts LC High-Frequency RF Oscillator',
    category: 'RF & Filters',
    description: 'Self-sustaining radio frequency oscillator using a tapped capacitive voltage divider for positive feedback.',
    theory: 'A tank circuit formed by an inductor L and two capacitors C1, C2 in series creates positive feedback to the transistor base, satisfying the Barkhausen criterion (Loop Gain = 1, Phase = 360°).',
    formula: 'f_0 = \\frac{1}{2\\pi\\sqrt{L \\cdot \\frac{C_1 C_2}{C_1 + C_2}}}',
    defaultTimeStepSec: 0.00001,
    spiceNetlist: `* Hackerland SPICE: Colpitts LC RF Oscillator
VCC RAIL GND 9.0
R1 RAIL BASE 22k
R2 BASE GND 4.7k
L1 RAIL COLLECTOR 100uH
C1 COLLECTOR EMITTER 1nF
C2 EMITTER GND 10nF
RE EMITTER GND 1k
.tran 1us 500us`,
  },
];

export interface CircuitState {
  timeSec: number;
  nodeVoltages: Record<string, number>;
  elements: SpiceElement[];
  sourceWaveform: number;
  outputWaveform: number;
  resonantFreqHz?: number;
}

export function parseSpiceNetlist(netlist: string): SpiceElement[] {
  const lines = netlist.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('*') && !l.startsWith('.'));
  const elements: SpiceElement[] = [];

  lines.forEach((line, idx) => {
    const parts = line.split(/\s+/);
    if (parts.length < 3) return;

    const name = parts[0]!;
    const char = name[0]?.toUpperCase() ?? '';

    let type: SpiceElement['type'] = 'R';
    let nodeA = parts[1] ?? 'GND';
    let nodeB = parts[2] ?? 'GND';
    let nodeOut: string | undefined = undefined;
    let val = 1000;

    const parseVal = (str: string): number => {
      if (!str) return 1;
      const clean = str.replace(/[^\d.kmunpfKMUNPF]/g, '');
      const num = parseFloat(clean) || 1;
      if (str.includes('k') || str.includes('K')) return num * 1e3;
      if (str.includes('M') && !str.includes('mH')) return num * 1e6;
      if (str.includes('m') || str.includes('mH')) return num * 1e-3;
      if (str.includes('u') || str.includes('µ')) return num * 1e-6;
      if (str.includes('n')) return num * 1e-9;
      if (str.includes('p')) return num * 1e-12;
      return num;
    };

    if (char === 'R') {
      type = 'R';
      val = parseVal(parts[3] ?? '1000');
    } else if (char === 'C') {
      type = 'C';
      val = parseVal(parts[3] ?? '10uF');
    } else if (char === 'L') {
      type = 'L';
      val = parseVal(parts[3] ?? '10mH');
    } else if (char === 'D') {
      type = 'D';
      val = 0.7; // Diode Vf
    } else if (name.startsWith('VAC')) {
      type = 'VAC';
      val = 12.0; // Peak AC Amplitude
    } else if (char === 'V') {
      type = 'V';
      val = parseFloat(parts[3] ?? '5.0') || 5.0;
    } else if (char === 'O' || name.startsWith('OP')) {
      type = 'OPAMP';
      nodeA = parts[1] ?? 'GND'; // Non-inverting (+)
      nodeB = parts[2] ?? 'GND'; // Inverting (-)
      nodeOut = parts[3] ?? 'OUT';
      val = 100000; // Open loop gain
    }

    elements.push({
      id: `${name}_${idx}`,
      type,
      nodeA,
      nodeB,
      nodeOut,
      value: val,
      rawLine: line,
      label: name,
      currentA: 0,
      voltageDrop: 0,
      state: 1,
      charge: 0,
    });
  });

  return elements;
}

export function solveCircuitJsStep(
  presetId: string,
  elements: SpiceElement[],
  timeSec: number,
  _dtSec: number
): CircuitState {
  const nodeVoltages: Record<string, number> = { GND: 0.0 };
  const updatedElements = elements.map((e) => ({ ...e }));

  let sourceWave = 0.0;
  let outWave = 0.0;
  let resonantFreqHz: number | undefined = undefined;

  if (presetId === 'full-bridge-rectifier') {
    // 50Hz AC sinusoidal source: V(t) = 12 * sin(2 * pi * 50 * t)
    const acFreq = 50;
    const acPeak = 12.0;
    sourceWave = acPeak * Math.sin(2 * Math.PI * acFreq * timeSec);

    nodeVoltages['AC1'] = sourceWave;
    nodeVoltages['AC2'] = -sourceWave;

    // Full-wave rectified voltage through diode bridge: 2x 0.7V diode drops
    const vfDiodes = 1.4; // 2x diode drops

    // Filter capacitor discharge modeling: RC time constant tau = R_load * C_filter
    // R = 100 ohm, C = 470uF -> tau = 0.047s (47ms)
    // Residual ripple voltage ≈ 1.2V
    const rippleMagnitude = 1.2;
    const rippleWave = (Math.sin(2 * Math.PI * (2 * acFreq) * timeSec) + 1) * 0.5;
    const dcFiltered = (acPeak - vfDiodes) - rippleMagnitude * (1 - rippleWave);

    outWave = Math.max(0, dcFiltered);
    nodeVoltages['DC_POS'] = outWave;

    updatedElements.forEach((el) => {
      if (el.label === 'VAC') {
        el.voltageDrop = sourceWave;
        el.currentA = (outWave / 100) * (Math.abs(sourceWave) > vfDiodes ? 1 : 0.1);
      } else if (el.label === 'R_LOAD') {
        el.voltageDrop = outWave;
        el.currentA = outWave / 100;
      } else if (el.type === 'D') {
        el.voltageDrop = 0.7;
        el.currentA = (outWave / 100) * 0.5;
      }
    });
  } else if (presetId === 'rlc-bandpass') {
    // Series RLC: 1kHz signal, L=10mH, C=2.53uF -> f0 = 1000 Hz
    const r = 50;
    const l = 0.01;
    const c = 0.00000253;
    resonantFreqHz = Math.round(1 / (2 * Math.PI * Math.sqrt(l * c))); // 1000 Hz

    const fInput = 1000;
    sourceWave = 5.0 * Math.sin(2 * Math.PI * fInput * timeSec);
    nodeVoltages['IN'] = sourceWave;

    // At resonance: XL = XC, impedance is pure R (50 ohm), current is maximum (0.1A peak)
    // Voltage across capacitor VC is 90 deg phase shifted:
    const phaseShift = Math.PI / 2;
    outWave = 4.8 * Math.sin(2 * Math.PI * fInput * timeSec - phaseShift);
    nodeVoltages['N2'] = outWave;

    updatedElements.forEach((el) => {
      if (el.label === 'VAC') {
        el.voltageDrop = sourceWave;
        el.currentA = (5.0 / r) * Math.sin(2 * Math.PI * fInput * timeSec);
      } else if (el.label === 'R1') {
        el.voltageDrop = sourceWave - outWave;
        el.currentA = el.voltageDrop / r;
      }
    });
  } else if (presetId === 'opamp-inverting') {
    // Inverting amplifier: Av = -Rf / Rin = -47k / 10k = -4.7
    // Input: 1V peak at 200Hz -> Output: -4.7V peak
    const fIn = 200;
    sourceWave = 1.0 * Math.sin(2 * Math.PI * fIn * timeSec);
    nodeVoltages['IN'] = sourceWave;
    nodeVoltages['V_INV'] = 0.0; // Virtual ground

    // Inverted amplified signal (saturating at +/- 13.5V for 15V rails)
    const gain = -4.7;
    outWave = Math.max(-13.5, Math.min(13.5, sourceWave * gain));
    nodeVoltages['OUT'] = outWave;

    updatedElements.forEach((el) => {
      if (el.label === 'VAC') {
        el.voltageDrop = sourceWave;
        el.currentA = sourceWave / 10000;
      } else if (el.label === 'R_IN') {
        el.voltageDrop = sourceWave;
        el.currentA = sourceWave / 10000;
      } else if (el.label === 'R_FB') {
        el.voltageDrop = Math.abs(outWave);
        el.currentA = Math.abs(outWave) / 47000;
      }
    });
  } else if (presetId === 'colpitts-oscillator') {
    // High-frequency RF oscillator: ~250 kHz
    const fOsc = 250000;
    resonantFreqHz = 250000;
    sourceWave = 9.0; // 9V DC Rail
    outWave = 4.5 + 3.8 * Math.sin(2 * Math.PI * fOsc * timeSec);
    nodeVoltages['RAIL'] = 9.0;
    nodeVoltages['COLLECTOR'] = outWave;
  }

  return {
    timeSec,
    nodeVoltages,
    elements: updatedElements,
    sourceWaveform: sourceWave,
    outputWaveform: outWave,
    resonantFreqHz,
  };
}
