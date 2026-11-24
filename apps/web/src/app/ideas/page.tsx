'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_COMMUNITY_IDEAS } from '@/lib/data/ideas-data';
import type { Idea, IdeaStage } from '@hackerland/core';
import { Badge, Button, Card } from '@hackerland/ui';
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  Heart,
  Plus,
} from 'lucide-react';

const STAGES: { stage: IdeaStage; number: number; name: string; desc: string }[] = [
  { stage: 'notice', number: 1, name: '1. Notice', desc: 'Find 10 real friction points or problems around you' },
  { stage: 'choose', number: 2, name: '2. Choose', desc: 'Craft a single-sentence problem statement' },
  { stage: 'understand', number: 3, name: '3. Understand', desc: 'Talk to 10 real people affected by the problem' },
  { stage: 'define', number: 4, name: '4. Define', desc: 'Shape a 1-page brief: who, what, why, and how' },
  { stage: 'prototype', number: 5, name: '5. Prototype', desc: 'Build the cheapest testable version (sketch, breadboard, or no-code)' },
  { stage: 'test', number: 6, name: '6. Test', desc: 'Collect feedback and choose: continue, change, or retire gracefully' },
  { stage: 'plan', number: 7, name: '7. Plan', desc: 'Form a squad and transition into a live Hackerland project' },
];

