'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BuildJourneyStory } from '@hackerland/core';
import { Badge, Button, Card, FilterChip, cn } from '@hackerland/ui';
import { ArrowRight, Bookmark, Search } from 'lucide-react';
import { useSocialCommunity } from './social-context';

export interface StoriesExplorerProps {
  initialStories: BuildJourneyStory[];
}

export function StoriesExplorer({ initialStories }: StoriesExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Stories');
  const [searchQuery, setSearchQuery] = useState('');
  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  const categories = useMemo(() => {
    const dynamicCats = Array.from(new Set(initialStories.map((s) => s.category)));
    return ['All Stories', ...dynamicCats];
  }, [initialStories]);

  const filteredStories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return initialStories.filter((story) => {
      if (selectedCategory !== 'All Stories' && story.category !== selectedCategory) return false;
      if (
        q &&
        !story.title.toLowerCase().includes(q) &&
        !story.summary.toLowerCase().includes(q) &&
        !story.subjectName.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [initialStories, selectedCategory, searchQuery]);

  return (
    <div className="space-y-5 min-w-0">
      {/* Interactive Filter Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              selected={selectedCategory === cat}
              tone="accent"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </FilterChip>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="search"
            placeholder="Search journeys, companies, builders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStories.map((story) => {
          const saved = isItemSaved(`story:${story.slug}`);
          return (
            <Card
              key={story.id}
              className="flex flex-col justify-between overflow-hidden border-hairline bg-surface-1 hover:border-accent/40 transition-all group min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <Badge tone="accent" variant="outline">
                    {story.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-fg-subtle font-mono text-[11px]">
                      {story.readingTimeMinutes} min read
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSaveItem(`story:${story.slug}`)}
                      aria-label={saved ? `Unsave ${story.title}` : `Save ${story.title}`}
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
                </div>

                <div className="space-y-1.5">
                  <h2 className="font-display text-headline-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h2>
                  <p className="text-body-sm text-fg-muted line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                {/* Key Metrics Pill Box */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-hairline text-center">
                  {story.metricsHighlights.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-[10px] text-fg-subtle uppercase font-mono">{m.label}</div>
                      <div className="font-display text-body-xs font-bold text-fg">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Decision Archaeology Preview */}
                <div className="p-3 rounded-xl bg-sunken border border-hairline space-y-1 text-body-xs">
                  <div className="text-[10px] font-bold text-warning-fg uppercase tracking-wider">
                    ⚡ Decision Archaeology
                  </div>
                  <div className="text-fg font-medium line-clamp-2">
                    {story.decisionRecords[0]?.decisionPoint}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button asChild variant="soft" size="sm" className="w-full justify-between">
                  <Link href={`/stories/${story.slug}`}>
                    <span>Read Full Journey &amp; Chapters</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contribution CTA */}
      <Card className="p-6 border-hairline bg-surface-1 text-center space-y-3">
        <h3 className="font-display text-headline-sm font-bold text-fg">
          Are you building an ambitious product or company?
        </h3>
        <p className="text-body-sm text-fg-muted leading-relaxed max-w-xl mx-auto">
          Document your prototype journey, failure autopsies, and architectural decisions to guide the next generation of makers.
        </p>
        <div className="pt-1">
          <Button asChild variant="primary" size="sm">
            <Link href="/ideas">Start Your Build Journey in IdeaLab</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
