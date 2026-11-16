'use client';

import type { ComponentAlternate } from '@hackerland/core';

interface AlternateComparisonTableProps {
  baseMpn: string;
  basePriceINR: number;
  alternates: ComponentAlternate[];
}

const LEVEL_LABELS: Record<string, { label: string; tone: string }> = {
  pin_compatible: {
    label: '100% Pin-Compatible Drop-In',
    tone: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  functional_drop_in: {
    label: 'Functional Drop-In',
    tone: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  minor_firmware_change: {
    label: 'Minor Firmware Change',
    tone: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  requires_pcb_redesign: {
    label: 'Requires PCB Redesign',
    tone: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  },
};

export function AlternateComparisonTable({
  baseMpn,
  basePriceINR,
  alternates,
}: AlternateComparisonTableProps) {
  if (alternates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-xs text-muted-foreground">No alternates logged for this component yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Drop-In Alternates & Replacements for {baseMpn}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified pinouts, electrical delta, and firmware migration requirements.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-secondary text-foreground">
          {alternates.length} Alternates Found
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alternates.map((alt) => {
          const levelInfo = LEVEL_LABELS[alt.compatibilityLevel] || {
            label: alt.compatibilityLevel,
            tone: 'bg-muted text-muted-foreground border-border',
          };
          const priceDiff = alt.unitPriceINR - basePriceINR;
          const priceDiffPercent = Math.round((priceDiff / basePriceINR) * 100);

          return (
            <div
              key={alt.mpn}
              className="rounded-xl border border-border bg-card/60 p-5 space-y-4 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-foreground font-mono">{alt.mpn}</h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {alt.compatibilityScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{alt.manufacturer}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold font-mono text-foreground">
                    ₹{alt.unitPriceINR.toFixed(2)}
                  </span>
                  <span
                    className={`block text-[11px] font-mono ${
                      priceDiff < 0
                        ? 'text-emerald-500 font-semibold'
                        : priceDiff > 0
                        ? 'text-amber-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {priceDiff < 0
                      ? `${priceDiffPercent}% cheaper`
                      : priceDiff > 0
                      ? `+${priceDiffPercent}% higher`
                      : 'Parity'}
                  </span>
                </div>
              </div>

              {/* Compatibility Badge */}
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono border ${levelInfo.tone}`}
                >
                  ✓ {levelInfo.label}
                </span>
              </div>

              {/* Key Differences */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-foreground block font-mono text-[11px] uppercase tracking-wider">
                  Hardware & Electrical Delta:
                </span>
                <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                  {alt.keyDifferences.map((diff, i) => (
                    <li key={i}>{diff}</li>
                  ))}
                </ul>
              </div>

              {/* Firmware Migration Required */}
              <div className="space-y-1 text-xs pt-1 border-t border-border/40">
                <span className="font-semibold text-foreground block font-mono text-[11px] uppercase tracking-wider">
                  Firmware Adjustments:
                </span>
                <ul className="list-disc pl-4 text-muted-foreground space-y-0.5">
                  {alt.firmwareChangesRequired.map((fw, i) => (
                    <li key={i}>{fw}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
