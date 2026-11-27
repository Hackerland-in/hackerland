'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, cn } from '@hackerland/ui';
import { Search, ShieldCheck, ArrowRight } from 'lucide-react';
import type { ComplianceRoadmapItem } from '@hackerland/core';
import { matchComplianceRequirements, formatComplianceCost } from '@hackerland/core';

interface ComplianceWizardProps {
  initialRoadmaps: ComplianceRoadmapItem[];
}

export function ComplianceWizard({ initialRoadmaps }: ComplianceWizardProps) {
  const [hasWirelessRf, setHasWirelessRf] = useState<boolean>(true);
  const [hasLiIonBattery, setHasLiIonBattery] = useState<boolean>(true);
  const [isAutomotiveEv, setIsAutomotiveEv] = useState<boolean>(false);
  const [isDroneUav, setIsDroneUav] = useState<boolean>(false);
  const [hasMainsAcSmps, setHasMainsAcSmps] = useState<boolean>(false);
  const [isTelecomModem, setIsTelecomModem] = useState<boolean>(false);
  const [isMedicalBio, setIsMedicalBio] = useState<boolean>(false);

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
      if (selectedCategory !== 'all' && rm.productCategory !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = rm.title.toLowerCase().includes(q);
        const matchTag = rm.tagline.toLowerCase().includes(q);
        const matchStandards = rm.applicableStandards.some(
          (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
        );
        if (!matchTitle && !matchTag && !matchStandards) return false;
      }
      return true;
    });
  }, [initialRoadmaps, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          <span>Indian Statutory Hardware Compliance Engine</span>
        </div>
        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
          Hardware Regulatory &amp; NABL Lab Certification Wizard
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
          Navigate BIS CRS, WPC ETA, TEC MTCTE, DGCA Type Certification, and AIS-156. Estimate NABL testing CapEx, sample units, and turnaround times in seconds.
        </p>
      </header>

      {/* Interactive 30-Second Profiler */}
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="border-b border-hairline pb-3">
          <h2 className="font-mono text-xs font-bold text-fg uppercase tracking-wider">
            ⚡ 30-SECOND HARDWARE REGULATORY PROFILER
          </h2>
          <p className="text-body-xs text-fg-muted mt-0.5">
            Select your hardware subsystem features to evaluate mandatory Indian certification acts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              label: 'Wireless RF (Wi-Fi/BLE/LoRa)',
              checked: hasWirelessRf,
              onChange: (c: boolean) => setHasWirelessRf(c),
            },
            {
              label: 'Lithium-ion Battery Pack',
              checked: hasLiIonBattery,
              onChange: (c: boolean) => setHasLiIonBattery(c),
            },
            {
              label: 'Electric Vehicle Traction Pack',
              checked: isAutomotiveEv,
              onChange: (c: boolean) => {
                setIsAutomotiveEv(c);
                if (c) setHasLiIonBattery(true);
              },
            },
            {
              label: 'Commercial / Agri Drone UAV',
              checked: isDroneUav,
              onChange: (c: boolean) => {
                setIsDroneUav(c);
                if (c) {
                  setHasWirelessRf(true);
                  setHasLiIonBattery(true);
                }
              },
            },
            {
              label: 'Mains 230V AC Power Supply',
              checked: hasMainsAcSmps,
              onChange: (c: boolean) => setHasMainsAcSmps(c),
            },
            {
              label: '4G/5G Cellular Gateway / Router',
              checked: isTelecomModem,
              onChange: (c: boolean) => setIsTelecomModem(c),
            },
            {
              label: 'Medical Diagnostic / Body Contact',
              checked: isMedicalBio,
              onChange: (c: boolean) => setIsMedicalBio(c),
            },
          ].map((item) => (
            <label
              key={item.label}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors select-none',
                item.checked
                  ? 'border-accent/40 bg-accent-soft/50 text-fg'
                  : 'border-hairline bg-sunken/70 text-fg-muted hover:border-accent/30',
              )}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                className="size-4 rounded border-line accent-accent shrink-0"
              />
              <span className="text-body-xs font-mono font-medium">{item.label}</span>
            </label>
          ))}
        </div>

        {/* Dynamic Results Strip */}
        <div className="rounded-xl border border-hairline bg-sunken p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hairline pb-3">
            <div>
              <span className="text-[10px] font-mono text-fg-subtle uppercase block">
                STATUTORY BODIES TRIGGERED
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {evaluation.bodiesTriggered.length === 0 ? (
                  <span className="text-body-xs font-mono text-fg-muted">
                    No mandatory statutory certifications triggered with current configuration.
                  </span>
                ) : (
                  evaluation.bodiesTriggered.map((b) => (
                    <Badge key={b} tone="accent" variant="outline">
                      {b.replace('_', ' ').toUpperCase()}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
              <div className="rounded-xl border border-hairline bg-surface-1 px-3 py-1.5 text-center">
                <span className="text-fg-subtle block text-[10px]">EST. CAPEX</span>
                <span className="text-success-fg font-bold">
                  {formatComplianceCost(evaluation.estimatedBaseCostInr)}
                </span>
              </div>
              <div className="rounded-xl border border-hairline bg-surface-1 px-3 py-1.5 text-center">
                <span className="text-fg-subtle block text-[10px]">LEAD TIME</span>
                <span className="text-fg font-bold">{evaluation.estimatedTotalWeeks} Weeks</span>
              </div>
              <div className="rounded-xl border border-hairline bg-surface-1 px-3 py-1.5 text-center">
                <span className="text-fg-subtle block text-[10px]">SAMPLES</span>
                <span className="text-accent-fg font-bold">{evaluation.sampleUnitsNeeded} Units</span>
              </div>
            </div>
          </div>

          {evaluation.primaryStandards.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-fg-subtle uppercase block">
                MANDATORY STATUTORY STANDARDS &amp; ORDERS:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-body-xs font-mono text-fg-muted">
                {evaluation.primaryStandards.map((std, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Additive Cross-Links to Global Export Bridge, EMC Pre-Scan & HIL Testbeds */}
      <Card className="border-accent/25 bg-accent-soft/35 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent-fg">
            EXPORT &amp; PRE-COMPLIANCE LAB PIPELINE
          </div>
          <p className="text-body-xs text-fg-muted">
            Reuse Indian NABL ILAC-MRA reports to cut overseas CE/FCC/UL/ECAS lab fees by ~35%, run EMC pre-scans, or reserve HIL benches.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild variant="primary" size="sm">
            <Link href="/export">
              <span>Global Export Bridge (/export)</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/emc">
              <span>EMC Pre-Scan Lab</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/testbeds">
              <span>NABL &amp; HIL Testbeds</span>
            </Link>
          </Button>
        </div>
      </Card>

      {/* Search & Filter */}
      <Card className="border-hairline bg-surface-1 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roadmaps by standard (e.g. IS 16046, AIS-156, Rule 8)..."
            className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs font-mono text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
        >
          <option value="all">All Domains</option>
          <option value="drone_uav">Drones &amp; UAVs</option>
          <option value="ev_powertrain">EV &amp; Battery Packs</option>
          <option value="iot_wireless">Smart Meters &amp; LoRa</option>
          <option value="power_adapter">AC-DC Power Adapters</option>
          <option value="telecom_networking">Cellular Routers</option>
          <option value="medical_device">Medical Diagnostics</option>
        </select>
      </Card>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoadmaps.map((rm) => (
          <Card
            key={rm.id}
            className="flex flex-col justify-between border-hairline bg-surface-1 p-5 shadow-xs hover:border-accent/40 transition-all min-w-0 [overflow-wrap:anywhere]"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {rm.statutoryBodies.map((b) => (
                  <Badge key={b} tone="accent" variant="outline">
                    {b.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>

              <div>
                <Link
                  href={`/compliance/${rm.slug}`}
                  className="font-display text-body-lg font-bold text-fg hover:text-accent-fg transition-colors"
                >
                  {rm.title}
                </Link>
                <p className="mt-1 text-body-xs text-fg-muted line-clamp-2 leading-relaxed">
                  {rm.tagline}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-hairline">
                <span className="text-[10px] font-mono text-fg-subtle block">KEY STANDARDS</span>
                <div className="flex flex-wrap gap-1">
                  {rm.applicableStandards.map((std) => (
                    <span
                      key={std.code}
                      className="rounded-full border border-hairline bg-sunken px-2 py-0.5 text-[10px] font-mono text-fg-muted"
                    >
                      {std.code}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-body-xs font-mono pt-2 border-t border-hairline">
                <div>
                  <span className="text-[10px] text-fg-subtle block">EST. TESTING COST</span>
                  <span className="text-success-fg font-bold">
                    {formatComplianceCost(rm.estimatedTotalTestingCostInr.minInr)} -{' '}
                    {formatComplianceCost(rm.estimatedTotalTestingCostInr.maxInr)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-fg-subtle block">TOTAL LEAD TIME</span>
                  <span className="text-fg font-bold">
                    {rm.estimatedTimelineWeeks.minWeeks} - {rm.estimatedTimelineWeeks.maxWeeks} Weeks
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-hairline pt-3 flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-fg-subtle">
                {rm.recommendedLabs.length} NABL Labs
              </span>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/compliance/${rm.slug}`}>
                  <span>View Roadmap</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
