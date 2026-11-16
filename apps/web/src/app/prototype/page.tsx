import type { Metadata } from 'next';
import Link from 'next/link';
import { Cpu, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { PrototypeArchitectStudio } from '@/components/prototype/prototype-architect-studio';

export const metadata: Metadata = {
  title: 'Idea-to-Prototype Hardware Simulator & Architect | Hackerland',
  description:
    'Turn any hardware idea into a complete engineering architecture in seconds: system blocks, MCU pinouts, component-level Bill of Materials (BOM), squad skill requirements, and direct PCB Studio export.',
};

export default function PrototypePage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Idea-to-Prototype Engine (Feature 7)
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Idea-to-Prototype Hardware Architecture Simulator
          </h1>
          <p className="text-neutral-400 max-w-3xl text-base sm:text-lg leading-relaxed">
            Enter any hardware concept to instantly synthesize a production-grade engineering plan: system topology, MCU pinout interconnects, component-level Bill of Materials (BOM), squad roles, and 1-click export to our in-browser PCB Studio.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">Zero to BOM</div>
              <div className="text-xs text-neutral-400 mt-0.5">Instant Component List</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">Pinout Matrix</div>
              <div className="text-xs text-neutral-400 mt-0.5">I2C, SPI & UART Mapping</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-white">Squad Roster</div>
              <div className="text-xs text-neutral-400 mt-0.5">Skills & Time Estimates</div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="text-2xl font-black text-emerald-400">1-Click Export</div>
              <div className="text-xs text-neutral-400 mt-0.5">Direct to PCB Studio & RFQ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <PrototypeArchitectStudio />
      </section>
    </div>
  );
}
