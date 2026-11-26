'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { INITIAL_COMMUNITY_IDEAS } from '@/lib/data/ideas-data';
import type { Idea, IdeaStage } from '@hackerland/core';
import { Badge, Button, Card, Input, Textarea, cn } from '@hackerland/ui';
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  Heart,
  Plus,
  Search,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { useBuilderIdentity } from '@/lib/builder-identity';
import { useSocialCommunity } from './social-context';

const STAGES: { stage: IdeaStage; number: number; name: string; desc: string }[] = [
  { stage: 'notice', number: 1, name: '1. Notice', desc: 'Find 10 real friction points around you' },
  { stage: 'choose', number: 2, name: '2. Choose', desc: 'Craft a single-sentence problem statement' },
  { stage: 'understand', number: 3, name: '3. Understand', desc: 'Interview 10 people facing it' },
  { stage: 'define', number: 4, name: '4. Define', desc: 'Write a crisp 1-page build brief' },
  { stage: 'prototype', number: 5, name: '5. Prototype', desc: 'Build the cheapest testable version' },
  { stage: 'test', number: 6, name: '6. Test', desc: 'Gather user validation or pivot early' },
  { stage: 'plan', number: 7, name: '7. Plan', desc: 'Form a squad & launch as a project' },
];

const STARTER_PROMPTS = [
  {
    category: 'Your Street',
    prompt: 'What is one task or service in your neighborhood that still relies on broken, slow manual processes?',
  },
  {
    category: 'Elders & Mobility',
    prompt: 'What physical object, appliance, or medical routine does someone over 65 struggle with daily?',
  },
  {
    category: 'College & School',
    prompt: 'What laboratory instrument or educational tool is too expensive for local schools to afford?',
  },
];

