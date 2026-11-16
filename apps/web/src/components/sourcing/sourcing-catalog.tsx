'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ComponentSourcingRecord, ComponentCategory } from '@hackerland/core';
import { filterSourcingRecords, findBestAlternate } from '@hackerland/core';

interface SourcingCatalogProps {
  initialRecords: ComponentSourcingRecord[];
}

const CATEGORY_LABELS: Record<ComponentCategory | 'all', string> = {
  all: 'All Categories',
  microcontroller: 'Microcontrollers (MCUs)',
  power_management: 'Power & BMS AFEs',
  rf_transceiver: 'RF & Wireless LoRa',
  sensor_imu: 'Sensors & IMUs',
  motor_driver: 'Motor Drivers',
  interface_bridge: 'Interface & USB Bridges',
};

export function SourcingCatalog({ initialRecords }: SourcingCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = useMemo(() => {
    return filterSourcingRecords(initialRecords, {
      category: selectedCategory,
      search: searchQuery,
    });
  }, [initialRecords, selectedCategory, searchQuery]);

  const totalDomesticStock = useMemo(() => {
    return initialRecords.reduce((total, rec) => {
      const inStock = rec.suppliers
        .filter((s) => s.country === 'IN')
        .reduce((sum, s) => sum + s.inStockCount, 0);
      return total + inStock;
    }, 0);
  }, [initialRecords]);

  const totalAlternates = useMemo(() => {
    return initialRecords.reduce((sum, r) => sum + r.alternates.length, 0);
  }, [initialRecords]);

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Critical Components
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {initialRecords.length} MPNs
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">BOM Cross-Referenced</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Domestic Stock
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {totalDomesticStock.toLocaleString('en-IN')} pcs
          </p>
          <span className="text-[11px] text-emerald-500 font-mono">Robu / Evelta / E14 India</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Drop-In Alternates
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {totalAlternates} Mapped
          </p>
          <span className="text-[11px] text-primary font-mono">Up to 98% Pin Compatibility</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tariff & Customs
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            HSN 8542
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">7.5% BCD + 18% IGST</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search MPN, GigaDevice, package..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-64"
        />
      </div>

      {/* Grid of Components */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium text-foreground">No components match your search</p>
          <p className="text-xs text-muted-foreground mt-1">Try resetting filters or searching for another MPN.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((record) => {
            const bestAlt = findBestAlternate(record);
            const domesticStock = record.suppliers
              .filter((s) => s.country === 'IN')
              .reduce((sum, s) => sum + s.inStockCount, 0);

            return (
              <Link
                key={record.id}
                href={`/sourcing/${record.mpn}`}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground uppercase">
                      {record.package}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                      {record.lifecycle}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground font-mono group-hover:text-primary transition-colors">
                    {record.mpn}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    {record.manufacturer}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {record.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Base Price
                      </span>
                      <span className="font-mono font-bold text-foreground text-sm">
                        ₹{record.basePriceINR.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        🇮🇳 Domestic Stock
                      </span>
                      <span className="font-mono font-medium text-emerald-400">
                        {domesticStock > 0 ? `${domesticStock.toLocaleString('en-IN')} pcs` : 'Backorder'}
                      </span>
                    </div>
                  </div>

                  {bestAlt && (
                    <div className="mt-3 rounded-lg bg-primary/5 border border-primary/15 p-2.5 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-semibold text-primary">⚡ Best Drop-In Alternate:</span>
                        <span className="text-foreground font-bold">{bestAlt.compatibilityScore}%</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground mt-1 text-[11px] font-mono">
                        <span>{bestAlt.mpn} ({bestAlt.manufacturer})</span>
                        <span className="font-semibold text-foreground">₹{bestAlt.unitPriceINR.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{record.suppliers.length} Distributors Quoting</span>
                  <span className="text-primary group-hover:underline font-semibold">
                    View Matrix →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
