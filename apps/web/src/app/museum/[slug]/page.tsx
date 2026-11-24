import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Skull,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { MUSEUM_EXHIBITS, getMuseumExhibitBySlug } from '@/lib/data/museum-data';

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
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Link href="/museum" className="hover:text-white transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Museum of Failed Projects
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-rose-400 font-medium truncate max-w-[200px] sm:max-w-md">
              {exhibit.title}
            </span>
          </div>

          <Link
            href="/ideas"
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            Validate New Idea in IdeaLab <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Title Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
              {exhibit.primaryFailureMode}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400">Category: {exhibit.category}</span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400 font-mono">Active: {exhibit.lifespan}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {exhibit.title}
          </h1>

          <p className="text-base sm:text-xl text-amber-300/90 italic font-medium">
            &quot;{exhibit.tagline}&quot;
          </p>

          <p className="text-base sm:text-lg text-neutral-300 max-w-4xl leading-relaxed">
            {exhibit.summary}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10">
              <div className="text-xs text-rose-400 uppercase tracking-wider font-semibold">
                Capital Burned
              </div>
              <div className="text-2xl font-black text-rose-400 mt-1">{exhibit.capitalBurned}</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
              <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                Primary Root Cause
              </div>
              <div className="text-xl font-bold text-white mt-1">{exhibit.primaryFailureMode}</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40">
              <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                Salvageable Tech Assets
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                {exhibit.salvageableInnovations.length} Technologies
              </div>
            </div>
          </div>
        </div>

        {/* Product Architecture & Specs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Physical Product Specifications
          </h2>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
            {exhibit.productSpecs.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Root Cause Autopsy Timeline */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Skull className="w-5 h-5 text-rose-400" /> Technical Root Cause Autopsy
          </h2>

          <div className="space-y-6">
            {exhibit.rootCauseAutopsy.map((step, idx) => (
              <div
                key={step.failureTrigger}
                className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4 hover:border-neutral-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white">{step.failureTrigger}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                    Stage: {step.stage}
                  </span>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed">{step.detail}</p>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                    Early Warning Signs Ignored:
                  </span>
                  {step.warningSigns.map((sign, sIdx) => (
                    <div key={sIdx} className="text-xs text-rose-200/90 flex items-start gap-1.5">
                      <span className="text-rose-400 mt-0.5">⚠</span>
                      <span>{sign}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Salvageable Innovations */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Salvageable Innovations (What Succeeded Later)
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Failed ventures often contain brilliant inventions that succeed when transplanted to the right business model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exhibit.salvageableInnovations.map((item) => (
              <div
                key={item.innovation}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3"
              >
                <h3 className="font-bold text-white text-base">{item.innovation}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{item.utility}</p>
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1 font-semibold">
                    Modern Successors Utilizing This:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.modernSuccessors.map((succ) => (
                      <span
                        key={succ}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-medium"
                      >
                        {succ}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lessons for Builders */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> Engineering Principles & Anti-Patterns
          </h2>

          <div className="space-y-4">
            {exhibit.lessonsForBuilders.map((lesson, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-amber-500/20 bg-neutral-950 p-5 space-y-3"
              >
                <h3 className="font-bold text-amber-400 text-base">
                  Principle {idx + 1}: {lesson.principle}
                </h3>
                <p className="text-sm text-neutral-200 leading-relaxed">{lesson.advice}</p>
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
                  <span className="font-bold text-amber-400 shrink-0">Anti-Pattern to Avoid:</span>
                  <span>{lesson.antiPattern}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Have a hardware idea? Don’t make these mistakes.</h3>
            <p className="text-sm text-neutral-400 max-w-xl">
              Use our in-browser PCB Studio to check trace clearances with real Design Rule Checks, and evaluate your BOM in our Instant RFQ engine.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/manufacturing/pcb"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition shadow-lg shadow-emerald-500/10 whitespace-nowrap"
            >
              Open PCB Studio
            </Link>
            <Link
              href="/museum"
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm transition border border-neutral-700 whitespace-nowrap"
            >
              Back to Museum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
