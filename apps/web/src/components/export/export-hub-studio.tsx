'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  EXPORT_PAPERWORK_GATES,
  HSN_EXPORT_PROFILES,
  PLI_AND_EXPORT_SCHEMES,
} from '@hackerland/core';
import {
  Badge,
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackerland/ui';
import {
  ArrowRight,
  Award,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Scale,
  ShieldCheck,
  Ship,
} from 'lucide-react';
import { EXPORT_CORRIDORS_CATALOG } from '@/lib/data/export-trade-data';
import { ExportRegulatoryBridge } from './export-regulatory-bridge';
import { IncotermsMarginCalculator } from './incoterms-margin-calculator';
import { DgftPaperworkWizard } from './dgft-paperwork-wizard';
import { CorridorDirectory } from './corridor-directory';
import { OemQualificationSimulator } from './oem-qualification-simulator';

export type ExportHubTabId = 'regulatory' | 'incoterms' | 'paperwork' | 'corridors' | 'oem';

const VALID_TABS: ExportHubTabId[] = ['regulatory', 'incoterms', 'paperwork', 'corridors', 'oem'];

interface ExportHubStudioProps {
  initialTab?: ExportHubTabId;
}

export function ExportHubStudio({ initialTab = 'regulatory' }: ExportHubStudioProps) {
  const [activeTab, setActiveTab] = useState<ExportHubTabId>(initialTab);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const param = new URLSearchParams(window.location.search).get('tab');
    if (param && VALID_TABS.includes(param as ExportHubTabId)) {
      setActiveTab(param as ExportHubTabId);
    }
  }, []);

  return (
    <div className="space-y-6 min-w-0">
      {/* Rosepaper Hero Header */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Globe2 className="size-3.5" aria-hidden="true" />
            <span>Global Hardware Export, DGFT &amp; Trade Execution Hub</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="accent" variant="outline">
              {EXPORT_CORRIDORS_CATALOG.length} Global Corridors
            </Badge>
            <Badge tone="success" variant="outline">
              India-UAE CEPA · AIFTA
            </Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Global Export &amp; Trade Hub (India → World)
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-3xl leading-relaxed">
            Bridge Indian NABL compliance into CE, FCC, UL, ECAS, and IMDA certifications, simulate 8-digit ITC-HS Incoterms 2020 margins with RoDTEP &amp; GST LUT, clear all 10 DGFT/ICEGATE gates, and pass Tier-1 OEM PPAP audits.
          </p>
        </div>

        {/* KPI Bar & Ecosystem Cross-Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-hairline">
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-[10px] font-mono uppercase text-fg-subtle block">
              Trade Corridors
            </span>
            <span className="font-display text-body-lg font-bold text-fg">
              {EXPORT_CORRIDORS_CATALOG.length} Hubs
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-[10px] font-mono uppercase text-fg-subtle block">
              ITC-HS Profiles
            </span>
            <span className="font-display text-body-lg font-bold text-fg">
              {HSN_EXPORT_PROFILES.length} Schedules
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-[10px] font-mono uppercase text-fg-subtle block">
              PLI &amp; Incentives
            </span>
            <span className="font-display text-body-lg font-bold text-accent-fg">
              {PLI_AND_EXPORT_SCHEMES.length} Schemes
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3">
            <span className="text-[10px] font-mono uppercase text-fg-subtle block">
              Export Readiness
            </span>
            <span className="font-display text-body-lg font-bold text-fg">
              {EXPORT_PAPERWORK_GATES.length} DGFT Gates
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="text-fg-subtle uppercase font-semibold">Connected Benches:</span>
          <Link
            href="/compliance"
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <ShieldCheck className="size-3 text-accent-fg" />
            <span>BIS / WPC / AIS-156 Compliance</span>
          </Link>
          <Link
            href="/sourcing"
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <span>Component Sourcing &amp; Dual-BOM</span>
            <ArrowRight className="size-3" />
          </Link>
          <Link
            href="/network/ip"
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <span>IP Defense &amp; Prior Art Ledger</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      {/* 5 Interactive Export Workbenches */}
      <Tabs
        defaultValue={initialTab}
        value={activeTab}
        onValueChange={(next) => setActiveTab(next as ExportHubTabId)}
      >
        <TabsList label="Global Export & Trade Hub Workbenches" className="w-full justify-start">
          <TabsTrigger value="regulatory">
            <Scale className="size-3.5" />
            <span>Regulatory Bridge</span>
          </TabsTrigger>
          <TabsTrigger value="incoterms">
            <Ship className="size-3.5" />
            <span>HSN &amp; Incoterms Margin</span>
          </TabsTrigger>
          <TabsTrigger value="paperwork">
            <FileCheck2 className="size-3.5" />
            <span>DGFT Paperwork &amp; PLI</span>
          </TabsTrigger>
          <TabsTrigger value="corridors">
            <Globe2 className="size-3.5" />
            <span>Global Trade Corridors</span>
          </TabsTrigger>
          <TabsTrigger value="oem">
            <ClipboardCheck className="size-3.5" />
            <span>OEM Qualification &amp; PPAP</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regulatory">
          <ExportRegulatoryBridge />
        </TabsContent>

        <TabsContent value="incoterms">
          <IncotermsMarginCalculator />
        </TabsContent>

        <TabsContent value="paperwork">
          <DgftPaperworkWizard />
        </TabsContent>

        <TabsContent value="corridors">
          <CorridorDirectory />
        </TabsContent>

        <TabsContent value="oem">
          <OemQualificationSimulator />
        </TabsContent>
      </Tabs>

      {/* Footer Cross-Link Card */}
      <Card className="border-hairline bg-sunken p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Award className="size-4 text-accent-fg shrink-0 mt-0.5" />
          <div className="text-body-xs text-fg-muted">
            <strong className="text-fg">Need pre-shipment EMC scans or NABL chamber booking?</strong>{' '}
            Test CISPR 32 / IEC 62368-1 in India first to save up to 35% of overseas lab fees under ILAC-MRA.
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            href="/emc"
            className="rounded-full border border-line bg-surface-1 px-3 py-1.5 text-body-xs font-mono font-semibold text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            EMC Pre-Scan →
          </Link>
          <Link
            href="/testbeds"
            className="rounded-full border border-line bg-surface-1 px-3 py-1.5 text-body-xs font-mono font-semibold text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            HIL Testbeds →
          </Link>
        </div>
      </Card>
    </div>
  );
}
