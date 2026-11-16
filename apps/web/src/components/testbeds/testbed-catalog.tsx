'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 uppercase">
              Shared High-CapEx Hardware Testbeds &amp; HIL Benches
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Remote Hardware-in-the-Loop Testbeds
          </h1>
          <p className="mt-2 text-sm text-stone-400 max-w-3xl leading-relaxed">
            Democratizing multi-crore laboratory instrumentation across Indian research parks, IITs, and CSIR laboratories. Execute automated SCPI sweeps over socket or reserve on-site testing chambers with up to 60% student and DPIIT startup subsidies.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center space-x-4 font-mono text-xs">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3 text-center">
            <div className="text-stone-500 text-[10px]">TOTAL TESTBEDS</div>
            <div className="text-xl font-bold text-white">{initialTestbeds.length}</div>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3 text-center">
            <div className="text-stone-500 text-[10px]">REMOTE SCPI</div>
            <div className="text-xl font-bold text-emerald-400">Socket Live</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <svg className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment by model, manufacturer, host lab, or city..."
            className="w-full bg-transparent font-mono text-xs text-white placeholder:text-stone-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
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
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Access Types</option>
            <option value="remote_scpi">Remote SCPI / PyVISA</option>
            <option value="physical_onsite">Physical On-Site Lab</option>
            <option value="hybrid">Hybrid (Remote + Pack)</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Cities</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="chennai">Chennai</option>
            <option value="pune">Pune</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {/* Testbeds Grid */}
      {filteredTestbeds.length === 0 ? (
        <div className="py-16 text-center font-mono text-xs text-stone-500">
          No testbed facilities matched your filter parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestbeds.map((tb) => (
            <div
              key={tb.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm transition-all hover:border-stone-700"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase ${
                      tb.accessType === 'remote_scpi'
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                        : tb.accessType === 'hybrid'
                        ? 'border-sky-500/40 bg-sky-950/20 text-sky-400'
                        : 'border-amber-500/40 bg-amber-950/20 text-amber-400'
                    }`}
                  >
                    {tb.accessType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {tb.hostLab.city}, {tb.hostLab.state}
                  </span>
                </div>

                <div>
                  <Link
                    href={`/testbeds/${tb.slug}`}
                    className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    {tb.name}
                  </Link>
                  <p className="mt-1 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {tb.description}
                  </p>
                </div>

                {/* Host Institution */}
                <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-2.5 text-xs font-mono space-y-0.5">
                  <div className="text-[10px] text-stone-500">HOST LABORATORY</div>
                  <div className="font-semibold text-stone-200">{tb.hostLab.name}</div>
                  <div className="text-[10px] text-stone-400">{tb.hostLab.institution}</div>
                </div>

                {/* Rates */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-900">
                  <div>
                    <span className="text-[10px] text-stone-500 block">STANDARD RATE</span>
                    <span className="text-white font-bold">{formatComplianceCost(tb.hourlyRateInr)} / hr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">STARTUP SUBSIDY</span>
                    <span className="text-emerald-400 font-bold">
                      {formatComplianceCost(tb.studentSubsidyRateInr)} / hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 border-t border-stone-800/80 pt-3 flex items-center justify-between">
                <Link
                  href={`/testbeds/${tb.slug}`}
                  className="rounded-xl border border-stone-800 px-3 py-1.5 text-xs font-mono text-stone-400 hover:text-white transition-all"
                >
                  Specs &amp; SCPI
                </Link>
                <button
                  onClick={() => setBookingTestbed(tb)}
                  className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-mono font-bold text-stone-950 hover:bg-amber-400 transition-all shadow-sm"
                >
                  Book Slot 📅
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
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