const STARTER_PROMPTS = [
  {
    category: 'Your Street',
    prompt: 'What is one task or service in your neighborhood that still relies on broken, slow manual paper processes?',
  },
  {
    category: 'Elders & Grandparents',
    prompt: 'What physical object, appliance, or medical routine does someone over 65 struggle with daily?',
  },
  {
    category: 'College & School',
    prompt: 'What laboratory instrument or educational tool is too expensive for local schools to afford?',
  },
];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(INITIAL_COMMUNITY_IDEAS);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [showWorkbookModal, setShowWorkbookModal] = useState(false);

  // New Idea form state
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newDomain, setNewDomain] = useState('Agriculture');

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Idea = {
      id: `idea_${Date.now()}`,
      creatorId: 'u_current',
      creatorHandle: 'innovator',
      creatorName: 'You (Innovator)',
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary: newSummary || 'A newly proposed hardware & software idea.',
      problemStatement: newProblem || 'Problem under exploration.',
      targetAudience: newAudience || 'General community',
      currentStage: 'notice',
      status: 'exploring',
      domains: [newDomain],
      neededRoles: ['Collaborator', 'Hardware / Software Builder'],
      stageWorkbook: {
        observedProblems: [newProblem],
      },
      cheersCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIdeas([created, ...ideas]);
    setShowWorkbookModal(false);
    setNewTitle('');
    setNewSummary('');
    setNewProblem('');
    setNewAudience('');
  };

  const handleCheer = (id: string) => {
    setIdeas(
      ideas.map((item) =>
        item.id === id ? { ...item, cheersCount: item.cheersCount + 1 } : item
      )
    );
  };

  const filteredIdeas =
    selectedStageFilter === 'all'
      ? ideas
      : ideas.filter((i) => i.currentStage === selectedStageFilter);

  return (
    <div className="min-h-screen bg-canvas text-fg py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="text-accent border-accent/30 font-mono">
            Stage Zero On-Ramp
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
            IdeaLab: From Spark to Squad
          </h1>
          <p className="text-fg-subtle text-base sm:text-lg leading-relaxed">
            Don&apos;t have a full project yet? You don&apos;t need one. IdeaLab is a structured 7-stage incubator
            for anyone who says: <em>&quot;I have a vague spark&quot;</em> or even <em>&quot;I want to build something but don&apos;t know what.&quot;</em>
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => setShowWorkbookModal(true)} variant="primary" className="shadow-lg">
              <Plus className="size-4 mr-1.5" />
              <span>Shape an Idea in the Workbook</span>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/problems">Explore Unsolved Problems</Link>
            </Button>
          </div>
        </div>

        {/* 7-Stage Progression Walkthrough */}
        <div className="bg-surface-1 border border-hairline rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              <span>The 7-Stage Idea Progression Pathway</span>
            </h2>
            <span className="text-xs font-mono text-fg-muted">Sequential Milestones</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
            {STAGES.map((s) => (
              <div
                key={s.stage}
                onClick={() => setSelectedStageFilter(s.stage)}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  selectedStageFilter === s.stage
                    ? 'bg-accent/15 border-accent text-accent font-semibold'
                    : 'bg-surface-2/60 border-hairline hover:border-hairline-strong text-fg-subtle'
                }`}
              >
                <div className="font-mono text-[10px] uppercase font-bold text-fg-muted">
                  Stage {s.number}
                </div>
                <div className="font-bold text-fg">{s.name}</div>
                <div className="text-[11px] leading-tight text-fg-muted">{s.desc}</div>
              </div>
            ))}
          </div>

          {selectedStageFilter !== 'all' && (
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedStageFilter('all')}
                className="text-xs text-accent hover:underline font-mono"
              >
                Reset stage filter (Showing {filteredIdeas.length} ideas)
              </button>
            </div>
          )}
        </div>

        {/* Starter Prompts Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STARTER_PROMPTS.map((p, idx) => (
            <Card key={idx} className="p-4 bg-surface-1 border-hairline space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-amber-400">
                Starter Prompt: {p.category}
              </div>
              <p className="text-xs text-fg leading-relaxed">{p.prompt}</p>
            </Card>
          ))}
        </div>

        {/* Community Idea Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display">Active Ideas Seeking Collaborators</h2>
            <span className="text-xs text-fg-muted font-mono">{filteredIdeas.length} ideas exploring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="p-6 border-hairline bg-surface-1 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="text-accent font-mono text-[10px] uppercase">
                      Stage: {idea.currentStage}
                    </Badge>
                    <span className="text-fg-muted text-[11px]">Proposed by @{idea.creatorHandle}</span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-fg">{idea.title}</h3>

                  <p className="text-xs text-fg-subtle leading-relaxed">{idea.summary}</p>

                  <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline text-xs space-y-1">
                    <div className="text-[10px] font-mono uppercase text-fg-muted font-bold">Problem Statement:</div>
                    <div className="text-fg text-[11px] leading-relaxed">{idea.problemStatement}</div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {idea.neededRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-hairline text-fg font-medium"
                      >
                        Needs: {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCheer(idea.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-2/80 text-fg-subtle hover:text-red-400 transition"
                  >
                    <Heart className="size-3.5 text-red-500 fill-red-500/20" />
                    <span>Cheer ({idea.cheersCount})</span>
                  </button>

                  <Button asChild variant="secondary" size="sm">
                    <Link href="/projects">
                      <span>Convert to Project</span>
                      <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Guided Workbook Modal */}
        {showWorkbookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lightbulb className="size-4 text-amber-400" />
                  <span>IdeaLab Stage Zero Workbook</span>
                </h3>
                <button onClick={() => setShowWorkbookModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateIdea} className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    1. What is the working title of your idea?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Low-Cost Automated Solar Seed Planter"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    2. The Problem: What specific friction did you observe?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe who is hurting, what money or time is lost, and why existing tools fail..."
                    value={newProblem}
                    onChange={(e) => setNewProblem(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    3. Target Audience: Who will touch or use this first?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smallholder sugarcane farmers in Maharashtra"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    4. Brief Summary of the proposed prototype
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3D-printed seed dispenser driven by an Arduino Nano and stepper motor"
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                  >
                    <option value="Agriculture">Agriculture & Soil</option>
                    <option value="Assistive Tech">Assistive & Medical Technology</option>
                    <option value="Robotics">Robotics & Automation</option>
                    <option value="Clean Energy">Clean Energy & EV</option>
                    <option value="Space">Aerospace & Satellite</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setShowWorkbookModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Publish to IdeaLab
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
