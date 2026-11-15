import mongoose, { Schema, type Model } from 'mongoose';
import { TRACKS, type Track } from '@hackerland/core';

export interface IProfile {
  userId: string;
  handle: string;
  displayName: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  tracks: Track[];
  skills: string[];
  experienceBadges: { label: string; tone: Track | 'neutral' }[];
  links: { label: string; url: string }[];
  reputation: number;
  isMinor?: boolean;
  parentalConsentGiven?: boolean;
  dpdpConsentHash?: string;
  dpdpConsentTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: String, required: true, unique: true },
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: { type: String, required: true, trim: true },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String },
    location: { type: String, default: '' },
    tracks: [
      {
        type: String,
        enum: TRACKS,
      },
    ],
    skills: [{ type: String }],
    experienceBadges: [
      {
        label: { type: String, required: true },
        tone: { type: String, enum: [...TRACKS, 'neutral'], default: 'neutral' },
      },
    ],
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    reputation: { type: Number, default: 0 },
    isMinor: { type: Boolean, default: false },
    parentalConsentGiven: { type: Boolean, default: false },
    dpdpConsentHash: { type: String },
    dpdpConsentTimestamp: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const ProfileModel: Model<IProfile> =
  (mongoose.models.Profile as Model<IProfile>) ??
  mongoose.model<IProfile>('Profile', ProfileSchema);
