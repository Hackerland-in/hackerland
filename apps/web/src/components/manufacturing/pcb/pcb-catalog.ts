import type { ComponentCatalogItem, ComponentFootprint } from './pcb-types';

// Helper footprint generators
function createAxialFootprint(name: string, lengthMm: number = 7.62): ComponentFootprint {
  return {
    id: `footprint-axial-${lengthMm}`,
    name,
    packageType: 'AXIAL',
    widthMm: lengthMm + 2.54,
    heightMm: 3.5,
    pins: [
      { id: '1', name: '1', relativeX: -lengthMm / 2, relativeY: 0, padType: 'tht', drillDiameterMm: 0.8, padWidthMm: 1.6, padHeightMm: 1.6 },
      { id: '2', name: '2', relativeX: lengthMm / 2, relativeY: 0, padType: 'tht', drillDiameterMm: 0.8, padWidthMm: 1.6, padHeightMm: 1.6 },
    ],
    silkscreenOutline: [
      { type: 'rect', points: [{ x: -lengthMm / 2 + 1, y: -1.5 }, { x: lengthMm / 2 - 1, y: 1.5 }] },
    ],
  };
}

function createRadialFootprint(name: string, diameterMm: number = 5.08, pitchMm: number = 2.54): ComponentFootprint {
  return {
    id: `footprint-radial-${diameterMm}`,
    name,
    packageType: 'RADIAL',
    widthMm: diameterMm + 1,
    heightMm: diameterMm + 1,
    pins: [
      { id: '1', name: '+', relativeX: -pitchMm / 2, relativeY: 0, padType: 'tht', drillDiameterMm: 0.8, padWidthMm: 1.6, padHeightMm: 1.6 },
      { id: '2', name: '-', relativeX: pitchMm / 2, relativeY: 0, padType: 'tht', drillDiameterMm: 0.8, padWidthMm: 1.6, padHeightMm: 1.6 },
    ],
    silkscreenOutline: [
      { type: 'circle', radius: diameterMm / 2 },
    ],
  };
}

function createDipFootprint(name: string, pinCount: number, rowSpacingMm: number = 7.62, pitchMm: number = 2.54): ComponentFootprint {
  const half = pinCount / 2;
  const lengthMm = half * pitchMm;
  const pins = [];

  // Left row (1 to half)
  for (let i = 0; i < half; i++) {
    pins.push({
      id: `${i + 1}`,
      name: `Pin ${i + 1}`,
      relativeX: -rowSpacingMm / 2,
      relativeY: -((half - 1) * pitchMm) / 2 + i * pitchMm,
      padType: 'tht' as const,
      drillDiameterMm: 0.8,
      padWidthMm: 1.6,
      padHeightMm: 1.6,
    });
  }

  // Right row (half+1 to pinCount) down from top
  for (let i = 0; i < half; i++) {
    pins.push({
      id: `${pinCount - i}`,
      name: `Pin ${pinCount - i}`,
      relativeX: rowSpacingMm / 2,
      relativeY: -((half - 1) * pitchMm) / 2 + i * pitchMm,
      padType: 'tht' as const,
      drillDiameterMm: 0.8,
      padWidthMm: 1.6,
      padHeightMm: 1.6,
    });
  }

  return {
    id: `footprint-dip-${pinCount}`,
    name,
    packageType: 'DIP',
    widthMm: rowSpacingMm + 2.5,
    heightMm: lengthMm + 2,
    pins,
    silkscreenOutline: [
      {
        type: 'rect',
        points: [
          { x: -rowSpacingMm / 2 + 1, y: -lengthMm / 2 },
          { x: rowSpacingMm / 2 - 1, y: lengthMm / 2 },
        ],
      },
    ],
  };
}

function createTo92Footprint(name: string): ComponentFootprint {
  return {
    id: 'footprint-to92',
    name,
    packageType: 'TO-92',
    widthMm: 5.2,
    heightMm: 4.5,
    pins: [
      { id: '1', name: 'E', relativeX: -1.27, relativeY: 0, padType: 'tht', drillDiameterMm: 0.7, padWidthMm: 1.5, padHeightMm: 1.5 },
      { id: '2', name: 'B', relativeX: 0, relativeY: 0, padType: 'tht', drillDiameterMm: 0.7, padWidthMm: 1.5, padHeightMm: 1.5 },
      { id: '3', name: 'C', relativeX: 1.27, relativeY: 0, padType: 'tht', drillDiameterMm: 0.7, padWidthMm: 1.5, padHeightMm: 1.5 },
    ],
    silkscreenOutline: [
      { type: 'circle', radius: 2.4 },
    ],
  };
}

