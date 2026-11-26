import Link from 'next/link';
import { NewProjectWizard } from '@/components/new-project/wizard';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { Panel } from '@hackerland/ui';
import { Rocket, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Start a Build',
  description: 'Assemble a squad, launch an open project, and build in public.',
};

export default function NewProjectPage() {
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

        <NewProjectWizard />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
