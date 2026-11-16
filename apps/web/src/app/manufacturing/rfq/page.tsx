import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cpu, Factory, FileDown } from 'lucide-react';
import { RFQCalculator } from '@/components/manufacturing/rfq/rfq-calculator';

export const metadata: Metadata = {
  title: 'Instant PCB Fabrication & RFQ Quotation Engine | Hackerland',
  description:
    'Compare real-time PCB prototype and assembly manufacturing costs across domestic Indian fabricators (LionCircuits, PCB Power, Circuit99) and global suppliers with zero customs surprises.',
};

export default function RFQPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/manufacturing"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Manufacturing Hub
          </Link>

          <Link
            href="/manufacturing/pcb"
            className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            <Cpu className="w-4 h-4" /> Open In-Browser PCB Studio
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Factory className="w-3.5 h-3.5" /> India-First Hardware Supply Chain
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Instant PCB Fabrication & Quoting Engine
          </h1>
          <p className="text-neutral-400 max-w-3xl text-sm sm:text-base leading-relaxed">
            Get instant price comparisons, estimated lead times, and true landed costs with taxes (GST for India, import duty for global suppliers). Export ready-to-order RFQ packages directly to domestic and international fabrication plants.
          </p>
        </div>

        {/* Interactive RFQ Calculator */}
        <RFQCalculator />
      </div>
    </div>
  );
}
