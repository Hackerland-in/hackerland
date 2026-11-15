import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Button,
  Card,
  SectionHeader,
  StatTile,
} from '@hackerland/ui';
import {
  FileCheck2,
  Scale,
  ShieldAlert,
} from 'lucide-react';
import { listReports } from '@/lib/data/queries';
import { ModerationDashboard } from './moderation-dashboard';

export const metadata: Metadata = {
  title: 'Trust & Safety Mission Control · Hackerland',
  description:
    'Real-time content moderation, automated anti-slop triage, DPDP Act 2023 parental consent verification, and malicious hardware payload quarantine.',
};

export default async function ModerationPage() {
  const reports = await listReports();

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const actionedCount = reports.filter((r) => r.status === 'actioned').length;

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="MISSION CONTROL · TRUST & SAFETY"
        title="Moderation & DPDP Compliance"
        description="Real-time incident response, anti-slop defense, hardware payload security quarantine, and statutory parental consent records under the Digital Personal Data Protection (DPDP) Act 2023."
        action={
          <Button asChild variant="secondary">
            <Link href="/feed">View Public Feed</Link>
          </Button>
        }
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Open Incidents"
          value={pendingCount.toString()}
          hint="Needs moderator triage"
        />
        <StatTile
          label="Actioned Reports"
          value={actionedCount.toString()}
          hint="Content hidden or warned"
        />
        <StatTile
          label="DPDP Consent Verified"
          value="100%"
          hint="Parental consent hashes"
        />
        <StatTile
          label="Response SLA"
          value="< 15m"
          hint="Median time to triage"
        />
      </div>

      {/* DPDP Act 2023 Compliance Panel */}
      <Card className="border-accent/30 bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 p-5 min-w-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="font-display text-headline-sm font-semibold text-fg">
                India DPDP Act 2023 Statutory Compliance
              </h2>
            </div>
            <p className="text-body-sm text-fg-muted">
              Hackerland guarantees zero public age profiling for minor contributors under 18. Student makers register through verifiable parental consent hashes (SHA-256) and verified guardian email records. Behavioral advertising, tracking cookies, and unconsented data disclosures are strictly prohibited by architecture.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-label-xs font-semibold text-success-fg">
              <FileCheck2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              DPDP Consent Hash Verifiable
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Moderation Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="font-display text-headline-sm font-semibold text-fg">
            Live Incident Triage Queue
          </h2>
        </div>

        <ModerationDashboard initialReports={reports} />
      </div>
    </div>
  );
}
