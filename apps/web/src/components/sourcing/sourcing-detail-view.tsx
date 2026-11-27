'use client';

import Link from 'next/link';
import type { ComponentSourcingRecord } from '@hackerland/core';
import { LandedCostCalculator } from './landed-cost-calculator';
import { AlternateComparisonTable } from './alternate-comparison-table';

interface SourcingDetailViewProps {
  record: ComponentSourcingRecord;
}

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳 India',
  CN: '🇨🇳 China',
  US: '🇺🇸 United States',
  SG: '🇸🇬 Singapore',
};

export function SourcingDetailView({ record }: SourcingDetailViewProps) {
  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Link href="/sourcing" className="hover:text-foreground transition-colors">
          Sourcing
        </Link>
        <span>/</span>
        <span className="text-foreground">{record.mpn}</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {record.category.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
              {record.package}
            </span>
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {record.lifecycle}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-muted-foreground uppercase block">
              Benchmark Base Price
            </span>
            <span className="text-2xl font-mono font-bold text-foreground">
              ₹{record.basePriceINR.toFixed(2)}
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight font-mono">
          {record.mpn}
        </h1>
        <p className="text-base text-muted-foreground font-medium mt-1">
          Manufactured by {record.manufacturer}
        </p>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          {record.description}
        </p>
      </div>

      {/* Primary Electrical Specifications */}
      <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Primary Electrical & Mechanical Specifications
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(record.primarySpecs).map(([key, val]) => (
            <div key={key} className="rounded-lg bg-background/60 border border-border/80 p-3">
              <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                {key}
              </span>
              <span className="text-xs md:text-sm font-mono font-semibold text-foreground mt-0.5 block">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Authorized Distributors Stock Matrix */}
      <div className="rounded-xl border border-border bg-card/60 p-6 space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Live Distributor Stock & Pricing Matrix
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time quotes across Indian domestic hubs and international distributors.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-secondary text-foreground">
            {record.suppliers.length} Quotes Available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground uppercase text-[11px]">
                <th className="py-2.5 px-3">Distributor</th>
                <th className="py-2.5 px-3">Origin / Region</th>
                <th className="py-2.5 px-3">Unit Price (INR)</th>
                <th className="py-2.5 px-3">MOQ</th>
                <th className="py-2.5 px-3">Stock Available</th>
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {record.suppliers.map((sup, idx) => (
                <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3 font-semibold text-foreground">
                    {sup.supplierName}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {COUNTRY_FLAGS[sup.country] || sup.country}
                  </td>
                  <td className="py-3 px-3 font-bold text-foreground">
                    ₹{sup.unitPriceINR.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {sup.moq} pcs
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        sup.inStockCount > 100
                          ? 'text-emerald-400'
                          : sup.inStockCount > 0
                          ? 'text-amber-400'
                          : 'text-destructive'
                      }`}
                    >
                      {sup.inStockCount > 0
                        ? `${sup.inStockCount.toLocaleString('en-IN')} pcs`
                        : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {sup.leadTimeDays === 0 ? 'Same Day' : `${sup.leadTimeDays} Days`}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {sup.productUrl ? (
                      <a
                        href={sup.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors font-medium text-[11px]"
                      >
                        Order Parts ↗
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Contact Sales</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Landed Cost & Customs Duty Calculator */}
      <LandedCostCalculator
        unitPriceINR={record.basePriceINR}
        mpn={record.mpn}
      />

      {/* Drop-In Alternates Comparison Table */}
      <AlternateComparisonTable
        baseMpn={record.mpn}
        basePriceINR={record.basePriceINR}
        alternates={record.alternates}
      />

      {/* Engineering Notes & Procurement Guidelines */}
      {record.notes.length > 0 && (
        <div className="rounded-xl border border-border bg-card/40 p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            Procurement & BOM Design Guidelines
          </h2>
          <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
            {record.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Additive Export Incoterms, FTA RVC & Dual-Source OEM Cross-Link */}
      <div className="rounded-xl border border-accent/25 bg-accent-soft/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-fg block">
            Export Tariff, FTA Value Addition &amp; OEM Readiness
          </span>
          <p className="text-xs text-fg-muted leading-relaxed max-w-2xl">
            Swapping imported silicon for Indian/pin-compatible alternates boosts Domestic Value Addition above 40% for India-UAE CEPA 0% duty and eliminates single-source OEM audit blockers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/export?tab=incoterms"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-mono font-semibold text-on-solid hover:bg-accent-strong transition-colors"
          >
            <span>Simulate Export Incoterms →</span>
          </Link>
          <Link
            href="/export?tab=oem"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-1 px-3.5 py-2 text-xs font-mono font-semibold text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <span>OEM Dual-BOM Audit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
