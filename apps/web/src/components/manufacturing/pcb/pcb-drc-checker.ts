import type { PlacedComponent, CopperTraceSegment, DrcViolation } from './pcb-types';
import { getPinAbsolutePosition } from './pcb-sim-engine';

export interface DrcRuleConfig {
  minClearanceMm: number; // e.g. 0.2mm
  minTraceWidthMm: number; // e.g. 0.2mm
  minDrillSizeMm: number; // e.g. 0.3mm
}

const DEFAULT_RULES: DrcRuleConfig = {
  minClearanceMm: 0.2,
  minTraceWidthMm: 0.2,
  minDrillSizeMm: 0.3,
};

// Distance between a point and a line segment
function distancePointToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

export function runDesignRuleCheck(
  components: PlacedComponent[],
  traces: CopperTraceSegment[],
  rules: Partial<DrcRuleConfig> = {}
): DrcViolation[] {
  const cfg = { ...DEFAULT_RULES, ...rules };
  const violations: DrcViolation[] = [];

  // 1. Check minimum trace width
  for (const trace of traces) {
    if (trace.widthMm < cfg.minTraceWidthMm) {
      violations.push({
        id: `drc_width_${trace.id}`,
        code: 'MIN_WIDTH',
        severity: 'error',
        message: `Trace width ${trace.widthMm}mm is below design rule minimum of ${cfg.minTraceWidthMm}mm`,
        x: (trace.startX + trace.endX) / 2,
        y: (trace.startY + trace.endY) / 2,
        layer: trace.layer,
      });
    }
  }

  // 2. Check trace clearance between different nets
  for (let i = 0; i < traces.length; i++) {
    for (let j = i + 1; j < traces.length; j++) {
      const t1 = traces[i];
      const t2 = traces[j];
      if (!t1 || !t2) continue;

      // Only check if on the same copper layer and different electrical nets
      if (t1.layer === t2.layer && t1.netId && t2.netId && t1.netId !== t2.netId) {
        // Approximate distance between segment endpoints to segment
        const d1 = distancePointToSegment(t1.startX, t1.startY, t2.startX, t2.startY, t2.endX, t2.endY);
        const d2 = distancePointToSegment(t1.endX, t1.endY, t2.startX, t2.startY, t2.endX, t2.endY);
        const minDist = Math.min(d1, d2);
        const halfWidths = (t1.widthMm + t2.widthMm) / 2;

        if (minDist < cfg.minClearanceMm + halfWidths) {
          violations.push({
            id: `drc_clearance_${t1.id}_${t2.id}`,
            code: 'CLEARANCE_VIOLATION',
            severity: 'error',
            message: `Clearance ${(minDist - halfWidths).toFixed(2)}mm between Net '${t1.netId}' and Net '${t2.netId}' violates minimum clearance of ${cfg.minClearanceMm}mm`,
            x: Number(((t1.startX + t2.startX) / 2).toFixed(2)),
            y: Number(((t1.startY + t2.startY) / 2).toFixed(2)),
            layer: t1.layer,
          });
        }
      }
    }
  }

  // 3. Check for unconnected nets / pins
  for (const comp of components) {
    for (const pin of comp.footprint.pins) {
      const pinPos = getPinAbsolutePosition(comp, pin.id);
      if (!pinPos) continue;

      // Check if this pin is reached by any copper trace
      const hasConnection = traces.some((t) => {
        const dStart = Math.hypot(t.startX - pinPos.x, t.startY - pinPos.y);
        const dEnd = Math.hypot(t.endX - pinPos.x, t.endY - pinPos.y);
        return dStart < 0.6 || dEnd < 0.6;
      });

      if (!hasConnection && comp.category !== 'Instruments') {
        violations.push({
          id: `drc_unconn_${comp.id}_${pin.id}`,
          code: 'UNCONNECTED_NET',
          severity: 'warning',
          message: `Unconnected pin ${comp.id}.${pin.name} (no trace or wire attached)`,
          x: pinPos.x,
          y: pinPos.y,
        });
      }
    }
  }

  return violations;
}
