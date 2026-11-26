import { getJobBySlug } from '@/lib/data/jobs-data';
import {
  getJobApplication,
  listJobApplications,
  saveJobApplication,
} from '@/lib/data/community-workflows-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (slug === '_all') {
    return Response.json({ success: true, applications: listJobApplications() });
  }
  const job = getJobBySlug(slug);
  if (!job) {
    return Response.json({ error: 'job_not_found' }, { status: 404 });
  }
  return Response.json({ success: true, application: getJobApplication(slug) });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) {
    return Response.json({ error: 'job_not_found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const applicantName = typeof body.applicantName === 'string' ? body.applicantName.trim() : '';
  const applicantEmail = typeof body.applicantEmail === 'string' ? body.applicantEmail.trim() : '';
  const proofUrl = typeof body.proofUrl === 'string' ? body.proofUrl.trim() : '';
  const hardwareBugStory =
    typeof body.hardwareBugStory === 'string' ? body.hardwareBugStory.trim() : '';

  if (!applicantName || !applicantEmail || !proofUrl) {
    return Response.json(
      { error: 'validation_error', message: 'Name, email, and Proof-of-Work URL are required.' },
      { status: 400 },
    );
  }

  const application = saveJobApplication({
    jobSlug: slug,
    applicantName,
    applicantEmail,
    proofUrl,
    hardwareBugStory,
  });

  return Response.json({ success: true, application }, { status: 201 });
}
