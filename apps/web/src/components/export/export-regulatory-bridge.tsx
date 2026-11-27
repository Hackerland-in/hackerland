'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  EXPORT_CORRIDOR_IDS,
  EXPORT_PRODUCT_ARCHETYPES,
  CORRIDOR_META,
  evaluateExportRegulatoryStack,
  type ExportCorridorId,
  type ExportProductArchetype,
} from '@hackerland/core';
import { Badge, Card, cn } from '@hackerland/ui';
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { EXPORT_ARCHETYPE_METADATA } from '@/lib/data/export-trade-data';

interface ExportRegulatoryBridgeProps {
  initialCorridor?: ExportCorridorId;
  lockedCorridor?: boolean;
  initialArchetype?: ExportProductArchetype;
  onCorridorChange?: (corridor: ExportCorridorId) => void;
}

const INR_PER_USD_ESTIMATE = 84.5;

export function ExportRegulatoryBridge({
  initialCorridor = 'us',
  lockedCorridor = false,
  initialArchetype = 'iot_wireless',
  onCorridorChange,
}: ExportRegulatoryBridgeProps) {
  const initialMeta = EXPORT_ARCHETYPE_METADATA[initialArchetype];
  const [corridor, setCorridor] = useState<ExportCorridorId>(initialCorridor);
  const [archetype, setArchetype] = useState<ExportProductArchetype>(initialArchetype);
  const [hasWirelessRadio, setHasWirelessRadio] = useState<boolean>(initialMeta.defaultHasWireless);
  const [usesPreCertifiedRfModule, setUsesPreCertifiedRfModule] = useState<boolean>(true);
  const [hasLithiumBattery, setHasLithiumBattery] = useState<boolean>(
    initialMeta.defaultHasLithiumBattery,
  );
  const [mainsVoltageAc, setMainsVoltageAc] = useState<boolean>(initialMeta.defaultMainsAc);
  const [includesEncryptionOrImu, setIncludesEncryptionOrImu] = useState<boolean>(false);
  const [hasExistingNablIlacReport, setHasExistingNablIlacReport] = useState<boolean>(true);
  const [includeUkcaWithEu, setIncludeUkcaWithEu] = useState<boolean>(true);

  const handleArchetypeSelect = (next: ExportProductArchetype) => {
    const meta = EXPORT_ARCHETYPE_METADATA[next];
    setArchetype(next);
    setHasWirelessRadio(meta.defaultHasWireless);
    setHasLithiumBattery(meta.defaultHasLithiumBattery);
    setMainsVoltageAc(meta.defaultMainsAc);
    if (next !== 'drone_uav') {
      setIncludesEncryptionOrImu(false);
    }
  };

  const handleCorridorSelect = (next: ExportCorridorId) => {
    setCorridor(next);
    onCorridorChange?.(next);
  };

  const mapping = useMemo(() => {
    return evaluateExportRegulatoryStack({
      corridor,
      productArchetype: archetype,
      hasWirelessRadio,
      usesPreCertifiedRfModule,
      hasLithiumBattery,
      mainsVoltageAc,
      includesEncryptionOrHighPrecisionImu: includesEncryptionOrImu,
      hasExistingNablIlacReport,
      includeUkcaWithEu,
    });
  }, [
    corridor,
    archetype,
    hasWirelessRadio,
    usesPreCertifiedRfModule,
    hasLithiumBattery,
    mainsVoltageAc,
    includesEncryptionOrImu,
    hasExistingNablIlacReport,
    includeUkcaWithEu,
  ]);

  const estimatedInr = Math.round(mapping.estimatedTotalComplianceUsd * INR_PER_USD_ESTIMATE);
  const archetypeMeta = EXPORT_ARCHETYPE_METADATA[archetype];

  const scometBadgeTone =
    mapping.scometStatus === 'clear_non_scomet'
      ? 'success'
      : mapping.scometStatus === 'conditional_screening'
        ? 'warning'
        : 'danger';

  const scometStatusLabel =
    mapping.scometStatus === 'clear_non_scomet'
      ? 'CLEAR · NON-SCOMET'
      : mapping.scometStatus === 'conditional_screening'
        ? 'CONDITIONAL SCOMET SCREENING'
        : 'RESTRICTED · DGFT SCOMET LICENSE';

  return (
    <div className="space-y-5 min-w-0">
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Indian NABL Baseline → Global Regulatory Bridge
            </h2>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Map BIS/WPC/AIS-156 pre-compliance into CE, FCC, UL, RoHS, ECAS, IMDA, and DGFT SCOMET export clearance.
            </p>
          </div>
          <Badge tone="accent" variant="outline">
            ILAC-MRA Mutual Recognition
          </Badge>
        </div>

        {/* Product Archetype Selector */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-subtle">
              1. Hardware Product Archetype
            </span>
            <span className="text-[11px] font-mono text-accent-fg">
              Clusters: {archetypeMeta.typicalIndiaClusters.join(' · ')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {EXPORT_PRODUCT_ARCHETYPES.map((id) => {
              const item = EXPORT_ARCHETYPE_METADATA[id];
              const active = archetype === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleArchetypeSelect(id)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all',
                    active
                      ? 'border-accent bg-accent-soft/60 text-fg shadow-xs'
                      : 'border-hairline bg-sunken/70 text-fg-muted hover:border-accent/40 hover:bg-surface-1',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-body-xs font-bold text-fg">
                      {item.shortLabel}
                    </span>
                    <span className="font-mono text-[10px] text-fg-subtle">
                      HSN {item.defaultHsnCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-fg-muted mt-1 line-clamp-1">
                    {item.exampleProduct}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Corridor Selector */}
        {!lockedCorridor && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-subtle block">
              2. Target Global Export Corridor
            </span>
            <div className="flex flex-wrap gap-2">
              {EXPORT_CORRIDOR_IDS.map((cId) => {
                const selected = corridor === cId;
                return (
                  <button
                    key={cId}
                    type="button"
                    onClick={() => handleCorridorSelect(cId)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-body-xs font-mono font-semibold transition-all',
                      selected
                        ? 'border-accent bg-accent text-on-solid shadow-xs'
                        : 'border-line bg-surface-1 text-fg-muted hover:border-accent/40 hover:text-accent-fg',
                    )}
                  >
                    {CORRIDOR_META[cId].label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Architecture & Lab Reuse Toggles */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-subtle block">
            3. Hardware Subsystems, Pre-Certified Modules &amp; NABL Lab Reuse
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              {
                id: 'has-wireless',
                label: 'Intentional Wireless RF (BLE/Wi-Fi/LoRa)',
                checked: hasWirelessRadio,
                onChange: setHasWirelessRadio,
              },
              {
                id: 'pre-cert-rf',
                label: 'Pre-Certified RF Module (FCC/CE/WPC ID)',
                checked: usesPreCertifiedRfModule,
                onChange: setUsesPreCertifiedRfModule,
                disabled: !hasWirelessRadio,
              },
              {
                id: 'has-lithium',
                label: 'Contains Li-Ion / LFP Battery Pack',
                checked: hasLithiumBattery,
                onChange: setHasLithiumBattery,
              },
              {
                id: 'mains-ac',
                label: 'Mains AC Input (>=50V AC / 75V DC)',
                checked: mainsVoltageAc,
                onChange: setMainsVoltageAc,
              },
              {
                id: 'dual-use-imu',
                label: 'Tactical IMU / >128-bit Encryption / BVLOS',
                checked: includesEncryptionOrImu,
                onChange: setIncludesEncryptionOrImu,
              },
              {
                id: 'nabl-reuse',
                label: 'Reuse Indian NABL ILAC-MRA Test Report',
                checked: hasExistingNablIlacReport,
                onChange: setHasExistingNablIlacReport,
              },
              ...(corridor === 'eu'
                ? [
                    {
                      id: 'include-ukca',
                      label: 'Bundle UKCA Declaration with EU CE File',
                      checked: includeUkcaWithEu,
                      onChange: setIncludeUkcaWithEu,
                    },
                  ]
                : []),
            ].map((toggle) => (
              <label
                key={toggle.id}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-colors select-none',
                  toggle.disabled && 'opacity-50 cursor-not-allowed',
                  toggle.checked
                    ? 'border-accent/40 bg-accent-soft/50 text-fg'
                    : 'border-hairline bg-sunken/70 text-fg-muted hover:border-accent/30',
                )}
              >
                <input
                  type="checkbox"
                  checked={toggle.checked}
                  disabled={toggle.disabled}
                  onChange={(e) => toggle.onChange(e.target.checked)}
                  className="size-4 rounded border-line accent-accent shrink-0"
                />
                <span className="text-body-xs font-mono font-medium">{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-hairline bg-surface-1 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-fg-subtle">
            Net Overseas Compliance
          </span>
          <div className="font-display text-headline-md font-bold text-fg tabular-nums">
            ${mapping.estimatedTotalComplianceUsd.toLocaleString('en-US')}
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            ≈ ₹{estimatedInr.toLocaleString('en-IN')}
          </span>
        </Card>

        <Card className="border-hairline bg-surface-1 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-fg-subtle">
            Certification Timeline
          </span>
          <div className="font-display text-headline-md font-bold text-fg tabular-nums">
            {mapping.estimatedTimelineWeeks} Weeks
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            {mapping.triggeredStandards.length} global marks triggered
          </span>
        </Card>

        <Card className="border-accent/25 bg-accent-soft/40 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-accent-fg font-semibold flex items-center gap-1">
            <Radio className="size-3" /> RF Module Optimization
          </span>
          <div className="font-display text-headline-md font-bold text-accent-fg tabular-nums">
            ${mapping.preCertifiedRfModuleSavings.estimatedCostSavedUsd.toLocaleString('en-US')} Saved
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            {mapping.preCertifiedRfModuleSavings.estimatedWeeksSaved > 0
              ? `${mapping.preCertifiedRfModuleSavings.estimatedWeeksSaved} weeks shaved via modular ID`
              : hasWirelessRadio
                ? 'Enable pre-certified RF to save $5,500'
                : 'Non-RF architecture'}
          </span>
        </Card>

        <Card className="border-success/25 bg-success/5 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-success-fg font-semibold flex items-center gap-1">
            <Sparkles className="size-3" /> NABL ILAC-MRA Credit
          </span>
          <div className="font-display text-headline-md font-bold text-success-fg tabular-nums">
            ${mapping.ilacMraNablCredit.estimatedCostCreditUsd.toLocaleString('en-US')} Credit
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            {mapping.ilacMraNablCredit.eligible
              ? '35% re-test fee avoided via Indian lab'
              : 'Select NABL ILAC-MRA reuse to unlock'}
          </span>
        </Card>
      </div>

      {/* Prominent UN 38.3 Battery Alert & DGFT SCOMET Dual-Use Screening */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          className={cn(
            'p-4 sm:p-5 space-y-2.5 border',
            mapping.scometStatus === 'restricted_dual_use'
              ? 'border-danger/40 bg-danger/5'
              : mapping.scometStatus === 'conditional_screening'
                ? 'border-warning/40 bg-warning/5'
                : 'border-success/30 bg-success/5',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-fg">
              {mapping.scometStatus === 'clear_non_scomet' ? (
                <ShieldCheck className="size-4 text-success-fg" />
              ) : (
                <ShieldAlert
                  className={cn(
                    'size-4',
                    mapping.scometStatus === 'restricted_dual_use'
                      ? 'text-danger-fg'
                      : 'text-warning-fg',
                  )}
                />
              )}
              <span>DGFT SCOMET Dual-Use Export Screening</span>
            </div>
            <Badge tone={scometBadgeTone} variant="solid">
              {scometStatusLabel}
            </Badge>
          </div>
          <p className="font-mono text-xs font-semibold text-fg">{mapping.scometCategoryCode}</p>
          <p className="text-body-xs text-fg-muted leading-relaxed">{mapping.scometRationale}</p>
        </Card>

        {hasLithiumBattery ? (
          <Card className="border-warning/40 bg-warning/5 p-4 sm:p-5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-warning-fg">
                <BatteryCharging className="size-4" />
                <span>UN 38.3 Lithium Battery Transport Mandatory</span>
              </div>
              <Badge tone="warning" variant="solid">
                IATA DGR / Class 9 DG
              </Badge>
            </div>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              Airlines (BLR/BOM/DEL cargo) and ocean carriers offload any Li-ion / LFP pack without a signed UN 38.3 Test Summary, 16-section MSDS, and PI965/966/967 packaging declaration.
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] font-mono">
              <Link
                href="/compliance/ais-156-phase-2-ev-battery-pack"
                className="text-accent-fg hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>AIS-156 Indian Battery Pre-Check</span>
                <ArrowRight className="size-3" />
              </Link>
              <Link
                href="/testbeds"
                className="text-fg-muted hover:text-accent-fg inline-flex items-center gap-1"
              >
                <span>Book Indian Abuse/Cycler Testbed</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border-hairline bg-surface-1 p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-fg">
              <Cpu className="size-4 text-accent-fg" />
              <span>Indian NABL → Foreign Lab Bridge Strategy</span>
            </div>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              {mapping.preCertifiedRfModuleSavings.notes}
            </p>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              {mapping.ilacMraNablCredit.notes}
            </p>
          </Card>
        )}
      </div>

      {/* Triggered Global Standards Breakdown */}
      <Card className="border-hairline bg-surface-1 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
              Triggered Standards Matrix — {mapping.corridorLabel}
            </h3>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Verify pre-compliance in India via NABL laboratories before paying foreign Notified Body / TCB fees.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/compliance"
              className="rounded-full border border-line bg-sunken px-3 py-1 text-[11px] font-mono text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
            >
              Indian NABL Roadmaps →
            </Link>
            <Link
              href="/emc"
              className="rounded-full border border-line bg-sunken px-3 py-1 text-[11px] font-mono text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
            >
              EMC Pre-Scan Lab →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mapping.triggeredStandards.map((std) => (
            <div
              key={std.code}
              className="rounded-xl border border-hairline bg-sunken p-4 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-fg">{std.code}</span>
                <Badge tone={std.mandatory ? 'accent' : 'neutral'} variant="outline">
                  {std.mandatory ? 'Mandatory' : 'Recommended'}
                </Badge>
              </div>
              <div className="text-body-xs font-semibold text-fg">{std.name}</div>
              <div className="text-[11px] font-mono text-accent-fg">{std.authority}</div>
              <p className="text-body-xs text-fg-muted leading-relaxed">{std.notes}</p>
            </div>
          ))}
        </div>

        {mapping.ilacMraNablCredit.acceptedTests.length > 0 && (
          <div className="rounded-xl border border-hairline bg-accent-soft/30 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-fg">
              {mapping.ilacMraNablCredit.eligible ? (
                <CheckCircle2 className="size-3.5 text-success-fg" />
              ) : (
                <AlertTriangle className="size-3.5 text-warning-fg" />
              )}
              <span>Indian NABL ILAC-MRA Reusable Test Reports</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mapping.ilacMraNablCredit.acceptedTests.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-hairline bg-surface-1 px-2.5 py-0.5 text-[11px] font-mono text-fg-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
