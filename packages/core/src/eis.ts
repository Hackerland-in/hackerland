import { z } from 'zod';

export const cellChemistrySchema = z.enum([
  'lfp_32700',
  'lfp_prismatic',
  'nmc_21700',
  'nmc_4680',
  'lto_prismatic',
  'sodium_ion',
]);
export type CellChemistry = z.infer<typeof cellChemistrySchema>;

export const eisDataPointSchema = z.object({
  frequencyHz: z.number().positive(),
  zRealOhm: z.number(),
  zImagOhm: z.number(), // imaginary component (typically negative capacitive, plotted as -Z'' in Nyquist)
  magnitudeOhm: z.number().positive(),
  phaseDeg: z.number(),
});
export type EisDataPoint = z.infer<typeof eisDataPointSchema>;

export const randlesEcmParametersSchema = z.object({
  rBulkOhm: z.number().positive(), // R0: Bulk electrolyte & contact resistance (zero-crossing)
  rSeiOhm: z.number().nonnegative(), // R_sei: Solid Electrolyte Interphase film resistance
  cSeiFarad: z.number().positive(), // C_sei: SEI film capacitance
  rCtOhm: z.number().positive(), // R_ct: Charge-transfer resistance
  cDlFarad: z.number().positive(), // C_dl: Electrochemical double-layer capacitance
  warburgSigma: z.number().nonnegative(), // sigma_w: Warburg diffusion coefficient (Ohm*s^-0.5)
});
export type RandlesEcmParameters = z.infer<typeof randlesEcmParametersSchema>;

export const batteryHealthDiagnosticsSchema = z.object({
  sohPercent: z.number().min(0).max(100),
  capacityAh: z.number().positive(),
  nominalCapacityAh: z.number().positive(),
  internalResistanceIncreasePercent: z.number(),
  seiLayerGrowthWarning: z.boolean(),
  lithiumPlatingRisk: z.enum(['none', 'elevated', 'critical']),
  estimatedCycleLifeRemaining: z.number().nonnegative(),
  ais156SafetyVerdict: z.enum(['certified_safe', 'advisory_derate', 'quarantine_isolate']),
});
export type BatteryHealthDiagnostics = z.infer<typeof batteryHealthDiagnosticsSchema>;

export const batteryEisProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  cellModel: z.string().min(1),
  chemistry: cellChemistrySchema,
  nominalVoltageV: z.number().positive(),
  nominalCapacityAh: z.number().positive(),
  cycleCount: z.number().nonnegative(),
  testTemperatureC: z.number(),
  stateOfChargeSocPercent: z.number().min(0).max(100),
  eisSpectrum: z.array(eisDataPointSchema).min(3),
  fittedEcm: randlesEcmParametersSchema,
  diagnostics: batteryHealthDiagnosticsSchema,
  testFacility: z.string().min(1),
  testingNotes: z.string(),
});
export type BatteryEisProject = z.infer<typeof batteryEisProjectSchema>;

/**
 * Calculates theoretical Randles complex impedance point at frequency f.
 */
export function calculateRandlesImpedance(
  params: RandlesEcmParameters,
  frequencyHz: number
): { zReal: number; zImag: number; magnitude: number; phaseDeg: number } {
  const omega = 2 * Math.PI * frequencyHz;
  const { rBulkOhm, rSeiOhm, cSeiFarad, rCtOhm, cDlFarad, warburgSigma } = params;

  // 1. Bulk electrolyte resistance: Z_bulk = R0
  let real = rBulkOhm;
  let imag = 0;

  // 2. SEI Parallel loop: Z_sei = R_sei / (1 + j*omega*R_sei*C_sei)
  if (rSeiOhm > 0) {
    const denomSei = 1 + Math.pow(omega * rSeiOhm * cSeiFarad, 2);
    real += rSeiOhm / denomSei;
    imag += -(omega * Math.pow(rSeiOhm, 2) * cSeiFarad) / denomSei;
  }

  // 3. Warburg diffusion impedance: Z_w = sigma / sqrt(omega) * (1 - j)
  const zwMag = warburgSigma / Math.sqrt(omega);
  const zwReal = zwMag;
  const zwImag = -zwMag;

  // 4. Charge-transfer branch: Z_faradaic = R_ct + Z_w
  const zfReal = rCtOhm + zwReal;
  const zfImag = zwImag;

  // In parallel with C_dl:
  // Y_dl = j * omega * C_dl
  // Y_f = 1 / (zfReal + j*zfImag) = (zfReal - j*zfImag) / (zfReal^2 + zfImag^2)
  const denomF = Math.pow(zfReal, 2) + Math.pow(zfImag, 2);
  const yfReal = zfReal / denomF;
  const yfImag = -zfImag / denomF;

  const yTotalReal = yfReal;
  const yTotalImag = yfImag + omega * cDlFarad;

  const denomTotal = Math.pow(yTotalReal, 2) + Math.pow(yTotalImag, 2);
  const zBranchReal = yTotalReal / denomTotal;
  const zBranchImag = -yTotalImag / denomTotal;

  real += zBranchReal;
  imag += zBranchImag;

  const magnitude = Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2));
  const phaseDeg = (Math.atan2(imag, real) * 180) / Math.PI;

  return {
    zReal: Math.round(real * 10000) / 10000,
    zImag: Math.round(imag * 10000) / 10000,
    magnitude: Math.round(magnitude * 10000) / 10000,
    phaseDeg: Math.round(phaseDeg * 10) / 10,
  };
}

