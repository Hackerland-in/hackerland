'use client';

import { useState } from 'react';
import { Badge } from '@hackerland/ui';
import { Layers } from 'lucide-react';
import { MANUFACTURING_LIFECYCLE_STAGES } from './manufacturing-data';

export function ManufacturingLifecyclePipeline() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const stages = MANUFACTURING_LIFECYCLE_STAGES;
  const current = stages.find((s) => s.step === activeStep) ?? stages[0];

  return (
    <div className="space-y-6 rounded-lg border border-hairline bg-surface-1 p-6 shadow-sm" data-testid="lifecycle-pipeline">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="size-4 text-accent" />
          <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
            End-to-End Cyber-Physical Pipeline
          </span>
        </div>
        <h3 className="font-display text-headline-sm font-semibold text-fg">
          From Concept to Mass-Market Certified Hardware
        </h3>
        <p className="text-body-sm text-fg-muted mt-1 max-w-2xl">
          The 7-stage Indian deep-tech manufacturing protocol ensuring your physical designs withstand rigorous statutory scrutiny, thermal cycling, and field deployment.
        </p>
      </div>

      {/* Stepper Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-hairline scrollbar-thin">
        {stages.map((st) => {
          const isSelected = st.step === activeStep;
          return (
            <button
              key={st.step}
              type="button"
              onClick={() => setActiveStep(st.step)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-body-sm font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'border-accent bg-accent/15 text-accent font-semibold shadow-sm'
                  : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
              }`}
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-surface-1 text-caption font-mono">
                {st.step}
              </span>
              <span>{st.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Breakdown */}
      {current && (
        <div className="rounded-lg border border-hairline bg-surface-2 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-body-sm text-accent font-bold">Stage 0{current.step}:</span>
              <h4 className="font-display text-body-lg font-semibold text-fg">{current.title}</h4>
            </div>
            <Badge tone="accent" variant="solid" className="text-caption">
              Active Stage
            </Badge>
          </div>

          <p className="text-body-md text-fg-muted leading-relaxed">{current.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded border border-hairline bg-surface-1 p-3.5 space-y-1">
              <span className="text-caption font-semibold uppercase tracking-wider text-fg-subtle">
                Governing Standards & Protocols:
              </span>
              <p className="font-mono text-body-sm font-semibold text-fg">{current.standards}</p>
            </div>

            <div className="rounded border border-hairline bg-surface-1 p-3.5 space-y-1">
              <span className="text-caption font-semibold uppercase tracking-wider text-fg-subtle">
                Recommended Tooling & Software:
              </span>
              <p className="font-mono text-body-sm font-semibold text-fg">{current.typicalTools}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
