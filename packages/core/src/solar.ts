import { z } from 'zod';

export const solarCellTechnologySchema = z.enum([
  'mono_perc',
  'topcon_n_type',
  'bifacial_hjt',
  'polycrystalline',
  'thin_film_cigs',
]);
export type SolarCellTechnology = z.infer<typeof solarCellTechnologySchema>;

export const mpptAlgorithmSchema = z.enum([
  'perturb_and_observe',
  'incremental_conductance',
  'fractional_voc',
  'global_sweep_partial_shading',
]);
export type MpptAlgorithm = z.infer<typeof mpptAlgorithmSchema>;

export const batteryBankTypeSchema = z.enum([
  'lfp_48v',
  'lfp_24v',
  'lfp_12v',
  'lead_acid_48v',
  'lead_acid_12v',
]);
export type BatteryBankType = z.infer<typeof batteryBankTypeSchema>;

export const ivCurvePointSchema = z.object({
  voltageV: z.number().nonnegative(),
  currentA: z.number().nonnegative(),
  powerW: z.number().nonnegative(),
});
export type IvCurvePoint = z.infer<typeof ivCurvePointSchema>;

export const solarPvPanelSpecsSchema = z.object({
  panelModel: z.string().default('Generic Tier-1 Solar PV Module'),
  technology: solarCellTechnologySchema,
  nominalPmaxW: z.number().positive(),
  nominalVmpV: z.number().positive(),
  nominalImpA: z.number().positive(),
  nominalVocV: z.number().positive(),
  nominalIscA: z.number().positive(),
  tempCoeffVocPercentPerC: z.number().negative(), // e.g. -0.27 %/C
  tempCoeffIscPercentPerC: z.number().positive(), // e.g. +0.045 %/C
  tempCoeffPmaxPercentPerC: z.number().negative(), // e.g. -0.34 %/C
  seriesCells: z.number().int().positive().default(72),
});
export type SolarPvPanelSpecs = z.infer<typeof solarPvPanelSpecsSchema>;

export const solarSimulationParamsSchema = z.object({
  irradianceWPerM2: z.number().min(50).max(1400).default(1000), // G (Standard Test Condition STC = 1000)
  cellTemperatureC: z.number().min(-40).max(85).default(25), // T_cell (STC = 25C)
  panelSpecs: solarPvPanelSpecsSchema,
  algorithm: mpptAlgorithmSchema.default('incremental_conductance'),
  partialShadingRatio: z.number().min(0).max(0.8).default(0), // 0 = uniform, 0.4 = 40% shaded bypass diode activation
  targetBatteryType: batteryBankTypeSchema.default('lfp_48v'),
  converterSwitchingFreqKhz: z.number().min(50).max(500).default(150),
});
export type SolarSimulationParams = z.input<typeof solarSimulationParamsSchema>;

export const mpptSimulationResultSchema = z.object({
  vocActualV: z.number().positive(),
  iscActualA: z.number().positive(),
  vmppActualV: z.number().positive(),
  imppActualA: z.number().positive(),
  pmppActualW: z.number().positive(),
  fillFactor: z.number().min(0).max(1),
  trackingEfficiencyPercent: z.number().min(90).max(100),
  mpptTrackedPowerW: z.number().positive(),
  converterDutyCycle: z.number().min(0).max(1),
  converterInductanceMicroH: z.number().positive(),
  converterOutputCapacitanceMicroF: z.number().positive(),
  batteryChargingStage: z.enum(['bulk_cc', 'absorption_cv', 'float_maintenance']),
  batteryCurrentA: z.number().positive(),
  ivCurve: z.array(ivCurvePointSchema).min(10),
  pvCurve: z.array(ivCurvePointSchema).min(10),
});
export type MpptSimulationResult = z.infer<typeof mpptSimulationResultSchema>;

export const solarMpptProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  application: z.string().min(1),
  systemCapacityWatts: z.number().positive(),
  panelSpecs: solarPvPanelSpecsSchema,
  targetBattery: batteryBankTypeSchema,
  mpptAlgorithm: mpptAlgorithmSchema,
  operatingConditions: z.object({
    designIrradianceWPerM2: z.number().positive(),
    designTemperatureC: z.number(),
    ambientEnvironment: z.string().min(1),
  }),
  converterSpecs: z.object({
    topology: z.string().min(1),
    switchingFrequencyKhz: z.number().positive(),
    peakEfficiencyPercent: z.number().positive(),
    inductorValueUh: z.number().positive(),
    outputCapacitanceUf: z.number().positive(),
  }),
  designDirectives: z.array(z.string()),
  indianContextFacility: z.string().min(1),
  standardsCompliance: z.string().min(1),
});
export type SolarMpptProject = z.infer<typeof solarMpptProjectSchema>;

