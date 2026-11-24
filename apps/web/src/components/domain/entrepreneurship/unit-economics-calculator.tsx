'use client';

import { useState, useMemo } from 'react';
import { Card } from '@hackerland/ui';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export function UnitEconomicsCalculator() {
  const [modelType, setModelType] = useState<'saas' | 'hardware'>('saas');
  const [arpuMonthly, setArpuMonthly] = useState<number>(120); // $120/mo
  const [grossMarginPercent, setGrossMarginPercent] = useState<number>(82); // 82% margin
  const [monthlyChurnPercent, setMonthlyChurnPercent] = useState<number>(2.5); // 2.5% monthly churn
  const [cacUsd, setCacUsd] = useState<number>(650); // $650 to acquire customer

  const metrics = useMemo(() => {
    const grossMarginFactor = grossMarginPercent / 100;
    const monthlyChurnFactor = Math.max(0.005, monthlyChurnPercent / 100);

    // Lifetime Value: LTV = (ARPU * Gross Margin) / Churn
    const ltv = (arpuMonthly * grossMarginFactor) / monthlyChurnFactor;

    // LTV : CAC Ratio
    const ltvCacRatio = cacUsd > 0 ? ltv / cacUsd : 0;

    // CAC Payback Period (Months) = CAC / (ARPU * Gross Margin)
    const monthlyGrossProfit = arpuMonthly * grossMarginFactor;
    const paybackMonths = monthlyGrossProfit > 0 ? cacUsd / monthlyGrossProfit : 999;

    // Customer Lifetime (Months) = 1 / Churn
    const lifetimeMonths = 1 / monthlyChurnFactor;

    const isHealthy = ltvCacRatio >= 3.0 && paybackMonths <= 14;
    const isElite = ltvCacRatio >= 4.0 && paybackMonths <= 9;

    return {
      ltv,
      ltvCacRatio,
      paybackMonths,
      lifetimeMonths,
      monthlyGrossProfit,
      isHealthy,
      isElite,
    };
  }, [arpuMonthly, grossMarginPercent, monthlyChurnPercent, cacUsd]);

  return (
    <Card className="p-5 bg-surface-1 border-hairline space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="size-4 text-accent" />
            <span className="text-caption font-mono uppercase font-bold text-fg">
              Venture Unit Economics Engine
            </span>
          </div>
          <h3 className="text-body-sm font-display font-bold text-fg">
            LTV, CAC Payback Period & Sustainable Unit Profitability
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setModelType('saas');
              setGrossMarginPercent(82);
              setMonthlyChurnPercent(2.5);
              setArpuMonthly(120);
              setCacUsd(650);
            }}
            className={`px-3 py-1 rounded text-caption font-mono font-medium border ${
              modelType === 'saas'
                ? 'border-accent bg-accent/10 text-accent font-bold'
                : 'border-hairline bg-surface-2 text-fg-muted'
            }`}
          >
            SaaS / B2B
          </button>
          <button
            type="button"
            onClick={() => {
              setModelType('hardware');
              setGrossMarginPercent(48);
              setMonthlyChurnPercent(4.5);
              setArpuMonthly(45);
              setCacUsd(140);
            }}
            className={`px-3 py-1 rounded text-caption font-mono font-medium border ${
              modelType === 'hardware'
                ? 'border-accent bg-accent/10 text-accent font-bold'
                : 'border-hairline bg-surface-2 text-fg-muted'
            }`}
          >
            Connected Hardware
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">LTV : CAC Ratio</span>
          <span className={`text-heading-md font-mono font-bold ${metrics.ltvCacRatio >= 3.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {metrics.ltvCacRatio.toFixed(1)}x
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            Target Benchmark: 3.0x+
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Customer LTV</span>
          <span className="text-heading-md font-mono font-bold text-fg">
            ${Math.round(metrics.ltv).toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-accent block">
            Avg Lifetime: {metrics.lifetimeMonths.toFixed(0)} mos
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">CAC Payback</span>
          <span className={`text-heading-md font-mono font-bold ${metrics.paybackMonths <= 12 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {metrics.paybackMonths.toFixed(1)} <span className="text-caption text-fg-muted">Months</span>
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block">
            Target Benchmark: &lt;12 mos
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-2 border border-hairline">
          <span className="text-[11px] font-mono text-fg-muted uppercase block">Investor Verdict</span>
          <span className="text-caption font-mono font-bold flex items-center gap-1.5 mt-1.5">
            {metrics.isElite ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Tier-1 VC Ready
              </span>
            ) : metrics.isHealthy ? (
              <span className="text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> Healthy Economics
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="size-3.5" /> High Churn Drag
              </span>
            )}
          </span>
          <span className="text-[10px] font-mono text-fg-subtle block mt-1">
            ${Math.round(metrics.monthlyGrossProfit)}/mo gross profit
          </span>
        </div>
      </div>

      {/* Sliders Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-hairline/60">
        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>ARPU / Month ($)</span>
            <span className="font-bold text-fg">${arpuMonthly}</span>
          </label>
          <input
            type="range"
            min="10"
            max="1500"
            step="10"
            value={arpuMonthly}
            onChange={(e) => setArpuMonthly(Number(e.target.value))}
            className="w-full accent-accent mt-1.5"
          />
        </div>

        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>Customer Acquisition ($)</span>
            <span className="font-bold text-fg">${cacUsd}</span>
          </label>
          <input
            type="range"
            min="25"
            max="4000"
            step="25"
            value={cacUsd}
            onChange={(e) => setCacUsd(Number(e.target.value))}
            className="w-full accent-accent mt-1.5"
          />
        </div>

        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>Gross Margin (%)</span>
            <span className="font-bold text-emerald-400">{grossMarginPercent}%</span>
          </label>
          <input
            type="range"
            min="20"
            max="95"
            step="1"
            value={grossMarginPercent}
            onChange={(e) => setGrossMarginPercent(Number(e.target.value))}
            className="w-full accent-emerald-500 mt-1.5"
          />
        </div>

        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>Monthly Churn (%)</span>
            <span className={`font-bold ${monthlyChurnPercent > 3.5 ? 'text-rose-400' : 'text-fg'}`}>
              {monthlyChurnPercent}%
            </span>
          </label>
          <input
            type="range"
            min="0.5"
            max="8.0"
            step="0.1"
            value={monthlyChurnPercent}
            onChange={(e) => setMonthlyChurnPercent(Number(e.target.value))}
            className="w-full accent-rose-500 mt-1.5"
          />
        </div>
      </div>
    </Card>
  );
}
