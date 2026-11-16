import { z } from 'zod';

export const teardownPinoutAnnotationSchema = z.object({
  id: z.string().min(1),
  xPercent: z.number().min(0).max(100),
  yPercent: z.number().min(0).max(100),
  label: z.string().min(2),
  subsystem: z.string().min(2),
  partNumber: z.string().min(2),
  manufacturer: z.string().min(2),
  function: z.string().min(5),
  package: z.string(),
  voltageRating: z.string().optional(),
  estimatedCostUsd: z.number().nonnegative(),
  openSourceAlternative: z.string().min(2),
});
export type TeardownPinoutAnnotation = z.infer<typeof teardownPinoutAnnotationSchema>;

export const teardownSubsystemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  chips: z.array(z.string()).min(1),
});
export type TeardownSubsystem = z.infer<typeof teardownSubsystemSchema>;

export const teardownBomItemSchema = z.object({
  component: z.string().min(2),
  partNumber: z.string().min(2),
  manufacturer: z.string().min(2),
  function: z.string().min(5),
  package: z.string(),
  estCost: z.string(),
  openAlternative: z.string(),
});
export type TeardownBOMItem = z.infer<typeof teardownBomItemSchema>;

export const teardownCategorySchema = z.enum([
  'ev_automotive',
  'drones_robotics',
  'smart_grid_iot',
  'medical_assistive',
  'consumer_edge_ai',
]);
export type TeardownCategory = z.infer<typeof teardownCategorySchema>;

export const teardownSubmissionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(2),
  title: z.string().min(5),
  category: teardownCategorySchema,
  deviceType: z.string().min(3),
  manufacturer: z.string().min(2),
  retailPriceInr: z.number().positive(),
  estimatedBomInr: z.number().positive(),
  currency: z.literal('INR').default('INR'),
  summary: z.string().min(20),
  submitter: z.object({
    name: z.string(),
    handle: z.string(),
    avatar: z.string(),
    organization: z.string(),
    role: z.string(),
  }),
  highlightSpecs: z.array(z.string()).min(2),
  subsystems: z.array(teardownSubsystemSchema).min(1),
  bomBreakdown: z.array(teardownBomItemSchema).min(1),
  pinoutAnnotations: z.array(teardownPinoutAnnotationSchema).min(1),
  pcbImageUrl: z.string().optional(),
  schematicUrl: z.string().optional(),
  engineeringLessons: z.array(z.string()).min(1),
  failureModesObserved: z.array(z.string()).min(1),
  verifiedStatus: z.enum(['community_draft', 'peer_reviewed', 'gold_standard']).default('peer_reviewed'),
  reputationReward: z.number().int().positive().default(150),
});
export type TeardownSubmission = z.infer<typeof teardownSubmissionSchema>;

/**
 * Calculates retail price vs bill-of-materials cost metrics.
 */
export function calculateBomMarkup(
  retailPriceInr: number,
  bomCostInr: number
): { markupRatio: number; grossMarginPercent: number } {
  if (bomCostInr <= 0) {
    return { markupRatio: 0, grossMarginPercent: 0 };
  }
  const markupRatio = Math.round((retailPriceInr / bomCostInr) * 10) / 10;
  const grossMarginPercent = Math.max(0, Math.min(100, Math.round(((retailPriceInr - bomCostInr) / retailPriceInr) * 100)));
  return {
    markupRatio,
    grossMarginPercent,
  };
}

/**
 * Validates coordinate bounds of an interactive pinout annotation.
 */
export function validatePinoutAnnotation(annotation: TeardownPinoutAnnotation): boolean {
  return (
    annotation.xPercent >= 0 &&
    annotation.xPercent <= 100 &&
    annotation.yPercent >= 0 &&
    annotation.yPercent <= 100 &&
    annotation.label.trim().length > 0 &&
    annotation.partNumber.trim().length > 0
  );
}

/**
 * Filters submissions by category.
 */
export function filterTeardownsByCategory(
  items: TeardownSubmission[],
  category: TeardownCategory | 'all'
): TeardownSubmission[] {
  if (category === 'all') return items;
  return items.filter((item) => item.category === category);
}
