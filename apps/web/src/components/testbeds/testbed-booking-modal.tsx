'use client';

import { useState } from 'react';
import type { TestbedFacility } from '@hackerland/core';
import { calculateTestbedBookingCost, formatComplianceCost } from '@hackerland/core';

interface TestbedBookingModalProps {
  testbed: TestbedFacility;
  isOpen: boolean;
  onClose: () => void;
}

export function TestbedBookingModal({ testbed, isOpen, onClose }: TestbedBookingModalProps) {
  const [hours, setHours] = useState<number>(2);
  const [isSubsidyEligible, setIsSubsidyEligible] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-20');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const cost = calculateTestbedBookingCost(
    hours,
    testbed.hourlyRateInr,
    testbed.studentSubsidyRateInr,
    isSubsidyEligible,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-950 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800/80 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                Reserve Equipment Test Slot
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-white">{testbed.name}</h3>
            <p className="text-xs text-stone-400 font-mono">
              Host: {testbed.hostLab.name} ({testbed.hostLab.city})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white font-mono text-sm p-1"
          >
            ✕
          </button>
        </div>

        {bookingConfirmed ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <div className="text-3xl">🎉</div>
            <h4 className="text-base font-bold text-white">Equipment Slot Confirmed!</h4>
            <p className="text-xs text-stone-300 max-w-sm mx-auto">
              Your {hours}-hour test slot on {selectedDate} is locked in the laboratory queue. An automated SCPI access token and safety clearance pass has been issued to your profile.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            {/* Date and Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-400 text-[11px]">Reservation Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 p-2.5 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 text-[11px]">Duration ({hours} Hours):</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-stone-800 accent-amber-500 cursor-pointer mt-3"
                />
              </div>
            </div>

            {/* Subsidy Toggle */}
            <label className="flex items-start space-x-2.5 rounded-xl border border-stone-800 bg-stone-900/60 p-3 cursor-pointer hover:border-stone-700 select-none">
              <input
                type="checkbox"
                checked={isSubsidyEligible}
                onChange={(e) => setIsSubsidyEligible(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
              />
              <div className="space-y-0.5">
                <div className="font-semibold text-white">Apply DPIIT Startup / Student Subsidy Rate</div>
                <div className="text-[10px] text-stone-400">
                  Reduces hourly equipment charge from {formatComplianceCost(testbed.hourlyRateInr)}/hr down to{' '}
                  <strong className="text-emerald-400">{formatComplianceCost(testbed.studentSubsidyRateInr)}/hr</strong>
                </div>
              </div>
            </label>

            {/* Cost Breakdown Strip */}
            <div className="rounded-xl border border-stone-800 bg-black/60 p-3.5 space-y-1.5">
              <div className="flex justify-between text-stone-400">
                <span>Applied Rate:</span>
                <span className="text-white">{formatComplianceCost(cost.appliedHourlyRate)} / hour</span>
              </div>
              {cost.savingsInr > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Grant / Subsidy Saved:</span>
                  <span>- {formatComplianceCost(cost.savingsInr)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-stone-800/80 pt-1.5">
                <span>Total Reservation Fee:</span>
                <span className="text-amber-400">{formatComplianceCost(cost.totalCostInr)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-stone-800/80 pt-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-stone-800 px-4 py-2 text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setBookingConfirmed(true)}
                className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition-all shadow-md"
              >
                Confirm Slot Reservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
