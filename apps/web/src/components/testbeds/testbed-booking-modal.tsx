'use client';

import { useState } from 'react';
import type { TestbedFacility } from '@hackerland/core';
import { calculateTestbedBookingCost, formatComplianceCost } from '@hackerland/core';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@hackerland/ui';
import { getActiveBuilderIdentity } from '@/lib/builder-identity';

interface TestbedBookingModalProps {
  testbed: TestbedFacility;
  isOpen: boolean;
  onClose: () => void;
}

export function TestbedBookingModal({ testbed, isOpen, onClose }: TestbedBookingModalProps) {
  const [hours, setHours] = useState<number>(2);
  const [isSubsidyEligible, setIsSubsidyEligible] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-28');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  const cost = calculateTestbedBookingCost(
    hours,
    testbed.hourlyRateInr,
    testbed.studentSubsidyRateInr,
    isSubsidyEligible,
  );

  const handleConfirm = () => {
    setBookingConfirmed(true);
    const identity = getActiveBuilderIdentity();
    if (typeof fetch === 'function') {
      void fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'testbed_booking',
          testbedSlug: testbed.slug,
          testbedTitle: testbed.name,
          slotLabel: `${selectedDate} · ${hours}h window`,
          notes: `Total fee ${formatComplianceCost(cost.totalCostInr)} (Subsidy: ${isSubsidyEligible ? 'Yes' : 'No'})`,
          actorName: identity.name,
          actorHandle: identity.handle,
        }),
      }).catch(() => {});
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface-1 p-6 shadow-overlay space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-hairline pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs font-mono font-bold tracking-wider text-accent-fg uppercase">
                Reserve Equipment Test Slot
              </span>
            </div>
            <h3 className="mt-1 font-display text-base font-bold text-fg">{testbed.name}</h3>
            <p className="text-xs text-fg-muted font-mono">
              Host: {testbed.hostLab.name} ({testbed.hostLab.city})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-fg-subtle hover:text-fg rounded-full p-1 hover:bg-surface-2"
          >
            <X className="size-4" />
          </button>
        </div>

        {bookingConfirmed ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-success/10 border border-success/30 text-success-fg">
              <CheckCircle2 className="size-6" />
            </div>
            <h4 className="font-display text-base font-bold text-fg">Equipment Slot Confirmed!</h4>
            <p className="text-xs text-fg-muted max-w-sm mx-auto leading-relaxed">
              Your {hours}-hour test slot on {selectedDate} is reserved in the lab queue. An SCPI session pass has been saved to your account.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-fg-muted font-semibold text-[11px]">Reservation Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-sunken p-2.5 text-fg text-xs focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-fg-muted font-semibold text-[11px]">Duration ({hours} Hours):</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-surface-2 accent-accent cursor-pointer mt-3"
                />
              </div>
            </div>

            <label className="flex items-start space-x-2.5 rounded-xl border border-hairline bg-sunken/70 p-3 cursor-pointer hover:border-accent/40 select-none">
              <input
                type="checkbox"
                checked={isSubsidyEligible}
                onChange={(e) => setIsSubsidyEligible(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line bg-surface-1 accent-accent"
              />
              <div className="space-y-0.5">
                <div className="font-semibold text-fg">Apply DPIIT Startup / Student Subsidy Rate</div>
                <div className="text-[10px] text-fg-muted">
                  Reduces hourly charge from {formatComplianceCost(testbed.hourlyRateInr)}/hr to{' '}
                  <strong className="text-success-fg">{formatComplianceCost(testbed.studentSubsidyRateInr)}/hr</strong>
                </div>
              </div>
            </label>

            <div className="rounded-xl border border-hairline bg-sunken p-3.5 space-y-1.5 font-mono">
              <div className="flex justify-between text-fg-muted">
                <span>Applied Rate:</span>
                <span className="text-fg font-semibold">{formatComplianceCost(cost.appliedHourlyRate)} / hour</span>
              </div>
              {cost.savingsInr > 0 && (
                <div className="flex justify-between text-success-fg">
                  <span>Grant / Subsidy Saved:</span>
                  <span>- {formatComplianceCost(cost.savingsInr)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-fg border-t border-hairline pt-1.5">
                <span>Total Reservation Fee:</span>
                <span className="text-accent-fg">{formatComplianceCost(cost.totalCostInr)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-hairline pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleConfirm}>
                Confirm Slot Reservation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
