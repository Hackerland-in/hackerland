'use client';

import { useState } from 'react';
import type { SprintEntry } from '@hackerland/core';
import { validateMilestoneSubmission } from '@hackerland/core';

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
      // Generate a mock SHA-256 commit verification hash
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 text-sm rounded-lg"
          aria-label="Close dialog"
        >
          ✕
        </button>

        <div className="mb-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            Sprint Escrow Check-in
          </span>
          <h2 className="text-xl font-bold text-foreground mt-1">
            Submit Milestone Artifacts
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sprint.title}
          </p>
        </div>

        {submittedHash ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xl font-bold">
              ✓
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Milestone Check-in Verified!
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your artifact links have been anchored to the Hackerland Open Hardware Sprint Ledger with timestamp proof.
            </p>
            <div className="rounded bg-background/80 p-2.5 font-mono text-xs text-muted-foreground break-all border border-border">
              Ledger Anchor ID: <span className="text-primary font-bold">{submittedHash}</span>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Done & Return to Sprint
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Milestone */}
            <div>
              <label htmlFor="milestone-select" className="block text-xs font-semibold text-foreground mb-1.5">
                Target Milestone
              </label>
              <select
                id="milestone-select"
                value={selectedMilestoneId}
                onChange={(e) => {
                  setSelectedMilestoneId(e.target.value);
                  setErrors([]);
                }}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
              <div className="rounded-lg bg-muted/30 border border-border/60 p-3 text-xs space-y-1">
                <span className="font-semibold text-foreground block">
                  Required Deliverables for {currentMilestone.title}:
                </span>
                <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                  {currentMilestone.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CAD URL */}
            <div>
              <label htmlFor="cad-url" className="block text-xs font-medium text-foreground mb-1">
                CAD / 3D STEP / Hardware Artifact URL
              </label>
              <input
                id="cad-url"
                type="url"
                placeholder="https://cad.onshape.com/documents/... or GrabCAD link"
                value={cadUrl}
                onChange={(e) => setCadUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Repo URL */}
            <div>
              <label htmlFor="repo-url" className="block text-xs font-medium text-foreground mb-1">
                Git Repository / Firmware Tree URL
              </label>
              <input
                id="repo-url"
                type="url"
                placeholder="https://github.com/your-squad/sprint-project"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Video Demo URL */}
            <div>
              <label htmlFor="video-url" className="block text-xs font-medium text-foreground mb-1">
                Demo Video Walkthrough URL (Loom / YouTube / Drive)
              </label>
              <input
                id="video-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or Loom"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Technical Notes */}
            <div>
              <label htmlFor="sprint-notes" className="block text-xs font-medium text-foreground mb-1">
                Engineering Notes & Verification Evidence
              </label>
              <textarea
                id="sprint-notes"
                rows={3}
                placeholder="Briefly highlight test results, power consumption, BOM costs, or anomalies encountered..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive space-y-1">
                <span className="font-semibold block">Please fix the following:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying & Anchoring...' : 'Submit Check-in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
