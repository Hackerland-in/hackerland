import { z } from 'zod';

export const ideaStageEnum = z.enum([
  'notice',     // Stage 1: Problem observation
  'choose',     // Stage 2: Pick one worth pursuing
  'understand', // Stage 3: User conversations
  'define',     // Stage 4: One-page brief
  'prototype',  // Stage 5: Cheapest testable version
  'test',       // Stage 6: User feedback
  'plan',       // Stage 7: Transition to project
]);
export type IdeaStage = z.infer<typeof ideaStageEnum>;

export const ideaStatusEnum = z.enum([
  'draft',
  'exploring',
  'validating',
  'converted',
  'retired_gracefully',
]);
export type IdeaStatus = z.infer<typeof ideaStatusEnum>;

export const ideaSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  creatorHandle: z.string(),
  creatorName: z.string(),
  title: z.string().min(3).max(120),
  slug: z.string().min(3),
  summary: z.string().min(10).max(300),
  problemStatement: z.string().min(20),
  targetAudience: z.string().min(5),
  currentStage: ideaStageEnum.default('notice'),
  status: ideaStatusEnum.default('exploring'),
  domains: z.array(z.string()).default([]),
  neededRoles: z.array(z.string()).default([]),
  stageWorkbook: z
    .object({
      observedProblems: z.array(z.string()).optional(),
      customerInterviewNotes: z.string().optional(),
      prototypeType: z.enum(['paper_sketch', 'mockup', 'breadboard_pcb', 'no_code', 'software_mvp', 'other']).optional(),
      feedbackSummary: z.string().optional(),
      retirementReason: z.string().optional(),
    })
    .default({}),
  linkedProjectId: z.string().optional(),
  cheersCount: z.number().default(0),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});
export type Idea = z.infer<typeof ideaSchema>;
