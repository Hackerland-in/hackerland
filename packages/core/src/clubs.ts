import { z } from 'zod';

export const clubCategoryEnum = z.enum([
  'school_atl',
  'college_robotics',
  'community_makerspace',
  'corporate_lab',
  'independent_collective',
]);
export type ClubCategory = z.infer<typeof clubCategoryEnum>;

export const equipmentCategoryEnum = z.enum([
  'rapid_prototyping',
  'electronics_rf',
  'cnc_machining',
  'soldering_rework',
  'testing_measurement',
  'robotics_actuation',
]);
export type EquipmentCategory = z.infer<typeof equipmentCategoryEnum>;

export const equipmentStatusEnum = z.enum([
  'available',
  'in_use',
  'maintenance',
]);
export type EquipmentStatus = z.infer<typeof equipmentStatusEnum>;

export const clubEquipmentSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  category: equipmentCategoryEnum,
  model: z.string(),
  status: equipmentStatusEnum,
  specs: z.string(),
  hourlyRate: z.string(),
  safetyCertificationRequired: z.boolean(),
  notes: z.string().optional(),
});
export type ClubEquipment = z.infer<typeof clubEquipmentSchema>;

export const clubChallengeSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  deadline: z.string(),
  prizePool: z.string(),
  organizer: z.string(),
  teamSize: z.string(),
  domain: z.string(),
  status: z.enum(['active', 'upcoming', 'completed']),
});
export type ClubChallenge = z.infer<typeof clubChallengeSchema>;

export const clubLeadMentorSchema = z.object({
  name: z.string().min(2),
  role: z.string(),
  organization: z.string(),
  avatarUrl: z.string().optional(),
  bio: z.string(),
  verifiedAtlMentor: z.boolean(),
});
export type ClubLeadMentor = z.infer<typeof clubLeadMentorSchema>;

export const clubChapterSchema = z.object({
  id: z.string(),
  slug: z.string().min(2),
  name: z.string().min(3),
  category: clubCategoryEnum,
  institution: z.string(),
  city: z.string(),
  state: z.string(),
  address: z.string(),
  foundedYear: z.number().int().positive(),
  memberCount: z.number().int().nonnegative(),
  activeProjectsCount: z.number().int().nonnegative(),
  mentorCount: z.number().int().nonnegative(),
  verifiedAtl: z.boolean(),
  contactEmail: z.string().email(),
  summary: z.string(),
  focusAreas: z.array(z.string()),
  equipment: z.array(clubEquipmentSchema),
  leadMentor: clubLeadMentorSchema,
  activeChallenges: z.array(clubChallengeSchema),
  establishedPrototypesCount: z.number().int().nonnegative(),
});
export type ClubChapter = z.infer<typeof clubChapterSchema>;

export const equipmentReservationSchema = z.object({
  id: z.string(),
  clubSlug: z.string(),
  equipmentId: z.string(),
  applicantName: z.string().min(2),
  applicantEmail: z.string().email(),
  applicantRole: z.enum(['student_k12', 'college_undergrad', 'researcher', 'independent_maker']),
  projectTitle: z.string().min(3),
  requestedDate: z.string(),
  timeSlot: z.string(),
  safetyInductionAgreed: z.boolean().refine((val) => val === true, {
    message: 'You must review and agree to the safety induction checklist',
  }),
  parentOrMentorCoSign: z.string().optional(),
});
export type EquipmentReservation = z.infer<typeof equipmentReservationSchema>;

/**
 * Calculates a club's hardware readiness score based on certified equipment count,
 * mentor presence, and active prototypes.
 */
export function calculateClubReadinessScore(club: ClubChapter): number {
  let score = 50; // base score
  score += Math.min(club.equipment.length * 5, 25);
  if (club.verifiedAtl) score += 10;
  if (club.leadMentor.verifiedAtlMentor) score += 5;
  score += Math.min(club.activeProjectsCount * 2, 10);
  return Math.min(score, 100);
}

/**
 * Filter clubs by query, category, and city
 */
export function filterClubs(
  clubs: ClubChapter[],
  filters: {
    search?: string;
    category?: ClubCategory | 'all';
    state?: string;
    requiresEquipmentCategory?: EquipmentCategory;
  }
): ClubChapter[] {
  return clubs.filter((club) => {
    if (filters.category && filters.category !== 'all' && club.category !== filters.category) {
      return false;
    }
    if (filters.state && filters.state !== 'all' && club.state !== filters.state) {
      return false;
    }
    if (filters.requiresEquipmentCategory) {
      const hasCategory = club.equipment.some(
        (eq) => eq.category === filters.requiresEquipmentCategory
      );
      if (!hasCategory) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        club.name.toLowerCase().includes(q) ||
        club.institution.toLowerCase().includes(q) ||
        club.city.toLowerCase().includes(q) ||
        club.state.toLowerCase().includes(q) ||
        club.focusAreas.some((f) => f.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}
