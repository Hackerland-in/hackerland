'use client';

import { useState } from 'react';
import { calculateLandedComponentCost } from '@hackerland/core';

interface LandedCostCalculatorProps {
  unitPriceINR: number;
  mpn: string;
}

export function LandedCostCalculator({ unitPriceINR, mpn }: LandedCostCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(100);
  const [country, setCountry] = useState<'IN' | 'CN' | 'US'>('IN');

  const cost = calculateLandedComponentCost(unitPriceINR, quantity, country);

  const presets = [10, 50, 100, 500, 1000, 5000];

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 md:p-6 backdrop-blur-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            Landed Tariff & Tax Estimator
          </span>
          <h3 className="text-base font-bold text-foreground mt-0.5">
            Production Landed Cost for {mpn}
          </h3>
        </div>

        {/* Origin Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/60 border border-border">
          <button
            type="button"
            onClick={() => setCountry('IN')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              country === 'IN'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇮🇳 India Domestic
          </button>
          <button
            type="button"
            onClick={() => setCountry('CN')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              country === 'CN'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇨🇳 Import (China)
          </button>
          <button
            type="button"
            onClick={() => setCountry('US')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              country === 'US'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇺🇸 Import (US/Global)
          </button>
        </div>
      </div>

      {/* Batch Quantity Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">Production Batch Quantity</span>
          <span className="font-mono font-bold text-primary">{quantity.toLocaleString('en-IN')} units</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuantity(q)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                quantity === q
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-secondary/40 text-muted-foreground hover:bg-secondary'
              }`}
            >
              {q >= 1000 ? `${q / 1000}k` : q} pcs
            </button>
          ))}
        </div>
      </div>

      {/* Calculation Matrix */}
      <div className="rounded-lg bg-background/60 border border-border p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Component Subtotal ({quantity} x ₹{unitPriceINR.toFixed(2)})</span>
          <span className="text-foreground font-semibold">₹{cost.subtotalINR.toLocaleString('en-IN')}</span>
        </div>

        {country !== 'IN' && (
          <>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Basic Customs Duty (BCD 7.5% under HSN 8542)</span>
              <span className="text-amber-500 font-semibold">+₹{cost.customsDutyINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Social Welfare Surcharge (SWS 10% on BCD)</span>
              <span className="text-amber-500 font-semibold">+₹{cost.socialWelfareSurchargeINR.toLocaleString('en-IN')}</span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between text-muted-foreground">
          <span>GST / IGST (18% Statutory Rate)</span>
          <span className="text-foreground font-semibold">+₹{cost.gstINR.toLocaleString('en-IN')}</span>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between text-sm">
          <span className="font-bold text-foreground">Total Landed Invoice</span>
          <span className="font-bold text-primary text-base">
            ₹{cost.totalLandedINR.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Effective Landed Cost Per Unit:</span>
          <span className="font-bold text-foreground font-mono">
            ₹{cost.effectiveUnitCostINR.toFixed(2)} / pc
          </span>
        </div>
      </div>

      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <span>ℹ️</span>
        <span>
          {country === 'IN'
            ? 'Domestic Indian procurement carries 18% GST with immediate Input Tax Credit (ITC) eligibility.'
            : 'Import customs calculations reflect India Ministry of Finance HSN 8542 electronic integrated circuits duty schedule.'}
        </span>
      </div>
    </div>
  );
}
