import { describe, it, expect } from 'vitest';
import { COMPONENT_CATALOG, getComponentCatalogItem } from './pcb-catalog';
import {
  getPinAbsolutePosition,
  resolveCircuitNets,
  stepCircuitSimulation,
  type CircuitSimulationState,
} from './pcb-sim-engine';
import { runDesignRuleCheck } from './pcb-drc-checker';
import {
  generateBomCsv,
  generateCplCsv,
  generateGerberTopCopper,
  generateExcellonDrill,
  buildCompleteManufacturingExport,
} from './pcb-export-engine';
import type { PlacedComponent, CopperTraceSegment, VeroboardTrackCut } from './pcb-types';

describe('PCB Component Catalog', () => {
  it('contains essential passives, semiconductors, ICs, and power components', () => {
    expect(COMPONENT_CATALOG.length).toBeGreaterThanOrEqual(15);

    const ne555 = getComponentCatalogItem('ic_ne555');
    expect(ne555).toBeDefined();
    expect(ne555?.category).toBe('Integrated Circuits');
    expect(ne555?.standardFootprint.pins.length).toBe(8);

    const led = getComponentCatalogItem('led_green');
    expect(led).toBeDefined();
    expect(led?.simModel.forwardVoltage).toBeGreaterThan(0);
  });
});

describe('PCB Simulation Engine & Nodal Analysis', () => {
  const dummyResistor: PlacedComponent = {
    id: 'R1',
    typeId: 'res_10k',
    name: '10k Resistor',
    designator: 'R1',
    x: 50,
    y: 50,
    rotationDeg: 0,
    value: '10kΩ',
    numericValue: 10000,
    category: 'Passives',
    footprint: getComponentCatalogItem('res_10k')!.standardFootprint,
    simState: {},
  };

  const dummyLed: PlacedComponent = {
    id: 'D1',
    typeId: 'led_green',
    name: 'Green LED',
    designator: 'D1',
    x: 70,
    y: 50,
    rotationDeg: 0,
    value: 'Green 5mm',
    numericValue: 2.1,
    category: 'Diodes & Opto',
    footprint: getComponentCatalogItem('led_green')!.standardFootprint,
    simState: {},
  };

  const dummyVcc: PlacedComponent = {
    id: 'V1',
    typeId: 'vcc_5v',
    name: '5V DC Source',
    designator: 'V1',
    x: 20,
    y: 50,
    rotationDeg: 0,
    value: '5V',
    numericValue: 5,
    category: 'Power & Sources',
    footprint: getComponentCatalogItem('vcc_5v')!.standardFootprint,
    simState: {},
  };

  it('calculates pin absolute coordinates taking rotation into account', () => {
    const pin = dummyResistor.footprint.pins.find((p) => p.id === '1')!;
    const pin1Pos = getPinAbsolutePosition(dummyResistor, '1');
    expect(pin1Pos).toBeDefined();
    expect(pin1Pos?.x).toBe(Number((50 + pin.relativeX).toFixed(2)));
    expect(pin1Pos?.y).toBe(50);

    const rotatedComp = { ...dummyResistor, rotationDeg: 90 };
    const rotatedPinPos = getPinAbsolutePosition(rotatedComp, '1');
    expect(rotatedPinPos).toBeDefined();
    expect(rotatedPinPos?.x).toBe(50);
    expect(rotatedPinPos?.y).toBe(Number((50 + pin.relativeX).toFixed(2)));
  });

  it('resolves circuit nets via traces', () => {
    const traces: CopperTraceSegment[] = [
      {
        id: 't1',
        netId: 'vcc',
        layer: 'top_copper',
        startX: 20,
        startY: 50,
        endX: 44.92,
        endY: 50,
        widthMm: 0.35,
      },
    ];

    const nets = resolveCircuitNets([dummyVcc, dummyResistor], traces, 'fr4', []);
    expect(nets.length).toBeGreaterThan(0);
    const vccNet = nets.find((n) => n.name === 'VCC');
    expect(vccNet).toBeDefined();
  });

  it('correctly handles Veroboard strip continuity and track cuts', () => {
    const p1: PlacedComponent = {
      ...dummyResistor,
      id: 'R1',
      x: 20,
      y: 25.4,
    };
    const p2: PlacedComponent = {
      ...dummyResistor,
      id: 'R2',
      x: 60,
      y: 25.4,
    };

    // Without cut, pins on same row y=25.4 are connected
    const netsWithoutCut = resolveCircuitNets([p1, p2], [], 'veroboard', []);
    const rowNet = netsWithoutCut.find((n) => n.pinRefs.length >= 2);
    expect(rowNet).toBeDefined();

    // With a track cut placed between p1 and p2 at x=40, y=25.4
    const trackCut: VeroboardTrackCut = { id: 'c1', x: 40, y: 25.4 };
    const netsWithCut = resolveCircuitNets([p1, p2], [], 'veroboard', [trackCut]);
    // The cut isolates the strip into two nets
    expect(netsWithCut.length).toBeGreaterThanOrEqual(2);
  });

  it('simulates dynamic LED illumination and 555 timer oscillation', () => {
    const ne555: PlacedComponent = {
      id: 'U1',
      typeId: 'ic_ne555',
      name: 'NE555 Timer',
      designator: 'U1',
      x: 50,
      y: 50,
      rotationDeg: 0,
      value: 'NE555',
      numericValue: 0,
      category: 'Integrated Circuits',
      footprint: getComponentCatalogItem('ic_ne555')!.standardFootprint,
      userParams: { r1: 10000, r2: 47000, c: 0.00001 },
      simState: {},
    };

    const initialState: CircuitSimulationState = {
      components: [dummyVcc, dummyLed, ne555],
      traces: [],
      trackCuts: [],
      substrate: 'fr4',
      simTimeMs: 0,
      isRunning: true,
      channelAData: [],
      channelBData: [],
      statusMessage: 'Init',
    };

    const nextState = stepCircuitSimulation(initialState, 50);
    expect(nextState.simTimeMs).toBe(50);
    expect(nextState.channelAData.length).toBe(1);

    const updated555 = nextState.components.find((c) => c.id === 'U1');
    expect(updated555?.simState.oscillatorFreqHz).toBeGreaterThan(0);
    expect(updated555?.simState.chargeVoltage).toBeDefined();
  });
});