export function IdeasWorkbench() {
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_COMMUNITY_IDEAS);
  const [cheeredIds, setCheeredIds] = useState<string[]>([]);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWorkbookModal, setShowWorkbookModal] = useState(false);

  // New Idea form state
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newDomain, setNewDomain] = useState('Agriculture');

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();
  const { identity } = useBuilderIdentity();

  useEffect(() => {
    try {
      const savedIdeas = localStorage.getItem('hackerland_ideas_v1');
      if (savedIdeas) {
        const parsed = JSON.parse(savedIdeas) as Idea[];
        if (Array.isArray(parsed) && parsed.length > 0) setIdeas(parsed);
      }
      const savedCheers = localStorage.getItem('hackerland_idea_cheers');
      if (savedCheers) {
        const parsed = JSON.parse(savedCheers) as string[];
        if (Array.isArray(parsed)) setCheeredIds(parsed);
      }
    } catch {}
  }, []);

  const persistIdeas = (next: Idea[]) => {
    setIdeas(next);
    try {
      localStorage.setItem('hackerland_ideas_v1', JSON.stringify(next));
    } catch {}
  };

  const syncIdeaToServer = (idea: Idea) => {
    if (typeof fetch !== 'function') return;
    void fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_idea', idea }),
    }).catch(() => {});
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Idea = {
      id: `idea_${Date.now()}`,
      creatorId: identity.handle,
      creatorHandle: identity.handle,
      creatorName: identity.name,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary: newSummary.trim() || 'A newly proposed hardware & software idea.',
      problemStatement: newProblem.trim() || 'Problem under exploration.',
      targetAudience: newAudience.trim() || 'General community',
      currentStage: 'notice',
      status: 'exploring',
      domains: [newDomain],
      neededRoles: ['Collaborator', 'Hardware / Software Builder'],
      stageWorkbook: {
        observedProblems: [newProblem.trim()],
      },
      cheersCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    persistIdeas([created, ...ideas]);
    syncIdeaToServer(created);
    setShowWorkbookModal(false);
    setNewTitle('');
    setNewSummary('');
    setNewProblem('');
    setNewAudience('');
  };

  const handleCheer = (id: string) => {
    const alreadyCheered = cheeredIds.includes(id);
    const nextCheers = alreadyCheered
      ? cheeredIds.filter((c) => c !== id)
      : [...cheeredIds, id];
    setCheeredIds(nextCheers);
    try {
      localStorage.setItem('hackerland_idea_cheers', JSON.stringify(nextCheers));
    } catch {}

    const nextList = ideas.map((item) =>
      item.id === id
        ? { ...item, cheersCount: Math.max(0, item.cheersCount + (alreadyCheered ? -1 : 1)) }
        : item,
    );
    persistIdeas(nextList);
    const target = nextList.find((item) => item.id === id);
    if (target) syncIdeaToServer(target);
  };

  const handleAdvanceStage = (id: string) => {
    const order: IdeaStage[] = ['notice', 'choose', 'understand', 'define', 'prototype', 'test', 'plan'];
    const nextList = ideas.map((item) => {
      if (item.id !== id) return item;
      const idx = order.indexOf(item.currentStage);
      const nextStage = idx >= 0 && idx < order.length - 1 ? order[idx + 1]! : item.currentStage;
      return { ...item, currentStage: nextStage, updatedAt: new Date().toISOString() };
    });
    persistIdeas(nextList);
    const target = nextList.find((item) => item.id === id);
    if (target) syncIdeaToServer(target);
  };

  const filteredIdeas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ideas.filter((i) => {
      if (selectedStageFilter !== 'all' && i.currentStage !== selectedStageFilter) return false;
      if (
        q &&
        !i.title.toLowerCase().includes(q) &&
        !i.summary.toLowerCase().includes(q) &&
        !i.problemStatement.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [ideas, selectedStageFilter, searchQuery]);

  return (
    <div className="space-y-6 min-w-0">
      {/* Header Hero */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Lightbulb className="size-3.5" aria-hidden="true" />
            <span>Early Idea Workshop</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            IdeaLab: From Spark to Squad
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Don&apos;t have a finished prototype yet? Follow the 7-stage community incubator from raw field observation to a funded hardware squad.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button onClick={() => setShowWorkbookModal(true)} variant="primary" size="md">
            <Plus className="size-4" aria-hidden="true" />
            <span>Shape an Idea in the Workbook</span>
          </Button>
          <Button asChild variant="secondary" size="md">
            <Link href="/problems">Explore Unsolved Problems</Link>
          </Button>
        </div>
      </header>

      {/* 7-Stage Progression Pathway */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
            <Sparkles className="size-4 text-accent" aria-hidden="true" />
            <span>7-Stage Idea Progression Pathway</span>
          </h2>
          <span className="text-body-xs font-mono text-fg-subtle">Click a stage to filter</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2.5 text-xs">
          {STAGES.map((s) => (
            <button
              type="button"
              key={s.stage}
              onClick={() =>
                setSelectedStageFilter(selectedStageFilter === s.stage ? 'all' : s.stage)
              }
              className={cn(
                'p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5',
                selectedStageFilter === s.stage
                  ? 'bg-accent-soft border-accent text-accent-fg font-semibold'
                  : 'bg-sunken/70 border-hairline hover:border-accent/40 text-fg-muted',
              )}
            >
              <div className="font-mono text-[10px] uppercase font-bold text-fg-subtle">
                Stage {s.number}
              </div>
              <div className="font-display font-bold text-fg">{s.name.split('. ')[1]}</div>
              <div className="text-[11px] leading-snug text-fg-muted">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Starter Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {STARTER_PROMPTS.map((p, idx) => (
          <Card key={idx} className="p-4 border-hairline bg-surface-1 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-accent-fg">
              Starter Prompt · {p.category}
            </div>
            <p className="text-body-xs text-fg-muted leading-relaxed">{p.prompt}</p>
          </Card>
        ))}
      </div>

      {/* Search + Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-headline-sm font-bold text-fg">
            Active Ideas Seeking Collaborators ({filteredIdeas.length})
          </h2>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="search"
            placeholder="Search sparks or problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Community Idea Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => {
          const isCheered = cheeredIds.includes(idea.id);
          const saved = isItemSaved(`idea:${idea.id}`);
          return (
            <Card
              key={idea.id}
              className="p-5 border-hairline bg-surface-1 hover:border-accent/40 transition-all space-y-4 flex flex-col justify-between min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="accent" variant="outline">
                      Stage: {idea.currentStage}
                    </Badge>
                    <span className="text-fg-subtle text-[11px]">by @{idea.creatorHandle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaveItem(`idea:${idea.id}`)}
                    aria-label={saved ? `Unsave ${idea.title}` : `Save ${idea.title}`}
                    aria-pressed={saved}
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full border transition-colors',
                      saved
                        ? 'border-accent/40 bg-accent-soft text-accent-fg'
                        : 'border-hairline bg-surface-2/60 text-fg-subtle hover:text-accent-fg',
                    )}
                  >
                    <Bookmark className={cn('size-3', saved && 'fill-current')} />
                  </button>
                </div>

                <h3 className="font-display text-body-lg font-bold text-fg">{idea.title}</h3>
                <p className="text-body-sm text-fg-muted leading-relaxed">{idea.summary}</p>

                <div className="p-3 rounded-xl bg-sunken border border-hairline text-body-xs space-y-1">
                  <div className="text-[10px] font-mono uppercase text-fg-subtle font-bold">
                    Problem Statement
                  </div>
                  <div className="text-fg leading-relaxed">{idea.problemStatement}</div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {idea.neededRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-2 border border-hairline text-fg-muted font-medium"
                    >
                      Needs: {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-body-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCheer(idea.id)}
                    aria-pressed={isCheered}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors font-display font-semibold',
                      isCheered
                        ? 'border-accent bg-accent-soft text-accent-fg'
                        : 'border-hairline bg-surface-2/60 text-fg-muted hover:text-accent-fg',
                    )}
                  >
                    <Heart className={cn('size-3.5', isCheered && 'fill-current')} />
                    <span>Cheer ({idea.cheersCount})</span>
                  </button>

                  {idea.currentStage !== 'plan' && (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(idea.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-hairline bg-surface-1 text-fg-muted hover:border-accent/40 hover:text-accent-fg font-display font-medium transition-colors"
                    >
                      <span>Next stage</span>
                      <ChevronRight className="size-3" />
                    </button>
                  )}
                </div>

                <Button asChild variant="soft" size="sm">
                  <Link href={`/new?title=${encodeURIComponent(idea.title)}`}>
                    <span>Launch Project</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Crisp White & Pink Workbook Modal */}
      {showWorkbookModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="idealab-workbook-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4"
        >
          <div className="bg-surface-1 border border-hairline rounded-2xl max-w-xl w-full p-6 shadow-overlay space-y-4 max-h-[90vh] overflow-y-auto text-fg">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 id="idealab-workbook-title" className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
                <Lightbulb className="size-4 text-accent" />
                <span>IdeaLab Stage Zero Workbook</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWorkbookModal(false)}
                className="text-fg-subtle hover:text-fg p-1 rounded-full hover:bg-surface-2"
                aria-label="Close workbook modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4 text-body-xs">
              <div>
                <label className="font-display font-semibold text-fg block mb-1">
                  1. Working title of your idea
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Low-Cost Automated Solar Seed Planter"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="font-display font-semibold text-fg block mb-1">
                  2. The Problem: What friction did you observe?
                </label>
                <Textarea
                  required
                  rows={3}
                  placeholder="Describe who is hurting, what money or time is lost, and why existing tools fail..."
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                />
              </div>

              <div>
                <label className="font-display font-semibold text-fg block mb-1">
                  3. Target Audience: Who will touch or use this first?
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Smallholder farmers in Maharashtra"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                />
              </div>

              <div>
                <label className="font-display font-semibold text-fg block mb-1">
                  4. Brief Summary of the proposed prototype
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. 3D-printed seed dispenser driven by stepper motor"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                />
              </div>

              <div>
                <label className="font-display font-semibold text-fg block mb-1">Domain</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-sm text-fg focus:border-accent focus:outline-none"
                >
                  <option value="Agriculture">Agriculture &amp; Soil</option>
                  <option value="Assistive Tech">Assistive &amp; Medical Technology</option>
                  <option value="Robotics">Robotics &amp; Automation</option>
                  <option value="Clean Energy">Clean Energy &amp; EV</option>
                  <option value="Space">Aerospace &amp; Satellite</option>
                </select>
              </div>

              <div className="pt-2 border-t border-hairline flex justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowWorkbookModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish to IdeaLab
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
