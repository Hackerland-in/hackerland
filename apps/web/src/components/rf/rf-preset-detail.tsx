'use client';

import Link from 'next/link';
import type { RfTransmissionLinePreset } from '@hackerland/core';
import { RfStackupCalculator } from './rf-stackup-calculator';
import { RfMatchingSynthesizer } from './rf-matching-synthesizer';

interface RfPresetDetailProps {
  preset: RfTransmissionLinePreset;
}

export function RfPresetDetail({ preset }: RfPresetDetailProps) {
  return (
    <div className="space-y-7">
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-fg-muted">
          <Link href="/rf-calc" className="hover:text-accent-fg transition-colors">
            ← RF Synthesizer Catalog
          </Link>
          <span>/</span>
          <span className="text-fg font-semibold">{preset.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent-fg border border-accent/25 font-mono">
                {preset.frequencyGHz} GHz
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-2 text-fg font-mono uppercase border border-hairline">
                {preset.lineType.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info/10 text-info-fg border border-info/25 font-mono">
                {preset.targetImpedance}Ω Target
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
              {preset.title}
            </h1>
            <p className="text-sm text-fg-muted mt-1 max-w-3xl">{preset.application}</p>
          </div>

          <div className="bg-surface-1 border border-hairline rounded-2xl p-3.5 text-right font-mono shadow-xs">
            <span className="text-[10px] text-fg-subtle uppercase block">Calculated Insertion Loss</span>
            <span className="text-lg font-bold text-accent-fg">{preset.calculatedLossDbPer100Mm} dB</span>
            <span className="text-[10px] text-fg-subtle block">per 100mm trace</span>
          </div>
        </div>
      </div>

      {/* Verification Facility */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-5 flex items-start gap-3 shadow-xs">
        <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/25 text-accent-fg shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-accent-fg font-bold block">
            NABL / Indian Defense &amp; Telecom Verification Facility
          </span>
          <p className="text-sm text-fg font-mono font-semibold mt-0.5">
            {preset.indianContextFacility}
          </p>
          <p className="text-xs text-fg-muted mt-1 leading-relaxed">
            {preset.schematicNotes}
          </p>
        </div>
      </div>

      {/* Layer Stackup */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-3 font-mono shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
          <span className="text-xs uppercase tracking-wider font-bold text-fg">
            Fabrication Stackup Definition
          </span>
          <span className="text-xs text-fg-muted">
            Recommended W: <strong className="text-success-fg">{preset.recommendedWidthMm} mm</strong>
            {preset.recommendedGapMm && <> | Gap G: <strong className="text-info-fg">{preset.recommendedGapMm} mm</strong></>}
            {preset.recommendedSpacingMm && <> | Diff S: <strong className="text-accent-fg">{preset.recommendedSpacingMm} mm</strong></>}
          </span>
        </div>
        <p className="text-xs text-fg bg-sunken p-3.5 rounded-xl border border-hairline">
          {preset.layerStackup}
        </p>

        <div className="pt-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-fg-muted block mb-2">
            RF Design Rules &amp; DRC Constraints (KiCad / Altium)
          </span>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-fg-muted font-sans">
            {preset.designRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-sunken/80 p-3 rounded-xl border border-hairline">
                <span className="text-success-fg font-bold">✓</span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-fg mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          Interactive Waveguide Solver (Pre-Loaded for {preset.title})
        </h2>
        <RfStackupCalculator
          initialLineType={preset.lineType}
          initialSubstrate={preset.substrate}
          initialFreqGHz={preset.frequencyGHz}
          initialWidthMm={preset.recommendedWidthMm}
          initialGapMm={preset.recommendedGapMm ?? 0.35}
        />
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-fg mb-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-info" />
          Smith Chart &amp; Conjugate Matching Synthesizer
        </h2>
        <RfMatchingSynthesizer />
      </div>
    </div>
  );
}
