import { z } from 'zod';

export const storyTypeEnum = z.enum([
  'company',
  'product',
  'invention',
  'open_source',
  'failure_autopsy',
  'hackerland_native',
]);
export type StoryType = z.infer<typeof storyTypeEnum>;

export const decisionArchaeologySchema = z.object({
  id: z.string(),
  decisionPoint: z.string(),
  optionsAvailable: z.array(z.string()),
  chosenOption: z.string(),
  rationale: z.string(),
  consequences: z.string(),
  hindsightRating: z.enum(['game_changer', 'necessary_compromise', 'costly_mistake']),
});
export type DecisionArchaeology = z.infer<typeof decisionArchaeologySchema>;

export const storyChapterSchema = z.object({
  number: z.number(),
  title: z.string(),
  summary: z.string(),
  contentMarkdown: z.string(),
  keyTakeaway: z.string(),
  interactivePrompt: z
    .object({
      question: z.string(),
      options: z.array(z.string()),
      revealedOutcome: z.string(),
    })
    .optional(),
});
export type StoryChapter = z.infer<typeof storyChapterSchema>;

export const buildJourneyStorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subjectName: z.string(),
  tagline: z.string(),
  storyType: storyTypeEnum,
  category: z.string(),
  heroImageUrl: z.string().optional(),
  summary: z.string(),
  foundingYear: z.number(),
  headquarters: z.string(),
  metricsHighlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  chapters: z.array(storyChapterSchema).default([]),
  decisionRecords: z.array(decisionArchaeologySchema).default([]),
  readingTimeMinutes: z.number().default(8),
  verifiedSourcesCount: z.number().default(1),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type BuildJourneyStory = z.infer<typeof buildJourneyStorySchema>;
