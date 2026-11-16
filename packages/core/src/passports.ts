import { z } from 'zod';

export const innovationPassportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userHandle: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().optional(),
  title: z.string().default('Hardware Innovator & Builder'),
  verifiedSince: z.string().or(z.date()),
  stats: z.object({
    projectsBuilt: z.number().default(0),
    hardwarePrototypes: z.number().default(0),
    openSourcePrsMerged: z.number().default(0),
    bountiesCompleted: z.number().default(0),
    peopleMentored: z.number().default(0),
    verifiedSkillsCount: z.number().default(0),
    totalReputationPoints: z.number().default(0),
  }),
  verifiedBadges: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      category: z.enum(['hardware', 'firmware', 'design', 'research', 'mentorship', 'bounty']),
      issuedAt: z.string().or(z.date()),
      evidenceUrl: z.string().optional(),
    })
  ).default([]),
  hardwareFabrications: z.array(
    z.object({
      id: z.string(),
      projectName: z.string(),
      layerCount: z.number().default(2),
      substrate: z.string().default('FR4'),
      gerberExported: z.boolean().default(true),
      fabricatedDate: z.string().or(z.date()),
    })
  ).default([]),
});
export type InnovationPassport = z.infer<typeof innovationPassportSchema>;
