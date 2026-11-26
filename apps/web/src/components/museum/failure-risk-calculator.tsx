'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, Zap, Bookmark, Trash2 } from 'lucide-react';
import { Badge, Button, Card, Input, Label, cn } from '@hackerland/ui';
import { evaluateHardwareFailureRisk, type FailureRiskAssessment } from '@hackerland/core';

interface SavedScenario {
  id: string;
  label: string;
  score: number;
  level: string;
  marginPct: number;
}

export function FailureRiskCalculator() {
  const [retailPrice, setRetailPrice] = useState<number>(120);
  const [bomCost, setBomCost] = useState<number>(35);
  const [customParts, setCustomParts] = useState<number>(4);
  const [hasMechanical, setHasMechanical] = useState<boolean>(false);
  const [requiresCert, setRequiresCert] = useState<boolean>(true);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackerland_risk_scenarios');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setScenarios(parsed);
      }
    } catch {}
  }, []);

  const assessment: FailureRiskAssessment = evaluateHardwareFailureRisk({
    retailPriceUsd: retailPrice,
    bomCostUsd: bomCost,
    customPartsCount: customParts,
    hasMovingMechanicalParts: hasMechanical,
    requiresRegulatoryApproval: requiresCert,
  });

  const marginPct = Math.round(((retailPrice - bomCost) / (retailPrice || 1)) * 100);

  const badgeTone: 'success' | 'warning' | 'danger' =
    assessment.level === 'Low'
      ? 'success'
      : assessment.level === 'Moderate'
        ? 'warning'
        : 'danger';

  const handleSaveScenario = () => {
    const next: SavedScenario = {
      id: `risk_${Date.now()}`,
      label: `$${retailPrice} Retail / $${bomCost} BOM · ${customParts} custom parts`,
      score: assessment.score,
      level: assessment.level,
      marginPct,
    };
    const updated = [next, ...scenarios].slice(0, 4);
    setScenarios(updated);
    try {
      localStorage.setItem('hackerland_risk_scenarios', JSON.stringify(updated));
    } catch {}
  };

  return (
    <Card className="border-hairline bg-surface-1 p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-display font-semibold text-accent-fg">
            <Zap className="size-3.5" />
            <span>Interactive Pre-Mortem Tool</span>
          </div>
          <h3 className="font-display text-headline-sm font-bold text-fg">
            Hardware Failure Risk Evaluator
          </h3>
          <p className="text-body-xs text-fg-muted">
            Benchmark your unit economics against Juicero, Theranos, and Better Place post-mortem thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge tone={badgeTone} variant="outline">
            Risk Level: {assessment.level} ({assessment.score}/100)
          </Badge>
          <Button type="button" variant="secondary" size="sm" onClick={handleSaveScenario}>
            <Bookmark className="size-3.5" />
            <span>Save Check</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="risk-retail">Target Retail Price ($)</Label>
              <Input
                id="risk-retail"
                type="number"
                min={1}
                value={retailPrice}
                onChange={(e) => setRetailPrice(Number(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="risk-bom">Estimated BOM Cost ($)</Label>
              <Input
                id="risk-bom"
                type="number"
                min={1}
                value={bomCost}
                onChange={(e) => setBomCost(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="text-body-xs text-fg-muted flex items-center justify-between px-1">
            <span>Gross Unit Margin</span>
            <span
              className={cn(
                'font-mono font-bold',
                marginPct >= 65 ? 'text-success-fg' : 'text-danger-fg',
              )}
            >
              {marginPct}% {marginPct < 65 ? '(Caution: <65% margin risk)' : '(Healthy)'}
            </span>
          </div>

          <div>
            <label className="block text-body-xs font-medium text-fg-muted mb-1">
              Custom Molds / Machined Parts ({customParts})
            </label>
            <input
              type="range"
              min={0}
              max={25}
              value={customParts}
              onChange={(e) => setCustomParts(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <span className="text-[11px] text-fg-subtle block mt-0.5">
              More than 8 custom tooling components increases scrap &amp; supply bottlenecks.
            </span>
          </div>

          <div className="pt-2 border-t border-hairline space-y-2">
            <label className="flex items-center gap-2.5 text-body-xs text-fg cursor-pointer">
              <input
                type="checkbox"
                checked={hasMechanical}
                onChange={(e) => setHasMechanical(e.target.checked)}
                className="rounded border-line accent-accent size-4"
              />
              <span>Moving mechanical actuators, gearboxes, or high-pressure valves</span>
            </label>

            <label className="flex items-center gap-2.5 text-body-xs text-fg cursor-pointer">
              <input
                type="checkbox"
                checked={requiresCert}
                onChange={(e) => setRequiresCert(e.target.checked)}
                className="rounded border-line accent-accent size-4"
              />
              <span>Requires statutory certification (FCC, CE, BIS, AIS-156, CDSCO)</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl bg-sunken p-4 border border-hairline space-y-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono font-semibold text-fg-subtle uppercase tracking-wider block">
              Automated Autopsy Diagnosis
            </span>

            {assessment.identifiedTraps.map((trap, idx) => (
              <div key={idx} className="flex items-start gap-2 text-body-xs text-danger-fg leading-relaxed">
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                <span>{trap}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-hairline space-y-2">
            <span className="text-[11px] font-mono font-semibold text-success-fg uppercase tracking-wider block">
              Preventative Measures
            </span>
            {assessment.preventativeMeasures.map((measure, idx) => (
              <div key={idx} className="flex items-start gap-2 text-body-xs text-fg leading-relaxed">
                <ShieldCheck className="size-3.5 shrink-0 text-success-fg mt-0.5" />
                <span>{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {scenarios.length > 0 && (
        <div className="pt-3 border-t border-hairline space-y-2">
          <div className="text-[11px] font-mono font-semibold uppercase text-fg-subtle">
            Saved BOM Pre-Mortem Snapshots ({scenarios.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-hairline bg-sunken px-3 py-2 text-body-xs"
              >
                <div className="min-w-0 truncate">
                  <span className="font-medium text-fg">{s.label}</span>
                  <span className="text-fg-subtle font-mono ml-1.5">
                    · {s.level} ({s.score})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = scenarios.filter((item) => item.id !== s.id);
                    setScenarios(next);
                    try {
                      localStorage.setItem('hackerland_risk_scenarios', JSON.stringify(next));
                    } catch {}
                  }}
                  aria-label="Remove snapshot"
                  className="text-fg-subtle hover:text-danger-fg shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
