import { getAuth, isAuthConfigured } from '@/lib/auth';
import { connectDb, ProjectModel } from '@hackerland/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
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

  const { slug } = await params;
  if (!slug) {
    return Response.json({ error: 'slug_required' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const roleTitle = typeof body.roleTitle === 'string' ? body.roleTitle.trim() : '';
  if (!roleTitle) {
    return Response.json(
      { error: 'role_required', message: 'roleTitle is required to apply for a role.' },
      { status: 400 },
    );
  }

  const note = typeof body.note === 'string' ? body.note.trim() : '';

  try {
    await connectDb();

    const project = await ProjectModel.findOne({ slug });
    if (!project) {
      return Response.json(
        { error: 'project_not_found', message: `Project "${slug}" was not found.` },
        { status: 404 },
      );
    }

    // Check if user is the project owner
    if (project.ownerId === session.user.id) {
      return Response.json(
        { error: 'already_lead', message: 'You are already the lead of this project.' },
        { status: 400 },
      );
    }

    // Check if user already applied for this role
    const existingApp = project.applications?.find(
      (a) =>
        a.userId === session.user.id &&
        a.roleTitle.toLowerCase() === roleTitle.toLowerCase(),
    );

    if (existingApp) {
      return Response.json(
        {
          error: 'already_applied',
          message: 'You have already applied for this position.',
        },
        { status: 409 },
      );
    }

    project.applications = project.applications || [];
    project.applications.push({
      userId: session.user.id,
      roleTitle,
      note,
      status: 'pending',
      createdAt: new Date(),
    });

    await project.save();

    return Response.json(
      {
        success: true,
        message: `Application submitted for "${roleTitle}".`,
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database update failed';
    return Response.json({ error: 'database_error', message }, { status: 500 });
  }
}
