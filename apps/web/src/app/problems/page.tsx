import React from 'react';
import Link from 'next/link';
import { listProblems } from '@/lib/data/problems-data';
import { Badge, Button, Card } from '@hackerland/ui';
import { ShieldCheck, Compass, Target, ArrowRight, Sparkles, AlertCircle, Coins, Users } from 'lucide-react';

export const metadata = {
  title: 'The Unsolved Problems Library',
  description: 'Global and Indian challenges waiting for real engineering solutions. Claim a problem, investigate constraints, form a squad, and earn bounties.',
};

export default async function ProblemsPage() {
  const problems = await listProblems();

  return (
    <div className="min-h-screen bg-canvas text-fg py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="text-accent border-accent/30 font-mono">
            Hackerland Problem Discovery
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
            The Unsolved Problems Library
          </h1>
          <p className="text-fg-subtle text-base sm:text-lg leading-relaxed">
            Innovation begins with discovering a problem worth solving.
            Explore verified challenges submitted by community researchers, rural clinics, agricultural institutions, and open laboratories.
            Claim a problem, build a solution squad, and compete for funded grants.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="space-y-6">
          {problems.map((prob) => (
            <Card
              key={prob.id}
              className="p-6 sm:p-8 border-hairline bg-surface-1 hover:border-accent/40 transition space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-accent font-mono text-[10px] uppercase">
                      {prob.domain.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-fg-muted">Source: {prob.sourceName || prob.sourceType}</span>
                    <span className="text-xs text-fg-muted font-mono">•</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        prob.status === 'unsolved'
                          ? 'text-red-400 border-red-500/30'
                          : prob.status === 'investigating'
                          ? 'text-amber-400 border-amber-500/30'
                          : 'text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {prob.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-display font-bold text-fg">
                    {prob.title}
                  </h2>
                </div>

                {prob.bountyRewardInr && (
                  <div className="shrink-0 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-right">
                    <div className="text-[10px] text-amber-400 uppercase font-mono font-bold flex items-center gap-1 justify-end">
                      <Coins className="size-3" />
                      <span>Bounty Pool</span>
                    </div>
                    <div className="text-lg font-bold text-amber-400 font-mono">
                      ₹{prob.bountyRewardInr.toLocaleString('en-IN')}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-fg-subtle leading-relaxed">
                {prob.description}
              </p>

              {/* Impact Target & Key Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-surface-2/60 border border-hairline space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-accent flex items-center gap-1">
                    <Target className="size-3" />
                    <span>Impact Target:</span>
                  </div>
                  <div className="text-fg font-medium">{prob.impactTarget}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-2/60 border border-hairline space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-fg-muted">
                    Technical Constraints:
                  </div>
                  <ul className="space-y-0.5 text-fg-subtle text-[11px]">
                    {prob.keyConstraints.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-accent">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-fg-muted font-mono">
                  <Users className="size-3.5" />
                  <span>{prob.claimedProjectsCount} squads currently investigating</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/ideas?problem=${prob.slug}`}>
                      <span>Propose Solution in IdeaLab</span>
                    </Link>
                  </Button>
                  <Button asChild variant="primary" size="sm">
                    <Link href="/projects">
                      <span>Claim & Form Squad</span>
                      <ArrowRight className="size-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
