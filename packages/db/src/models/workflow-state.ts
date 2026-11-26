import mongoose, { Schema, type Model } from 'mongoose';

export const WORKFLOW_NAMESPACES = [
  'rfc',
  'sprint',
  'job_application',
  'launchpad',
  'squad',
  'social_graph',
  'idea',
  'problem_claim',
  'ip_disclosure',
  'booking',
  'club_membership',
  'young_innovator',
] as const;

export type WorkflowNamespace = (typeof WORKFLOW_NAMESPACES)[number];

export interface IWorkflowState {
  namespace: WorkflowNamespace;
  key: string;
  payload: Record<string, unknown>;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowStateSchema = new Schema<IWorkflowState>(
  {
    namespace: {
      type: String,
      enum: WORKFLOW_NAMESPACES,
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

WorkflowStateSchema.index({ namespace: 1, key: 1 }, { unique: true });
WorkflowStateSchema.index({ namespace: 1, updatedAt: -1 });

export const WorkflowStateModel: Model<IWorkflowState> =
  (mongoose.models.WorkflowState as Model<IWorkflowState>) ??
  mongoose.model<IWorkflowState>('WorkflowState', WorkflowStateSchema);
