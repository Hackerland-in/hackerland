import { z } from 'zod';

export const radarRingEnum = z.enum(['Adopt', 'Trial', 'Assess', 'Hold']);
export type RadarRing = z.infer<typeof radarRingEnum>;

export const radarQuadrantEnum = z.enum([
  'Hardware & Silicon',
  'Energy & Propulsion',
  'Robotics & Automation',
  'AI & BioTech',
]);
export type RadarQuadrant = z.infer<typeof radarQuadrantEnum>;

export const observatoryCategoryEnum = z.enum([
  'patent_expiry',
  'research_breakthrough',
  'open_hardware',
  'grant_fund',
]);
export type ObservatoryCategory = z.infer<typeof observatoryCategoryEnum>;

export const observatoryItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  slug: z.string(),
  category: observatoryCategoryEnum,
  quadrant: radarQuadrantEnum,
  ring: radarRingEnum,
  summary: z.string(),
  maturityLevel: z.string(),
  impactScore: z.number().min(1).max(100),
  source: z.object({
    name: z.string(),
    url: z.string().url().or(z.string()),
    publishedDate: z.string(),
  }),
  makerAction: z.string(),
  commercialPotential: z.string(),
  tags: z.array(z.string()),
  relatedProblemSlugs: z.array(z.string()).optional(),
});

export type ObservatoryItem = z.infer<typeof observatoryItemSchema>;
