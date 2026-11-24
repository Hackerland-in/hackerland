import React from 'react';
import Link from 'next/link';
import { listBuildStories } from '@/lib/data/stories-data';
import { Badge, Button, Card } from '@hackerland/ui';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Build Journey Archive & Founder Histories',
  description: 'Deep, structured build histories of real companies, hardware breakthroughs, and inventions. Decision archaeology, early prototypes, and unit economics.',
};

export default async function StoriesPage() {
  const stories = await listBuildStories();

  return (
    <div className="min-h-screen bg-canvas text-fg py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="text-accent border-accent/30 font-mono">
            Hackerland Knowledge Universe
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
            The Build Journey Archive
          </h1>
          <p className="text-fg-subtle text-base sm:text-lg leading-relaxed">
            Most platforms celebrate the billion-dollar exit. We document the messy, unglamorous reality of how things actually got built:
            the first wire-wrapped prototype, the dark middle months, unit economics, and critical decision archaeology.
          </p>
        </div>

        {/* Categories / Filter Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          {['All Stories', 'Aerospace & Deep-Tech', 'Clean Energy & Hardware', 'Silicon & AI Compute', 'Indian Builders'].map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1.5 rounded-full border cursor-pointer transition ${
                i === 0
                  ? 'bg-accent text-on-solid border-accent font-semibold'
                  : 'bg-surface-1 border-hairline text-fg-subtle hover:text-fg'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="flex flex-col justify-between overflow-hidden border-hairline bg-surface-1 hover:border-accent/40 transition group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-accent font-mono text-[10px]">
                    {story.category}
                  </Badge>
                  <span className="text-fg-muted font-mono text-[11px]">
                    {story.readingTimeMinutes} min read
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-display font-bold text-fg group-hover:text-accent transition">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h2>
                  <p className="text-xs text-fg-subtle line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                {/* Key Metrics Pill Box */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-hairline text-center">
                  {story.metricsHighlights.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-[10px] text-fg-muted uppercase font-mono">{m.label}</div>
                      <div className="text-xs font-bold text-fg font-mono">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Decision Archaeology Preview */}
                <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline/80 space-y-1 text-xs">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <span>⚡ Decision Archaeology:</span>
                  </div>
                  <div className="text-[11px] text-fg font-medium line-clamp-2">
                    {story.decisionRecords[0]?.decisionPoint}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button asChild variant="secondary" className="w-full text-xs justify-between group-hover:bg-accent group-hover:text-on-solid transition">
                  <Link href={`/stories/${story.slug}`}>
                    <span>Read Full Journey & Chapters</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Contribution CTA */}
        <div className="rounded-2xl border border-hairline bg-surface-1 p-8 text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold font-display">Are you building an ambitious product or company?</h3>
          <p className="text-xs text-fg-subtle leading-relaxed">
            Hackerland is building the world's most detailed open archive of human invention.
            Document your prototype journey, failure autopsies, and architectural decisions to guide the next generation.
          </p>
          <Button asChild variant="primary">
            <Link href="/ideas">Start Your Build Journey in IdeaLab</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
