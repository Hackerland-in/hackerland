import { z } from 'zod';

export const transmissionLineTypeSchema = z.enum([
  'microstrip',
  'embedded_microstrip',
  'gcpw',
  'stripline',
  'differential_microstrip',
]);
export type TransmissionLineType = z.infer<typeof transmissionLineTypeSchema>;

export const rfSubstrateMaterialSchema = z.enum([
  'fr4_standard',
  'fr4_isola_370hr',
  'rogers_ro4350b',
  'rogers_rt5880',
  'polyimide_flex',
  'nelco_n4000_13',
]);
export type RfSubstrateMaterial = z.infer<typeof rfSubstrateMaterialSchema>;

export interface RfSubstrateInfo {
  id: RfSubstrateMaterial;
  name: string;
  manufacturer: string;
  dielectricConstantEr: number;
  lossTangent: number;
  standardThicknessMm: number;
  copperRoughnessUm: number;
  description: string;
  typicalApplications: string[];
}

export const RF_SUBSTRATES_DATABASE: Record<RfSubstrateMaterial, RfSubstrateInfo> = {
  fr4_standard: {
    id: 'fr4_standard',
    name: 'Standard FR-4 (Isola FR406 / Shengyi)',
    manufacturer: 'Generic / Multi-source (India domestic stockists)',
    dielectricConstantEr: 4.4,
    lossTangent: 0.02,
    standardThicknessMm: 1.6,
    copperRoughnessUm: 1.8,
    description: 'Woven glass reinforced epoxy laminate. Highly cost-effective for sub-1 GHz designs and standard microcontrollers.',
    typicalApplications: ['Sub-1GHz LoRa telemetry', '2.4 GHz Wi-Fi IoT sensors', 'General microcontroller digital boards'],
  },
  fr4_isola_370hr: {
    id: 'fr4_isola_370hr',
    name: 'High-Tg FR-4 (Isola 370HR)',
    manufacturer: 'Isola Group',
    dielectricConstantEr: 4.04,
    lossTangent: 0.015,
    standardThicknessMm: 0.2,
    copperRoughnessUm: 1.2,
    description: 'High performance 180°C Tg FR-4 system. Excellent thermal reliability for multi-layer HDI boards with controlled impedance.',
    typicalApplications: ['PCIe Gen 3/4 high-speed diff pairs', 'High-density multi-layer motherboards', 'Automotive electronics (AEC-Q100)'],
  },
  rogers_ro4350b: {
    id: 'rogers_ro4350b',
    name: 'Rogers RO4350B Hydrocarbon Ceramic',
    manufacturer: 'Rogers Corporation',
    dielectricConstantEr: 3.48,
    lossTangent: 0.0037,
    standardThicknessMm: 0.508,
    copperRoughnessUm: 0.8,
    description: 'Industry-standard ceramic-filled hydrocarbon laminate. Processes like standard FR-4 with minimal RF insertion loss up to 20 GHz.',
    typicalApplications: ['5.8 GHz UAV video links', 'Cellular 4G/5G small cell PAs', 'NavIC / GPS L-band active antenna feeds'],
  },
  rogers_rt5880: {
    id: 'rogers_rt5880',
    name: 'Rogers RT/duroid 5880 PTFE Glass Microfiber',
    manufacturer: 'Rogers Corporation',
    dielectricConstantEr: 2.2,
    lossTangent: 0.0009,
    standardThicknessMm: 0.508,
    copperRoughnessUm: 0.4,
    description: 'Ultra-low dielectric constant PTFE composite. Extremely low electrical loss for millimeter-wave and radar applications.',
    typicalApplications: ['24 GHz automotive radar front-ends', 'Ka/Ku band satellite transceivers (ISRO)', 'Phased array beamformers'],
  },
  polyimide_flex: {
    id: 'polyimide_flex',
    name: 'DuPont Pyralux AP Polyimide Flex',
    manufacturer: 'DuPont',
    dielectricConstantEr: 3.4,
    lossTangent: 0.002,
    standardThicknessMm: 0.05,
    copperRoughnessUm: 0.5,
    description: 'All-polyimide adhesiveless flexible laminate. Ideal for bendable RF transmission lines in tight drone gimbals and wearable sensors.',
    typicalApplications: ['Gimbal camera RF interconnects', 'Space payload deployable solar panels', 'Flexible wearable medical sensors'],
  },
  nelco_n4000_13: {
    id: 'nelco_n4000_13',
    name: 'Nelco N4000-13 SI Enhanced Epoxy',
    manufacturer: 'Park Aerospace / Nelco',
    dielectricConstantEr: 3.7,
    lossTangent: 0.009,
    standardThicknessMm: 0.254,
    copperRoughnessUm: 1.0,
    description: 'High-speed multifunction epoxy prepreg/core. Delivers predictable signal integrity with low dielectric loss at reasonable cost.',
    typicalApplications: ['10GbE / SFP+ network switches', 'FPGA Multi-gigabit transceiver backplanes', 'Industrial SDRs'],
  },
};

