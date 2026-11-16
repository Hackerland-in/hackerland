import { z } from 'zod';

export const milestoneEscrowStatusEnum = z.enum([
  'escrow_locked',
  'in_review',
  'released',
]);
export type MilestoneEscrowStatus = z.infer<typeof milestoneEscrowStatusEnum>;

export const kanbanTaskStatusEnum = z.enum([
  'todo',
  'in_progress',
  'review',
  'done',
]);
export type KanbanTaskStatus = z.infer<typeof kanbanTaskStatusEnum>;

export const kanbanTaskPriorityEnum = z.enum([
  'low',
  'medium',
  'high',
  'critical',
]);
export type KanbanTaskPriority = z.infer<typeof kanbanTaskPriorityEnum>;

export const squadMemberRoleSchema = z.object({
  id: z.string(),
  roleTitle: z.string().min(2),
  track: z.string(),
  status: z.enum(['filled', 'open']),
  stipend: z.string().optional(),
  skills: z.array(z.string()),
  assignee: z
    .object({
      handle: z.string(),
      name: z.string(),
      avatarUrl: z.string().optional(),
      reputationScore: z.number().optional(),
    })
    .nullable()
    .optional(),
});
export type SquadMemberRole = z.infer<typeof squadMemberRoleSchema>;

export const milestoneEscrowSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  escrowAmountInr: z.number(),
  escrowAmountUsd: z.number(),
  status: milestoneEscrowStatusEnum,
  proofRequirements: z.array(z.string()),
  submittedProof: z
    .object({
      proofUrl: z.string(),
      summary: z.string(),
      submittedAt: z.string(),
      submittedBy: z.string(),
    })
    .optional(),
  unlockedPassportBadge: z.string(),
});
export type MilestoneEscrow = z.infer<typeof milestoneEscrowSchema>;

export const kanbanTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  status: kanbanTaskStatusEnum,
  priority: kanbanTaskPriorityEnum,
  assigneeHandle: z.string().optional(),
  tags: z.array(z.string()),
});
export type KanbanTask = z.infer<typeof kanbanTaskSchema>;

export const projectSquadRoomSchema = z.object({
  projectSlug: z.string(),
  projectTitle: z.string(),
  tagline: z.string(),
  escrowPoolTotalInr: z.number(),
  escrowPoolTotalUsd: z.number(),
  squadMembers: z.array(squadMemberRoleSchema),
  milestones: z.array(milestoneEscrowSchema),
  tasks: z.array(kanbanTaskSchema),
});
export type ProjectSquadRoom = z.infer<typeof projectSquadRoomSchema>;
