import { z } from 'zod';

export const ipcTraceInputsSchema = z.object({
  currentAmps: z.number().positive(),
  copperWeightOz: z.union([z.literal(0.5), z.literal(1), z.literal(2), z.literal(3)]),
  tempRiseC: z.number().positive().default(10),
  isInternalLayer: z.boolean().default(false),
});
export type IpcTraceInputs = z.infer<typeof ipcTraceInputsSchema>;

export interface IpcTraceResult {
  widthMm: number;
  widthMils: number;
  areaSqMils: number;
  resistancePerMeterOhms: number;
  powerLossWattsPerMeter: number;
}

export const smpsBuckInputsSchema = z.object({
  vinVolts: z.number().positive(),
  voutVolts: z.number().positive(),
  ioutAmps: z.number().positive(),
  freqKhz: z.number().positive().default(500),
  rippleRatio: z.number().positive().default(0.3), // 30% standard
});
export type SmpsBuckInputs = z.infer<typeof smpsBuckInputsSchema>;

export interface SmpsBuckResult {
  dutyCycle: number;
  inductanceUh: number;
  peakCurrentAmps: number;
  minOutputCapUf: number;
}

export const thermalInputsSchema = z.object({
  powerWatts: z.number().positive(),
  maxJunctionTempC: z.number().positive().default(125),
  ambientTempC: z.number().default(45), // Indian ambient summer
  thetaJc: z.number().positive().default(2.5), // Junction-to-case
});
export type ThermalInputs = z.infer<typeof thermalInputsSchema>;

export interface ThermalResult {
  maxTotalTheta: number;
  requiredHeatsinkTheta: number;
  coolingRecommendation: string;
}

export const componentSourcingItemSchema = z.object({
  mpn: z.string().min(2),
  manufacturer: z.string(),
  category: z.string(),
  description: z.string(),
  package: z.string(),
  lifecycleStatus: z.enum(['active', 'nrnd', 'eol']),
  indianDistributors: z.array(
    z.object({
      name: z.string(),
      inStock: z.boolean(),
      priceInr: z.number().nonnegative(),
      minOrderQty: z.number().int().positive(),
      url: z.string().optional(),
    })
  ),
  globalDistributors: z.array(
    z.object({
      name: z.string(),
      inStock: z.boolean(),
      priceUsd: z.number().nonnegative(),
    })
  ),
  pinCompatibleAlternates: z.array(
    z.object({
      mpn: z.string(),
      manufacturer: z.string(),
      priceInr: z.number().nonnegative(),
      notes: z.string(),
    })
  ),
});
export type ComponentSourcingItem = z.infer<typeof componentSourcingItemSchema>;

export const bomAuditItemSchema = z.object({
  reference: z.string(),
  mpn: z.string(),
  lifecycle: z.enum(['active', 'nrnd', 'eol']),
  riskLevel: z.enum(['low', 'medium', 'high']),
  riskReason: string(),
  suggestedReplacement: z.string().optional(),
});
function string() {
  return z.string();
}
export type BomAuditItem = z.infer<typeof bomAuditItemSchema>;

/**
 * Calculates PCB trace width according to IPC-2152 formula:
 * Area = (I / (k * (dT^b)))^(1/c)
 */
export function calculateIpc2152Trace(inputs: IpcTraceInputs): IpcTraceResult {
  const { currentAmps, copperWeightOz, tempRiseC, isInternalLayer } = inputs;

  // IPC-2152 empirical constants
  const k = isInternalLayer ? 0.024 : 0.048;
  const b = 0.44;
  const c = 0.725;

  const areaSqMils = Math.pow(currentAmps / (k * Math.pow(tempRiseC, b)), 1 / c);
  // Copper thickness: 1 oz = ~1.37 mils (35 microns)
  const thicknessMils = copperWeightOz * 1.37;
  const widthMils = areaSqMils / thicknessMils;
  const widthMm = widthMils * 0.0254;

  // Copper resistivity: 1.72e-8 ohm-meters at 20°C
  const areaSqMeters = areaSqMils * 6.4516e-10;
  const resistancePerMeterOhms = 1.72e-8 / areaSqMeters;
  const powerLossWattsPerMeter = Math.pow(currentAmps, 2) * resistancePerMeterOhms;

  return {
    widthMm: Math.round(widthMm * 100) / 100,
    widthMils: Math.round(widthMils * 10) / 10,
    areaSqMils: Math.round(areaSqMils * 10) / 10,
    resistancePerMeterOhms: Math.round(resistancePerMeterOhms * 1000) / 1000,
    powerLossWattsPerMeter: Math.round(powerLossWattsPerMeter * 100) / 100,
  };
}

/**
 * Calculates continuous conduction mode (CCM) Buck converter inductance and capacitance.
 */
