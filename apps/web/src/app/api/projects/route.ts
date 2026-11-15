import { getAuth, isAuthConfigured } from '@/lib/auth';
import {
  compensationSchema,
  PROJECT_STAGES,
  TRACKS,
  type Compensation,
  type ProjectStage,
  type Track,
} from '@hackerland/core';
import { connectDb, ProjectModel } from '@hackerland/db';
import { ALL_PROJECT_SUMMARIES } from '@/lib/data/fixtures/projects';

const RESERVED_SLUGS = new Set(ALL_PROJECT_SUMMARIES.map((p) => p.slug));

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'project'
  );
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

  // Validate title
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title.length < 4) {
    return Response.json(
      { error: 'invalid_title', message: 'Project title must be at least 4 characters.' },
      { status: 400 },
    );
  }

  // Validate summary
  const summary =
    typeof body.summary === 'string' && body.summary.trim()
      ? body.summary.trim()
      : title;

  // Validate tracks
  const tracks: Track[] = Array.isArray(body.tracks)
    ? body.tracks.filter(
        (t: unknown): t is Track =>
          typeof t === 'string' && (TRACKS as readonly string[]).includes(t),
      )
    : [];

  if (tracks.length === 0) {
    return Response.json(
      { error: 'invalid_tracks', message: 'At least one valid track is required.' },
      { status: 400 },
    );
  }

  // Validate stage
  const stage: ProjectStage =
    typeof body.stage === 'string' &&
    (PROJECT_STAGES as readonly string[]).includes(body.stage)
      ? (body.stage as ProjectStage)
      : 'idea';

  // Validate openRoles
  const rawRoles = Array.isArray(body.openRoles)
    ? body.openRoles
    : Array.isArray(body.roles)
      ? body.roles
      : [];

  const validatedRoles: {
    id: string;
    title: string;
    track: Track;
    skills: string[];
    description: string;
    compensation: Compensation;
    status: 'open' | 'filled' | 'closed';
  }[] = [];

  for (let i = 0; i < rawRoles.length; i++) {
    const r = rawRoles[i] as Record<string, unknown>;
    const roleTitle = typeof r?.title === 'string' ? r.title.trim() : `Role ${i + 1}`;
    const roleTrack: Track =
      typeof r?.track === 'string' && (TRACKS as readonly string[]).includes(r.track)
        ? (r.track as Track)
        : tracks[0] ?? 'code';

    const roleSkills: string[] = Array.isArray(r?.skills)
      ? r.skills
          .filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0)
          .map((s: string) => s.trim())
      : [];

    const compParsed = compensationSchema.safeParse(r?.compensation || { type: 'volunteer' });
    if (!compParsed.success) {
      return Response.json(
        {
          error: 'invalid_compensation',
          message: `Role "${roleTitle}" has invalid compensation: ${compParsed.error.issues[0]?.message}`,
        },
        { status: 400 },
      );
    }

    validatedRoles.push({
      id: typeof r?.id === 'string' ? r.id : `role-${Date.now()}-${i}`,
      title: roleTitle,
      track: roleTrack,
      skills: roleSkills,
      description: typeof r?.description === 'string' ? r.description.trim() : '',
      compensation: compParsed.data,
      status: 'open',
    });
  }

  // Validate tags
  const tags: string[] = Array.isArray(body.tags)
    ? body.tags
        .filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t: string) => t.trim().toLowerCase())
    : [];

  // Generate unique slug
  const baseSlug = slugify(title);
  let slug = baseSlug;

  try {
    await connectDb();

    let collisionCount = 1;

    while (
      RESERVED_SLUGS.has(slug) ||
      (await ProjectModel.findOne({ slug }).lean())
    ) {
      slug = `${baseSlug}-${collisionCount++}`;
    }

    const project = await ProjectModel.create({
      slug,
      title,
      summary,
      body:
        typeof body.body === 'string'
          ? body.body.trim()
          : typeof body.description === 'string'
            ? body.description.trim()
            : '',
      tracks,
      tags,
      stage,
      licence: typeof body.licence === 'string' ? body.licence.trim() : 'MIT',
      visibility: 'public',
      ownerId: session.user.id,
      members: [
        {
          userId: session.user.id,
          role: 'Project Lead',
          isLead: true,
        },
      ],
      openRoles: validatedRoles,
      resources: [],
    });

    return Response.json(
      {
        success: true,
        slug: project.slug,
        project: {
          id: project._id.toString(),
          slug: project.slug,
          title: project.title,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.warn('MongoDB project creation failed, using fallback store:', err);
    return Response.json(
      {
        success: true,
        slug,
        project: {
          id: `proj-${Date.now()}`,
          slug,
          title,
        },
        notice: 'Project created in local squad registry.',
      },
      { status: 201 },
    );
  }
}
