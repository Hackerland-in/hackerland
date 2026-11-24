'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { evaluateHardwareFailureRisk, type FailureRiskAssessment } from '@hackerland/core';

export function FailureRiskCalculator() {
  const [retailPrice, setRetailPrice] = useState<number>(120);
  const [bomCost, setBomCost] = useState<number>(35);
  const [customParts, setCustomParts] = useState<number>(4);
  const [hasMechanical, setHasMechanical] = useState<boolean>(false);
  const [requiresCert, setRequiresCert] = useState<boolean>(true);

  const assessment: FailureRiskAssessment = evaluateHardwareFailureRisk({
    retailPriceUsd: retailPrice,
    bomCostUsd: bomCost,
    customPartsCount: customParts,
    hasMovingMechanicalParts: hasMechanical,
    requiresRegulatoryApproval: requiresCert,
  });

  const marginPct = Math.round(((retailPrice - bomCost) / (retailPrice || 1)) * 100);

  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  if (assessment.level === 'Moderate') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  if (assessment.level === 'High') badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
  if (assessment.level === 'Critical') badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 mb-1 border border-neutral-700">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Interactive Pre-Mortem Tool
          </div>
          <h3 className="text-lg font-bold text-white">Hardware Failure Risk Evaluator</h3>
          <p className="text-xs text-neutral-400">
            Test your project against historical post-mortem data from Juicero, Theranos, and Better Place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${badgeColor}`}>
            Risk Level: {assessment.level} ({assessment.score}/100)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Target Retail Price ($)
              </label>
              <input
                type="number"
                min={1}
                value={retailPrice}
                onChange={(e) => setRetailPrice(Number(e.target.value) || 1)}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Estimated BOM Cost ($)
              </label>
              <input
                type="number"
                min={1}
                value={bomCost}
                onChange={(e) => setBomCost(Number(e.target.value) || 1)}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-xs text-neutral-400 flex items-center justify-between px-1">
            <span>Gross Unit Margin:</span>
            <span className={`font-mono font-bold ${marginPct >= 65 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {marginPct}% {marginPct < 65 ? '(Caution: <65% is dangerous for hardware)' : '(Healthy)'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Custom Molds / Machined Parts ({customParts})
            </label>
            <input
              type="range"
              min={0}
              max={25}
              value={customParts}
              onChange={(e) => setCustomParts(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[11px] text-neutral-500 block mt-0.5">
              More than 8 custom tooling components creates high scrap rates & supply chain bottlenecks.
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasMechanical}
                onChange={(e) => setHasMechanical(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-0 w-4 h-4"
              />
              <span>Contains moving mechanical actuators, gearboxes, or high-pressure valves</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresCert}
                onChange={(e) => setRequiresCert(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-0 w-4 h-4"
              />
              <span>Requires mandatory certification (FCC, CE, BIS, medical FDA / CDSCO)</span>
            </label>
          </div>
        </div>

        {/* Diagnosis & Recommendations */}
        <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
              Automated Autopsy Diagnosis:
            </span>

            {assessment.identifiedTraps.map((trap, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-rose-300/90 leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400 mt-0.5" />
                <span>{trap}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Preventative Engineering Measures:
            </span>
            {assessment.preventativeMeasures.map((measure, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-emerald-300/90 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                <span>{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
