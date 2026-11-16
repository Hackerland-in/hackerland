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
  TrendingUp,
  Cpu,
  HeartPulse,
  Leaf,
  Zap,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Campaign, CampaignCategory } from '@hackerland/core';
import {
  calculateCampaignProgress,
  calculateMilestonePayout,
  verifyMilestoneQuorum,
  matchGrantsForProject,
} from '@hackerland/core';
import { INDIAN_GOVT_GRANTS, CAMPAIGN_REGISTRY } from '@/lib/data/launchpad-data';

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

  // Filtered Campaigns
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

  // Grant Matching Calculation
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

  // Escrow Quorum Calculation
  const simQuorumResult = useMemo(() => {
    return verifyMilestoneQuorum(simVotesFor, simTotalVotes);
  }, [simVotesFor, simTotalVotes]);

  const simPayout = useMemo(() => {
    return calculateMilestonePayout(simGoalInr, simTranchePercent);
  }, [simGoalInr, simTranchePercent]);

  return (
    <div className="space-y-8">
      {/* Top Banner & Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Lock className="size-3.5" />
              <span>Milestone-Locked Hardware Escrow + Non-Dilutive Grants</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Hardware Launchpad & Grant Matcher
            </h1>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
              Back breakthrough physical hardware with zero upfront lump-sum risk. Funds are locked in smart escrow,
              released strictly upon peer-verified engineering milestones (EVT, DVT, PVT), with automated eligibility
              matching for Indian Government innovation grants (iDEX, BIRAC BIG, DST NIDHI-PRAYAS).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 shrink-0">
            <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-3.5 text-center">
              <span className="text-xs text-neutral-400 block font-mono">ESCROW LOCKED</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">₹47.5 Lakhs</span>
              <span className="text-[10px] text-neutral-500 block">Across 5 Active Runs</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-3.5 text-center">
              <span className="text-xs text-neutral-400 block font-mono">QUORUM PASS RATE</span>
              <span className="text-xl md:text-2xl font-black text-white font-mono">92.4%</span>
              <span className="text-[10px] text-neutral-500 block">&gt;66% Backer Vote Req</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 bg-neutral-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'campaigns'
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Rocket className="size-4" />
            <span>Active Campaigns ({CAMPAIGN_REGISTRY.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grant_matcher')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'grant_matcher'
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="size-4" />
            <span>Govt Grant Matcher ({INDIAN_GOVT_GRANTS.length} Schemes)</span>
          </button>
          <button
            onClick={() => setActiveTab('escrow_simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'escrow_simulator'
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>Escrow & Quorum Simulator</span>
          </button>
        </div>

        {activeTab === 'campaigns' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search campaigns, chips, makers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: ACTIVE CAMPAIGNS DIRECTORY */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      : 'border-white/10 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp) => {
              const { percent, isFunded } = calculateCampaignProgress(camp.raisedInr, camp.fundingGoalInr);
              const activeMilestone = camp.milestones.find(
                (m) => m.status === 'submitted_for_review' || m.status === 'pending'
              ) || camp.milestones[camp.milestones.length - 1];

              return (
                <div
                  key={camp.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-neutral-900/70 p-5 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Header: Category & TRL Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {camp.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md">
                        TRL {camp.trlLevel}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <Link
                        href={`/launchpad/${camp.slug}`}
                        className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 block"
                      >
                        {camp.title}
                      </Link>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {camp.tagline}
                      </p>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400">
                      <span className="font-medium text-white">{camp.creator.name}</span>
                      <span>•</span>
                      <span>{camp.creator.organization}</span>
                      {camp.creator.dpiitRegistered && (
                        <span className="inline-flex items-center text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          DPIIT Verified
                        </span>
                      )}
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-mono font-bold text-white text-sm">
                          ₹{(camp.raisedInr / 100000).toFixed(2)} Lakhs
                        </span>
                        <span className="text-neutral-400 text-[11px]">
                          {percent}% of ₹{(camp.fundingGoalInr / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFunded ? 'bg-emerald-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, percent)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                        <span>{camp.backersCount} Backers</span>
                        <span>{camp.daysLeft} Days Left</span>
                      </div>
                    </div>

                    {/* Milestone State Box */}
                    {activeMilestone && (
                      <div className="rounded-lg border border-white/10 bg-neutral-950/60 p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">ACTIVE ESCROW TRANCHE</span>
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              activeMilestone.status === 'verified'
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : activeMilestone.status === 'submitted_for_review'
                                ? 'text-amber-400 bg-amber-500/10'
                                : 'text-neutral-400 bg-neutral-800'
                            }`}
                          >
                            {activeMilestone.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white font-medium text-xs truncate">{activeMilestone.title}</p>
                        {activeMilestone.status === 'submitted_for_review' && (
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 pt-1">
                            <Vote className="size-3 shrink-0" />
                            <span>Quorum: {activeMilestone.backerApprovalVotePercent}% / 66% needed</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {camp.backerTiers.length} Reward Tiers Available
                    </span>
                    <Link
                      href={`/launchpad/${camp.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Inspect Escrow</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INDIAN GOVT NON-DILUTIVE GRANT MATCHER */}
      {activeTab === 'grant_matcher' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Assessment Questionnaire (5 cols) */}
          <div className="lg:col-span-5 rounded-xl border border-white/10 bg-neutral-900/80 p-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md mb-2">
                <Sparkles className="size-3.5" />
                <span>NON-DILUTIVE GRANT ENGINE</span>
              </div>
              <h2 className="text-lg font-bold text-white">Project Eligibility Profile</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Configure your hardware startup details to instantly check statutory eligibility against Indian
                central government innovation schemes.
              </p>
            </div>

            {/* Sector Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300 block">Technology Domain:</label>
              <select
                value={matcherCategory}
                onChange={(e) => setMatcherCategory(e.target.value as CampaignCategory)}
                className="w-full bg-neutral-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="defence_aerospace">Defence, Aerospace & Tactical Drones</option>
                <option value="medtech_assistive">Healthcare, Medtech & Assistive Hardware</option>
                <option value="agritech_iot">Agritech, Environmental & Rural IoT</option>
                <option value="clean_energy">Clean Energy, Batteries & EV Powertrains</option>
                <option value="semiconductors">Semiconductors, RISC-V & VLSI Design</option>
                <option value="robotics_automation">Robotics & Industrial Automation</option>
              </select>
            </div>

            {/* TRL Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-medium text-neutral-300">Technology Readiness Level (TRL):</label>
                <span className="text-xs font-mono font-bold text-emerald-400">TRL {matcherTrl}</span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                value={matcherTrl}
                onChange={(e) => setMatcherTrl(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded-lg border border-white/5 font-mono">
                {TRL_DESCRIPTIONS[matcherTrl]}
              </p>
            </div>

            {/* DPIIT Recognition Toggle */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-medium text-neutral-300 block">
                Startup India DPIIT Recognition:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMatcherDpiit(true)}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    matcherDpiit
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'border-white/10 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  ✓ Registered DPIIT Entity
                </button>
                <button
                  type="button"
                  onClick={() => setMatcherDpiit(false)}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                    !matcherDpiit
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'border-white/10 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  Unregistered / Student Team
                </button>
              </div>
            </div>

            {/* Indian Ownership Slider */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-medium text-neutral-300">Indian Resident Shareholding (%):</label>
                <span className="text-xs font-mono font-bold text-white">{matcherOwnership}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={matcherOwnership}
                onChange={(e) => setMatcherOwnership(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-500 block">
                Statutory requirement: Most Indian grant programs mandate &ge; 51% Indian equity ownership.
              </span>
            </div>
          </div>

          {/* Right Column: Ranked Scheme Matches (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="size-4 text-emerald-400" />
                <span>Grant Matching Results ({grantMatches.length} Evaluated)</span>
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {grantMatches.filter((m) => m.isEligible).length} Eligible Schemes Found
              </span>
            </div>

            <div className="space-y-4">
              {grantMatches.map(({ grant, fitScore, isEligible, reasons, missingPrerequisites }) => (
                <div
                  key={grant.id}
                  className={`rounded-xl border p-5 transition-all ${
                    isEligible
                      ? 'border-emerald-500/40 bg-emerald-950/15 hover:border-emerald-500/60'
                      : 'border-white/10 bg-neutral-900/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{grant.name}</span>
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="size-3" />
                            Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                            <AlertCircle className="size-3" />
                            Pre-requisite Gap
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400 block font-mono">{grant.agency}</span>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-neutral-400 block font-mono">MAX FUNDING</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {grant.maxFundingInr >= 10000000
                          ? `₹${(grant.maxFundingInr / 10000000).toFixed(1)} Crore`
                          : `₹${(grant.maxFundingInr / 100000).toFixed(0)} Lakhs`}
                      </span>
                      <span className="text-[10px] text-emerald-500 block font-semibold">100% Non-Dilutive</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 mt-3 leading-relaxed">{grant.description}</p>

                  {/* Matching Feedback */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
                    {reasons.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-semibold text-emerald-400 block">
                          MATCHING ADVANTAGES:
                        </span>
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-neutral-300 text-xs">
                            <span className="text-emerald-400">✓</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {missingPrerequisites.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-mono font-semibold text-amber-400 block">
                          ACTION ITEMS TO QUALIFY:
                        </span>
                        {missingPrerequisites.map((m, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-neutral-400 text-xs">
                            <span className="text-amber-400">•</span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer & Portal Link */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-mono text-[11px]">
                      Window: {grant.applicationWindow}
                    </span>
                    <a
                      href={grant.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ESCROW & QUORUM SIMULATOR */}
      {activeTab === 'escrow_simulator' && (
        <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-6 md:p-8 space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              <ShieldCheck className="size-3.5" />
              <span>CRYPTOGRAPHIC & BACKER ESCROW MODEL</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">How Milestone-Locked Escrow Protects Hardware Backers</h2>
            <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">
              Unlike traditional platforms where campaigns receive 100% of capital immediately and often run out of
              cash during manufacturing tooling, Hackerland holds all backer funds in trust. Creators only unlock
              successive tranches upon uploading verifiable test artifacts (Gerbers, high-speed camera footage,
              calibration logs) and passing a mandatory 66% backer quorum vote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
            {/* Interactive Inputs */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Simulate Milestone Quorum
              </h3>

              {/* Goal Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-medium text-neutral-300">Total Campaign Goal (₹):</label>
                  <span className="text-xs font-mono font-bold text-white">₹{simGoalInr.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="5000000"
                  step="100000"
                  value={simGoalInr}
                  onChange={(e) => setSimGoalInr(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Tranche Percent */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-medium text-neutral-300">Milestone Tranche (% of Escrow):</label>
                  <span className="text-xs font-mono font-bold text-emerald-400">{simTranchePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={simTranchePercent}
                  onChange={(e) => setSimTranchePercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Backer Votes */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-medium text-neutral-300">Backers Voting "Approve Release":</label>
                  <span className="text-xs font-mono font-bold text-white">
                    {simVotesFor} of {simTotalVotes} Backers ({Math.round((simVotesFor / simTotalVotes) * 100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={simTotalVotes}
                  value={simVotesFor}
                  onChange={(e) => setSimVotesFor(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Output / Result Card */}
            <div
              className={`rounded-xl border p-6 flex flex-col justify-between space-y-6 ${
                simQuorumResult.passed
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">ESCROW VERDICT</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      simQuorumResult.passed
                        ? 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/30'
                        : 'text-amber-400 bg-amber-500/20 border border-amber-500/30'
                    }`}
                  >
                    {simQuorumResult.passed ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        <span>QUORUM MET (FUNDS RELEASED)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="size-3.5" />
                        <span>QUORUM FAILED (ESCROW FROZEN)</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-neutral-950/60 p-3.5 rounded-lg border border-white/5">
                    <span className="text-[11px] text-neutral-400 block font-mono">APPROVAL RATE</span>
                    <span className="text-2xl font-bold font-mono text-white">{simQuorumResult.approvalPercent}%</span>
                    <span className="text-[10px] text-neutral-500 block">Min Required: 66%</span>
                  </div>
                  <div className="bg-neutral-950/60 p-3.5 rounded-lg border border-white/5">
                    <span className="text-[11px] text-neutral-400 block font-mono">TRANCHE AMOUNT</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      ₹{simPayout.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">{simTranchePercent}% of total</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {simQuorumResult.passed
                    ? `With ${simQuorumResult.approvalPercent}% approval, the two-thirds supermajority threshold is achieved. ₹${simPayout.toLocaleString(
                        'en-IN'
                      )} is automatically disbursed to the creator's verified vendor account.`
                    : `Approval is currently at ${simQuorumResult.approvalPercent}%, which is below the statutory 66% threshold. The tranche of ₹${simPayout.toLocaleString(
                        'en-IN'
                      )} remains locked in custodial escrow until deliverables are rectified.`}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 text-[11px] text-neutral-400 space-y-1 font-mono">
                <div>• Smart Escrow Rule: 4-Tranche Model (EVT 25% → DVT 35% → PVT 25% → Dispatch 15%)</div>
                <div>• Anti-MIA Clause: Unresponsive creators forfeit remaining escrow back to backers</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
