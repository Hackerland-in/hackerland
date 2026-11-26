import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Cpu, Layers, Lightbulb } from 'lucide-react';
import { Badge, Button, Card } from '@hackerland/ui';
import { TEARDOWNS_DATA } from '@/lib/data/teardowns-data';
import { PcbPinoutAnnotator } from '@/components/teardowns/pcb-pinout-annotator';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEARDOWNS_DATA.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = TEARDOWNS_DATA.find((t) => t.slug === slug);
  if (!item) return { title: 'Teardown Not Found' };

  return {
    title: `${item.title} — Hardware Teardown & BOM Breakdown | Hackerland`,
    description: item.summary,
  };
}

export default async function TeardownDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = TEARDOWNS_DATA.find((t) => t.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <div className="space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3 text-body-xs">
            <Link href="/teardowns" className="text-fg-muted hover:text-accent-fg transition flex items-center gap-1.5 font-medium">
              <ArrowLeft className="size-3.5" />
              <span>Teardowns Library</span>
            </Link>
            <Link href="/manufacturing/pcb" className="text-accent-fg hover:underline font-semibold">
              Open PCB Studio →
            </Link>
          </div>

          <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-body-xs">
              <Badge tone="accent" variant="outline">{item.category}</Badge>
              <span className="text-fg-subtle">{item.manufacturer}</span>
              <span className="font-mono text-fg-subtle">{item.deviceType}</span>
            </div>

            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              {item.title}
            </h1>

            <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
              {item.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-hairline bg-surface-1">
                <div className="text-[11px] font-mono text-fg-subtle uppercase">Retail Price</div>
                <div className="text-lg font-bold text-fg mt-0.5">{item.retailPrice}</div>
              </div>
              <div className="p-3.5 rounded-xl border border-success/30 bg-success/5">
                <div className="text-[11px] font-mono text-success-fg uppercase font-semibold">Est. BOM</div>
                <div className="text-lg font-bold text-success-fg mt-0.5">{item.estimatedBomCost}</div>
              </div>
              <div className="p-3.5 rounded-xl border border-hairline bg-surface-1">
                <div className="text-[11px] font-mono text-fg-subtle uppercase">Subsystems</div>
                <div className="text-lg font-bold text-fg mt-0.5">{item.subsystems.length} Modules</div>
              </div>
              <div className="p-3.5 rounded-xl border border-hairline bg-surface-1">
                <div className="text-[11px] font-mono text-fg-subtle uppercase">BOM ICs</div>
                <div className="text-lg font-bold text-fg mt-0.5">{item.bomBreakdown.length} Key ICs</div>
              </div>
            </div>
          </header>

          {item.pinoutAnnotations && item.pinoutAnnotations.length > 0 && (
            <PcbPinoutAnnotator
              initialAnnotations={item.pinoutAnnotations}
              deviceTitle={item.title}
              allowEditing={false}
            />
          )}

          <section className="space-y-3.5">
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <Cpu className="size-4 text-accent" />
              <span>Subsystems Architecture Breakdown</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.subsystems.map((sub, idx) => (
                <Card key={sub.name} className="border-hairline bg-surface-1 p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="size-6 rounded-full bg-accent-soft text-accent-fg text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-display font-bold text-fg text-body-md">{sub.name}</h3>
                  </div>
                  <p className="text-body-xs text-fg-muted leading-relaxed">{sub.description}</p>
                  <div className="pt-2 border-t border-hairline">
                    <span className="text-[10px] font-mono text-fg-subtle uppercase block mb-1.5 font-semibold">
                      Identified Silicon
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.chips.map((chip) => (
                        <span
                          key={chip}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-sunken border border-hairline text-accent-fg font-mono"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
                <Layers className="size-4 text-accent" />
                <span>Component Bill of Materials (BOM)</span>
              </h2>
              <span className="text-body-xs text-fg-subtle font-mono">Production estimates</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-hairline bg-surface-1">
              <table className="w-full text-left text-body-xs">
                <thead className="border-b border-hairline bg-sunken text-fg-subtle font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Component &amp; Function</th>
                    <th className="py-3 px-4">Part Number</th>
                    <th className="py-3 px-4">Manufacturer</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Est. Cost</th>
                    <th className="py-3 px-4">Open Alternative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {item.bomBreakdown.map((row) => (
                    <tr key={row.partNumber}>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-fg">{row.component}</div>
                        <div className="text-[11px] text-fg-muted">{row.function}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-accent-fg">
                        {row.partNumber}
                      </td>
                      <td className="py-3 px-4 text-fg-muted">{row.manufacturer}</td>
                      <td className="py-3 px-4 font-mono text-fg-subtle">{row.package}</td>
                      <td className="py-3 px-4 font-bold text-fg whitespace-nowrap">{row.estCost}</td>
                      <td className="py-3 px-4">
                        <Badge tone="success" variant="outline">{row.openAlternative}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <Lightbulb className="size-4 text-accent" />
              <span>Architectural Lessons for Builders</span>
            </h2>
            <div className="space-y-2.5">
              {item.engineeringLessons.map((lesson, idx) => (
                <Card key={idx} className="border-hairline bg-surface-1 p-4 flex items-start gap-3">
                  <div className="size-6 rounded-full bg-accent-soft text-accent-fg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-body-sm text-fg-muted leading-relaxed">{lesson}</p>
                </Card>
              ))}
            </div>
          </section>

          <Card className="border-accent/20 bg-accent-soft/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-headline-sm font-bold text-fg">
                Inspired to build your own hardware revision?
              </h3>
              <p className="text-body-xs text-fg-muted max-w-lg">
                Lay out a schematic in PCB Studio or compare Indian fabricator pricing in Instant RFQ.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild variant="primary" size="sm">
                <Link href="/manufacturing/pcb">Start in PCB Studio</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/manufacturing/rfq">Get Fab Quotes</Link>
              </Button>
            </div>
          </Card>
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
