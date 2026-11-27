import Link from 'next/link';
import { TRACKS, type Track } from '@hackerland/core';
import { NewProjectWizard, type NewProjectInitialDraft } from '@/components/new-project/wizard';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { Panel } from '@hackerland/ui';
import { Rocket, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Start a Build',
  description: 'Assemble a squad, launch an open project, and build in public.',
};

function readParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0]?.trim() ?? '';
  return val?.trim() ?? '';
}

function inferTracksFromDomain(domain: string): Track[] {
  const lower = domain.toLowerCase();
  if (!lower) return [];
  if (lower.includes('software') || lower.includes('ai')) return ['code'];
  if (lower.includes('craft') || lower.includes('design')) return ['make', 'design'];
  if (lower.includes('health') || lower.includes('medtech') || lower.includes('climate') || lower.includes('water')) {
    return ['make', 'research'];
  }
  return ['make', 'code'];
}

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = (await searchParams) ?? {};
  const title = readParam(resolved.title);
  const tagline = readParam(resolved.tagline);
  const description = readParam(resolved.description);
  const domain = readParam(resolved.domain);
  const rawTracks = readParam(resolved.tracks);
  const rawSkills = readParam(resolved.skills);

  const parsedTracks = rawTracks
    ? rawTracks
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t): t is Track => (TRACKS as readonly string[]).includes(t))
    : inferTracksFromDomain(domain);

  const parsedSkills = rawSkills
    ? rawSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : domain
      ? [domain.toLowerCase()]
      : [];

  const initialDraft: NewProjectInitialDraft | undefined =
    title || tagline || description || parsedTracks.length > 0 || parsedSkills.length > 0
      ? {
          ...(title ? { title } : {}),
          ...(tagline ? { tagline } : {}),
          ...(description ? { description } : {}),
          ...(parsedTracks.length > 0 ? { tracks: parsedTracks } : {}),
          ...(parsedSkills.length > 0 ? { skills: parsedSkills } : {}),
        }
      : undefined;

  return (
    <SocialCommunityProvider>
      <SocialShell
        rightRail={
          <div className="space-y-4">
            <Panel
              title="Launch Checklist"
              icon={<Sparkles className="size-4 text-accent" aria-hidden="true" />}
              headingLevel={2}
            >
              <ul className="space-y-3 text-body-sm text-fg-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Keep the title clear so makers searching by stack can spot it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Add at least 1–2 open squad roles (volunteer or stipend-backed).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Once published, post photos &amp; milestones straight to the Community Feed!</span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-hairline text-[12px] text-fg-subtle">
                Want to explore first?{' '}
                <Link href="/projects" className="text-accent-fg font-semibold hover:underline">
                  Browse open builds →
                </Link>
              </div>
            </Panel>
          </div>
        }
      >
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Rocket className="size-3.5" aria-hidden="true" />
            <span>New Open Build</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
            Start a project
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted">
            Assemble a cross-disciplinary squad and share your journey with the community.
          </p>
        </header>

        <NewProjectWizard initialDraft={initialDraft} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
