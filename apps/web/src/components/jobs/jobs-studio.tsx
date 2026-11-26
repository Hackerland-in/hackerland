'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Cpu,
  Zap,
  Bot,
  Radio,
  Microchip,
  Wrench,
  Search,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  Download,
} from 'lucide-react';
import type { HardwareDomain, JobRoleType, LocationType } from '@hackerland/core';
import { formatSalaryRangeInr, filterHardwareJobs, calculateHiringMatchScore } from '@hackerland/core';
import { Avatar, Badge, Button, Card, CardBody, Chip, FilterChip, Input, Panel, cn } from '@hackerland/ui';
import { HARDWARE_JOBS_REGISTRY } from '@/lib/data/jobs-data';
import { useSocialCommunity } from '@/components/social/social-context';
import type { JobApplicationRecord } from '@/lib/data/community-workflows-store';

const DOMAIN_TABS: { label: string; value: HardwareDomain | 'all'; icon: typeof Cpu }[] = [
  { label: 'All Domains', value: 'all', icon: Briefcase },
  { label: 'Power & BMS', value: 'power_electronics_bms', icon: Zap },
  { label: 'Robotics & UAVs', value: 'robotics_autonomous', icon: Bot },
  { label: 'Embedded Firmware', value: 'embedded_firmware', icon: Cpu },
  { label: 'RISC-V & Silicon', value: 'fpga_silicon', icon: Microchip },
  { label: 'RF & Avionics', value: 'rf_wireless_avionics', icon: Radio },
  { label: 'DFM & Tooling', value: 'mechanical_tooling', icon: Wrench },
];

const POPULAR_SKILLS = [
  'FreeRTOS',
  'STM32',
  'CAN Bus',
  'KiCad',
  'Altium',
  'ROS2',
  'PX4',
  'Verilog',
  'SiC MOSFETs',
  'Inverter FOC',
  'VNA',
  'C++17',
  'HFSS',
  'SolidWorks',
];

