'use client';

import { useMemo, useState } from 'react';
import { useIsClient } from '@/lib/hooks/use-is-client';
import { useStoredValue, writeStoredValue } from '@/lib/hooks/use-stored-value';
import Link from 'next/link';
import {
  Avatar,
  Badge,
  Button,
  Panel,
  Textarea,
  cn,
} from '@hackerland/ui';
import {
  ThumbsUp,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { formatDate } from '@/lib/format';

export interface DiscussionComment {
  id: string;
  projectSlug: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
    role?: string;
  };
  content: string;
  tag?: 'Question' | 'Proposal' | 'Feedback' | 'Milestone';
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

const DEFAULT_DISCUSSIONS: Record<string, DiscussionComment[]> = {
  aeroglide: [
    {
      id: 'disc-1',
      projectSlug: 'aeroglide',
      author: {
        name: 'Arjun Mehta',
        handle: 'arjunm',
        role: 'Aerodynamics Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
      content: 'We just completed the wind tunnel CFD simulation for the carbon fiber wingtip dihedral angle. Results confirm a 14% drag reduction at 65 km/h cruise speed!',
      tag: 'Milestone',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      upvotes: 18,
    },
    {
      id: 'disc-2',
      projectSlug: 'aeroglide',
      author: {
        name: 'Neha Kulkarni',
        handle: 'neha_k',
        role: 'Embedded Systems',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      },
      content: 'What failsafe parameters should we encode for GPS loss during BVLOS flight over open agricultural terrain? Proposing an automatic return-to-home spiral at 120m AGL.',
      tag: 'Question',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      upvotes: 9,
    },
  ],
  'saathi-voice': [
    {
      id: 'disc-3',
      projectSlug: 'saathi-voice',
      author: {
        name: 'Dr. Priya Raman',
        handle: 'priya_ai',
        role: 'Speech & Audio',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      },
      content: 'The 4-bit quantized Whisper encoder runs at 18 FPS on the RK3588 NPU with zero thermal throttling. Testing Bengali and Tamil dialects next!',
      tag: 'Milestone',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      upvotes: 24,
    },
  ],
};

/** Seed thread for a project with no saved discussion yet. */
function buildDefaultDiscussion(projectSlug: string, projectTitle: string): DiscussionComment[] {
  return (
    DEFAULT_DISCUSSIONS[projectSlug] || [
      {
        id: `disc-default-${Date.now()}`,
        projectSlug,
        author: {
          name: 'Hackerland Squad Bot',
          handle: 'mesh_bot',
          role: 'System Relay',
        },
        content: `Welcome to the public build discussion room for ${projectTitle}! Ask technical questions, propose architectural RFCs, or share feedback.`,
        tag: 'Feedback',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        upvotes: 5,
      },
    ]
  );
}

export function ProjectDiscussion({
  projectSlug,
  projectTitle,
}: {
  projectSlug: string;
  projectTitle: string;
}) {
  const session = authClient.useSession();
  const user = session.data?.user;

  const isClient = useIsClient();
  const storageKey = `hackerland_discussions_${projectSlug}`;
  const savedRaw = useStoredValue(storageKey);
  // Latest in-memory thread, kept even if localStorage is unavailable.
  const [localThread, setLocalThread] = useState<{ slug: string; comments: DiscussionComment[] } | null>(
    null,
  );
  const comments = useMemo<DiscussionComment[]>(() => {
    // Saved threads live in the browser, so render nothing on the server (as before).
    if (!isClient) return [];
    if (localThread?.slug === projectSlug) return localThread.comments;
    if (savedRaw) {
      try {
        return JSON.parse(savedRaw) as DiscussionComment[];
      } catch {
        // Corrupt entry: fall back to the seed thread.
      }
    }
    return buildDefaultDiscussion(projectSlug, projectTitle);
  }, [isClient, localThread, projectSlug, projectTitle, savedRaw]);
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Question' | 'Proposal' | 'Feedback' | 'Milestone'>('Question');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);


  const saveComments = (newComments: DiscussionComment[]) => {
    setLocalThread({ slug: projectSlug, comments: newComments });
    writeStoredValue(storageKey, JSON.stringify(newComments));
  };

  const handleUpvote = (commentId: string) => {
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const hasUpvoted = !c.hasUpvoted;
        return {
          ...c,
          hasUpvoted,
          upvotes: hasUpvoted ? c.upvotes + 1 : Math.max(0, c.upvotes - 1),
        };
      }
      return c;
    });
    saveComments(updated);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);

    let authorName = 'Innovator';
    let authorHandle = 'builder';
    let authorAvatar: string | undefined = undefined;

    try {
      const cached = localStorage.getItem('hackerland_user_profile');
      if (cached) {
        const prof = JSON.parse(cached);
        if (prof?.name) authorName = prof.name;
        if (prof?.handle) authorHandle = prof.handle;
        if (prof?.avatarUrl) authorAvatar = prof.avatarUrl;
      }
    } catch {
      // Ignore
    }

    if (user?.name) authorName = user.name;
    if (user?.image) authorAvatar = user.image;

    const newComment: DiscussionComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      projectSlug,
      author: {
        name: authorName,
        handle: authorHandle,
        avatarUrl: authorAvatar,
        role: 'Community Builder',
      },
      content: newContent.trim(),
      tag: selectedTag,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
    };

    saveComments([newComment, ...comments]);
    setNewContent('');
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const getTagBadge = (tag?: string) => {
    switch (tag) {
      case 'Milestone':
        return <Badge tone="accent">Milestone</Badge>;
      case 'Question':
        return <Badge tone="neutral" variant="outline">Q&A</Badge>;
      case 'Proposal':
        return <Badge tone="make">Proposal</Badge>;
      default:
        return <Badge tone="neutral">Feedback</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Discussion Header & Post Form */}
      <Panel
        title="Squad Discussion & Q&A"
        action={
          <Badge tone="accent" variant="outline">
            {comments.length} {comments.length === 1 ? 'Message' : 'Messages'}
          </Badge>
        }
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption font-mono text-fg-subtle">Topic category:</span>
            {(['Question', 'Proposal', 'Feedback', 'Milestone'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-caption font-display font-medium border transition-colors',
                  selectedTag === tag
                    ? 'border-accent bg-accent/15 text-accent font-bold'
                    : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg'
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={`Ask a question or propose an improvement for ${projectTitle}…`}
            rows={3}
            className="w-full text-body-sm"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-[11px] font-mono text-fg-subtle flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent" />
              <span>Public discussion · Markdown formatting supported</span>
            </div>

            <div className="flex items-center gap-2">
              {successMsg && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-accent animate-in fade-in">
                  <CheckCircle2 className="size-3" />
                  <span>Posted to squad thread!</span>
                </span>
              )}
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!newContent.trim() || isSubmitting}
                className="gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Post comment</span>
              </Button>
            </div>
          </div>
        </form>
      </Panel>

      {/* Comment List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl border border-hairline bg-surface-2/40 p-4 space-y-3 transition-colors hover:border-hairline-strong"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Avatar
                  name={comment.author.name}
                  src={comment.author.avatarUrl}
                  size="sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-body-sm font-bold text-fg">
                      {comment.author.name}
                    </span>
                    <Link
                      href={`/u/${comment.author.handle}`}
                      className="font-mono text-[11px] text-accent hover:underline"
                    >
                      @{comment.author.handle}
                    </Link>
                  </div>
                  {comment.author.role && (
                    <span className="text-[10px] font-mono text-fg-subtle block">
                      {comment.author.role}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getTagBadge(comment.tag)}
                <span className="font-mono text-caption text-fg-subtle">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>

            <p className="whitespace-pre-line text-body-sm text-fg-muted leading-relaxed break-words">
              {comment.content}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-hairline/60">
              <button
                type="button"
                onClick={() => handleUpvote(comment.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-caption font-mono transition-colors border',
                  comment.hasUpvoted
                    ? 'border-accent bg-accent/15 text-accent font-bold'
                    : 'border-hairline bg-surface-1 text-fg-subtle hover:text-fg hover:border-hairline-strong'
                )}
              >
                <ThumbsUp className="size-3" />
                <span>{comment.upvotes} Kudos</span>
              </button>

              <span className="text-[10px] font-mono text-fg-subtle">
                Hackerland Thread ID: {comment.id.slice(-6)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
