'use client';

import { ShieldCheck, CheckCircle2, Clock, FileCode, CheckSquare } from 'lucide-react';
import { Badge } from '@hackerland/ui';
import { formatMoney, type Currency } from '@hackerland/core';

export interface EscrowMilestoneStepperProps {
  totalAmount: number;
  currency?: Currency;
  isBounty?: boolean;
  stage?: 'escrow_locked' | 'milestone_1_approved' | 'milestone_2_released';
  className?: string;
}

export function EscrowMilestoneStepper({
  totalAmount,
  currency = 'INR',
  isBounty = true,
  stage = 'escrow_locked',
  className = '',
}: EscrowMilestoneStepperProps) {
  const milestone1Amount = Math.round(totalAmount * 0.4);
  const milestone2Amount = totalAmount - milestone1Amount;

  return (
    <div
      className={`rounded-lg border border-hairline bg-surface-1 p-4 space-y-4 ${className}`}
      data-testid="escrow-milestone-stepper"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-earn shrink-0" />
          <span className="font-display text-body-sm font-semibold text-fg">
            2-Stage Escrow Protection
          </span>
        </div>
        <Badge tone="earn" variant="solid" className="text-body-xs">
          100% Funds Secured
        </Badge>
      </div>

      <p className="text-body-xs text-fg-muted">
        {isBounty
          ? 'Rewards are locked in escrow upfront and disbursed in two milestone releases to protect both builders and sponsors.'
          : 'Funding disbursements follow a phased milestone release based on project checkpoints.'}
      </p>

      {/* 2-Stage Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Milestone 1 */}
        <div
          className={`rounded-md border p-3 flex flex-col justify-between transition-colors ${
            stage === 'milestone_1_approved' || stage === 'milestone_2_released'
              ? 'border-success/40 bg-success/5'
              : 'border-hairline bg-surface-2'
          }`}
          data-testid="milestone-1-card"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-fg-subtle">
                Stage 1 • 40% Advance
              </span>
              {stage === 'milestone_1_approved' || stage === 'milestone_2_released' ? (
                <Badge tone="success" variant="solid" className="text-body-xs">
                  <CheckCircle2 className="size-3 mr-1" /> Approved
                </Badge>
              ) : (
                <Badge tone="neutral" variant="outline" className="text-body-xs">
                  <Clock className="size-3 mr-1" /> Pending Start
                </Badge>
              )}
            </div>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {formatMoney(milestone1Amount, currency)}
            </div>
            <p className="text-body-xs text-fg-muted font-medium">
              Architecture & Prototype Checkpoint
            </p>
          </div>

          <ul className="mt-3 space-y-1 text-caption text-fg-subtle border-t border-hairline/60 pt-2">
            <li className="flex items-center gap-1.5">
              <FileCode className="size-3 text-accent shrink-0" />
              <span>Spec & implementation plan signed off</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="size-3 text-accent shrink-0" />
              <span>Initial PR or hardware schematic submitted</span>
            </li>
          </ul>
        </div>

        {/* Milestone 2 */}
        <div
          className={`rounded-md border p-3 flex flex-col justify-between transition-colors ${
            stage === 'milestone_2_released'
              ? 'border-success/40 bg-success/5'
              : 'border-hairline bg-surface-2'
          }`}
          data-testid="milestone-2-card"
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-fg-subtle">
                Stage 2 • 60% Completion
              </span>
              {stage === 'milestone_2_released' ? (
                <Badge tone="success" variant="solid" className="text-body-xs">
                  <CheckCircle2 className="size-3 mr-1" /> Released
                </Badge>
              ) : (
                <Badge tone="neutral" variant="outline" className="text-body-xs">
                  <Clock className="size-3 mr-1" /> Upon Verification
                </Badge>
              )}
            </div>
            <div className="font-display text-headline-sm font-semibold text-earn tabular-nums">
              {formatMoney(milestone2Amount, currency)}
            </div>
            <p className="text-body-xs text-fg-muted font-medium">
              Testing, Code Review & Verification
            </p>
          </div>

          <ul className="mt-3 space-y-1 text-caption text-fg-subtle border-t border-hairline/60 pt-2">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3 text-success shrink-0" />
              <span>Full test suite passing & demo verified</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckSquare className="size-3 text-success shrink-0" />
              <span>Merged into main branch / BOM built</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
