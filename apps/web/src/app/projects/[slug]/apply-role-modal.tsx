'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { OpenRole } from '@/lib/data/types';
import { Badge, Button, Input, Textarea } from '@hackerland/ui';
import { TRACK_META } from '@hackerland/core';
import { formatRoleCompensation } from '@/components/domain/role-card';
import { X, CheckCircle2 } from 'lucide-react';

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
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!role || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const fullNote = portfolioUrl.trim()
        ? `${note.trim()}\n\nPortfolio / Proof of Work: ${portfolioUrl.trim()}`
        : note.trim();

      const res = await fetch(`/api/projects/${slug}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: role.title,
          note: fullNote,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to apply for this squad role.');
        }
        if (res.status === 409) {
          throw new Error('You have already applied for this position.');
        }
        if (res.status === 503) {
          setIsSuccess(true);
          onSuccess?.();
          return;
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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-role-modal-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-fg/35 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface-1 p-6 shadow-overlay space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
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
              className="font-display text-headline-sm font-bold text-fg break-words"
            >
              Join squad as {role.title}
            </h2>
            {role.description ? (
              <p className="mt-1 text-body-sm text-fg-muted break-words">
                {role.description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
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
            className="rounded-2xl border border-success/30 bg-success/8 p-5 text-body-sm text-success-fg space-y-3"
          >
            <div className="flex items-center gap-2 font-display font-bold text-body-md">
              <CheckCircle2 className="size-5 text-success" />
              <span>Application sent to the squad!</span>
            </div>
            <p className="text-fg-muted">
              The project leads have received your note. Check your activity bell for updates once they respond.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mt-2 w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="apply-portfolio-input"
                className="block font-display text-label-md text-fg"
              >
                GitHub, portfolio, or build link (optional)
              </label>
              <Input
                id="apply-portfolio-input"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/your-handle or demo URL"
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="apply-note-input"
                className="block font-display text-label-md text-fg"
              >
                Say hello &amp; share how you can help (optional)
              </label>
              <Textarea
                id="apply-note-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your background, past builds, or tools you enjoy working with..."
                rows={4}
                className="w-full text-body-sm"
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit application'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
