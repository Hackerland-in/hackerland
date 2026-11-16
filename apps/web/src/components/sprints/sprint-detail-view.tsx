'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SprintEntry } from '@hackerland/core';
import { calculatePrizeDistribution } from '@hackerland/core';
import { SprintCountdownTimer } from './sprint-countdown-timer';
import { SprintSubmissionDrawer } from './sprint-submission-drawer';

interface SprintDetailViewProps {
  sprint: SprintEntry;
}

export function SprintDetailView({ sprint }: SprintDetailViewProps) {
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const prizes = calculatePrizeDistribution(sprint.totalPrizePoolINR);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Link href="/sprints" className="hover:text-foreground transition-colors">
          Sprints
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{sprint.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {sprint.track.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {sprint.durationHours}H Build
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Sponsor:</span>
            <span className="font-semibold text-foreground">{sprint.sponsor.name}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {sprint.title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          {sprint.tagline}
        </p>

        {/* Action Bar */}
        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                Total Prize Escrow
              </span>
              <span className="text-xl md:text-2xl font-mono font-bold text-foreground">
                ₹{(sprint.totalPrizePoolINR / 100000).toFixed(1)} Lakhs
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                Squad Quota
              </span>
              <span className="text-sm md:text-base font-mono font-medium text-foreground">
                {sprint.registeredTeamsCount} / {sprint.maxTeams} Teams
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmissionOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              Submit Milestone Check-in
            </button>
            <button
              onClick={() => setIsRegistered(!isRegistered)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold border transition-colors ${
                isRegistered
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-border bg-secondary/50 text-foreground hover:bg-secondary'
              }`}
            >
              {isRegistered ? '✓ Registered' : 'Register Squad'}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Sprint Timeline Tracker */}
      <SprintCountdownTimer sprint={sprint} />

      {/* Prize Distribution Breakdown */}
      <div className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Non-Dilutive Prize Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
            <span className="text-xs font-mono font-semibold text-amber-500 uppercase">1st Place</span>
            <p className="text-xl font-mono font-bold text-foreground mt-1">
              ₹{(prizes.firstPlaceINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">50% of pool</span>
          </div>
          <div className="rounded-lg border border-slate-400/30 bg-slate-400/5 p-4 text-center">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase">2nd Place</span>
            <p className="text-xl font-mono font-bold text-foreground mt-1">
              ₹{(prizes.secondPlaceINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">30% of pool</span>
          </div>
          <div className="rounded-lg border border-amber-700/30 bg-amber-700/5 p-4 text-center">
            <span className="text-xs font-mono font-semibold text-amber-700 uppercase">3rd Place</span>
            <p className="text-xl font-mono font-bold text-foreground mt-1">
              ₹{(prizes.thirdPlaceINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">15% of pool</span>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
            <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">Runners-up Pool</span>
            <p className="text-xl font-mono font-bold text-foreground mt-1">
              ₹{(prizes.runnerUpsINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">5% of pool</span>
          </div>
        </div>
      </div>

      {/* 48-Hour Milestone Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Sprint Milestones & Evaluation Gates
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Total Points: 100 pts
          </span>
        </div>

        <div className="space-y-4">
          {sprint.milestones.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-xs">
                    H+{m.hour}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {m.title}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-primary px-2.5 py-1 rounded bg-primary/10">
                  {m.points} Points
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] block mb-1.5 font-mono">
                    Mandatory Deliverables:
                  </span>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    {m.deliverables.map((del, i) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] block mb-1.5 font-mono">
                    Jury Review Criteria:
                  </span>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    {m.reviewCriteria.map((crit, i) => (
                      <li key={i}>{crit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Perks & Lab Vouchers */}
      <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Sponsored Hardware Perks & Lab Vouchers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sprint.hardwarePerks.map((perk, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/80 bg-background/50 p-3.5 flex items-start gap-3"
            >
              <span className="text-lg">🛠️</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{perk}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Available to all squads completing Hour 12 milestone verification.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jury Panel & Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jury Panel */}
        <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Jury & Evaluation Panel
          </h2>
          <div className="space-y-3">
            {sprint.juryPanel.map((juror, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/60">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-mono font-bold text-muted-foreground text-sm">
                  {juror.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{juror.name}</p>
                  <p className="text-[11px] text-muted-foreground">{juror.role}</p>
                  <p className="text-[10px] text-primary font-mono">{juror.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules & Eligibility */}
        <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Eligibility & Open-Source Rules
          </h2>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground block mb-1">
                Eligibility:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {sprint.eligibilityCriteria.map((crit, i) => (
                  <li key={i}>{crit}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-foreground block mb-1">
                Rules & Integrity:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {sprint.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <SprintSubmissionDrawer
        sprint={sprint}
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
      />
    </div>
  );
}
