import type { PlacedComponent, CopperTraceSegment, ElectricalNet, VeroboardTrackCut, BoardSubstrate, OscilloscopeChannelData } from './pcb-types';
import { getComponentCatalogItem } from './pcb-catalog';

export interface CircuitSimulationState {
  components: PlacedComponent[];
  traces: CopperTraceSegment[];
  trackCuts: VeroboardTrackCut[];
  substrate: BoardSubstrate;
  simTimeMs: number;
  isRunning: boolean;
  channelAData: OscilloscopeChannelData[];
  channelBData: OscilloscopeChannelData[];
  probeNetA?: string;
  probeNetB?: string;
  statusMessage: string;
}

// Convert component relative pin coords to board absolute coords (accounting for rotation)
export function getPinAbsolutePosition(
  comp: PlacedComponent,
  pinId: string
): { x: number; y: number } | null {
  const pin = comp.footprint.pins.find((p) => p.id === pinId);
  if (!pin) return null;

  const rad = (comp.rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const rotX = pin.relativeX * cos - pin.relativeY * sin;
  const rotY = pin.relativeX * sin + pin.relativeY * cos;

  return {
    x: Number((comp.x + rotX).toFixed(2)),
    y: Number((comp.y + rotY).toFixed(2)),
  };
}

// Build electrical net connectivity graph based on traces, veroboard strips, and breadboard rails
export function resolveCircuitNets(
  components: PlacedComponent[],
  traces: CopperTraceSegment[],
  substrate: BoardSubstrate,
  trackCuts: VeroboardTrackCut[]
): ElectricalNet[] {
  // Pin coordinate map: `${Math.round(x * 10)},${Math.round(y * 10)}` -> pin reference
  const pinMap = new Map<string, { componentId: string; pinId: string; x: number; y: number }>();

  for (const comp of components) {
    for (const pin of comp.footprint.pins) {
      const pos = getPinAbsolutePosition(comp, pin.id);
      if (pos) {
        // Quantize to 0.1mm tolerance
        const key = `${Math.round(pos.x * 10)},${Math.round(pos.y * 10)}`;
        pinMap.set(key, { componentId: comp.id, pinId: pin.id, x: pos.x, y: pos.y });
      }
    }
  }

  // Union-Find / Disjoint Set Union
  const parent = new Map<string, string>();
  const find = (i: string): string => {
    if (!parent.has(i)) parent.set(i, i);
    if (parent.get(i) === i) return i;
    const root = find(parent.get(i)!);
    parent.set(i, root);
    return root;
  };
  const union = (i: string, j: string) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) parent.set(rootI, rootJ);
  };

  // 1. Connect pins sharing the exact same coordinate (e.g. stacked or breadboard insertion)
  const pinList = Array.from(pinMap.values());
  for (let i = 0; i < pinList.length; i++) {
    for (let j = i + 1; j < pinList.length; j++) {
      const p1 = pinList[i];
      const p2 = pinList[j];
      if (!p1 || !p2) continue;
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < 0.3) {
        union(`${p1.componentId}:${p1.pinId}`, `${p2.componentId}:${p2.pinId}`);
      }
    }
  }

  // 2. Connect via copper traces (for FR4 and Perfboard)
  for (const trace of traces) {
    let startPin: string | null = null;
    let endPin: string | null = null;

    for (const p of pinList) {
      if (Math.hypot(p.x - trace.startX, p.y - trace.startY) < 0.6) {
        startPin = `${p.componentId}:${p.pinId}`;
      }
      if (Math.hypot(p.x - trace.endX, p.y - trace.endY) < 0.6) {
        endPin = `${p.componentId}:${p.pinId}`;
      }
    }

    if (startPin && endPin && startPin !== endPin) {
      union(startPin, endPin);
    }
  }

  // 3. Substrate-specific continuity:
  if (substrate === 'veroboard') {
    // Veroboard (Stripboard): horizontal continuous copper strips along Y grid lines (every 2.54mm)
    // interrupted by track cuts!
    const GRID = 2.54;
    // Group pins by row (approx round(y / GRID))
    const rows = new Map<number, { componentId: string; pinId: string; x: number; y: number }[]>();
    for (const p of pinList) {
      const rowIdx = Math.round(p.y / GRID);
      if (!rows.has(rowIdx)) rows.set(rowIdx, []);
      rows.get(rowIdx)!.push(p);
    }

    // Connect pins in same row IF there is no track cut between their X positions
    for (const [, rowPins] of rows.entries()) {
      const sorted = [...rowPins].sort((a, b) => a.x - b.x);
      for (let i = 0; i < sorted.length - 1; i++) {
        const pA = sorted[i];
        const pB = sorted[i + 1];
        if (!pA || !pB) continue;
        // Check if a cut exists on rowIdx between pA.x and pB.x
        const hasCut = trackCuts.some(
          (cut) =>
            Math.round(cut.y / GRID) === Math.round(pA.y / GRID) &&
            cut.x > Math.min(pA.x, pB.x) &&
            cut.x < Math.max(pA.x, pB.x)
        );
        if (!hasCut) {
          union(`${pA.componentId}:${pA.pinId}`, `${pB.componentId}:${pB.pinId}`);
        }
      }
    }
  } else if (substrate === 'breadboard') {
    // Breadboard: 5-pin vertical terminal strips (columns X) separated into Top and Bottom banks by center divider (y=30mm)
    // Plus horizontal power rails (+ / -) along top and bottom
    for (let i = 0; i < pinList.length; i++) {
      for (let j = i + 1; j < pinList.length; j++) {
        const p1 = pinList[i];
        const p2 = pinList[j];
        if (!p1 || !p2) continue;
        // Check if in same vertical terminal strip: same X grid, both on top half (y < 28) or both on bottom half (y > 32)
        const sameCol = Math.abs(p1.x - p2.x) < 1.2;
        const sameHalf = (p1.y < 28 && p2.y < 28) || (p1.y > 32 && p2.y > 32);
        if (sameCol && sameHalf) {
          union(`${p1.componentId}:${p1.pinId}`, `${p2.componentId}:${p2.pinId}`);
        }
      }
    }
  }

  // 4. Assemble nets
  const netGroups = new Map<string, { componentId: string; pinId: string }[]>();
  for (const p of pinList) {
    const pinKey = `${p.componentId}:${p.pinId}`;
    const root = find(pinKey);
    if (!netGroups.has(root)) {
      netGroups.set(root, []);
    }
    netGroups.get(root)!.push({ componentId: p.componentId, pinId: p.pinId });
  }

  // Colors for netlines
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];
  let colorIdx = 0;

  const nets: ElectricalNet[] = [];
  for (const [root, refs] of netGroups.entries()) {
    // Identify special net names: GND, VCC (+5V, +9V)
    let netName = `NET_${nets.length + 1}`;
    let isGnd = false;
    let isVcc = false;

    for (const ref of refs) {
      const comp = components.find((c) => c.id === ref.componentId);
      if (!comp) continue;
      if (comp.typeId === 'gnd' || ref.pinId === 'gnd' || ref.pinId === 'neg') {
        isGnd = true;
      }
      if (comp.typeId === 'vcc_5v' || comp.typeId === 'bat_9v' || ref.pinId === 'vcc' || ref.pinId === 'pos') {
        isVcc = true;
      }
    }

    if (isGnd) netName = 'GND';
    else if (isVcc) netName = 'VCC';

    nets.push({
      id: root,
      name: netName,
      color: netName === 'GND' ? '#64748b' : netName === 'VCC' ? '#ef4444' : (colors[colorIdx++ % colors.length] ?? '#22c55e'),
      pinRefs: refs,
      voltage: netName === 'VCC' ? 5.0 : 0.0,
    });
  }

  return nets;
}

