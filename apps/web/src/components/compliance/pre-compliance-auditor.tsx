'use client';

import { useState } from 'react';
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

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-stone-400">
            Self-audit bench checks before booking expensive NABL laboratory testing chambers
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {audit.status === 'lab_ready' ? (
            <span className="rounded-xl border border-emerald-500/50 bg-emerald-950/40 px-3 py-1 text-xs font-mono font-bold text-emerald-300">
              LAB READY ({audit.readinessScore}%) ✓
            </span>
          ) : audit.status === 'moderate_risk' ? (
            <span className="rounded-xl border border-amber-500/50 bg-amber-950/40 px-3 py-1 text-xs font-mono font-bold text-amber-300">
              MODERATE RISK ({audit.readinessScore}%) ⚠
            </span>
          ) : (
            <span className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-1 text-xs font-mono font-bold text-red-300 animate-pulse">
              HIGH RISK OF FAILURE ({audit.readinessScore}%) ✖
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono text-stone-400">
          <span>Readiness Score</span>
          <span>
            {audit.completedCount} of {audit.totalCount} Checks Verified
          </span>
        </div>
        <div className="h-2.5 w-full bg-stone-900 rounded-full overflow-hidden border border-stone-800">
          <div
            className={`h-full transition-all duration-300 ${
              audit.status === 'lab_ready'
                ? 'bg-emerald-500'
                : audit.status === 'moderate_risk'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${audit.readinessScore}%` }}
          />
        </div>
      </div>

      {/* Critical Missing Warning Notice */}
      {audit.criticalMissing.length > 0 && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-3 text-xs font-mono text-red-300 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <span>⚠</span>
            <span>{audit.criticalMissing.length} Critical Pre-Test Requirements Missing:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90 pl-1">
            {audit.criticalMissing.map((cm) => (
              <li key={cm.id}>{cm.task}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Task Checklist Items */}
      <div className="space-y-2.5">
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
              className={`flex cursor-pointer items-start space-x-3 rounded-xl border p-3 transition-all select-none ${
                isChecked
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleTask(task.id)}
                className="mt-0.5 h-4 w-4 rounded border-stone-700 bg-stone-900 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-mono font-medium ${
                      isChecked ? 'text-white line-through opacity-70' : 'text-stone-200'
                    }`}
                  >
                    {task.task}
                  </span>
                  {task.critical && (
                    <span className="rounded bg-red-950/80 border border-red-500/40 px-1.5 py-0.2 text-[9px] font-mono text-red-300 uppercase">
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 font-mono leading-relaxed">
                  Tip: {task.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
