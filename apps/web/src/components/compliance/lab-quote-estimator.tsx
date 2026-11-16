'use client';

import type { TestingLabQuote } from '@hackerland/core';
import { formatComplianceCost } from '@hackerland/core';

interface LabQuoteEstimatorProps {
  labs: TestingLabQuote[];
}

export function LabQuoteEstimator({ labs }: LabQuoteEstimatorProps) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-4">
      <div className="border-b border-stone-800/80 pb-3">
        <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
          NABL ACCREDITED TESTING LABORATORIES &amp; COST BENCHMARK
        </h3>
        <p className="text-[11px] text-stone-400">
          Estimated testing fee quotes, sample quantities, and lead times from authorized Indian test houses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labs.map((lab) => (
          <div
            key={lab.labName}
            className="flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-900/40 p-4 space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{lab.labName}</h4>
                  <div className="text-[11px] text-stone-400 font-mono">
                    {lab.city}, {lab.state}
                  </div>
                </div>
                <span className="rounded-md border border-stone-800 bg-stone-950 px-2 py-0.5 text-[10px] font-mono text-stone-400">
                  NABL: {lab.nablAccreditationNo}
                </span>
              </div>

              {/* Cost & Timeline Strip */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono border-y border-stone-800/80 py-2">
                <div>
                  <span className="text-[10px] text-stone-500 block">EST. TESTING FEE</span>
                  <span className="font-bold text-amber-400">
                    {formatComplianceCost(lab.estimatedCostInr)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">LEAD TIME</span>
                  <span className="font-bold text-white">{lab.estimatedLeadTimeWeeks} Weeks</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">SAMPLES NEEDED</span>
                  <span className="font-bold text-sky-400">{lab.sampleUnitsRequired} Units</span>
                </div>
              </div>

              {/* Tests covered list */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-stone-500 block">CHAMBER TESTS COVERED:</span>
                <ul className="space-y-0.5 text-[11px] font-mono text-stone-300 list-disc list-inside">
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
    </div>
  );
}
