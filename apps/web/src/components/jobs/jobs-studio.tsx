'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import type { HardwareDomain, JobRoleType, LocationType } from '@hackerland/core';
import { formatSalaryRangeInr, filterHardwareJobs, calculateHiringMatchScore } from '@hackerland/core';
import { HARDWARE_JOBS_REGISTRY } from '@/lib/data/jobs-data';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Skill Matcher State
  const [userSkills, setUserSkills] = useState<string[]>(['STM32', 'FreeRTOS', 'CAN Bus', 'KiCad']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showSkillMatcher, setShowSkillMatcher] = useState(false);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return filterHardwareJobs(HARDWARE_JOBS_REGISTRY, {
      domain: selectedDomain,
      roleType: selectedRoleType,
      locationType: selectedLocationType,
      search: searchQuery,
    });
  }, [selectedDomain, selectedRoleType, selectedLocationType, searchQuery]);

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
    <div className="space-y-8">
      {/* Top Banner & Platform Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Briefcase className="size-3.5" />
              <span>Proof-of-Work Hardware Hiring & Residencies</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Deep-Tech Hardware Jobs & Fellowships
            </h1>
            <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">
              No generic HR resume filters. Get hired at India’s premier aerospace, robotics, EV, and semiconductor
              companies based on verified schematics, firmware repositories, oscilloscope captures, and physical
              prototypes built.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-3.5 text-center">
              <span className="text-[10px] text-neutral-400 block font-mono">AVG LEAD PACKAGE</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">₹34 Lakhs</span>
              <span className="text-[10px] text-neutral-500 block">+ Equity Grants</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-900/80 p-3.5 text-center">
              <span className="text-[10px] text-neutral-400 block font-mono">FELLOWSHIP STIPEND</span>
              <span className="text-xl md:text-2xl font-black text-white font-mono">₹75,000/mo</span>
              <span className="text-[10px] text-neutral-500 block">+ ₹5L Fab Grant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proof-of-Work Interactive Skill Matcher Toggle */}
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Proof-of-Work Skill Matcher
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSkillMatcher(!showSkillMatcher)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            {showSkillMatcher ? 'Hide Skill Matcher' : 'Match My Skills to Roles →'}
          </button>
        </div>

        {showSkillMatcher && (
          <div className="pt-3 border-t border-white/10 space-y-3">
            <p className="text-xs text-neutral-400">
              Select or add your technical proficiencies. Each role card will calculate your instant match percentage based on verified hardware requirements.
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = userSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                        : 'border-white/10 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAddCustomSkill} className="flex gap-2 max-w-sm pt-1">
              <input
                type="text"
                placeholder="Add other skill (e.g. Zephyr, I2C, BLE)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="flex-1 bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Filter Bar */}
      <div className="space-y-4">
        {/* Domain Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {DOMAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedDomain === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedDomain(tab.value)}
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

        {/* Sub-Filters: Role Type, Location Type, Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Role Type Filter */}
            <select
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value as JobRoleType | 'all')}
              className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Employment Types</option>
              <option value="full_time">Full-Time Core</option>
              <option value="fellowship">Fellowship & Residency</option>
              <option value="internship">Lab Internship</option>
              <option value="contract_lead">Contract Lead</option>
            </select>

            {/* Location Type Filter */}
            <select
              value={selectedLocationType}
              onChange={(e) => setSelectedLocationType(e.target.value as LocationType | 'all')}
              className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Workplaces</option>
              <option value="onsite_lab">On-Site Hardware Lab</option>
              <option value="hybrid_hardware">Hybrid Hardware</option>
              <option value="remote_firmware">Remote Firmware</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search companies, benches, chips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Jobs Listings Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>{filteredJobs.length} Deep-Tech Openings Found</span>
          <span>Verified DPIIT Indian Startups & Research Labs</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const salaryText = formatSalaryRangeInr(
              job.salaryInr.minLakhs,
              job.salaryInr.maxLakhs,
              job.salaryInr.equityPercent
            );
            const match = calculateHiringMatchScore(userSkills, job.prerequisites);

            return (
              <div
                key={job.id}
                className="group rounded-xl border border-white/10 bg-neutral-900/70 p-5 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all duration-200 space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Info: Company, Title, Badges */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                        <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                      </span>
                      {job.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          FEATURED
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {job.hardwareDomain.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Company, Location & Stage */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="font-semibold text-white">{job.company.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        <span>{job.workLocation}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-neutral-500">{job.company.stage}</span>
                      {job.company.verifiedDpiit && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                          <ShieldCheck className="size-3" />
                          <span>DPIIT Startup India</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Compensation Box */}
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-base sm:text-lg font-black text-emerald-400 font-mono block">
                      {salaryText}
                    </span>
                    {job.fellowshipGrantStipendInr && (
                      <span className="text-[11px] font-mono text-neutral-400 block">
                        Stipend: ₹{job.fellowshipGrantStipendInr.toLocaleString('en-IN')}/mo
                      </span>
                    )}
                    {showSkillMatcher && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span>{match.matchPercent}% Skill Match</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lab Equipment & Test Benches */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                    PHYSICAL LAB BENCHES & TEST EQUIPMENT USED:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.hardwareBenchesUsed.map((bench, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[11px] font-mono bg-neutral-950 text-neutral-300 px-2 py-0.5 rounded border border-white/5"
                      >
                        {bench}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Proof of Work Checklist & Action CTA */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <span className="text-emerald-400 font-bold font-mono">Proof-of-Work:</span>
                    <span className="truncate max-w-md">{job.proofOfWorkRequirements[0]}</span>
                  </div>

                  <Link
                    href={`/jobs/${job.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
                  >
                    <span>View Bench Specs & Apply</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
