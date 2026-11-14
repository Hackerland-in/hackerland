import mongoose, { Schema, type Model } from 'mongoose';
import { TRACKS, type Track } from '@hackerland/core';

export interface IRoadmapModule {
  title: string;
  provider: string;
  hours: number;
  url?: string;
  free: boolean;
  certified: boolean;
}

export interface IRoadmapStage {
  title: string;
  modules: IRoadmapModule[];
}

export interface IRoadmap {
  slug: string;
  title: string;
  track: Track;
  level: 'beginner' | 'intermediate' | 'advanced';
  stages: IRoadmapStage[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    track: { type: String, enum: TRACKS, required: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    stages: [
      {
        title: { type: String, required: true },
        modules: [
          {
            title: { type: String, required: true },
            provider: { type: String, required: true },
            hours: { type: Number, required: true },
            url: { type: String },
            free: { type: Boolean, default: true },
            certified: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const RoadmapModel: Model<IRoadmap> =
  (mongoose.models.Roadmap as Model<IRoadmap>) ??
  mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
