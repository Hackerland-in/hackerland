import { z } from 'zod';

export const heatsinkMaterialSchema = z.enum([
  'aluminum_6063_t5',
  'aluminum_6061_t6',
  'copper_c11000',
  'graphite_composite',
]);
export type HeatsinkMaterial = z.infer<typeof heatsinkMaterialSchema>;

export const coolingMethodSchema = z.enum([
  'natural_convection',
  'forced_convection_low_cfm', // e.g. 5-15 CFM quiet fan
  'forced_convection_high_cfm', // e.g. 30-80 CFM server/industrial blower
]);
export type CoolingMethod = z.infer<typeof coolingMethodSchema>;

export const timMaterialSchema = z.enum([
  'thermal_paste_mx4',
  'phase_change_ptm7950',
  'sil_pad_elastomeric',
  'graphite_sheet_laird',
  'ceramic_alumina_wafer',
]);
export type TimMaterial = z.infer<typeof timMaterialSchema>;

export interface TimMaterialInfo {
  id: TimMaterial;
  name: string;
  thermalConductivityWmk: number;
  typicalBltMicrons: number; // Bond line thickness
  thermalImpedanceKcm2PerW: number;
  dielectricIsolationKv: number;
  description: string;
}

export const TIM_DATABASE: Record<TimMaterial, TimMaterialInfo> = {
  thermal_paste_mx4: {
    id: 'thermal_paste_mx4',
    name: 'High-Performance Non-Curing Grease (Arctic MX-4)',
    thermalConductivityWmk: 8.5,
    typicalBltMicrons: 40,
    thermalImpedanceKcm2PerW: 0.06,
    dielectricIsolationKv: 0,
    description: 'Micro-particle paste filling microscopic surface voids. Non-conductive, zero dielectric isolation.',
  },
  phase_change_ptm7950: {
    id: 'phase_change_ptm7950',
    name: 'Honeywell PTM7950 Phase Change Material',
    thermalConductivityWmk: 8.5,
    typicalBltMicrons: 50,
    thermalImpedanceKcm2PerW: 0.04,
    dielectricIsolationKv: 0,
    description: 'Solid at room temperature, softens at 45°C to form ultra-thin bond line with zero pump-out risk over 1000 thermal cycles.',
  },
  sil_pad_elastomeric: {
    id: 'sil_pad_elastomeric',
    name: 'Bergquist Sil-Pad 900S Fiberglass Elastomer',
    thermalConductivityWmk: 1.6,
    typicalBltMicrons: 230,
    thermalImpedanceKcm2PerW: 0.85,
    dielectricIsolationKv: 4.5,
    description: 'High dielectric breakdown silicone sheet. Essential for TO-220 / TO-247 MOSFET tabs needing chassis electrical insulation.',
  },
  graphite_sheet_laird: {
    id: 'graphite_sheet_laird',
    name: 'Pyrolytic Graphite Sheet (PGS) Synthetic Film',
    thermalConductivityWmk: 1200, // In-plane
    typicalBltMicrons: 70,
    thermalImpedanceKcm2PerW: 0.12,
    dielectricIsolationKv: 0,
    description: 'Ultra-high in-plane conductivity spreading hot-spots horizontally before vertical heat sink transfer. Electrically conductive.',
  },
  ceramic_alumina_wafer: {
    id: 'ceramic_alumina_wafer',
    name: 'Alumina Ceramic Wafer (Al2O3 96%)',
    thermalConductivityWmk: 25.0,
    typicalBltMicrons: 500,
    thermalImpedanceKcm2PerW: 0.45,
    dielectricIsolationKv: 10.0,
    description: 'Rigid ceramic insulator for high-voltage SiC/GaN traction inverters. Immune to mechanical cut-through.',
  },
};

export const thermalCalculationParamsSchema = z.object({
  powerDissipationWatts: z.number().positive(),
  ambientTemperatureC: z.number().default(40),
  maxJunctionTemperatureC: z.number().positive().default(150),
  junctionToCaseResistanceCPerW: z.number().nonnegative(), // theta_jc
  timMaterial: timMaterialSchema,
  timContactAreaCm2: z.number().positive(),
  heatsinkMaterial: heatsinkMaterialSchema,
  coolingMethod: coolingMethodSchema,
  // Heatsink physical geometry (mm)
  heatsinkWidthMm: z.number().positive(),
  heatsinkLengthMm: z.number().positive(),
  baseThicknessMm: z.number().positive(),
  finHeightMm: z.number().positive(),
  finThicknessMm: z.number().positive(),
  numberOfFins: z.number().int().min(2),
  airVelocityMPerS: z.number().nonnegative().optional(), // for forced convection
});
export type ThermalCalculationParams = z.input<typeof thermalCalculationParamsSchema>;

