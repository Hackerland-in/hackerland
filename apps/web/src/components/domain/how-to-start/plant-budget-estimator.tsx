'use client';

import { useState, useMemo } from 'react';
import { Card, Badge, Button } from '@hackerland/ui';
import { Calculator, DollarSign, Factory, Sliders, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PLANT_BLUEPRINTS } from './how-to-start-data';

export function PlantBudgetEstimator() {
  const [selectedSlug, setSelectedSlug] = useState<string>('cycle-manufacturing');
  const [scaleTier, setScaleTier] = useState<'pilot' | 'commercial' | 'mega'>('commercial');
  const [machineryTier, setMachineryTier] = useState<'domestic' | 'hybrid' | 'tier1_imported'>('hybrid');
  const [shiftCount, setShiftCount] = useState<1 | 2 | 3>(2);

  const selectedBlueprint = useMemo(() => {
    return PLANT_BLUEPRINTS.find((p) => p.slug === selectedSlug) ?? PLANT_BLUEPRINTS[0]!;
  }, [selectedSlug]);

  // Financial calculations
  const estimation = useMemo(() => {
    // Base capital multipliers
    let baseCapExCrores = 5.0; // ₹5 Cr default baseline
    if (selectedSlug === 'fab-manufacturing') baseCapExCrores = 120.0;
    if (selectedSlug === 'carbon-fiber-hub') baseCapExCrores = 28.0;
    if (selectedSlug === 'pcb-plant') baseCapExCrores = 35.0;
    if (selectedSlug === 'cycle-manufacturing') baseCapExCrores = 16.0;
    if (selectedSlug === 'precision-mechanical-parts') baseCapExCrores = 12.0;
    if (selectedSlug === 'mobile-parts') baseCapExCrores = 45.0;
    if (selectedSlug === 'ev-battery-pack') baseCapExCrores = 38.0;
    if (selectedSlug === 'drone-aerospace') baseCapExCrores = 14.0;

    // Scale adjustments
    let scaleMultiplier = 1.0;
    if (scaleTier === 'pilot') scaleMultiplier = 0.35;
    if (scaleTier === 'mega') scaleMultiplier = 3.2;

    // Machinery sourcing adjustments
    let machineMultiplier = 1.0;
    if (machineryTier === 'domestic') machineMultiplier = 0.72; // 28% cheaper domestic machines
    if (machineryTier === 'tier1_imported') machineMultiplier = 1.45; // 45% premium for DMG Mori / Disco / Hesse

    const totalCapEx = baseCapExCrores * scaleMultiplier * machineMultiplier;

    // CapEx breakdown
    const machineryCost = totalCapEx * 0.58;
    const civilAndCleanroom = totalCapEx * 0.22;
    const electricalPowerGrid = totalCapEx * 0.08;
    const initialWorkingCapital = totalCapEx * 0.12;

    // Capacity & OpEx
    const shiftMultiplier = shiftCount === 1 ? 0.55 : shiftCount === 2 ? 1.0 : 1.45;
    const monthlyOpExCrores = totalCapEx * 0.045 * shiftMultiplier;
    const monthlyRevenueCrores = monthlyOpExCrores * 1.38; // 38% gross margin avg
    const annualRevenueCrores = monthlyRevenueCrores * 12;
    const annualNetProfitCrores = (monthlyRevenueCrores - monthlyOpExCrores) * 12 * 0.75; // after 25% corporate tax

    const paybackMonths = annualNetProfitCrores > 0 ? (totalCapEx / annualNetProfitCrores) * 12 : 60;

    return {
      totalCapEx,
      machineryCost,
      civilAndCleanroom,
      electricalPowerGrid,
      initialWorkingCapital,
      monthlyOpExCrores,
      annualRevenueCrores,
      annualNetProfitCrores,
      paybackMonths,
    };
  }, [selectedSlug, scaleTier, machineryTier, shiftCount]);

  return (
    <Card className="p-5 sm:p-6 bg-surface-1 border-hairline space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="size-4 text-accent" />
            <span className="text-caption font-mono uppercase font-bold text-fg">
              Industrial Plant CapEx & Feasibility Calculator
            </span>
          </div>
          <h3 className="text-body-sm font-display font-bold text-fg">
            Estimate Setup Cost, Cleanroom Footprint & Payback for {selectedBlueprint?.title}
          </h3>
        </div>
        <Badge tone="accent" variant="solid" className="font-mono text-caption self-start sm:self-auto">
          Make In India Economics
        </Badge>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            Target Industry
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
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
            onChange={(e) => setScaleTier(e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
          >
            <option value="pilot">Pilot Micro-Unit (Fast Bring-up)</option>
            <option value="commercial">Commercial Scale (Standard)</option>
            <option value="mega">Industrial Mega-Facility (High Volume)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            Machinery Sourcing
          </label>
          <select
            value={machineryTier}
            onChange={(e) => setMachineryTier(e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
          >
            <option value="domestic">Domestic Indian Machinery</option>
            <option value="hybrid">Hybrid (Domestic + Imported Critical)</option>
            <option value="tier1_imported">Tier-1 German / Japanese (Max Speed)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono text-fg-muted uppercase font-bold block mb-1">
            Operating Shifts
          </label>
          <select
            value={shiftCount}
            onChange={(e) => setShiftCount(Number(e.target.value) as any)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-surface-2 border border-hairline text-caption font-medium text-fg"
          >
            <option value={1}>1 Shift (8 Hours / Day)</option>
            <option value={2}>2 Shifts (16 Hours / Day - Sweetspot)</option>
            <option value={3}>3 Shifts Continuous (24/7 Production)</option>
          </select>
        </div>
      </div>

      {/* Output KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-hairline/60">
        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Estimated Startup CapEx</span>
          <span className="text-heading-md font-mono font-bold text-accent">
            ₹{estimation.totalCapEx >= 100 ? (estimation.totalCapEx).toFixed(0) : estimation.totalCapEx.toFixed(1)} Cr
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            Machinery + Civil + Working Cap
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Annual Revenue (Est)</span>
          <span className="text-heading-md font-mono font-bold text-emerald-400">
            ₹{estimation.annualRevenueCrores.toFixed(1)} Cr
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            At {selectedBlueprint?.unitEconomics.breakEvenCapacityUtil}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Annual Net Profit</span>
          <span className="text-heading-md font-mono font-bold text-fg">
            ₹{estimation.annualNetProfitCrores.toFixed(1)} Cr
          </span>
          <span className="text-[10px] font-mono text-accent block">
            Net Margin: {selectedBlueprint?.unitEconomics.netMargin}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Payback Period</span>
          <span className="text-heading-md font-mono font-bold text-amber-400">
            {estimation.paybackMonths.toFixed(1)} <span className="text-caption text-fg-muted">Months</span>
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            ({(estimation.paybackMonths / 12).toFixed(1)} Years Payback)
          </span>
        </div>
      </div>

      {/* CapEx Breakdown Bar */}
      <div className="space-y-2 pt-2 border-t border-hairline/60">
        <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
          Capital Expenditure (CapEx) Allocation
        </span>
        <div className="w-full h-7 rounded-lg overflow-hidden flex shadow-inner border border-hairline">
          <div
            style={{ width: '58%' }}
            className="bg-accent flex items-center justify-center text-[10px] font-mono font-bold text-on-solid px-1 truncate"
            title={`Machinery: ₹${estimation.machineryCost.toFixed(1)} Cr`}
          >
            Machines (58% · ₹{estimation.machineryCost.toFixed(1)}Cr)
          </div>
          <div
            style={{ width: '22%' }}
            className="bg-sky-600 flex items-center justify-center text-[10px] font-mono font-bold text-white px-1 truncate"
            title={`Civil & Cleanroom: ₹${estimation.civilAndCleanroom.toFixed(1)} Cr`}
          >
            Civil/Cleanroom (22%)
          </div>
          <div
            style={{ width: '8%' }}
            className="bg-amber-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 px-1 truncate"
            title={`Electrical: ₹${estimation.electricalPowerGrid.toFixed(1)} Cr`}
          >
            Power (8%)
          </div>
          <div
            style={{ width: '12%' }}
            className="bg-emerald-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 px-1 truncate"
            title={`Working Capital: ₹${estimation.initialWorkingCapital.toFixed(1)} Cr`}
          >
            Working Cap (12%)
          </div>
        </div>
      </div>
    </Card>
  );
}
