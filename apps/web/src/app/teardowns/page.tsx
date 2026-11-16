import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Banknote,
  Compass,
} from 'lucide-react';
import { TEARDOWNS_DATA } from '@/lib/data/teardowns-data';

export const metadata: Metadata = {
  title: 'Hardware Teardowns & Reverse Engineering Library | Hackerland',
  description:
    'Deep architectural autopsies, Bill of Materials (BOM) cost breakdowns, and chip-level schematics of iconic electric vehicles, drones, and smart IoT devices.',
};

export default function TeardownsPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-3.5 h-3.5" /> Hardware Decision Archaeology
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Reverse Engineering & Teardown Library
          </h1>
          <p className="text-neutral-400 max-w-3xl text-base sm:text-lg leading-relaxed">
            Don’t design in the dark. Inspect the exact silicon chips, thermal heat paths, automotive-grade CAN buses, and true manufacturing unit costs of devices that actually scale to millions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-neutral-400 mt-0.5">Component Level BOMs</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">Open Alternatives</div>
              <div className="text-xs text-neutral-400 mt-0.5">For Indie Prototyping</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">Real Costs</div>
              <div className="text-xs text-neutral-400 mt-0.5">BOM vs Retail Markup</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">Indian Grid & EV</div>
              <div className="text-xs text-neutral-400 mt-0.5">Tested for Local Realities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" /> Featured Hardware Teardowns
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">{TEARDOWNS_DATA.length} Curated Teardowns</span>
            <Link
              href="/teardowns/submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
            >
              <Sparkles className="size-3.5" />
              <span>Submit Teardown (+150 XP)</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEARDOWNS_DATA.map((item) => (
            <Link
              key={item.slug}
              href={`/teardowns/${item.slug}`}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-emerald-500/50 transition p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                    {item.category}
                  </span>
                  <span className="text-xs text-neutral-500">{item.manufacturer}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Retail Price:</span>
                    <span className="text-neutral-200 font-medium">{item.retailPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Est. Electronics BOM:</span>
                    <span className="text-emerald-400 font-bold">{item.estimatedBomCost}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Core Subsystems:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.subsystems.map((sub) => (
                      <span
                        key={sub.name}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition">
                <span>Inspect Full Schematic & BOM</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
