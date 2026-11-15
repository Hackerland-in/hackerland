'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import { CheckCircle2, Circle, Wrench, ShieldCheck, Award } from 'lucide-react';
import type { ManufacturingPillar } from './manufacturing-data';

export interface InteractiveLabProps {
  pillar: ManufacturingPillar;
}

export function InteractiveLab({ pillar }: InteractiveLabProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const lab = pillar.labChallenge;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
      }
      return next;
    });
  };

  const isAllComplete = lab.steps.every((s) => completedSteps.has(s.number));

  return (
    <div className="space-y-4 rounded-lg border border-accent/20 bg-surface-1 p-5 shadow-sm" data-testid="interactive-lab">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="size-4 text-accent" />
            <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
              Interactive Lab Challenge
            </span>
          </div>
          <h3 className="font-display text-headline-sm font-semibold text-fg">{lab.title}</h3>
        </div>

        {isAllComplete ? (
          <Badge tone="success" variant="solid" className="text-body-xs">
            <Award className="size-3.5 mr-1" /> Lab Certified
          </Badge>
        ) : (
          <Badge tone="neutral" variant="outline" className="text-body-xs">
            {completedSteps.size} of {lab.steps.length} Steps Validated
          </Badge>
        )}
      </div>

      <p className="text-body-sm text-fg-muted">{lab.goal}</p>

      {/* Prerequisites */}
      <div className="rounded border border-hairline bg-surface-2 p-3 space-y-1.5">
        <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider">
          Prerequisites & Environment Setup:
        </span>
        <ul className="flex flex-wrap gap-2 text-caption text-fg-muted">
          {lab.prerequisites.map((p, idx) => (
            <li key={idx} className="flex items-center gap-1.5 bg-surface-1 px-2.5 py-1 rounded border border-hairline">
              <ShieldCheck className="size-3 text-accent" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5 pt-2">
        <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider block">
          Lab Execution Checkpoints:
        </span>
        {lab.steps.map((step) => {
          const isDone = completedSteps.has(step.number);
          return (
            <div
              key={step.number}
              onClick={() => toggleStep(step.number)}
              className={`flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-all ${
                isDone
                  ? 'border-success/40 bg-success/5 text-fg'
                  : 'border-hairline bg-surface-2 hover:border-hairline-strong'
              }`}
            >
              <button
                type="button"
                aria-label={`Toggle step ${step.number}`}
                className="mt-0.5 shrink-0 text-success transition-transform active:scale-90"
              >
                {isDone ? (
                  <CheckCircle2 className="size-5 fill-success text-canvas" />
                ) : (
                  <Circle className="size-5 text-fg-subtle" />
                )}
              </button>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-body-sm font-semibold text-fg">
                    Step {step.number}: {step.task}
                  </span>
                  {isDone && (
                    <Badge tone="success" variant="solid" className="text-[10px]">
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-caption text-fg-subtle font-mono">
                  Verification criteria: {step.verification}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isAllComplete && (
        <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-center space-y-2 animate-in fade-in">
          <div className="flex justify-center text-success">
            <Award className="size-8" />
          </div>
          <h4 className="font-display text-body-lg font-bold text-fg">
            Congratulations! You have completed the {pillar.title} Lab!
          </h4>
          <p className="text-body-sm text-fg-muted max-w-xl mx-auto">
            Your verification hash has been stamped into your Hackerland builder ledger. You are now ready to dispatch fabrication jobs to verified ATL Lab Nodes.
          </p>
        </div>
      )}
    </div>
  );
}
