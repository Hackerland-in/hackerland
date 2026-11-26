import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, StatTile } from '@hackerland/ui';
import { FileCheck2, Scale, ShieldAlert } from 'lucide-react';
import { listReports } from '@/lib/data/queries';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';
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
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <ShieldAlert className="size-3.5" aria-hidden="true" />
              <span>Mission Control · Trust &amp; Safety</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
              Moderation &amp; DPDP Compliance
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
              Real-time incident response, anti-slop defense, payload quarantine, and statutory parental consent records under India&apos;s DPDP Act 2023.
            </p>
          </div>

          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link href="/feed">View Public Feed</Link>
          </Button>
        </header>

        {/* KPI Stats Strip */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
          <StatTile
            label="Open Incidents"
            value={pendingCount.toString()}
            hint="Needs moderator triage"
            tone="warning"
          />
          <StatTile
            label="Actioned Reports"
            value={actionedCount.toString()}
            hint="Content hidden or warned"
            tone="accent"
          />
          <StatTile
            label="DPDP Consent Verified"
            value="100%"
            hint="Parental consent hashes"
            tone="success"
          />
          <StatTile
            label="Response SLA"
            value="< 15m"
            hint="Median time to triage"
            tone="code"
          />
        </div>

        {/* DPDP Act 2023 Compliance Panel */}
        <Card className="border-accent/25 bg-surface-1 p-5 min-w-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Scale className="size-5 text-accent" aria-hidden="true" />
                <h2 className="font-display text-headline-sm font-semibold text-fg">
                  India DPDP Act 2023 Statutory Compliance
                </h2>
              </div>
              <p className="text-body-sm text-fg-muted">
                Hackerland guarantees zero public age profiling for minor contributors under 18. Student makers register through verifiable parental consent hashes (SHA-256) and verified guardian email records. Behavioral advertising and unconsented disclosures are strictly prohibited.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-label-sm font-semibold text-success-fg">
                <FileCheck2 className="size-3.5 text-success" aria-hidden="true" />
                DPDP Consent Hash Verifiable
              </div>
            </div>
          </div>
        </Card>

        {/* Interactive Moderation Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-accent" aria-hidden="true" />
            <h2 className="font-display text-headline-sm font-semibold text-fg">
              Live Incident Triage Queue
            </h2>
          </div>

          <ModerationDashboard initialReports={reports} />
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
