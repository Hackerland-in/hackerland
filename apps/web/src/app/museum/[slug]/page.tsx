import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Skull,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, Card } from '@hackerland/ui';
import { MUSEUM_EXHIBITS, getMuseumExhibitBySlug } from '@/lib/data/museum-data';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MUSEUM_EXHIBITS.map((e) => ({
    slug: e.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exhibit = getMuseumExhibitBySlug(slug);
  if (!exhibit) return { title: 'Exhibit Not Found' };

  return {
    title: `${exhibit.title} — Engineering Autopsy & Root Cause | Hackerland Museum`,
    description: exhibit.summary,
  };
}

export default async function MuseumExhibitPage({ params }: Props) {
  const { slug } = await params;
  const exhibit = getMuseumExhibitBySlug(slug);

  if (!exhibit) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3 text-body-xs">
            <Link href="/museum" className="text-fg-muted hover:text-accent-fg transition flex items-center gap-1.5 font-medium">
              <ArrowLeft className="size-3.5" />
              <span>Museum of Failed Projects</span>
            </Link>
            <Link href="/ideas" className="text-accent-fg hover:underline font-semibold">
              Validate Idea in IdeaLab →
            </Link>
          </div>

          <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-body-xs">
              <Badge tone="danger" variant="outline">{exhibit.primaryFailureMode}</Badge>
              <span className="text-fg-subtle">{exhibit.category}</span>
              <span className="font-mono text-fg-subtle">Active: {exhibit.lifespan}</span>
            </div>

            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              {exhibit.title}
            </h1>

            <p className="text-body-md text-accent-fg italic font-medium">
              &ldquo;{exhibit.tagline}&rdquo;
            </p>

            <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
              {exhibit.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-danger/30 bg-danger/5">
                <div className="text-[11px] font-mono text-danger-fg uppercase font-semibold">Capital Burned</div>
                <div className="text-lg font-bold text-danger-fg mt-0.5">{exhibit.capitalBurned}</div>
              </div>
              <div className="p-3.5 rounded-xl border border-hairline bg-surface-1">
                <div className="text-[11px] font-mono text-fg-subtle uppercase font-semibold">Primary Root Cause</div>
                <div className="text-lg font-bold text-fg mt-0.5">{exhibit.primaryFailureMode}</div>
              </div>
              <div className="p-3.5 rounded-xl border border-hairline bg-surface-1">
                <div className="text-[11px] font-mono text-fg-subtle uppercase font-semibold">Salvageable Assets</div>
                <div className="text-lg font-bold text-success-fg mt-0.5">
                  {exhibit.salvageableInnovations.length} Technologies
                </div>
              </div>
            </div>
          </header>

          <Card className="p-5 border-hairline bg-surface-1 space-y-3">
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning-fg" />
              <span>Physical Product Specifications</span>
            </h2>
            <div className="space-y-1.5">
              {exhibit.productSpecs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-body-xs text-fg-muted">
                  <span className="size-1.5 rounded-full bg-accent shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </Card>

          <section className="space-y-4">
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <Skull className="size-4 text-danger-fg" />
              <span>Technical Root Cause Autopsy</span>
            </h2>

            <div className="space-y-3.5">
              {exhibit.rootCauseAutopsy.map((step, idx) => (
                <Card
                  key={step.failureTrigger}
                  className="border-hairline bg-surface-1 p-5 space-y-3 [overflow-wrap:anywhere]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="size-6 rounded-full bg-danger/10 text-danger-fg font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="font-display text-body-md font-bold text-fg">
                        {step.failureTrigger}
                      </h3>
                    </div>
                    <Badge tone="neutral" variant="outline">
                      Stage: {step.stage}
                    </Badge>
                  </div>

                  <p className="text-body-sm text-fg-muted leading-relaxed">{step.detail}</p>

                  <div className="p-3.5 rounded-xl bg-danger/5 border border-danger/20 space-y-1.5">
                    <span className="text-[11px] font-mono font-semibold text-danger-fg uppercase tracking-wider block">
                      Early Warning Signs Ignored
                    </span>
                    {step.warningSigns.map((sign, sIdx) => (
                      <div key={sIdx} className="text-body-xs text-fg flex items-start gap-1.5">
                        <span className="text-danger-fg shrink-0">⚠</span>
                        <span>{sign}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-3.5">
            <div>
              <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <span>Salvageable Innovations</span>
              </h2>
              <p className="text-body-xs text-fg-muted mt-0.5">
                Core breakthroughs that succeeded later under sustainable unit economics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exhibit.salvageableInnovations.map((item) => (
                <Card
                  key={item.innovation}
                  className="border-hairline bg-surface-1 p-5 space-y-3"
                >
                  <h3 className="font-display font-bold text-body-md text-fg">{item.innovation}</h3>
                  <p className="text-body-xs text-fg-muted leading-relaxed">{item.utility}</p>
                  <div className="pt-2 border-t border-hairline">
                    <span className="text-[10px] text-accent-fg uppercase tracking-wider block mb-1.5 font-mono font-semibold">
                      Modern Successors
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.modernSuccessors.map((succ) => (
                        <span
                          key={succ}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-accent-soft border border-accent/25 text-accent-fg font-medium"
                        >
                          {succ}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-3.5">
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <Lightbulb className="size-4 text-accent" />
              <span>Engineering Principles &amp; Anti-Patterns</span>
            </h2>

            <div className="space-y-3">
              {exhibit.lessonsForBuilders.map((lesson, idx) => (
                <Card
                  key={idx}
                  className="border-hairline bg-surface-1 p-5 space-y-2.5"
                >
                  <h3 className="font-display font-bold text-body-md text-fg">
                    Principle {idx + 1}: {lesson.principle}
                  </h3>
                  <p className="text-body-sm text-fg-muted leading-relaxed">{lesson.advice}</p>
                  <div className="p-3 rounded-xl bg-sunken border border-hairline text-body-xs text-fg flex items-start gap-2">
                    <span className="font-bold text-danger-fg shrink-0">Anti-Pattern:</span>
                    <span>{lesson.antiPattern}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Card className="border-accent/20 bg-accent-soft/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-headline-sm font-bold text-fg">
                Building new hardware? Stress-test clearances early.
              </h3>
              <p className="text-body-xs text-fg-muted max-w-lg">
                Launch the in-browser PCB Studio for DRC checks or run cost modeling in Instant RFQ.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild variant="primary" size="sm">
                <Link href="/manufacturing/pcb">Open PCB Studio</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/museum">Back to Museum</Link>
              </Button>
            </div>
          </Card>
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
