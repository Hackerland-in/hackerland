'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Bookmark,
  Search,
} from 'lucide-react';
import { Badge, Button, Card, FilterChip, cn } from '@hackerland/ui';
import type { ObservatoryItem, RadarRing, ObservatoryCategory } from '@hackerland/core';
import { useSocialCommunity } from '@/components/social/social-context';

interface Props {
  items: ObservatoryItem[];
}

export function TechRadarView({ items }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<ObservatoryItem | null>(items[0] ?? null);

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedQuadrant !== 'all' && item.quadrant !== selectedQuadrant) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getRingTone = (ring: RadarRing): 'success' | 'accent' | 'warning' | 'danger' => {
    switch (ring) {
      case 'Adopt':
        return 'success';
      case 'Trial':
        return 'accent';
      case 'Assess':
        return 'warning';
      case 'Hold':
        return 'danger';
    }
  };

  const getCategoryLabel = (category: ObservatoryCategory) => {
    switch (category) {
      case 'patent_expiry':
        return 'Expired Patent (Public Domain)';
      case 'research_breakthrough':
        return 'Research Breakthrough';
      case 'open_hardware':
        return 'Open Hardware & Silicon';
      case 'grant_fund':
        return 'Gov & Deep-Tech Grant';
    }
  };

  return (
    <div className="space-y-5 min-w-0">
      {/* Filter Controls */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Signals' },
            { id: 'patent_expiry', label: 'Expired Patents' },
            { id: 'open_hardware', label: 'Open Hardware & Silicon' },
            { id: 'research_breakthrough', label: 'Research Breakthroughs' },
            { id: 'grant_fund', label: 'Grants & Bounties' },
          ].map((tab) => (
            <FilterChip
              key={tab.id}
              selected={selectedCategory === tab.id}
              tone="accent"
              onClick={() => setSelectedCategory(tab.id)}
            >
              {tab.label}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Hardware & Silicon', 'Energy & Propulsion', 'Robotics & Automation'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSelectedQuadrant(q)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-display font-medium whitespace-nowrap transition border',
                  selectedQuadrant === q
                    ? 'bg-accent-soft text-accent-fg border-accent/40'
                    : 'bg-sunken text-fg-muted border-hairline hover:text-fg',
                )}
              >
                {q === 'all' ? 'All Domains' : q}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
            <input
              type="search"
              placeholder="Filter signals or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Split: Signals List + Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-body-xs text-fg-muted px-1">
            <span>Showing {filteredItems.length} Verified Signals</span>
            <span className="flex items-center gap-1.5 font-mono text-success-fg font-semibold">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span>Live Watchlist</span>
            </span>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isActive = activeItem?.id === item.id;
              const saved = isItemSaved(`observatory:${item.id}`);

              return (
                <Card
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={cn(
                    'cursor-pointer p-4.5 transition space-y-3 min-w-0 [overflow-wrap:anywhere]',
                    isActive
                      ? 'border-accent bg-accent-soft/40 shadow-xs'
                      : 'border-hairline bg-surface-1 hover:border-accent/40',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge tone="accent" variant="outline">
                      {getCategoryLabel(item.category)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge tone={getRingTone(item.ring)} variant="outline">
                        Ring: {item.ring}
                      </Badge>
                      <span className="text-xs font-mono font-bold text-accent-fg">
                        {item.impactScore}/100
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveItem(`observatory:${item.id}`);
                        }}
                        aria-label={saved ? `Unsave ${item.title}` : `Save ${item.title}`}
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

                  <div>
                    <h3 className="font-display text-body-md font-bold text-fg">{item.title}</h3>
                    <p className="text-body-xs text-fg-muted mt-1 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-body-xs">
                    <span className="text-fg-subtle">Source: {item.source.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-sunken border border-hairline text-fg-muted"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Inspector Panel */}
        <div className="xl:col-span-5">
          {activeItem ? (
            <Card className="sticky top-20 border-hairline bg-surface-1 p-5 space-y-4 shadow-xs min-w-0 [overflow-wrap:anywhere]">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-fg-subtle font-mono">
                    SIGNAL #{activeItem.id.toUpperCase()}
                  </span>
                  <Badge tone={getRingTone(activeItem.ring)} variant="outline">
                    Ring: {activeItem.ring}
                  </Badge>
                </div>

                <h3 className="font-display text-headline-sm font-bold text-fg leading-snug">
                  {activeItem.title}
                </h3>

                <p className="text-body-xs text-fg-muted leading-relaxed">{activeItem.summary}</p>
              </div>

              <div className="rounded-xl border border-accent/25 bg-accent-soft p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-accent-fg text-xs font-display font-bold uppercase tracking-wider">
                  <Lightbulb className="size-4" />
                  <span>How to Build With This</span>
                </div>
                <p className="text-body-xs text-fg leading-relaxed">{activeItem.makerAction}</p>
              </div>

              <div className="rounded-xl border border-hairline bg-sunken p-4 space-y-1.5">
                <div className="text-xs font-display font-semibold text-fg uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-accent" />
                  <span>Commercial Potential</span>
                </div>
                <p className="text-body-xs text-fg-muted leading-relaxed">
                  {activeItem.commercialPotential}
                </p>
              </div>

              <div className="text-body-xs text-fg-subtle flex items-center justify-between pt-2 border-t border-hairline">
                <span>Verified by {activeItem.source.name}</span>
                <a
                  href={activeItem.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-fg hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Source</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild variant="primary" size="sm">
                  <Link href={`/ideas?ref=${encodeURIComponent(activeItem.title)}`}>
                    <Sparkles className="size-3.5" />
                    <span>Fork Into Stage Zero IdeaLab</span>
                  </Link>
                </Button>

                <Button asChild variant="secondary" size="sm">
                  <Link href="/problems">
                    <span>Find Matching Problem &amp; Squad</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-fg-muted text-body-xs border-hairline bg-surface-1">
              Select a signal to inspect technical details and commercialization pathways.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
