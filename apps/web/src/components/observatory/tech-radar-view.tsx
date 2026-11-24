'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import type { ObservatoryItem, RadarRing, ObservatoryCategory } from '@hackerland/core';

interface Props {
  items: ObservatoryItem[];
}

export function TechRadarView({ items }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<ObservatoryItem | null>(items[0] ?? null);

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedQuadrant !== 'all' && item.quadrant !== selectedQuadrant) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getRingBadge = (ring: RadarRing) => {
    switch (ring) {
      case 'Adopt':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Trial':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Assess':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Hold':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  const getCategoryLabel = (category: ObservatoryCategory) => {
    switch (category) {
      case 'patent_expiry':
        return { label: 'Expired Patent (Public Domain)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'research_breakthrough':
        return { label: 'Research Breakthrough', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      case 'open_hardware':
        return { label: 'Open Hardware & Silicon', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'grant_fund':
        return { label: 'Gov & Deep-Tech Grant', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-4">
        {[
          { id: 'all', label: 'All Global Signals' },
          { id: 'patent_expiry', label: '📜 Expired Patents (Public Domain)' },
          { id: 'open_hardware', label: '⚡ Open Hardware & Silicon' },
          { id: 'research_breakthrough', label: '🔬 Research Breakthroughs' },
          { id: 'grant_fund', label: '💰 Grand Grants & Bounties' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === tab.id
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quadrant Quick Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-neutral-500 shrink-0">Domain:</span>
          {['all', 'Hardware & Silicon', 'Energy & Propulsion', 'Robotics & Automation'].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setSelectedQuadrant(q)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                selectedQuadrant === q
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {q === 'all' ? 'All Domains' : q}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter signals, keywords, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 sm:w-64"
        />
      </div>

      {/* Main Grid: Signals Stream (7 cols) + Focused Deep-Dive (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Signals List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Showing {filteredItems.length} Verified Signals</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
            </span>
          </div>

          <div className="space-y-4">
            {filteredItems.map((item) => {
              const catMeta = getCategoryLabel(item.category);
              const isActive = activeItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`cursor-pointer rounded-2xl border p-5 transition space-y-3 ${
                    isActive
                      ? 'border-emerald-500/60 bg-emerald-950/20 shadow-xl shadow-emerald-500/5'
                      : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${catMeta.color}`}>
                      {catMeta.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getRingBadge(item.ring)}`}>
                        Ring: {item.ring}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {item.impactScore}/100 Impact
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-neutral-500">Source: {item.source.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.2 rounded bg-neutral-800 text-neutral-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Signal Inspector Panel (5 cols) */}
        <div className="lg:col-span-5">
          {activeItem ? (
            <div className="sticky top-20 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-6 shadow-2xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-mono">
                    SIGNAL ID: {activeItem.id.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getRingBadge(activeItem.ring)}`}>
                    Radar Ring: {activeItem.ring}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  {activeItem.title}
                </h3>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeItem.summary}
                </p>
              </div>

              {/* Actionable Maker Angle */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" /> How to Build With This Today:
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {activeItem.makerAction}
                </p>
              </div>

              {/* Commercial Potential */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Commercialization Potential:
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {activeItem.commercialPotential}
                </p>
              </div>

              {/* Source Verification Link */}
              <div className="text-xs text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-800">
                <span>Verified by {activeItem.source.name}</span>
                <a
                  href={activeItem.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Source Document <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href={`/ideas?ref=${encodeURIComponent(activeItem.title)}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Fork Into Stage Zero IdeaLab
                </Link>

                <Link
                  href="/problems"
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition flex items-center justify-center gap-2 border border-neutral-800"
                >
                  Find Matching Problem & Form Squad <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center text-neutral-500 text-xs">
              Select a signal on the left to inspect technical details and commercialization pathways.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
