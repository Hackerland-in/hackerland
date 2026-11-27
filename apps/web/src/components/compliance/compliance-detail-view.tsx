'use client';

import Link from 'next/link';
import { Badge, Card } from '@hackerland/ui';
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from 'lucide-react';
import type { ComplianceRoadmapItem } from '@hackerland/core';
import { formatComplianceCost } from '@hackerland/core';
import { PreComplianceAuditor } from './pre-compliance-auditor';
import { LabQuoteEstimator } from './lab-quote-estimator';

interface ComplianceDetailViewProps {
  item: ComplianceRoadmapItem;
}

export function ComplianceDetailView({ item }: ComplianceDetailViewProps) {
  return (
    <div className="space-y-6 min-w-0">
      <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
        <Link
          href="/compliance"
          className="inline-flex items-center gap-1.5 font-mono text-body-xs text-fg-muted hover:text-accent-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Compliance &amp; NABL Certification Wizard</span>
        </Link>
      </div>

      <Card className="border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {item.statutoryBodies.map((b) => (
            <Badge key={b} tone="accent" variant="outline">
              {b.replace('_', ' ').toUpperCase()}
            </Badge>
          ))}
          <Badge tone="neutral" variant="outline">
            {item.productCategory.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            {item.title}
          </h1>
          <p className="mt-1 text-body-sm text-accent-fg font-mono font-medium">{item.tagline}</p>
          <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{item.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-hairline pt-4 font-mono text-xs">
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">EST. TESTING CAPEX</span>
            <span className="text-success-fg font-bold text-sm">
              {formatComplianceCost(item.estimatedTotalTestingCostInr.minInr)} -{' '}
              {formatComplianceCost(item.estimatedTotalTestingCostInr.maxInr)}
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">TOTAL LEAD TIME</span>
            <span className="text-fg font-bold text-sm">
              {item.estimatedTimelineWeeks.minWeeks} - {item.estimatedTimelineWeeks.maxWeeks} Weeks
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">TEST SAMPLES</span>
            <span className="text-accent-fg font-bold text-sm">{item.sampleUnitsTotal} Units</span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-fg-subtle block text-[10px]">NABL LABS</span>
            <span className="text-fg font-bold text-sm">{item.recommendedLabs.length} Labs</span>
          </div>
        </div>
      </Card>

      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5 shadow-xs space-y-2 font-mono text-xs text-danger-fg">
        <div className="flex items-center gap-2 font-bold">
          <span>⚖</span>
          <span className="uppercase tracking-wider">
            STATUTORY PENALTIES FOR NON-COMPLIANT SALE / DEPLOYMENT
          </span>
        </div>
        <p className="text-body-xs text-fg leading-relaxed font-sans">
          {item.penaltiesForNonCompliance}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <PreComplianceAuditor
            tasks={item.preComplianceChecklist}
            title={`${item.title} // Pre-Compliance Audit`}
          />

          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">
              APPLICABLE STATUTORY STANDARDS &amp; CHAMBER TEST PARAMETERS
            </h3>

            <div className="space-y-3.5">
              {item.applicableStandards.map((std) => (
                <div
                  key={std.code}
                  className="rounded-xl border border-hairline bg-sunken p-4 space-y-2 font-mono text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-fg text-sm">{std.code}</span>
                    <Badge tone="accent" variant="outline">{std.body.replace('_', ' ').toUpperCase()}</Badge>
                  </div>
                  <div className="text-fg font-medium font-sans">{std.name}</div>
                  <p className="text-fg-muted text-[11px] font-sans leading-relaxed">{std.description}</p>

                  <div className="pt-2 border-t border-hairline space-y-1">
                    <span className="text-[10px] text-fg-subtle block">CHAMBER TEST BENCHES:</span>
                    <ul className="list-disc list-inside space-y-1 text-fg-muted text-[11px] font-sans">
                      {std.testParameters.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <LabQuoteEstimator labs={item.recommendedLabs} />
        </div>

        <div className="space-y-5">
          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-fg uppercase">
              STATUTORY GOVERNMENT FILING PORTALS
            </h3>
            <div className="space-y-2.5">
              {item.mandatoryGovtPortals.map((portal) => (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-hairline bg-sunken p-3 hover:border-accent/50 transition-all group"
                >
                  <div className="flex items-center justify-between text-fg font-semibold group-hover:text-accent-fg">
                    <span>{portal.name}</span>
                    <ExternalLink className="size-3 text-fg-subtle" />
                  </div>
                  <div className="text-[10px] text-fg-muted mt-0.5 font-sans">{portal.department}</div>
                </a>
              ))}
            </div>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-fg uppercase">
              SUBMISSION DOSSIER REQUIREMENTS
            </h3>
            <ul className="space-y-2 text-fg-muted text-[11px] font-sans">
              {item.documentationRequirements.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <FileText className="size-3.5 text-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-accent/25 bg-accent-soft/40 p-5 shadow-xs space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-accent-fg uppercase">
              EXPORT &amp; PRE-COMPLIANCE LAB PIPELINE
            </h3>
            <p className="text-[11px] font-sans text-fg-muted leading-relaxed">
              Leverage NABL ILAC-MRA reports from this roadmap to waive ~35% of overseas CE, FCC, UL, or UAE ECAS lab re-testing.
            </p>
            <div className="space-y-2">
              <Link
                href="/export"
                className="flex items-center justify-between rounded-xl border border-accent/30 bg-surface-1 px-3 py-2 text-accent-fg font-semibold hover:bg-accent hover:text-on-solid transition-colors"
              >
                <span>Global Export Bridge (/export)</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/emc"
                className="flex items-center justify-between rounded-xl border border-hairline bg-surface-1 px-3 py-2 text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
              >
                <span>Run EMC Pre-Scan Analyzer</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/testbeds"
                className="flex items-center justify-between rounded-xl border border-hairline bg-surface-1 px-3 py-2 text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
              >
                <span>Reserve NABL / HIL Testbed</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
