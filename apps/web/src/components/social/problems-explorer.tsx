'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Problem } from '@hackerland/core';
import { Badge, Button, Card, FilterChip, cn } from '@hackerland/ui';
import { Target, ArrowRight, Coins, Users, Search, Bookmark, Check } from 'lucide-react';
import { getActiveBuilderIdentity } from '@/lib/builder-identity';
import { useSocialCommunity } from './social-context';
import { useVenture } from './venture-context';

function mapProblemDomainToSector(domain: string): { sectorId: string; sectorLabel: string } {
  switch (domain) {
    case 'healthcare':
      return {
        sectorId: 'medtech-diagnostics',
        sectorLabel: 'MedTech, Point-of-Care Diagnostics & Biomedical Hardware',
      };
    case 'agriculture':
      return {
        sectorId: 'agro-food-coldchain',
        sectorLabel: 'Agro-Processing, Cold Chain & AgriTech',
      };
    case 'clean_water':
      return {
        sectorId: 'ev-clean-energy',
        sectorLabel: 'Climate Tech, Clean Water & Energy',
      };
    case 'space_aerospace':
      return {
        sectorId: 'drones-defense-space',
        sectorLabel: 'Drones, UAVs, Defense & Space Systems',
      };
    default:
      return {
        sectorId: 'semiconductors-electronics',
        sectorLabel: 'Semiconductors, PCB & Embedded Electronics',
      };
  }
}

export interface ProblemsExplorerProps {
  initialProblems: Problem[];
}

