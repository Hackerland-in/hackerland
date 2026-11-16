import { z } from 'zod';

export const campaignMilestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  percentageOfGoal: z.number().min(5).max(100),
  targetDate: z.string(),
  status: z.enum(['pending', 'submitted_for_review', 'verified', 'funds_released']),
  deliverables: z.array(z.string()),
  evidenceUrl: z.string().optional(),
  backerApprovalVotePercent: z.number().min(0).max(100).default(0),
});
export type CampaignMilestone = z.infer<typeof campaignMilestoneSchema>;

export const backerTierSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  amountInr: z.number().positive(),
  amountUsd: z.number().positive(),
  description: z.string(),
  perks: z.array(z.string()),
  estimatedDelivery: z.string(),
  limitBackers: z.number().int().positive().optional(),
  currentBackers: z.number().int().nonnegative().default(0),
});
export type BackerTier = z.infer<typeof backerTierSchema>;

export const campaignCategorySchema = z.enum([
  'defence_aerospace',
  'medtech_assistive',
  'agritech_iot',
  'robotics_automation',
  'clean_energy',
  'semiconductors',
]);
export type CampaignCategory = z.infer<typeof campaignCategorySchema>;

export const campaignSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(2),
  title: z.string().min(5),
  tagline: z.string().min(10),
  creator: z.object({
    name: z.string(),
    handle: z.string(),
    avatar: z.string(),
    organization: z.string(),
    dpiitRegistered: z.boolean(),
    city: z.string(),
    state: z.string(),
  }),
  category: campaignCategorySchema,
  fundingGoalInr: z.number().positive(),
  raisedInr: z.number().nonnegative(),
  backersCount: z.number().int().nonnegative(),
  daysLeft: z.number().int().nonnegative(),
  deadlineDate: z.string(),
  status: z.enum(['draft', 'active', 'funded', 'completed']),
  trlLevel: z.number().int().min(1).max(9),
  milestones: z.array(campaignMilestoneSchema).min(2),
  backerTiers: z.array(backerTierSchema).min(1),
  matchedGrants: z.array(z.string()),
  storyMarkdown: z.string(),
  risksAndChallenges: z.string(),
  hardwareSpecs: z.record(z.string(), z.string()).optional(),
});
export type Campaign = z.infer<typeof campaignSchema>;

export const grantSchemeSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  agency: z.string(),
  maxFundingInr: z.number().positive(),
  isNonDilutive: z.boolean().default(true),
  focusAreas: z.array(z.string()),
  minTrl: z.number().int().min(1).max(9),
  maxTrl: z.number().int().min(1).max(9),
  requiresDpiit: z.boolean(),
  minIndianOwnershipPercent: z.number().min(0).max(100).default(51),
  applicationWindow: z.string(),
  description: z.string(),
  portalUrl: z.string(),
});
export type GrantScheme = z.infer<typeof grantSchemeSchema>;

export interface GrantMatchResult {
  grant: GrantScheme;
  fitScore: number; // 0 to 100
  isEligible: boolean;
  reasons: string[];
  missingPrerequisites: string[];
}

/**
 * Calculates campaign progress metrics.
 */
export function calculateCampaignProgress(raisedInr: number, goalInr: number) {
  const percent = Math.min(1000, Math.round((raisedInr / goalInr) * 100));
  const isFunded = raisedInr >= goalInr;
  const remainingInr = Math.max(0, goalInr - raisedInr);
  return {
    percent,
    isFunded,
    remainingInr,
  };
}

/**
 * Calculates escrow payout for an approved milestone.
 */
export function calculateMilestonePayout(fundingGoalInr: number, percentageOfGoal: number): number {
  return Math.round((fundingGoalInr * percentageOfGoal) / 100);
}

/**
 * Evaluates whether backer voting quorum is satisfied for milestone funds release.
 * Requires at least 66% (two-thirds) majority approval from voting backers.
 */
export function verifyMilestoneQuorum(
  votesFor: number,
  totalVotesCast: number
): { passed: boolean; approvalPercent: number; requiredPercent: number } {
  if (totalVotesCast === 0) {
    return { passed: false, approvalPercent: 0, requiredPercent: 66 };
  }
  const approvalPercent = Math.round((votesFor / totalVotesCast) * 100);
  const passed = approvalPercent >= 66;
  return {
    passed,
    approvalPercent,
    requiredPercent: 66,
  };
}

/**
 * Matchmaker algorithm for Indian Government hardware grant schemes.
 */
export function matchGrantsForProject(
  inputs: {
    category: CampaignCategory;
    trl: number;
    isDpiitRegistered: boolean;
    indianOwnershipPercent: number;
  },
  availableGrants: GrantScheme[]
): GrantMatchResult[] {
  return availableGrants.map((grant) => {
    let score = 50; // base score
    const reasons: string[] = [];
    const missing: string[] = [];

    // TRL evaluation
    if (inputs.trl >= grant.minTrl && inputs.trl <= grant.maxTrl) {
      score += 25;
      reasons.push(`TRL ${inputs.trl} directly matches grant requirement (TRL ${grant.minTrl}-${grant.maxTrl})`);
    } else if (inputs.trl < grant.minTrl) {
      score -= 20;
      missing.push(`Project maturity (TRL ${inputs.trl}) is below minimum TRL ${grant.minTrl}`);
    } else {
      score -= 10;
      missing.push(`Project maturity (TRL ${inputs.trl}) exceeds target early-stage bracket`);
    }

    // DPIIT registration
    if (grant.requiresDpiit) {
      if (inputs.isDpiitRegistered) {
        score += 15;
        reasons.push('Startup is recognized by DPIIT / Startup India');
      } else {
        score -= 25;
        missing.push('Requires formal DPIIT certificate of recognition');
      }
    }

    // Indian Ownership
    if (inputs.indianOwnershipPercent >= grant.minIndianOwnershipPercent) {
      score += 10;
      reasons.push(`${inputs.indianOwnershipPercent}% Indian equity meets statutory threshold (>= ${grant.minIndianOwnershipPercent}%)`);
    } else {
      score -= 30;
      missing.push(`Indian ownership (${inputs.indianOwnershipPercent}%) below required ${grant.minIndianOwnershipPercent}%`);
    }

    // Category affinity
    const categoryMap: Record<CampaignCategory, string[]> = {
      defence_aerospace: ['Defence', 'Aerospace', 'Drones', 'Security'],
      medtech_assistive: ['Medtech', 'Healthcare', 'Assistive Devices', 'Diagnostics'],
      agritech_iot: ['Agriculture', 'IoT', 'Sensors', 'Rural Tech'],
      robotics_automation: ['Robotics', 'Automation', 'Industry 4.0'],
      clean_energy: ['Clean Energy', 'EV', 'Batteries', 'Power Electronics'],
      semiconductors: ['Semiconductors', 'VLSI', 'RISC-V', 'Embedded Systems'],
    };

    const targetAreas = categoryMap[inputs.category] || [];
    const hasCategoryMatch = grant.focusAreas.some((fa) =>
      targetAreas.some((ta) => fa.toLowerCase().includes(ta.toLowerCase()))
    );

    if (hasCategoryMatch) {
      score += 20;
      reasons.push(`Domain focus explicitly covers ${inputs.category.replace('_', ' ')}`);
    }

    const fitScore = Math.max(0, Math.min(100, score));
    const isEligible = missing.length === 0 && fitScore >= 60;

    return {
      grant,
      fitScore,
      isEligible,
      reasons,
      missingPrerequisites: missing,
    };
  }).sort((a, b) => b.fitScore - a.fitScore);
}
