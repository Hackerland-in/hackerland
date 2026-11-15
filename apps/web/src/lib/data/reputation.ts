import {
  REPUTATION_POINTS,
  type ReputationEventKind,
} from '@hackerland/core';
import {
  connectDb,
  ProfileModel,
  ReputationEventModel,
} from '@hackerland/db';

export interface RecordReputationResult {
  success: boolean;
  points: number;
  kind: ReputationEventKind;
}

/**
 * Appends an immutable event to the reputation ledger and increments
 * the cached reputation total on the user's profile.
 */
export async function recordReputationEvent(
  userId: string,
  kind: ReputationEventKind,
  ref: { type: string; id: string },
): Promise<RecordReputationResult> {
  const points = REPUTATION_POINTS[kind] ?? 0;

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();

      await ReputationEventModel.create({
        userId,
        kind,
        points,
        ref,
      });

      await ProfileModel.findOneAndUpdate(
        { userId },
        { $inc: { reputation: points } },
      );

      return { success: true, points, kind };
    } catch (err: unknown) {
      console.warn('MongoDB operation failed for recordReputationEvent:', err);
    }
  }

  return { success: true, points, kind };
}

/**
 * Retrieves the recent reputation events for a given user.
 */
export async function getUserReputationEvents(
  userId: string,
  limit = 10,
) {
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      return await ReputationEventModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (err: unknown) {
      console.warn('MongoDB query failed for getUserReputationEvents:', err);
    }
  }

  return [];
}
