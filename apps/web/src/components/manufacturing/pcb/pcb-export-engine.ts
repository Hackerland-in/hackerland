import type { PlacedComponent, CopperTraceSegment, PcbVia } from './pcb-types';
import { getPinAbsolutePosition } from './pcb-sim-engine';

export interface PcbExportPackage {
  bomCsv: string;
  cplCsv: string;
  gerberTopCopper: string;
  gerberBottomCopper: string;
  gerberTopSilk: string;
  gerberEdgeCuts: string;
  excellonDrill: string;
  kicadNetlist: string;
}

// Format number to Gerber 4.4 leading zero integer string (e.g. 10.5mm -> "0105000")
function toGerberCoord(mm: number): string {
  const scaled = Math.round(mm * 10000);
  const sign = scaled < 0 ? '-' : '';
  const abs = Math.abs(scaled).toString().padStart(7, '0');
  return `${sign}${abs}`;
}

export function generateBomCsv(components: PlacedComponent[]): string {
  const headers = ['Designator', 'Quantity', 'Value', 'Package', 'Category', 'Description'];
  // Group by (typeId + value)
  const groups = new Map<string, { value: string; packageType: string; category: string; desc: string; desigs: string[] }>();

  for (const comp of components) {
    const key = `${comp.typeId}_${comp.value}`;
    if (!groups.has(key)) {
      groups.set(key, {
        value: comp.value,
        packageType: comp.footprint.packageType,
        category: comp.category,
        desc: comp.name,
        desigs: [],
      });
    }
    groups.get(key)!.desigs.push(comp.id);
  }

  const rows = [headers.join(',')];
  for (const group of groups.values()) {
    rows.push([
      `"${group.desigs.join(', ')}"`,
      group.desigs.length.toString(),
      `"${group.value}"`,
      `"${group.packageType}"`,
      `"${group.category}"`,
      `"${group.desc}"`,
    ].join(','));
  }

  return rows.join('\n');
}

export function generateCplCsv(components: PlacedComponent[]): string {
  const headers = ['Designator', 'Mid X (mm)', 'Mid Y (mm)', 'Rotation', 'Layer', 'Package', 'Value'];
  const rows = [headers.join(',')];

  for (const comp of components) {
    rows.push([
      comp.id,
      comp.x.toFixed(3),
      comp.y.toFixed(3),
      comp.rotationDeg.toString(),
      'TopLayer',
      `"${comp.footprint.packageType}"`,
      `"${comp.value}"`,
    ].join(','));
  }

  return rows.join('\n');
}

export function generateGerberTopCopper(
  components: PlacedComponent[],
  traces: CopperTraceSegment[],
  vias: PcbVia[],
  _boardWidth = 100,
  _boardHeight = 80
): string {
  const lines: string[] = [
    'G04 Standard RS-274X Top Copper Layer*',
    '%FSLAX44Y44*%',
    '%MOMM*%',
    '%LPD*%',
    '%ADD10C,0.250*%  (Standard Signal Trace Aperture)',
    '%ADD11C,0.800*%  (Power Trace Aperture)',
    '%ADD12C,1.600*%  (Through-hole Pad Outer Ring)',
    '%ADD13C,0.800*%  (Via Outer Ring)',
    'D10*',
  ];

  // Draw top traces
  const topTraces = traces.filter((t) => t.layer === 'top_copper');
  for (const t of topTraces) {
    const dCode = t.widthMm >= 0.6 ? 'D11*' : 'D10*';
    lines.push(dCode);
    lines.push(`X${toGerberCoord(t.startX)}Y${toGerberCoord(t.startY)}D02*`); // Move
    lines.push(`X${toGerberCoord(t.endX)}Y${toGerberCoord(t.endY)}D01*`); // Flash/Interpolate line
  }

  // Flash pads for THT components
  lines.push('D12*');
  for (const comp of components) {
    for (const pin of comp.footprint.pins) {
      const pos = getPinAbsolutePosition(comp, pin.id);
      if (pos) {
        lines.push(`X${toGerberCoord(pos.x)}Y${toGerberCoord(pos.y)}D03*`); // Flash pad
      }
    }
  }

  // Flash vias
  lines.push('D13*');
  for (const via of vias) {
    lines.push(`X${toGerberCoord(via.x)}Y${toGerberCoord(via.y)}D03*`);
  }

  lines.push('M02*');
  return lines.join('\n');
}

export function generateGerberBottomCopper(
  traces: CopperTraceSegment[],
  components: PlacedComponent[],
  _vias: PcbVia[]
): string {
  const lines: string[] = [
    'G04 Standard RS-274X Bottom Copper Layer*',
    '%FSLAX44Y44*%',
    '%MOMM*%',
    '%LPD*%',
    '%ADD10C,0.250*%',
    '%ADD11C,0.800*%',
    '%ADD12C,1.600*%',
    '%ADD13C,0.800*%',
  ];

  const botTraces = traces.filter((t) => t.layer === 'bottom_copper');
  for (const t of botTraces) {
    const dCode = t.widthMm >= 0.6 ? 'D11*' : 'D10*';
    lines.push(dCode);
    lines.push(`X${toGerberCoord(t.startX)}Y${toGerberCoord(t.startY)}D02*`);
    lines.push(`X${toGerberCoord(t.endX)}Y${toGerberCoord(t.endY)}D01*`);
  }

  // Flash THT pads on bottom copper as well
  lines.push('D12*');
  for (const comp of components) {
    for (const pin of comp.footprint.pins) {
      if (pin.padType === 'tht') {
        const pos = getPinAbsolutePosition(comp, pin.id);
        if (pos) {
          lines.push(`X${toGerberCoord(pos.x)}Y${toGerberCoord(pos.y)}D03*`);
        }
      }
    }
  }

  lines.push('M02*');
  return lines.join('\n');
}

