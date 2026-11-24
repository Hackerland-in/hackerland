'use client';

import React, { useState } from 'react';
import type { BuildJourneyStory } from '@hackerland/core';
import { Badge, Button, Card } from '@hackerland/ui';
import Link from 'next/link';

interface InteractiveStoryReaderProps {
  story: BuildJourneyStory;
}

export function InteractiveStoryReader({ story }: InteractiveStoryReaderProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'decisions'>('chapters');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [userDecisions, setUserDecisions] = useState<Record<number, number>>({});

  const currentChapter = story.chapters[activeChapterIndex] || story.chapters[0];

  return (
    <div className="space-y-8">
      {/* Navigation Switcher */}
      <div className="flex items-center space-x-2 border-b border-hairline pb-3">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'chapters'
              ? 'bg-accent text-on-solid shadow'
              : 'text-fg-subtle hover:text-fg hover:bg-surface-2'
          }`}
        >
          Chapters ({story.chapters.length})
        </button>
        <button
          onClick={() => setActiveTab('decisions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'decisions'
              ? 'bg-accent text-on-solid shadow'
              : 'text-fg-subtle hover:text-fg hover:bg-surface-2'
          }`}
        >
          Decision Archaeology ({story.decisionRecords.length})
        </button>
      </div>

      {activeTab === 'chapters' && currentChapter && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Chapter Navigation Sidebar */}
          <aside className="space-y-2 md:col-span-1 border-r border-hairline pr-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mb-3 font-mono">
              Chapters
            </div>
            {story.chapters.map((ch, idx) => (
              <button
                key={ch.number}
                onClick={() => setActiveChapterIndex(idx)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition block ${
                  activeChapterIndex === idx
                    ? 'bg-surface-2 border border-accent/40 text-accent font-semibold'
                    : 'text-fg-subtle hover:text-fg hover:bg-surface-1'
                }`}
              >
                <div className="text-[10px] text-fg-muted font-mono">Part {ch.number}</div>
                <div className="line-clamp-2 mt-0.5">{ch.title}</div>
              </button>
            ))}
          </aside>

          {/* Chapter Reading Content */}
          <main className="md:col-span-3 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-accent">Chapter {currentChapter.number}</span>
              <h2 className="text-2xl font-display font-bold text-fg">{currentChapter.title}</h2>
              <p className="text-sm text-fg-subtle italic border-l-2 border-accent pl-3 py-1">
                {currentChapter.summary}
              </p>
            </div>

            <div className="prose prose-invert max-w-none text-sm text-fg-subtle leading-relaxed whitespace-pre-line space-y-4">
              {currentChapter.contentMarkdown}
            </div>

            {/* Key Takeaway Callout */}
            <div className="p-4 rounded-xl bg-surface-1 border border-hairline/80 space-y-1.5">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <span>💡 Key Takeaway:</span>
              </div>
              <p className="text-xs text-fg font-medium leading-relaxed">
                {currentChapter.keyTakeaway}
              </p>
            </div>

            {/* Interactive Decision Prompt: "What would you do?" */}
            {currentChapter.interactivePrompt && (
              <Card className="p-5 border-hairline bg-surface-2/40 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold font-mono">
                    ?
                  </div>
                  <h3 className="text-sm font-bold text-fg">
                    Interactive Decision: What Would You Do?
                  </h3>
                </div>

                <p className="text-xs text-fg-subtle leading-relaxed">
                  {currentChapter.interactivePrompt.question}
                </p>

                <div className="space-y-2">
                  {currentChapter.interactivePrompt.options.map((opt, optIdx) => {
                    const isSelected = userDecisions[currentChapter.number] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          setUserDecisions({ ...userDecisions, [currentChapter.number]: optIdx })
                        }
                        className={`w-full text-left p-3 rounded-lg text-xs transition border flex items-center justify-between ${
                          isSelected
                            ? 'bg-accent/15 border-accent text-fg font-semibold'
                            : 'bg-surface-1 border-hairline text-fg-subtle hover:text-fg hover:border-hairline-strong'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="text-accent">✓ Selected</span>}
                      </button>
                    );
                  })}
                </div>

                {userDecisions[currentChapter.number] !== undefined && (
                  <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <span>✓ What actually happened:</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {currentChapter.interactivePrompt.revealedOutcome}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Chapter Stepper Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-hairline">
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
                onClick={() => setActiveChapterIndex((i) => Math.min(story.chapters.length - 1, i + 1))}
              >
                Next Chapter
              </Button>
            </div>
          </main>
        </div>
      )}

      {/* Decision Archaeology Tab */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold">Decision Archaeology</h2>
            <p className="text-xs text-fg-subtle">
              Analyzing critical inflection points: What options existed? Why was a path chosen? What were the unforeseen consequences?
            </p>
          </div>

          <div className="space-y-4">
            {story.decisionRecords.map((rec) => (
              <Card key={rec.id} className="p-6 border-hairline bg-surface-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-fg">{rec.decisionPoint}</h3>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-[10px] font-mono">
                    {rec.hindsightRating.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-[10px] font-mono uppercase text-fg-muted">Options Considered:</div>
                  <ul className="space-y-1 text-fg-subtle">
                    {rec.optionsAvailable.map((opt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-fg-muted">•</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-2/60 border border-hairline space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-accent">Chosen Option: </span>
                    <span className="text-fg">{rec.chosenOption}</span>
                  </div>
                  <div>
                    <span className="font-bold text-fg-muted">Rationale: </span>
                    <span className="text-fg-subtle">{rec.rationale}</span>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-400">Long-term Consequence: </span>
                    <span className="text-fg-subtle">{rec.consequences}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* "Do This Now" Action Card */}
      <Card className="p-6 bg-gradient-to-r from-surface-1 to-surface-2 border-hairline space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-fg">Apply These Lessons to Your Project</h3>
            <p className="text-xs text-fg-subtle">
              Turn passive reading into active building. Start your project workspace or investigate an unsolved problem.
            </p>
          </div>
          <Button asChild variant="primary" size="sm">
            <Link href="/ideas">Open IdeaLab & Workbook</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
