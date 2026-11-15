import mongoose, { Schema, type Model } from 'mongoose';
import {
  CURRENCIES,
  PROJECT_STAGES,
  TRACKS,
  compensationSchema,
  type Compensation,
  type Currency,
  type ProjectStage,
  type Track,
} from '@hackerland/core';

export interface IProjectMember {
  userId: string;
  role: string;
  isLead: boolean;
}

export interface IOpenRole {
  id?: string;
  title: string;
  track: Track;
  skills: string[];
  description?: string;
  compensation: Compensation;
  status?: 'open' | 'filled' | 'closed';
}

export interface IProjectResource {
  name: string;
  qty: number;
  spec?: string;
  cost?: number;
  status: 'funded' | 'sourcing' | 'needs-funding';
}

export interface IProjectApplication {
  userId: string;
  roleTitle: string;
  note?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface IProject {
  slug: string;
  title: string;
  summary: string;
  body?: string;
  tracks: Track[];
  tags: string[];
  stage: ProjectStage;
  licence?: string;
  visibility: 'public' | 'unlisted' | 'private';
  ownerId: string;
  members: IProjectMember[];
  openRoles: IOpenRole[];
  applications?: IProjectApplication[];
  funding?: {
    goal: number;
    raised: number;
    currency: Currency;
  };
  resources: IProjectResource[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    body: { type: String, default: '' },
    tracks: [{ type: String, enum: TRACKS }],
    tags: [{ type: String }],
    stage: { type: String, enum: PROJECT_STAGES, required: true },
    licence: { type: String, default: 'MIT' },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'public',
    },
    ownerId: { type: String, required: true },
    members: [
      {
        userId: { type: String, required: true },
        role: { type: String, required: true },
        isLead: { type: Boolean, default: false },
      },
    ],
    openRoles: [
      {
        id: { type: String },
        title: { type: String, required: true },
        track: { type: String, enum: TRACKS, required: true },
        skills: [{ type: String }],
        description: { type: String, default: '' },
        compensation: {
          type: Schema.Types.Mixed,
          required: true,
          validate: {
            validator: (v: unknown) => compensationSchema.safeParse(v).success,
            message: 'Stipends and bounties need an amount and currency.',
          },
        },
        status: {
          type: String,
          enum: ['open', 'filled', 'closed'],
          default: 'open',
        },
      },
    ],
    applications: [
      {
        userId: { type: String, required: true },
        roleTitle: { type: String, required: true },
        note: { type: String, default: '' },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    funding: {
      goal: { type: Number },
      raised: { type: Number, default: 0 },
      currency: { type: String, enum: CURRENCIES },
    },
    resources: [
      {
        name: { type: String, required: true },
        qty: { type: Number, default: 1 },
        spec: { type: String },
        cost: { type: Number },
        status: {
          type: String,
          enum: ['funded', 'sourcing', 'needs-funding'],
          default: 'needs-funding',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

ProjectSchema.index({ tracks: 1, updatedAt: -1 });

export const ProjectModel: Model<IProject> =
  (mongoose.models.Project as Model<IProject>) ??
  mongoose.model<IProject>('Project', ProjectSchema);
