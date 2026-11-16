'use client';

import Link from 'next/link';
import type { ComplianceRoadmapItem } from '@hackerland/core';
import { formatComplianceCost } from '@hackerland/core';
import { PreComplianceAuditor } from './pre-compliance-auditor';
import { LabQuoteEstimator } from './lab-quote-estimator';

interface ComplianceDetailViewProps {
  item: ComplianceRoadmapItem;
}

export function ComplianceDetailView({ item }: ComplianceDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/compliance"
          className="inline-flex items-center space-x-1 font-mono text-xs text-stone-400 hover:text-white transition-colors"
        >
          <span>← Back to Compliance &amp; NABL Certification Wizard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.statutoryBodies.map((b) => (
            <span
              key={b}
              className="rounded-xl border border-amber-500/50 bg-amber-950/20 px-3 py-1 text-xs font-mono font-bold text-amber-400 uppercase"
            >
              {b.replace('_', ' ')}
            </span>
          ))}
          <span className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1 text-xs font-mono text-stone-400">
            {item.productCategory.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-1 text-sm text-stone-300 font-mono">{item.tagline}</p>
          <p className="mt-3 text-sm text-stone-400 leading-relaxed max-w-4xl">
            {item.description}
          </p>
        </div>

        {/* Cost & Timeline Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-stone-800/80 pt-4 font-mono text-xs">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">EST. TESTING CAPEX</span>
            <span className="text-emerald-400 font-bold text-sm">
              {formatComplianceCost(item.estimatedTotalTestingCostInr.minInr)} -{' '}
              {formatComplianceCost(item.estimatedTotalTestingCostInr.maxInr)}
            </span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">TOTAL LEAD TIME</span>
            <span className="text-white font-bold text-sm">
              {item.estimatedTimelineWeeks.minWeeks} - {item.estimatedTimelineWeeks.maxWeeks} Weeks
            </span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">DESTRUCTIVE TEST SAMPLES</span>
            <span className="text-sky-400 font-bold text-sm">{item.sampleUnitsTotal} Units</span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <span className="text-stone-500 block text-[10px]">NABL LABS BENCHMARKED</span>
            <span className="text-amber-400 font-bold text-sm">{item.recommendedLabs.length} Labs</span>
          </div>
        </div>
      </div>

      {/* Non-compliance Penalties Warning Callout */}
      <div className="rounded-2xl border border-red-500/50 bg-red-950/20 p-5 shadow-sm space-y-2 font-mono text-xs text-red-300">
        <div className="flex items-center space-x-2 font-bold text-red-200">
          <span className="text-base">⚖</span>
          <span className="uppercase tracking-wider">STATUTORY PENALTIES FOR NON-COMPLIANT SALE / DEPLOYMENT</span>
        </div>
        <p className="text-[12px] opacity-90 leading-relaxed">
          {item.penaltiesForNonCompliance}
        </p>
      </div>

      {/* Main Grid: Pre-Compliance Checklist & Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist & Lab Quotes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Pre-Compliance Checklist */}
          <PreComplianceAuditor
            tasks={item.preComplianceChecklist}
            title={`${item.title} // Pre-Compliance Audit`}
          />

          {/* Standards & Chamber Test Parameters */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              APPLICABLE STATUTORY STANDARDS &amp; CHAMBER TEST PARAMETERS
            </h3>

            <div className="space-y-4">
              {item.applicableStandards.map((std) => (
                <div
                  key={std.code}
                  className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 space-y-2 font-mono text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">{std.code}</span>
                    <span className="rounded bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 text-[10px] text-amber-300 uppercase">
                      {std.body.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-stone-300">{std.name}</div>
                  <p className="text-stone-400 text-[11px] leading-relaxed">{std.description}</p>

                  <div className="pt-2 border-t border-stone-800/60 space-y-1">
                    <span className="text-[10px] text-stone-500 block">CHAMBER TEST BENCHES:</span>
                    <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px]">
                      {std.testParameters.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NABL Lab Quotes Comparison */}
          <LabQuoteEstimator labs={item.recommendedLabs} />
        </div>

        {/* Right 1 Col: Portals & Documentation Checklist */}
        <div className="space-y-6">
          {/* Mandatory Govt Portals */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">
              STATUTORY GOVERNMENT FILING PORTALS
            </h3>
            <div className="space-y-2.5">
              {item.mandatoryGovtPortals.map((portal) => (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-stone-800 bg-stone-900/60 p-3 hover:border-amber-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between text-white font-semibold group-hover:text-amber-400">
                    <span>{portal.name}</span>
                    <span className="text-[10px] text-stone-500">↗</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{portal.department}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Documentation Dossier Requirements */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-white uppercase">
              SUBMISSION DOSSIER REQUIREMENTS
            </h3>
            <ul className="space-y-2 text-stone-300 text-[11px]">
              {item.documentationRequirements.map((doc, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold mt-0.5">📄</span>
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
