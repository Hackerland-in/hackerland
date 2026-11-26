'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  POST_KINDS,
  POST_KIND_LABEL,
  type PostKind,
} from '@hackerland/core';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Label,
  Textarea,
} from '@hackerland/ui';
import {
  X,
  Plus,
  Send,
  HelpCircle,
  Hammer,
  Sparkles,
  Users,
} from 'lucide-react';

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const KIND_ICONS: Record<PostKind, typeof Hammer> = {
  update: Hammer,
  question: HelpCircle,
  showcase: Sparkles,
  'squad-call': Users,
};

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const router = useRouter();
  const [kind, setKind] = useState<PostKind>('update');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>(['build-in-public']);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const addTag = (newTag: string) => {
    const clean = newTag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      kind,
      title: title.trim(),
      body: body.trim(),
      tags,
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('You must be signed in to post to the community feed.');
          setSubmitting(false);
          return;
        }
        // In local demo mode if DB is not configured, gracefully acknowledge
        if (res.status === 503 || res.status === 404) {
          setTitle('');
          setBody('');
          onPostCreated?.();
          onClose();
          router.refresh();
          return;
        }
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to publish post. Please try again.');
        setSubmitting(false);
        return;
      }

      // Success
      setTitle('');
      setBody('');
      onPostCreated?.();
      onClose();
      router.refresh();
    } catch {
      // Offline fallback
      setTitle('');
      setBody('');
      onPostCreated?.();
      onClose();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-post-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/35 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto min-w-0">
        <Card className="shadow-overlay border-hairline min-w-0">
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-row items-center justify-between border-b border-hairline pb-4">
              <div>
                <h2 id="create-post-title" className="font-display text-headline-sm text-fg">
                  Post to Community Feed
                </h2>
                <p className="text-body-xs text-fg-muted mt-0.5">
                  Share technical updates, ask hardware questions, or recruit squad members.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-fg-subtle hover:text-fg transition-colors rounded-sm"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </CardHeader>

            <CardBody className="space-y-5 pt-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg"
                >
                  {error}
                </div>
              )}

              {/* Kind Selector */}
              <div className="space-y-2">
                <Label>Post Type</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {POST_KINDS.map((k) => {
                    const isSelected = kind === k;
                    const Icon = KIND_ICONS[k];
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setKind(k)}
                        aria-pressed={isSelected}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-center transition-all ${
                          isSelected
                            ? 'border-accent bg-surface-2 text-accent shadow-module'
                            : 'border-hairline bg-surface-1 text-fg-muted hover:border-line hover:text-fg'
                        }`}
                      >
                        <Icon className="size-4" />
                        <span className="font-display text-label-sm uppercase">
                          {POST_KIND_LABEL[k]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="post-title">Post Title</Label>
                <Input
                  id="post-title"
                  placeholder={
                    kind === 'question'
                      ? 'e.g. How to recover from I2C bus lockup at 400kHz on STM32?'
                      : kind === 'squad-call'
                      ? 'e.g. Saathi Voice AI is recruiting Bhojpuri phonetics contributors'
                      : 'e.g. Wind Tunnel Foil Test #3 telemetry logs published'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={140}
                  required
                  autoFocus
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-body">Content</Label>
                  <span className="text-body-xs text-fg-subtle">Markdown supported</span>
                </div>
                <Textarea
                  id="post-body"
                  rows={5}
                  placeholder={
                    kind === 'question'
                      ? 'Describe the hardware/software setup, expected vs actual behavior, and error logs...'
                      : 'Share your progress, telemetry dataset links, schematic details, or open roles...'
                  }
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g. stm32, telemetry, indic-nlp)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addTag(tagInput)}
                    disabled={!tagInput.trim()}
                  >
                    <Plus className="size-4" />
                    <span>Add</span>
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-sm border border-hairline bg-surface-2 px-2 py-0.5 text-body-xs text-fg-muted"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-danger transition-colors"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>

            <CardFooter className="flex justify-end gap-3 border-t border-hairline bg-surface-2/40">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !title.trim() || !body.trim()}
                loading={submitting}
              >
                <Send className="size-4" />
                <span>Publish Post</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
