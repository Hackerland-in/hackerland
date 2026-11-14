import mongoose, { Schema, type Model } from 'mongoose';
import { POST_KINDS, type PostKind } from '@hackerland/core';

export interface IPost {
  authorId: string;
  projectId?: string;
  kind: PostKind;
  title: string;
  body: string;
  media: string[];
  tags: string[];
  counts: {
    reactions: number;
    comments: number;
  };
  acceptedAnswerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: String, required: true },
    projectId: { type: String },
    kind: { type: String, enum: POST_KINDS, required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    media: [{ type: String }],
    tags: [{ type: String }],
    counts: {
      reactions: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
    acceptedAnswerId: { type: String },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ projectId: 1, createdAt: -1 });

export const PostModel: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) ??
  mongoose.model<IPost>('Post', PostSchema);
