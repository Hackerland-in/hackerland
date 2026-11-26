'use client';

import { useEffect, useState } from 'react';
import type { SprintEntry } from '@hackerland/core';
import { calculateSprintProgress } from '@hackerland/core';
import { Badge, Card, CardBody, ProgressBar, cn } from '@hackerland/ui';

interface SprintCountdownTimerProps {
  sprint: SprintEntry;
}

export function SprintCountdownTimer({ sprint }: SprintCountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(() => calculateSprintProgress(sprint));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress(calculateSprintProgress(sprint));
    }, 15000);

    return () => clearInterval(interval);
  }, [sprint]);

  const hoursRemaining = Math.floor(progress.timeRemainingMinutes / 60);
  const minsRemaining = progress.timeRemainingMinutes % 60;

  return (
    <Card>
      <CardBody className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
          <div className="space-y-1">
            <span className="font-display text-label-sm uppercase tracking-wider text-fg-subtle block">
              Sprint Timeline Status
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                tone={
                  sprint.currentStatus === 'active'
                    ? 'success'
                    : sprint.currentStatus === 'upcoming'
                    ? 'warning'
                    : 'neutral'
                }
                variant={sprint.currentStatus === 'active' ? 'solid' : 'outline'}
              >
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    sprint.currentStatus === 'active' ? 'bg-on-solid animate-pulse' : 'bg-current',
                  )}
                />
                <span>{sprint.currentStatus.toUpperCase()}</span>
              </Badge>
              <span className="font-display text-body-md font-semibold text-fg">
                {sprint.durationHours} Hours Total
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-display text-label-sm uppercase tracking-wider text-fg-subtle block">
              Time Remaining
            </span>
            <div className="font-display text-headline-md font-bold text-fg tabular-nums mt-0.5">
              {mounted ? (
                progress.isCompleted ? (
                  <span className="text-fg-subtle">Sprint Concluded</span>
                ) : (
                  <span className="text-accent-fg">
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
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-body-xs text-fg-muted font-mono">
            <span>Elapsed: Hour {progress.currentHour} / {sprint.durationHours}</span>
            <span>{progress.progressPercent}% Complete</span>
          </div>
          <ProgressBar
            value={progress.progressPercent}
            max={100}
            tone="accent"
            label="Sprint elapsed timeline"
          />
        </div>

        {/* Step Milestones Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sprint.milestones.map((m, idx) => {
            const isPassed = progress.currentHour >= m.hour;
            const isActive = idx === progress.activeMilestoneIndex && sprint.currentStatus === 'active';

            return (
              <div
                key={m.id}
                className={cn(
                  'p-3 rounded-xl border text-left transition-colors space-y-1',
                  isActive
                    ? 'border-accent bg-accent-soft ring-1 ring-accent/25'
                    : isPassed
                    ? 'border-success/30 bg-success/8'
                    : 'border-hairline bg-sunken/70',
                )}
              >
                <div className="flex items-center justify-between text-xs gap-1">
                  <span className="font-mono font-bold text-fg">H+{m.hour}</span>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-display font-semibold',
                      isPassed
                        ? 'bg-success/15 text-success-fg'
                        : isActive
                        ? 'bg-accent text-on-solid'
                        : 'bg-surface-2 text-fg-subtle',
                    )}
                  >
                    {isPassed ? 'Passed' : isActive ? 'Current' : 'Upcoming'}
                  </span>
                </div>
                <p className="font-display text-body-xs font-semibold text-fg line-clamp-1">{m.title}</p>
                <p className="text-[11px] text-fg-subtle">{m.points} pts</p>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
