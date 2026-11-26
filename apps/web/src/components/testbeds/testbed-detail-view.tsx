'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@hackerland/ui';
import { ArrowLeft } from 'lucide-react';
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
    <div className="space-y-6 min-w-0">
      <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
        <Link
          href="/testbeds"
          className="inline-flex items-center gap-1.5 font-mono text-body-xs text-fg-muted hover:text-accent-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Remote HIL Testbeds</span>
        </Link>
      </div>

      <Card className="border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="outline">
              {testbed.category.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge tone="neutral" variant="outline">Maker: {testbed.manufacturer}</Badge>
            <Badge tone="neutral" variant="outline">Model: {testbed.model}</Badge>
            {testbed.hostLab.nablAccredited && (
              <Badge tone="success" variant="outline">✓ NABL Accredited Facility</Badge>
            )}
          </div>

          <Button type="button" variant="primary" size="sm" onClick={() => setIsBookingOpen(true)}>
            Reserve Slot 📅
          </Button>
        </div>

        <div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            {testbed.name}
          </h1>
          <p className="mt-1 text-body-xs text-fg-muted font-mono">
            Host: <strong className="text-fg">{testbed.hostLab.name}</strong> //{' '}
            {testbed.hostLab.institution} ({testbed.hostLab.city}, {testbed.hostLab.state})
          </p>
          <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{testbed.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-hairline pt-4 font-mono text-xs">
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">COMMERCIAL RATE</span>
            <span className="text-fg font-bold text-sm">
              {formatComplianceCost(testbed.hourlyRateInr)} / hr
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">DPIIT / STUDENT RATE</span>
            <span className="text-success-fg font-bold text-sm">
              {formatComplianceCost(testbed.studentSubsidyRateInr)} / hr
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">ACCESS MODE</span>
            <span className="text-accent-fg font-bold text-sm uppercase">
              {testbed.accessType.replace('_', ' ')}
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">QUEUE POSITION</span>
            <span className="text-fg font-bold text-sm">{testbed.activeQueueLength} Jobs in Queue</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <ScpiScriptConsole scriptRunner={testbed.scriptRunner} equipmentName={testbed.name} />

          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-fg uppercase">
              LABORATORY RULES &amp; EQUIPMENT SAFETY INTERLOCKS
            </h3>
            <ul className="space-y-2 text-fg-muted text-[11px] font-sans">
              {testbed.rulesAndGuidelines.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-warning-fg font-bold mt-0.5">⚠</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-fg uppercase">
              INSTRUMENT SPECIFICATIONS
            </h3>
            <div className="divide-y divide-hairline">
              {Object.entries(testbed.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex flex-col space-y-0.5">
                  <span className="text-fg-subtle text-[10px] uppercase">{key}</span>
                  <span className="text-fg font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-accent/20 bg-accent-soft/50 p-5 shadow-xs space-y-3 text-center">
            <h4 className="text-xs font-mono font-bold text-fg uppercase">NEED BENCH ACCESS?</h4>
            <p className="text-body-xs text-fg-muted">
              Reserve your slot now. Unused hours roll over to your maker organization wallet.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Equipment Slot 📅
            </Button>
          </Card>
        </div>
      </div>

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
