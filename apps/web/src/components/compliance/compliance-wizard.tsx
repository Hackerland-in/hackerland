'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ComplianceRoadmapItem } from '@hackerland/core';
import { matchComplianceRequirements, formatComplianceCost } from '@hackerland/core';

interface ComplianceWizardProps {
  initialRoadmaps: ComplianceRoadmapItem[];
}

export function ComplianceWizard({ initialRoadmaps }: ComplianceWizardProps) {
  // Feature checkboxes
  const [hasWirelessRf, setHasWirelessRf] = useState<boolean>(true);
  const [hasLiIonBattery, setHasLiIonBattery] = useState<boolean>(true);
  const [isAutomotiveEv, setIsAutomotiveEv] = useState<boolean>(false);
  const [isDroneUav, setIsDroneUav] = useState<boolean>(false);
  const [hasMainsAcSmps, setHasMainsAcSmps] = useState<boolean>(false);
  const [isTelecomModem, setIsTelecomModem] = useState<boolean>(false);
  const [isMedicalBio, setIsMedicalBio] = useState<boolean>(false);

  // Category filter for roadmap catalog below
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const evaluation = useMemo(() => {
    return matchComplianceRequirements({
      hasWirelessRf,
      hasLiIonBattery,
      isAutomotiveEv,
      isDroneUav,
      hasMainsAcSmps,
      isTelecomModem,
      isMedicalBio,
    });
  }, [
    hasWirelessRf,
    hasLiIonBattery,
    isAutomotiveEv,
    isDroneUav,
    hasMainsAcSmps,
    isTelecomModem,
    isMedicalBio,
  ]);

  const filteredRoadmaps = useMemo(() => {
    return initialRoadmaps.filter((rm) => {
      if (selectedCategory !== 'all' && rm.productCategory !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = rm.title.toLowerCase().includes(q);
        const matchTag = rm.tagline.toLowerCase().includes(q);
        const matchStandards = rm.applicableStandards.some((s) =>
          s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
        );
        if (!matchTitle && !matchTag && !matchStandards) {
          return false;
        }
      }
      return true;
    });
  }, [initialRoadmaps, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-medium tracking-wider text-amber-400 uppercase">
            Indian Statutory Hardware Compliance Engine
          </span>
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Hardware Regulatory &amp; NABL Lab Certification Wizard
        </h1>
        <p className="mt-2 text-sm text-stone-400 max-w-3xl leading-relaxed">
          Navigate the complex maze of Indian hardware regulations (BIS CRS, WPC ETA, TEC MTCTE, DGCA Type Certification, and AIS-156). Calculate NABL laboratory testing CapEx, sample requirements, and testing turnaround times in seconds.
        </p>
      </div>

      {/* Interactive 30-Second Hardware Feature Profiler */}
      <div className="rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-stone-800/80 pb-4">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <span>⚡ 30-SECOND HARDWARE REGULATORY PROFILER</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Select your physical hardware subsystem features to trigger applicable Indian statutory acts
          </p>
        </div>

        {/* Checkbox matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={hasWirelessRf}
              onChange={(e) => setHasWirelessRf(e.target.checked)}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">Wireless RF (Wi-Fi/BLE/LoRa)</span>
          </label>

          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={hasLiIonBattery}
              onChange={(e) => setHasLiIonBattery(e.target.checked)}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">Lithium-ion Battery Pack</span>
          </label>

          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={isAutomotiveEv}
              onChange={(e) => {
                setIsAutomotiveEv(e.target.checked);
                if (e.target.checked) setHasLiIonBattery(true);
              }}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">Electric Vehicle Traction Pack</span>
          </label>

          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={isDroneUav}
              onChange={(e) => {
                setIsDroneUav(e.target.checked);
                if (e.target.checked) {
                  setHasWirelessRf(true);
                  setHasLiIonBattery(true);
                }
              }}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">Commercial / Agri Drone UAV</span>
          </label>

          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={hasMainsAcSmps}
              onChange={(e) => setHasMainsAcSmps(e.target.checked)}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">Mains 230V AC Power Supply</span>
          </label>

          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={isTelecomModem}
              onChange={(e) => setIsTelecomModem(e.target.checked)}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">4G/5G Cellular Gateway / Router</span>
          </label>

          <label className="flex items-center space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/40 p-3 cursor-pointer hover:border-stone-700 transition-all select-none">
            <input
              type="checkbox"
              checked={isMedicalBio}
              onChange={(e) => setIsMedicalBio(e.target.checked)}
              className="h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-mono text-stone-200">Medical Diagnostic / Body Contact</span>
          </label>
        </div>

        {/* Dynamic Statutory Evaluation Results Strip */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase block">
                STATUTORY BODIES TRIGGERED
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {evaluation.bodiesTriggered.length === 0 ? (
                  <span className="text-xs font-mono text-stone-500">
                    No mandatory statutory certifications triggered with current configuration.
                  </span>
                ) : (
                  evaluation.bodiesTriggered.map((b) => (
                    <span
                      key={b}
                      className="rounded-lg border border-amber-500/50 bg-amber-950/40 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-300 uppercase"
                    >
                      {b.replace('_', ' ')}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="rounded-xl border border-stone-800 bg-black/60 px-3 py-1.5 text-center">
                <span className="text-stone-500 block text-[10px]">EST. TESTING CAPEX</span>
                <span className="text-emerald-400 font-bold">
                  {formatComplianceCost(evaluation.estimatedBaseCostInr)}
                </span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-black/60 px-3 py-1.5 text-center">
                <span className="text-stone-500 block text-[10px]">TOTAL LEAD TIME</span>
                <span className="text-white font-bold">{evaluation.estimatedTotalWeeks} Weeks</span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-black/60 px-3 py-1.5 text-center">
                <span className="text-stone-500 block text-[10px]">SAMPLES CONSUMED</span>
                <span className="text-sky-400 font-bold">{evaluation.sampleUnitsNeeded} Units</span>
              </div>
            </div>
          </div>

          {/* Triggered Standards List */}
          {evaluation.primaryStandards.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase block">
                MANDATORY STATUTORY STANDARDS &amp; ORDERS:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono text-stone-300">
                {evaluation.primaryStandards.map((std, idx) => (
                  <li key={idx} className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Catalog Search & Category Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <svg className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roadmaps by standard (e.g. IS 16046, AIS-156, Rule 8)..."
            className="w-full bg-transparent font-mono text-xs text-white placeholder:text-stone-600 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
        >
          <option value="all">All Domains</option>
          <option value="drone_uav">Drones &amp; UAVs</option>
          <option value="ev_powertrain">EV &amp; Battery Packs</option>
          <option value="iot_wireless">Smart Meters &amp; LoRa</option>
          <option value="power_adapter">AC-DC Power Adapters</option>
          <option value="telecom_networking">Cellular Routers</option>
          <option value="medical_device">Medical Diagnostics</option>
        </select>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoadmaps.map((rm) => (
          <div
            key={rm.id}
            className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm transition-all hover:border-stone-700"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {rm.statutoryBodies.map((b) => (
                  <span
                    key={b}
                    className="rounded-md border border-amber-500/40 bg-amber-950/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 uppercase"
                  >
                    {b.replace('_', ' ')}
                  </span>
                ))}
              </div>

              <div>
                <Link
                  href={`/compliance/${rm.slug}`}
                  className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                >
                  {rm.title}
                </Link>
                <p className="mt-1 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {rm.tagline}
                </p>
              </div>

              {/* Standards Badge List */}
              <div className="space-y-1 pt-1 border-t border-stone-900">
                <span className="text-[10px] font-mono text-stone-500 block">KEY STANDARDS:</span>
                <div className="flex flex-wrap gap-1">
                  {rm.applicableStandards.map((std) => (
                    <span
                      key={std.code}
                      className="rounded border border-stone-800 bg-stone-900/60 px-1.5 py-0.5 text-[10px] font-mono text-stone-300"
                    >
                      {std.code}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lab Quotes Summary */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-900">
                <div>
                  <span className="text-[10px] text-stone-500 block">EST. TESTING COST</span>
                  <span className="text-emerald-400 font-bold">
                    {formatComplianceCost(rm.estimatedTotalTestingCostInr.minInr)} -{' '}
                    {formatComplianceCost(rm.estimatedTotalTestingCostInr.maxInr)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">TOTAL LEAD TIME</span>
                  <span className="text-white font-bold">
                    {rm.estimatedTimelineWeeks.minWeeks} - {rm.estimatedTimelineWeeks.maxWeeks} Weeks
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 border-t border-stone-800/80 pt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-stone-500">
                {rm.recommendedLabs.length} NABL Labs Benchmarked
              </span>
              <Link
                href={`/compliance/${rm.slug}`}
                className="rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-1.5 text-xs font-mono text-stone-300 hover:border-stone-700 hover:text-white transition-all"
              >
                View Roadmap →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
