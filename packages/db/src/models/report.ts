import mongoose, { Schema, type Model } from 'mongoose';

export const REPORT_TARGET_TYPES = ['post', 'project', 'profile', 'opportunity', 'comment'] as const;
export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

export const REPORT_REASONS = [
  'spam',
  'malicious_code',
  'harassment',
  'scam',
  'child_safety',
  'other',
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_STATUSES = ['pending', 'reviewed', 'actioned', 'dismissed'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const MODERATION_ACTIONS = ['none', 'hidden', 'banned', 'warned'] as const;
export type ModerationAction = (typeof MODERATION_ACTIONS)[number];

export interface IReport {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  actionTaken: ModerationAction;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: String, required: true },
    targetType: { type: String, enum: REPORT_TARGET_TYPES, required: true },
    targetId: { type: String, required: true },
    reason: { type: String, enum: REPORT_REASONS, required: true },
    details: { type: String, default: '' },
    status: { type: String, enum: REPORT_STATUSES, default: 'pending' },
    actionTaken: { type: String, enum: MODERATION_ACTIONS, default: 'none' },
    resolvedBy: { type: String },
    resolvedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ targetType: 1, targetId: 1 });
ReportSchema.index({ reason: 1, status: 1 });

export const ReportModel: Model<IReport> =
  (mongoose.models.Report as Model<IReport>) ??
  mongoose.model<IReport>('Report', ReportSchema);