// Perform dynamic simulation step
export function stepCircuitSimulation(
  state: CircuitSimulationState,
  dtMs: number
): CircuitSimulationState {
  const newSimTime = state.simTimeMs + dtMs;
  const nets = resolveCircuitNets(state.components, state.traces, state.substrate, state.trackCuts);

  // Map each pin to its resolved net
  const pinNetMap = new Map<string, ElectricalNet>();
  for (const net of nets) {
    for (const ref of net.pinRefs) {
      pinNetMap.set(`${ref.componentId}:${ref.pinId}`, net);
    }
  }

  // 1. Identify supply rails
  let vccVoltage = 5.0;
  for (const comp of state.components) {
    if (comp.typeId === 'bat_9v' || comp.typeId === 'power_battery_9v') vccVoltage = 9.0;
    else if (comp.typeId === 'vcc_5v' || comp.typeId === 'power_dc_5v') vccVoltage = 5.0;
    else if (comp.typeId === 'reg_7805' || comp.typeId === 'ic_lm7805') vccVoltage = 5.0;
  }

  // Set net voltages
  for (const net of nets) {
    if (net.name === 'VCC') {
      net.voltage = vccVoltage;
    } else if (net.name === 'GND') {
      net.voltage = 0.0;
    }
  }

  // 2. Solve component dynamic states
  const updatedComponents = state.components.map((comp) => {
    const item = getComponentCatalogItem(comp.typeId);
    const updated = { ...comp, simState: { ...comp.simState } };

    switch (comp.typeId) {
      case 'led_red':
      case 'led_green':
      case 'led_blue':
      case 'led_yellow': {
        const anodeNet = pinNetMap.get(`${comp.id}:anode`);
        const cathodeNet = pinNetMap.get(`${comp.id}:cathode`);
        const vA = anodeNet ? anodeNet.voltage : 0;
        const vK = cathodeNet ? cathodeNet.voltage : 0;
        const vDrop = vA - vK;
        const vf = item?.simModel.forwardVoltage || 2.0;

        // If forward biased above threshold voltage
        if (vDrop > vf) {
          // Assume nominal series current limited around 10-20mA
          const currentMa = Math.min(25, ((vDrop - vf) / 150) * 1000);
          const illumination = Math.min(1.0, currentMa / 15);
          updated.simState = {
            voltageA: vA,
            voltageB: vK,
            voltageDrop: vDrop,
            currentMa: Number(currentMa.toFixed(1)),
            illumination: Number(illumination.toFixed(2)),
            isActive: illumination > 0.05,
          };
        } else {
          updated.simState = {
            voltageA: vA,
            voltageB: vK,
            voltageDrop: Math.max(0, vDrop),
            currentMa: 0,
            illumination: 0,
            isActive: false,
          };
        }
        break;
      }

      case 'btn_push':
      case 'switch_pushbutton':
      case 'sw_spst':
      case 'switch_spdt': {
        const isClosed = Boolean(comp.userParams?.isClosed ?? false);
        const p1Net = pinNetMap.get(`${comp.id}:1`);
        const p2Net = pinNetMap.get(`${comp.id}:2`);
        // If switch is closed, transfer potential across contacts
        if (isClosed && p1Net && p2Net) {
          const maxV = Math.max(p1Net.voltage, p2Net.voltage);
          p1Net.voltage = maxV;
          p2Net.voltage = maxV;
        }
        updated.simState = {
          isActive: isClosed,
          outputState: isClosed,
        };
        break;
      }

      case 'pot_10k':
      case 'potentiometer_10k': {
        // Potentiometer voltage divider
        const wiperRatio = Number(comp.userParams?.wiperRatio ?? 0.5); // 0.0 to 1.0
        const p1Net = pinNetMap.get(`${comp.id}:1`);
        const p3Net = pinNetMap.get(`${comp.id}:3`);
        const wiperNet = pinNetMap.get(`${comp.id}:2`);

        const v1 = p1Net ? p1Net.voltage : 0;
        const v3 = p3Net ? p3Net.voltage : 0;
        const vWiper = v1 + (v3 - v1) * wiperRatio;

        if (wiperNet && (p1Net || p3Net)) {
          wiperNet.voltage = Number(vWiper.toFixed(2));
        }

        updated.simState = {
          voltageA: v1,
          voltageB: v3,
          voltageDrop: Number(vWiper.toFixed(2)),
          isActive: true,
        };
        break;
      }

      case 'ldr_gl5528':
      case 'sensor_ldr': {
        // Light Dependent Resistor: Lux level affects resistance
        const lux = Number(comp.userParams?.lux ?? 500); // 10 lux (dark) -> 100k, 1000 lux (bright) -> 1k
        const rKohm = Math.max(0.5, 500 / Math.max(1, lux));
        updated.simState = {
          lightLevelLux: lux,
          powerMw: Number(rKohm.toFixed(1)),
          isActive: true,
        };
        break;
      }

      case 'ic_ne555': {
        // NE555 Timer in Astable Multivibrator Mode
        // Frequency f = 1.44 / ((R1 + 2*R2) * C)
        const r1 = Number(comp.userParams?.r1 ?? 10000); // 10k
        const r2 = Number(comp.userParams?.r2 ?? 47000); // 47k
        const cVal = Number(comp.userParams?.c ?? 0.00001); // 10uF
        const freqHz = 1.44 / ((r1 + 2 * r2) * cVal);
        const periodMs = (1 / Math.max(0.1, freqHz)) * 1000;

        // Periodic square wave oscillation based on simTime
        const cyclePosition = (newSimTime % periodMs) / periodMs;
        const dutyCycle = (r1 + r2) / (r1 + 2 * r2);
        const isOutputHigh = cyclePosition < dutyCycle;

        // Output pin 3 voltage
        const outNet = pinNetMap.get(`${comp.id}:3`);
        if (outNet) {
          outNet.voltage = isOutputHigh ? vccVoltage * 0.9 : 0.2;
        }

        // Capacitor charging exponential waveform (Pin 2/6 threshold)
        const capVoltage = isOutputHigh
          ? (vccVoltage / 3) + (vccVoltage / 3) * (cyclePosition / dutyCycle)
          : (2 * vccVoltage / 3) - (vccVoltage / 3) * ((cyclePosition - dutyCycle) / (1 - dutyCycle));

        updated.simState = {
          oscillatorFreqHz: Number(freqHz.toFixed(1)),
          outputState: isOutputHigh,
          chargeVoltage: Number(capVoltage.toFixed(2)),
          isActive: true,
        };
        break;
      }

      case 'buzzer_piezo':
      case 'piezo_buzzer': {
        const pNet = pinNetMap.get(`${comp.id}:pos`) || pinNetMap.get(`${comp.id}:1`);
        const nNet = pinNetMap.get(`${comp.id}:neg`) || pinNetMap.get(`${comp.id}:2`);
        const vPos = pNet ? pNet.voltage : 0;
        const vNeg = nNet ? nNet.voltage : 0;
        const isSounding = vPos - vNeg > 2.0;

        updated.simState = {
          isActive: isSounding,
          voltageDrop: Number((vPos - vNeg).toFixed(2)),
        };
        break;
      }

      case 'bjt_2n2222':
      case 'transistor_2n2222': {
        // NPN Transistor
        const baseNet = pinNetMap.get(`${comp.id}:B`);
        const emitterNet = pinNetMap.get(`${comp.id}:E`);
        const collectorNet = pinNetMap.get(`${comp.id}:C`);

        const vB = baseNet ? baseNet.voltage : 0;
        const vE = emitterNet ? emitterNet.voltage : 0;
        const isConducting = vB - vE > 0.65;

        if (isConducting && collectorNet && emitterNet) {
          // Saturate collector to emitter
          collectorNet.voltage = vE + 0.2;
        }

        updated.simState = {
          isActive: isConducting,
          outputState: isConducting,
        };
        break;
      }

      default:
        break;
    }

    return updated;
  });

  // 3. Update Oscilloscope circular buffers (last 100 samples)
  const maxSamples = 100;
  // Probe A defaults to 555 output pin 3 or first active LED anode
  const ne555 = updatedComponents.find((c) => c.typeId === 'ic_ne555');
  const led = updatedComponents.find((c) => c.typeId.startsWith('led_'));

  const sampleAVoltage = ne555?.simState.outputState ? vccVoltage * 0.9 : 0.2;
  const sampleBVoltage = ne555?.simState.chargeVoltage ?? (led?.simState.voltageDrop || 0);

  const updatedChannelA = [
    ...state.channelAData.slice(-(maxSamples - 1)),
    { timeMs: newSimTime, voltage: sampleAVoltage },
  ];
  const updatedChannelB = [
    ...state.channelBData.slice(-(maxSamples - 1)),
    { timeMs: newSimTime, voltage: sampleBVoltage },
  ];

  return {
    ...state,
    components: updatedComponents,
    simTimeMs: newSimTime,
    channelAData: updatedChannelA,
    channelBData: updatedChannelB,
    statusMessage: `Simulating @ ${newSimTime}ms | ${nets.length} nets resolved | VCC: ${vccVoltage}V`,
  };
}
