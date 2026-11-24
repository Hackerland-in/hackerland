'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
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
} from 'lucide-react';
import type { Campaign, CampaignMilestone, BackerTier } from '@hackerland/core';
import { calculateCampaignProgress, calculateMilestonePayout } from '@hackerland/core';
import { INDIAN_GOVT_GRANTS } from '@/lib/data/launchpad-data';

interface CampaignDetailViewProps {
  campaign: Campaign;
}

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const { percent } = calculateCampaignProgress(campaign.raisedInr, campaign.fundingGoalInr);

  const [milestones, setMilestones] = useState<CampaignMilestone[]>(campaign.milestones);
  const [userVotedMilestoneId, setUserVotedMilestoneId] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [pledgeSuccessMessage, setPledgeSuccessMessage] = useState<string | null>(null);

  // Active milestone for voting

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
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Link
          href="/launchpad"
          className="inline-flex items-center gap-1 hover:text-white transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Hardware Launchpad</span>
        </Link>
        <span>/</span>
        <span className="text-white font-medium truncate">{campaign.title}</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {campaign.category.replace('_', ' ')}
          </span>
          <span className="text-xs font-mono text-neutral-300 bg-neutral-800 px-2.5 py-0.5 rounded-full">
            TRL {campaign.trlLevel} Prototype
          </span>
          {campaign.creator.dpiitRegistered && (
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              DPIIT Startup India Verified
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
          {campaign.title}
        </h1>
        <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-3xl">
          {campaign.tagline}
        </p>

        {/* Creator Info Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{campaign.creator.name}</span>
            <span>(@{campaign.creator.handle})</span>
          </div>
          <span>•</span>
          <span>{campaign.creator.organization}</span>
          <span>•</span>
          <span>{campaign.creator.city}, {campaign.creator.state}</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Story, Specs, Milestone Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Milestone Escrow Roadmap Timeline */}
          <div className="rounded-xl border border-emerald-500/30 bg-neutral-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mb-1">
                  <Lock className="size-3" />
                  <span>SMART ESCROW SCHEDULE</span>
                </div>
                <h2 className="text-lg font-bold text-white">Engineering Milestone Roadmap</h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                4-Tranche Verification
              </span>
            </div>

            <div className="space-y-6">
              {milestones.map((ms, idx) => {
                const payoutAmount = calculateMilestonePayout(campaign.fundingGoalInr, ms.percentageOfGoal);
                const isReleased = ms.status === 'funds_released' || ms.status === 'verified';
                const isReview = ms.status === 'submitted_for_review';

                return (
                  <div
                    key={ms.id}
                    className={`relative rounded-xl border p-5 transition-all ${
                      isReleased
                        ? 'border-emerald-500/40 bg-emerald-950/15'
                        : isReview
                        ? 'border-amber-500/40 bg-amber-950/20'
                        : 'border-white/10 bg-neutral-950/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-mono font-bold text-white">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-white">{ms.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-neutral-400">
                          {ms.percentageOfGoal}% Tranche (₹{payoutAmount.toLocaleString('en-IN')})
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isReleased
                              ? 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/30'
                              : isReview
                              ? 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                              : 'text-neutral-500 bg-neutral-800'
                          }`}
                        >
                          {ms.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed">{ms.description}</p>

                    {/* Deliverables Checklist */}
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                      <span className="text-[11px] font-mono text-neutral-400 block font-semibold">
                        SUBMITTED VERIFICATION DELIVERABLES:
                      </span>
                      {ms.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-neutral-300 text-xs">
                          <Check className="size-3.5 text-emerald-400 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>

                    {/* Evidence URL */}
                    {ms.evidenceUrl && (
                      <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                        <a
                          href={ms.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>Inspect Release Artifacts (Gerbers / Cad)</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Interactive Quorum Voting Box for Active Milestone */}
                    {isReview && (
                      <div className="mt-4 pt-3 border-t border-amber-500/20 bg-amber-950/30 -mx-5 -mb-5 p-4 rounded-b-xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                            <Vote className="size-4" />
                            <span>ACTIVE BACKER QUORUM VOTE</span>
                          </span>
                          <span className="text-white font-bold">
                            Current Approval: {ms.backerApprovalVotePercent}% / 66% Required
                          </span>
                        </div>

                        <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, ms.backerApprovalVotePercent)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-neutral-400">
                            {userVotedMilestoneId === ms.id
                              ? '✓ You have cast your backer vote for this tranche.'
                              : 'As a verified backer, cast your quorum vote to disburse or audit.'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleVote(ms.id, true)}
                              disabled={userVotedMilestoneId === ms.id}
                              className="px-3 py-1 bg-emerald-500 text-neutral-950 font-semibold text-xs rounded hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                            >
                              Approve Disbursal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVote(ms.id, false)}
                              disabled={userVotedMilestoneId === ms.id}
                              className="px-3 py-1 bg-neutral-800 text-neutral-300 font-semibold text-xs rounded hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                            >
                              Request Audit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Story Section */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="size-5 text-emerald-400" />
              <span>Technical Architecture & Story</span>
            </h2>
            <div className="text-neutral-300 text-xs md:text-sm leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {campaign.storyMarkdown}
            </div>
          </div>

          {/* Hardware Specs Table */}
          {campaign.hardwareSpecs && (
            <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="size-5 text-emerald-400" />
                <span>Verified Hardware Specifications</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {Object.entries(campaign.hardwareSpecs).map(([key, val]) => (
                  <div key={key} className="bg-neutral-950/70 p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-neutral-500 text-[11px] block uppercase">{key}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks & Challenges */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="size-5 text-amber-400" />
              <span>Risks, Tooling Bottlenecks & Mitigations</span>
            </h2>
            <div className="text-neutral-300 text-xs md:text-sm leading-relaxed whitespace-pre-line space-y-2">
              {campaign.risksAndChallenges}
            </div>
          </div>
        </div>

        {/* Right Column: Funding Widget, Backer Tiers, Matched Grants (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Funding Card */}
          <div className="sticky top-20 rounded-xl border border-white/10 bg-neutral-900/90 p-6 space-y-6 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-mono text-neutral-400 uppercase">FUNDS PLEDGED TO ESCROW</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white font-mono">
                  ₹{campaign.raisedInr.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  / ₹{campaign.fundingGoalInr.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[11px]">BACKERS</span>
                  <span className="text-lg font-bold text-white">{campaign.backersCount}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">DAYS REMAINING</span>
                  <span className="text-lg font-bold text-white">{campaign.daysLeft}</span>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Callout */}
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                <ShieldCheck className="size-4 shrink-0" />
                <span>100% MILESTONE ESCROW GUARANTEE</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Your pledge is protected. Funds are not disbursed lump-sum. If the creator fails milestone
                verification or goes unresponsive for 45 days, unreleased funds are returned.
              </p>
            </div>

            {pledgeSuccessMessage && (
              <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                {pledgeSuccessMessage}
              </div>
            )}

            {/* Backer Tiers */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="size-4 text-emerald-400" />
                <span>Select a Reward Tier</span>
              </h3>

              <div className="space-y-3">
                {campaign.backerTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`rounded-xl border p-4 transition-all ${
                      selectedTierId === tier.id
                        ? 'border-emerald-500 bg-emerald-950/30'
                        : 'border-white/10 bg-neutral-950/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{tier.title}</h4>
                        <span className="text-xs text-neutral-400 block mt-0.5">
                          Est. Delivery: {tier.estimatedDelivery}
                        </span>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        <span className="text-base font-black text-emerald-400">
                          ₹{tier.amountInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">(\${tier.amountUsd})</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 mt-2">{tier.description}</p>

                    {/* Perks */}
                    <div className="mt-3 space-y-1">
                      {tier.perks.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <span className="text-emerald-400">•</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePledge(tier)}
                      className="mt-4 w-full py-2 bg-emerald-500 text-neutral-950 font-semibold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Back with ₹{tier.amountInr.toLocaleString('en-IN')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Non-Dilutive Grants */}
            {matchedGrantDetails.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-4 text-emerald-400" />
                  <span>Matched Govt Grants</span>
                </h3>
                <div className="space-y-2">
                  {matchedGrantDetails.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-lg border border-white/10 bg-neutral-950/60 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{g.name}</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">
                          Up to ₹{(g.maxFundingInr / 100000).toFixed(0)}L
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block">{g.agency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
