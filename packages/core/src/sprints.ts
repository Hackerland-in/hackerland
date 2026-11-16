import { z } from 'zod';

export const sprintTrackSchema = z.enum([
  'robotics_uav',
  'ev_powertrain',
  'edge_ai_silicon',
  'medtech_diagnostics',
  'defence_aerospace',
  'clean_energy',
]);
export type SprintTrack = z.infer<typeof sprintTrackSchema>;

export const sprintStatusSchema = z.enum([
  'upcoming',
  'active',
  'in_review',
  'completed',
]);
export type SprintStatus = z.infer<typeof sprintStatusSchema>;

export const sprintMilestoneSchema = z.object({
  id: z.string(),
  hour: z.number().int().positive(),
  title: z.string().min(1),
  deliverables: z.array(z.string()).min(1),
  reviewCriteria: z.array(z.string()).min(1),
  points: z.number().int().positive(),
});
export type SprintMilestone = z.infer<typeof sprintMilestoneSchema>;

export const sprintSponsorSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  grantAmount: z.number().positive(),
  grantCurrency: z.enum(['INR', 'USD']),
  type: z.enum(['gov_grant', 'vc_syndicate', 'industry_partner']),
});
export type SprintSponsor = z.infer<typeof sprintSponsorSchema>;

export const sprintJuryMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  organization: z.string().min(1),
});
export type SprintJuryMember = z.infer<typeof sprintJuryMemberSchema>;

export const sprintEntrySchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  track: sprintTrackSchema,
  sponsor: sprintSponsorSchema,
  totalPrizePoolINR: z.number().positive(),
  startDate: z.string(), // ISO string
  endDate: z.string(),   // ISO string
  durationHours: z.number().int().positive(),
  currentStatus: sprintStatusSchema,
  registeredTeamsCount: z.number().int().nonnegative(),
  maxTeams: z.number().int().positive(),
  milestones: z.array(sprintMilestoneSchema).min(1),
  eligibilityCriteria: z.array(z.string()).min(1),
  hardwarePerks: z.array(z.string()),
  juryPanel: z.array(sprintJuryMemberSchema),
  rules: z.array(z.string()),
});
export type SprintEntry = z.infer<typeof sprintEntrySchema>;

export interface SprintProgressResult {
  currentHour: number;
  progressPercent: number;
  activeMilestoneIndex: number;
  isCompleted: boolean;
  timeRemainingMinutes: number;
}

export function calculateSprintProgress(
  sprint: SprintEntry,
  currentTimeISO?: string
): SprintProgressResult {
  const now = currentTimeISO ? new Date(currentTimeISO).getTime() : Date.now();
  const start = new Date(sprint.startDate).getTime();
  const end = new Date(sprint.endDate).getTime();

  if (now <= start) {
    return {
      currentHour: 0,
      progressPercent: 0,
      activeMilestoneIndex: 0,
      isCompleted: false,
      timeRemainingMinutes: Math.max(0, Math.round((end - start) / (60 * 1000))),
    };
  }

  if (now >= end) {
    return {
      currentHour: sprint.durationHours,
      progressPercent: 100,
      activeMilestoneIndex: sprint.milestones.length - 1,
      isCompleted: true,
      timeRemainingMinutes: 0,
    };
  }

  const elapsedMillis = now - start;
  const totalMillis = end - start;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMillis / totalMillis) * 100)));
  const currentHour = Math.min(
    sprint.durationHours,
    Math.floor(elapsedMillis / (1000 * 60 * 60))
  );

  // Identify active milestone
  let activeIndex = 0;
  for (let i = 0; i < sprint.milestones.length; i++) {
    const milestone = sprint.milestones[i];
    if (milestone && currentHour >= milestone.hour) {
      activeIndex = i;
    }
  }

  const timeRemainingMinutes = Math.max(0, Math.round((end - now) / (60 * 1000)));

  return {
    currentHour,
    progressPercent,
    activeMilestoneIndex: activeIndex,
    isCompleted: false,
    timeRemainingMinutes,
  };
}

export interface MilestoneSubmissionInput {
  repoUrl?: string;
  cadUrl?: string;
  videoUrl?: string;
  notes?: string;
}

export function validateMilestoneSubmission(
  milestone: SprintMilestone,
  submission: MilestoneSubmissionInput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const requiresCad = milestone.deliverables.some((d) =>
    /cad|step|gerber|schematic|pcb|3d/i.test(d)
  );
  const requiresRepo = milestone.deliverables.some((d) =>
    /firmware|code|repo|git|software|driver/i.test(d)
  );
  const requiresVideo = milestone.deliverables.some((d) =>
    /video|demo|recording|walkthrough/i.test(d)
  );

  if (requiresCad && (!submission.cadUrl || submission.cadUrl.trim().length === 0)) {
    errors.push('CAD / Hardware artifact URL is required for this milestone');
  } else if (submission.cadUrl && !/^https?:\/\//i.test(submission.cadUrl)) {
    errors.push('CAD URL must start with http:// or https://');
  }

  if (requiresRepo && (!submission.repoUrl || submission.repoUrl.trim().length === 0)) {
    errors.push('Firmware / Git repository URL is required for this milestone');
  } else if (submission.repoUrl && !/^https?:\/\//i.test(submission.repoUrl)) {
    errors.push('Repository URL must start with http:// or https://');
  }

  if (requiresVideo && (!submission.videoUrl || submission.videoUrl.trim().length === 0)) {
    errors.push('Prototype demo video URL is required for this milestone');
  } else if (submission.videoUrl && !/^https?:\/\//i.test(submission.videoUrl)) {
    errors.push('Video URL must start with http:// or https://');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export interface PrizeDistribution {
  firstPlaceINR: number;
  secondPlaceINR: number;
  thirdPlaceINR: number;
  runnerUpsINR: number;
}

export function calculatePrizeDistribution(totalPrizePoolINR: number): PrizeDistribution {
  // Standard 50% / 30% / 15% / 5% distribution
  const first = Math.round(totalPrizePoolINR * 0.5);
  const second = Math.round(totalPrizePoolINR * 0.3);
  const third = Math.round(totalPrizePoolINR * 0.15);
  const runners = Math.max(0, totalPrizePoolINR - first - second - third);

  return {
    firstPlaceINR: first,
    secondPlaceINR: second,
    thirdPlaceINR: third,
    runnerUpsINR: runners,
  };
}

export function filterSprints(
  sprints: SprintEntry[],
  filters: { track?: string; status?: string; search?: string }
): SprintEntry[] {
  return sprints.filter((sprint) => {
    if (filters.track && filters.track !== 'all' && sprint.track !== filters.track) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && sprint.currentStatus !== filters.status) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = sprint.title.toLowerCase().includes(q);
      const matchTagline = sprint.tagline.toLowerCase().includes(q);
      const matchSponsor = sprint.sponsor.name.toLowerCase().includes(q);
      if (!matchTitle && !matchTagline && !matchSponsor) {
        return false;
      }
    }
    return true;
  });
}
