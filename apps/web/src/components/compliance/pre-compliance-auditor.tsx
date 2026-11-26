'use client';

import { useState } from 'react';
import { Badge, Card, ProgressBar, cn } from '@hackerland/ui';
import type { PreComplianceChecklistTask } from '@hackerland/core';
import { evaluatePreComplianceReadiness } from '@hackerland/core';

interface PreComplianceAuditorProps {
  tasks: PreComplianceChecklistTask[];
  title?: string;
}

export function PreComplianceAuditor({
  tasks,
  title = 'Pre-Compliance Test Readiness Audit',
}: PreComplianceAuditorProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleTask = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const audit = evaluatePreComplianceReadiness(checkedIds, tasks);

  const badgeTone: 'success' | 'warning' | 'danger' =
    audit.status === 'lab_ready'
      ? 'success'
      : audit.status === 'moderate_risk'
        ? 'warning'
        : 'danger';

  const statusText =
    audit.status === 'lab_ready'
      ? `LAB READY (${audit.readinessScore}%) ✓`
      : audit.status === 'moderate_risk'
        ? `MODERATE RISK (${audit.readinessScore}%) ⚠`
        : `HIGH RISK OF FAILURE (${audit.readinessScore}%) ✖`;

  return (
    <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent shrink-0" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">{title}</h3>
          </div>
          <p className="text-body-xs text-fg-muted mt-0.5">
            Self-audit bench checks before booking NABL testing chambers
          </p>
        </div>

        <Badge tone={badgeTone} variant="outline">{statusText}</Badge>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-body-xs font-mono text-fg-muted">
          <span>Readiness Score</span>
          <span>
            {audit.completedCount} of {audit.totalCount} Checks Verified
          </span>
        </div>
        <ProgressBar value={audit.readinessScore} tone="accent" label="Readiness score" />
      </div>

      {audit.criticalMissing.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-xs font-mono text-danger-fg space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <span>⚠</span>
            <span>{audit.criticalMissing.length} Critical Pre-Test Requirements Missing:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] font-sans text-fg pl-1">
            {audit.criticalMissing.map((cm) => (
              <li key={cm.id}>{cm.task}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {tasks.map((task) => {
          const isChecked = checkedIds.includes(task.id);
          return (
            <div
              key={task.id}
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName !== 'INPUT') {
                  toggleTask(task.id);
                }
              }}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all select-none',
                isChecked
                  ? 'border-success/40 bg-success/5'
                  : 'border-hairline bg-sunken/70 hover:border-accent/40',
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleTask(task.id)}
                className="mt-0.5 size-4 rounded border-line accent-accent cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'text-body-xs font-mono font-semibold',
                      isChecked ? 'text-fg-subtle line-through' : 'text-fg',
                    )}
                  >
                    {task.task}
                  </span>
                  {task.critical && (
                    <Badge tone="danger" variant="outline">Critical</Badge>
                  )}
                </div>
                <p className="text-[11px] text-fg-muted font-sans leading-relaxed">
                  Tip: {task.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
