'use client';

import { useState, useMemo } from 'react';
import { Card, Badge, Button } from '@hackerland/ui';
import { Calculator, Sparkles, ArrowRight } from 'lucide-react';
import { PLANT_BLUEPRINTS } from './how-to-start-data';

type ScaleTier = 'ems_pilot' | 'pilot' | 'commercial' | 'mega';
type MachineryTier = 'domestic' | 'hybrid' | 'tier1_imported';

function formatInrFromCrores(crores: number): string {
  if (crores < 1) {
    const lakhs = crores * 100;
    return `₹${lakhs.toFixed(1)} L`;
  }
  if (crores >= 100) {
    return `₹${crores.toFixed(0)} Cr`;
  }
  return `₹${crores.toFixed(1)} Cr`;
}

export function PlantBudgetEstimator() {
  const [selectedSlug, setSelectedSlug] = useState<string>('cycle-manufacturing');
  const [scaleTier, setScaleTier] = useState<ScaleTier>('commercial');
  const [machineryTier, setMachineryTier] = useState<MachineryTier>('hybrid');
  const [shiftCount, setShiftCount] = useState<1 | 2 | 3>(2);

  const selectedBlueprint = useMemo(() => {
    return PLANT_BLUEPRINTS.find((p) => p.slug === selectedSlug) ?? PLANT_BLUEPRINTS[0]!;
  }, [selectedSlug]);

  const estimation = useMemo(() => {
    const isEmsBridge = scaleTier === 'ems_pilot';

    if (isEmsBridge) {
      const midpointLakhs = selectedBlueprint.pilotScaleOption?.midpointLakhs ?? 18;
      const toolingFactor =
        machineryTier === 'domestic' ? 0.8 : machineryTier === 'tier1_imported' ? 1.2 : 1.0;
      const totalCapEx = Math.min(0.4, Math.max(0.05, (midpointLakhs / 100) * toolingFactor));

      const toolingAndNreCost = totalCapEx * 0.35;
      const batchRunsCost = totalCapEx * 0.4;
      const labAndCertCost = totalCapEx * 0.15;
      const workingBufferCost = totalCapEx * 0.1;

      const shiftMultiplier = shiftCount === 1 ? 0.75 : shiftCount === 2 ? 1.0 : 1.25;
      const monthlyRevenueCrores = totalCapEx * 0.24 * shiftMultiplier;
      const monthlyOpExCrores = monthlyRevenueCrores / 1.32;
      const annualRevenueCrores = monthlyRevenueCrores * 12;
      const annualNetProfitCrores = (monthlyRevenueCrores - monthlyOpExCrores) * 12 * 0.75;
      const paybackMonths = annualNetProfitCrores > 0 ? (totalCapEx / annualNetProfitCrores) * 12 : 18;

      return {
        isEmsBridge: true,
        totalCapEx,
        segments: [
          {
            label: 'Tooling & NRE',
            pct: 35,
            amount: toolingAndNreCost,
            barClass: 'bg-accent text-on-solid',
          },
          {
            label: 'EMS Pilot Lots',
            pct: 40,
            amount: batchRunsCost,
            barClass: 'bg-code text-on-solid',
          },
          {
            label: 'NABL / Certs',
            pct: 15,
            amount: labAndCertCost,
            barClass: 'bg-warning text-fg',
          },
          {
            label: 'Working Buffer',
            pct: 10,
            amount: workingBufferCost,
            barClass: 'bg-success text-on-solid',
          },
        ],
        annualRevenueCrores,
        annualNetProfitCrores,
        paybackMonths,
      };
    }

    // Unified commercial baseline aligned 1:1 with PLANT_BLUEPRINTS slugs
    const baseCapExCrores = selectedBlueprint.estimatorBaseCapExCrores ?? 15.0;

    const scaleMultiplier = scaleTier === 'pilot' ? 0.35 : scaleTier === 'mega' ? 3.2 : 1.0;
    const machineMultiplier =
      machineryTier === 'domestic' ? 0.72 : machineryTier === 'tier1_imported' ? 1.45 : 1.0;

    const totalCapEx = baseCapExCrores * scaleMultiplier * machineMultiplier;

    const machineryCost = totalCapEx * 0.58;
    const civilAndCleanroom = totalCapEx * 0.22;
    const electricalPowerGrid = totalCapEx * 0.08;
    const initialWorkingCapital = totalCapEx * 0.12;

    const shiftMultiplier = shiftCount === 1 ? 0.55 : shiftCount === 2 ? 1.0 : 1.45;
    const monthlyOpExCrores = totalCapEx * 0.045 * shiftMultiplier;
    const monthlyRevenueCrores = monthlyOpExCrores * 1.38;
    const annualRevenueCrores = monthlyRevenueCrores * 12;
    const annualNetProfitCrores = (monthlyRevenueCrores - monthlyOpExCrores) * 12 * 0.75;
    const paybackMonths = annualNetProfitCrores > 0 ? (totalCapEx / annualNetProfitCrores) * 12 : 60;

    return {
      isEmsBridge: false,
      totalCapEx,
      segments: [
        {
          label: 'Machines',
          pct: 58,
          amount: machineryCost,
          barClass: 'bg-accent text-on-solid',
        },
        {
          label: 'Civil/Cleanroom',
          pct: 22,
          amount: civilAndCleanroom,
          barClass: 'bg-code text-on-solid',
        },
        {
          label: 'Power',
          pct: 8,
          amount: electricalPowerGrid,
          barClass: 'bg-warning text-fg',
        },
        {
          label: 'Working Cap',
          pct: 12,
          amount: initialWorkingCapital,
          barClass: 'bg-success text-on-solid',
        },
      ],
      annualRevenueCrores,
      annualNetProfitCrores,
      paybackMonths,
    };
  }, [selectedBlueprint, scaleTier, machineryTier, shiftCount]);

  return (
    <Card className="p-5 sm:p-6 bg-surface-1 border-hairline space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="size-4 text-accent-fg" />
            <span className="text-caption font-mono uppercase font-bold text-fg">
              Industrial Plant CapEx &amp; Missing-Middle Estimator
            </span>
          </div>
          <h3 className="text-body-sm font-display font-bold text-fg">
            Estimate Setup Cost, Pilot Bridge &amp; Payback for {selectedBlueprint.title}
          </h3>
        </div>
        <Badge tone="accent" variant="solid" className="font-mono text-caption self-start sm:self-auto">
          {PLANT_BLUEPRINTS.length} Make-In-India Presets
        </Badge>
      </div>

      {/* Missing Middle Callout Strip */}
      {selectedBlueprint.pilotScaleOption && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-accent-soft border border-accent/25">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-accent-fg uppercase">
              <Sparkles className="size-3.5" />
              <span>Start Smaller Bridge ({selectedBlueprint.pilotScaleOption.budgetRangeInr})</span>
            </div>
            <p className="text-caption text-fg-muted">
              {selectedBlueprint.pilotScaleOption.batchSize} · {selectedBlueprint.pilotScaleOption.bridgeModel}
            </p>
          </div>
          {scaleTier !== 'ems_pilot' && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0 font-mono text-caption gap-1.5"
              onClick={() => setScaleTier('ems_pilot')}
            >
              <span>Simulate ₹5L–₹40L Pilot</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            Target Industry ({PLANT_BLUEPRINTS.length})
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-sunken border border-hairline text-caption font-medium text-fg focus:border-accent focus:outline-none"
          >
            {PLANT_BLUEPRINTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            Plant Scale Tier
          </label>
          <select
            value={scaleTier}
            onChange={(e) => setScaleTier(e.target.value as ScaleTier)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-sunken border border-hairline text-caption font-medium text-fg focus:border-accent focus:outline-none"
          >
            <option value="ems_pilot">EMS / Job-Shop Pilot (₹5L–₹40L)</option>
            <option value="pilot">Pilot Micro-Unit (Fast Bring-up)</option>
            <option value="commercial">Commercial Scale (Standard)</option>
            <option value="mega">Industrial Mega-Facility (High Volume)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            {estimation.isEmsBridge ? 'Tooling & EMS Partner Tier' : 'Machinery Sourcing'}
          </label>
          <select
            value={machineryTier}
            onChange={(e) => setMachineryTier(e.target.value as MachineryTier)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-sunken border border-hairline text-caption font-medium text-fg focus:border-accent focus:outline-none"
          >
            <option value="domestic">Domestic Indian Machinery / Job-Shop</option>
            <option value="hybrid">Hybrid (Domestic + Imported Critical)</option>
            <option value="tier1_imported">Tier-1 German / Japanese (Max Spec)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            Operating Shifts
          </label>
          <select
            value={shiftCount}
            onChange={(e) => setShiftCount(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-sunken border border-hairline text-caption font-medium text-fg focus:border-accent focus:outline-none"
          >
            <option value={1}>1 Shift (8 Hours / Day)</option>
            <option value={2}>2 Shifts (16 Hours / Day - Sweetspot)</option>
            <option value={3}>3 Shifts Continuous (24/7 Production)</option>
          </select>
        </div>
      </div>

      {/* Output KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-hairline">
        <div className="p-3.5 rounded-xl bg-sunken border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">
            {estimation.isEmsBridge ? 'Pilot Bridge Budget' : 'Estimated Startup CapEx'}
          </span>
          <span className="text-heading-md font-mono font-bold text-accent-fg">
            {formatInrFromCrores(estimation.totalCapEx)}
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            {estimation.isEmsBridge ? 'NRE + Pilot Lot + Lab Certs' : 'Machinery + Civil + Working Cap'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sunken border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Annual Revenue (Est)</span>
          <span className="text-heading-md font-mono font-bold text-success-fg">
            {formatInrFromCrores(estimation.annualRevenueCrores)}
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            At {selectedBlueprint.unitEconomics.breakEvenCapacityUtil}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sunken border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Annual Net Profit</span>
          <span className="text-heading-md font-mono font-bold text-fg">
            {formatInrFromCrores(estimation.annualNetProfitCrores)}
          </span>
          <span className="text-[10px] font-mono text-accent-fg block">
            Net Margin: {selectedBlueprint.unitEconomics.netMargin}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sunken border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Payback Period</span>
          <span className="text-heading-md font-mono font-bold text-warning-fg">
            {estimation.paybackMonths.toFixed(1)}{' '}
            <span className="text-caption text-fg-muted">Months</span>
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            ({(estimation.paybackMonths / 12).toFixed(1)} Years Payback)
          </span>
        </div>
      </div>

      {/* CapEx Allocation Bar */}
      <div className="space-y-2 pt-2 border-t border-hairline">
        <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
          {estimation.isEmsBridge
            ? 'Missing-Middle Pilot Capital Allocation (Before Full Plant CapEx)'
            : 'Capital Expenditure (CapEx) Allocation'}
        </span>
        <div className="w-full h-7 rounded-lg overflow-hidden flex shadow-xs border border-hairline">
          {estimation.segments.map((seg) => (
            <div
              key={seg.label}
              style={{ width: `${seg.pct}%` }}
              className={`${seg.barClass} flex items-center justify-center text-[10px] font-mono font-bold px-1 truncate`}
              title={`${seg.label}: ${formatInrFromCrores(seg.amount)}`}
            >
              {seg.label} ({seg.pct}% · {formatInrFromCrores(seg.amount)})
            </div>
          ))}
        </div>
      </div>

      {estimation.isEmsBridge && selectedBlueprint.pilotScaleOption && (
        <div className="p-3.5 rounded-xl bg-sunken border border-hairline text-caption space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase text-fg block">
            Graduation Gate Before Scaling to Full Plant ({selectedBlueprint.capitalRequirements.pilotCapEx})
          </span>
          <p className="text-fg-muted">{selectedBlueprint.pilotScaleOption.graduationGate}</p>
        </div>
      )}
    </Card>
  );
}