export const thermalCalculationResultSchema = z.object({
  thetaJc: z.number().nonnegative(),
  thetaCs: z.number().nonnegative(), // Case-to-sink through TIM
  thetaSa: z.number().nonnegative(), // Sink-to-ambient
  thetaTotal: z.number().nonnegative(),
  junctionTemperatureC: z.number(),
  caseTemperatureC: z.number(),
  heatsinkTemperatureC: z.number(),
  heatTransferCoefficientWPerM2K: z.number().positive(),
  totalSurfaceAreaCm2: z.number().positive(),
  finEfficiencyPercent: z.number().min(0).max(100),
  thermalHeadroomC: z.number(), // maxJunction - junctionTemp
  isThermalRunawayRisk: z.boolean(),
  maxSafeAmbientTemperatureC: z.number(),
});
export type ThermalCalculationResult = z.infer<typeof thermalCalculationResultSchema>;

export const thermalProfileProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  application: z.string().min(1),
  deviceType: z.string().min(1),
  powerDissipationWatts: z.number().positive(),
  operatingAmbientTemperatureC: z.number(),
  coolingMethod: coolingMethodSchema,
  heatsinkMaterial: heatsinkMaterialSchema,
  timMaterial: timMaterialSchema,
  params: z.object({
    heatsinkWidthMm: z.number().positive(),
    heatsinkLengthMm: z.number().positive(),
    baseThicknessMm: z.number().positive(),
    finHeightMm: z.number().positive(),
    finThicknessMm: z.number().positive(),
    numberOfFins: z.number().int().min(2),
    timContactAreaCm2: z.number().positive(),
    junctionToCaseResistanceCPerW: z.number().nonnegative(),
    maxJunctionTemperatureC: z.number().positive(),
  }),
  designNotes: z.array(z.string()),
  indianTestFacility: z.string().min(1),
  regulatoryStandard: z.string().min(1),
});
export type ThermalProfileProject = z.infer<typeof thermalProfileProjectSchema>;

/**
 * Calculates 1D lumped-parameter thermal resistor network and convective heat sink dissipation.
 */
