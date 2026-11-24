'use client';

import { useEffect, useState } from 'react';
import type { SprintEntry } from '@hackerland/core';
import { calculateSprintProgress } from '@hackerland/core';
import { useIsClient } from '@/lib/hooks/use-is-client';

interface SprintCountdownTimerProps {
  sprint: SprintEntry;
}

export function SprintCountdownTimer({ sprint }: SprintCountdownTimerProps) {
  const mounted = useIsClient();
  const [progress, setProgress] = useState(() => calculateSprintProgress(sprint));

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(calculateSprintProgress(sprint));
    }, 15000); // refresh every 15s

    return () => clearInterval(interval);
  }, [sprint]);

  const hoursRemaining = Math.floor(progress.timeRemainingMinutes / 60);
  const minsRemaining = progress.timeRemainingMinutes % 60;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-6 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sprint Timeline Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                sprint.currentStatus === 'active'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : sprint.currentStatus === 'upcoming'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  sprint.currentStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
                }`}
              />
              {sprint.currentStatus.toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-foreground">
              {sprint.durationHours} Hours Total
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Time Remaining
          </span>
          <div className="text-xl font-mono font-bold text-foreground mt-0.5">
            {mounted ? (
              progress.isCompleted ? (
                <span className="text-muted-foreground">Sprint Concluded</span>
              ) : (
                <span>
                  {hoursRemaining}h {minsRemaining}m
                </span>
              )
            ) : (
              <span>--:--</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-mono">
          <span>Elapsed: Hour {progress.currentHour} / {sprint.durationHours}</span>
          <span>{progress.progressPercent}% Complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step Milestones Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {sprint.milestones.map((m, idx) => {
          const isPassed = progress.currentHour >= m.hour;
          const isActive = idx === progress.activeMilestoneIndex && sprint.currentStatus === 'active';

          return (
            <div
              key={m.id}
              className={`p-3 rounded-lg border text-left transition-colors ${
                isActive
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                  : isPassed
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-border/60 bg-muted/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-foreground">H+{m.hour}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isPassed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isActive
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isPassed ? 'Passed' : isActive ? 'Current' : 'Upcoming'}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground line-clamp-1">{m.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{m.points} pts</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
