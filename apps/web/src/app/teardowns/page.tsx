import type { Metadata } from 'next';
import Link from 'next/link';
import { Cpu, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { Badge, Button, Card, StatTile } from '@hackerland/ui';
import { TEARDOWNS_DATA } from '@/lib/data/teardowns-data';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Hardware Teardowns & Reverse Engineering Library | Hackerland',
  description:
    'Deep architectural autopsies, Bill of Materials (BOM) cost breakdowns, and chip-level schematics of iconic electric vehicles, drones, and smart IoT devices.',
};

export default function TeardownsPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
                <Compass className="size-3.5" aria-hidden="true" />
                <span>Hardware Decision Archaeology</span>
              </div>
              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
                Reverse Engineering &amp; Teardown Library
              </h1>
              <p className="text-body-sm text-fg-muted max-w-xl leading-relaxed">
                Inspect exact silicon chips, thermal paths, CAN architectures, and true BOM unit economics of shipping Indian &amp; global hardware.
              </p>
            </div>
            <Button asChild variant="primary" size="sm" className="shrink-0">
              <Link href="/teardowns/submit">
                <Sparkles className="size-3.5" />
                <span>Submit Teardown (+150 XP)</span>
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
          <StatTile label="BOM Detail" value="100%" hint="Component-level costing" tone="accent" />
          <StatTile label="Open Replacements" value="Mapped" hint="Indie prototyping alternates" tone="make" />
          <StatTile label="Margin Analysis" value="Verified" hint="BOM vs retail markup" tone="code" />
          <StatTile label="Indian Context" value="Grid & EV" hint="Tested for local conditions" tone="earn" />
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <Cpu className="size-4 text-accent" />
              <span>Featured Hardware Teardowns</span>
            </h2>
            <span className="text-body-xs font-mono text-fg-subtle">
              {TEARDOWNS_DATA.length} Teardowns
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEARDOWNS_DATA.map((item) => (
              <Link key={item.slug} href={`/teardowns/${item.slug}`} className="group block min-w-0">
                <Card className="h-full border-hairline bg-surface-1 hover:border-accent/50 transition p-5 flex flex-col justify-between space-y-4 [overflow-wrap:anywhere]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="accent" variant="outline">{item.category}</Badge>
                      <span className="text-[11px] font-mono text-fg-subtle">{item.manufacturer}</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display text-body-lg font-bold text-fg group-hover:text-accent-fg transition line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-body-xs text-fg-muted line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-sunken border border-hairline space-y-1 text-body-xs">
                      <div className="flex justify-between">
                        <span className="text-fg-subtle">Retail Price:</span>
                        <span className="text-fg font-semibold">{item.retailPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg-subtle">Est. Electronics BOM:</span>
                        <span className="text-success-fg font-bold">{item.estimatedBomCost}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {item.subsystems.map((sub) => (
                        <span
                          key={sub.name}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-sunken border border-hairline text-fg-muted"
                        >
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline flex items-center justify-between text-body-xs font-display font-semibold text-accent-fg">
                    <span>Inspect Full Schematic &amp; BOM</span>
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
