import { getAuth, isAuthConfigured } from '@/lib/auth';
import { handleSchema, TRACKS, type Track } from '@hackerland/core';
import { connectDb, ProfileModel } from '@hackerland/db';

export async function GET(request: Request) {
  if (!isAuthConfigured()) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }

  const auth = getAuth();
  if (!auth) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    await connectDb();
    const profile = await ProfileModel.findOne({ userId: session.user.id }).lean();
    if (!profile) {
      return Response.json({ profile: null }, { status: 200 });
    }
    return Response.json({ profile }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database query failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }

  const auth = getAuth();
  if (!auth) {
    return Response.json({ error: 'auth_not_configured' }, { status: 503 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Validate handle
  const handleParsed = handleSchema.safeParse(body.handle);
  if (!handleParsed.success) {
    return Response.json(
      {
        error: 'invalid_handle',
        message:
          'Handle must be 3-30 characters, lowercase letters, numbers, and hyphens (cannot start or end with a hyphen).',
      },
      { status: 400 },
    );
  }
  const validatedHandle = handleParsed.data;

  // Validate tracks
  const tracks: Track[] = Array.isArray(body.tracks)
    ? body.tracks.filter(
        (t: unknown): t is Track =>
          typeof t === 'string' && (TRACKS as readonly string[]).includes(t),
      )
    : [];

  // Validate skills
  const skills: string[] = Array.isArray(body.skills)
    ? body.skills
        .filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0)
        .map((s: string) => s.trim())
    : [];

  // Validate experienceBadges
  const validTones = new Set([...TRACKS, 'neutral']);
  const experienceBadges = Array.isArray(body.experienceBadges)
    ? body.experienceBadges
        .filter(
          (b: unknown): b is { label: string; tone?: string } =>
            Boolean(b) && typeof (b as { label?: unknown }).label === 'string',
        )
        .map((b) => ({
          label: b.label.trim(),
          tone:
            typeof b.tone === 'string' && validTones.has(b.tone as Track)
              ? (b.tone as Track | 'neutral')
              : 'neutral',
        }))
    : [];

  try {
    await connectDb();

    // Check if handle is taken by another user
    const existingWithHandle = await ProfileModel.findOne({
      handle: validatedHandle,
      userId: { $ne: session.user.id },
    }).lean();

    if (existingWithHandle) {
      return Response.json(
        { error: 'handle_taken', message: 'Handle is already taken by another innovator.' },
        { status: 409 },
      );
    }

    const displayName =
      typeof body.displayName === 'string' && body.displayName.trim()
        ? body.displayName.trim()
        : session.user.name || validatedHandle;

    const headline = typeof body.headline === 'string' ? body.headline.trim() : '';
    const bio = typeof body.bio === 'string' ? body.bio.trim() : '';
    const avatarUrl =
      typeof body.avatarUrl === 'string' ? body.avatarUrl.trim() : session.user.image;
    const location = typeof body.location === 'string' ? body.location.trim() : '';
    const links = Array.isArray(body.links)
      ? body.links
          .filter(
            (l: unknown): l is { label: string; url: string } =>
              Boolean(l) &&
              typeof (l as { label?: unknown }).label === 'string' &&
              typeof (l as { url?: unknown }).url === 'string',
          )
          .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      : [];

    const isMinor = typeof body.isMinor === 'boolean' ? body.isMinor : false;
    const parentalConsentGiven =
      typeof body.parentalConsentGiven === 'boolean' ? body.parentalConsentGiven : false;
    const dpdpConsentHash =
      typeof body.dpdpConsentHash === 'string' && body.dpdpConsentHash.trim()
        ? body.dpdpConsentHash.trim()
        : undefined;
    const dpdpConsentTimestamp =
      body.dpdpConsentTimestamp
        ? new Date(body.dpdpConsentTimestamp as string | number | Date)
        : undefined;

    const profile = await ProfileModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          userId: session.user.id,
          handle: validatedHandle,
          displayName,
          headline,
          bio,
          avatarUrl,
          location,
          tracks,
          skills,
          experienceBadges,
          links,
          isMinor,
          parentalConsentGiven,
          ...(dpdpConsentHash ? { dpdpConsentHash } : {}),
          ...(dpdpConsentTimestamp ? { dpdpConsentTimestamp } : {}),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return Response.json({ profile }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database update failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}
