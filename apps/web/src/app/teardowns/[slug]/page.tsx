import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  Layers,
  Banknote,
  ShieldCheck,
  Zap,
  Lightbulb,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { TEARDOWNS_DATA, type TeardownArticle } from '@/lib/data/teardowns-data';

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
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Link href="/teardowns" className="hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Teardowns
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-emerald-400 font-medium truncate max-w-[200px] sm:max-w-md">
              {item.title}
            </span>
          </div>

          <Link
            href="/manufacturing/pcb"
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            Design Similar Circuit in PCB Studio <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Title Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {item.category}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400">Manufacturer: {item.manufacturer}</span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400">Device Class: {item.deviceType}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {item.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-4xl leading-relaxed">
            {item.summary}
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Retail Price</div>
              <div className="text-xl font-bold text-white mt-1">{item.retailPrice}</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
              <div className="text-xs text-emerald-400 uppercase tracking-wider">Estimated BOM Cost</div>
              <div className="text-xl font-black text-emerald-400 mt-1">{item.estimatedBomCost}</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Major Subsystems</div>
              <div className="text-xl font-bold text-white mt-1">{item.subsystems.length} Modules</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
              <div className="text-xs text-neutral-500 uppercase tracking-wider">BOM Components Analyzed</div>
              <div className="text-xl font-bold text-white mt-1">{item.bomBreakdown.length} Key ICs</div>
            </div>
          </div>
        </div>

        {/* Subsystems Architecture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" /> Subsystems Architecture Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {item.subsystems.map((sub, idx) => (
              <div
                key={sub.name}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-white text-base">{sub.name}</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{sub.description}</p>
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5 font-semibold">
                    Identified Silicon:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.chips.map((chip) => (
                      <span
                        key={chip}
                        className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-emerald-300 font-mono"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Component-Level Bill of Materials (BOM) Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Component Bill of Materials (BOM)
            </h2>
            <span className="text-xs text-neutral-400">High-volume production estimates</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Component & Function</th>
                  <th className="py-3 px-4">Part Number</th>
                  <th className="py-3 px-4">Manufacturer</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Est. Cost</th>
                  <th className="py-3 px-4">Indie / Open-Source Alternative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {item.bomBreakdown.map((row) => (
                  <tr key={row.partNumber} className="hover:bg-neutral-900/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{row.component}</div>
                      <div className="text-[11px] text-neutral-400">{row.function}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                      {row.partNumber}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{row.manufacturer}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-400">{row.package}</td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{row.estCost}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                        {row.openAlternative}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Engineering Lessons for Builders */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> Architectural Lessons for Indie Builders
          </h2>

          <div className="space-y-3">
            {item.engineeringLessons.map((lesson, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-sm text-amber-200/90 leading-relaxed">{lesson}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-neutral-950 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Inspired to build your own version?</h3>
            <p className="text-sm text-neutral-400 max-w-xl">
              Launch the in-browser PCB studio to lay out your own circuit schematic, or submit your design to our Instant RFQ engine for domestic Indian fabrication.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/manufacturing/pcb"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition shadow-lg shadow-emerald-500/10 whitespace-nowrap"
            >
              Start in PCB Studio
            </Link>
            <Link
              href="/manufacturing/rfq"
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm transition border border-neutral-700 whitespace-nowrap"
            >
              Get Fab Quotes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
