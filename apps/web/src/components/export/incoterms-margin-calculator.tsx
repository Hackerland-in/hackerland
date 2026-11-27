'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CORRIDOR_META,
  EXPORT_CORRIDOR_IDS,
  HSN_EXPORT_PROFILES,
  INCOTERMS,
  calculateExportUnitEconomics,
  type ExportCorridorId,
  type Incoterm,
} from '@hackerland/core';
import { Badge, Card, ProgressBar, cn } from '@hackerland/ui';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Coins,
  Package,
  Ship,
  TrendingUp,
} from 'lucide-react';
import { EXPORT_ARCHETYPE_METADATA } from '@/lib/data/export-trade-data';

export interface IncotermsCalculatorSnapshotState {
  hsnCode: string;
  corridor: ExportCorridorId;
  selectedIncoterm: Incoterm;
  exWorksCostInr: number;
  markupPercent: number;
  importedBomPercent: number;
  quantity: number;
  usePreferentialFta: boolean;
  gstLutEnabled: boolean;
  usingAdvanceAuth: boolean;
  targetPriceUsd: number;
}

interface IncotermsMarginCalculatorProps {
  initialCorridor?: ExportCorridorId;
  lockedCorridor?: boolean;
  initialHsnCode?: string;
  externalState?: Partial<IncotermsCalculatorSnapshotState> | null;
  onStateChange?: (state: IncotermsCalculatorSnapshotState) => void;
}