export const rfCalculationParamsSchema = z.object({
  lineType: transmissionLineTypeSchema,
  frequencyGHz: z.number().positive(),
  traceWidthMm: z.number().positive(),
  substrateHeightMm: z.number().positive(),
  copperThicknessUm: z.number().positive().optional().default(35),
  dielectricConstantEr: z.number().positive(),
  lossTangent: z.number().nonnegative(),
  groundGapMm: z.number().positive().optional(),
  differentialSpacingMm: z.number().positive().optional(),
  copperRoughnessUm: z.number().nonnegative().optional().default(1.2),
});
export type RfCalculationParams = z.input<typeof rfCalculationParamsSchema>;

export const rfCalculationResultSchema = z.object({
  characteristicImpedanceZ0: z.number().positive(),
  differentialImpedanceZdiff: z.number().positive().optional(),
  effectiveDielectricConstantEeff: z.number().positive(),
  phaseVelocityPercentC: z.number().positive(),
  electricalLengthMmPerDegree: z.number().positive(),
  propagationDelayPsPerMm: z.number().positive(),
  skinDepthUm: z.number().positive(),
  conductorLossDbPerMm: z.number().nonnegative(),
  dielectricLossDbPerMm: z.number().nonnegative(),
  totalLossDbPerMm: z.number().nonnegative(),
});
export type RfCalculationResult = z.infer<typeof rfCalculationResultSchema>;

export const rfMatchingSolutionSchema = z.object({
  topology: z.enum([
    'series_L_shunt_C',
    'shunt_C_series_L',
    'series_C_shunt_L',
    'shunt_L_series_C',
  ]),
  topologyType: z.enum(['low_pass', 'high_pass']),
  seriesComponent: z.object({
    type: z.enum(['inductor', 'capacitor']),
    valueFormatted: z.string(),
    valuePicoOrNano: z.number(),
    unit: z.string(),
  }),
  shuntComponent: z.object({
    type: z.enum(['inductor', 'capacitor']),
    valueFormatted: z.string(),
    valuePicoOrNano: z.number(),
    unit: z.string(),
  }),
  loadedQ: z.number().nonnegative(),
  reflectionCoefficientMag: z.number().nonnegative(),
  vswr: z.number().positive(),
  returnLossDb: z.number().positive(),
  smithChartPoints: z.array(
    z.object({
      label: z.string(),
      real: z.number(),
      imag: z.number(),
    })
  ),
});
export type RfMatchingSolution = z.infer<typeof rfMatchingSolutionSchema>;

export const rfTransmissionLinePresetSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  application: z.string().min(1),
  frequencyGHz: z.number().positive(),
  targetImpedance: z.number().positive(),
  lineType: transmissionLineTypeSchema,
  substrate: rfSubstrateMaterialSchema,
  layerStackup: z.string().min(1),
  recommendedWidthMm: z.number().positive(),
  recommendedGapMm: z.number().positive().optional(),
  recommendedSpacingMm: z.number().positive().optional(),
  calculatedLossDbPer100Mm: z.number().positive(),
  designRules: z.array(z.string()),
  indianContextFacility: z.string().min(1),
  schematicNotes: z.string(),
});
export type RfTransmissionLinePreset = z.infer<typeof rfTransmissionLinePresetSchema>;

/**
 * Calculates transmission line impedance and RF loss characteristics.
 * Based on Hammerstad & Jensen closed-form synthesis and Wadell / Conformal Mapping.
 */
export function calculateRfTransmissionLine(
  params: RfCalculationParams
): RfCalculationResult {
  const {
    lineType,
    frequencyGHz,
    traceWidthMm,
    substrateHeightMm,
    copperThicknessUm = 35,
    dielectricConstantEr: er,
    lossTangent: tanD,
    groundGapMm,
    differentialSpacingMm,
    copperRoughnessUm = 1.2,
  } = params;

  const w = traceWidthMm;
  const h = substrateHeightMm;
  const t = copperThicknessUm / 1000; // convert um to mm
  const u = w / h;

  // Copper resistivity rho = 1.72e-8 ohm*m, mu_0 = 4*pi*1e-7
  const freqHz = frequencyGHz * 1e9;
  const skinDepthM = Math.sqrt(1.72e-8 / (Math.PI * freqHz * 4 * Math.PI * 1e-7));
  const skinDepthUm = skinDepthM * 1e6;

  let z0 = 50.0;
  let eeff = er;

  if (lineType === 'microstrip' || lineType === 'embedded_microstrip' || lineType === 'differential_microstrip') {
    // Hammerstad and Jensen formulas
    if (u <= 1) {
      const a = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 / u) + 0.04 * Math.pow(1 - u, 2));
      eeff = a;
      z0 = (60 / Math.sqrt(eeff)) * Math.log(8 / u + 0.25 * u);
    } else {
      const b = (er + 1) / 2 + ((er - 1) / 2) * (1 / Math.sqrt(1 + 12 / u));
      eeff = b;
      z0 = (120 * Math.PI) / (Math.sqrt(eeff) * (u + 1.393 + 0.667 * Math.log(u + 1.444)));
    }

    if (lineType === 'embedded_microstrip') {
      // Solder mask or dielectric overcoat reduces impedance slightly (typically ~3-5% drop)
      eeff = eeff * 1.05;
      z0 = z0 * 0.95;
    }
  } else if (lineType === 'stripline') {
    // Symmetrical stripline
    const b = h * 2; // total ground spacing
    const weff = w + (t > 0 ? (t / Math.PI) * (1 + Math.log((4 * Math.PI * w) / (t > 0 ? t : 0.001))) : 0);
    eeff = er;
    z0 = (60 / Math.sqrt(er)) * Math.log((1.9 * b) / (0.8 * weff + t));
  } else if (lineType === 'gcpw') {
    // Grounded Coplanar Waveguide
    const gap = groundGapMm ?? w * 0.5;
    const k = w / (w + 2 * gap);
    const kPrime = Math.sqrt(1 - k * k);

    // Approximate elliptic integral ratio K(k)/K'(k)
    const ellipticRatio = (kVal: number, kpVal: number): number => {
      if (kVal <= 0.7071) {
        return Math.PI / Math.log(2 * (1 + Math.sqrt(kpVal)) / (1 - Math.sqrt(kpVal)));
      }
      return (1 / Math.PI) * Math.log(2 * (1 + Math.sqrt(kVal)) / (1 - Math.sqrt(kVal)));
    };

    const ratio1 = ellipticRatio(k, kPrime);
    // Microstrip parallel component
    const k1 = Math.tanh((Math.PI * w) / (4 * h)) / Math.tanh((Math.PI * (w + 2 * gap)) / (4 * h));
    const k1Prime = Math.sqrt(Math.max(0.001, 1 - k1 * k1));
    const ratio2 = ellipticRatio(k1, k1Prime);

    const q = ratio2 / ratio1;
    eeff = 1 + ((er - 1) / 2) * q;
    z0 = (60 * Math.PI) / (Math.sqrt(eeff) * (ratio1 + ratio2));
  }

  // Differential impedance calculation
  let zdiff: number | undefined;
  if (lineType === 'differential_microstrip') {
    const s = differentialSpacingMm ?? w;
    // Coupled microstrip approximation: Zdiff = 2 * Z0 * (1 - 0.48 * exp(-0.96 * S / H))
    const coupling = 1 - 0.48 * Math.exp((-0.96 * s) / h);
    zdiff = 2 * z0 * coupling;
  }

  // Speed of light in vacuum c0 = 3e8 m/s
  const c0 = 3e8;
  const phaseVelocity = c0 / Math.sqrt(eeff);
  const phaseVelocityPercentC = (phaseVelocity / c0) * 100;

  // Propagation delay: ps / mm
  const propagationDelayPsPerMm = (Math.sqrt(eeff) / c0) * 1e9; // (sqrt(eeff)/3e8)*1e12 ps/m / 1000 mm = ps/mm

  // Electrical length: mm per 360 degrees = wavelength lambda
  const wavelengthMm = (phaseVelocity / freqHz) * 1000;
  const electricalLengthMmPerDegree = wavelengthMm / 360;

  // High Frequency Losses (dB/mm)
  // Dielectric loss alpha_d = (27.3 * freqHz * sqrt(eeff) * tanD) / c0 (dB/m) -> divide by 1000 for dB/mm
  const dielectricLossDbPerMm = (27.3 * freqHz * Math.sqrt(eeff) * tanD) / (c0 * 1000);

  // Conductor loss alpha_c with surface roughness correction
  // Sheet resistance Rs = 1 / (sigma * skinDepth)
  const rs = 1 / (5.8e7 * skinDepthM);
  // Conductor loss approx: alpha_c = (8.686 * Rs) / (w_m * z0) dB/m
  const wm = w / 1000;
  const rawAlphaC_DbPerM = (8.686 * rs) / (wm * Math.max(10, z0));
  // Roughness correction factor: K_sr = 1 + (2/pi) * arctan(1.4 * (Rq / skinDepth)^2)
  const rq_m = copperRoughnessUm * 1e-6;
  const roughnessFactor = 1 + (2 / Math.PI) * Math.atan(1.4 * Math.pow(rq_m / skinDepthM, 2));
  const conductorLossDbPerMm = (rawAlphaC_DbPerM * roughnessFactor) / 1000;

  const totalLossDbPerMm = dielectricLossDbPerMm + conductorLossDbPerMm;

  return {
    characteristicImpedanceZ0: Math.round(z0 * 100) / 100,
    differentialImpedanceZdiff: zdiff ? Math.round(zdiff * 100) / 100 : undefined,
    effectiveDielectricConstantEeff: Math.round(eeff * 1000) / 1000,
    phaseVelocityPercentC: Math.round(phaseVelocityPercentC * 10) / 10,
    electricalLengthMmPerDegree: Math.round(electricalLengthMmPerDegree * 1000) / 1000,
    propagationDelayPsPerMm: Math.round(propagationDelayPsPerMm * 100) / 100,
    skinDepthUm: Math.round(skinDepthUm * 100) / 100,
    conductorLossDbPerMm: Math.round(conductorLossDbPerMm * 10000) / 10000,
    dielectricLossDbPerMm: Math.round(dielectricLossDbPerMm * 10000) / 10000,
    totalLossDbPerMm: Math.round(totalLossDbPerMm * 10000) / 10000,
  };
}