export function calculateThermalDissipation(
  rawParams: ThermalCalculationParams
): ThermalCalculationResult {
  const params = thermalCalculationParamsSchema.parse(rawParams);
  const {
    powerDissipationWatts: pDiss,
    ambientTemperatureC: tAmb,
    maxJunctionTemperatureC: tJMax,
    junctionToCaseResistanceCPerW: thetaJc,
    timMaterial,
    timContactAreaCm2: areaTimCm2,
    heatsinkMaterial,
    coolingMethod,
    heatsinkWidthMm: widthMm,
    heatsinkLengthMm: lengthMm,
    baseThicknessMm: baseThickMm,
    finHeightMm: finHeightMm,
    finThicknessMm: finThickMm,
    numberOfFins: nFins,
    airVelocityMPerS: userAirVel,
  } = params;

  // 1. Case-to-Sink Thermal Resistance through TIM (theta_cs):
  // R_tim = (Thermal Impedance in K*cm^2/W) / Area in cm^2
  const timInfo = TIM_DATABASE[timMaterial];
  const thetaCs = Math.round((timInfo.thermalImpedanceKcm2PerW / areaTimCm2) * 1000) / 1000;

  // 2. Convective Heat Transfer Coefficient h (W / m^2 * K):
  let h = 8.5; // Natural convection baseline in air
  let airVel = userAirVel ?? 0;

  if (coolingMethod === 'forced_convection_low_cfm') {
    airVel = airVel > 0 ? airVel : 1.5; // ~1.5 m/s (~300 LFM)
    h = 10.45 - airVel + 10 * Math.sqrt(airVel); // Jurges empirical formula for air
  } else if (coolingMethod === 'forced_convection_high_cfm') {
    airVel = airVel > 0 ? airVel : 3.5; // ~3.5 m/s (~700 LFM)
    h = 10.45 - airVel + 10 * Math.sqrt(airVel);
  } else {
    // Natural convection: h depends slightly on fin height and delta T
    h = 7.5 + (finHeightMm / 50) * 1.5;
  }
  h = Math.round(h * 10) / 10;

  // 3. Heat Sink Surface Area:
  // Base plate area (bottom + exposed top between fins) + fin surfaces
  const widthM = widthMm / 1000;
  const lengthM = lengthMm / 1000;
  const finHeightM = finHeightMm / 1000;
  const finThickM = finThickMm / 1000;

  // Area of both sides of all fins + fin tips
  const finSurfaceAreaM2 = nFins * (2 * finHeightM * lengthM + finThickM * lengthM);
  // Exposed base area between fins
  const exposedBaseAreaM2 = Math.max(0, widthM * lengthM - nFins * finThickM * lengthM);
  const totalAreaM2 = finSurfaceAreaM2 + exposedBaseAreaM2;
  const totalSurfaceAreaCm2 = Math.round(totalAreaM2 * 10000);

  // 4. Fin Efficiency (eta_fin):
  // Thermal conductivity of material k (W/m*K)
  let kMat = 201; // 6063-T5 aluminum
  if (heatsinkMaterial === 'aluminum_6061_t6') kMat = 167;
  if (heatsinkMaterial === 'copper_c11000') kMat = 385;
  if (heatsinkMaterial === 'graphite_composite') kMat = 350;

  // Fin parameter m = sqrt( (2 * h) / (k * t) )
  const m = Math.sqrt((2 * h) / (kMat * finThickM));
  // Corrected fin length Lc = H + t/2
  const lc = finHeightM + finThickM / 2;
  const mLc = m * lc;
  const finEfficiency = Math.tanh(mLc) / (mLc || 1);
  const finEfficiencyPercent = Math.round(Math.min(100, Math.max(10, finEfficiency * 100)) * 10) / 10;

  // Effective convective surface area A_eff = exposedBase + eta * finSurface
  const effectiveAreaM2 = exposedBaseAreaM2 + (finEfficiencyPercent / 100) * finSurfaceAreaM2;

  // 5. Sink-to-Ambient Thermal Resistance (theta_sa):
  // R_sa = 1 / (h * A_eff) + conductive resistance of base
  const rConductionBase = (baseThickMm / 1000) / (kMat * (widthM * lengthM));
  const rConvection = 1 / (h * effectiveAreaM2);
  const thetaSa = Math.round((rConvection + rConductionBase) * 1000) / 1000;

  // 6. Overall Thermal Chain:
  const thetaTotal = Math.round((thetaJc + thetaCs + thetaSa) * 1000) / 1000;

  // Temperatures:
  // T_j = T_amb + P * theta_total
  // T_case = T_j - P * theta_jc
  // T_sink = T_case - P * theta_cs
  const tempRiseJ = pDiss * thetaTotal;
  const junctionTemperatureC = Math.round((tAmb + tempRiseJ) * 10) / 10;
  const caseTemperatureC = Math.round((junctionTemperatureC - pDiss * thetaJc) * 10) / 10;
  const heatsinkTemperatureC = Math.round((caseTemperatureC - pDiss * thetaCs) * 10) / 10;

  const thermalHeadroomC = Math.round((tJMax - junctionTemperatureC) * 10) / 10;
  const isThermalRunawayRisk = junctionTemperatureC >= tJMax - 5; // <5°C headroom

  // Maximum safe ambient before hitting TjMax:
  const maxSafeAmbientTemperatureC = Math.round((tJMax - pDiss * thetaTotal) * 10) / 10;

  return {
    thetaJc,
    thetaCs,
    thetaSa,
    thetaTotal,
    junctionTemperatureC,
    caseTemperatureC,
    heatsinkTemperatureC,
    heatTransferCoefficientWPerM2K: h,
    totalSurfaceAreaCm2,
    finEfficiencyPercent,
    thermalHeadroomC,
    isThermalRunawayRisk,
    maxSafeAmbientTemperatureC,
  };
}

/**
 * Filter thermal profile projects by material, cooling method, or search query.
 */
export function filterThermalProjects(
  projects: ThermalProfileProject[],
  filters: {
    coolingMethod?: CoolingMethod;
    heatsinkMaterial?: HeatsinkMaterial;
    search?: string;
  }
): ThermalProfileProject[] {
  return projects.filter((p) => {
    if (filters.coolingMethod && p.coolingMethod !== filters.coolingMethod) return false;
    if (filters.heatsinkMaterial && p.heatsinkMaterial !== filters.heatsinkMaterial) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.application.toLowerCase().includes(q) ||
        p.deviceType.toLowerCase().includes(q) ||
        p.indianTestFacility.toLowerCase().includes(q) ||
        p.regulatoryStandard.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
