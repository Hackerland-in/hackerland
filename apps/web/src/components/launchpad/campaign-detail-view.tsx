'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Vote,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Gift,
  Check,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import type { Campaign, CampaignMilestone, BackerTier } from '@hackerland/core';
import { calculateCampaignProgress, calculateMilestonePayout } from '@hackerland/core';
import { Avatar, Badge, Button, Card, CardBody, Panel, ProgressBar, cn } from '@hackerland/ui';
import { INDIAN_GOVT_GRANTS } from '@/lib/data/launchpad-data';
import { useSocialCommunity } from '@/components/social/social-context';

interface CampaignDetailViewProps {
  campaign: Campaign;
}

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const { percent } = calculateCampaignProgress(campaign.raisedInr, campaign.fundingGoalInr);

  const [milestones, setMilestones] = useState<CampaignMilestone[]>(campaign.milestones);
  const [userVotedMilestoneId, setUserVotedMilestoneId] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [pledgeSuccessMessage, setPledgeSuccessMessage] = useState<string | null>(null);

  const { isFollowing, toggleFollow } = useSocialCommunity();
  const following = isFollowing(campaign.creator.handle);

  const handleVote = (milestoneId: string, approve: boolean) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const delta = approve ? 1 : -1;
          const newVote = Math.min(100, Math.max(0, m.backerApprovalVotePercent + delta));
          return {
            ...m,
            backerApprovalVotePercent: newVote,
          };
        }
        return m;
      })
    );
    setUserVotedMilestoneId(milestoneId);
  };

  const handlePledge = (tier: BackerTier) => {
    setSelectedTierId(tier.id);
    setPledgeSuccessMessage(
      `Pledge simulated! ₹${tier.amountInr.toLocaleString('en-IN')} locked in milestone escrow for "${tier.title}".`
    );
  };

  const matchedGrantDetails = INDIAN_GOVT_GRANTS.filter((g) => campaign.matchedGrants.includes(g.id));

  return (
    <div className="space-y-6 min-w-0">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm text-fg-subtle">
        <Link
          href="/launchpad"
          className="inline-flex items-center gap-1 font-display font-medium hover:text-accent-fg transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Hardware Launchpad</span>
        </Link>
        <span>/</span>
        <span className="text-fg font-medium truncate">{campaign.title}</span>
      </nav>

      {/* Hero Header & Escrow Telemetry */}
      <Card className="border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft">
        <CardBody className="p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="solid">
              {campaign.category.replace('_', ' ')}
            </Badge>
            <Badge tone="neutral" variant="outline">
              TRL {campaign.trlLevel} Prototype
            </Badge>
            {campaign.creator.dpiitRegistered && (
              <Badge tone="success" variant="outline">
                <ShieldCheck className="size-3" aria-hidden="true" />
                <span>DPIIT Startup India Verified</span>
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight [overflow-wrap:anywhere]">
              {campaign.title}
            </h1>
            <p className="text-body-md text-fg-muted max-w-2xl leading-relaxed">
              {campaign.tagline}
            </p>
          </div>

          {/* Creator Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={campaign.creator.name} size="md" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-body-sm">
                  <Link
                    href={`/u/${campaign.creator.handle}`}
                    className="font-display font-bold text-fg hover:text-accent-fg transition-colors"
                  >
                    {campaign.creator.name}
                  </Link>
                  <span className="text-fg-subtle">@{campaign.creator.handle}</span>
                </div>
                <div className="text-body-xs text-fg-muted truncate">
                  {campaign.creator.organization} • {campaign.creator.city}, {campaign.creator.state}
                </div>
              </div>
            </div>

            <Button
              variant={following ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => toggleFollow(campaign.creator.handle)}
            >
              {following ? (
                <>
                  <UserCheck className="size-3.5" aria-hidden="true" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5" aria-hidden="true" />
                  <span>Follow Maker</span>
                </>
              )}
            </Button>
          </div>

          {/* Funding Summary Strip */}
          <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] uppercase text-fg-subtle block">
                  FUNDS PLEDGED TO ESCROW
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display text-headline-lg font-bold text-fg tabular-nums">
                    ₹{campaign.raisedInr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-body-xs text-fg-muted font-mono">
                    / ₹{campaign.fundingGoalInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5 text-body-xs font-mono">
                <div>
                  <span className="text-fg-subtle block">BACKERS</span>
                  <span className="font-display text-headline-sm font-bold text-fg tabular-nums">
                    {campaign.backersCount}
                  </span>
                </div>
                <div>
                  <span className="text-fg-subtle block">DAYS REMAINING</span>
                  <span className="font-display text-headline-sm font-bold text-accent-fg tabular-nums">
                    {campaign.daysLeft}
                  </span>
                </div>
              </div>
            </div>

            <ProgressBar
              value={percent}
              max={100}
              tone="accent"
              label="Campaign escrow funding progress"
              showValue
            />

            <div className="rounded-xl border border-success/30 bg-success/8 p-3.5 text-body-xs space-y-1">
              <div className="flex items-center gap-1.5 text-success-fg font-display font-bold">
                <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                <span>100% MILESTONE ESCROW GUARANTEE</span>
              </div>
              <p className="text-fg-muted leading-relaxed">
                Your pledge is protected. Funds are not disbursed lump-sum. If the creator fails milestone verification or goes unresponsive for 45 days, unreleased funds are returned.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Milestone Escrow Roadmap */}
      <Panel
        title="Engineering Milestone Roadmap"
        icon={<Lock aria-hidden="true" />}
        action={<Badge tone="accent" variant="outline">SMART ESCROW SCHEDULE</Badge>}
      >
        <div className="space-y-4">
          {milestones.map((ms, idx) => {
            const payoutAmount = calculateMilestonePayout(campaign.fundingGoalInr, ms.percentageOfGoal);
            const isReleased = ms.status === 'funds_released' || ms.status === 'verified';
            const isReview = ms.status === 'submitted_for_review';

            return (
              <div
                key={ms.id}
                className={cn(
                  'rounded-2xl border p-4 sm:p-5 space-y-3',
                  isReleased
                    ? 'border-success/35 bg-success/5'
                    : isReview
                    ? 'border-warning/40 bg-warning/8'
                    : 'border-hairline bg-sunken/60',
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-1 border border-hairline text-xs font-mono font-bold text-fg">
                      {idx + 1}
                    </span>
                    <h3 className="font-display text-body-md font-bold text-fg">{ms.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="text-fg-muted">
                      {ms.percentageOfGoal}% Tranche (₹{payoutAmount.toLocaleString('en-IN')})
                    </span>
                    <Badge
                      tone={isReleased ? 'success' : isReview ? 'warning' : 'neutral'}
                      variant={isReleased || isReview ? 'solid' : 'outline'}
                    >
                      {ms.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                <p className="text-body-sm text-fg-muted leading-relaxed">{ms.description}</p>

                <div className="pt-2 border-t border-hairline space-y-1.5 text-body-xs">
                  <span className="font-mono text-[11px] text-fg-subtle block font-semibold">
                    SUBMITTED VERIFICATION DELIVERABLES
                  </span>
                  {ms.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-fg-muted">
                      <Check className="size-3.5 text-success shrink-0" aria-hidden="true" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>

                {ms.evidenceUrl && (
                  <div className="pt-1">
                    <a
                      href={ms.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-body-xs font-display font-semibold text-accent-fg hover:underline"
                    >
                      <span>Inspect Release Artifacts (Gerbers / CAD)</span>
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}

                {isReview && (
                  <div className="mt-3 rounded-xl border border-warning/30 bg-surface-1 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs font-mono">
                      <span className="text-warning-fg font-bold inline-flex items-center gap-1.5">
                        <Vote className="size-4" aria-hidden="true" />
                        <span>ACTIVE BACKER QUORUM VOTE</span>
                      </span>
                      <span className="text-fg font-bold">
                        Current Approval: {ms.backerApprovalVotePercent}% / 66% Required
                      </span>
                    </div>

                    <ProgressBar
                      value={ms.backerApprovalVotePercent}
                      max={100}
                      tone="warning"
                      label={`Backer quorum vote for ${ms.title}`}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-body-xs text-fg-muted">
                        {userVotedMilestoneId === ms.id
                          ? '✓ You have cast your backer vote for this tranche.'
                          : 'As a verified backer, cast your quorum vote to disburse or audit.'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleVote(ms.id, true)}
                          disabled={userVotedMilestoneId === ms.id}
                        >
                          Approve Disbursal
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleVote(ms.id, false)}
                          disabled={userVotedMilestoneId === ms.id}
                        >
                          Request Audit
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Reward Tiers */}
      <Panel title="Select a Reward Tier" icon={<Gift aria-hidden="true" />}>
        <div className="space-y-4">
          {pledgeSuccessMessage && (
            <div
              role="status"
              className="rounded-xl border border-success/40 bg-success/10 p-3.5 text-body-sm font-medium text-success-fg"
            >
              {pledgeSuccessMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.backerTiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  'rounded-2xl border p-4 flex flex-col justify-between transition-all',
                  selectedTierId === tier.id
                    ? 'border-accent bg-accent-soft'
                    : 'border-hairline bg-sunken/70 hover:border-accent/35',
                )}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display text-body-md font-bold text-fg">{tier.title}</h3>
                      <span className="text-body-xs text-fg-subtle block">
                        Est. Delivery: {tier.estimatedDelivery}
                      </span>
                    </div>
                    <div className="text-right shrink-0 font-mono">
                      <span className="font-display text-body-lg font-bold text-earn-fg block tabular-nums">
                        ₹{tier.amountInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-fg-subtle block">(${tier.amountUsd})</span>
                    </div>
                  </div>

                  <p className="text-body-xs text-fg-muted">{tier.description}</p>

                  <div className="space-y-1">
                    {tier.perks.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-1.5 text-body-xs text-fg-muted">
                        <span className="text-accent-fg font-bold">•</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePledge(tier)}
                  className="mt-4 w-full"
                >
                  Back with ₹{tier.amountInr.toLocaleString('en-IN')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* Matched Grants */}
      {matchedGrantDetails.length > 0 && (
        <Panel title="Matched Govt Grants" icon={<Sparkles aria-hidden="true" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedGrantDetails.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-hairline bg-sunken p-3.5 text-body-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-fg">{g.name}</span>
                  <Badge tone="earn" variant="outline">
                    Up to ₹{(g.maxFundingInr / 100000).toFixed(0)}L
                  </Badge>
                </div>
                <span className="text-fg-subtle block">{g.agency}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Technical Story */}
      <Panel title="Technical Architecture & Story" icon={<Layers aria-hidden="true" />}>
        <div className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed whitespace-pre-line">
          {campaign.storyMarkdown}
        </div>
      </Panel>

      {/* Hardware Specs */}
      {campaign.hardwareSpecs && (
        <Panel title="Verified Hardware Specifications" icon={<Cpu aria-hidden="true" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-xs font-mono">
            {Object.entries(campaign.hardwareSpecs).map(([key, val]) => (
              <div key={key} className="bg-sunken p-3.5 rounded-xl border border-hairline space-y-1">
                <span className="text-fg-subtle text-[11px] block uppercase">{key}</span>
                <span className="text-fg font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Risks & Challenges */}
      <Panel title="Risks, Tooling Bottlenecks & Mitigations" icon={<AlertCircle aria-hidden="true" />}>
        <div className="text-body-sm text-fg-muted leading-relaxed whitespace-pre-line">
          {campaign.risksAndChallenges}
        </div>
      </Panel>
    </div>
  );
}