/**
 * Calculates Single-Diode Photovoltaic IV & PV Curves with MPPT dynamic tracking.
 */
export function simulateSolarMppt(
  rawParams: SolarSimulationParams
): MpptSimulationResult {
  const params = solarSimulationParamsSchema.parse(rawParams);
  const {
    irradianceWPerM2: g,
    cellTemperatureC: tCell,
    panelSpecs: p,
    algorithm,
    partialShadingRatio: shade,
    targetBatteryType,
    converterSwitchingFreqKhz: fswKhz,
  } = params;

  // 1. Temperature Delta from STC (25°C)
  const deltaT = tCell - 25;
  const gRatio = g / 1000;

  // Temperature and Irradiance corrected parameters
  // Isc scales linearly with irradiance, slightly increases with temperature (+alpha)
  const iscActual = Math.max(0.1, p.nominalIscA * gRatio * (1 + (p.tempCoeffIscPercentPerC / 100) * deltaT));

  // Voc decreases with temperature (-beta), scales logarithmically with irradiance
  const thermalVoltDrop = (p.tempCoeffVocPercentPerC / 100) * deltaT * p.nominalVocV;
  const irrVoltEffect = 0.026 * p.seriesCells * Math.log(Math.max(0.05, gRatio));
  const vocActual = Math.max(1.0, p.nominalVocV + thermalVoltDrop + irrVoltEffect);

  // Maximum Power Point Voltage and Current
  let vmppActual = Math.max(0.8, p.nominalVmpV * (1 + (p.tempCoeffPmaxPercentPerC / 100) * deltaT) + irrVoltEffect);
  let imppActual = Math.max(0.1, p.nominalImpA * gRatio * (1 + (p.tempCoeffIscPercentPerC / 100) * deltaT));

  // If partial shading is present, bypass diodes cause a multi-step curve
  if (shade > 0) {
    // Diffuse shading reduces current on unbypassed cells
    imppActual = imppActual * (1 - shade * 0.7);
    vmppActual = vmppActual * (1 - shade * 0.33); // one diode bypassed
  }

  const pmppActualW = Math.round(vmppActual * imppActual * 10) / 10;
  const fillFactor = Math.round((pmppActualW / (vocActual * iscActual)) * 1000) / 1000;

  // 2. MPPT Tracking Algorithm Efficiency
  let trackingEfficiencyPercent = 99.4; // Incremental Conductance default
  if (algorithm === 'perturb_and_observe') {
    trackingEfficiencyPercent = shade > 0 ? 94.2 : 98.6; // P&O oscillates and struggles with partial shading
  } else if (algorithm === 'fractional_voc') {
    trackingEfficiencyPercent = 92.5; // Constant voltage ratio approximation
  } else if (algorithm === 'global_sweep_partial_shading') {
    trackingEfficiencyPercent = shade > 0 ? 99.1 : 99.5; // Global GMPP sweep recovers shaded power
  }

  const mpptTrackedPowerW = Math.round(pmppActualW * (trackingEfficiencyPercent / 100) * 10) / 10;

  // 3. Battery Bank Matching & Synchronous Buck Converter Sizing
  let nominalBatteryVoltage = 48.0;
  let absorptionVoltage = 56.8; // for 16S LFP (3.55V/cell)
  if (targetBatteryType === 'lfp_24v') {
    nominalBatteryVoltage = 24.0;
    absorptionVoltage = 28.4;
  } else if (targetBatteryType === 'lfp_12v') {
    nominalBatteryVoltage = 12.0;
    absorptionVoltage = 14.2;
  } else if (targetBatteryType === 'lead_acid_48v') {
    nominalBatteryVoltage = 48.0;
    absorptionVoltage = 57.6;
  } else if (targetBatteryType === 'lead_acid_12v') {
    nominalBatteryVoltage = 12.0;
    absorptionVoltage = 14.4;
  }

  // Buck converter duty cycle: D = V_out / V_in
  const converterDutyCycle = Math.min(0.98, Math.max(0.05, Math.round((nominalBatteryVoltage / vmppActual) * 1000) / 1000));

  // Battery charging stage & current:
  // P_out = eta_conv * P_in (assume 97.5% synchronous converter efficiency)
  const converterEff = 0.975;
  const deliveredPowerW = mpptTrackedPowerW * converterEff;
  const batteryCurrentA = Math.round((deliveredPowerW / nominalBatteryVoltage) * 10) / 10;

  let batteryChargingStage: 'bulk_cc' | 'absorption_cv' | 'float_maintenance' = 'bulk_cc';
  if (gRatio < 0.2) {
    batteryChargingStage = 'float_maintenance';
  } else if (batteryCurrentA > 15) {
    batteryChargingStage = 'bulk_cc';
  } else {
    batteryChargingStage = 'absorption_cv';
  }

  // Inductor Sizing: L = (Vin - Vout) * D / (Delta_IL * fsw)
  // Target inductor ripple current Delta_IL = 30% of I_out
  const fswHz = fswKhz * 1000;
  const deltaIl = Math.max(0.5, batteryCurrentA * 0.3);
  const vinMinusVout = Math.max(5, vmppActual - nominalBatteryVoltage);
  const lHenry = (vinMinusVout * converterDutyCycle) / (deltaIl * fswHz);
  const converterInductanceMicroH = Math.max(10, Math.round(lHenry * 1e6));

  // Output Capacitor Sizing for <1% voltage ripple: C_out = Delta_IL / (8 * fsw * Delta_Vout)
  const deltaVout = nominalBatteryVoltage * 0.01;
  const cFarad = deltaIl / (8 * fswHz * deltaVout);
  const converterOutputCapacitanceMicroF = Math.max(47, Math.round(cFarad * 1e6));

  // 4. Generate Synthetic IV and PV Curves
  const ivCurve: IvCurvePoint[] = [];
  const pvCurve: IvCurvePoint[] = [];
  const numSteps = 40;

  for (let i = 0; i <= numSteps; i++) {
    const v = (i / numSteps) * vocActual;
    let current = 0;

    if (shade > 0 && v > vmppActual * 0.9) {
      // Partial shading knee
      current = Math.max(0, iscActual * (1 - shade) * (1 - Math.pow(v / vocActual, 4)));
    } else {
      // Standard single-diode exponential approximation
      // I(V) = Isc - I0 * (exp(V / (n*Vt)) - 1)
      const vRatio = v / vocActual;
      current = Math.max(0, iscActual * (1 - Math.pow(vRatio, 5.5)));
    }

    const power = Math.max(0, v * current);
    const pt: IvCurvePoint = {
      voltageV: Math.round(v * 10) / 10,
      currentA: Math.round(current * 100) / 100,
      powerW: Math.round(power * 10) / 10,
    };
    ivCurve.push(pt);
    pvCurve.push(pt);
  }

  return {
    vocActualV: Math.round(vocActual * 10) / 10,
    iscActualA: Math.round(iscActual * 100) / 100,
    vmppActualV: Math.round(vmppActual * 10) / 10,
    imppActualA: Math.round(imppActual * 100) / 100,
    pmppActualW,
    fillFactor,
    trackingEfficiencyPercent,
    mpptTrackedPowerW,
    converterDutyCycle,
    converterInductanceMicroH,
    converterOutputCapacitanceMicroF,
    batteryChargingStage,
    batteryCurrentA,
    ivCurve,
    pvCurve,
  };
}

/**
 * Filters solar MPPT projects by algorithm, battery type, or search keyword.
 */
export function filterSolarMpptProjects(
  projects: SolarMpptProject[],
  filters: {
    algorithm?: MpptAlgorithm;
    batteryType?: BatteryBankType;
    search?: string;
  }
): SolarMpptProject[] {
  return projects.filter((p) => {
    if (filters.algorithm && p.mpptAlgorithm !== filters.algorithm) return false;
    if (filters.batteryType && p.targetBattery !== filters.batteryType) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.application.toLowerCase().includes(q) ||
        (p.panelSpecs.panelModel ? p.panelSpecs.panelModel.toLowerCase().includes(q) : false) ||
        p.operatingConditions.ambientEnvironment.toLowerCase().includes(q) ||
        p.indianContextFacility.toLowerCase().includes(q) ||
        p.standardsCompliance.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
