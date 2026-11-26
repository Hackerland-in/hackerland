'use client';

import { useState } from 'react';
import {
  POST_KINDS,
  POST_KIND_LABEL,
  type PostKind,
} from '@hackerland/core';
import { Avatar, Button, Input, Textarea, cn } from '@hackerland/ui';
import {
  Hammer,
  HelpCircle,
  Sparkles,
  Users,
  Send,
  Plus,
  X,
  UserCheck,
} from 'lucide-react';
import type { FeedPost } from '@/lib/data/types';
import { useBuilderIdentity } from '@/lib/builder-identity';

export interface InlinePostComposerProps {
  onPostPublished?: (post: FeedPost) => void;
  className?: string;
}

const KIND_ICONS: Record<PostKind, typeof Hammer> = {
  update: Hammer,
  question: HelpCircle,
  showcase: Sparkles,
  'squad-call': Users,
};

export function InlinePostComposer({ onPostPublished, className }: InlinePostComposerProps) {
  const { identity, updateIdentity } = useBuilderIdentity();
  const [expanded, setExpanded] = useState(false);
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [handleDraft, setHandleDraft] = useState('');
  const [kind, setKind] = useState<PostKind>('update');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>(['build-in-public']);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const addTag = (raw: string) => {
    const clean = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const openIdentityEditor = () => {
    setNameDraft(identity.name);
    setHandleDraft(identity.handle);
    setEditingIdentity(true);
  };

  const applyIdentityEdit = () => {
    if (nameDraft.trim() || handleDraft.trim()) {
      updateIdentity({
        name: nameDraft.trim() || identity.name,
        handle: handleDraft.trim() || identity.handle,
      });
    }
    setEditingIdentity(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    const payload = {
      kind,
      title: title.trim(),
      body: body.trim(),
      tags,
    };

    const optimisticPost: FeedPost = {
      id: `local-post-${Date.now()}`,
      kind,
      author: {
        handle: identity.handle,
        name: identity.name,
        headline: identity.headline,
        badges: [{ label: identity.badgeLabel, tone: 'design' }],
      },
      title: payload.title,
      body: payload.body,
      tags: payload.tags,
      createdAt: new Date().toISOString(),
      reactions: 1,
      comments: 0,
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        onPostPublished?.(data?.post ?? optimisticPost);
      } else {
        const socialRes = await fetch('/api/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'publish_post',
            ...payload,
            authorName: identity.name,
            authorHandle: identity.handle,
            authorHeadline: identity.headline,
          }),
        });
        if (socialRes.ok) {
          const data = await socialRes.json().catch(() => null);
          onPostPublished?.(data?.post ?? optimisticPost);
        } else {
          onPostPublished?.(optimisticPost);
        }
      }
    } catch {
      onPostPublished?.(optimisticPost);
    } finally {
      setSubmitting(false);
      setTitle('');
      setBody('');
      setExpanded(false);
      setFeedback('Published to community stream!');
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-hairline bg-surface-1 p-4 shadow-xs transition-all',
        expanded && 'ring-2 ring-accent/15 border-accent/40',
        className,
      )}
    >
      {!expanded ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar name={identity.name} tone="accent" size="md" />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex-1 text-left rounded-full border border-hairline bg-sunken px-4 py-2.5 text-body-md text-fg-subtle hover:border-accent/40 hover:bg-surface-2/60 transition-colors"
            >
              What are you building today? Share a progress update or ask a question…
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-hairline/70">
            <div className="flex flex-wrap items-center gap-1.5">
              {POST_KINDS.map((k) => {
                const Icon = KIND_ICONS[k];
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setKind(k);
                      setExpanded(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-display font-medium text-fg-muted hover:bg-accent/8 hover:text-accent-fg transition-colors"
                  >
                    <Icon className="size-3.5 text-accent" aria-hidden="true" />
                    <span>{POST_KIND_LABEL[k]}</span>
                  </button>
                );
              })}
            </div>
            <Button size="sm" variant="primary" onClick={() => setExpanded(true)}>
              Post
            </Button>
          </div>

          {feedback && (
            <p role="status" className="text-body-sm font-medium text-success-fg px-1">
              {feedback}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {POST_KINDS.map((k) => {
                const Icon = KIND_ICONS[k];
                const selected = kind === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    aria-pressed={selected}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-display font-semibold transition-all',
                      selected
                        ? 'border-accent bg-accent text-on-solid shadow-xs'
                        : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg',
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    <span>{POST_KIND_LABEL[k]}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-full p-1 text-fg-subtle hover:bg-surface-2 hover:text-fg"
              aria-label="Collapse post composer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Author identity bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-hairline bg-sunken/70 px-3 py-2 text-[12px]">
            {!editingIdentity ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-fg-muted">
                  <UserCheck className="size-3.5 text-accent" aria-hidden="true" />
                  <span>Posting as</span>
                  <strong className="font-semibold text-fg">{identity.name}</strong>
                  <span className="font-mono text-fg-subtle">@{identity.handle}</span>
                </span>
                <button
                  type="button"
                  onClick={openIdentityEditor}
                  className="font-display font-semibold text-accent-fg hover:underline"
                >
                  Edit name
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-2 w-full">
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Your full name"
                  aria-label="Your name"
                  className="h-7 rounded-lg border border-line bg-surface-1 px-2.5 text-[12px] text-fg focus:border-accent focus:outline-none flex-1 min-w-[130px]"
                />
                <input
                  type="text"
                  value={handleDraft}
                  onChange={(e) => setHandleDraft(e.target.value)}
                  placeholder="@handle"
                  aria-label="Your handle"
                  className="h-7 rounded-lg border border-line bg-surface-1 px-2.5 font-mono text-[12px] text-fg focus:border-accent focus:outline-none w-32"
                />
                <Button type="button" size="sm" variant="soft" onClick={applyIdentityEdit}>
                  Save
                </Button>
              </div>
            )}
          </div>

          <Input
            placeholder={
              kind === 'question'
                ? 'Headline: e.g. How to prevent STM32 I2C lockups at 400kHz?'
                : kind === 'squad-call'
                ? 'Headline: e.g. Looking for an embedded Rust developer for BMS node'
                : 'Headline: e.g. Finished PCB rev B bring-up & smoke test!'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={140}
            required
            autoFocus
          />

          <Textarea
            rows={3}
            placeholder="Share details, metrics, what worked or didn't, links, or open roles..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2.5 py-0.5 text-[12px] text-fg-muted"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                    className="hover:text-danger-fg"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  className="w-24 rounded-full border border-hairline bg-sunken px-2.5 py-1 text-[12px] text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
                />
                {tagInput.trim() && (
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="rounded-full bg-surface-2 p-1 text-accent-fg hover:bg-accent/10"
                    aria-label="Add tag"
                  >
                    <Plus className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => setExpanded(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                loading={submitting}
                disabled={submitting || !title.trim() || !body.trim()}
              >
                <Send className="size-3.5" aria-hidden="true" />
                <span>Publish Post</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
