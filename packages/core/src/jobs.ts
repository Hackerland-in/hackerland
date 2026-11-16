import { z } from 'zod';

export const jobRoleTypeSchema = z.enum([
  'full_time',
  'fellowship',
  'residency',
  'internship',
  'contract_lead',
]);
export type JobRoleType = z.infer<typeof jobRoleTypeSchema>;

export const hardwareDomainSchema = z.enum([
  'embedded_firmware',
  'power_electronics_bms',
  'robotics_autonomous',
  'rf_wireless_avionics',
  'fpga_silicon',
  'mechanical_tooling',
]);
export type HardwareDomain = z.infer<typeof hardwareDomainSchema>;

export const experienceLevelSchema = z.enum([
  'early_career',
  'mid_lead',
  'principal_founding',
]);
export type ExperienceLevel = z.infer<typeof experienceLevelSchema>;

export const locationTypeSchema = z.enum([
  'onsite_lab',
  'hybrid_hardware',
  'remote_firmware',
]);
export type LocationType = z.infer<typeof locationTypeSchema>;

export const hardwareJobPostingSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(2),
  title: z.string().min(5),
  company: z.object({
    name: z.string().min(2),
    logo: z.string().optional(),
    website: z.string(),
    city: z.string(),
    state: z.string(),
    foundedYear: z.number().int(),
    verifiedDpiit: z.boolean(),
    stage: z.enum(['Seed', 'Series A', 'Series B+', 'Public / Defence PSU', 'Govt R&D Lab']),
  }),
  roleType: jobRoleTypeSchema,
  hardwareDomain: hardwareDomainSchema,
  experienceLevel: experienceLevelSchema,
  locationType: locationTypeSchema,
  workLocation: z.string(),
  salaryInr: z.object({
    minLakhs: z.number().positive(),
    maxLakhs: z.number().positive(),
    equityPercent: z.string().optional(),
  }),
  hardwareBenchesUsed: z.array(z.string()).min(1),
  responsibilities: z.array(z.string()).min(2),
  prerequisites: z.array(z.string()).min(2),
  proofOfWorkRequirements: z.array(z.string()).min(1),
  fellowshipGrantStipendInr: z.number().nonnegative().optional(),
  applyUrl: z.string(),
  featured: z.boolean().default(false),
  postedDate: z.string(),
  descriptionMarkdown: z.string(),
});
export type HardwareJobPosting = z.infer<typeof hardwareJobPostingSchema>;

export interface HiringMatchResult {
  matchPercent: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Formats salary package in Indian Lakhs (LPA) with equity.
 */
export function formatSalaryRangeInr(
  minLakhs: number,
  maxLakhs: number,
  equityPercent?: string
): string {
  const range = `₹${minLakhs}L – ₹${maxLakhs}L PA`;
  if (equityPercent && equityPercent.trim().length > 0) {
    return `${range} + ${equityPercent} Equity`;
  }
  return range;
}

/**
 * Calculates candidate proof-of-work skill match score.
 */
export function calculateHiringMatchScore(
  candidateSkills: string[],
  jobRequirements: string[]
): HiringMatchResult {
  if (jobRequirements.length === 0) {
    return { matchPercent: 100, matchedSkills: candidateSkills, missingSkills: [] };
  }

  const normalizedCandidate = candidateSkills.map((s) => s.trim().toLowerCase());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of jobRequirements) {
    const reqLower = req.toLowerCase();
    const hasMatch = normalizedCandidate.some((c) => {
      if (reqLower.includes(c) || c.includes(reqLower)) return true;
      const words = c.split(/[\s\-_/]+/).filter((w) => w.length > 1);
      if (words.length > 1 && words.every((w) => reqLower.includes(w))) return true;
      return false;
    });
    if (hasMatch) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const matchPercent = Math.round((matchedSkills.length / jobRequirements.length) * 100);

  return {
    matchPercent,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Pure filter function for hardware jobs.
 */
export function filterHardwareJobs(
  jobs: HardwareJobPosting[],
  filters: {
    domain?: HardwareDomain | 'all';
    roleType?: JobRoleType | 'all';
    locationType?: LocationType | 'all';
    search?: string;
  }
): HardwareJobPosting[] {
  return jobs.filter((job) => {
    if (filters.domain && filters.domain !== 'all' && job.hardwareDomain !== filters.domain) {
      return false;
    }
    if (filters.roleType && filters.roleType !== 'all' && job.roleType !== filters.roleType) {
      return false;
    }
    if (filters.locationType && filters.locationType !== 'all' && job.locationType !== filters.locationType) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.company.name.toLowerCase().includes(q);
      const matchLocation = job.workLocation.toLowerCase().includes(q);
      const matchBench = job.hardwareBenchesUsed.some((b) => b.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchLocation && !matchBench) {
        return false;
      }
    }
    return true;
  });
}
