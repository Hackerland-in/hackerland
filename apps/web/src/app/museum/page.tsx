import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Skull,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { MUSEUM_EXHIBITS } from '@/lib/data/museum-data';
import { FailureRiskCalculator } from '@/components/museum/failure-risk-calculator';

export const metadata: Metadata = {
  title: 'Failed Projects Museum & Autopsy Archive | Hackerland',
  description:
    'An honest museum of failed hardware and deep-tech ventures. Technical root-cause autopsies, engineering mistakes, physics limits, and lessons to prevent repeating history.',
};

export default function MuseumPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Counteracting Survivorship Bias
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Failed Projects Museum & Engineering Autopsies
          </h1>
          <p className="text-neutral-400 max-w-3xl text-base sm:text-lg leading-relaxed">
            Most tech advice comes from survivors who got lucky. True engineering wisdom is forged in failed projects. Explore candid autopsies of ambitious hardware that crashed into physical, thermodynamic, supply chain, and economic limits.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-rose-400">$1.6B+</div>
              <div className="text-xs text-neutral-400 mt-0.5">Capital Autopsied</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">Physics vs Hype</div>
              <div className="text-xs text-neutral-400 mt-0.5">Thermodynamic Limits</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">Salvageable Tech</div>
              <div className="text-xs text-neutral-400 mt-0.5">IP Reusable Today</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-amber-400">Pre-Mortem Tool</div>
              <div className="text-xs text-neutral-400 mt-0.5">Test Your Own Bill of Materials</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Interactive Risk Evaluator */}
        <section className="space-y-4">
          <FailureRiskCalculator />
        </section>

        {/* Museum Exhibits Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Skull className="w-5 h-5 text-rose-400" /> Curated Post-Mortem Exhibits
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Deep architectural breakdowns of prominent hardware failures
              </p>
            </div>
            <span className="text-xs text-neutral-500">{MUSEUM_EXHIBITS.length} Autopsies Published</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MUSEUM_EXHIBITS.map((exhibit) => (
              <Link
                key={exhibit.slug}
                href={`/museum/${exhibit.slug}`}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-rose-500/50 transition p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/30">
                      {exhibit.primaryFailureMode}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">{exhibit.lifespan}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition">
                      {exhibit.title}
                    </h3>
                    <p className="text-xs font-medium text-amber-300/80 italic">
                      "{exhibit.tagline}"
                    </p>
                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed pt-1">
                      {exhibit.summary}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block">Category:</span>
                      <span className="text-neutral-200 font-medium">{exhibit.category}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Capital Burned:</span>
                      <span className="text-rose-400 font-bold">{exhibit.capitalBurned}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Key Architectural Traps:
                    </span>
                    <div className="space-y-1">
                      {exhibit.rootCauseAutopsy.map((step) => (
                        <div key={step.failureTrigger} className="text-xs text-neutral-400 flex items-start gap-1.5">
                          <span className="text-rose-400 mt-0.5 shrink-0">✕</span>
                          <span className="truncate">{step.failureTrigger}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:translate-x-0.5 transition">
                  <span>Read Complete Engineering Autopsy</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
