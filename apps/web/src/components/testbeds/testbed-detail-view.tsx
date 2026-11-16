'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TestbedFacility } from '@hackerland/core';
import { formatComplianceCost } from '@hackerland/core';
import { ScpiScriptConsole } from './scpi-script-console';
import { TestbedBookingModal } from './testbed-booking-modal';

interface TestbedDetailViewProps {
  testbed: TestbedFacility;
}

export function TestbedDetailView({ testbed }: TestbedDetailViewProps) {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/testbeds"
          className="inline-flex items-center space-x-1 font-mono text-xs text-stone-400 hover:text-white transition-colors"
        >
          <span>← Back to Remote HIL Testbeds</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl border border-amber-500/50 bg-amber-950/20 px-3 py-1 text-xs font-mono font-bold text-amber-400 uppercase">
              {testbed.category.replace('_', ' ').toUpperCase()}
            </span>
            <span className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1 text-xs font-mono text-stone-400">
              Maker: {testbed.manufacturer}
            </span>
            <span className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1 text-xs font-mono text-stone-400">
              Model: {testbed.model}
            </span>
            {testbed.hostLab.nablAccredited && (
              <span className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 px-3 py-1 text-xs font-mono text-emerald-300">
                ✓ NABL Accredited Facility
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-mono font-bold text-stone-950 hover:bg-amber-400 transition-all shadow-md"
            >
              Reserve Slot 📅
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {testbed.name}
          </h1>
          <p className="mt-2 text-sm text-stone-300 font-mono">
            Host: <strong className="text-white">{testbed.hostLab.name}</strong> //{' '}
            {testbed.hostLab.institution} ({testbed.hostLab.city}, {testbed.hostLab.state})
          </p>
          <p className="mt-3 text-sm text-stone-400 leading-relaxed max-w-4xl">
            {testbed.description}
          </p>
        </div>

        {/* Rates Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-stone-800/80 pt-4 font-mono text-xs">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">COMMERCIAL RATE</span>
            <span className="text-white font-bold text-sm">
              {formatComplianceCost(testbed.hourlyRateInr)} / hr
            </span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">DPIIT / STUDENT RATE</span>
            <span className="text-emerald-400 font-bold text-sm">
              {formatComplianceCost(testbed.studentSubsidyRateInr)} / hr
            </span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">ACCESS MODE</span>
            <span className="text-amber-400 font-bold text-sm uppercase">
              {testbed.accessType.replace('_', ' ')}
            </span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">QUEUE POSITION</span>
            <span className="text-sky-400 font-bold text-sm">
              {testbed.activeQueueLength} Jobs in Queue
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Specs & Interactive SCPI Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SCPI Console & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <ScpiScriptConsole
            scriptRunner={testbed.scriptRunner}
            equipmentName={testbed.name}
          />

          {/* Operational Guidelines & Safety Rules */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">
              LABORATORY RULES &amp; EQUIPMENT SAFETY INTERLOCKS
            </h3>
            <ul className="space-y-2 text-stone-300 text-[11px]">
              {testbed.rulesAndGuidelines.map((rule, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-400 font-bold mt-0.5">⚠</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 1 Col: Technical Specs Table */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">
              INSTRUMENT SPECIFICATIONS
            </h3>
            <div className="divide-y divide-stone-800/80">
              {Object.entries(testbed.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex flex-col space-y-0.5">
                  <span className="text-stone-500 text-[10px] uppercase">{key}</span>
                  <span className="text-stone-200 font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Booking CTA Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3 text-center font-mono">
            <h4 className="text-xs font-bold text-white uppercase">
              NEED BENCH ACCESS?
            </h4>
            <p className="text-xs text-stone-400">
              Lock in your testing slot now. Unused hours roll over to your organization wallet.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition-all shadow-md"
            >
              Book Equipment Slot 📅
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <TestbedBookingModal
          testbed={testbed}
          isOpen={true}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  );
}
