import mongoose, { Schema, type Model } from 'mongoose';

export const NOTIFICATION_TYPES = [
  'squad_apply',
  'bounty_claim',
  'ship_update',
  'reaction',
  'moderation_action',
  'system',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface INotification {
  userId: string;
  actorId?: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    actorId: { type: String },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const NotificationModel: Model<INotification> =
  (mongoose.models.Notification as Model<INotification>) ??
  mongoose.model<INotification>('Notification', NotificationSchema);
