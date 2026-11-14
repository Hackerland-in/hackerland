import mongoose, { Schema, type Model } from 'mongoose';
import {
  REPUTATION_EVENT_KINDS,
  type ReputationEventKind,
} from '@hackerland/core';

export interface IReputationEvent {
  userId: string;
  kind: ReputationEventKind;
  points: number;
  ref: {
    type: string;
    id: string;
  };
  createdAt: Date;
}

const ReputationEventSchema = new Schema<IReputationEvent>(
  {
    userId: { type: String, required: true },
    kind: { type: String, enum: REPUTATION_EVENT_KINDS, required: true },
    points: { type: Number, required: true },
    ref: {
      type: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
  },
  {
    timestamps: false,
  },
);

ReputationEventSchema.index({ userId: 1, createdAt: -1 });

export const ReputationEventModel: Model<IReputationEvent> =
  (mongoose.models.ReputationEvent as Model<IReputationEvent>) ??
  mongoose.model<IReputationEvent>('ReputationEvent', ReputationEventSchema);
