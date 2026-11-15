'use client';

import { useState } from 'react';
import type { OpenRole } from '@/lib/data/types';
import { Badge, Button, Textarea } from '@hackerland/ui';
import { TRACK_META } from '@hackerland/core';
import { formatRoleCompensation } from '@/components/domain/role-card';

export interface ApplyRoleModalProps {
  slug: string;
  role: OpenRole | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApplyRoleModal({
  slug,
  role,
  onClose,
  onSuccess,
}: ApplyRoleModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!role) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${slug}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: role.title,
          note: note.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to apply for this squad role.');
        }
        if (res.status === 409) {
          throw new Error('You have already applied for this position.');
        }
        if (res.status === 503) {
          throw new Error('Database is not configured on this deployment yet.');
        }
        throw new Error(data.message || data.error || 'Failed to submit application.');
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
      aria-labelledby="apply-role-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg rounded-lg border border-hairline bg-surface-2 p-6 shadow-overlay space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge tone={role.track} variant="outline">
              {TRACK_META[role.track]?.label ?? role.track}
            </Badge>
            <Badge tone="earn" variant="solid">
              {formatRoleCompensation(role.compensation)}
            </Badge>
          </div>
          <h2
            id="apply-role-modal-title"
            className="font-display text-headline-sm text-fg break-words"
          >
            Apply for {role.title}
          </h2>
          {role.description ? (
            <p className="mt-1 text-body-sm text-fg-muted break-words">
              {role.description}
            </p>
          ) : null}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg break-words"
          >
            {error}
          </div>
        )}

        {isSuccess ? (
          <div
            role="status"
            className="rounded-md border border-success/40 bg-success/10 p-4 text-body-sm text-success-fg space-y-2"
          >
            <p className="font-semibold">Application submitted successfully!</p>
            <p className="text-fg-muted">
              The project leads have received your submission and will review it for this squad role.
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
                htmlFor="apply-note-input"
                className="block font-display text-label-md text-fg"
              >
                Why do you want to join this squad? (optional)
              </label>
              <Textarea
                id="apply-note-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your experience, relevant repositories, availability, or how you plan to contribute..."
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-hairline">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit application'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
