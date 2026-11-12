import { z } from 'zod';
import { currencySchema } from './money';

export const PROJECT_STAGES = ['idea', 'prototype', 'beta', 'launched'] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];
export const projectStageSchema = z.enum(PROJECT_STAGES);

export const PROJECT_STAGE_LABEL: Record<ProjectStage, string> = {
  idea: 'Idea',
  prototype: 'Prototype',
  beta: 'Beta',
  launched: 'Launched',
};

export const COMPENSATION_TYPES = [
  'volunteer',
  'stipend',
  'bounty',
  'revenue-share',
  'equity',
] as const;
export type CompensationType = (typeof COMPENSATION_TYPES)[number];

const PAID_TYPES: readonly CompensationType[] = ['stipend', 'bounty'];

export const compensationSchema = z
  .object({
    type: z.enum(COMPENSATION_TYPES),
    amount: z.number().nonnegative().optional(),
    currency: currencySchema.optional(),
    period: z.enum(['one-time', 'month']).optional(),
  })
  .refine(
    (value) =>
      !PAID_TYPES.includes(value.type) ||
      (value.amount !== undefined && value.currency !== undefined),
    { message: 'Stipends and bounties need an amount and currency.', path: ['amount'] },
  );
export type Compensation = z.infer<typeof compensationSchema>;
