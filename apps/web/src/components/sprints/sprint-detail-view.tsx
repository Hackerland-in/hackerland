'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, Check, ChevronLeft, Clock, ShieldCheck, Users, Wrench } from 'lucide-react';
import type { SprintEntry } from '@hackerland/core';
import { calculatePrizeDistribution } from '@hackerland/core';
import { Avatar, Badge, Button, Card, CardBody, Panel, cn } from '@hackerland/ui';
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
    <div className="space-y-6 min-w-0">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm text-fg-subtle">
        <Link
          href="/sprints"
          className="inline-flex items-center gap-1 font-display font-medium hover:text-accent-fg transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Sprints</span>
        </Link>
        <span>/</span>
        <span className="text-fg font-medium truncate">{sprint.title}</span>
      </nav>

      {/* Header Banner */}
      <Card className="border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft">
        <CardBody className="p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" variant="solid">
                {sprint.track.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge tone="neutral" variant="outline">
                <Clock className="size-3" aria-hidden="true" />
                <span>{sprint.durationHours}H Build</span>
              </Badge>
            </div>

            <div className="text-body-sm text-fg-muted">
              Sponsor: <strong className="font-display font-semibold text-fg">{sprint.sponsor.name}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight [overflow-wrap:anywhere]">
              {sprint.title}
            </h1>
            <p className="text-body-md text-fg-muted max-w-2xl leading-relaxed">
              {sprint.tagline}
            </p>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <div>
                <span className="font-display text-[11px] uppercase tracking-wider text-fg-subtle block">
                  Total Prize Escrow
                </span>
                <span className="font-display text-headline-md font-bold text-earn-fg tabular-nums">
                  ₹{(sprint.totalPrizePoolINR / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <div className="h-8 w-px bg-hairline hidden sm:block" />
              <div>
                <span className="font-display text-[11px] uppercase tracking-wider text-fg-subtle block">
                  Squad Quota
                </span>
                <span className="inline-flex items-center gap-1.5 font-display text-body-md font-semibold text-fg tabular-nums">
                  <Users className="size-4 text-accent" aria-hidden="true" />
                  <span>{sprint.registeredTeamsCount} / {sprint.maxTeams} Teams</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="primary" size="md" onClick={() => setIsSubmissionOpen(true)}>
                Submit Milestone Check-in
              </Button>
              <Button
                variant={isRegistered ? 'soft' : 'secondary'}
                size="md"
                onClick={() => setIsRegistered(!isRegistered)}
              >
                {isRegistered ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    <span>Registered</span>
                  </>
                ) : (
                  <span>Register Squad</span>
                )}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Real-time Sprint Timeline Tracker */}
      <SprintCountdownTimer sprint={sprint} />

      {/* Prize Distribution Breakdown */}
      <Panel
        title="Non-Dilutive Prize Distribution"
        icon={<Award aria-hidden="true" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="rounded-xl border border-warning/30 bg-warning/8 p-4 text-center space-y-1">
            <span className="font-display text-label-sm text-warning-fg uppercase">1st Place</span>
            <p className="font-display text-headline-md font-bold text-fg tabular-nums">
              ₹{(prizes.firstPlaceINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[12px] text-fg-muted block">50% of pool</span>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent-soft p-4 text-center space-y-1">
            <span className="font-display text-label-sm text-accent-fg uppercase">2nd Place</span>
            <p className="font-display text-headline-md font-bold text-fg tabular-nums">
              ₹{(prizes.secondPlaceINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[12px] text-fg-muted block">30% of pool</span>
          </div>
          <div className="rounded-xl border border-make/25 bg-make/8 p-4 text-center space-y-1">
            <span className="font-display text-label-sm text-make-fg uppercase">3rd Place</span>
            <p className="font-display text-headline-md font-bold text-fg tabular-nums">
              ₹{(prizes.thirdPlaceINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[12px] text-fg-muted block">15% of pool</span>
          </div>
          <div className="rounded-xl border border-hairline bg-sunken p-4 text-center space-y-1">
            <span className="font-display text-label-sm text-fg-subtle uppercase">Runners-up Pool</span>
            <p className="font-display text-headline-md font-bold text-fg tabular-nums">
              ₹{(prizes.runnerUpsINR / 100000).toFixed(2)}L
            </p>
            <span className="text-[12px] text-fg-muted block">5% of pool</span>
          </div>
        </div>
      </Panel>

      {/* 48-Hour Milestone Breakdown */}
      <Panel
        title="Sprint Milestones & Evaluation Gates"
        action={<Badge tone="neutral">Total Points: 100 pts</Badge>}
      >
        <div className="space-y-3.5">
          {sprint.milestones.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-hairline bg-sunken/60 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft border border-accent/25 font-mono font-bold text-accent-fg text-xs">
                    H+{m.hour}
                  </span>
                  <h3 className="font-display text-body-md font-bold text-fg">
                    {m.title}
                  </h3>
                </div>
                <Badge tone="accent" variant="outline">
                  {m.points} Points
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm">
                <div>
                  <span className="font-display font-semibold text-fg uppercase tracking-wider text-[11px] block mb-1.5">
                    Mandatory Deliverables
                  </span>
                  <ul className="list-disc pl-4 text-fg-muted space-y-1">
                    {m.deliverables.map((del, i) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-display font-semibold text-fg uppercase tracking-wider text-[11px] block mb-1.5">
                    Jury Review Criteria
                  </span>
                  <ul className="list-disc pl-4 text-fg-muted space-y-1">
                    {m.reviewCriteria.map((crit, i) => (
                      <li key={i}>{crit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Hardware Perks & Lab Vouchers */}
      <Panel
        title="Sponsored Hardware Perks & Lab Vouchers"
        icon={<Wrench aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sprint.hardwarePerks.map((perk, i) => (
            <div
              key={i}
              className="rounded-xl border border-hairline bg-sunken/70 p-3.5 flex items-start gap-3"
            >
              <span className="text-lg shrink-0" aria-hidden="true">🛠️</span>
              <div className="min-w-0">
                <p className="font-display text-body-sm font-semibold text-fg">{perk}</p>
                <p className="text-[12px] text-fg-muted mt-0.5">
                  Available to all squads completing Hour 12 milestone verification.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Jury Panel & Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel title="Jury & Evaluation Panel" icon={<Users aria-hidden="true" />}>
          <div className="space-y-2.5">
            {sprint.juryPanel.map((juror, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-sunken/70 border border-hairline"
              >
                <Avatar name={juror.name} size="md" />
                <div className="min-w-0">
                  <p className="font-display text-body-sm font-bold text-fg truncate">{juror.name}</p>
                  <p className="text-[12px] text-fg-muted truncate">{juror.role}</p>
                  <p className="text-[11px] font-display font-semibold text-accent-fg truncate">
                    {juror.organization}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Eligibility & Open-Source Rules" icon={<ShieldCheck aria-hidden="true" />}>
          <div className="space-y-4 text-body-sm text-fg-muted">
            <div>
              <span className="font-display font-semibold text-fg block mb-1.5">
                Eligibility
              </span>
              <ul className="list-disc pl-4 space-y-1">
                {sprint.eligibilityCriteria.map((crit, i) => (
                  <li key={i}>{crit}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-display font-semibold text-fg block mb-1.5">
                Rules &amp; Integrity
              </span>
              <ul className="list-disc pl-4 space-y-1">
                {sprint.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>
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