/**
 * Evaluates Battery State-of-Health (SoH) and AIS-156 safety verdict from EIS spectrum.
 */
export function evaluateBatterySoH(
  spectrum: EisDataPoint[],
  nominalCapacityAh: number,
  baselineR0Ohm: number
): BatteryHealthDiagnostics {
  if (spectrum.length === 0) {
    throw new Error('EIS spectrum must contain data points');
  }

  // Find high-frequency bulk resistance: point with minimum absolute imaginary component
  let minAbsImag = Infinity;
  let estimatedR0 = spectrum[0]?.zRealOhm ?? 0.02;

  for (const pt of spectrum) {
    if (Math.abs(pt.zImagOhm) < minAbsImag) {
      minAbsImag = Math.abs(pt.zImagOhm);
      estimatedR0 = pt.zRealOhm;
    }
  }

  // Find maximum semi-circle apex (charge transfer peak)
  let maxNegImag = 0;
  let apexReal = estimatedR0;
  for (const pt of spectrum) {
    if (-pt.zImagOhm > maxNegImag) {
      maxNegImag = -pt.zImagOhm;
      apexReal = pt.zRealOhm;
    }
  }

  const estimatedRct = Math.max(0.005, (apexReal - estimatedR0) * 2);
  const resistanceIncreasePercent = Math.max(
    0,
    Math.round(((estimatedR0 - baselineR0Ohm) / baselineR0Ohm) * 1000) / 10
  );

  // SOH estimation: Empirical degradation model
  // As R0 rises by 100%, capacity typically degrades by ~20%
  const sohDegradation = (resistanceIncreasePercent / 100) * 18 + (estimatedRct / 0.05) * 4;
  const rawSoh = Math.max(40, Math.min(100, 100 - sohDegradation));
  const sohPercent = Math.round(rawSoh * 10) / 10;
  const capacityAh = Math.round(nominalCapacityAh * (sohPercent / 100) * 100) / 100;

  // Check for SEI growth warning
  const seiLayerGrowthWarning = resistanceIncreasePercent > 35;

  // Lithium plating risk detection:
  // Plating occurs when charge transfer is severely impeded or anomalous inductive phase shifts occur
  let lithiumPlatingRisk: 'none' | 'elevated' | 'critical' = 'none';
  if (resistanceIncreasePercent > 75 || sohPercent < 75) {
    lithiumPlatingRisk = 'critical';
  } else if (resistanceIncreasePercent > 40 || sohPercent < 85) {
    lithiumPlatingRisk = 'elevated';
  }

  // Estimated cycles remaining based on 80% EOL threshold
  const estimatedCycleLifeRemaining = Math.max(
    0,
    Math.round(((sohPercent - 80) / 20) * 1500)
  );

  // AIS-156 Amendment 3 Safety Verdict
  let ais156SafetyVerdict: 'certified_safe' | 'advisory_derate' | 'quarantine_isolate' = 'certified_safe';
  if (lithiumPlatingRisk === 'critical' || resistanceIncreasePercent > 80 || sohPercent < 75) {
    ais156SafetyVerdict = 'quarantine_isolate';
  } else if (lithiumPlatingRisk === 'elevated' || resistanceIncreasePercent > 40 || sohPercent < 85) {
    ais156SafetyVerdict = 'advisory_derate';
  }

  return {
    sohPercent,
    capacityAh,
    nominalCapacityAh,
    internalResistanceIncreasePercent: resistanceIncreasePercent,
    seiLayerGrowthWarning,
    lithiumPlatingRisk,
    estimatedCycleLifeRemaining,
    ais156SafetyVerdict,
  };
}

/**
 * Filters battery EIS projects by chemistry, safety verdict, or search query.
 */
export function filterBatteryEisProjects(
  projects: BatteryEisProject[],
  filters: {
    chemistry?: CellChemistry;
    safetyVerdict?: 'certified_safe' | 'advisory_derate' | 'quarantine_isolate';
    search?: string;
  }
): BatteryEisProject[] {
  return projects.filter((p) => {
    if (filters.chemistry && p.chemistry !== filters.chemistry) return false;
    if (filters.safetyVerdict && p.diagnostics.ais156SafetyVerdict !== filters.safetyVerdict) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.cellModel.toLowerCase().includes(q) ||
        p.testFacility.toLowerCase().includes(q) ||
        p.testingNotes.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
