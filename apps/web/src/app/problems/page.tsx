import React from 'react';
import { Target } from 'lucide-react';
import { listProblems } from '@/lib/data/problems-data';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
import { ProblemsExplorer } from '@/components/social/problems-explorer';

export const metadata = {
  title: 'The Unsolved Problems Library',
  description:
    'Global and Indian challenges waiting for real engineering solutions. Claim a problem, investigate constraints, form a squad, and earn bounties.',
};

export default async function ProblemsPage() {
  const problems = await listProblems();

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Target className="size-3.5" aria-hidden="true" />
            <span>Hackerland Problem Discovery</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            The Unsolved Problems Library
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Explore verified real-world challenges from researchers, clinics, farms, and open labs. Claim an investigation, build a solution squad, and compete for funded bounties.
          </p>
        </header>

        <ProblemsExplorer initialProblems={problems} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
