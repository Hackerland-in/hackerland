import type { Metadata } from 'next';
import { Radar } from 'lucide-react';
import { listObservatoryItems } from '@/lib/data/observatory-data';
import { TechRadarView } from '@/components/observatory/tech-radar-view';

export const metadata: Metadata = {
  title: 'Global Innovation Observatory & Tech Radar | Hackerland',
  description:
    'Real-time intelligence feed tracking expired patents in the public domain, deep-tech research breakthroughs, open-source silicon tapeouts, and non-dilutive government grants.',
};

export default function ObservatoryPage() {
  const items = listObservatoryItems();

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Radar className="w-3.5 h-3.5" /> Worldwide Horizon Scanning
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Global Innovation Observatory & Tech Radar
          </h1>
          <p className="text-neutral-400 max-w-3xl text-base sm:text-lg leading-relaxed">
            Spot technological shifts before they become mainstream. Track expired patents newly available to the public domain, peer-reviewed lab breakthroughs waiting for engineering teams, and open silicon shuttles ready for custom hardware.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-amber-400">Public Domain</div>
              <div className="text-xs text-neutral-400 mt-0.5">Expired Patents You Can Build</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-cyan-400">Lab-to-Market</div>
              <div className="text-xs text-neutral-400 mt-0.5">Commercializable Research</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">Open Silicon</div>
              <div className="text-xs text-neutral-400 mt-0.5">Custom ASIC & PCB Stators</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-purple-400">₹ Cr Grants</div>
              <div className="text-xs text-neutral-400 mt-0.5">iDEX & Non-Dilutive Capital</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <TechRadarView items={items} />
      </section>
    </div>
  );
}
