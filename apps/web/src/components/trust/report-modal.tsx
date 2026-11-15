'use client';

import { useState } from 'react';
import { Button, Textarea } from '@hackerland/ui';
import { AlertTriangle, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import type { ReportReason, ReportTargetType } from '@/lib/data/types';

export const REASON_OPTIONS: { value: ReportReason; label: string; description: string }[] = [
  {
    value: 'spam',
    label: 'Spam & Automated Slop',
    description: 'Unsolicited promotions, repetitive AI-generated spam, or deceptive links.',
  },
  {
    value: 'malicious_code',
    label: 'Malicious Firmware / Code',
    description: 'Hardware bricking payloads, backdoor exploits, or unverified binary risks.',
  },
  {
    value: 'harassment',
    label: 'Harassment & Abuse',
    description: 'Targeted hostility, hate speech, bullying, or intimidation of contributors.',
  },
  {
    value: 'scam',
    label: 'Fraud & Financial Scam',
    description: 'Escrow evasion, fake hardware bounties, or fraudulent milestone claims.',
  },
  {
    value: 'child_safety',
    label: 'DPDP & Child Safety',
    description: 'Non-consensual profiling, privacy violation, or endangerment of student prodigies.',
  },
  {
    value: 'other',
    label: 'Other Policy Concern',
    description: 'Any violation of Hackerland engineering safety and community standards.',
  },
];

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
  onSuccess?: () => void;
}

export function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  onSuccess,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          details: details.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to report this content.');
        }
        throw new Error(data.message || data.error || 'Failed to submit report.');
      }

      setIsSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        setIsSuccess(false);
        setDetails('');
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg rounded-xl border border-hairline bg-surface-1 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-danger/30 bg-danger/10 text-danger-fg">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="report-modal-title" className="font-display text-headline-sm font-semibold text-fg">
                Report Content
              </h2>
              <p className="text-body-xs text-fg-muted">
                Reporting {targetType}{targetTitle ? `: "${targetTitle}"` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-fg-subtle hover:bg-surface-2 hover:text-fg transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
            <h3 className="font-display text-headline-sm font-semibold text-fg">
              Report Submitted
            </h3>
            <p className="text-body-sm text-fg-muted max-w-sm mx-auto">
              Thank you for keeping Hackerland safe. Our Trust & Safety team has queued this item for priority triage.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-body-sm text-danger-fg"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-label-sm font-display font-medium text-fg">
                Reason for report
              </label>
              <div className="grid grid-cols-1 gap-2">
                {REASON_OPTIONS.map((opt) => {
                  const isSelected = reason === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent/10 text-fg'
                          : 'border-hairline bg-surface-2/40 text-fg-muted hover:border-line hover:text-fg'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => setReason(opt.value)}
                        className="mt-1 h-4 w-4 accent-accent"
                      />
                      <div className="space-y-0.5 text-left">
                        <div className="font-display text-body-sm font-medium text-fg">
                          {opt.label}
                        </div>
                        <div className="text-body-xs text-fg-subtle">
                          {opt.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <label htmlFor="report-details" className="text-label-sm font-display font-medium text-fg">
                Additional Details (Optional)
              </label>
              <Textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any relevant context, logs, repository links, or timestamp..."
                rows={3}
                className="w-full text-body-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Submit Report'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
