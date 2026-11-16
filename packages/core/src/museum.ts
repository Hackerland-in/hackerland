import { z } from 'zod';

export const failureModeEnum = z.enum([
  'Unit Economics Collapse',
  'Thermal & Physics Limit',
  'Supply Chain & Manufacturing Hell',
  'Premature Scaling',
  'Regulatory Barrier',
  'Feature Over-Engineering',
]);

export type FailureMode = z.infer<typeof failureModeEnum>;

export const museumCategoryEnum = z.enum([
  'Hardware & Robotics',
  'Consumer Electronics',
  'CleanTech & Energy',
  'DeepTech & Biotech',
  'Automotive & EV',
]);

export type MuseumCategory = z.infer<typeof museumCategoryEnum>;

export const museumExhibitSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  tagline: z.string(),
  category: museumCategoryEnum,
  lifespan: z.string(),
  capitalBurned: z.string(),
  primaryFailureMode: failureModeEnum,
  summary: z.string(),
  productSpecs: z.array(z.string()),
  rootCauseAutopsy: z.array(
    z.object({
      stage: z.string(),
      failureTrigger: z.string(),
      detail: z.string(),
      warningSigns: z.array(z.string()),
    })
  ),
  salvageableInnovations: z.array(
    z.object({
      innovation: z.string(),
      utility: z.string(),
      modernSuccessors: z.array(z.string()),
    })
  ),
  lessonsForBuilders: z.array(
    z.object({
      principle: z.string(),
      advice: z.string(),
      antiPattern: z.string(),
    })
  ),
  publishedAt: z.string().optional(),
});

export type MuseumExhibit = z.infer<typeof museumExhibitSchema>;

export interface FailureRiskAssessment {
  score: number; // 0 to 100 risk score
  level: 'Low' | 'Moderate' | 'High' | 'Critical';
  identifiedTraps: string[];
  preventativeMeasures: string[];
}

export function evaluateHardwareFailureRisk(params: {
  retailPriceUsd: number;
  bomCostUsd: number;
  customPartsCount: number;
  requiresRegulatoryApproval: boolean;
  hasMovingMechanicalParts: boolean;
}): FailureRiskAssessment {
  let score = 15;
  const traps: string[] = [];
  const preventative: string[] = [];

  // 1. Margin & Unit Economics Check
  const margin = (params.retailPriceUsd - params.bomCostUsd) / (params.retailPriceUsd || 1);
  if (margin < 0.5) {
    score += 30;
    traps.push('Negative/Inadequate Gross Margin (Hardware rule: Retail must be 3x - 4x BOM)');
    preventative.push('Target minimum 65% gross margin to absorb distribution, retailer margin, and warranty returns.');
  }

  // 2. Custom Tooling & Injection Mold Complexity
  if (params.customPartsCount > 8) {
    score += 25;
    traps.push(`High Tooling Risk (${params.customPartsCount} custom parts require expensive steel tooling & high MOQ)`);
    preventative.push('Replace custom machined parts with off-the-shelf COTS components or modular extrusions.');
  }

  // 3. Regulatory / Certification Pitfall
  if (params.requiresRegulatoryApproval) {
    score += 15;
    traps.push('Regulatory Barrier (FCC, CE, BIS, or FDA certification requires $20k-$100k+ and 6+ months)');
    preventative.push('Use pre-certified RF modules (e.g. Espressif ESP32 with FCC/CE/BIS already stamped).');
  }

  // 4. Mechanical Wear & Moving Parts
  if (params.hasMovingMechanicalParts) {
    score += 15;
    traps.push('Mechanical Failure & Yield Loss (Gearboxes, motors, and linkages suffer high field failure rates)');
    preventative.push('Conduct accelerated life cycle testing (ALT) for 100,000 cycles before mass tooling.');
  }

  let level: FailureRiskAssessment['level'] = 'Low';
  if (score >= 70) level = 'Critical';
  else if (score >= 45) level = 'High';
  else if (score >= 25) level = 'Moderate';

  return {
    score: Math.min(100, score),
    level,
    identifiedTraps: traps.length > 0 ? traps : ['No critical hardware traps detected in baseline spec.'],
    preventativeMeasures: preventative.length > 0 ? preventative : ['Maintain strict quality control on incoming PCB components.'],
  };
}
