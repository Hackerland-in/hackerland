'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Rocket,
  ShieldCheck,
  Award,
  Vote,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Cpu,
  HeartPulse,
  Leaf,
  Zap,
  Lock,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import type { CampaignCategory } from '@hackerland/core';
import {
  calculateCampaignProgress,
  calculateMilestonePayout,
  verifyMilestoneQuorum,
  matchGrantsForProject,
} from '@hackerland/core';
import { Avatar, Badge, Button, Card, CardBody, FilterChip, Panel, ProgressBar, cn } from '@hackerland/ui';
import { INDIAN_GOVT_GRANTS, CAMPAIGN_REGISTRY } from '@/lib/data/launchpad-data';
import { useSocialCommunity } from '@/components/social/social-context';

const CATEGORY_TABS: { label: string; value: CampaignCategory | 'all'; icon: typeof Rocket }[] = [
  { label: 'All Projects', value: 'all', icon: Rocket },
  { label: 'Defence & Aero', value: 'defence_aerospace', icon: ShieldCheck },
  { label: 'Medtech & Assistive', value: 'medtech_assistive', icon: HeartPulse },
  { label: 'Agritech & IoT', value: 'agritech_iot', icon: Leaf },
  { label: 'Clean Energy & EV', value: 'clean_energy', icon: Zap },
  { label: 'Semiconductors', value: 'semiconductors', icon: Cpu },
];

const TRL_DESCRIPTIONS: Record<number, string> = {
  1: 'TRL 1: Basic scientific principles observed and reported',
  2: 'TRL 2: Technology concept or application formulated',
  3: 'TRL 3: Analytical & experimental critical function proof-of-concept',
  4: 'TRL 4: Component or breadboard validation in laboratory environment',
  5: 'TRL 5: Component or breadboard validation in relevant environment (EVT)',
  6: 'TRL 6: System/subsystem model or prototype demonstration (DVT)',
  7: 'TRL 7: System prototype demonstration in an operational environment (PVT)',
  8: 'TRL 8: Actual system completed and qualified through test & demo',
  9: 'TRL 9: Actual system proven through successful mission/market operations',
};

