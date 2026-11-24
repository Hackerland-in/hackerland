'use client';

import { useState, useMemo } from 'react';
import { Card, Badge } from '@hackerland/ui';
import { PieChart } from 'lucide-react';

export function CapTableCalculator() {
  const [founderEquitySplit, setFounderEquitySplit] = useState<number>(50); // Founder 1 vs Founder 2
  const [preSeedInvestmentUsd] = useState<number>(250000); // $250k
  const [preSeedValuationCapUsd, setPreSeedValuationCapUsd] = useState<number>(2500000); // $2.5M cap
  const [esopPoolPercent] = useState<number>(10); // 10% ESOP pool
  const [seedRoundInvestmentUsd] = useState<number>(1500000); // $1.5M Seed
  const [seedValuationCapUsd, setSeedValuationCapUsd] = useState<number>(8000000); // $8M cap

  const capTable = useMemo(() => {
    // 1. Initial State (100% split between founders)
    const initialF1 = founderEquitySplit;
    const initialF2 = 100 - founderEquitySplit;

    // 2. Pre-Seed Round Dilution (Post-Money SAFE)
    const preSeedEquitySold = Math.min(35, (preSeedInvestmentUsd / preSeedValuationCapUsd) * 100);
    const postPreSeedFoundersTotal = 100 - preSeedEquitySold;
    const f1PostPreSeed = (initialF1 / 100) * postPreSeedFoundersTotal;
    const f2PostPreSeed = (initialF2 / 100) * postPreSeedFoundersTotal;

    // 3. Unallocated ESOP Pool Creation
    const poolDilutionFactor = (100 - esopPoolPercent) / 100;
    const f1PostEsop = f1PostPreSeed * poolDilutionFactor;
    const f2PostEsop = f2PostPreSeed * poolDilutionFactor;
    const preSeedPostEsop = preSeedEquitySold * poolDilutionFactor;
    const esopPostEsop = esopPoolPercent;

    // 4. Seed Round Dilution
    const seedEquitySold = Math.min(30, (seedRoundInvestmentUsd / seedValuationCapUsd) * 100);
    const seedDilutionFactor = (100 - seedEquitySold) / 100;

    const finalF1 = f1PostEsop * seedDilutionFactor;
    const finalF2 = f2PostEsop * seedDilutionFactor;
    const finalEsop = esopPostEsop * seedDilutionFactor;
    const finalPreSeed = preSeedPostEsop * seedDilutionFactor;
    const finalSeed = seedEquitySold;

    // Value of stakes at Seed Valuation
    const f1Value = (finalF1 / 100) * seedValuationCapUsd;
    const f2Value = (finalF2 / 100) * seedValuationCapUsd;
    const esopValue = (finalEsop / 100) * seedValuationCapUsd;

    return {
      f1: finalF1,
      f2: finalF2,
      esop: finalEsop,
      preSeed: finalPreSeed,
      seed: finalSeed,
      f1Value,
      f2Value,
      esopValue,
      totalSoldToInvestors: finalPreSeed + finalSeed,
    };
  }, [
    founderEquitySplit,
    preSeedInvestmentUsd,
    preSeedValuationCapUsd,
    esopPoolPercent,
    seedRoundInvestmentUsd,
    seedValuationCapUsd,
  ]);

  return (
    <Card className="p-5 bg-surface-1 border-hairline space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PieChart className="size-4 text-accent" />
            <span className="text-caption font-mono uppercase font-bold text-fg">
              Interactive SAFE & Equity Dilution Simulator
            </span>
          </div>
          <h3 className="text-body-sm font-display font-bold text-fg">
            Founder Ownership from Incorporation to Seed Round
          </h3>
        </div>
        <Badge tone="accent" variant="solid" className="font-mono text-caption self-start sm:self-auto">
          Post-Money SAFE Model
        </Badge>
      </div>

      {/* Visual Stacked Ownership Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-caption font-mono">
          <span className="text-fg-muted font-bold">Ownership Distribution</span>
          <span className="text-fg font-bold">100% Fully Diluted</span>
        </div>

        <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-inner border border-hairline">
          <div
            style={{ width: `${capTable.f1}%` }}
            className="bg-accent flex items-center justify-center text-[10px] font-mono font-bold text-on-solid truncate px-1"
            title={`Founder 1: ${capTable.f1.toFixed(1)}%`}
          >
            F1 ({capTable.f1.toFixed(0)}%)
          </div>
          <div
            style={{ width: `${capTable.f2}%` }}
            className="bg-sky-600 flex items-center justify-center text-[10px] font-mono font-bold text-white truncate px-1"
            title={`Founder 2: ${capTable.f2.toFixed(1)}%`}
          >
            F2 ({capTable.f2.toFixed(0)}%)
          </div>
          <div
            style={{ width: `${capTable.esop}%` }}
            className="bg-amber-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 truncate px-1"
            title={`ESOP Pool: ${capTable.esop.toFixed(1)}%`}
          >
            ESOP ({capTable.esop.toFixed(0)}%)
          </div>
          <div
            style={{ width: `${capTable.preSeed}%` }}
            className="bg-emerald-500 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 truncate px-1"
            title={`Pre-Seed: ${capTable.preSeed.toFixed(1)}%`}
          >
            Pre-Seed ({capTable.preSeed.toFixed(0)}%)
          </div>
          <div
            style={{ width: `${capTable.seed}%` }}
            className="bg-rose-500 flex items-center justify-center text-[10px] font-mono font-bold text-white truncate px-1"
            title={`Seed: ${capTable.seed.toFixed(1)}%`}
          >
            Seed ({capTable.seed.toFixed(0)}%)
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-mono pt-1">
          <span className="flex items-center gap-1.5 text-accent font-medium">
            <span className="size-2 rounded-full bg-accent" /> Founder 1 ({capTable.f1.toFixed(1)}% · ${(capTable.f1Value / 1000).toFixed(0)}k)
          </span>
          <span className="flex items-center gap-1.5 text-sky-400 font-medium">
            <span className="size-2 rounded-full bg-sky-600" /> Founder 2 ({capTable.f2.toFixed(1)}% · ${(capTable.f2Value / 1000).toFixed(0)}k)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="size-2 rounded-full bg-amber-500" /> ESOP Option Pool ({capTable.esop.toFixed(1)}%)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="size-2 rounded-full bg-emerald-500" /> Pre-Seed ({capTable.preSeed.toFixed(1)}%)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="size-2 rounded-full bg-rose-500" /> Seed Lead ({capTable.seed.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Sliders Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-hairline/60">
        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>Co-Founder Initial Split</span>
            <span className="font-bold text-fg">{founderEquitySplit}% / {100 - founderEquitySplit}%</span>
          </label>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={founderEquitySplit}
            onChange={(e) => setFounderEquitySplit(Number(e.target.value))}
            className="w-full accent-accent mt-1.5"
          />
          <span className="text-[10px] text-fg-subtle font-mono block mt-0.5">
            YC Benchmark: 50/50 equal splits show mutual trust
          </span>
        </div>

        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>Pre-Seed SAFE Cap</span>
            <span className="font-bold text-emerald-400">${(preSeedValuationCapUsd / 1000000).toFixed(1)}M Cap</span>
          </label>
          <input
            type="range"
            min="1000000"
            max="6000000"
            step="250000"
            value={preSeedValuationCapUsd}
            onChange={(e) => setPreSeedValuationCapUsd(Number(e.target.value))}
            className="w-full accent-emerald-500 mt-1.5"
          />
          <span className="text-[10px] text-fg-subtle font-mono block mt-0.5">
            Raising ${(preSeedInvestmentUsd / 1000).toFixed(0)}k on Post-Money SAFE
          </span>
        </div>

        <div>
          <label className="text-caption font-mono text-fg-muted flex justify-between">
            <span>Seed Round Valuation</span>
            <span className="font-bold text-rose-400">${(seedValuationCapUsd / 1000000).toFixed(1)}M Post</span>
          </label>
          <input
            type="range"
            min="4000000"
            max="20000000"
            step="500000"
            value={seedValuationCapUsd}
            onChange={(e) => setSeedValuationCapUsd(Number(e.target.value))}
            className="w-full accent-rose-500 mt-1.5"
          />
          <span className="text-[10px] text-fg-subtle font-mono block mt-0.5">
            Raising ${(seedRoundInvestmentUsd / 1000000).toFixed(1)}M round
          </span>
        </div>
      </div>
    </Card>
  );
}
