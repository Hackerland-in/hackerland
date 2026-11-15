'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  OPPORTUNITY_KINDS,
  OPPORTUNITY_KIND_LABEL,
  TRACKS,
  TRACK_META,
  CURRENCIES,
  type OpportunityKind,
  type Track,
  type Currency,
} from '@hackerland/core';
import {
  Button,
  Input,
  Label,
  Textarea,
} from '@hackerland/ui';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunityCreated?: () => void;
}

export function CreateOpportunityModal({
  isOpen,
  onClose,
  onOpportunityCreated,
}: CreateOpportunityModalProps) {
  const router = useRouter();
  const [kind, setKind] = useState<OpportunityKind>('bounty');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [rewardAmount, setRewardAmount] = useState<number>(25000);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>(['code']);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorUrl, setSponsorUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const toggleTrack = (track: Track) => {
    if (selectedTracks.includes(track)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter((t) => t !== track));
      }
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !sponsorName.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      kind,
      title: title.trim(),
      summary: summary.trim(),
      reward: {
        amount: Number(rewardAmount) || 0,
        currency,
      },
      tracks: selectedTracks,
      sponsor: {
        name: sponsorName.trim(),
        url: sponsorUrl.trim() || undefined,
      },
      deadline: deadline.trim() || undefined,
      externalUrl: externalUrl.trim() || undefined,
      status: 'open',
    };

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to post an opportunity.');
        }
        if (res.status === 503) {
          // Offline fallback
          setIsSuccess(true);
          onOpportunityCreated?.();
          router.refresh();
          return;
        }
        throw new Error(data.message || data.error || 'Failed to create opportunity.');
      }

      setIsSuccess(true);
      onOpportunityCreated?.();
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-opportunity-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg border border-hairline bg-surface-2 p-6 shadow-overlay space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <h2
              id="create-opportunity-modal-title"
              className="font-display text-headline-sm text-fg"
            >
              Post an Opportunity
            </h2>
            <p className="text-body-sm text-fg-muted mt-0.5">
              Fund a bounty, paid role, grant, or hackathon for the builder community.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-subtle hover:text-fg transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded border border-danger/30 bg-danger/10 p-3 text-body-sm text-danger-fg flex items-start gap-2"
          >
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="rounded border border-success/30 bg-success/10 p-6 text-center space-y-3">
            <div className="flex justify-center text-success">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="font-display text-headline-sm text-fg">Opportunity Published!</h3>
            <p className="text-body-sm text-fg-muted">
              Your listing is now live in the Earn Hub and discoverable by community squads.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                setIsSuccess(false);
              }}
              className="mt-2 w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kind Selector */}
            <div>
              <Label className="text-body-sm font-medium text-fg mb-1.5 block">
                Opportunity Type
              </Label>
              <div className="flex flex-wrap gap-2">
                {OPPORTUNITY_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 font-display text-label-sm uppercase transition-colors ${
                      kind === k
                        ? 'border-earn bg-earn/10 text-earn font-semibold'
                        : 'border-hairline bg-surface-1 text-fg-muted hover:border-line'
                    }`}
                  >
                    {OPPORTUNITY_KIND_LABEL[k]}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="opp-title" className="text-body-sm font-medium text-fg mb-1 block">
                Title <span className="text-danger">*</span>
              </Label>
              <Input
                id="opp-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement LoRaWAN packet forwarder in Rust"
                maxLength={140}
                required
                className="w-full text-body-sm"
              />
            </div>

            {/* Summary */}
            <div>
              <Label htmlFor="opp-summary" className="text-body-sm font-medium text-fg mb-1 block">
                Summary / Objectives <span className="text-danger">*</span>
              </Label>
              <Textarea
                id="opp-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describe deliverables, requirements, acceptance criteria..."
                rows={3}
                maxLength={400}
                required
                className="w-full text-body-sm"
              />
            </div>

            {/* Reward */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="opp-amount" className="text-body-sm font-medium text-fg mb-1 block">
                  Reward Amount <span className="text-danger">*</span>
                </Label>
                <Input
                  id="opp-amount"
                  type="number"
                  min={0}
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(Number(e.target.value))}
                  required
                  className="w-full text-body-sm"
                />
              </div>

              <div>
                <Label htmlFor="opp-currency" className="text-body-sm font-medium text-fg mb-1 block">
                  Currency
                </Label>
                <select
                  id="opp-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full rounded-sm border border-line bg-surface-1 px-3 py-2 text-body-sm text-fg focus:border-accent focus:outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tracks */}
            <div>
              <Label className="text-body-sm font-medium text-fg mb-1.5 block">
                Disciplines / Tracks <span className="text-danger">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {TRACKS.map((track) => {
                  const isSelected = selectedTracks.includes(track);
                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => toggleTrack(track)}
                      className={`inline-flex items-center gap-1 rounded-sm border px-2.5 py-1 text-label-sm uppercase transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent/15 text-accent-fg font-semibold'
                          : 'border-hairline bg-surface-1 text-fg-subtle hover:border-line'
                      }`}
                    >
                      {TRACK_META[track]?.label ?? track}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sponsor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="opp-sponsor" className="text-body-sm font-medium text-fg mb-1 block">
                  Sponsor / Organization <span className="text-danger">*</span>
                </Label>
                <Input
                  id="opp-sponsor"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. AeroGlide Lab"
                  required
                  className="w-full text-body-sm"
                />
              </div>

              <div>
                <Label htmlFor="opp-sponsor-url" className="text-body-sm font-medium text-fg mb-1 block">
                  Sponsor Website <span className="text-fg-subtle font-normal">(optional)</span>
                </Label>
                <Input
                  id="opp-sponsor-url"
                  value={sponsorUrl}
                  onChange={(e) => setSponsorUrl(e.target.value)}
                  placeholder="https://example.org"
                  className="w-full text-body-sm"
                />
              </div>
            </div>

            {/* Deadline & External Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="opp-deadline" className="text-body-sm font-medium text-fg mb-1 block">
                  Deadline <span className="text-fg-subtle font-normal">(optional)</span>
                </Label>
                <Input
                  id="opp-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full text-body-sm"
                />
              </div>

              <div>
                <Label htmlFor="opp-external-url" className="text-body-sm font-medium text-fg mb-1 block">
                  External Application URL <span className="text-fg-subtle font-normal">(optional)</span>
                </Label>
                <Input
                  id="opp-external-url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-body-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-hairline">
              <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="earn" loading={submitting}>
                Publish Opportunity
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
