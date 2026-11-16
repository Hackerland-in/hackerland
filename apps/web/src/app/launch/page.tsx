import type { Metadata } from 'next';
import Link from 'next/link';
import { Rocket, Share2, Sparkles, Globe, Download } from 'lucide-react';
import { LaunchKit } from '@/components/launch/launch-kit';

export const metadata: Metadata = {
  title: 'Community Launch & Announcement Kit | Hackerland',
  description:
    'Ready-to-post announcement threads, Product Hunt launch packages, Show HN submissions, and press assets to announce Hackerland to the global hardware and engineering community.',
};

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pt-16 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Rocket className="w-3.5 h-3.5" /> Worldwide Announcement Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Community Launch & Syndication Kit
          </h1>
          <p className="text-neutral-400 max-w-3xl text-base sm:text-lg leading-relaxed">
            Everything you need to broadcast Hackerland to Product Hunt, Hacker News, Twitter / X, Reddit, and LinkedIn. One-click copy templates formatted to engage serious builders, students, and indie hardware engineers.
          </p>
        </div>
      </section>

      {/* Interactive Launch Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <LaunchKit />
      </section>
    </div>
  );
}
