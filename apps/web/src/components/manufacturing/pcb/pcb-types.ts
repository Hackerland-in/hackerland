export type BoardSubstrate = 'fr4' | 'veroboard' | 'breadboard' | 'perfboard';

export type PcbLayer = 'top_copper' | 'bottom_copper' | 'silkscreen_top' | 'solder_mask_top' | 'edge_cuts';

export type ComponentCategory =
  | 'Passives'
  | 'Diodes & Opto'
  | 'Transistors & FETs'
  | 'Integrated Circuits'
  | 'Electromechanical'
  | 'Sensors'
  | 'Power & Sources'
  | 'Instruments';

export interface PinDefinition {
  id: string;
  name: string;
  relativeX: number; // mm from component origin
  relativeY: number; // mm from component origin
  padType: 'tht' | 'smd';
  drillDiameterMm?: number;
  padWidthMm: number;
  padHeightMm: number;
  netId?: string; // Connected electrical net
}

export interface ComponentFootprint {
  id: string;
  name: string;
  packageType: 'DIP' | 'AXIAL' | 'RADIAL' | 'SMD_0805' | 'SMD_SOIC' | 'TO-220' | 'TO-92' | 'MODULE' | 'TEST' | 'THT';
  widthMm: number;
  heightMm: number;
  pins: PinDefinition[];
  silkscreenOutline: { type: 'rect' | 'circle' | 'poly'; points?: { x: number; y: number }[]; radius?: number }[];
}

export interface ComponentCatalogItem {
  typeId: string;
  name: string;
  category: ComponentCategory;
  prefix: string; // R, C, D, Q, U, SW, etc.
  description: string;
  defaultValue: string;
  standardFootprint: ComponentFootprint;
  // Simulation electrical model parameters
  simModel: {
    spiceType: 'R' | 'C' | 'L' | 'D' | 'LED' | 'NPN' | 'PNP' | 'NMOS' | '555' | 'OPAMP' | 'SW' | 'VDC' | 'VAC' | 'BUZZER' | 'LDR' | '7SEG';
    nominalValue: number;
    nominalUnit: string;
    forwardVoltage?: number; // For diodes/LEDs
    color?: string; // For LEDs
    beta?: number; // For BJTs
    vth?: number; // For MOSFETs
    timingParams?: { astable?: boolean; cVal?: number; r1Val?: number; r2Val?: number };
  };
}

export interface PlacedComponent {
  id: string; // e.g. "R1", "C1", "U1"
  typeId: string;
  name: string;
  designator: string;
  x: number; // mm
  y: number; // mm
  rotationDeg: number; // 0, 90, 180, 270
  value: string;
  numericValue: number;
  category: ComponentCategory;
  footprint: ComponentFootprint;
  userParams?: Record<string, number | boolean | string>;
  // Live simulation dynamic states
  simState: {
    voltageA?: number;
    voltageB?: number;
    voltageDrop?: number;
    currentMa?: number;
    powerMw?: number;
    isActive?: boolean;
    illumination?: number; // 0.0 to 1.0 for LEDs
    chargeVoltage?: number; // for capacitors
    oscillatorFreqHz?: number; // for 555
    outputState?: boolean; // logic/relay
    temperatureC?: number;
    lightLevelLux?: number;
  };
}

export interface CopperTraceSegment {
  id: string;
  netId: string;
  layer: 'top_copper' | 'bottom_copper';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  widthMm: number; // e.g. 0.25 (signal), 0.8 (power)
}

export interface PcbVia {
  id: string;
  netId: string;
  x: number;
  y: number;
  outerDiameterMm: number; // e.g. 0.8mm
  drillDiameterMm: number; // e.g. 0.4mm
}

export interface VeroboardTrackCut {
  id: string;
  x: number; // Grid hole X
  y: number; // Grid hole Y
}

export interface ElectricalNet {
  id: string;
  name: string; // "GND", "VCC", "NET_1"
  color: string;
  pinRefs: { componentId: string; pinId: string }[];
  voltage: number; // Current calculated node voltage
}

export interface DrcViolation {
  id: string;
  code: 'CLEARANCE_VIOLATION' | 'MIN_WIDTH' | 'UNCONNECTED_NET' | 'SHORT_CIRCUIT' | 'MISSING_DRILL';
  message: string;
  severity: 'error' | 'warning';
  x: number;
  y: number;
  layer?: PcbLayer;
}

export interface OscilloscopeChannelData {
  timeMs: number;
  voltage: number;
}
