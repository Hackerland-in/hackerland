'use client';

import { Badge, Card } from '@hackerland/ui';
import type { TestingLabQuote } from '@hackerland/core';
import { formatComplianceCost } from '@hackerland/core';

interface LabQuoteEstimatorProps {
  labs: TestingLabQuote[];
}

export function LabQuoteEstimator({ labs }: LabQuoteEstimatorProps) {
  return (
    <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-4">
      <div className="border-b border-hairline pb-3">
        <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">
          NABL ACCREDITED TESTING LABORATORIES &amp; COST BENCHMARK
        </h3>
        <p className="text-body-xs text-fg-muted mt-0.5">
          Estimated testing fee quotes, sample quantities, and lead times from Indian NABL test houses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labs.map((lab) => (
          <div
            key={lab.labName}
            className="flex flex-col justify-between rounded-xl border border-hairline bg-sunken p-4 space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-body-xs font-bold text-fg font-mono">{lab.labName}</h4>
                  <div className="text-[11px] text-fg-muted font-mono">
                    {lab.city}, {lab.state}
                  </div>
                </div>
                <Badge tone="neutral" variant="outline">NABL: {lab.nablAccreditationNo}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono border-y border-hairline py-2">
                <div>
                  <span className="text-[10px] text-fg-subtle block">EST. FEE</span>
                  <span className="font-bold text-accent-fg">
                    {formatComplianceCost(lab.estimatedCostInr)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-fg-subtle block">LEAD TIME</span>
                  <span className="font-bold text-fg">{lab.estimatedLeadTimeWeeks} Weeks</span>
                </div>
                <div>
                  <span className="text-[10px] text-fg-subtle block">SAMPLES</span>
                  <span className="font-bold text-fg">{lab.sampleUnitsRequired} Units</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-fg-subtle block">CHAMBER TESTS COVERED:</span>
                <ul className="space-y-0.5 text-[11px] font-sans text-fg-muted list-disc list-inside">
                  {lab.testsCovered.map((t, idx) => (
                    <li key={idx} className="truncate" title={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