export function generateGerberTopSilk(components: PlacedComponent[]): string {
  const lines: string[] = [
    'G04 Top Silkscreen Legend*',
    '%FSLAX44Y44*%',
    '%MOMM*%',
    '%LPD*%',
    '%ADD14C,0.150*%  (Silkscreen Stroke Width)',
    'D14*',
  ];

  for (const comp of components) {
    const halfW = comp.footprint.widthMm / 2;
    const halfH = comp.footprint.heightMm / 2;
    const x1 = comp.x - halfW;
    const y1 = comp.y - halfH;
    const x2 = comp.x + halfW;
    const y2 = comp.y + halfH;

    // Draw component boundary box
    lines.push(`X${toGerberCoord(x1)}Y${toGerberCoord(y1)}D02*`);
    lines.push(`X${toGerberCoord(x2)}Y${toGerberCoord(y1)}D01*`);
    lines.push(`X${toGerberCoord(x2)}Y${toGerberCoord(y2)}D01*`);
    lines.push(`X${toGerberCoord(x1)}Y${toGerberCoord(y2)}D01*`);
    lines.push(`X${toGerberCoord(x1)}Y${toGerberCoord(y1)}D01*`);
  }

  lines.push('M02*');
  return lines.join('\n');
}

export function generateGerberEdgeCuts(width = 100, height = 80): string {
  return [
    'G04 Board Edge Outline Cutout*',
    '%FSLAX44Y44*%',
    '%MOMM*%',
    '%LPD*%',
    '%ADD15C,0.200*%',
    'D15*',
    `X0Y0D02*`,
    `X${toGerberCoord(width)}Y0D01*`,
    `X${toGerberCoord(width)}Y${toGerberCoord(height)}D01*`,
    `X0Y${toGerberCoord(height)}D01*`,
    `X0Y0D01*`,
    'M02*',
  ].join('\n');
}

export function generateExcellonDrill(components: PlacedComponent[], vias: PcbVia[]): string {
  const lines: string[] = [
    'M48',
    'METRIC,TZ',
    'FMAT,2',
    'T01C0.800 (IC and THT Pin Drill)',
    'T02C0.400 (Via Drill)',
    '%',
    'G90',
    'G05',
    'T01',
  ];

  // Component THT pins
  for (const comp of components) {
    for (const pin of comp.footprint.pins) {
      if (pin.padType === 'tht') {
        const pos = getPinAbsolutePosition(comp, pin.id);
        if (pos) {
          const x = (pos.x * 1000).toFixed(0).padStart(6, '0');
          const y = (pos.y * 1000).toFixed(0).padStart(6, '0');
          lines.push(`X${x}Y${y}`);
        }
      }
    }
  }

  // Vias
  if (vias.length > 0) {
    lines.push('T02');
    for (const via of vias) {
      const x = (via.x * 1000).toFixed(0).padStart(6, '0');
      const y = (via.y * 1000).toFixed(0).padStart(6, '0');
      lines.push(`X${x}Y${y}`);
    }
  }

  lines.push('M30');
  return lines.join('\n');
}

export function generateKiCadNetlist(components: PlacedComponent[], _traces: CopperTraceSegment[]): string {
  const lines: string[] = [
    '(export (version D)',
    '  (design',
    '    (source "Hackerland_PCB_Studio.kicad_pcb")',
    '    (tool "Hackerland PCB Studio 2026.1")',
    '  )',
    '  (components',
  ];

  for (const comp of components) {
    lines.push(`    (comp (ref ${comp.id})`);
    lines.push(`      (value "${comp.value}")`);
    lines.push(`      (footprint "${comp.footprint.packageType}")`);
    lines.push(`      (libsource (lib "Device") (part "${comp.typeId}"))`);
    lines.push(`    )`);
  }
  lines.push('  )');

  lines.push('  (nets');
  // Simple netlist group
  lines.push('    (net (code 1) (name "GND")');
  for (const comp of components) {
    for (const pin of comp.footprint.pins) {
      if (pin.id === 'gnd' || pin.id === 'neg') {
        lines.push(`      (node (ref ${comp.id}) (pin ${pin.id}))`);
      }
    }
  }
  lines.push('    )');
  lines.push('  )');
  lines.push(')');

  return lines.join('\n');
}

export function buildCompleteManufacturingExport(
  components: PlacedComponent[],
  traces: CopperTraceSegment[],
  vias: PcbVia[],
  boardWidth = 100,
  boardHeight = 80
): PcbExportPackage {
  return {
    bomCsv: generateBomCsv(components),
    cplCsv: generateCplCsv(components),
    gerberTopCopper: generateGerberTopCopper(components, traces, vias, boardWidth, boardHeight),
    gerberBottomCopper: generateGerberBottomCopper(traces, components, vias),
    gerberTopSilk: generateGerberTopSilk(components),
    gerberEdgeCuts: generateGerberEdgeCuts(boardWidth, boardHeight),
    excellonDrill: generateExcellonDrill(components, vias),
    kicadNetlist: generateKiCadNetlist(components, traces),
  };
}
