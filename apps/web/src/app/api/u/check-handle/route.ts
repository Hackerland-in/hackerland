import { handleSchema } from '@hackerland/core';
import { connectDb, ProfileModel } from '@hackerland/db';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';

const RESERVED_HANDLES = new Set(ALL_PEOPLE.map((p) => p.handle.toLowerCase()));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle || !handle.trim()) {
    return Response.json(
      { available: false, error: 'Handle is required' },
      { status: 400 },
    );
  }

  const parsed = handleSchema.safeParse(handle);
  if (!parsed.success) {
    return Response.json({
      available: false,
      error:
        'Handle must be 3-30 characters, lowercase letters, numbers, and hyphens (cannot start or end with a hyphen).',
    });
  }

  const validatedHandle = parsed.data;

  // Check reserved fixture handles
  if (RESERVED_HANDLES.has(validatedHandle)) {
    return Response.json({
      available: false,
      error: 'Handle is already taken',
    });
  }

  // Check database if configured
  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const existing = await ProfileModel.findOne({ handle: validatedHandle }).lean();
      if (existing) {
        return Response.json({
          available: false,
          error: 'Handle is already taken',
        });
      }
    } catch {
      // In case of DB disconnection, proceed with fixture check
    }
  }

  return Response.json({ available: true });
}
