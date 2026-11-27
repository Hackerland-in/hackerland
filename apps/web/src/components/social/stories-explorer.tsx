'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { BuildJourneyStory } from '@hackerland/core';
import { Badge, Button, Card, FilterChip, cn } from '@hackerland/ui';
import { ArrowRight, Bookmark, Compass, Globe, Lightbulb, MapPin, Search } from 'lucide-react';
import { useSocialCommunity } from './social-context';

export interface StoriesExplorerProps {
  initialStories: BuildJourneyStory[];
}

function getSectorPathwayHref(story: BuildJourneyStory): { href: string; label: string } {
  const cat = story.category.toLowerCase();
  if (cat.includes('silicon') || cat.includes('ai')) {
    return { href: '/learn?track=code', label: 'Sector Pathway: Silicon & Code' };
  }
  if (cat.includes('aerospace')) {
    return { href: '/learn?track=research', label: 'Sector Pathway: Deep-Tech' };
  }
  if (cat.includes('ev') || cat.includes('clean energy')) {
    return { href: '/learn?track=make', label: 'Sector Pathway: EV & Hardware' };
  }
  if (cat.includes('textile')) {
    return { href: '/learn?track=make', label: 'Sector Pathway: Smart Textiles' };
  }
  if (cat.includes('photonics') || cat.includes('cnc') || cat.includes('manufacturing')) {
    return { href: '/learn?track=make', label: 'Sector Pathway: Precision Make' };
  }
  return { href: '/learn', label: 'Sector Pathway' };
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
        !story.subjectName.toLowerCase().includes(q) &&
        !story.tagline.toLowerCase().includes(q) &&
        !story.headquarters.toLowerCase().includes(q) &&
        !story.category.toLowerCase().includes(q)
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
            <input
              type="search"
              placeholder="Search Pune, Tiruppur, Surat, EV, CNC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-display">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-3 py-1 font-semibold text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
            >
              <Compass className="size-3" aria-hidden="true" />
              <span>Sector Pathways</span>
            </Link>
            <Link
              href="/export"
              className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent-soft px-3 py-1 font-semibold text-accent-fg hover:bg-accent hover:text-on-solid transition-colors"
            >
              <Globe className="size-3" aria-hidden="true" />
              <span>India Export Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStories.map((story) => {
          const saved = isItemSaved(`story:${story.slug}`);
          const pathway = getSectorPathwayHref(story);
          const isIndianHubStory = story.headquarters.toLowerCase().includes('india') ||
            story.headquarters.toLowerCase().includes('maharashtra') ||
            story.headquarters.toLowerCase().includes('tamil nadu') ||
            story.headquarters.toLowerCase().includes('gujarat');

          return (
            <Card
              key={story.id}
              className="flex flex-col justify-between overflow-hidden border-hairline bg-surface-1 hover:border-accent/40 transition-all group min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="accent" variant="outline">
                      {story.category}
                    </Badge>
                    {isIndianHubStory && (
                      <Badge tone="earn" variant="outline">
                        Made in India · Export
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-fg-subtle">
                    <MapPin className="size-3 text-accent-fg shrink-0" aria-hidden="true" />
                    <span>{story.headquarters}</span>
                    <span>·</span>
                    <span>Est. {story.foundingYear}</span>
                  </div>
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

              <div className="p-5 pt-0 space-y-2.5">
                <Button asChild variant="soft" size="sm" className="w-full justify-between">
                  <Link href={`/stories/${story.slug}`}>
                    <span>Read Full Journey &amp; Chapters</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <Link
                    href={pathway.href}
                    title={pathway.label}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-hairline bg-sunken px-2 py-1.5 text-[11px] font-display font-semibold text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg transition-colors truncate"
                  >
                    <Compass className="size-3 shrink-0 text-accent-fg" aria-hidden="true" />
                    <span className="truncate">Sector Path</span>
                  </Link>
                  <Link
                    href="/ideas"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-hairline bg-sunken px-2 py-1.5 text-[11px] font-display font-semibold text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg transition-colors truncate"
                  >
                    <Lightbulb className="size-3 shrink-0 text-accent-fg" aria-hidden="true" />
                    <span className="truncate">IdeaLab</span>
                  </Link>
                  <Link
                    href="/export"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-accent/25 bg-accent-soft/70 px-2 py-1.5 text-[11px] font-display font-semibold text-accent-fg hover:bg-accent hover:text-on-solid transition-colors truncate"
                  >
                    <Globe className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">Export Hub</span>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contribution CTA */}
      <Card className="p-6 border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft/60 text-center space-y-3">
        <h3 className="font-display text-headline-sm font-bold text-fg">
          Are you building an ambitious product or export-ready factory?
        </h3>
        <p className="text-body-sm text-fg-muted leading-relaxed max-w-xl mx-auto">
          Document your prototype journey, failure autopsies, and architectural decisions—then link directly to Sector Pathways and India Export playbooks.
        </p>
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
          <Button asChild variant="primary" size="sm">
            <Link href="/ideas">Start Your Build Journey in IdeaLab</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/learn">Explore Sector Pathways</Link>
          </Button>
          <Button asChild variant="soft" size="sm">
            <Link href="/export">Open Global Export Hub</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