/**
 * Synthesizes trace width required to match target characteristic impedance Z0.
 * Uses binary search convergence.
 */
export function synthesizeTraceWidth(
  lineType: TransmissionLineType,
  targetZ0: number,
  substrateHeightMm: number,
  dielectricConstantEr: number,
  copperThicknessUm: number = 35,
  gapMm?: number
): number {
  let lowW = 0.05; // 50 microns minimum PCB fab capability
  let highW = 10.0; // 10mm maximum trace
  let bestW = 1.0;

  for (let iter = 0; iter < 32; iter++) {
    const midW = (lowW + highW) / 2;
    const res = calculateRfTransmissionLine({
      lineType,
      frequencyGHz: 1.0,
      traceWidthMm: midW,
      substrateHeightMm,
      copperThicknessUm,
      dielectricConstantEr,
      lossTangent: 0.01,
      groundGapMm: gapMm,
    });

    const diff = res.characteristicImpedanceZ0 - targetZ0;
    if (Math.abs(diff) < 0.05) {
      bestW = midW;
      break;
    }

    // Wider trace = lower impedance
    if (res.characteristicImpedanceZ0 > targetZ0) {
      // Need lower impedance -> need wider trace
      lowW = midW;
    } else {
      // Need higher impedance -> need narrower trace
      highW = midW;
    }
    bestW = midW;
  }

  return Math.round(bestW * 1000) / 1000;
}

