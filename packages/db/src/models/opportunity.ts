import mongoose, { Schema, type Model } from 'mongoose';
import {
  CURRENCIES,
  OPPORTUNITY_KINDS,
  OPPORTUNITY_STATUSES,
  TRACKS,
  type Currency,
  type OpportunityKind,
  type OpportunityStatus,
  type Track,
} from '@hackerland/core';

export interface IOpportunityClaim {
  userId: string;
  note?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface IOpportunity {
  kind: OpportunityKind;
  title: string;
  summary: string;
  sponsor: {
    name: string;
    url?: string;
  };
  reward: {
    amount: number;
    currency: Currency;
    kind?: string;
  };
  tracks: Track[];
  deadline?: Date;
  status: OpportunityStatus;
  projectId?: string;
  externalUrl?: string;
  createdBy?: string;
  claims?: IOpportunityClaim[];
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    kind: { type: String, enum: OPPORTUNITY_KINDS, required: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    sponsor: {
      name: { type: String, required: true },
      url: { type: String },
    },
    reward: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, enum: CURRENCIES, required: true },
      kind: { type: String },
    },
    tracks: {
      type: [
        {
          type: String,
          enum: TRACKS,
        },
      ],
      validate: {
        validator: (v: Track[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one track required',
      },
    },
    deadline: { type: Date },
    status: {
      type: String,
      enum: OPPORTUNITY_STATUSES,
      required: true,
      default: 'open',
    },
    projectId: { type: String },
    externalUrl: { type: String },
    createdBy: { type: String },
    claims: [
      {
        userId: { type: String, required: true },
        note: { type: String },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

OpportunitySchema.index({ status: 1, kind: 1, deadline: 1 });

export const OpportunityModel: Model<IOpportunity> =
  (mongoose.models.Opportunity as Model<IOpportunity>) ??
  mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
