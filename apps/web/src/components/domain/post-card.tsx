'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import {
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  Check,
  UserPlus,
  UserCheck,
  ArrowUpRight,
  Send,
} from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { FeedPost } from '@/lib/data/types';
import { ALL_PROJECT_SUMMARIES } from '@/lib/data/fixtures/projects';
import { PersonChip } from './person-chip';
import { RoleCard } from './role-card';
import { LiveTelemetryPanel } from './live-telemetry-panel';
import { PostReactionButton } from '@/app/feed/post-reaction-button';
import { PostReportButton } from '@/app/feed/post-report-button';
import { useSocialCommunity } from '@/components/social/social-context';

export interface PostCardProps {
  post: FeedPost;
  className?: string;
  onTagClick?: (tag: string) => void;
}

interface InlineReply {
  id: string;
  authorName: string;
  authorHandle: string;
  body: string;
  timeAgo: string;
}

const KIND_TONE: Record<PostKind, 'neutral' | 'accent' | 'make' | 'earn'> = {
  update: 'accent',
  question: 'neutral',
  showcase: 'make',
  'squad-call': 'earn',
};

function getInitialReplies(post: FeedPost): InlineReply[] {
  if (post.comments === 0) return [];
  if (post.kind === 'question') {
    return [
      {
        id: `${post.id}-r1`,
        authorName: 'Kabir Shah',
        authorHandle: 'kabir-shah',
        body: 'Also verify pull-up resistor values (2.2kΩ–4.7kΩ) when running Fast-Mode 400kHz over longer harness wires.',
        timeAgo: '1h ago',
      },
    ];
  }
  if (post.kind === 'showcase') {
    return [
      {
        id: `${post.id}-r1`,
        authorName: 'Arjun Menon',
        authorHandle: 'arjun-menon',
        body: 'Sub-$70 BOM on a 40-cell Braille mechanism is a massive milestone. Are the Gerber files live on GitHub?',
        timeAgo: '3h ago',
      },
    ];
  }
  return [
    {
      id: `${post.id}-r1`,
      authorName: 'Zoya Khan',
      authorHandle: 'zoya-khan',
      body: 'Super crisp telemetry curves! Following closely for the next milestone drop.',
      timeAgo: '2h ago',
    },
  ];
}