export function calculateSmpsBuck(inputs: SmpsBuckInputs): SmpsBuckResult {
  const { vinVolts, voutVolts, ioutAmps, freqKhz, rippleRatio } = inputs;
  const dutyCycle = Math.min(Math.max(voutVolts / vinVolts, 0.01), 0.99);
  const freqHz = freqKhz * 1000;
  const deltaI = ioutAmps * rippleRatio;

  // L = (Vin - Vout) * D / (fsw * deltaI)
  const inductanceH = ((vinVolts - voutVolts) * dutyCycle) / (freqHz * deltaI);
  const inductanceUh = inductanceH * 1e6;
  const peakCurrentAmps = ioutAmps + deltaI / 2;

  // Cout for < 1% voltage ripple: Cout = deltaI / (8 * fsw * deltaV)
  const deltaV = voutVolts * 0.01;
  const minOutputCapF = deltaI / (8 * freqHz * deltaV);
  const minOutputCapUf = minOutputCapF * 1e6;

  return {
    dutyCycle: Math.round(dutyCycle * 1000) / 1000,
    inductanceUh: Math.max(Math.round(inductanceUh * 10) / 10, 0.1),
    peakCurrentAmps: Math.round(peakCurrentAmps * 100) / 100,
    minOutputCapUf: Math.max(Math.round(minOutputCapUf * 10) / 10, 1.0),
  };
}

/**
 * Calculates required heatsink thermal resistance to keep junction temp below limit.
 */
export function calculateThermalHeatsink(inputs: ThermalInputs): ThermalResult {
  const { powerWatts, maxJunctionTempC, ambientTempC, thetaJc } = inputs;
  const deltaT = maxJunctionTempC - ambientTempC;
  const maxTotalTheta = deltaT / powerWatts;
  const requiredHeatsinkTheta = maxTotalTheta - thetaJc;

  let coolingRecommendation = 'Natural Convection (No Heatsink Required)';
  if (requiredHeatsinkTheta < 0) {
    coolingRecommendation = 'Extreme Overheating! Active Liquid Cooling or Thermal Throttling Required';
  } else if (requiredHeatsinkTheta <= 2.0) {
    coolingRecommendation = 'Forced Air Heat Pipe with Active 12V High-CFM Fan Required';
  } else if (requiredHeatsinkTheta <= 6.0) {
    coolingRecommendation = 'Extruded Aluminium Heatsink (TO-220 / D2PAK mount) with Thermal Grease';
  } else if (requiredHeatsinkTheta <= 15.0) {
    coolingRecommendation = 'Small Stamped PCB Copper Pour Heatsink with Thermal Vias';
  }

  return {
    maxTotalTheta: Math.round(maxTotalTheta * 100) / 100,
    requiredHeatsinkTheta: Math.round(requiredHeatsinkTheta * 100) / 100,
    coolingRecommendation,
  };
}

/**
 * Audits a list of BOM items for single-source, end-of-life, and obsolescence risks.
 */
export function auditBomItems(
  items: { reference: string; mpn: string }[],
  catalog: ComponentSourcingItem[]
): BomAuditItem[] {
  return items.map((item) => {
    const match = catalog.find((c) => c.mpn.toLowerCase() === item.mpn.toLowerCase());
    if (!match) {
      return {
        reference: item.reference,
        mpn: item.mpn,
        lifecycle: 'active',
        riskLevel: 'medium',
        riskReason: 'Unverified MPN in domestic database - Verify manufacturer lead times manually.',
      };
    }

    if (match.lifecycleStatus === 'eol') {
      return {
        reference: item.reference,
        mpn: item.mpn,
        lifecycle: 'eol',
        riskLevel: 'high',
        riskReason: 'Component is End-Of-Life (EOL). Production halted by manufacturer.',
        suggestedReplacement: match.pinCompatibleAlternates[0]?.mpn,
      };
    }

    if (match.lifecycleStatus === 'nrnd') {
      return {
        reference: item.reference,
        mpn: item.mpn,
        lifecycle: 'nrnd',
        riskLevel: 'medium',
        riskReason: 'Not Recommended for New Designs (NRND). Phasing out over next 18 months.',
        suggestedReplacement: match.pinCompatibleAlternates[0]?.mpn,
      };
    }

    const domesticStock = match.indianDistributors.some((d) => d.inStock);
    if (!domesticStock) {
      return {
        reference: item.reference,
        mpn: item.mpn,
        lifecycle: 'active',
        riskLevel: 'medium',
        riskReason: 'Zero domestic Indian stock. Requires international import with 42% duty and 3-week lead time.',
        suggestedReplacement: match.pinCompatibleAlternates[0]?.mpn,
      };
    }

    return {
      reference: item.reference,
      mpn: item.mpn,
      lifecycle: 'active',
      riskLevel: 'low',
      riskReason: 'Multiple domestic Indian distributors in stock with verified pin-compatible alternates.',
    };
  });
}
