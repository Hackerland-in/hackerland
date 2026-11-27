'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  EXPORT_PRODUCT_ARCHETYPES,
  evaluateOemQualificationReadiness,
  type ExportProductArchetype,
} from '@hackerland/core';
import { Badge, Card, ProgressBar, cn } from '@hackerland/ui';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileWarning,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  EXPORT_ARCHETYPE_METADATA,
  OEM_BUYER_PERSONAS,
  type OemBuyerPersona,
} from '@/lib/data/export-trade-data';

const HARDWARE_LICENSE_OPTIONS = [
  'CERN-OHL-P-2.0',
  'CERN-OHL-W-2.0',
  'CERN-OHL-S-2.0',
  'MIT',
  'Apache-2.0',
  'Proprietary / Trade Secret',
] as const;

const FIRMWARE_LICENSE_OPTIONS = [
  'Apache-2.0',
  'MIT',
  'LGPL-3.0',
  'GPL-3.0',
  'AGPL-3.0',
  'Proprietary',
] as const;

export function OemQualificationSimulator() {
  const defaultPersona = OEM_BUYER_PERSONAS[0]!;
  const [selectedPersonaId, setSelectedPersonaId] = useState<OemBuyerPersona['id']>(
    defaultPersona.id,
  );
  const [productArchetype, setProductArchetype] = useState<ExportProductArchetype>(
    defaultPersona.recommendedArchetype,
  );
  const [hasIso9001, setHasIso9001] = useState<boolean>(defaultPersona.defaults.hasIso9001);
  const [hasPpapLevel3, setHasPpapLevel3] = useState<boolean>(
    defaultPersona.defaults.hasPpapLevel3,
  );
  const [hasIatf16949, setHasIatf16949] = useState<boolean>(defaultPersona.defaults.hasIatf16949);
  const [hasIso13485, setHasIso13485] = useState<boolean>(defaultPersona.defaults.hasIso13485);
  const [hasAs9100d, setHasAs9100d] = useState<boolean>(defaultPersona.defaults.hasAs9100d);
  const [hardwareLicense, setHardwareLicense] = useState<string>(
    defaultPersona.defaults.hardwareLicense,
  );
  const [firmwareLicense, setFirmwareLicense] = useState<string>(
    defaultPersona.defaults.firmwareLicense,
  );
  const [ftoClearanceDone, setFtoClearanceDone] = useState<boolean>(
    defaultPersona.defaults.ftoClearanceDone,
  );
  const [singleSourceBomCount, setSingleSourceBomCount] = useState<number>(
    defaultPersona.defaults.singleSourceBomCount,
  );
  const [hasTraceabilityMes, setHasTraceabilityMes] = useState<boolean>(
    defaultPersona.defaults.hasTraceabilityMes,
  );

  const handleSelectPersona = (persona: OemBuyerPersona) => {
    setSelectedPersonaId(persona.id);
    setProductArchetype(persona.recommendedArchetype);
    setHasIso9001(persona.defaults.hasIso9001);
    setHasPpapLevel3(persona.defaults.hasPpapLevel3);
    setHasIatf16949(persona.defaults.hasIatf16949);
    setHasIso13485(persona.defaults.hasIso13485);
    setHasAs9100d(persona.defaults.hasAs9100d);
    setHardwareLicense(persona.defaults.hardwareLicense);
    setFirmwareLicense(persona.defaults.firmwareLicense);
    setFtoClearanceDone(persona.defaults.ftoClearanceDone);
    setSingleSourceBomCount(persona.defaults.singleSourceBomCount);
    setHasTraceabilityMes(persona.defaults.hasTraceabilityMes);
  };

  const result = useMemo(() => {
    return evaluateOemQualificationReadiness({
      productArchetype,
      hasIso9001,
      hasPpapLevel3,
      hasIatf16949,
      hasIso13485,
      hasAs9100d,
      hardwareLicense,
      firmwareLicense,
      ftoClearanceDone,
      singleSourceBomCount,
      hasTraceabilityMes,
    });
  }, [
    productArchetype,
    hasIso9001,
    hasPpapLevel3,
    hasIatf16949,
    hasIso13485,
    hasAs9100d,
    hardwareLicense,
    firmwareLicense,
    ftoClearanceDone,
    singleSourceBomCount,
    hasTraceabilityMes,
  ]);

  const activePersona =
    OEM_BUYER_PERSONAS.find((p) => p.id === selectedPersonaId) ?? OEM_BUYER_PERSONAS[0]!;

  const verdictTone =
    result.verdict === 'oem_audit_ready'
      ? 'success'
      : result.verdict === 'conditional_gaps'
        ? 'warning'
        : 'danger';

  const verdictLabel =
    result.verdict === 'oem_audit_ready'
      ? 'OEM Audit Ready'
      : result.verdict === 'conditional_gaps'
        ? 'Conditional Gaps'
        : 'Not Ready for Tier-1 Audit';

  return (
    <div className="space-y-5 min-w-0">
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-accent-fg" />
              <h2 className="font-display text-headline-sm font-bold text-fg">
                International Tier-1 OEM Qualification &amp; PPAP Level 3 Simulator
              </h2>
            </div>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Simulate supplier qualification audits across QMS (ISO 9001 / IATF 16949 / ISO 13485 / AS9100D), AIAG PPAP Level 3, BOM dual-sourcing, and IP/copyleft clearance.
            </p>
          </div>
          <Badge tone={verdictTone} variant="solid">
            {verdictLabel} ({result.score}/100)
          </Badge>
        </div>

        {/* Buyer Persona Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-fg-subtle block">
            1. Select Global Tier-1 OEM Buyer Profile
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OEM_BUYER_PERSONAS.map((persona) => {
              const selected = selectedPersonaId === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSelectPersona(persona)}
                  className={cn(
                    'rounded-xl border p-3.5 text-left transition-all',
                    selected
                      ? 'border-accent bg-accent-soft/55 text-fg shadow-xs'
                      : 'border-hairline bg-sunken/70 text-fg-muted hover:border-accent/40 hover:bg-surface-1',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-body-xs font-bold text-fg">
                      {persona.label}
                    </span>
                    <span className="text-[10px] font-mono text-accent-fg">
                      {EXPORT_ARCHETYPE_METADATA[persona.recommendedArchetype].shortLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-fg-muted mt-1">{persona.targetBuyerExample}</div>
                  <div className="text-[10px] font-mono text-fg-subtle mt-1">
                    Hubs: {persona.indiaHubs}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-mono text-fg-muted rounded-xl border border-hairline bg-sunken px-3.5 py-2">
            Buyer Audit Mandate: {activePersona.requiredStandardsNote}
          </p>
        </div>

        {/* Controls: Archetype, QMS/PPAP, Licenses & BOM Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Product Archetype
            </span>
            <select
              aria-label="OEM Product Archetype"
              value={productArchetype}
              onChange={(e) => setProductArchetype(e.target.value as ExportProductArchetype)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            >
              {EXPORT_PRODUCT_ARCHETYPES.map((arch) => (
                <option key={arch} value={arch}>
                  {EXPORT_ARCHETYPE_METADATA[arch].shortLabel}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Hardware / PCB License
            </span>
            <select
              aria-label="Hardware License"
              value={hardwareLicense}
              onChange={(e) => setHardwareLicense(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            >
              {HARDWARE_LICENSE_OPTIONS.map((lic) => (
                <option key={lic} value={lic}>
                  {lic}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Firmware / RTOS License
            </span>
            <select
              aria-label="Firmware License"
              value={firmwareLicense}
              onChange={(e) => setFirmwareLicense(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            >
              {FIRMWARE_LICENSE_OPTIONS.map((lic) => (
                <option key={lic} value={lic}>
                  {lic}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Single-Source BOM Parts
            </span>
            <input
              aria-label="Single Source BOM Count"
              type="number"
              min={0}
              max={25}
              value={singleSourceBomCount}
              onChange={(e) => setSingleSourceBomCount(Math.max(0, Number(e.target.value) || 0))}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        {/* QMS & PPAP Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { id: 'iso9001', label: 'ISO 9001:2015 QMS', checked: hasIso9001, set: setHasIso9001 },
            { id: 'ppap3', label: 'AIAG PPAP Level 3 (Cpk >= 1.33)', checked: hasPpapLevel3, set: setHasPpapLevel3 },
            { id: 'iatf16949', label: 'IATF 16949 Automotive', checked: hasIatf16949, set: setHasIatf16949 },
            { id: 'iso13485', label: 'ISO 13485 MedTech', checked: hasIso13485, set: setHasIso13485 },
            { id: 'as9100d', label: 'AS9100D Aerospace / UAV', checked: hasAs9100d, set: setHasAs9100d },
            { id: 'fto-done', label: 'US/EU/IN Patent FTO Cleared', checked: ftoClearanceDone, set: setFtoClearanceDone },
            { id: 'mes-qr', label: 'Reel-to-Unit QR MES Traceability', checked: hasTraceabilityMes, set: setHasTraceabilityMes },
          ].map((item) => (
            <label
              key={item.id}
              className={cn(
                'flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer select-none transition-colors',
                item.checked
                  ? 'border-accent/40 bg-accent-soft/50 text-fg'
                  : 'border-hairline bg-sunken/70 text-fg-muted',
              )}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.set(e.target.checked)}
                className="size-4 rounded border-line accent-accent shrink-0"
              />
              <span className="text-body-xs font-mono font-medium">{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Score Progress + Copyleft Alert + Supply Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-hairline bg-surface-1 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-fg-subtle">
              Audit Readiness Score
            </span>
            <span className="font-display text-headline-md font-bold text-fg tabular-nums">
              {result.score} / 100
            </span>
          </div>
          <ProgressBar
            value={result.score}
            max={100}
            tone={verdictTone}
            label="OEM Audit Readiness Score"
          />
          <div className="text-[11px] font-mono text-fg-muted">
            Single-Source Risk:{' '}
            <strong
              className={cn(
                result.singleSourceRiskLevel === 'low'
                  ? 'text-success-fg'
                  : result.singleSourceRiskLevel === 'moderate'
                    ? 'text-warning-fg'
                    : 'text-danger-fg',
              )}
            >
              {result.singleSourceRiskLevel.toUpperCase()}
            </strong>{' '}
            ·{' '}
            <Link href="/sourcing" className="text-accent-fg hover:underline">
              Qualify Pin-Compatible Alternates →
            </Link>
          </div>
        </Card>

        <Card
          className={cn(
            'lg:col-span-2 p-5 space-y-2.5 border',
            result.copyleftFlags.length > 0
              ? 'border-danger/40 bg-danger/5'
              : result.ipFtoClean
                ? 'border-success/30 bg-success/5'
                : 'border-warning/40 bg-warning/5',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-fg">
              {result.copyleftFlags.length > 0 ? (
                <FileWarning className="size-4 text-danger-fg" />
              ) : (
                <ShieldCheck className="size-4 text-success-fg" />
              )}
              <span>IP Freedom-to-Operate (FTO) &amp; Copyleft Contamination Guard</span>
            </div>
            <Badge
              tone={
                result.copyleftFlags.length > 0
                  ? 'danger'
                  : result.ipFtoClean
                    ? 'success'
                    : 'warning'
              }
              variant="solid"
            >
              {result.copyleftFlags.length > 0
                ? 'Copyleft Contamination Detected'
                : result.ipFtoClean
                  ? 'Clean-Room IP Verified'
                  : 'FTO Search Pending'}
            </Badge>
          </div>

          {result.copyleftFlags.length > 0 ? (
            <p className="text-body-xs text-fg leading-relaxed">
              Detected strong copyleft license ({result.copyleftFlags.join(', ')}). Global OEM legal teams routinely reject CERN-OHL-S and GPL-3.0/AGPL dependencies due to forced schematic/firmware disclosure clauses.
            </p>
          ) : (
            <p className="text-body-xs text-fg-muted leading-relaxed">
              Permissive hardware/firmware licenses ({hardwareLicense} / {firmwareLicense}) avoid copyleft taint. Anchor clean prior art on the Hackerland IP Defense Ledger before sending evaluation kits overseas.
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-mono">
            <Link
              href="/network/ip"
              className="inline-flex items-center gap-1 font-semibold text-accent-fg hover:underline"
            >
              <span>Inspect IP Defense Ledger &amp; Anchor Prior Art</span>
              <ArrowRight className="size-3" />
            </Link>
            <Link
              href="/sourcing"
              className="inline-flex items-center gap-1 text-fg-muted hover:text-accent-fg"
            >
              <span>Review Dual-Source BOM Alternates</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Checklist Items + Remediation Plan */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border-hairline bg-surface-1 p-5 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
            Tier-1 Buyer Audit Checklist ({result.checklist.filter((c) => c.passed).length} of{' '}
            {result.checklist.length} Passed)
          </h3>

          <div className="space-y-2.5">
            {result.checklist.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'rounded-xl border p-3.5 space-y-1.5',
                  item.passed
                    ? 'border-success/30 bg-success/5'
                    : item.critical
                      ? 'border-danger/35 bg-danger/5'
                      : 'border-warning/35 bg-warning/5',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.passed ? (
                      <CheckCircle2 className="size-4 text-success-fg shrink-0" />
                    ) : (
                      <XCircle
                        className={cn(
                          'size-4 shrink-0',
                          item.critical ? 'text-danger-fg' : 'text-warning-fg',
                        )}
                      />
                    )}
                    <span className="text-body-xs font-bold text-fg">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge tone="neutral" variant="outline">
                      {item.standardRef}
                    </Badge>
                    <Badge
                      tone={item.passed ? 'success' : item.critical ? 'danger' : 'warning'}
                      variant="outline"
                    >
                      {item.passed ? 'Passed' : item.critical ? 'Critical Gap' : 'Action Item'}
                    </Badge>
                  </div>
                </div>
                <p className="text-body-xs text-fg-muted pl-6 leading-relaxed">
                  {item.remediationNote}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-hairline bg-surface-1 p-5 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
            Remediation Action Plan
          </h3>
          {result.remediationPlan.length === 0 ? (
            <div className="flex items-start gap-2 rounded-xl border border-success/30 bg-success/5 p-3.5 text-body-xs text-success-fg">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
              <span>Zero gaps remaining — package is ready for Tier-1 OEM supplier audit!</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {result.remediationPlan.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl border border-hairline bg-sunken p-3 text-body-xs text-fg"
                >
                  <AlertTriangle className="size-4 text-warning-fg shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