function createTo220Footprint(name: string): ComponentFootprint {
  return {
    id: 'footprint-to220',
    name,
    packageType: 'TO-220',
    widthMm: 10.5,
    heightMm: 4.8,
    pins: [
      { id: '1', name: '1', relativeX: -2.54, relativeY: 0, padType: 'tht', drillDiameterMm: 1.0, padWidthMm: 2.0, padHeightMm: 2.0 },
      { id: '2', name: '2', relativeX: 0, relativeY: 0, padType: 'tht', drillDiameterMm: 1.0, padWidthMm: 2.0, padHeightMm: 2.0 },
      { id: '3', name: '3', relativeX: 2.54, relativeY: 0, padType: 'tht', drillDiameterMm: 1.0, padWidthMm: 2.0, padHeightMm: 2.0 },
    ],
    silkscreenOutline: [
      { type: 'rect', points: [{ x: -5, y: -2.2 }, { x: 5, y: 2.2 }] },
    ],
  };
}

// -------------------------------------------------------------
// Comprehensive Electronics Component Catalog
// -------------------------------------------------------------
export const ELECTRONICS_COMPONENT_CATALOG: ComponentCatalogItem[] = [
  // -----------------------------------------------------------
  // PASSIVES
  // -----------------------------------------------------------
  {
    typeId: 'resistor_10k',
    name: 'Resistor 10kΩ (1/4W 5%)',
    category: 'Passives',
    prefix: 'R',
    description: 'Precision metal-film pull-up/bias resistor. Standard 2.54mm / 0.1" pitch breadboard and Veroboard friendly.',
    defaultValue: '10kΩ',
    standardFootprint: createAxialFootprint('Resistor_THT_7.62mm', 7.62),
    simModel: {
      spiceType: 'R',
      nominalValue: 10000,
      nominalUnit: 'Ω',
    },
  },
  {
    typeId: 'resistor_330',
    name: 'Resistor 330Ω (Current Limiting)',
    category: 'Passives',
    prefix: 'R',
    description: 'Ideal series current limiting resistor for 5V LEDs ($I \\approx 15\\text{mA}$).',
    defaultValue: '330Ω',
    standardFootprint: createAxialFootprint('Resistor_THT_7.62mm', 7.62),
    simModel: {
      spiceType: 'R',
      nominalValue: 330,
      nominalUnit: 'Ω',
    },
  },
  {
    typeId: 'resistor_1k',
    name: 'Resistor 1kΩ',
    category: 'Passives',
    prefix: 'R',
    description: 'Standard transistor base drive and voltage divider resistor.',
    defaultValue: '1kΩ',
    standardFootprint: createAxialFootprint('Resistor_THT_7.62mm', 7.62),
    simModel: {
      spiceType: 'R',
      nominalValue: 1000,
      nominalUnit: 'Ω',
    },
  },
  {
    typeId: 'potentiometer_10k',
    name: 'Potentiometer 10kΩ (Trimpot)',
    category: 'Passives',
    prefix: 'RV',
    description: '3-Terminal adjustable voltage divider potentiometer with interactive wiper.',
    defaultValue: '10kΩ (50%)',
    standardFootprint: {
      id: 'footprint-pot',
      name: 'Potentiometer_Trimpot_3Pin',
      packageType: 'THT',
      widthMm: 9.5,
      heightMm: 9.5,
      pins: [
        { id: '1', name: 'CCW', relativeX: -2.54, relativeY: -2.54, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.8, padHeightMm: 1.8 },
        { id: '2', name: 'WIPER', relativeX: 0, relativeY: 2.54, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.8, padHeightMm: 1.8 },
        { id: '3', name: 'CW', relativeX: 2.54, relativeY: -2.54, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.8, padHeightMm: 1.8 },
      ],
      silkscreenOutline: [{ type: 'rect', points: [{ x: -4.5, y: -4.5 }, { x: 4.5, y: 4.5 }] }],
    },
    simModel: {
      spiceType: 'R',
      nominalValue: 10000,
      nominalUnit: 'Ω',
    },
  },
  {
    typeId: 'capacitor_ceramic_100n',
    name: 'Ceramic Capacitor 100nF (0.1µF)',
    category: 'Passives',
    prefix: 'C',
    description: 'High-frequency decoupling capacitor for IC supply pins and noise rejection.',
    defaultValue: '100nF',
    standardFootprint: createRadialFootprint('Capacitor_Ceramic_2.54mm', 4.0, 2.54),
    simModel: {
      spiceType: 'C',
      nominalValue: 1e-7,
      nominalUnit: 'F',
    },
  },
  {
    typeId: 'capacitor_electrolytic_10u',
    name: 'Electrolytic Capacitor 10µF (50V)',
    category: 'Passives',
    prefix: 'C',
    description: 'Polarized reservoir capacitor for power rail filtering and timing circuits.',
    defaultValue: '10µF',
    standardFootprint: createRadialFootprint('Capacitor_Electrolytic_5mm', 5.0, 2.54),
    simModel: {
      spiceType: 'C',
      nominalValue: 1e-5,
      nominalUnit: 'F',
    },
  },
  {
    typeId: 'inductor_10m',
    name: 'Power Inductor 10mH',
    category: 'Passives',
    prefix: 'L',
    description: 'High-inductance coil for LC filters, switch-mode power supplies, and chokes.',
    defaultValue: '10mH',
    standardFootprint: createAxialFootprint('Inductor_THT_10mm', 10.16),
    simModel: {
      spiceType: 'L',
      nominalValue: 0.01,
      nominalUnit: 'H',
    },
  },

  // -----------------------------------------------------------
  // DIODES & OPTOELECTRONICS
  // -----------------------------------------------------------
  {
    typeId: 'led_red',
    name: 'Red LED 5mm (High-Brightness)',
    category: 'Diodes & Opto',
    prefix: 'D',
    description: 'Standard semiconductor light emitting diode. Glows radiantly in simulation when current flows ($V_f \\approx 1.8\\text{V}$).',
    defaultValue: 'Red 20mA',
    standardFootprint: createRadialFootprint('LED_5mm_Radial', 5.0, 2.54),
    simModel: {
      spiceType: 'LED',
      nominalValue: 0.02,
      nominalUnit: 'A',
      forwardVoltage: 1.8,
      color: '#ff2244',
    },
  },
  {
    typeId: 'led_green',
    name: 'Green LED 5mm',
    category: 'Diodes & Opto',
    prefix: 'D',
    description: 'Emerald green indicator LED with $V_f \\approx 2.1\\text{V}$.',
    defaultValue: 'Green 20mA',
    standardFootprint: createRadialFootprint('LED_5mm_Radial', 5.0, 2.54),
    simModel: {
      spiceType: 'LED',
      nominalValue: 0.02,
      nominalUnit: 'A',
      forwardVoltage: 2.1,
      color: '#00ff88',
    },
  },
  {
    typeId: 'led_blue',
    name: 'Blue LED 5mm',
    category: 'Diodes & Opto',
    prefix: 'D',
    description: 'High-intensity blue Gallium Nitride (GaN) LED ($V_f \\approx 3.0\\text{V}$).',
    defaultValue: 'Blue 20mA',
    standardFootprint: createRadialFootprint('LED_5mm_Radial', 5.0, 2.54),
    simModel: {
      spiceType: 'LED',
      nominalValue: 0.02,
      nominalUnit: 'A',
      forwardVoltage: 3.0,
      color: '#00f0ff',
    },
  },
  {
    typeId: 'diode_1n4007',
    name: '1N4007 Rectifier Diode (1000V 1A)',
    category: 'Diodes & Opto',
    prefix: 'D',
    description: 'Silicon power rectifier diode with 0.7V forward drop and white cathode stripe.',
    defaultValue: '1N4007 (1A)',
    standardFootprint: createAxialFootprint('Diode_DO-41_Axial', 7.62),
    simModel: {
      spiceType: 'D',
      nominalValue: 1.0,
      nominalUnit: 'A',
      forwardVoltage: 0.7,
    },
  },
  {
    typeId: 'diode_zener_5v1',
    name: 'Zener Diode 5.1V (500mW)',
    category: 'Diodes & Opto',
    prefix: 'ZD',
    description: 'Voltage clamping diode establishing stable 5.1V reference rail under reverse bias.',
    defaultValue: '5.1V Zener',
    standardFootprint: createAxialFootprint('Diode_DO-35_Axial', 7.62),
    simModel: {
      spiceType: 'D',
      nominalValue: 5.1,
      nominalUnit: 'V',
      forwardVoltage: 0.7,
    },
  },

  // -----------------------------------------------------------
  // TRANSISTORS & FETS
  // -----------------------------------------------------------
  {
    typeId: 'transistor_2n2222',
    name: '2N2222 NPN Bipolar Transistor',
    category: 'Transistors & FETs',
    prefix: 'Q',
    description: 'High-speed NPN switching transistor capable of driving relays, motors, and LED strings up to 800mA.',
    defaultValue: '2N2222 NPN',
    standardFootprint: createTo92Footprint('TO-92_2N2222'),
    simModel: {
      spiceType: 'NPN',
      nominalValue: 150, // Beta hFE
      nominalUnit: 'hFE',
      beta: 150,
    },
  },
  {
    typeId: 'mosfet_irfz44n',
    name: 'IRFZ44N N-Channel Power MOSFET',
    category: 'Transistors & FETs',
    prefix: 'Q',
    description: '55V 49A power MOSFET with ultra-low $R_{ds(on)} = 17.5\\text{m}\\Omega$ for high-current switching and H-bridges.',
    defaultValue: 'IRFZ44N 55V/49A',
    standardFootprint: createTo220Footprint('TO-220_IRFZ44N'),
    simModel: {
      spiceType: 'NMOS',
      nominalValue: 0.0175,
      nominalUnit: 'Ω',
      vth: 2.8,
    },
  },

  // -----------------------------------------------------------
  // INTEGRATED CIRCUITS
  // -----------------------------------------------------------
  {
    typeId: 'ic_ne555',
    name: 'NE555 Precision Timer IC (DIP-8)',
    category: 'Integrated Circuits',
    prefix: 'U',
    description: 'Classic analog timer IC configurable in Astable multi-vibrator oscillator or Monostable pulse mode.',
    defaultValue: 'NE555 Timer',
    standardFootprint: createDipFootprint('DIP-8_NE555', 8, 7.62, 2.54),
    simModel: {
      spiceType: '555',
      nominalValue: 1.0,
      nominalUnit: 'Hz',
      timingParams: { astable: true },
    },
  },
  {
    typeId: 'ic_lm358',
    name: 'LM358 Dual Operational Amplifier (DIP-8)',
    category: 'Integrated Circuits',
    prefix: 'U',
    description: 'Dual wide-supply range op-amp for comparators, active filters, and sensor pre-amplifiers.',
    defaultValue: 'LM358 Dual Op-Amp',
    standardFootprint: createDipFootprint('DIP-8_LM358', 8, 7.62, 2.54),
    simModel: {
      spiceType: 'OPAMP',
      nominalValue: 100000,
      nominalUnit: 'Gain',
    },
  },
  {
    typeId: 'ic_lm7805',
    name: 'LM7805 Linear 5V Voltage Regulator',
    category: 'Integrated Circuits',
    prefix: 'U',
    description: '3-Terminal positive voltage regulator delivering solid 5.0V output up to 1.5A from 7-25V input.',
    defaultValue: 'LM7805 (5V Reg)',
    standardFootprint: createTo220Footprint('TO-220_LM7805'),
    simModel: {
      spiceType: 'VDC',
      nominalValue: 5.0,
      nominalUnit: 'V',
    },
  },
  {
    typeId: 'ic_atmega328p',
    name: 'ATmega328P 8-bit Microcontroller (DIP-28)',
    category: 'Integrated Circuits',
    prefix: 'U',
    description: 'The iconic Arduino Uno heart. 28-pin DIP package with 32KB flash, 16MHz clock, and digital/analog GPIOs.',
    defaultValue: 'ATmega328P (16MHz)',
    standardFootprint: createDipFootprint('DIP-28_ATmega328P', 28, 7.62, 2.54),
    simModel: {
      spiceType: '555',
      nominalValue: 16000000,
      nominalUnit: 'Hz',
    },
  },

  // -----------------------------------------------------------
  // ELECTROMECHANICAL
  // -----------------------------------------------------------
  {
    typeId: 'switch_pushbutton',
    name: 'Tactile Pushbutton 6mm',
    category: 'Electromechanical',
    prefix: 'SW',
    description: 'Momentary 4-pin tactile switch. Click to toggle contact in real-time simulation.',
    defaultValue: 'Tactile NO',
    standardFootprint: {
      id: 'footprint-button-6mm',
      name: 'Pushbutton_6x6mm',
      packageType: 'THT',
      widthMm: 6.5,
      heightMm: 6.5,
      pins: [
        { id: '1', name: 'A1', relativeX: -2.25, relativeY: -3.25, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
        { id: '2', name: 'B1', relativeX: 2.25, relativeY: -3.25, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
        { id: '3', name: 'A2', relativeX: -2.25, relativeY: 3.25, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
        { id: '4', name: 'B2', relativeX: 2.25, relativeY: 3.25, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
      ],
      silkscreenOutline: [{ type: 'rect', points: [{ x: -3, y: -3 }, { x: 3, y: 3 }] }],
    },
    simModel: {
      spiceType: 'SW',
      nominalValue: 1,
      nominalUnit: 'State',
    },
  },
  {
    typeId: 'switch_spdt',
    name: 'SPDT Toggle / Slide Switch',
    category: 'Electromechanical',
    prefix: 'SW',
    description: 'Single Pole Double Throw 3-pin switch. Toggles between Common, A, and B.',
    defaultValue: 'SPDT Latch',
    standardFootprint: {
      id: 'footprint-spdt',
      name: 'Switch_SPDT_3Pin',
      packageType: 'THT',
      widthMm: 8.5,
      heightMm: 4.5,
      pins: [
        { id: '1', name: 'NO', relativeX: -2.54, relativeY: 0, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
        { id: '2', name: 'COM', relativeX: 0, relativeY: 0, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
        { id: '3', name: 'NC', relativeX: 2.54, relativeY: 0, padType: 'tht', drillDiameterMm: 0.9, padWidthMm: 1.6, padHeightMm: 1.6 },
      ],
      silkscreenOutline: [{ type: 'rect', points: [{ x: -4, y: -2 }, { x: 4, y: 2 }] }],
    },
    simModel: {
      spiceType: 'SW',
      nominalValue: 1,
      nominalUnit: 'State',
    },
  },
  {
    typeId: 'piezo_buzzer',
    name: 'Active Piezo Buzzer (5V)',
    category: 'Electromechanical',
    prefix: 'BZ',
    description: 'Audible and visual sound transducer emitting 2.4kHz pulse when voltage > 2.5V.',
    defaultValue: '5V Buzzer',
    standardFootprint: createRadialFootprint('Buzzer_12mm_Radial', 12.0, 7.62),
    simModel: {
      spiceType: 'BUZZER',
      nominalValue: 2400,
      nominalUnit: 'Hz',
    },
  },

  // -----------------------------------------------------------
  // SENSORS
  // -----------------------------------------------------------
  {
    typeId: 'sensor_ldr',
    name: 'LDR Photoresistor 5mm',
    category: 'Sensors',
    prefix: 'R_LDR',
    description: 'Cadmium-sulfide light dependent resistor. Interactive lux slider changes resistance from 1kΩ (bright) to 1MΩ (dark).',
    defaultValue: 'LDR (10k@ambient)',
    standardFootprint: createRadialFootprint('LDR_5mm_Radial', 5.0, 2.54),
    simModel: {
      spiceType: 'LDR',
      nominalValue: 10000,
      nominalUnit: 'Ω',
    },
  },

  // -----------------------------------------------------------
  // POWER SOURCES
  // -----------------------------------------------------------
  {
    typeId: 'power_dc_5v',
    name: 'DC 5.0V Power Source / USB VBUS',
    category: 'Power & Sources',
    prefix: 'V',
    description: 'Regulated 5.0V direct current power supply with ground terminal.',
    defaultValue: '5.0V DC',
    standardFootprint: {
      id: 'footprint-power-2pin',
      name: 'Power_Terminal_2Pin',
      packageType: 'THT',
      widthMm: 7.5,
      heightMm: 5.0,
      pins: [
        { id: '1', name: '+5V', relativeX: -1.9, relativeY: 0, padType: 'tht', drillDiameterMm: 1.0, padWidthMm: 2.0, padHeightMm: 2.0 },
        { id: '2', name: 'GND', relativeX: 1.9, relativeY: 0, padType: 'tht', drillDiameterMm: 1.0, padWidthMm: 2.0, padHeightMm: 2.0 },
      ],
      silkscreenOutline: [{ type: 'rect', points: [{ x: -3.5, y: -2.5 }, { x: 3.5, y: 2.5 }] }],
    },
    simModel: {
      spiceType: 'VDC',
      nominalValue: 5.0,
      nominalUnit: 'V',
    },
  },
  {
    typeId: 'power_battery_9v',
    name: '9V Transistor Battery Snap',
    category: 'Power & Sources',
    prefix: 'BAT',
    description: 'Standard 9V alkaline PP3 battery connection clip with +9V and GND.',
    defaultValue: '9.0V Battery',
    standardFootprint: {
      id: 'footprint-bat-9v',
      name: 'Battery_Clip_9V',
      packageType: 'THT',
      widthMm: 12.0,
      heightMm: 6.0,
      pins: [
        { id: '1', name: '+9V', relativeX: -3.0, relativeY: 0, padType: 'tht', drillDiameterMm: 1.1, padWidthMm: 2.2, padHeightMm: 2.2 },
        { id: '2', name: 'GND', relativeX: 3.0, relativeY: 0, padType: 'tht', drillDiameterMm: 1.1, padWidthMm: 2.2, padHeightMm: 2.2 },
      ],
      silkscreenOutline: [{ type: 'rect', points: [{ x: -5.5, y: -3.0 }, { x: 5.5, y: 3.0 }] }],
    },
    simModel: {
      spiceType: 'VDC',
      nominalValue: 9.0,
      nominalUnit: 'V',
    },
  },
  {
    typeId: 'resistor_47k',
    name: 'Through-Hole Resistor 47kΩ',
    category: 'Passives',
    prefix: 'R',
    description: '1/4W 5% carbon film resistor 47,000 ohms. Yellow-Violet-Orange bands.',
    defaultValue: '47kΩ',
    standardFootprint: {
      id: 'footprint-res-axial-0207-47k',
      name: 'Resistor_THT_L6.3mm_D2.4mm_P10.16mm_Horizontal',
      packageType: 'AXIAL',
      widthMm: 11.5,
      heightMm: 3.0,
      pins: [
        { id: '1', name: '1', relativeX: -5.08, relativeY: 0, padType: 'tht', drillDiameterMm: 0.8, padWidthMm: 1.6, padHeightMm: 1.6 },
        { id: '2', name: '2', relativeX: 5.08, relativeY: 0, padType: 'tht', drillDiameterMm: 0.8, padWidthMm: 1.6, padHeightMm: 1.6 },
      ],
      silkscreenOutline: [{ type: 'rect', points: [{ x: -3.5, y: -1.5 }, { x: 3.5, y: 1.5 }] }],
    },
    simModel: {
      spiceType: 'R',
      nominalValue: 47000,
      nominalUnit: 'Ω',
    },
  },
  {
    typeId: 'gnd',
    name: 'Circuit Chassis Ground (0V)',
    category: 'Power & Sources',
    prefix: 'G',
    description: '0V reference ground tie point for circuit return current.',
    defaultValue: 'GND 0V',
    standardFootprint: {
      id: 'footprint-gnd-pad',
      name: 'GND_TiePoint_Pad',
      packageType: 'TEST',
      widthMm: 4.0,
      heightMm: 4.0,
      pins: [
        { id: 'gnd', name: 'GND', relativeX: 0, relativeY: 0, padType: 'tht', drillDiameterMm: 1.0, padWidthMm: 2.2, padHeightMm: 2.2 },
      ],
      silkscreenOutline: [{ type: 'circle', radius: 1.8 }],
    },
    simModel: {
      spiceType: 'VDC',
      nominalValue: 0.0,
      nominalUnit: 'V',
    },
  },
];

export const COMPONENT_CATALOG = ELECTRONICS_COMPONENT_CATALOG;

const TYPE_ALIASES: Record<string, string> = {
  res_10k: 'resistor_10k',
  res_47k: 'resistor_47k',
  res_1k: 'resistor_1k',
  res_330: 'resistor_330',
  cap_10uf: 'capacitor_electrolytic_10u',
  cap_100n: 'capacitor_ceramic_100n',
  pot_10k: 'potentiometer_10k',
  vcc_5v: 'power_dc_5v',
  bat_9v: 'power_battery_9v',
  btn_push: 'switch_pushbutton',
  sw_spst: 'switch_spdt',
  bjt_2n2222: 'transistor_2n2222',
  buzzer_piezo: 'piezo_buzzer',
  ldr_gl5528: 'sensor_ldr',
};

export function getComponentCatalogItem(typeId: string): ComponentCatalogItem | undefined {
  const resolvedId = TYPE_ALIASES[typeId] || typeId;
  return ELECTRONICS_COMPONENT_CATALOG.find((c) => c.typeId === resolvedId);
}