export function PostCard({ post, className, onTagClick }: PostCardProps) {
  const { isFollowing, toggleFollow, isBookmarked, toggleBookmark, isReposted, toggleRepost } =
    useSocialCommunity();

  const [showComments, setShowComments] = useState(false);
  const [replies, setReplies] = useState<InlineReply[]>(() => getInitialReplies(post));
  const [replyText, setReplyText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const projectSummary = post.project
    ? ALL_PROJECT_SUMMARIES.find((p) => p.slug === post.project?.slug)
    : undefined;
  const projectTrack = (projectSummary?.tracks[0] as Track | undefined) ?? 'accent';

  const following = isFollowing(post.author.handle);
  const bookmarked = isBookmarked(post.id);
  const reposted = isReposted(post.id);

  const displayedCommentsCount = post.comments + (replies.length - getInitialReplies(post).length);
  const displayedRepostCount = (reposted ? 1 : 0) + Math.max(1, Math.floor(post.reactions / 6));

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setReplies((prev) => [
      ...prev,
      {
        id: `${post.id}-reply-${Date.now()}`,
        authorName: 'You (Builder)',
        authorHandle: 'community-builder',
        body: trimmed,
        timeAgo: 'Just now',
      },
    ]);
    setReplyText('');
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/feed#${post.id}`
        : `https://www.hackerland.in/feed#${post.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Ignore clipboard failures in restricted environments
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Card
      id={post.id}
      accent={projectTrack}
      className={cn(
        'flex flex-col justify-between min-w-0 break-words transition-shadow hover:shadow-module',
        className,
      )}
    >
      <div>
        {reposted && (
          <div className="flex items-center gap-1.5 px-5 pt-3 text-[12px] font-display font-medium text-accent-fg">
            <Repeat2 className="size-3.5" aria-hidden="true" />
            <span>Boosted by you</span>
          </div>
        )}

        <CardHeader className="space-y-3">
          {/* Social Author Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href={`/u/${post.author.handle}`}
                className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Avatar
                  name={post.author.name}
                  src={post.author.avatarUrl}
                  size="md"
                  className="ring-2 ring-accent/15 hover:ring-accent transition-all"
                />
              </Link>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link
                    href={`/u/${post.author.handle}`}
                    className="font-display font-bold text-body-md text-fg hover:text-accent-fg hover:underline truncate max-w-full"
                  >
                    {post.author.name}
                  </Link>
                  {post.author.badges[0] && (
                    <Badge tone={post.author.badges[0].tone} variant="outline">
                      {post.author.badges[0].label}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-fg-subtle">
                  <Link
                    href={`/u/${post.author.handle}`}
                    className="font-mono hover:text-accent-fg transition-colors"
                  >
                    @{post.author.handle}
                  </Link>
                  <span>·</span>
                  <time dateTime={post.createdAt} className="tabular-nums">
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => toggleFollow(post.author.handle)}
                aria-pressed={following}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-display font-semibold transition-all border',
                  following
                    ? 'border-hairline bg-surface-2 text-fg-muted hover:border-danger/30 hover:text-danger-fg'
                    : 'border-accent/25 bg-accent/10 text-accent-fg hover:bg-accent hover:text-on-solid',
                )}
              >
                {following ? (
                  <>
                    <UserCheck className="size-3.5" aria-hidden="true" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="size-3.5" aria-hidden="true" />
                    <span>Follow</span>
                  </>
                )}
              </button>
              <PostReportButton postId={post.id} postTitle={post.title} />
            </div>
          </div>

          {/* Post Kind + Co-authors + Attached Project Pill */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <Badge tone={KIND_TONE[post.kind]} variant="outline">
              {POST_KIND_LABEL[post.kind] ?? post.kind}
            </Badge>
            {post.project ? (
              <Link
                href={`/projects/${post.project.slug}`}
                className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 font-display text-[12px] font-medium text-fg-muted hover:bg-accent/10 hover:text-accent-fg transition-colors break-words"
              >
                <span>{post.project.title}</span>
                <ArrowUpRight className="size-3 shrink-0" aria-hidden="true" />
              </Link>
            ) : null}
            {post.coAuthors && post.coAuthors.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-fg-subtle">
                <span>with</span>
                {post.coAuthors.map((co) => (
                  <Link
                    key={co.handle}
                    href={`/u/${co.handle}`}
                    className="font-medium text-fg-muted hover:text-accent-fg hover:underline"
                  >
                    @{co.handle}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* Headline */}
          <h2 className="font-display text-headline-md font-bold text-fg break-words">
            {post.title}
          </h2>
        </CardHeader>

        <CardBody className="space-y-4 pt-2.5">
          {/* Post Body */}
          <p className="text-body-md text-fg-muted break-words whitespace-pre-line [overflow-wrap:anywhere] leading-relaxed">
            {post.body}
          </p>

          {/* Milestone progress card */}
          {(post.kind === 'update' || post.kind === 'showcase') && post.progress ? (
            <div className="rounded-xl border border-hairline bg-surface-2/60 p-3.5">
              <div className="mb-2 flex items-center justify-between text-body-sm">
                <span className="font-display text-label-md font-semibold text-fg">
                  {post.progress.label}
                </span>
                <span className="font-display text-label-sm font-semibold text-accent-fg tabular-nums">
                  Milestone {post.progress.current} of {post.progress.total}
                </span>
              </div>
              <SegmentedProgress
                total={post.progress.total}
                completed={post.progress.current}
                tone="accent"
                label={post.progress.label}
              />
            </div>
          ) : null}

          {/* In-Feed Live Hardware Telemetry */}
          {post.telemetry ? <LiveTelemetryPanel telemetry={post.telemetry} /> : null}

          {/* Primary code block */}
          {post.code ? (
            <CodeBlock
              code={post.code.source}
              filename={post.code.filename}
              language={post.code.language}
            />
          ) : null}

          {/* Question: Accepted answer block */}
          {post.kind === 'question' && post.acceptedAnswer ? (
            <div className="rounded-2xl border border-success/30 bg-success/5 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/20 pb-2">
                <Badge tone="success" variant="solid">
                  Accepted Solution
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

          {/* Squad call: funding + open roles */}
          {post.kind === 'squad-call' && post.squadCall ? (
            <div className="flex flex-col gap-3.5">
              {post.squadCall.funding ? (
                <div className="rounded-xl border border-hairline bg-surface-2/60 p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm">
                    <span className="font-display text-label-md font-semibold text-fg">
                      Squad Funding Target
                    </span>
                    <span className="font-display text-label-md font-semibold text-earn-fg tabular-nums">
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
                  <span className="font-display text-label-md font-semibold text-fg-muted">
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

          {/* Clickable Hashtags */}
          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {post.tags.map((tag) =>
                onTagClick ? (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick(tag)}
                    className="rounded-full border border-hairline bg-surface-2/70 px-3 py-1 text-[12px] font-medium text-fg-muted hover:border-accent/40 hover:bg-accent/8 hover:text-accent-fg transition-colors"
                  >
                    #{tag}
                  </button>
                ) : (
                  <Link
                    key={tag}
                    href={`/feed?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-hairline bg-surface-2/70 px-3 py-1 text-[12px] font-medium text-fg-muted hover:border-accent/40 hover:bg-accent/8 hover:text-accent-fg transition-colors"
                  >
                    #{tag}
                  </Link>
                ),
              )}
            </div>
          ) : null}
        </CardBody>
      </div>

      {/* Social Actions Bar */}
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-fg-subtle py-2.5">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-body-sm">
          <PostReactionButton postId={post.id} initialReactions={post.reactions} />

          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            aria-expanded={showComments}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 tabular-nums text-body-sm transition-colors',
              showComments
                ? 'bg-accent/10 text-accent-fg font-semibold'
                : 'text-fg-subtle hover:bg-surface-2 hover:text-fg',
            )}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            <span>{displayedCommentsCount}</span>
            <span className="sr-only">comments</span>
          </button>

          <button
            type="button"
            onClick={() => toggleRepost(post.id)}
            aria-pressed={reposted}
            aria-label={reposted ? 'Remove boost' : 'Boost post'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 tabular-nums text-body-sm transition-colors',
              reposted
                ? 'bg-earn/10 text-earn-fg font-semibold'
                : 'text-fg-subtle hover:bg-surface-2 hover:text-earn-fg',
            )}
          >
            <Repeat2 className="size-4" aria-hidden="true" />
            <span>{displayedRepostCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleBookmark(post.id)}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
            className={cn(
              'inline-flex items-center justify-center rounded-full p-2 transition-colors',
              bookmarked
                ? 'bg-accent/10 text-accent-fg'
                : 'text-fg-subtle hover:bg-surface-2 hover:text-accent-fg',
            )}
          >
            <Bookmark className={cn('size-4', bookmarked && 'fill-accent text-accent')} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share post link"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[12px] font-display font-medium text-fg-subtle hover:bg-surface-2 hover:text-fg transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="size-3.5 text-success-fg" aria-hidden="true" />
                <span className="text-success-fg">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </CardFooter>

      {/* Expandable Inline Threaded Comments */}
      {showComments && (
        <div className="border-t border-hairline bg-surface-2/40 px-4 py-4 md:px-5 space-y-3.5">
          <div className="space-y-2.5">
            {replies.length === 0 ? (
              <p className="text-body-sm text-fg-subtle">No replies yet. Start the discussion below!</p>
            ) : (
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="flex items-start gap-2.5 rounded-xl bg-surface-1 border border-hairline p-3"
                >
                  <Avatar name={reply.authorName} size="sm" />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="font-display font-semibold text-fg">{reply.authorName}</span>
                      <span className="font-mono text-fg-subtle">@{reply.authorHandle}</span>
                      <span className="text-fg-subtle">· {reply.timeAgo}</span>
                    </div>
                    <p className="text-body-sm text-fg-muted break-words">{reply.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleReplySubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a helpful reply..."
              aria-label="Reply to post"
              className="flex-1 min-w-0 rounded-full border border-hairline bg-surface-1 px-4 py-2 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            <Button type="submit" size="sm" variant="primary" disabled={!replyText.trim()}>
              <Send className="size-3.5" aria-hidden="true" />
              <span>Reply</span>
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}
