'use client';

import React, { useEffect, useState } from 'react';
import type { BuildJourneyStory } from '@hackerland/core';
import { Badge, Button, Card, cn } from '@hackerland/ui';
import Link from 'next/link';

interface InteractiveStoryReaderProps {
  story: BuildJourneyStory;
}

export function InteractiveStoryReader({ story }: InteractiveStoryReaderProps) {
  const storageKey = `hackerland_story_decisions_${story.slug}`;
  const [activeTab, setActiveTab] = useState<'chapters' | 'decisions'>('chapters');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [userDecisions, setUserDecisions] = useState<Record<number, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setUserDecisions(parsed);
      }
    } catch {}
  }, [storageKey]);

  const handleSelectDecision = (chapterNumber: number, optIdx: number) => {
    const next = { ...userDecisions, [chapterNumber]: optIdx };
    setUserDecisions(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  const currentChapter = story.chapters[activeChapterIndex] || story.chapters[0];

  return (
    <div className="space-y-6">
      {/* Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-hairline bg-surface-1 p-2 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('chapters')}
          className={cn(
            'px-4 py-2 text-body-sm font-display font-semibold rounded-full transition',
            activeTab === 'chapters'
              ? 'bg-accent text-on-solid shadow-xs'
              : 'text-fg-muted hover:text-fg hover:bg-surface-2',
          )}
        >
          Chapters ({story.chapters.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('decisions')}
          className={cn(
            'px-4 py-2 text-body-sm font-display font-semibold rounded-full transition',
            activeTab === 'decisions'
              ? 'bg-accent text-on-solid shadow-xs'
              : 'text-fg-muted hover:text-fg hover:bg-surface-2',
          )}
        >
          Decision Archaeology ({story.decisionRecords.length})
        </button>
      </div>

      {activeTab === 'chapters' && currentChapter && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chapter Navigation Sidebar */}
          <aside className="space-y-2 md:col-span-1 border-b md:border-b-0 md:border-r border-hairline pb-4 md:pb-0 md:pr-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-fg-subtle mb-2 font-mono">
              Chapters
            </div>
            {story.chapters.map((ch, idx) => (
              <button
                type="button"
                key={ch.number}
                onClick={() => setActiveChapterIndex(idx)}
                className={cn(
                  'w-full text-left p-2.5 rounded-xl text-body-xs font-medium transition block border',
                  activeChapterIndex === idx
                    ? 'bg-accent-soft border-accent/35 text-accent-fg font-semibold'
                    : 'bg-surface-1 border-transparent text-fg-muted hover:text-fg hover:bg-surface-2',
                )}
              >
                <div className="text-[10px] text-fg-subtle font-mono">Part {ch.number}</div>
                <div className="line-clamp-2 mt-0.5">{ch.title}</div>
              </button>
            ))}
          </aside>

          {/* Chapter Reading Content */}
          <main className="md:col-span-3 space-y-5">
            <div className="space-y-2">
              <span className="text-body-xs font-mono font-semibold text-accent-fg">
                Chapter {currentChapter.number}
              </span>
              <h2 className="font-display text-headline-md font-bold text-fg">
                {currentChapter.title}
              </h2>
              <p className="text-body-sm text-fg-muted italic border-l-2 border-accent pl-3 py-1">
                {currentChapter.summary}
              </p>
            </div>

            <div className="text-body-md text-fg-muted leading-relaxed whitespace-pre-line space-y-4">
              {currentChapter.contentMarkdown}
            </div>

            {/* Key Takeaway Callout */}
            <div className="p-4 rounded-xl bg-sunken border border-hairline space-y-1.5">
              <div className="text-body-xs font-bold text-warning-fg uppercase tracking-wider font-mono">
                💡 Key Takeaway
              </div>
              <p className="text-body-sm text-fg font-medium leading-relaxed">
                {currentChapter.keyTakeaway}
              </p>
            </div>

            {/* Interactive Decision Prompt */}
            {currentChapter.interactivePrompt && (
              <Card className="p-5 border-accent/25 bg-surface-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-accent-soft text-accent-fg flex items-center justify-center text-xs font-bold font-mono">
                    ?
                  </div>
                  <h3 className="font-display text-body-md font-bold text-fg">
                    Interactive Decision: What Would You Do?
                  </h3>
                </div>

                <p className="text-body-sm text-fg-muted leading-relaxed">
                  {currentChapter.interactivePrompt.question}
                </p>

                <div className="space-y-2">
                  {currentChapter.interactivePrompt.options.map((opt, optIdx) => {
                    const isSelected = userDecisions[currentChapter.number] === optIdx;
                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => handleSelectDecision(currentChapter.number, optIdx)}
                        className={cn(
                          'w-full text-left p-3 rounded-xl text-body-xs transition border flex items-center justify-between gap-2',
                          isSelected
                            ? 'bg-accent-soft border-accent text-fg font-semibold'
                            : 'bg-sunken border-hairline text-fg-muted hover:text-fg hover:border-accent/40',
                        )}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="text-accent-fg shrink-0">✓ Selected</span>}
                      </button>
                    );
                  })}
                </div>

                {userDecisions[currentChapter.number] !== undefined && (
                  <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 text-body-xs text-success-fg space-y-1">
                    <div className="font-display font-bold">✓ What actually happened:</div>
                    <p className="leading-relaxed text-fg">
                      {currentChapter.interactivePrompt.revealedOutcome}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Chapter Stepper Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-hairline">
              <Button
                variant="secondary"
                size="sm"
                disabled={activeChapterIndex === 0}
                onClick={() => setActiveChapterIndex((i) => Math.max(0, i - 1))}
              >
                Previous Chapter
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={activeChapterIndex === story.chapters.length - 1}
                onClick={() =>
                  setActiveChapterIndex((i) => Math.min(story.chapters.length - 1, i + 1))
                }
              >
                Next Chapter
              </Button>
            </div>
          </main>
        </div>
      )}

      {/* Decision Archaeology Tab */}
      {activeTab === 'decisions' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-headline-md font-bold text-fg">Decision Archaeology</h2>
            <p className="text-body-sm text-fg-muted">
              Analyzing critical inflection points: options considered, rationale, and long-term outcomes.
            </p>
          </div>

          <div className="space-y-4">
            {story.decisionRecords.map((rec) => (
              <Card key={rec.id} className="p-5 border-hairline bg-surface-1 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-body-md font-bold text-fg">{rec.decisionPoint}</h3>
                  <Badge tone="warning" variant="outline">
                    {rec.hindsightRating.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-body-xs">
                  <div className="text-[10px] font-mono uppercase text-fg-subtle">
                    Options Considered
                  </div>
                  <ul className="space-y-1 text-fg-muted">
                    {rec.optionsAvailable.map((opt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-fg-subtle">•</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-sunken border border-hairline space-y-2 text-body-xs">
                  <div>
                    <span className="font-bold text-accent-fg">Chosen Option: </span>
                    <span className="text-fg">{rec.chosenOption}</span>
                  </div>
                  <div>
                    <span className="font-bold text-fg-subtle">Rationale: </span>
                    <span className="text-fg-muted">{rec.rationale}</span>
                  </div>
                  <div>
                    <span className="font-bold text-earn-fg">Long-term Consequence: </span>
                    <span className="text-fg-muted">{rec.consequences}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action CTA */}
      <Card className="p-5 bg-gradient-to-r from-surface-1 to-accent-soft border-accent/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-body-md font-bold text-fg">
              Apply These Lessons to Your Project
            </h3>
            <p className="text-body-xs text-fg-muted">
              Turn reading into building — open your IdeaLab workbook or explore unsolved problems.
            </p>
          </div>
          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href="/ideas">Open IdeaLab &amp; Workbook</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
