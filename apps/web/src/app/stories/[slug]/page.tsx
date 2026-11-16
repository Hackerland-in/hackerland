import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBuildStory, listBuildStories } from '@/lib/data/stories-data';
import { Badge, Button, Card } from '@hackerland/ui';
import { ArrowLeft, BookOpen, Clock, Compass, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { InteractiveStoryReader } from './interactive-story-reader';

export async function generateStaticParams() {
  const stories = await listBuildStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getBuildStory(slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-canvas text-fg py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-xs text-fg-subtle hover:text-fg font-medium transition"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Build Journey Archive</span>
        </Link>

        {/* Story Header */}
        <header className="space-y-4 border-b border-hairline pb-8">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Badge variant="outline" className="text-accent font-mono text-[10px]">
              {story.category}
            </Badge>
            <span className="text-fg-muted font-mono">•</span>
            <span className="text-fg-subtle">Founded in {story.foundingYear}</span>
            <span className="text-fg-muted font-mono">•</span>
            <span className="text-fg-subtle">{story.headquarters}</span>
            <span className="text-fg-muted font-mono">•</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              {story.verifiedSourcesCount} Verified Primary Sources
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
            {story.title}
          </h1>

          <p className="text-base sm:text-lg text-fg-subtle leading-relaxed">
            {story.tagline}
          </p>

          {/* Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-surface-1 border border-hairline text-center">
            {story.metricsHighlights.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="text-[11px] text-fg-muted uppercase font-mono">{m.label}</div>
                <div className="text-lg font-bold text-accent font-mono">{m.value}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Client Interactive Reader (Chapters + Decision Archaeology + Interactive Prompts) */}
        <InteractiveStoryReader story={story} />
      </div>
    </div>
  );
}