export function IncotermsMarginCalculator({
  initialCorridor = 'uae_gcc',
  lockedCorridor = false,
  initialHsnCode = '85176290',
  externalState,
  onStateChange,
}: IncotermsMarginCalculatorProps) {
  const defaultProfile =
    HSN_EXPORT_PROFILES.find((p) => p.hsnCode === initialHsnCode) ?? HSN_EXPORT_PROFILES[0]!;
  const defaultMeta = EXPORT_ARCHETYPE_METADATA[defaultProfile.productArchetype];

  const [hsnCode, setHsnCode] = useState<string>(defaultProfile.hsnCode);
  const [corridor, setCorridor] = useState<ExportCorridorId>(initialCorridor);
  const [selectedIncoterm, setSelectedIncoterm] = useState<Incoterm>('CIF');
  const [exWorksCostInr, setExWorksCostInr] = useState<number>(
    defaultMeta.defaultBomInr + defaultMeta.defaultMfgQaInr,
  );
  const [markupPercent, setMarkupPercent] = useState<number>(40);
  const [importedBomPercent, setImportedBomPercent] = useState<number>(
    defaultMeta.defaultImportedBomPercent,
  );
  const [quantity, setQuantity] = useState<number>(500);
  const [usePreferentialFta, setUsePreferentialFta] = useState<boolean>(true);
  const [gstLutEnabled, setGstLutEnabled] = useState<boolean>(true);
  const [usingAdvanceAuth, setUsingAdvanceAuth] = useState<boolean>(false);
  const [targetPriceUsd, setTargetPriceUsd] = useState<number>(defaultMeta.defaultTargetPriceUsd);

  useEffect(() => {
    if (!externalState) return;
    if (externalState.hsnCode) setHsnCode(externalState.hsnCode);
    if (externalState.corridor && !lockedCorridor) setCorridor(externalState.corridor);
    if (externalState.selectedIncoterm) setSelectedIncoterm(externalState.selectedIncoterm);
    if (typeof externalState.exWorksCostInr === 'number') setExWorksCostInr(externalState.exWorksCostInr);
    if (typeof externalState.markupPercent === 'number') setMarkupPercent(externalState.markupPercent);
    if (typeof externalState.importedBomPercent === 'number') {
      setImportedBomPercent(externalState.importedBomPercent);
    }
    if (typeof externalState.quantity === 'number') setQuantity(externalState.quantity);
    if (typeof externalState.usePreferentialFta === 'boolean') {
      setUsePreferentialFta(externalState.usePreferentialFta);
    }
    if (typeof externalState.gstLutEnabled === 'boolean') setGstLutEnabled(externalState.gstLutEnabled);
    if (typeof externalState.usingAdvanceAuth === 'boolean') {
      setUsingAdvanceAuth(externalState.usingAdvanceAuth);
    }
    if (typeof externalState.targetPriceUsd === 'number') setTargetPriceUsd(externalState.targetPriceUsd);
  }, [externalState, lockedCorridor]);

  useEffect(() => {
    onStateChange?.({
      hsnCode,
      corridor,
      selectedIncoterm,
      exWorksCostInr,
      markupPercent,
      importedBomPercent,
      quantity,
      usePreferentialFta,
      gstLutEnabled,
      usingAdvanceAuth,
      targetPriceUsd,
    });
  }, [
    hsnCode,
    corridor,
    selectedIncoterm,
    exWorksCostInr,
    markupPercent,
    importedBomPercent,
    quantity,
    usePreferentialFta,
    gstLutEnabled,
    usingAdvanceAuth,
    targetPriceUsd,
    onStateChange,
  ]);

  const activeProfile = useMemo(
    () => HSN_EXPORT_PROFILES.find((p) => p.hsnCode === hsnCode) ?? HSN_EXPORT_PROFILES[0]!,
    [hsnCode],
  );

  const handleHsnChange = (nextHsn: string) => {
    setHsnCode(nextHsn);
    const nextProfile = HSN_EXPORT_PROFILES.find((p) => p.hsnCode === nextHsn);
    if (nextProfile) {
      const meta = EXPORT_ARCHETYPE_METADATA[nextProfile.productArchetype];
      setExWorksCostInr(meta.defaultBomInr + meta.defaultMfgQaInr);
      setImportedBomPercent(meta.defaultImportedBomPercent);
      setTargetPriceUsd(meta.defaultTargetPriceUsd);
    }
  };

  const domesticValueAddPercent = Math.max(0, Math.min(100, 100 - importedBomPercent));

  const economics = useMemo(() => {
    const safeCost = Math.max(100, exWorksCostInr);
    const bomCostInr = Math.round(safeCost * 0.76);
    const manufacturingAndQaCostInr = Math.max(0, safeCost - bomCostInr);
    return calculateExportUnitEconomics({
      corridor,
      productArchetype: activeProfile.productArchetype,
      bomCostInr,
      manufacturingAndQaCostInr,
      packagingAndExportPrepInr: 0,
      targetExWorksMarkupPercent: markupPercent,
      quantity,
      domesticValueAddPercent,
      usePreferentialFta,
      usingAdvanceAuthorization: usingAdvanceAuth,
      targetRetailMsrpUsd: targetPriceUsd,
    });
  }, [
    corridor,
    activeProfile.productArchetype,
    exWorksCostInr,
    markupPercent,
    quantity,
    domesticValueAddPercent,
    usePreferentialFta,
    usingAdvanceAuth,
    targetPriceUsd,
  ]);

  const activeStep =
    economics.incotermWaterfall.find((w) => w.incoterm === selectedIncoterm) ??
    economics.incotermWaterfall[0]!;

  const maxStepInr = Math.max(1, economics.ddpInr);
  const workingCapitalUnlockedPerUnitInr = gstLutEnabled ? economics.igstWorkingCapitalSavedInr : 0;
  const totalWarnings = useMemo(() => {
    const list = [...economics.warningFlags];
    if (!gstLutEnabled) {
      list.push(
        `GST LUT (Form RFD-11) disabled: ₹${(economics.igstWorkingCapitalSavedInr * economics.quantity).toLocaleString('en-IN')} (${activeProfile.igstRatePercent}% IGST) will be locked in upfront refund queues.`,
      );
    }
    if (activeProfile.scometFlagged) {
      list.push(
        `ITC-HS ${activeProfile.hsnCode} carries DGFT SCOMET screening — verify technical parameters before filing Shipping Bill.`,
      );
    }
    return list;
  }, [
    economics.warningFlags,
    economics.igstWorkingCapitalSavedInr,
    economics.quantity,
    gstLutEnabled,
    activeProfile.igstRatePercent,
    activeProfile.scometFlagged,
    activeProfile.hsnCode,
  ]);

  return (
    <div className="space-y-5 min-w-0">
      <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              8-Digit ITC-HS &amp; Incoterms 2020 Export Margin Simulator
            </h2>
            <p className="text-body-xs text-fg-muted mt-0.5">
              Model EXW → FCA → FOB → CIF → DAP → DDP waterfall in ₹ &amp; $, FTA Regional Value Content, RoDTEP, and GST LUT working capital.
            </p>
          </div>
          <Badge tone="accent" variant="outline">
            HSN {activeProfile.hsnCode} · FX ₹{economics.exchangeRateInrPerUsd}/$
          </Badge>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              8-Digit ITC-HS Tariff Profile
            </span>
            <select
              aria-label="8-Digit ITC-HS Profile"
              value={hsnCode}
              onChange={(e) => handleHsnChange(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            >
              {HSN_EXPORT_PROFILES.map((profile) => (
                <option key={profile.hsnCode} value={profile.hsnCode}>
                  {profile.hsnCode} — {profile.description}
                </option>
              ))}
            </select>
          </label>

          {!lockedCorridor && (
            <label className="space-y-1.5 text-body-xs">
              <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
                Export Corridor
              </span>
              <select
                aria-label="Export Corridor"
                value={corridor}
                onChange={(e) => setCorridor(e.target.value as ExportCorridorId)}
                className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
              >
                {EXPORT_CORRIDOR_IDS.map((cId) => (
                  <option key={cId} value={cId}>
                    {CORRIDOR_META[cId].label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              Active Incoterm 2020 Quote
            </span>
            <select
              aria-label="Active Incoterm 2020"
              value={selectedIncoterm}
              onChange={(e) => setSelectedIncoterm(e.target.value as Incoterm)}
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            >
              {INCOTERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              Ex-Works Unit Cost (₹ INR)
            </span>
            <input
              aria-label="Ex-Works Unit Cost INR"
              type="number"
              min={100}
              step={100}
              value={exWorksCostInr}
              onChange={(e) => setExWorksCostInr(Math.max(100, Number(e.target.value) || 0))}
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>

          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              Imported BOM Content (%) — DVA {domesticValueAddPercent}%
            </span>
            <input
              aria-label="Imported BOM Percentage"
              type="number"
              min={0}
              max={95}
              step={5}
              value={importedBomPercent}
              onChange={(e) =>
                setImportedBomPercent(Math.min(95, Math.max(0, Number(e.target.value) || 0)))
              }
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>

          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              Export Batch Size (Units)
            </span>
            <input
              aria-label="Export Batch Size"
              type="number"
              min={10}
              step={50}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>

          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              Ex-Works Markup (%)
            </span>
            <input
              aria-label="Ex-Works Markup Percent"
              type="number"
              min={5}
              max={300}
              step={5}
              value={markupPercent}
              onChange={(e) => setMarkupPercent(Math.max(0, Number(e.target.value) || 0))}
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>

          <label className="space-y-1.5 text-body-xs">
            <span className="font-mono text-[11px] font-bold uppercase text-fg-subtle block">
              Target Retail / Buyer Price ($ USD)
            </span>
            <input
              aria-label="Target Price USD"
              type="number"
              min={1}
              step={5}
              value={targetPriceUsd}
              onChange={(e) => setTargetPriceUsd(Math.max(1, Number(e.target.value) || 1))}
              className="h-10 w-full rounded-xl border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </label>
        </div>

        {/* Incoterm Pill Quick-Switch & Statutory Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-hairline">
          <span className="text-[11px] font-mono font-bold text-fg-subtle mr-1">
            INCOTERM:
          </span>
          {INCOTERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setSelectedIncoterm(term)}
              className={cn(
                'rounded-full border px-3 py-1 font-mono text-xs font-semibold transition-all',
                selectedIncoterm === term
                  ? 'border-accent bg-accent text-on-solid shadow-xs'
                  : 'border-line bg-sunken text-fg-muted hover:border-accent/40 hover:text-accent-fg',
              )}
            >
              {term}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label
            className={cn(
              'flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer select-none transition-colors',
              usePreferentialFta
                ? 'border-accent/40 bg-accent-soft/50 text-fg'
                : 'border-hairline bg-sunken text-fg-muted',
            )}
          >
            <input
              type="checkbox"
              checked={usePreferentialFta}
              onChange={(e) => setUsePreferentialFta(e.target.checked)}
              className="size-4 rounded border-line accent-accent shrink-0"
            />
            <span className="text-body-xs font-mono font-medium">
              Claim FTA Origin Certificate (CEPA / AIFTA)
            </span>
          </label>

          <label
            className={cn(
              'flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer select-none transition-colors',
              gstLutEnabled
                ? 'border-accent/40 bg-accent-soft/50 text-fg'
                : 'border-hairline bg-sunken text-fg-muted',
            )}
          >
            <input
              type="checkbox"
              checked={gstLutEnabled}
              onChange={(e) => setGstLutEnabled(e.target.checked)}
              className="size-4 rounded border-line accent-accent shrink-0"
            />
            <span className="text-body-xs font-mono font-medium">
              Zero-Rated Export via GST LUT (Form RFD-11)
            </span>
          </label>

          <label
            className={cn(
              'flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer select-none transition-colors',
              usingAdvanceAuth
                ? 'border-accent/40 bg-accent-soft/50 text-fg'
                : 'border-hairline bg-sunken text-fg-muted',
            )}
          >
            <input
              type="checkbox"
              checked={usingAdvanceAuth}
              onChange={(e) => setUsingAdvanceAuth(e.target.checked)}
              className="size-4 rounded border-line accent-accent shrink-0"
            />
            <span className="text-body-xs font-mono font-medium">
              Advance Authorization (0% BCD Input Import)
            </span>
          </label>
        </div>

        <p className="text-[11px] font-mono text-fg-muted rounded-xl border border-hairline bg-sunken px-3.5 py-2">
          HSN {activeProfile.hsnCode} Benchmark Note: {activeProfile.notes}
        </p>
      </Card>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-accent/30 bg-gradient-to-br from-surface-1 to-accent-soft p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-accent-fg font-bold">
            Selected {activeStep.incoterm} Quote / Unit
          </span>
          <div className="font-display text-headline-md font-bold text-fg tabular-nums">
            ${activeStep.usdPerUnit.toFixed(2)}{' '}
            <span className="text-body-sm text-fg-muted font-mono">
              (₹{activeStep.inrPerUnit.toLocaleString('en-IN')})
            </span>
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            Batch ({economics.quantity}): ${activeStep.totalBatchUsd.toLocaleString('en-US')}
          </span>
        </Card>

        <Card className="border-hairline bg-surface-1 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-fg-subtle flex items-center gap-1">
            <TrendingUp className="size-3 text-success-fg" /> Net Export Gross Margin
          </span>
          <div className="font-display text-headline-md font-bold text-success-fg tabular-nums">
            {economics.grossMarginPercent}%
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            Pre-incentive: {economics.grossMarginWithoutIncentivesPercent}% · MSRP {economics.msrpMultiplier}x COGS
          </span>
        </Card>

        <Card className="border-hairline bg-surface-1 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-fg-subtle flex items-center gap-1">
            <Coins className="size-3 text-accent-fg" /> RoDTEP + Drawback / Unit
          </span>
          <div className="font-display text-headline-md font-bold text-fg tabular-nums">
            ₹{(economics.rodtepCreditInr + economics.dutyDrawbackInr).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            RoDTEP ₹{economics.rodtepCreditInr} · DBK ₹{economics.dutyDrawbackInr}
          </span>
        </Card>

        <Card className="border-hairline bg-surface-1 p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-fg-subtle flex items-center gap-1">
            <Package className="size-3 text-accent-fg" /> GST LUT Working Capital Saved
          </span>
          <div className="font-display text-headline-md font-bold text-accent-fg tabular-nums">
            ₹{(workingCapitalUnlockedPerUnitInr * economics.quantity).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] font-mono text-fg-muted block">
            ₹{workingCapitalUnlockedPerUnitInr.toLocaleString('en-IN')}/unit ({activeProfile.igstRatePercent}% IGST)
          </span>
        </Card>
      </div>

      {/* Incoterms 2020 Waterfall + FTA RVC Verdict */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 border-hairline bg-surface-1 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Ship className="size-4 text-accent-fg" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
                Incoterms 2020 Cost Waterfall ({economics.quantity} Units · {economics.corridorLabel})
              </h3>
            </div>
            <span className="text-[11px] font-mono text-fg-subtle">
              Net EXW Realization: ₹{economics.netEffectiveExWorksInr.toLocaleString('en-IN')}/unit
            </span>
          </div>

          <div className="space-y-3">
            {economics.incotermWaterfall.map((step) => {
              const isSelected = step.incoterm === selectedIncoterm;
              return (
                <div
                  key={step.incoterm}
                  className={cn(
                    'rounded-xl border p-3.5 transition-all',
                    isSelected
                      ? 'border-accent bg-accent-soft/45'
                      : 'border-hairline bg-sunken/70',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <Badge tone={isSelected ? 'accent' : 'neutral'} variant={isSelected ? 'solid' : 'outline'}>
                        {step.incoterm}
                      </Badge>
                      <span className="text-body-xs font-semibold text-fg">{step.label}</span>
                    </div>
                    <div className="font-mono text-xs text-right tabular-nums">
                      <span className="font-bold text-fg">${step.usdPerUnit.toFixed(2)}</span>
                      <span className="text-fg-muted ml-2">
                        ₹{step.inrPerUnit.toLocaleString('en-IN')}/u
                      </span>
                      {step.addedCostPerUnitInr > 0 && (
                        <span className="text-accent-fg ml-2 text-[11px]">
                          (+₹{step.addedCostPerUnitInr.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>
                  </div>
                  <ProgressBar
                    value={step.inrPerUnit}
                    max={maxStepInr}
                    tone={isSelected ? 'accent' : 'neutral'}
                    label={`${step.incoterm} unit landed cost`}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* FTA Verdict + Credits + Warnings */}
        <div className="space-y-4">
          <Card
            className={cn(
              'p-5 space-y-3 border',
              !economics.ftaCheck.ftaApplicable
                ? 'border-hairline bg-surface-1'
                : economics.ftaCheck.eligible && usePreferentialFta
                  ? 'border-success/35 bg-success/5'
                  : 'border-warning/40 bg-warning/5',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase text-fg">
                FTA Regional Value Content Verdict
              </span>
              <Badge
                tone={
                  !economics.ftaCheck.ftaApplicable
                    ? 'neutral'
                    : economics.ftaCheck.eligible && usePreferentialFta
                      ? 'success'
                      : 'warning'
                }
                variant="solid"
              >
                {!economics.ftaCheck.ftaApplicable
                  ? 'MFN Tariff'
                  : economics.ftaCheck.eligible && usePreferentialFta
                    ? 'FTA Eligible'
                    : 'RVC / Toggle Gap'}
              </Badge>
            </div>

            <div className="text-body-xs font-semibold text-fg">
              {economics.ftaCheck.ftaSchemeName}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded-lg border border-hairline bg-surface-1 p-2.5">
                <span className="text-[10px] text-fg-subtle block">INDIAN VALUE ADD</span>
                <span className="font-bold text-fg">
                  {economics.ftaCheck.domesticValueAddPercent}%
                </span>
              </div>
              <div className="rounded-lg border border-hairline bg-surface-1 p-2.5">
                <span className="text-[10px] text-fg-subtle block">MIN RVC REQUIRED</span>
                <span className="font-bold text-fg">
                  {economics.ftaCheck.minRvcThresholdPercent}%
                </span>
              </div>
              <div className="rounded-lg border border-hairline bg-surface-1 p-2.5">
                <span className="text-[10px] text-fg-subtle block">MFN vs APPLIED DUTY</span>
                <span className="font-bold text-accent-fg">
                  {economics.ftaCheck.mfnDutyPercent}% → {economics.ftaCheck.appliedDutyPercent}%
                </span>
              </div>
              <div className="rounded-lg border border-hairline bg-surface-1 p-2.5">
                <span className="text-[10px] text-fg-subtle block">FTA DUTY SAVED</span>
                <span className="font-bold text-success-fg">
                  ${economics.ftaCheck.ftaDutyDeltaPerUnitUsd.toFixed(2)}/u
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-fg-muted flex items-center justify-between pt-1">
              <span>Want higher domestic RVC?</span>
              <Link href="/sourcing" className="text-accent-fg hover:underline inline-flex items-center gap-1">
                <span>Source India Alternates</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
              Margin Risk &amp; Working Capital Alerts
            </h4>
            {totalWarnings.length === 0 ? (
              <div className="flex items-start gap-2 text-body-xs text-success-fg font-mono">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <span>Unit economics, RVC origin, and working-capital buffers look export-healthy.</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {totalWarnings.map((flag, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/5 p-3 text-body-xs text-fg"
                  >
                    <AlertTriangle className="size-4 text-warning-fg shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
