'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CORRIDOR_META,
  EXPORT_CORRIDOR_IDS,
  EXPORT_PAPERWORK_GATES,
  EXPORT_PRODUCT_ARCHETYPES,
  HSN_EXPORT_PROFILES,
  INCOTERMS,
  evaluateExportPaperworkWorkflow,
  matchPliAndExportIncentives,
  type ExportCorridorId,
  type ExportPaperworkGateId,
  type ExportProductArchetype,
  type Incoterm,
  type SectorId,
} from '@hackerland/core';
import { Badge, Button, Card, ProgressBar, cn } from '@hackerland/ui';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Download,
  ExternalLink,
  FileCheck2,
  Save,
} from 'lucide-react';
import {
  EXPORT_ARCHETYPE_METADATA,
  SECTOR_OPTIONS_FOR_PLI,
  buildExportDossierTemplate,
} from '@/lib/data/export-trade-data';

const STORAGE_KEY = 'hackerland_export_paperwork_gates_v1';

export function DgftPaperworkWizard() {
  // 10-step Indian Export Readiness Checklist
  const [completedGates, setCompletedGates] = useState<string[]>([
    'iec',
    'ad_code_icegate',
    'gst_lut',
  ]);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [savingSnapshot, setSavingSnapshot] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompletedGates(parsed.filter((item): item is string => typeof item === 'string'));
        }
      }
    } catch {}
  }, []);

  const toggleGate = (gateId: ExportPaperworkGateId) => {
    setCompletedGates((prev) => {
      const exists = prev.includes(gateId);
      const next = exists ? prev.filter((id) => id !== gateId) : [...prev, gateId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSelectAllGates = () => {
    const all = EXPORT_PAPERWORK_GATES.map((g) => g.id);
    setCompletedGates(all);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}
  };

  const handleResetGates = () => {
    setCompletedGates([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
  };

  const workflow = useMemo(
    () => evaluateExportPaperworkWorkflow(completedGates),
    [completedGates],
  );

  // Commercial Invoice & Packing List Dossier state
  const [exporterName, setExporterName] = useState('Kaveri Power & Embedded Pvt Ltd (Pune)');
  const [iecCode, setIecCode] = useState('AAACK8429L');
  const [gstin, setGstin] = useState('27AAACK8429L1Z5');
  const [lutArn, setLutArn] = useState('AD270426009812K');
  const [exitPort, setExitPort] = useState('INNSA1 - Nhava Sheva (JNPT)');
  const [consigneeName, setConsigneeName] = useState('Gulf Grid Mobility LLC (JAFZA, Dubai)');
  const [dossierCorridor, setDossierCorridor] = useState<ExportCorridorId>('uae_gcc');
  const [dossierHsn, setDossierHsn] = useState<string>('85076000');
  const [dossierIncoterm, setDossierIncoterm] = useState<Incoterm>('CIF');
  const [dossierQty, setDossierQty] = useState<number>(250);
  const [dossierUnitUsd, setDossierUnitUsd] = useState<number>(295);
  const [includesBattery, setIncludesBattery] = useState<boolean>(true);
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);

  const dossierText = useMemo(
    () =>
      buildExportDossierTemplate({
        exporterName,
        iecCode,
        gstin,
        lutArn,
        exitPort,
        consigneeName,
        corridor: dossierCorridor,
        hsnCode: dossierHsn,
        incoterm: dossierIncoterm,
        quantity: dossierQty,
        unitPriceUsd: dossierUnitUsd,
        netWeightKg: Number((dossierQty * 1.4).toFixed(1)),
        grossWeightKg: Number((dossierQty * 1.65).toFixed(1)),
        includesBattery,
      }),
    [
      exporterName,
      iecCode,
      gstin,
      lutArn,
      exitPort,
      consigneeName,
      dossierCorridor,
      dossierHsn,
      dossierIncoterm,
      dossierQty,
      dossierUnitUsd,
      includesBattery,
    ],
  );

  const handleCopyDossier = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(dossierText);
      }
      setCopiedDossier(true);
      setTimeout(() => setCopiedDossier(false), 2000);
    } catch {
      setCopiedDossier(true);
      setTimeout(() => setCopiedDossier(false), 2000);
    }
  };

  const handleDownloadDossier = () => {
    if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') return;
    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `indian-export-dossier-${dossierHsn}-${dossierIncoterm.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // PLI & Export Grant Matchmaker state
  const [pliSector, setPliSector] = useState<SectorId>('drones-defense-space');
  const [pliArchetype, setPliArchetype] = useState<ExportProductArchetype>('drone_uav');
  const [annualTurnoverLakhs, setAnnualTurnoverLakhs] = useState<number>(300);
  const [incrementalCapexLakhs, setIncrementalCapexLakhs] = useState<number>(75);
  const [domesticVaPercent, setDomesticVaPercent] = useState<number>(55);
  const [importsRawMaterials, setImportsRawMaterials] = useState<boolean>(true);
  const [pliCorridor, setPliCorridor] = useState<ExportCorridorId>('uae_gcc');
  const [hasUdyam, setHasUdyam] = useState<boolean>(true);

  const matchedSchemes = useMemo(() => {
    return matchPliAndExportIncentives({
      sectorId: pliSector,
      productArchetype: pliArchetype,
      annualExportTurnoverInr: Math.max(0, annualTurnoverLakhs) * 100_000,
      annualIncrementalInvestmentInr: Math.max(0, incrementalCapexLakhs) * 100_000,
      domesticValueAddPercent: domesticVaPercent,
      importsRawMaterialsForReExport: importsRawMaterials,
      corridor: pliCorridor,
      hasMsmeUdyamRegistration: hasUdyam,
    });
  }, [
    pliSector,
    pliArchetype,
    annualTurnoverLakhs,
    incrementalCapexLakhs,
    domesticVaPercent,
    importsRawMaterials,
    pliCorridor,
    hasUdyam,
  ]);

  const handleSaveExportSnapshot = async () => {
    setSavingSnapshot(true);
    setSaveFeedback(null);
    const payload = {
      completedGateIds: workflow.completedGateIds,
      readinessScore: workflow.readinessScore,
      dossierCorridor,
      dossierHsn,
      dossierIncoterm,
      pliSector,
      pliArchetype,
    };

    try {
      localStorage.setItem('hackerland_export_dossier_snapshot_v1', JSON.stringify(payload));
    } catch {}

    if (typeof fetch === 'function') {
      try {
        const res = await fetch('/api/workbenches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'export_trade',
            slugOrRoute: '/export',
            title: `${exporterName} — ${dossierHsn} Export Dossier (${workflow.readinessScore}%)`,
            summary: `${workflow.completedCount}/10 DGFT gates cleared · ${dossierIncoterm} to ${CORRIDOR_META[dossierCorridor].label}`,
            tags: ['export', dossierCorridor, dossierHsn],
            payload,
          }),
        });
        if (res.ok) {
          setSaveFeedback('Export readiness snapshot saved to Hackerland Workspace.');
        } else {
          setSaveFeedback('Saved export snapshot locally in browser storage.');
        }
      } catch {
        setSaveFeedback('Saved export snapshot locally in browser storage.');
      }
    } else {
      setSaveFeedback('Saved export snapshot locally in browser storage.');
    }
    setSavingSnapshot(false);
  };

  const statusTone =
    workflow.status === 'shipment_ready'
      ? 'success'
      : workflow.status === 'conditional_incentive_gaps'
        ? 'warning'
        : 'danger';

  const statusLabel =
    workflow.status === 'shipment_ready'
      ? 'Shipment Ready (100%)'
      : workflow.status === 'conditional_incentive_gaps'
        ? 'Incentive / Closure Gaps'
        : 'Customs Dispatch Blocked';

  return (
    <div className="space-y-6 min-w-0">
      {/* Section A: 10-Step DGFT & ICEGATE Readiness Gate */}
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-4 text-accent-fg" />
              <h2 className="font-display text-headline-sm font-bold text-fg">
                10-Step Indian Export Readiness Gate (DGFT → ICEGATE → RBI e-BRC)
              </h2>
            </div>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Verify statutory filings before dispatch so cargo never stalls at Nhava Sheva, Mundra, or BLR Air Cargo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone} variant="solid">
              {statusLabel}
            </Badge>
            <Button type="button" variant="secondary" size="sm" onClick={handleSelectAllGates}>
              Mark All Complete
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleResetGates}>
              Reset
            </Button>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="rounded-xl border border-hairline bg-sunken p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="font-bold text-fg">
              Readiness Score: {workflow.readinessScore}% ({workflow.completedCount} of{' '}
              {workflow.totalCount} Gates Verified)
            </span>
            <span
              className={cn(
                'font-semibold',
                workflow.criticalBlockerCount > 0 ? 'text-danger-fg' : 'text-success-fg',
              )}
            >
              {workflow.criticalBlockerCount} Critical Blocker
              {workflow.criticalBlockerCount === 1 ? '' : 's'} Remaining
            </span>
          </div>
          <ProgressBar
            value={workflow.readinessScore}
            max={100}
            tone={workflow.readinessScore === 100 ? 'success' : 'accent'}
            label="DGFT Export Readiness Score"
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EXPORT_PAPERWORK_GATES.map((gate) => {
            const checked = completedGates.includes(gate.id);
            return (
              <div
                key={gate.id}
                className={cn(
                  'rounded-xl border p-3.5 transition-colors space-y-2',
                  checked
                    ? 'border-success/35 bg-success/5'
                    : gate.critical
                      ? 'border-accent/30 bg-surface-1'
                      : 'border-hairline bg-sunken/70',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGate(gate.id)}
                      className="mt-0.5 size-4 rounded border-line accent-accent shrink-0"
                    />
                    <span className="text-body-xs font-semibold text-fg leading-snug">
                      {gate.stepNumber}. {gate.title}
                    </span>
                  </label>
                  <Badge
                    tone={checked ? 'success' : gate.critical ? 'danger' : 'neutral'}
                    variant="outline"
                  >
                    {checked ? 'Cleared' : gate.critical ? 'Critical Gate' : 'Incentive Gate'}
                  </Badge>
                </div>

                <div className="pl-6 space-y-1 text-[11px]">
                  <div className="font-mono text-fg-subtle">{gate.authority}</div>
                  <div className="text-fg font-medium">{gate.requiredDocument}</div>
                  <p className="text-fg-muted leading-relaxed">{gate.actionNote}</p>
                  <a
                    href={gate.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-accent-fg hover:underline pt-0.5"
                  >
                    <span>{gate.portalUrl.replace('https://', '')}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Missing Blockers & Save Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-hairline pt-4">
          <div className="text-body-xs text-fg-muted flex items-center gap-2">
            {workflow.missingBlockers.length === 0 ? (
              <>
                <CheckCircle2 className="size-4 text-success-fg shrink-0" />
                <span className="text-success-fg font-semibold">
                  All 10 DGFT, ICEGATE, and RBI e-BRC gates verified!
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="size-4 text-warning-fg shrink-0" />
                <span>
                  Next priority gate:{' '}
                  <strong className="text-fg">{workflow.missingBlockers[0]?.title}</strong>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={savingSnapshot}
              onClick={handleSaveExportSnapshot}
            >
              <Save className="size-3.5" />
              <span>Save Readiness Snapshot</span>
            </Button>
          </div>
        </div>
        {saveFeedback && (
          <div className="rounded-xl border border-success/30 bg-success/5 px-3.5 py-2 text-body-xs font-mono text-success-fg">
            {saveFeedback}
          </div>
        )}
      </Card>

      {/* Section B: Commercial Invoice & Packing List Dossier Preview */}
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <h3 className="font-display text-headline-sm font-bold text-fg">
              Commercial Invoice, Packing List &amp; LUT Dossier Generator
            </h3>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Auto-generates CHA-ready statutory wording for RODTEPY, GST LUT RFD-11, SCOMET &amp; UN 38.3 declarations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleCopyDossier}>
              {copiedDossier ? <Check className="size-3.5 text-success-fg" /> : <ClipboardCopy className="size-3.5" />}
              <span>{copiedDossier ? 'Copied Dossier' : 'Copy Dossier'}</span>
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleDownloadDossier}>
              <Download className="size-3.5" />
              <span>Download .txt</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Exporter Legal Name
            </span>
            <input
              type="text"
              value={exporterName}
              onChange={(e) => setExporterName(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              DGFT 10-Digit e-IEC
            </span>
            <input
              type="text"
              value={iecCode}
              onChange={(e) => setIecCode(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              GSTIN &amp; LUT ARN
            </span>
            <input
              type="text"
              value={lutArn}
              onChange={(e) => setLutArn(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Exit Port (ICEGATE)
            </span>
            <input
              type="text"
              value={exitPort}
              onChange={(e) => setExitPort(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Overseas Consignee
            </span>
            <input
              type="text"
              value={consigneeName}
              onChange={(e) => setConsigneeName(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              HSN Code
            </span>
            <select
              value={dossierHsn}
              onChange={(e) => setDossierHsn(e.target.value)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            >
              {HSN_EXPORT_PROFILES.map((p) => (
                <option key={p.hsnCode} value={p.hsnCode}>
                  {p.hsnCode}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Corridor &amp; Incoterm
            </span>
            <div className="flex gap-1.5">
              <select
                value={dossierCorridor}
                onChange={(e) => setDossierCorridor(e.target.value as ExportCorridorId)}
                className="h-9 w-2/3 rounded-xl border border-line bg-sunken px-2 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
              >
                {EXPORT_CORRIDOR_IDS.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                value={dossierIncoterm}
                onChange={(e) => setDossierIncoterm(e.target.value as Incoterm)}
                className="h-9 w-1/3 rounded-xl border border-line bg-sunken px-2 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
              >
                {INCOTERMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Qty &amp; Unit Price ($)
            </span>
            <div className="flex gap-1.5">
              <input
                type="number"
                min={1}
                value={dossierQty}
                onChange={(e) => setDossierQty(Math.max(1, Number(e.target.value) || 1))}
                className="h-9 w-1/2 rounded-xl border border-line bg-sunken px-2.5 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
              />
              <input
                type="number"
                min={1}
                value={dossierUnitUsd}
                onChange={(e) => setDossierUnitUsd(Math.max(1, Number(e.target.value) || 1))}
                className="h-9 w-1/2 rounded-xl border border-line bg-sunken px-2.5 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 text-body-xs font-mono text-fg-muted cursor-pointer">
            <input
              type="checkbox"
              checked={includesBattery}
              onChange={(e) => setIncludesBattery(e.target.checked)}
              className="size-4 rounded border-line accent-accent"
            />
            <span>Include UN 38.3 &amp; Class 9 Lithium Battery Declaration</span>
          </label>
          <span className="text-[11px] font-mono text-fg-subtle">
            GSTIN: {gstin} · Total Invoice: ${(dossierQty * dossierUnitUsd).toLocaleString('en-US')}
          </span>
        </div>

        <pre className="overflow-x-auto rounded-xl border border-hairline bg-sunken p-4 font-mono text-[11px] leading-relaxed text-fg whitespace-pre-wrap">
          {dossierText}
        </pre>
      </Card>

      {/* Section C: Interactive PLI & Export Grant Matchmaker */}
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Award className="size-4 text-accent-fg" />
              <h3 className="font-display text-headline-sm font-bold text-fg">
                PLI &amp; Indian Export Incentive Matchmaker
              </h3>
            </div>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Match across PLI Drones, PLI ACC Battery, PLI Electronics, PLI Auto Components, RoDTEP, Duty Drawback, Advance Authorization, DGFT MAI &amp; ECGC.
            </p>
          </div>
          <Badge tone="accent" variant="outline">
            9 Central Schemes
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Manufacturing Sector
            </span>
            <select
              aria-label="PLI Sector"
              value={pliSector}
              onChange={(e) => setPliSector(e.target.value as SectorId)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            >
              {SECTOR_OPTIONS_FOR_PLI.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Product Archetype
            </span>
            <select
              aria-label="PLI Product Archetype"
              value={pliArchetype}
              onChange={(e) => setPliArchetype(e.target.value as ExportProductArchetype)}
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
              Annual Export Turnover (₹ Lakhs)
            </span>
            <input
              aria-label="Annual Export Turnover Lakhs"
              type="number"
              min={10}
              step={50}
              value={annualTurnoverLakhs}
              onChange={(e) => setAnnualTurnoverLakhs(Math.max(1, Number(e.target.value) || 1))}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            />
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Incremental Plant CapEx (₹ Lakhs)
            </span>
            <input
              aria-label="Incremental Capex Lakhs"
              type="number"
              min={0}
              step={25}
              value={incrementalCapexLakhs}
              onChange={(e) => setIncrementalCapexLakhs(Math.max(0, Number(e.target.value) || 0))}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            />
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Domestic Value Addition (%)
            </span>
            <input
              aria-label="PLI Domestic Value Addition"
              type="number"
              min={10}
              max={100}
              step={5}
              value={domesticVaPercent}
              onChange={(e) =>
                setDomesticVaPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
              }
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            />
          </label>

          <label className="space-y-1 text-body-xs">
            <span className="font-mono text-[10px] font-bold uppercase text-fg-subtle block">
              Primary Corridor
            </span>
            <select
              aria-label="PLI Primary Corridor"
              value={pliCorridor}
              onChange={(e) => setPliCorridor(e.target.value as ExportCorridorId)}
              className="h-9 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
            >
              {EXPORT_CORRIDOR_IDS.map((c) => (
                <option key={c} value={c}>
                  {CORRIDOR_META[c].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-hairline bg-sunken px-3 py-2 cursor-pointer text-body-xs font-mono">
            <input
              type="checkbox"
              checked={importsRawMaterials}
              onChange={(e) => setImportsRawMaterials(e.target.checked)}
              className="size-4 rounded border-line accent-accent"
            />
            <span>Imports ICs / Cells for Re-Export</span>
          </label>

          <label className="flex items-center gap-2 rounded-xl border border-hairline bg-sunken px-3 py-2 cursor-pointer text-body-xs font-mono">
            <input
              type="checkbox"
              checked={hasUdyam}
              onChange={(e) => setHasUdyam(e.target.checked)}
              className="size-4 rounded border-line accent-accent"
            />
            <span>MSME Udyam Registered</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {matchedSchemes.map((item) => {
            const tierTone =
              item.eligibilityTier === 'primary_match'
                ? 'success'
                : item.eligibilityTier === 'conditional_match'
                  ? 'warning'
                  : 'neutral';
            const tierText =
              item.eligibilityTier === 'primary_match'
                ? 'Primary Match'
                : item.eligibilityTier === 'conditional_match'
                  ? 'Conditional'
                  : 'Scale Gated';

            return (
              <div
                key={item.scheme.id}
                className="rounded-xl border border-hairline bg-sunken/70 p-4 space-y-2.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-display text-body-sm font-bold text-fg">
                      {item.scheme.name}
                    </div>
                    <div className="text-[11px] font-mono text-fg-subtle">
                      {item.scheme.ministryOrAgency}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge tone="accent" variant="outline">
                      {item.relevanceScore}/100
                    </Badge>
                    <Badge tone={tierTone} variant="solid">
                      {tierText}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs font-mono font-semibold text-accent-fg">
                  Est. Benefit: ₹{item.estimatedAnnualBenefitInr.toLocaleString('en-IN')}/yr
                </div>
                <p className="text-body-xs text-fg-muted leading-relaxed">
                  {item.estimatedBenefitNote}
                </p>
                <div className="rounded-lg border border-hairline bg-surface-1 p-2.5 text-[11px] text-fg space-y-1">
                  <div className="font-mono text-fg-subtle">
                    Threshold: {item.scheme.minimumTurnoverOrInvestmentInr}
                  </div>
                  <div className="font-medium text-fg">Next Action: {item.nextAction}</div>
                </div>
                <a
                  href={item.scheme.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-accent-fg hover:underline"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
