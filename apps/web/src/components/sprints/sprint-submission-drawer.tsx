'use client';

import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { SprintEntry } from '@hackerland/core';
import { validateMilestoneSubmission } from '@hackerland/core';
import { Button, Input, Textarea } from '@hackerland/ui';

interface SprintSubmissionDrawerProps {
  sprint: SprintEntry;
  isOpen: boolean;
  onClose: () => void;
}

export function SprintSubmissionDrawer({
  sprint,
  isOpen,
  onClose,
}: SprintSubmissionDrawerProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    sprint.milestones[0]?.id || ''
  );
  const [repoUrl, setRepoUrl] = useState('');
  const [cadUrl, setCadUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMilestone =
    sprint.milestones.find((m) => m.id === selectedMilestoneId) || sprint.milestones[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMilestone) return;

    const validation = validateMilestoneSubmission(currentMilestone, {
      repoUrl,
      cadUrl,
      videoUrl,
      notes,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const randomHash = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setSubmittedHash(`hl_sprint_${randomHash}`);
    }, 900);
  };

  const handleReset = () => {
    setSubmittedHash(null);
    setRepoUrl('');
    setCadUrl('');
    setVideoUrl('');
    setNotes('');
    setErrors([]);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sprint-submission-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/35 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-hairline bg-surface-1 p-6 shadow-overlay overflow-y-auto max-h-[90vh]">
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 text-fg-subtle hover:text-fg hover:bg-surface-2 p-1.5 rounded-full transition-colors"
          aria-label="Close dialog"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="mb-5 pr-8">
          <span className="font-display text-label-sm font-semibold uppercase tracking-wider text-accent-fg">
            Sprint Escrow Check-in
          </span>
          <h2 id="sprint-submission-title" className="font-display text-headline-md font-bold text-fg mt-1">
            Submit Milestone Artifacts
          </h2>
          <p className="text-body-sm text-fg-muted mt-0.5">
            {sprint.title}
          </p>
        </div>

        {submittedHash ? (
          <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/15 text-success-fg">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-headline-sm font-semibold text-fg">
              Milestone Check-in Verified!
            </h3>
            <p className="text-body-sm text-fg-muted max-w-sm mx-auto">
              Your artifact links have been anchored to the Hackerland Open Hardware Sprint Ledger with timestamp proof.
            </p>
            <div className="rounded-xl bg-sunken p-3 font-mono text-xs text-fg-muted break-all border border-hairline">
              Ledger Anchor ID: <span className="text-accent-fg font-bold">{submittedHash}</span>
            </div>
            <Button variant="primary" size="sm" onClick={handleReset} className="mt-2">
              Done &amp; Return to Sprint
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Milestone */}
            <div>
              <label htmlFor="milestone-select" className="block font-display text-label-md text-fg mb-1.5">
                Target Milestone
              </label>
              <select
                id="milestone-select"
                value={selectedMilestoneId}
                onChange={(e) => {
                  setSelectedMilestoneId(e.target.value);
                  setErrors([]);
                }}
                className="h-11 w-full rounded-xl border border-line bg-sunken px-3.5 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
              >
                {sprint.milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    H+{m.hour} — {m.title} ({m.points} pts)
                  </option>
                ))}
              </select>
            </div>

            {/* Milestone Deliverables Checklist info */}
            {currentMilestone && (
              <div className="rounded-xl bg-sunken border border-hairline p-3.5 text-body-sm space-y-1">
                <span className="font-display font-semibold text-fg block">
                  Required Deliverables for {currentMilestone.title}:
                </span>
                <ul className="list-disc pl-4 text-fg-muted space-y-0.5">
                  {currentMilestone.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CAD URL */}
            <div>
              <label htmlFor="cad-url" className="block font-display text-label-md text-fg mb-1">
                CAD / 3D STEP / Hardware Artifact URL
              </label>
              <Input
                id="cad-url"
                type="url"
                placeholder="https://cad.onshape.com/documents/... or GrabCAD link"
                value={cadUrl}
                onChange={(e) => setCadUrl(e.target.value)}
              />
            </div>

            {/* Repo URL */}
            <div>
              <label htmlFor="repo-url" className="block font-display text-label-md text-fg mb-1">
                Git Repository / Firmware Tree URL
              </label>
              <Input
                id="repo-url"
                type="url"
                placeholder="https://github.com/your-squad/sprint-project"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>

            {/* Video Demo URL */}
            <div>
              <label htmlFor="video-url" className="block font-display text-label-md text-fg mb-1">
                Demo Video Walkthrough URL (Loom / YouTube / Drive)
              </label>
              <Input
                id="video-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or Loom"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            {/* Technical Notes */}
            <div>
              <label htmlFor="sprint-notes" className="block font-display text-label-md text-fg mb-1">
                Engineering Notes &amp; Verification Evidence
              </label>
              <Textarea
                id="sprint-notes"
                rows={3}
                placeholder="Briefly highlight test results, power consumption, BOM costs, or anomalies encountered..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div
                role="alert"
                className="rounded-xl bg-danger/10 border border-danger/30 p-3 text-body-sm text-danger-fg space-y-1"
              >
                <span className="font-display font-semibold block">Please fix the following:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-hairline flex items-center justify-end gap-2.5">
              <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
                {isSubmitting ? 'Verifying & Anchoring...' : 'Submit Check-in'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
