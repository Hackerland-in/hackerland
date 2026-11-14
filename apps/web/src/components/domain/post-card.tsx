import Link from 'next/link';
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CodeBlock,
  ProgressBar,
  SegmentedProgress,
  cn,
} from '@hackerland/ui';
import {
  POST_KIND_LABEL,
  formatMoney,
  type PostKind,
  type Track,
} from '@hackerland/core';
import { Heart, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { FeedPost } from '@/lib/data/types';
import { ALL_PROJECT_SUMMARIES } from '@/lib/data/fixtures/projects';
import { PersonChip } from './person-chip';
import { RoleCard } from './role-card';

export interface PostCardProps {
  post: FeedPost;
  className?: string;
}

const KIND_TONE: Record<PostKind, 'neutral' | 'accent' | 'make' | 'earn'> = {
  update: 'neutral',
  question: 'accent',
  showcase: 'make',
  'squad-call': 'earn',
};

export function PostCard({ post, className }: PostCardProps) {
  // Determine card accent by project's primary track, or default to 'accent'
  const projectSummary = post.project
    ? ALL_PROJECT_SUMMARIES.find((p) => p.slug === post.project?.slug)
    : undefined;
  const projectTrack = (projectSummary?.tracks[0] as Track | undefined) ?? 'accent';

  return (
    <Card
      accent={projectTrack}
      className={cn('flex flex-col justify-between min-w-0 break-words', className)}
    >
      <div>
        <CardHeader className="space-y-3">
          {/* Top metadata row: Kind badge, project link, and date */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={KIND_TONE[post.kind]} variant="outline">
                {POST_KIND_LABEL[post.kind] ?? post.kind}
              </Badge>
              {post.project ? (
                <Link
                  href={`/projects/${post.project.slug}`}
                  className="font-display text-label-sm text-accent transition-colors hover:underline break-words"
                >
                  {post.project.title}
                </Link>
              ) : null}
            </div>
            <time
              dateTime={post.createdAt}
              className="font-display text-label-sm text-fg-subtle tabular-nums"
            >
              {formatDate(post.createdAt)}
            </time>
          </div>

          {/* Author & co-authors */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <PersonChip person={post.author} size="sm" />
            {post.coAuthors && post.coAuthors.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 text-body-sm text-fg-subtle">
                <span>with</span>
                {post.coAuthors.map((co) => (
                  <PersonChip key={co.handle} person={co} size="sm" />
                ))}
              </div>
            ) : null}
          </div>

          {/* Post title */}
          <h2 className="font-display text-headline-sm text-fg break-words mt-1">
            {post.title}
          </h2>
        </CardHeader>

        <CardBody className="space-y-4 pt-3">
          {/* Post body with word break to prevent overflow from long URLs */}
          <p className="text-body-md text-fg-muted break-words whitespace-pre-line [overflow-wrap:anywhere]">
            {post.body}
          </p>

          {/* Update / Showcase milestone progress */}
          {(post.kind === 'update' || post.kind === 'showcase') && post.progress ? (
            <div className="rounded-lg border border-hairline bg-surface-2 p-3">
              <div className="mb-2 flex items-center justify-between text-body-sm">
                <span className="font-display text-label-sm uppercase text-fg-subtle">
                  {post.progress.label}
                </span>
                <span className="font-display text-label-sm text-fg-muted tabular-nums">
                  Stage {post.progress.current} of {post.progress.total}
                </span>
              </div>
              <SegmentedProgress
                total={post.progress.total}
                completed={post.progress.current}
                tone={projectTrack}
                label={post.progress.label}
              />
            </div>
          ) : null}

          {/* Primary code block if present (e.g. in questions) */}
          {post.code ? (
            <CodeBlock
              code={post.code.source}
              filename={post.code.filename}
              language={post.code.language}
            />
          ) : null}

          {/* Question: Accepted answer block */}
          {post.kind === 'question' && post.acceptedAnswer ? (
            <div className="rounded-lg border border-success/40 bg-success/5 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/20 pb-2">
                <Badge tone="success" variant="solid">
                  Accepted answer
                </Badge>
                <PersonChip person={post.acceptedAnswer.author} size="sm" />
              </div>
              <p className="text-body-md text-fg break-words whitespace-pre-line [overflow-wrap:anywhere]">
                {post.acceptedAnswer.body}
              </p>
              {post.acceptedAnswer.code ? (
                <CodeBlock
                  code={post.acceptedAnswer.code.source}
                  filename={post.acceptedAnswer.code.filename}
                  language={post.acceptedAnswer.code.language}
                />
              ) : null}
            </div>
          ) : null}

          {/* Squad call: funding progress bar & open roles */}
          {post.kind === 'squad-call' && post.squadCall ? (
            <div className="flex flex-col gap-4">
              {post.squadCall.funding ? (
                <div className="rounded-lg border border-hairline bg-surface-2 p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm">
                    <span className="font-display text-label-sm uppercase text-fg-subtle">
                      Squad Funding Target
                    </span>
                    <span className="font-display text-label-sm text-earn tabular-nums">
                      {formatMoney(
                        post.squadCall.funding.raised,
                        post.squadCall.funding.currency,
                      )}{' '}
                      / {formatMoney(post.squadCall.funding.goal, post.squadCall.funding.currency)}
                    </span>
                  </div>
                  <ProgressBar
                    value={post.squadCall.funding.raised}
                    max={post.squadCall.funding.goal}
                    tone="earn"
                    label="Squad funding progress"
                    showValue
                  />
                </div>
              ) : null}

              {post.squadCall.openRoles && post.squadCall.openRoles.length > 0 ? (
                <div className="space-y-2">
                  <span className="font-display text-label-sm uppercase text-fg-subtle">
                    Open Roles ({post.squadCall.openRoles.length})
                  </span>
                  <div className="flex flex-col gap-2">
                    {post.squadCall.openRoles.map((role) => (
                      <RoleCard key={role.id} role={role} compact />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Tags */}
          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <Chip key={tag} tone="neutral">
                  #{tag}
                </Chip>
              ))}
            </div>
          ) : null}
        </CardBody>
      </div>

      {/* Footer: Reactions, comments & project link */}
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-fg-subtle">
        <div className="flex items-center gap-4 text-body-sm">
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Heart className="size-4" aria-hidden="true" />
            <span>{post.reactions}</span>
            <span className="sr-only">reactions</span>
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <MessageSquare className="size-4" aria-hidden="true" />
            <span>{post.comments}</span>
            <span className="sr-only">comments</span>
          </span>
        </div>

        {post.project ? (
          <Link
            href={`/projects/${post.project.slug}`}
            className="font-display text-label-sm uppercase text-fg-muted transition-colors hover:text-accent"
          >
            View project &rarr;
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
