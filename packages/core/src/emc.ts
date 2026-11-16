import { z } from 'zod';

export const emcStandardSchema = z.enum([
  'cispr_25_class5',
  'cispr_32_class_b',
  'fcc_part15_class_b',
  'mil_std_461g',
  'ais_004_automotive',
]);
export type EmcStandard = z.infer<typeof emcStandardSchema>;

export const emcScanTypeSchema = z.enum([
  'conducted_emissions',
  'radiated_emissions',
  'near_field_magnetic',
  'near_field_electric',
]);
export type EmcScanType = z.infer<typeof emcScanTypeSchema>;

export const spectralDataPointSchema = z.object({
  frequencyMHz: z.number().positive(),
  amplitudeDbuV: z.number(),
  limitDbuV: z.number(),
});
export type SpectralDataPoint = z.infer<typeof spectralDataPointSchema>;

export const emcHotspotNodeSchema = z.object({
  id: z.string(),
  nodeName: z.string().min(1),
  posX: z.number().nonnegative(),
  posY: z.number().nonnegative(),
  peakEmissionMHz: z.number().positive(),
  peakDbuV: z.number(),
  noiseSource: z.enum([
    'switching_dv_dt',
    'ground_bounce',
    'clock_harmonic',
    'impedance_discontinuity',
  ]),
  mitigation: z.string().min(1),
});
export type EmcHotspotNode = z.infer<typeof emcHotspotNodeSchema>;

export const emcScanProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  deviceUnderTesting: z.string().min(1),
  standard: emcStandardSchema,
  scanType: emcScanTypeSchema,
  spectralTrace: z.array(spectralDataPointSchema).min(1),
  hotspots: z.array(emcHotspotNodeSchema),
  testLabFacility: z.string().min(1),
  overallStatus: z.enum(['compliant', 'marginal_warning', 'non_compliant']),
  filterRecommendations: z.array(z.string()),
  notes: z.array(z.string()),
});
export type EmcScanProject = z.infer<typeof emcScanProjectSchema>;

export interface EmcComplianceEvaluation {
  isCompliant: boolean;
  worstMarginDb: number;
  peakViolationFrequencyMHz: number | null;
  violationCount: number;
  maxPeakDbuV: number;
}

/**
 * Evaluates spectral trace data against regulatory limit curves.
 * Positive margin means emissions are safely under the limit (compliant).
 * Negative margin indicates emission limit exceedance.
 */
export function evaluateEmcCompliance(trace: SpectralDataPoint[]): EmcComplianceEvaluation {
  if (trace.length === 0) {
    return {
      isCompliant: true,
      worstMarginDb: 999,
      peakViolationFrequencyMHz: null,
      violationCount: 0,
      maxPeakDbuV: 0,
    };
  }

  let worstMargin = Infinity;
  let violationCount = 0;
  let peakViolationFreq: number | null = null;
  let worstViolationMag = -Infinity;
  let maxPeak = -Infinity;

  for (const pt of trace) {
    if (pt.amplitudeDbuV > maxPeak) {
      maxPeak = pt.amplitudeDbuV;
    }

    const margin = pt.limitDbuV - pt.amplitudeDbuV;
    if (margin < worstMargin) {
      worstMargin = margin;
    }

    if (margin < 0) {
      violationCount++;
      const exceedance = -margin;
      if (exceedance > worstViolationMag) {
        worstViolationMag = exceedance;
        peakViolationFreq = pt.frequencyMHz;
      }
    }
  }

  return {
    isCompliant: violationCount === 0,
    worstMarginDb: Math.round(worstMargin * 10) / 10,
    peakViolationFrequencyMHz: peakViolationFreq,
    violationCount,
    maxPeakDbuV: Math.round(maxPeak * 10) / 10,
  };
}

export interface CommonModeFilterDesign {
  requiredInductanceUh: number;
  recommendedCapacitanceNf: number;
  attenuationAtTargetDb: number;
}

/**
 * Calculates pre-compliance common-mode choke inductance and Y-capacitor sizing
 * for conducted emission suppression.
 * Standard formula: f_cutoff = 1 / (2 * pi * sqrt(L_cm * 2 * C_y))
 */
export function calculateCommonModeChoke(
  targetCutoffFreqMHz: number,
  commonModeImpedanceTargetOhm: number = 1000
): CommonModeFilterDesign {
  const fHz = Math.max(0.1, targetCutoffFreqMHz) * 1e6;

  // Typical target common-mode choke impedance: Z = 2 * pi * f * L
  // L = Z / (2 * pi * f)
  const lHenries = commonModeImpedanceTargetOhm / (2 * Math.PI * fHz);
  const lUh = Math.max(1, Math.round(lHenries * 1e6 * 10) / 10);

  // Size Y-capacitors (line-to-chassis ground) to keep leakage current safe (sub-0.5mA at 230V AC)
  // Recommended Cy for typical SMPS: 2.2nF to 4.7nF
  const cNf = 2.2;
  const cFarads = cNf * 1e-9;

  // Insertion loss attenuation calculation:
  // Attenuation = 20 * log10(1 + (2 * pi * f * L) / (2 * 50))
  const impedanceRatio = (2 * Math.PI * fHz * (lUh * 1e-6)) / 100;
  const attenuationDb = Math.round(20 * Math.log10(1 + impedanceRatio) * 10) / 10;

  return {
    requiredInductanceUh: lUh,
    recommendedCapacitanceNf: cNf,
    attenuationAtTargetDb: attenuationDb,
  };
}

export function filterEmcProjects(
  projects: EmcScanProject[],
  filters: { standard?: string; status?: string; search?: string }
): EmcScanProject[] {
  return projects.filter((proj) => {
    if (filters.standard && filters.standard !== 'all' && proj.standard !== filters.standard) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && proj.overallStatus !== filters.status) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = proj.title.toLowerCase().includes(q);
      const matchDut = proj.deviceUnderTesting.toLowerCase().includes(q);
      const matchLab = proj.testLabFacility.toLowerCase().includes(q);
      if (!matchTitle && !matchDut && !matchLab) {
        return false;
      }
    }
    return true;
  });
}