describe('Design Rule Check (DRC)', () => {
  it('detects trace width violations when below minimum', () => {
    const skinnyTrace: CopperTraceSegment = {
      id: 't_thin',
      netId: 'sig',
      layer: 'top_copper',
      startX: 10,
      startY: 10,
      endX: 30,
      endY: 10,
      widthMm: 0.1, // less than default 0.2mm
    };

    const violations = runDesignRuleCheck([], [skinnyTrace], { minTraceWidthMm: 0.2 });
    const widthViolation = violations.find((v) => v.code === 'MIN_WIDTH');
    expect(widthViolation).toBeDefined();
    expect(widthViolation?.severity).toBe('error');
  });

  it('detects clearance violations between close different nets', () => {
    const traceA: CopperTraceSegment = {
      id: 'tA',
      netId: 'NET_A',
      layer: 'top_copper',
      startX: 10,
      startY: 10,
      endX: 30,
      endY: 10,
      widthMm: 0.25,
    };

    const traceB: CopperTraceSegment = {
      id: 'tB',
      netId: 'NET_B',
      layer: 'top_copper',
      startX: 10,
      startY: 10.3, // only 0.3mm away -> clearance = 0.3 - 0.25 = 0.05mm (< 0.2mm)
      endX: 30,
      endY: 10.3,
      widthMm: 0.25,
    };

    const violations = runDesignRuleCheck([], [traceA, traceB], { minClearanceMm: 0.2 });
    const clearanceViolation = violations.find((v) => v.code === 'CLEARANCE_VIOLATION');
    expect(clearanceViolation).toBeDefined();
  });
});

describe('Manufacturing Export Engine', () => {
  const compList: PlacedComponent[] = [
    {
      id: 'R1',
      typeId: 'res_10k',
      name: 'Resistor',
      designator: 'R1',
      x: 25.4,
      y: 30.0,
      rotationDeg: 0,
      value: '10kΩ',
      numericValue: 10000,
      category: 'Passives',
      footprint: getComponentCatalogItem('res_10k')!.standardFootprint,
      simState: {},
    },
  ];

  it('generates valid BOM CSV string', () => {
    const bom = generateBomCsv(compList);
    expect(bom).toContain('Designator,Quantity,Value,Package,Category,Description');
    expect(bom).toContain('"R1"');
    expect(bom).toContain('"10kΩ"');
  });

  it('generates valid Pick & Place (CPL) Centroid CSV string', () => {
    const cpl = generateCplCsv(compList);
    expect(cpl).toContain('Designator,Mid X (mm),Mid Y (mm),Rotation,Layer,Package,Value');
    expect(cpl).toContain('R1,25.400,30.000,0,TopLayer');
  });

  it('generates valid RS-274X Gerber Top Copper commands', () => {
    const gerber = generateGerberTopCopper(compList, [], []);
    expect(gerber).toContain('%FSLAX44Y44*%');
    expect(gerber).toContain('%MOMM*%');
    expect(gerber).toContain('M02*');
  });

  it('generates valid Excellon Drill file format', () => {
    const drill = generateExcellonDrill(compList, []);
    expect(drill).toContain('M48');
    expect(drill).toContain('METRIC,TZ');
    expect(drill).toContain('M30');
  });

  it('builds complete manufacturing export package', () => {
    const pkg = buildCompleteManufacturingExport(compList, [], []);
    expect(pkg.bomCsv).toBeDefined();
    expect(pkg.cplCsv).toBeDefined();
    expect(pkg.gerberTopCopper).toBeDefined();
    expect(pkg.excellonDrill).toBeDefined();
    expect(pkg.kicadNetlist).toBeDefined();
  });
});
