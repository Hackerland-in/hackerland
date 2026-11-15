import { getAuth, isAuthConfigured } from '@/lib/auth';
import { ALL_LAB_NODES } from '@/lib/data/fixtures/labs';
import {
  connectDb,
  LAB_NODE_TYPES,
  LabNodeModel,
  type LabNodeType,
} from '@hackerland/db';

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'lab-node'
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get('type');
  const type =
    rawType && (LAB_NODE_TYPES as readonly string[]).includes(rawType)
      ? (rawType as LabNodeType)
      : undefined;

  const tool = searchParams.get('tool') || undefined;

  const limitParam = parseInt(searchParams.get('limit') || '20', 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 20;

  const offsetParam = parseInt(searchParams.get('offset') || '0', 10);
  const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0;

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const filter: Record<string, unknown> = {};
      if (type) filter.type = type;
      if (tool) filter.tools = { $regex: new RegExp(tool, 'i') };

      const docs = await LabNodeModel.find(filter)
        .sort({ isVerified: -1, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      return Response.json({ success: true, labs: docs });
    } catch (err: unknown) {
      console.warn('MongoDB query failed for GET /api/labs, falling back to fixtures:', err);
    }
  }

  // Graceful fallback to fixtures
  let labs = [...ALL_LAB_NODES];
  if (type) {
    labs = labs.filter((l) => l.type === type);
  }
  if (tool) {
    const lowerTool = tool.toLowerCase();
    labs = labs.filter((l) => l.tools.some((t) => t.toLowerCase().includes(lowerTool)));
  }
  const paginated = labs.slice(offset, offset + limit);

  return Response.json({ success: true, labs: paginated });
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

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length < 3) {
    return Response.json(
      { error: 'invalid_name', message: 'Lab node name must be at least 3 characters.' },
      { status: 400 },
    );
  }

  const rawType = typeof body.type === 'string' ? body.type.trim() : '';
  if (!(LAB_NODE_TYPES as readonly string[]).includes(rawType)) {
    return Response.json(
      { error: 'invalid_type', message: `Lab type must be one of: ${LAB_NODE_TYPES.join(', ')}` },
      { status: 400 },
    );
  }
  const type = rawType as LabNodeType;

  const institution = typeof body.institution === 'string' ? body.institution.trim() : '';
  if (institution.length < 3) {
    return Response.json(
      { error: 'invalid_institution', message: 'Institution name must be at least 3 characters.' },
      { status: 400 },
    );
  }

  const location = body.location as Record<string, unknown> | undefined;
  const city = typeof location?.city === 'string' ? location.city.trim() : '';
  const state = typeof location?.state === 'string' ? location.state.trim() : '';
  const pincode = typeof location?.pincode === 'string' ? location.pincode.trim() : '';

  if (!city || !state || !pincode) {
    return Response.json(
      { error: 'invalid_location', message: 'City, state, and pincode are required.' },
      { status: 400 },
    );
  }

  const tools: string[] = Array.isArray(body.tools)
    ? body.tools.filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
    : [];

  if (tools.length === 0) {
    return Response.json(
      { error: 'invalid_tools', message: 'At least one equipment tool is required.' },
      { status: 400 },
    );
  }

  const contact = body.contact as Record<string, unknown> | undefined;
  const contactName = typeof contact?.name === 'string' ? contact.name.trim() : session.user.name || 'Lab In-Charge';
  const contactRole = typeof contact?.role === 'string' ? contact.role.trim() : 'Lab Coordinator';
  const contactEmail = typeof contact?.email === 'string' ? contact.email.trim() : session.user.email || '';

  const equipmentList = Array.isArray(body.equipmentList)
    ? body.equipmentList.map((eq: Record<string, unknown>) => ({
        name: typeof eq.name === 'string' ? eq.name.trim() : 'Equipment',
        model: typeof eq.model === 'string' ? eq.model.trim() : undefined,
        count: typeof eq.count === 'number' && eq.count > 0 ? eq.count : 1,
        status: (['available', 'in-use', 'maintenance'].includes(eq.status as string)
          ? eq.status
          : 'available') as 'available' | 'in-use' | 'maintenance',
      }))
    : tools.map((t) => ({
        name: t,
        count: 1,
        status: 'available' as const,
      }));

  const baseSlug = slugify(name);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  try {
    await connectDb();

    const lab = await LabNodeModel.create({
      slug,
      name,
      type,
      institution,
      location: { city, state, pincode },
      tools,
      equipmentList,
      isVerified: false,
      contact: {
        name: contactName,
        role: contactRole,
        email: contactEmail,
      },
      benchServiceUrl: typeof body.benchServiceUrl === 'string' ? body.benchServiceUrl.trim() : undefined,
    });

    return Response.json(
      {
        success: true,
        lab: {
          id: lab._id.toString(),
          slug: lab.slug,
          name: lab.name,
          type: lab.type,
          institution: lab.institution,
          location: lab.location,
          tools: lab.tools,
          equipmentList: lab.equipmentList,
          isVerified: lab.isVerified,
          contact: lab.contact,
          benchServiceUrl: lab.benchServiceUrl,
          createdAt: lab.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.warn('MongoDB lab registration failed, saving locally:', err);
    return Response.json(
      {
        success: true,
        lab: {
          id: `lab-${Date.now()}`,
          slug,
          name,
          type,
          institution,
          location: { city, state, pincode },
          tools,
          equipmentList,
          isVerified: false,
          contact: { name: contactName, role: contactRole, email: contactEmail },
          createdAt: new Date().toISOString(),
        },
        notice: 'Lab node registered and added to community review queue.',
      },
      { status: 201 },
    );
  }
}
