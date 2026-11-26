import mongoose, { Schema, type Model } from 'mongoose';

export const LAB_WORKSPACE_KINDS = [
  'pcb',
  'prototype',
  'telemetry',
  'risk_audit',
  'rfq',
  'teardown',
  'sim_preset',
  'physics',
  'rf',
  'battery_eis',
  'can_bus',
  'motor_foc',
  'solar_mppt',
  'thermal',
  'firmware',
  'copilot',
  'eda',
  'spice',
] as const;

export type LabWorkspaceKind = (typeof LAB_WORKSPACE_KINDS)[number];

export interface ILabWorkspace {
  workspaceId: string;
  kind: LabWorkspaceKind;
  slugOrRoute: string;
  title: string;
  summary?: string;
  ownerHandle: string;
  ownerName: string;
  tags: string[];
  payload: Record<string, unknown>;
  isPublic: boolean;
  forkOfWorkspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabWorkspaceSchema = new Schema<ILabWorkspace>(
  {
    workspaceId: {
      type: String,
      required: true,
      trim: true,
    },
    kind: {
      type: String,
      enum: LAB_WORKSPACE_KINDS,
      required: true,
    },
    slugOrRoute: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    ownerHandle: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    payload: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    forkOfWorkspaceId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

LabWorkspaceSchema.index({ workspaceId: 1 }, { unique: true });
LabWorkspaceSchema.index({ kind: 1, updatedAt: -1 });
LabWorkspaceSchema.index({ ownerHandle: 1, updatedAt: -1 });

export const LabWorkspaceModel: Model<ILabWorkspace> =
  (mongoose.models.LabWorkspace as Model<ILabWorkspace>) ??
  mongoose.model<ILabWorkspace>('LabWorkspace', LabWorkspaceSchema);
