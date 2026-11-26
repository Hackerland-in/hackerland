import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBuildStory, listBuildStories } from '@/lib/data/stories-data';
import { Badge, Card, CardBody } from '@hackerland/ui';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <nav aria-label="Breadcrumb">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 text-body-sm font-display font-medium text-fg-subtle hover:text-accent-fg transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Back to Build Journey Archive</span>
          </Link>
        </nav>

        <Card className="border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft">
          <CardBody className="p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-2 flex-wrap text-body-xs">
              <Badge tone="accent" variant="outline">
                {story.category}
              </Badge>
              <span className="text-fg-subtle">Founded in {story.foundingYear}</span>
              <span className="text-fg-subtle">•</span>
              <span className="text-fg-subtle">{story.headquarters}</span>
              <span className="text-fg-subtle">•</span>
              <span className="text-success-fg font-mono font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                {story.verifiedSourcesCount} Verified Sources
              </span>
            </div>

            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              {story.title}
            </h1>

            <p className="text-body-md text-fg-muted leading-relaxed">
              {story.tagline}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface-1 border border-hairline text-center">
              {story.metricsHighlights.map((m, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-[10px] text-fg-subtle uppercase font-mono">{m.label}</div>
                  <div className="font-display text-body-md sm:text-headline-sm font-bold text-accent-fg">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <InteractiveStoryReader story={story} />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
