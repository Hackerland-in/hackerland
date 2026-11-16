import { z } from 'zod';

export const ageBracketEnum = z.enum([
  'junior_8_11',
  'intermediate_12_14',
  'senior_15_17',
]);
export type AgeBracket = z.infer<typeof ageBracketEnum>;

export const safetyCertificationLevelEnum = z.enum([
  'basic_curiosity',
  'supervised_soldering',
  'autonomous_fabrication',
]);
export type SafetyCertificationLevel = z.infer<typeof safetyCertificationLevelEnum>;

export const juniorChallengeSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(5),
  ageBracket: ageBracketEnum,
  difficulty: z.enum(['starter', 'builder', 'innovator']),
  hardwareKit: z.array(z.string().min(2)),
  learningOutcomes: z.array(z.string().min(5)),
  prizeOrBadge: z.string(),
  safetySupervisionRequired: z.boolean(),
  summary: z.string().min(15),
  estimatedTimeHours: z.number().positive(),
});
export type JuniorChallenge = z.infer<typeof juniorChallengeSchema>;

export const juniorShowcaseProjectSchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  title: z.string().min(5),
  builderName: z.string().min(2),
  builderAge: z.number().int().min(8).max(17),
  city: z.string().min(2),
  schoolOrAtl: z.string().min(3),
  ageBracket: ageBracketEnum,
  summary: z.string().min(20),
  materialsUsed: z.array(z.string()),
  mentorName: z.string().min(2),
  verifiedGuardianCoSigned: z.boolean(),
  unlockedBadge: z.string(),
  demoVideoOrDocUrl: z.string().optional(),
});
export type JuniorShowcaseProject = z.infer<typeof juniorShowcaseProjectSchema>;

export const guardianConsentSchema = z.object({
  id: z.string().min(3),
  studentName: z.string().min(2),
  studentAge: z.number().int().min(8).max(17),
  guardianName: z.string().min(2),
  guardianEmail: z.string().email(),
  guardianRelationship: z.enum(['parent', 'teacher_mentor', 'school_principal']),
  schoolName: z.string().min(2),
  city: z.string().min(2),
  dpdpConsentGranted: z.boolean().refine((val) => val === true, {
    message: 'DPDP guardian consent must be explicitly granted',
  }),
  safetySupervisionAgreed: z.boolean().refine((val) => val === true, {
    message: 'Agreement to physical lab supervision is required',
  }),
  consentTimestamp: z.string(),
});
export type GuardianConsent = z.infer<typeof guardianConsentSchema>;

/**
 * Filter junior challenges by age bracket and difficulty
 */
export function filterJuniorChallenges(
  challenges: JuniorChallenge[],
  filters: {
    ageBracket?: AgeBracket | 'all';
    difficulty?: 'starter' | 'builder' | 'innovator' | 'all';
  }
): JuniorChallenge[] {
  return challenges.filter((c) => {
    if (filters.ageBracket && filters.ageBracket !== 'all' && c.ageBracket !== filters.ageBracket) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== 'all' && c.difficulty !== filters.difficulty) {
      return false;
    }
    return true;
  });
}

/**
 * Generates formatted text for a junior innovator certificate compliant with DPDP Act.
 */
export function generateJuniorPassportCredential(project: JuniorShowcaseProject): string {
  return [
    '================================================================================',
    '       HACKERLAND YOUNG INNOVATORS · JUNIOR MAKER CREDENTIAL',
    '       COMPLIANT WITH DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT 2023',
    '================================================================================',
    `PROJECT:         ${project.title}`,
    `BUILDER:         ${project.builderName} (Age ${project.builderAge})`,
    `LOCATION:        ${project.city}, India`,
    `ATL / SCHOOL:    ${project.schoolOrAtl}`,
    `AGE TIER:        ${project.ageBracket.replace('_', ' ').toUpperCase()}`,
    `SUPERVISING:     ${project.mentorName}`,
    `GUARDIAN VERIF:  ${project.verifiedGuardianCoSigned ? 'VERIFIED GUARDIAN / TEACHER CO-SIGN' : 'PENDING'}`,
    `BADGE EARNED:    ${project.unlockedBadge}`,
    '--------------------------------------------------------------------------------',
    'MATERIALS & MICROCONTROLLERS:',
    project.materialsUsed.map((m) => ` - ${m}`).join('\n'),
    '--------------------------------------------------------------------------------',
    'SUMMARY:',
    project.summary,
    '================================================================================',
  ].join('\n');
}
