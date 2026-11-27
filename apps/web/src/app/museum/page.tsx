import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Skull,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  PackageSearch,
  Globe,
  Lightbulb,
} from 'lucide-react';
import { Badge, Button, Card, StatTile } from '@hackerland/ui';
import { MUSEUM_EXHIBITS } from '@/lib/data/museum-data';
import { FailureRiskCalculator } from '@/components/museum/failure-risk-calculator';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Failed Projects Museum & Autopsy Archive | Hackerland',
  description:
    'An honest museum of failed hardware, deep-tech ventures, and ₹50k–₹5L Indian MSME traps. Technical root-cause autopsies, customs/WPC/UN 38.3 failures, and pre-mortem risk tools.',
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
            Study candid root-cause autopsies of global hardware collapses and real ₹50k–₹5L Indian MSME traps—from Nhava Sheva RF customs seizures to single-source MCU halts and UN 38.3 battery rejections.
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
          <StatTile label="Global Autopsies" value="$1.6B+" hint="Venture & hardware post-mortems" tone="danger" />
          <StatTile label="India MSME Traps" value="₹50k–₹5L" hint="WPC, BOM & cargo failures" tone="warning" />
          <StatTile label="Salvageable Tech" value="Reusable IP" hint="Ideas proven later" tone="code" />
          <StatTile label="Pre-Mortem Tool" value="Live Risk" hint="Test your own BOM" tone="accent" />
        </div>

        <FailureRiskCalculator />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
                <Skull className="size-4 text-danger-fg" />
                <span>Curated Post-Mortem Exhibits &amp; MSME Traps</span>
              </h2>
              <p className="text-body-xs text-fg-muted mt-0.5">
                Architectural breakdowns of global deep-tech failures and ₹50k–₹5L Indian manufacturing &amp; customs traps
              </p>
            </div>
            <span className="text-body-xs font-mono text-fg-subtle">
              {MUSEUM_EXHIBITS.length} Autopsies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MUSEUM_EXHIBITS.map((exhibit) => {
              const isIndiaMsmeTrap = exhibit.capitalBurned.includes('₹');
              return (
                <Card
                  key={exhibit.slug}
                  className="h-full border-hairline bg-surface-1 hover:border-accent/50 transition p-5 flex flex-col justify-between space-y-4 [overflow-wrap:anywhere] group"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone="danger" variant="outline">
                          {exhibit.primaryFailureMode}
                        </Badge>
                        {isIndiaMsmeTrap && (
                          <Badge tone="accent" variant="solid">
                            India MSME Trap · ₹50k–₹5L
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-fg-subtle font-mono">{exhibit.lifespan}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition">
                        <Link href={`/museum/${exhibit.slug}`}>{exhibit.title}</Link>
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

                  <div className="pt-3 border-t border-hairline space-y-2.5">
                    <Button asChild variant="soft" size="sm" className="w-full justify-between">
                      <Link href={`/museum/${exhibit.slug}`}>
                        <span>Read Complete Engineering Autopsy</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <Link
                        href="/compliance"
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-hairline bg-sunken px-2 py-1.5 text-[11px] font-display font-semibold text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg transition-colors"
                      >
                        <ShieldCheck className="size-3 shrink-0 text-accent-fg" aria-hidden="true" />
                        <span>Compliance</span>
                      </Link>
                      <Link
                        href="/sourcing"
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-hairline bg-sunken px-2 py-1.5 text-[11px] font-display font-semibold text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg transition-colors"
                      >
                        <PackageSearch className="size-3 shrink-0 text-accent-fg" aria-hidden="true" />
                        <span>Sourcing</span>
                      </Link>
                      <Link
                        href="/export"
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-hairline bg-sunken px-2 py-1.5 text-[11px] font-display font-semibold text-fg-muted hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg transition-colors"
                      >
                        <Globe className="size-3 shrink-0 text-accent-fg" aria-hidden="true" />
                        <span>Export</span>
                      </Link>
                      <Link
                        href="/ideas"
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-accent/25 bg-accent-soft/70 px-2 py-1.5 text-[11px] font-display font-semibold text-accent-fg hover:bg-accent hover:text-on-solid transition-colors"
                      >
                        <Lightbulb className="size-3 shrink-0" aria-hidden="true" />
                        <span>IdeaLab</span>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