/**
 * Calculates 2-element L-section impedance matching network to match load (RL + jXL) to Z0.
 */
export function calculateLSectionMatch(
  frequencyMHz: number,
  z0: number,
  rl: number,
  xl: number,
  preferLowPass: boolean = true
): RfMatchingSolution {
  const fHz = frequencyMHz * 1e6;
  const omega = 2 * Math.PI * fHz;

  // Reflection coefficient at load
  // Gamma = (ZL - Z0) / (ZL + Z0)
  const denom = Math.pow(rl + z0, 2) + Math.pow(xl, 2);
  const gammaReal = (Math.pow(rl, 2) + Math.pow(xl, 2) - Math.pow(z0, 2)) / denom;
  const gammaImag = (2 * xl * z0) / denom;
  const gammaMag = Math.sqrt(Math.pow(gammaReal, 2) + Math.pow(gammaImag, 2));

  const vswr = gammaMag >= 0.999 ? 99.9 : (1 + gammaMag) / (1 - gammaMag);
  const returnLossDb = gammaMag <= 0.001 ? 60.0 : -20 * Math.log10(gammaMag);

  let topology: 'series_L_shunt_C' | 'shunt_C_series_L' | 'series_C_shunt_L' | 'shunt_L_series_C';
  let topologyType: 'low_pass' | 'high_pass' = preferLowPass ? 'low_pass' : 'high_pass';
  let seriesComponent: { type: 'inductor' | 'capacitor'; valueFormatted: string; valuePicoOrNano: number; unit: string };
  let shuntComponent: { type: 'inductor' | 'capacitor'; valueFormatted: string; valuePicoOrNano: number; unit: string };
  let loadedQ = 1.0;

  if (rl < z0) {
    // Shunt element at source, series element at load
    loadedQ = Math.sqrt(Math.max(0.01, z0 / rl - 1));
    const xShunt = z0 / loadedQ;
    const xSeries = loadedQ * rl - xl;

    if (preferLowPass) {
      // Shunt C at source side, Series L at load side
      topology = 'shunt_C_series_L';
      const cShuntF = 1 / (omega * xShunt);
      const lSeriesH = Math.max(1e-12, Math.abs(xSeries) / omega);

      shuntComponent = {
        type: 'capacitor',
        valueFormatted: `${(cShuntF * 1e12).toFixed(2)} pF`,
        valuePicoOrNano: Math.round(cShuntF * 1e12 * 100) / 100,
        unit: 'pF',
      };
      seriesComponent = {
        type: xSeries >= 0 ? 'inductor' : 'capacitor',
        valueFormatted: xSeries >= 0 ? `${(lSeriesH * 1e9).toFixed(2)} nH` : `${((1 / (omega * Math.abs(xSeries))) * 1e12).toFixed(2)} pF`,
        valuePicoOrNano: xSeries >= 0 ? Math.round(lSeriesH * 1e9 * 100) / 100 : Math.round((1 / (omega * Math.abs(xSeries))) * 1e12 * 100) / 100,
        unit: xSeries >= 0 ? 'nH' : 'pF',
      };
    } else {
      // High pass: Shunt L, Series C
      topology = 'shunt_L_series_C';
      topologyType = 'high_pass';
      const lShuntH = xShunt / omega;
      const cSeriesF = 1 / (omega * Math.max(1, Math.abs(xSeries)));

      shuntComponent = {
        type: 'inductor',
        valueFormatted: `${(lShuntH * 1e9).toFixed(2)} nH`,
        valuePicoOrNano: Math.round(lShuntH * 1e9 * 100) / 100,
        unit: 'nH',
      };
      seriesComponent = {
        type: 'capacitor',
        valueFormatted: `${(cSeriesF * 1e12).toFixed(2)} pF`,
        valuePicoOrNano: Math.round(cSeriesF * 1e12 * 100) / 100,
        unit: 'pF',
      };
    }
  } else {
    // rl >= z0: Series element at source, shunt element at load
    loadedQ = Math.sqrt(Math.max(0.01, rl / z0 - 1));
    const xSeries = loadedQ * z0;
    const xShunt = (rl / loadedQ) - xl;

    if (preferLowPass) {
      topology = 'series_L_shunt_C';
      const lSeriesH = xSeries / omega;
      const cShuntF = 1 / (omega * Math.max(1, Math.abs(xShunt)));

      seriesComponent = {
        type: 'inductor',
        valueFormatted: `${(lSeriesH * 1e9).toFixed(2)} nH`,
        valuePicoOrNano: Math.round(lSeriesH * 1e9 * 100) / 100,
        unit: 'nH',
      };
      shuntComponent = {
        type: 'capacitor',
        valueFormatted: `${(cShuntF * 1e12).toFixed(2)} pF`,
        valuePicoOrNano: Math.round(cShuntF * 1e12 * 100) / 100,
        unit: 'pF',
      };
    } else {
      topology = 'series_C_shunt_L';
      topologyType = 'high_pass';
      const cSeriesF = 1 / (omega * xSeries);
      const lShuntH = Math.max(1, Math.abs(xShunt)) / omega;

      seriesComponent = {
        type: 'capacitor',
        valueFormatted: `${(cSeriesF * 1e12).toFixed(2)} pF`,
        valuePicoOrNano: Math.round(cSeriesF * 1e12 * 100) / 100,
        unit: 'pF',
      };
      shuntComponent = {
        type: 'inductor',
        valueFormatted: `${(lShuntH * 1e9).toFixed(2)} nH`,
        valuePicoOrNano: Math.round(lShuntH * 1e9 * 100) / 100,
        unit: 'nH',
      };
    }
  }

  // Smith chart coordinates (normalized to 50 ohms)
  const smithChartPoints = [
    { label: 'Load (ZL)', real: Math.round(gammaReal * 1000) / 1000, imag: Math.round(gammaImag * 1000) / 1000 },
    { label: 'Mid-step', real: Math.round((gammaReal * 0.5) * 1000) / 1000, imag: Math.round((gammaImag * 0.3) * 1000) / 1000 },
    { label: 'Matched (50Ω)', real: 0.0, imag: 0.0 },
  ];

  return {
    topology,
    topologyType,
    seriesComponent,
    shuntComponent,
    loadedQ: Math.round(loadedQ * 100) / 100,
    reflectionCoefficientMag: Math.round(gammaMag * 1000) / 1000,
    vswr: Math.round(vswr * 100) / 100,
    returnLossDb: Math.round(returnLossDb * 10) / 10,
    smithChartPoints,
  };
}
