import type { Metadata } from 'next';
import Link from 'next/link';
import { Skull, ArrowRight, ShieldAlert } from 'lucide-react';
import { Badge, Card, StatTile } from '@hackerland/ui';
import { MUSEUM_EXHIBITS } from '@/lib/data/museum-data';
import { FailureRiskCalculator } from '@/components/museum/failure-risk-calculator';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Failed Projects Museum & Autopsy Archive | Hackerland',
  description:
    'An honest museum of failed hardware and deep-tech ventures. Technical root-cause autopsies, engineering mistakes, physics limits, and pre-mortem risk tools.',
};

export default function MuseumPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-[12px] font-display font-semibold text-danger-fg">
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            <span>Counteracting Survivorship Bias</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            Failed Projects Museum &amp; Engineering Autopsies
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Study candid root-cause autopsies of ambitious hardware projects that hit physics, BOM cost, tooling, or certification walls—and stress-test your own build first.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
          <StatTile label="Capital Autopsied" value="$1.6B+" hint="Venture & hardware post-mortems" tone="danger" />
          <StatTile label="Physics vs Hype" value="Laws" hint="Thermodynamic & energy limits" tone="accent" />
          <StatTile label="Salvageable Tech" value="Reusable IP" hint="Ideas proven later" tone="code" />
          <StatTile label="Pre-Mortem Tool" value="Live Risk" hint="Test your own BOM" tone="make" />
        </div>

        <FailureRiskCalculator />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
                <Skull className="size-4 text-danger-fg" />
                <span>Curated Post-Mortem Exhibits</span>
              </h2>
              <p className="text-body-xs text-fg-muted mt-0.5">
                Architectural breakdowns of prominent hardware &amp; deep-tech failures
              </p>
            </div>
            <span className="text-body-xs font-mono text-fg-subtle">
              {MUSEUM_EXHIBITS.length} Autopsies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MUSEUM_EXHIBITS.map((exhibit) => (
              <Link
                key={exhibit.slug}
                href={`/museum/${exhibit.slug}`}
                className="group block min-w-0"
              >
                <Card className="h-full border-hairline bg-surface-1 hover:border-accent/50 transition p-5 flex flex-col justify-between space-y-4 [overflow-wrap:anywhere]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="danger" variant="outline">
                        {exhibit.primaryFailureMode}
                      </Badge>
                      <span className="text-[11px] text-fg-subtle font-mono">{exhibit.lifespan}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition">
                        {exhibit.title}
                      </h3>
                      <p className="text-body-xs font-medium text-accent-fg italic">
                        &ldquo;{exhibit.tagline}&rdquo;
                      </p>
                      <p className="text-body-xs text-fg-muted line-clamp-3 leading-relaxed pt-1">
                        {exhibit.summary}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-sunken border border-hairline grid grid-cols-2 gap-3 text-body-xs">
                      <div>
                        <span className="text-fg-subtle block text-[11px]">Category</span>
                        <span className="text-fg font-medium">{exhibit.category}</span>
                      </div>
                      <div>
                        <span className="text-fg-subtle block text-[11px]">Capital Burned</span>
                        <span className="text-danger-fg font-bold">{exhibit.capitalBurned}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-semibold text-fg-subtle uppercase tracking-wider">
                        Key Architectural Traps
                      </span>
                      <div className="space-y-1">
                        {exhibit.rootCauseAutopsy.slice(0, 3).map((step) => (
                          <div
                            key={step.failureTrigger}
                            className="text-body-xs text-fg-muted flex items-start gap-1.5"
                          >
                            <span className="text-danger-fg font-bold shrink-0">✕</span>
                            <span className="truncate">{step.failureTrigger}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline flex items-center justify-between text-body-xs font-display font-semibold text-accent-fg">
                    <span>Read Complete Engineering Autopsy</span>
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
