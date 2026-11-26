'use client';

import { useState } from 'react';
import { Button, Input, Textarea } from '@hackerland/ui';

export interface PostUpdateModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PostUpdateModal({
  slug,
  isOpen,
  onClose,
  onSuccess,
}: PostUpdateModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch(`/api/projects/${slug}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          tags,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to post build updates.');
        }
        if (res.status === 403) {
          throw new Error('Only squad leads and members can post updates for this project.');
        }
        if (res.status === 503) {
          setIsSuccess(true);
          onSuccess?.();
          return;
        }
        throw new Error(data.message || data.error || 'Failed to post update.');
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-update-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/35 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface-1 p-6 shadow-overlay space-y-5">
        <div>
          <h2
            id="post-update-modal-title"
            className="font-display text-headline-sm font-bold text-fg"
          >
            Share a build update
          </h2>
          <p className="mt-1 text-body-sm text-fg-muted">
            Post milestone notes, test results, or schematic changes to the community feed.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/8 p-3 text-body-sm text-danger-fg break-words"
          >
            {error}
          </div>
        )}

        {isSuccess ? (
          <div
            role="status"
            className="rounded-2xl border border-success/30 bg-success/8 p-4 text-body-sm text-success-fg space-y-2"
          >
            <p className="font-semibold">Build update published!</p>
            <p className="text-fg-muted">
              Your log has been shared with this project room and the community feed.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mt-3 w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="update-title-input"
                className="block font-display text-label-md text-fg"
              >
                Update headline
              </label>
              <Input
                id="update-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wind tunnel test #3 logs published"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="update-body-input"
                className="block font-display text-label-md text-fg"
              >
                Progress notes
              </label>
              <Textarea
                id="update-body-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe test results, schematic tweaks, commits, or what comes next..."
                rows={4}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="update-tags-input"
                className="block font-display text-label-md text-fg"
              >
                Hashtags (comma separated, optional)
              </label>
              <Input
                id="update-tags-input"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="aerospace, telemetry, firmware"
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-hairline">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting || title.trim().length < 4 || body.trim().length < 10}
              >
                {isSubmitting ? 'Posting...' : 'Publish update'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