export function ProblemsExplorer({ initialProblems }: ProblemsExplorerProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [serverClaimsCountByProblem, setServerClaimsCountByProblem] = useState<Record<string, number>>({});
  const { isItemSaved, toggleSaveItem } = useSocialCommunity();
  const { startVenture } = useVenture();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackerland_claimed_problems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setClaimedIds(parsed);
      }
    } catch {}

    if (typeof fetch !== 'function') return;
    let active = true;
    const identity = getActiveBuilderIdentity();
    fetch('/api/ideas?scope=problems')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data || !Array.isArray(data.problemClaims)) return;
        const claims = data.problemClaims as Array<{
          problemId?: string;
          claimantHandle?: string;
        }>;
        const ownClaimed: string[] = [];
        const counts: Record<string, number> = {};
        for (const c of claims) {
          if (!c.problemId) continue;
          counts[c.problemId] = (counts[c.problemId] ?? 0) + 1;
          if (!c.claimantHandle || c.claimantHandle.toLowerCase() === identity.handle.toLowerCase()) {
            ownClaimed.push(c.problemId);
          }
        }
        setServerClaimsCountByProblem(counts);
        if (ownClaimed.length > 0) {
          setClaimedIds((prev) => {
            const merged = Array.from(new Set([...prev, ...ownClaimed]));
            try {
              localStorage.setItem('hackerland_claimed_problems', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const toggleClaim = (id: string) => {
    const identity = getActiveBuilderIdentity();
    const targetProblem = initialProblems.find((p) => p.id === id);
    const willClaim = !claimedIds.includes(id);

    setClaimedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('hackerland_claimed_problems', JSON.stringify(next));
      } catch {}
      return next;
    });

    if (willClaim && targetProblem) {
      const sector = mapProblemDomainToSector(targetProblem.domain);
      startVenture({
        title: targetProblem.title,
        sectorId: sector.sectorId,
        sectorLabel: sector.sectorLabel,
        problemSlug: targetProblem.slug,
        stage: 1,
      });
    }

    if (willClaim && typeof fetch === 'function') {
      void fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim_problem',
          problemId: id,
          problemSlug: targetProblem?.slug ?? id,
          problemTitle: targetProblem?.title ?? 'Problem Investigation',
          claimantHandle: identity.handle,
          claimantName: identity.name,
        }),
      }).catch(() => {});
    }
  };

  const domains = useMemo(() => {
    return ['all', ...Array.from(new Set(initialProblems.map((p) => p.domain)))];
  }, [initialProblems]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return initialProblems.filter((prob) => {
      if (selectedDomain !== 'all' && prob.domain !== selectedDomain) return false;
      if (
        q &&
        !prob.title.toLowerCase().includes(q) &&
        !prob.description.toLowerCase().includes(q) &&
        !(prob.sourceName || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [initialProblems, selectedDomain, searchQuery]);

  return (
    <div className="space-y-5 min-w-0">
      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {domains.map((dom) => (
            <FilterChip
              key={dom}
              selected={selectedDomain === dom}
              tone="accent"
              onClick={() => setSelectedDomain(dom)}
            >
              {dom === 'all' ? 'All Domains' : dom.replace('_', ' ')}
            </FilterChip>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="search"
            placeholder="Search problem statements, constraints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Problems Grid */}
      <div className="space-y-4">
        {filtered.map((prob) => {
          const isClaimed = claimedIds.includes(prob.id);
          const saved = isItemSaved(`problem:${prob.id}`);

          return (
            <Card
              key={prob.id}
              className="p-5 sm:p-6 border-hairline bg-surface-1 hover:border-accent/40 transition-all space-y-5 min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="accent" variant="outline">
                      {prob.domain.replace('_', ' ')}
                    </Badge>
                    <span className="text-body-xs text-fg-muted">
                      Source: {prob.sourceName || prob.sourceType}
                    </span>
                    <Badge
                      tone={
                        prob.status === 'unsolved'
                          ? 'danger'
                          : prob.status === 'investigating'
                          ? 'warning'
                          : 'success'
                      }
                      variant="outline"
                    >
                      {prob.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h2 className="font-display text-headline-sm sm:text-headline-md font-bold text-fg">
                    {prob.title}
                  </h2>
                </div>

                <div className="flex items-start gap-2.5 shrink-0">
                  {prob.bountyRewardInr && (
                    <div className="px-3.5 py-2 rounded-xl bg-earn/10 border border-earn/25 text-right">
                      <div className="text-[10px] text-earn-fg uppercase font-mono font-bold flex items-center gap-1 justify-end">
                        <Coins className="size-3" />
                        <span>Bounty Pool</span>
                      </div>
                      <div className="font-display text-body-lg font-bold text-earn-fg tabular-nums">
                        ₹{prob.bountyRewardInr.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleSaveItem(`problem:${prob.id}`)}
                    aria-label={saved ? `Unsave ${prob.title}` : `Save ${prob.title}`}
                    aria-pressed={saved}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border transition-colors',
                      saved
                        ? 'border-accent/40 bg-accent-soft text-accent-fg'
                        : 'border-hairline bg-surface-2/60 text-fg-subtle hover:text-accent-fg',
                    )}
                  >
                    <Bookmark className={cn('size-3.5', saved && 'fill-current')} />
                  </button>
                </div>
              </div>

              <p className="text-body-sm text-fg-muted leading-relaxed">{prob.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-xs">
                <div className="p-3.5 rounded-xl bg-sunken border border-hairline space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-accent-fg flex items-center gap-1">
                    <Target className="size-3" />
                    <span>Impact Target</span>
                  </div>
                  <div className="text-fg font-medium">{prob.impactTarget}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-sunken border border-hairline space-y-1">
                  <div className="text-[10px] font-mono uppercase font-bold text-fg-subtle">
                    Technical Constraints
                  </div>
                  <ul className="space-y-0.5 text-fg-muted">
                    {prob.keyConstraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-accent font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-body-xs">
                <div className="flex items-center gap-1.5 text-fg-muted font-mono">
                  <Users className="size-3.5" />
                  <span>
                    {prob.claimedProjectsCount +
                      Math.max(serverClaimsCountByProblem[prob.id] ?? 0, isClaimed ? 1 : 0)}{' '}
                    squads investigating
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleClaim(prob.id)}
                    aria-pressed={isClaimed}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-display font-semibold border transition-colors',
                      isClaimed
                        ? 'border-success/40 bg-success/10 text-success-fg'
                        : 'border-hairline bg-surface-2/60 text-fg-muted hover:text-accent-fg',
                    )}
                  >
                    {isClaimed && <Check className="size-3" />}
                    <span>{isClaimed ? 'Investigating' : 'Claim Investigation'}</span>
                  </button>

                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/ideas?problem=${prob.slug}`}>Propose in IdeaLab</Link>
                  </Button>
                  <Button asChild variant="primary" size="sm">
                    <Link
                      href={`/new?title=${encodeURIComponent(prob.title)}&tagline=${encodeURIComponent(prob.impactTarget)}&description=${encodeURIComponent(prob.description)}&domain=${encodeURIComponent(prob.domain)}`}
                    >
                      <span>Form Squad</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
