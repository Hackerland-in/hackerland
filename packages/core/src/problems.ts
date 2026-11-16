import { z } from 'zod';

export const problemDomainEnum = z.enum([
  'healthcare',
  'clean_water',
  'agriculture',
  'energy_storage',
  'space_aerospace',
  'assistive_technology',
  'education_access',
  'robotics_automation',
  'climate_sustainability',
  'advanced_silicon',
]);
export type ProblemDomain = z.infer<typeof problemDomainEnum>;

export const problemSchema = z.object({
  id: z.string(),
  title: z.string().min(5).max(140),
  slug: z.string().min(3),
  description: z.string().min(30),
  domain: problemDomainEnum,
  sourceType: z.enum(['community', 'organization', 'government', 'academic']).default('community'),
  sourceName: z.string().optional(),
  impactTarget: z.string(), // e.g. "10,000 rural health clinics across India"
  keyConstraints: z.array(z.string()).default([]), // e.g. ["Must cost < ₹5,000", "Battery-powered for 48h"]
  claimedProjectsCount: z.number().default(0),
  status: z.enum(['unsolved', 'investigating', 'prototyping', 'solved']).default('unsolved'),
  bountyRewardInr: z.number().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type Problem = z.infer<typeof problemSchema>;