export function LaunchpadStudio() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'grant_matcher' | 'escrow_simulator'>('campaigns');
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Grant Matcher State
  const [matcherCategory, setMatcherCategory] = useState<CampaignCategory>('defence_aerospace');
  const [matcherTrl, setMatcherTrl] = useState<number>(4);
  const [matcherDpiit, setMatcherDpiit] = useState<boolean>(true);
  const [matcherOwnership, setMatcherOwnership] = useState<number>(100);

  // Escrow Simulator State
  const [simGoalInr, setSimGoalInr] = useState<number>(1000000);
  const [simTranchePercent, setSimTranchePercent] = useState<number>(35);
  const [simVotesFor, setSimVotesFor] = useState<number>(72);
  const [simTotalVotes, setSimTotalVotes] = useState<number>(100);

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  const filteredCampaigns = useMemo(() => {
    return CAMPAIGN_REGISTRY.filter((c) => {
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const grantMatches = useMemo(() => {
    return matchGrantsForProject(
      {
        category: matcherCategory,
        trl: matcherTrl,
        isDpiitRegistered: matcherDpiit,
        indianOwnershipPercent: matcherOwnership,
      },
      INDIAN_GOVT_GRANTS
    );
  }, [matcherCategory, matcherTrl, matcherDpiit, matcherOwnership]);

  const simQuorumResult = useMemo(() => {
    return verifyMilestoneQuorum(simVotesFor, simTotalVotes);
  }, [simVotesFor, simTotalVotes]);

  const simPayout = useMemo(() => {
    return calculateMilestonePayout(simGoalInr, simTranchePercent);
  }, [simGoalInr, simTranchePercent]);

  return (
    <div className="space-y-6 min-w-0">
      {/* Top Banner & Value Proposition */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Lock className="size-3.5" aria-hidden="true" />
              <span>Milestone-Locked Hardware Escrow + Non-Dilutive Grants</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Hardware Launchpad &amp; Grant Matcher
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
              Back physical hardware with zero lump-sum risk. Funds stay in escrow and unlock on peer-verified EVT, DVT, and PVT milestones, alongside Indian innovation grant matching.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="rounded-xl border border-hairline bg-surface-1/90 p-3.5 text-center shadow-xs">
              <span className="text-[10px] text-fg-subtle block font-mono uppercase">ESCROW LOCKED</span>
              <span className="font-display text-headline-sm sm:text-headline-md font-bold text-earn-fg tabular-nums">
                ₹47.5 Lakhs
              </span>
              <span className="text-[11px] text-fg-muted block">Across 5 Active Runs</span>
            </div>
            <div className="rounded-xl border border-hairline bg-surface-1/90 p-3.5 text-center shadow-xs">
              <span className="text-[10px] text-fg-subtle block font-mono uppercase">QUORUM PASS RATE</span>
              <span className="font-display text-headline-sm sm:text-headline-md font-bold text-accent-fg tabular-nums">
                92.4%
              </span>
              <span className="text-[11px] text-fg-muted block">&gt;66% Backer Vote Req</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Navigation Tabs */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-full text-body-sm font-display font-semibold transition-all',
              activeTab === 'campaigns'
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            <Rocket className="size-4" aria-hidden="true" />
            <span>Active Campaigns ({CAMPAIGN_REGISTRY.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grant_matcher')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-full text-body-sm font-display font-semibold transition-all',
              activeTab === 'grant_matcher'
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span>Govt Grant Matcher ({INDIAN_GOVT_GRANTS.length} Schemes)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('escrow_simulator')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-full text-body-sm font-display font-semibold transition-all',
              activeTab === 'escrow_simulator'
                ? 'bg-accent text-on-solid shadow-xs'
                : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>Escrow &amp; Quorum Simulator</span>
          </button>
        </div>

        {activeTab === 'campaigns' && (
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search campaigns, chips, makers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-9 pr-3.5 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: ACTIVE CAMPAIGNS DIRECTORY */}
      {activeTab === 'campaigns' && (
        <div className="space-y-5">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.value;
              return (
                <FilterChip
                  key={tab.value}
                  selected={isSelected}
                  tone="accent"
                  onClick={() => setSelectedCategory(tab.value)}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </FilterChip>
              );
            })}
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {filteredCampaigns.map((camp) => {
              const { percent } = calculateCampaignProgress(camp.raisedInr, camp.fundingGoalInr);
              const activeMilestone =
                camp.milestones.find((m) => m.status === 'submitted_for_review' || m.status === 'pending') ||
                camp.milestones[camp.milestones.length - 1];
              const saved = isItemSaved(`campaign:${camp.slug}`);

              return (
                <Card
                  key={camp.id}
                  className="group flex flex-col justify-between transition-all hover:border-accent/40 min-w-0 [overflow-wrap:anywhere]"
                >
                  <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3.5">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <Badge tone="accent" variant="outline">
                            {camp.category.replace('_', ' ')}
                          </Badge>
                          <Badge tone="neutral" variant="outline">
                            TRL {camp.trlLevel}
                          </Badge>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSaveItem(`campaign:${camp.slug}`)}
                          aria-label={saved ? `Unsave ${camp.title}` : `Save ${camp.title}`}
                          aria-pressed={saved}
                          className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                            saved
                              ? 'border-accent/40 bg-accent-soft text-accent-fg'
                              : 'border-hairline bg-surface-2/60 text-fg-subtle hover:border-accent/30 hover:text-accent-fg',
                          )}
                        >
                          <Bookmark className={cn('size-3.5', saved && 'fill-current')} aria-hidden="true" />
                        </button>
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <Link
                          href={`/launchpad/${camp.slug}`}
                          className="font-display text-headline-sm font-bold text-fg group-hover:text-accent-fg transition-colors line-clamp-2 block"
                        >
                          {camp.title}
                        </Link>
                        <p className="text-body-sm text-fg-muted line-clamp-2 mt-1 leading-relaxed">
                          {camp.tagline}
                        </p>
                      </div>

                      {/* Creator Info */}
                      <div className="flex flex-wrap items-center gap-2 text-body-xs text-fg-muted">
                        <Avatar name={camp.creator.name} size="sm" />
                        <span className="font-display font-semibold text-fg">{camp.creator.name}</span>
                        <span>•</span>
                        <span className="truncate">{camp.creator.organization}</span>
                        {camp.creator.dpiitRegistered && (
                          <Badge tone="success" variant="outline">
                            DPIIT Verified
                          </Badge>
                        )}
                      </div>

                      {/* Funding Progress Bar */}
                      <div className="space-y-2 pt-3 border-t border-hairline">
                        <div className="flex justify-between items-baseline text-body-xs">
                          <span className="font-display font-bold text-fg text-body-md tabular-nums">
                            ₹{(camp.raisedInr / 100000).toFixed(2)} Lakhs
                          </span>
                          <span className="text-fg-subtle">
                            {percent}% of ₹{(camp.fundingGoalInr / 100000).toFixed(1)}L
                          </span>
                        </div>
                        <ProgressBar
                          value={percent}
                          max={100}
                          tone="accent"
                          label={`Funding progress for ${camp.title}`}
                        />
                        <div className="flex justify-between text-[11px] text-fg-subtle font-mono">
                          <span>{camp.backersCount} Backers</span>
                          <span>{camp.daysLeft} Days Left</span>
                        </div>
                      </div>

                      {/* Milestone State Box */}
                      {activeMilestone && (
                        <div className="rounded-xl border border-hairline bg-sunken p-3 text-body-xs space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-fg-subtle uppercase">
                              ACTIVE ESCROW TRANCHE
                            </span>
                            <Badge
                              tone={
                                activeMilestone.status === 'verified'
                                  ? 'success'
                                  : activeMilestone.status === 'submitted_for_review'
                                  ? 'warning'
                                  : 'neutral'
                              }
                              variant="outline"
                            >
                              {activeMilestone.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="font-display font-semibold text-fg truncate">
                            {activeMilestone.title}
                          </p>
                          {activeMilestone.status === 'submitted_for_review' && (
                            <div className="flex items-center gap-1.5 text-[11px] text-warning-fg pt-0.5 font-medium">
                              <Vote className="size-3.5 shrink-0" aria-hidden="true" />
                              <span>Quorum: {activeMilestone.backerApprovalVotePercent}% / 66% needed</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
                      <span className="text-body-xs text-fg-subtle">
                        {camp.backerTiers.length} Reward Tiers Available
                      </span>
                      <Button asChild variant="soft" size="sm">
                        <Link href={`/launchpad/${camp.slug}`}>
                          <span>Inspect Escrow</span>
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INDIAN GOVT NON-DILUTIVE GRANT MATCHER */}
      {activeTab === 'grant_matcher' && (
        <div className="space-y-6">
          <Panel
            title="Project Eligibility Profile"
            icon={<Sparkles aria-hidden="true" />}
            action={<Badge tone="accent" variant="solid">NON-DILUTIVE GRANT ENGINE</Badge>}
          >
            <div className="space-y-5">
              <p className="text-body-sm text-fg-muted">
                Configure your hardware startup details to instantly check statutory eligibility against Indian central government innovation schemes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-display text-label-md text-fg block">
                    Technology Domain
                  </label>
                  <select
                    value={matcherCategory}
                    onChange={(e) => setMatcherCategory(e.target.value as CampaignCategory)}
                    className="h-11 w-full rounded-xl border border-line bg-sunken px-3 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
                  >
                    <option value="defence_aerospace">Defence, Aerospace &amp; Tactical Drones</option>
                    <option value="medtech_assistive">Healthcare, Medtech &amp; Assistive Hardware</option>
                    <option value="agritech_iot">Agritech, Environmental &amp; Rural IoT</option>
                    <option value="clean_energy">Clean Energy, Batteries &amp; EV Powertrains</option>
                    <option value="semiconductors">Semiconductors, RISC-V &amp; VLSI Design</option>
                    <option value="robotics_automation">Robotics &amp; Industrial Automation</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-display text-label-md text-fg block">
                    Startup India DPIIT Recognition
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setMatcherDpiit(true)}
                      className={cn(
                        'h-11 px-3 rounded-xl border text-body-xs font-display font-semibold transition-all',
                        matcherDpiit
                          ? 'border-accent bg-accent-soft text-accent-fg'
                          : 'border-hairline bg-sunken text-fg-muted hover:text-fg',
                      )}
                    >
                      ✓ Registered DPIIT Entity
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatcherDpiit(false)}
                      className={cn(
                        'h-11 px-3 rounded-xl border text-body-xs font-display font-semibold transition-all',
                        !matcherDpiit
                          ? 'border-accent bg-accent-soft text-accent-fg'
                          : 'border-hairline bg-sunken text-fg-muted hover:text-fg',
                      )}
                    >
                      Student / Pre-DPIIT Team
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-hairline">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="font-display text-label-md text-fg">
                      Technology Readiness Level (TRL)
                    </label>
                    <span className="font-mono text-body-xs font-bold text-accent-fg">
                      TRL {matcherTrl}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="9"
                    value={matcherTrl}
                    onChange={(e) => setMatcherTrl(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <p className="text-[11px] text-fg-muted bg-sunken p-2.5 rounded-xl border border-hairline font-mono">
                    {TRL_DESCRIPTIONS[matcherTrl]}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="font-display text-label-md text-fg">
                      Indian Resident Shareholding (%)
                    </label>
                    <span className="font-mono text-body-xs font-bold text-fg">
                      {matcherOwnership}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={matcherOwnership}
                    onChange={(e) => setMatcherOwnership(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <span className="text-[11px] text-fg-subtle block">
                    Statutory requirement: Most Indian grant programs mandate &ge; 51% Indian equity ownership.
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Ranked Scheme Matches */}
          <Panel
            title={`Grant Matching Results (${grantMatches.length} Evaluated)`}
            icon={<Award aria-hidden="true" />}
            action={
              <Badge tone="success">
                {grantMatches.filter((m) => m.isEligible).length} Eligible Schemes Found
              </Badge>
            }
          >
            <div className="space-y-4">
              {grantMatches.map(({ grant, isEligible, reasons, missingPrerequisites }) => (
                <div
                  key={grant.id}
                  className={cn(
                    'rounded-2xl border p-5 transition-all space-y-3',
                    isEligible
                      ? 'border-success/40 bg-success/5'
                      : 'border-hairline bg-sunken/70 opacity-90',
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-fg text-body-lg">{grant.name}</span>
                        {isEligible ? (
                          <Badge tone="success" variant="solid">
                            <CheckCircle2 className="size-3" aria-hidden="true" />
                            <span>Eligible</span>
                          </Badge>
                        ) : (
                          <Badge tone="warning" variant="outline">
                            <AlertCircle className="size-3" aria-hidden="true" />
                            <span>Pre-requisite Gap</span>
                          </Badge>
                        )}
                      </div>
                      <span className="text-body-xs text-fg-muted block font-mono">{grant.agency}</span>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[11px] text-fg-subtle block font-mono uppercase">MAX FUNDING</span>
                      <span className="font-display text-headline-sm font-bold text-earn-fg tabular-nums">
                        {grant.maxFundingInr >= 10000000
                          ? `₹${(grant.maxFundingInr / 10000000).toFixed(1)} Crore`
                          : `₹${(grant.maxFundingInr / 100000).toFixed(0)} Lakhs`}
                      </span>
                      <span className="text-[11px] text-success-fg block font-semibold">
                        100% Non-Dilutive
                      </span>
                    </div>
                  </div>

                  <p className="text-body-sm text-fg-muted leading-relaxed">{grant.description}</p>

                  <div className="pt-3 border-t border-hairline space-y-2 text-body-xs">
                    {reasons.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-mono font-semibold text-success-fg block">
                          MATCHING ADVANTAGES
                        </span>
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-fg-muted">
                            <span className="text-success-fg font-bold">✓</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {missingPrerequisites.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="font-mono font-semibold text-warning-fg block">
                          ACTION ITEMS TO QUALIFY
                        </span>
                        {missingPrerequisites.map((m, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-fg-muted">
                            <span className="text-warning-fg font-bold">•</span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-body-xs">
                    <span className="text-fg-subtle font-mono">Window: {grant.applicationWindow}</span>
                    <a
                      href={grant.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-display font-semibold text-accent-fg hover:underline"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* VIEW 3: ESCROW & QUORUM SIMULATOR */}
      {activeTab === 'escrow_simulator' && (
        <Panel
          title="How Milestone-Locked Escrow Protects Hardware Backers"
          icon={<ShieldCheck aria-hidden="true" />}
          action={<Badge tone="accent" variant="solid">CRYPTOGRAPHIC &amp; BACKER ESCROW MODEL</Badge>}
        >
          <div className="space-y-6">
            <p className="text-body-sm text-fg-muted leading-relaxed">
              Unlike traditional platforms that disburse 100% of capital upfront, Hackerland holds backer funds in milestone trust. Creators unlock successive tranches only upon submitting verifiable hardware artifacts and passing a 66% backer quorum vote.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-hairline">
              {/* Interactive Inputs */}
              <div className="space-y-5">
                <h3 className="font-display text-body-md font-bold text-fg uppercase tracking-wider">
                  Simulate Milestone Quorum
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-body-xs font-medium text-fg">
                      Total Campaign Goal (₹)
                    </label>
                    <span className="text-body-xs font-mono font-bold text-fg">
                      ₹{simGoalInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200000"
                    max="5000000"
                    step="100000"
                    value={simGoalInr}
                    onChange={(e) => setSimGoalInr(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-body-xs font-medium text-fg">
                      Milestone Tranche (% of Escrow)
                    </label>
                    <span className="text-body-xs font-mono font-bold text-accent-fg">
                      {simTranchePercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={simTranchePercent}
                    onChange={(e) => setSimTranchePercent(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-body-xs font-medium text-fg">
                      Backers Voting &ldquo;Approve Release&rdquo;
                    </label>
                    <span className="text-body-xs font-mono font-bold text-fg">
                      {simVotesFor} of {simTotalVotes} Backers ({Math.round((simVotesFor / simTotalVotes) * 100)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={simTotalVotes}
                    value={simVotesFor}
                    onChange={(e) => setSimVotesFor(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>
              </div>

              {/* Output / Result Card */}
              <div
                className={cn(
                  'rounded-2xl border p-5 flex flex-col justify-between space-y-5',
                  simQuorumResult.passed
                    ? 'border-success/40 bg-success/8'
                    : 'border-warning/40 bg-warning/8',
                )}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-body-xs font-mono font-semibold text-fg-subtle">ESCROW VERDICT</span>
                    <Badge tone={simQuorumResult.passed ? 'success' : 'warning'} variant="solid">
                      {simQuorumResult.passed ? (
                        <>
                          <CheckCircle2 className="size-3" aria-hidden="true" />
                          <span>QUORUM MET (FUNDS RELEASED)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="size-3" aria-hidden="true" />
                          <span>QUORUM FAILED (ESCROW FROZEN)</span>
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-1 p-3.5 rounded-xl border border-hairline">
                      <span className="text-[11px] text-fg-subtle block font-mono">APPROVAL RATE</span>
                      <span className="font-display text-headline-md font-bold text-fg tabular-nums">
                        {simQuorumResult.approvalPercent}%
                      </span>
                      <span className="text-[10px] text-fg-muted block">Min Required: 66%</span>
                    </div>
                    <div className="bg-surface-1 p-3.5 rounded-xl border border-hairline">
                      <span className="text-[11px] text-fg-subtle block font-mono">TRANCHE AMOUNT</span>
                      <span className="font-display text-headline-md font-bold text-earn-fg tabular-nums">
                        ₹{simPayout.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-fg-muted block">{simTranchePercent}% of total</span>
                    </div>
                  </div>

                  <p className="text-body-xs text-fg-muted leading-relaxed">
                    {simQuorumResult.passed
                      ? `With ${simQuorumResult.approvalPercent}% approval, the two-thirds supermajority threshold is achieved. ₹${simPayout.toLocaleString(
                          'en-IN'
                        )} is automatically disbursed to the creator's verified vendor account.`
                      : `Approval is currently at ${simQuorumResult.approvalPercent}%, below the statutory 66% threshold. The tranche of ₹${simPayout.toLocaleString(
                          'en-IN'
                        )} remains locked in custodial escrow until deliverables are rectified.`}
                  </p>
                </div>

                <div className="pt-3 border-t border-hairline text-[11px] text-fg-subtle space-y-1 font-mono">
                  <div>• Smart Escrow Rule: 4-Tranche Model (EVT 25% → DVT 35% → PVT 25% → Dispatch 15%)</div>
                  <div>• Anti-MIA Clause: Unresponsive creators forfeit remaining escrow back to backers</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