export function JobsStudio() {
  const [selectedDomain, setSelectedDomain] = useState<HardwareDomain | 'all'>('all');
  const [selectedRoleType, setSelectedRoleType] = useState<JobRoleType | 'all'>('all');
  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'all' | 'saved' | 'applied'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'salary' | 'match'>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Skill Matcher State
  const [userSkills, setUserSkills] = useState<string[]>(['STM32', 'FreeRTOS', 'CAN Bus', 'KiCad']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showSkillMatcher, setShowSkillMatcher] = useState(false);
  const [syncedProfileNotice, setSyncedProfileNotice] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, JobApplicationRecord>>({});

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  useEffect(() => {
    try {
      const savedApps = localStorage.getItem('hackerland_job_applications');
      if (savedApps) {
        const parsed = JSON.parse(savedApps) as Record<string, JobApplicationRecord>;
        if (parsed && typeof parsed === 'object') setAppliedJobs(parsed);
      }
      const cachedProfile = localStorage.getItem('hackerland_user_profile');
      if (cachedProfile) {
        const prof = JSON.parse(cachedProfile) as { skills?: string[] };
        if (Array.isArray(prof.skills) && prof.skills.length > 0) {
          setUserSkills((prev) => Array.from(new Set([...prev, ...prof.skills!])));
        }
      }
    } catch {}

    let active = true;
    fetch('/api/jobs/_all/apply')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.applications) return;
        setAppliedJobs((prev) => ({
          ...(data.applications as Record<string, JobApplicationRecord>),
          ...prev,
        }));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleSyncProfileSkills = async () => {
    let imported: string[] = [];
    try {
      const cached = localStorage.getItem('hackerland_user_profile');
      if (cached) {
        const prof = JSON.parse(cached) as { skills?: string[] };
        if (Array.isArray(prof.skills)) imported = prof.skills;
      }
      const res = await fetch('/api/me/profile');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.profile?.skills)) {
          imported = Array.from(new Set([...imported, ...data.profile.skills]));
        }
      }
    } catch {}
    if (imported.length > 0) {
      setUserSkills((prev) => Array.from(new Set([...prev, ...imported])));
    }
    setSyncedProfileNotice(true);
    setTimeout(() => setSyncedProfileNotice(false), 2500);
  };

  const savedCount = HARDWARE_JOBS_REGISTRY.filter((j) => isItemSaved(`job:${j.slug}`)).length;
  const appliedCount = HARDWARE_JOBS_REGISTRY.filter((j) => Boolean(appliedJobs[j.slug])).length;

  const filteredJobs = useMemo(() => {
    const base = filterHardwareJobs(HARDWARE_JOBS_REGISTRY, {
      domain: selectedDomain,
      roleType: selectedRoleType,
      locationType: selectedLocationType,
      search: searchQuery,
    }).filter((job) => {
      if (viewMode === 'saved') return isItemSaved(`job:${job.slug}`);
      if (viewMode === 'applied') return Boolean(appliedJobs[job.slug]);
      return true;
    });

    if (sortBy === 'salary') {
      return [...base].sort((a, b) => b.salaryInr.maxLakhs - a.salaryInr.maxLakhs);
    }
    if (sortBy === 'match') {
      return [...base].sort((a, b) => {
        const mA = calculateHiringMatchScore(userSkills, a.prerequisites).matchPercent;
        const mB = calculateHiringMatchScore(userSkills, b.prerequisites).matchPercent;
        return mB - mA;
      });
    }
    return [...base].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [
    selectedDomain,
    selectedRoleType,
    selectedLocationType,
    searchQuery,
    viewMode,
    sortBy,
    userSkills,
    isItemSaved,
    appliedJobs,
  ]);

  const handleToggleSkill = (skill: string) => {
    if (userSkills.includes(skill)) {
      setUserSkills(userSkills.filter((s) => s !== skill));
    } else {
      setUserSkills([...userSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !userSkills.includes(customSkillInput.trim())) {
      setUserSkills([...userSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Top Banner & Platform Value Proposition */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Briefcase className="size-3.5" aria-hidden="true" />
              <span>Proof-of-Work Hardware Hiring &amp; Residencies</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Deep-Tech Hardware Jobs &amp; Fellowships
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
              No generic HR resume filters. Get hired at India’s premier aerospace, robotics, EV, and semiconductor teams based on verified schematics, firmware repositories, oscilloscope traces, and physical builds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="rounded-xl border border-hairline bg-surface-1/90 p-3.5 text-center shadow-xs">
              <span className="text-[10px] text-fg-subtle block font-mono uppercase">AVG LEAD PACKAGE</span>
              <span className="font-display text-headline-sm sm:text-headline-md font-bold text-earn-fg tabular-nums">
                ₹34 Lakhs
              </span>
              <span className="text-[11px] text-fg-muted block">+ Equity Grants</span>
            </div>
            <div className="rounded-xl border border-hairline bg-surface-1/90 p-3.5 text-center shadow-xs">
              <span className="text-[10px] text-fg-subtle block font-mono uppercase">FELLOWSHIP STIPEND</span>
              <span className="font-display text-headline-sm sm:text-headline-md font-bold text-accent-fg tabular-nums">
                ₹75,000/mo
              </span>
              <span className="text-[11px] text-fg-muted block">+ ₹5L Fab Grant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Proof-of-Work Interactive Skill Matcher Toggle */}
      <Panel
        title="Proof-of-Work Skill Matcher"
        icon={<Sparkles aria-hidden="true" />}
        action={
          <div className="flex flex-wrap items-center gap-3">
            {showSkillMatcher && (
              <button
                type="button"
                onClick={handleSyncProfileSkills}
                className="inline-flex items-center gap-1 text-body-xs font-display font-medium text-fg-muted hover:text-accent-fg transition-colors"
              >
                <Download className="size-3.5" aria-hidden="true" />
                <span>{syncedProfileNotice ? 'Synced!' : 'Sync Profile Skills'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSkillMatcher(!showSkillMatcher)}
              className="text-body-sm font-display font-semibold text-accent-fg hover:underline transition-colors"
            >
              {showSkillMatcher ? 'Hide Skill Matcher' : 'Match My Skills to Roles →'}
            </button>
          </div>
        }
      >
        {showSkillMatcher ? (
          <div className="space-y-3 pt-1">
            <p className="text-body-sm text-fg-muted">
              Select or add your technical proficiencies. Each role card calculates your instant match percentage based on verified hardware prerequisites.
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = userSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    aria-pressed={isSelected}
                    className={cn(
                      'px-3 py-1 rounded-full text-body-xs font-mono transition-colors border',
                      isSelected
                        ? 'border-accent bg-accent text-on-solid font-semibold shadow-xs'
                        : 'border-hairline bg-sunken text-fg-muted hover:border-accent/40 hover:text-fg',
                    )}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddCustomSkill} className="flex flex-wrap sm:flex-nowrap gap-2 max-w-md pt-1">
              <Input
                type="text"
                placeholder="Add other skill (e.g. Zephyr, I2C, BLE)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="h-9 flex-1 text-body-sm"
              />
              <Button type="submit" variant="primary" size="sm">
                Add
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 text-body-xs text-fg-muted">
            <span>Matching against:</span>
            {userSkills.slice(0, 6).map((s) => (
              <Chip key={s} tone="accent">
                {s}
              </Chip>
            ))}
          </div>
        )}
      </Panel>

      {/* Main Filter Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-hairline">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'saved', 'applied'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-body-xs font-display font-semibold transition-all',
                  viewMode === mode
                    ? 'bg-accent text-on-solid shadow-xs'
                    : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                )}
              >
                {mode === 'all'
                  ? `All Roles (${HARDWARE_JOBS_REGISTRY.length})`
                  : mode === 'saved'
                  ? `Saved (${savedCount})`
                  : `Applied (${appliedCount})`}
              </button>
            ))}
          </div>

          <select
            aria-label="Sort hardware roles"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'salary' | 'match')}
            className="h-9 rounded-full border border-line bg-sunken px-3.5 text-body-xs font-display font-semibold text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="match">Sort: Best Skill Match %</option>
            <option value="salary">Sort: Highest Package</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DOMAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDomain === tab.value;
            return (
              <FilterChip
                key={tab.value}
                selected={isSelected}
                tone="accent"
                onClick={() => setSelectedDomain(tab.value)}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span>{tab.label}</span>
              </FilterChip>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-hairline">
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by employment type"
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value as JobRoleType | 'all')}
              className="h-9 rounded-full border border-line bg-sunken px-3.5 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            >
              <option value="all">All Employment Types</option>
              <option value="full_time">Full-Time Core</option>
              <option value="fellowship">Fellowship &amp; Residency</option>
              <option value="internship">Lab Internship</option>
              <option value="contract_lead">Contract Lead</option>
            </select>

            <select
              aria-label="Filter by workplace type"
              value={selectedLocationType}
              onChange={(e) => setSelectedLocationType(e.target.value as LocationType | 'all')}
              className="h-9 rounded-full border border-line bg-sunken px-3.5 text-body-sm text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            >
              <option value="all">All Workplaces</option>
              <option value="onsite_lab">On-Site Hardware Lab</option>
              <option value="hybrid_hardware">Hybrid Hardware</option>
              <option value="remote_firmware">Remote Firmware</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search companies, benches, chips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-9 pr-3.5 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Jobs Listings Directory */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs text-fg-subtle font-mono px-1">
          <span>{filteredJobs.length} Deep-Tech Openings Found</span>
          <span>Verified DPIIT Indian Startups &amp; Research Labs</span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface-1 p-10 text-center space-y-2">
            <p className="font-display text-headline-sm font-semibold text-fg">
              No roles match this filter yet
            </p>
            <Button variant="secondary" size="sm" onClick={() => setViewMode('all')}>
              View all roles
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const salaryText = formatSalaryRangeInr(
                job.salaryInr.minLakhs,
                job.salaryInr.maxLakhs,
                job.salaryInr.equityPercent
              );
              const match = calculateHiringMatchScore(userSkills, job.prerequisites);
              const saved = isItemSaved(`job:${job.slug}`);
              const isApplied = Boolean(appliedJobs[job.slug]);

              return (
                <Card
                  key={job.id}
                  className="group transition-all hover:border-accent/40 min-w-0 [overflow-wrap:anywhere]"
                >
                  <CardBody className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left Info */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <Avatar name={job.company.name} size="md" className="shrink-0 mt-0.5" />
                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge tone="accent" variant="outline">
                              {job.hardwareDomain.replace(/_/g, ' ')}
                            </Badge>
                            {job.featured && (
                              <Badge tone="warning" variant="solid">
                                FEATURED
                              </Badge>
                            )}
                            {job.company.verifiedDpiit && (
                              <Badge tone="success" variant="outline">
                                <ShieldCheck className="size-3" aria-hidden="true" />
                                <span>DPIIT Startup India</span>
                              </Badge>
                            )}
                            {isApplied && (
                              <Badge tone="success" variant="solid">
                                <CheckCircle2 className="size-3" aria-hidden="true" />
                                <span>Applied</span>
                              </Badge>
                            )}
                          </div>

                          <h2 className="font-display text-headline-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                            <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                          </h2>

                          <div className="flex flex-wrap items-center gap-2.5 text-body-xs text-fg-muted">
                            <span className="font-display font-semibold text-fg">{job.company.name}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3.5 text-fg-subtle" aria-hidden="true" />
                              <span>{job.workLocation}</span>
                            </span>
                            <span>•</span>
                            <span className="font-mono text-fg-subtle">{job.company.stage}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Compensation + Save */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-left sm:text-right">
                          <span className="font-display text-headline-sm font-bold text-earn-fg tabular-nums block">
                            {salaryText}
                          </span>
                          {job.fellowshipGrantStipendInr && (
                            <span className="text-[11px] font-mono text-fg-subtle block">
                              Stipend: ₹{job.fellowshipGrantStipendInr.toLocaleString('en-IN')}/mo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {(showSkillMatcher || sortBy === 'match') && (
                            <Badge tone="accent" variant="solid">
                              {match.matchPercent}% Skill Match
                            </Badge>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleSaveItem(`job:${job.slug}`)}
                            aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
                            aria-pressed={saved}
                            className={cn(
                              'flex size-8 items-center justify-center rounded-full border transition-colors',
                              saved
                                ? 'border-accent/40 bg-accent-soft text-accent-fg'
                                : 'border-hairline bg-surface-2/60 text-fg-subtle hover:border-accent/30 hover:text-accent-fg',
                            )}
                          >
                            <Bookmark className={cn('size-3.5', saved && 'fill-current')} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Lab Equipment & Test Benches */}
                    <div className="pt-3 border-t border-hairline space-y-1.5">
                      <span className="font-display text-[11px] text-fg-subtle uppercase tracking-wider block">
                        Physical Lab Benches &amp; Test Equipment
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.hardwareBenchesUsed.map((bench, bIdx) => (
                          <span
                            key={bIdx}
                            className="rounded-lg border border-hairline bg-sunken px-2.5 py-1 text-[11px] font-mono text-fg-muted"
                          >
                            {bench}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Proof of Work Checklist & Action CTA */}
                    <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-xs">
                      <div className="flex items-start sm:items-center gap-2 text-fg-muted min-w-0">
                        <span className="text-accent-fg font-display font-bold shrink-0">Proof-of-Work:</span>
                        <span className="truncate">{job.proofOfWorkRequirements[0]}</span>
                      </div>

                      <Button asChild variant="soft" size="sm" className="shrink-0 self-start sm:self-auto">
                        <Link href={`/jobs/${job.slug}`}>
                          <span>{isApplied ? 'View Application' : 'View Bench Specs & Apply'}</span>
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
