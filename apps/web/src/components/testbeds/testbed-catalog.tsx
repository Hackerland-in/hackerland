'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@hackerland/ui';
import { Search, Activity } from 'lucide-react';
import type { TestbedFacility } from '@hackerland/core';
import { filterTestbedFacilities, formatComplianceCost } from '@hackerland/core';
import { TestbedBookingModal } from './testbed-booking-modal';

interface TestbedCatalogProps {
  initialTestbeds: TestbedFacility[];
}

export function TestbedCatalog({ initialTestbeds }: TestbedCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccessType, setSelectedAccessType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingTestbed, setBookingTestbed] = useState<TestbedFacility | null>(null);

  const filteredTestbeds = useMemo(() => {
    return filterTestbedFacilities(initialTestbeds, {
      category: selectedCategory,
      accessType: selectedAccessType,
      city: selectedCity,
      search: searchQuery,
    });
  }, [initialTestbeds, selectedCategory, selectedAccessType, selectedCity, searchQuery]);

  return (
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Activity className="size-3.5" aria-hidden="true" />
              <span>Shared Hardware Testbeds &amp; HIL Benches</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              Remote Hardware-in-the-Loop Testbeds
            </h1>
            <p className="text-body-sm text-fg-muted max-w-2xl leading-relaxed">
              Run SCPI sweeps or reserve high-CapEx lab test chambers at IITs and research parks with student &amp; DPIIT subsidies.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-2.5 text-center">
              <div className="text-fg-subtle text-[10px]">TOTAL TESTBEDS</div>
              <div className="text-lg font-bold text-fg">{initialTestbeds.length}</div>
            </div>
            <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-2.5 text-center">
              <div className="text-fg-subtle text-[10px]">REMOTE SCPI</div>
              <div className="text-lg font-bold text-success-fg">Socket Live</div>
            </div>
          </div>
        </div>
      </header>

      <Card className="border-hairline bg-surface-1 p-3.5 shadow-xs flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment by model, manufacturer, host lab, or city..."
            className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 font-mono text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
          >
            <option value="all">All Equipment</option>
            <option value="rf_spectrum_analyzer">RF &amp; Spectrum (20 GHz)</option>
            <option value="battery_cycler">EV Battery Cycler (1000A)</option>
            <option value="emc_anechoic_chamber">EMI/EMC Anechoic Chamber</option>
            <option value="vibration_shaker">Vibration Shaker (50 kN)</option>
            <option value="thermal_chamber">Thermal Cycling Chamber</option>
            <option value="logic_analyzer">136-Channel Logic Analyzer</option>
          </select>

          <select
            value={selectedAccessType}
            onChange={(e) => setSelectedAccessType(e.target.value)}
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
          >
            <option value="all">All Access Types</option>
            <option value="remote_scpi">Remote SCPI / PyVISA</option>
            <option value="physical_onsite">Physical On-Site Lab</option>
            <option value="hybrid">Hybrid (Remote + Pack)</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
          >
            <option value="all">All Cities</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="chennai">Chennai</option>
            <option value="pune">Pune</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
        </div>
      </Card>

      {filteredTestbeds.length === 0 ? (
        <Card className="py-12 text-center font-mono text-body-xs text-fg-subtle border-hairline bg-surface-1">
          No testbed facilities matched your filter parameters.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTestbeds.map((tb) => (
            <Card
              key={tb.id}
              className="flex flex-col justify-between border-hairline bg-surface-1 p-5 shadow-xs hover:border-accent/40 transition-all min-w-0 [overflow-wrap:anywhere]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    tone={
                      tb.accessType === 'remote_scpi'
                        ? 'success'
                        : tb.accessType === 'hybrid'
                          ? 'code'
                          : 'accent'
                    }
                    variant="outline"
                  >
                    {tb.accessType.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-[11px] font-mono text-fg-subtle">
                    {tb.hostLab.city}, {tb.hostLab.state}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/testbeds/${tb.slug}`}
                    className="font-display text-body-lg font-bold text-fg hover:text-accent-fg transition-colors"
                  >
                    {tb.name}
                  </Link>
                  <p className="mt-1 text-body-xs text-fg-muted line-clamp-2 leading-relaxed">
                    {tb.description}
                  </p>
                </div>

                <div className="rounded-xl border border-hairline bg-sunken p-3 text-xs font-mono space-y-0.5">
                  <div className="text-[10px] text-fg-subtle">HOST LABORATORY</div>
                  <div className="font-semibold text-fg">{tb.hostLab.name}</div>
                  <div className="text-[10px] text-fg-muted font-sans">{tb.hostLab.institution}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-body-xs font-mono pt-2 border-t border-hairline">
                  <div>
                    <span className="text-[10px] text-fg-subtle block">STANDARD RATE</span>
                    <span className="text-fg font-bold">{formatComplianceCost(tb.hourlyRateInr)} / hr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-fg-subtle block">STARTUP SUBSIDY</span>
                    <span className="text-success-fg font-bold">
                      {formatComplianceCost(tb.studentSubsidyRateInr)} / hr
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-hairline pt-3 flex items-center justify-between gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/testbeds/${tb.slug}`}>Specs &amp; SCPI</Link>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setBookingTestbed(tb)}
                >
                  Book Slot 📅
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {bookingTestbed && (
        <TestbedBookingModal
          testbed={bookingTestbed}
          isOpen={true}
          onClose={() => setBookingTestbed(null)}
        />
      )}
    </div>
  );
}
