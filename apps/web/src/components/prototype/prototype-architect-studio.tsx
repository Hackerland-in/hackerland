'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Cpu,
  Layers,
  DollarSign,
  Users,
  Calendar,
  Zap,
  CheckCircle2,
  Copy,
  Bookmark,
  Trash2,
} from 'lucide-react';
import { Badge, Button, Card, Input, cn } from '@hackerland/ui';
import type { PrototypeArchitecturePlan, PrototypeBlockCategory } from '@hackerland/core';
import { PROTOTYPE_PRESETS, synthesizePrototypePlan } from '@/lib/data/prototype-data';

export function PrototypeArchitectStudio() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PROTOTYPE_PRESETS[0]!.id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<PrototypeArchitecturePlan>(PROTOTYPE_PRESETS[0]!);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedPlans, setSavedPlans] = useState<PrototypeArchitecturePlan[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackerland_proto_plans');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSavedPlans(parsed);
      }
    } catch {}
  }, []);

  const handleSelectPreset = (plan: PrototypeArchitecturePlan) => {
    setSelectedPresetId(plan.id);
    setCurrentPlan(plan);
    setCustomPrompt('');
  };

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    const synthesized = synthesizePrototypePlan(customPrompt);
    setSelectedPresetId(synthesized.id);
    setCurrentPlan(synthesized);
  };

  const handleSavePlan = () => {
    const exists = savedPlans.some((p) => p.ideaTitle === currentPlan.ideaTitle);
    if (exists) return;
    const updated = [currentPlan, ...savedPlans].slice(0, 5);
    setSavedPlans(updated);
    try {
      localStorage.setItem('hackerland_proto_plans', JSON.stringify(updated));
    } catch {}
  };

  const handleRemoveSaved = (title: string) => {
    const updated = savedPlans.filter((p) => p.ideaTitle !== title);
    setSavedPlans(updated);
    try {
      localStorage.setItem('hackerland_proto_plans', JSON.stringify(updated));
    } catch {}
  };

  const getCategoryTone = (cat: PrototypeBlockCategory): 'accent' | 'code' | 'make' | 'earn' | 'danger' => {
    switch (cat) {
      case 'Power':
        return 'earn';
      case 'Compute':
        return 'code';
      case 'Sensing':
        return 'make';
      case 'Connectivity':
        return 'accent';
      case 'Actuation':
        return 'danger';
    }
  };

  const handleCopySpec = () => {
    const text = `PROTOTYPE ARCHITECTURE SPECIFICATION: ${currentPlan.ideaTitle}
Domain: ${currentPlan.domain}
Target Form Factor: ${currentPlan.targetFormFactor}
Estimated Prototype Cost: ₹${currentPlan.estimatedTotalProtoCost.inr} ($${currentPlan.estimatedTotalProtoCost.usd})

SYSTEM BLOCKS:
${currentPlan.systemBlocks.map((b) => `• [${b.category}] ${b.name}: ${b.icChoice} (${b.function})`).join('\n')}

PINOUT MAPPING:
${currentPlan.pinoutMapping.map((p) => `• ${p.pin} [${p.protocol}] -> ${p.label} (${p.connectedTo})`).join('\n')}

BILL OF MATERIALS:
${currentPlan.bom.map((i) => `• ${i.component}: ${i.partNumber} (${i.footprint}) - ₹${i.estCostInr} / $${i.estCostUsd}`).join('\n')}

Synthesized by Hackerland Prototype Simulator: https://www.hackerland.in/prototype
`;
    try {
      navigator.clipboard?.writeText(text);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAlreadySaved = savedPlans.some((p) => p.ideaTitle === currentPlan.ideaTitle);

  return (
    <div className="space-y-6 min-w-0">
      {/* Step 1 Selector */}
      <Card className="border-hairline bg-surface-1 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-semibold text-accent-fg uppercase tracking-wider block">
              Step 1: Choose a Concept or Type Any Idea
            </span>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Instant Hardware Architecture Synthesizer
            </h2>
          </div>

          <div className="inline-flex rounded-full bg-sunken border border-hairline p-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-display font-semibold transition',
                currency === 'INR' ? 'bg-accent text-on-solid' : 'text-fg-muted hover:text-fg',
              )}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-display font-semibold transition',
                currency === 'USD' ? 'bg-accent text-on-solid' : 'text-fg-muted hover:text-fg',
              )}
            >
              $ USD
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROTOTYPE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 border',
                  isSelected
                    ? 'bg-accent-soft text-accent-fg border-accent font-semibold'
                    : 'bg-sunken text-fg-muted border-hairline hover:border-accent/40 hover:text-fg',
                )}
              >
                <Zap className="size-3.5 text-accent shrink-0" />
                <span className="truncate max-w-[220px]">{preset.ideaTitle}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSynthesize} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-hairline">
          <Input
            type="text"
            placeholder="Describe any hardware idea (e.g. 'LoRa GPS cattle tracker' or 'Sub-100ms BLDC gimbal')..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" size="md" className="shrink-0">
            <Sparkles className="size-4" />
            <span>Synthesize Architecture</span>
          </Button>
        </form>

        {savedPlans.length > 0 && (
          <div className="pt-2 border-t border-hairline space-y-2">
            <span className="text-[11px] font-mono uppercase text-fg-subtle font-semibold">
              Saved Architecture Blueprints ({savedPlans.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {savedPlans.map((sp) => (
                <div
                  key={sp.ideaTitle}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-sunken px-3 py-1 text-body-xs"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(sp)}
                    className="font-medium text-fg hover:text-accent-fg truncate max-w-[200px]"
                  >
                    {sp.ideaTitle}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSaved(sp.ideaTitle)}
                    aria-label={`Remove ${sp.ideaTitle}`}
                    className="text-fg-subtle hover:text-danger-fg"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Architecture Overview Header */}
      <Card className="border-accent/25 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent" variant="outline">{currentPlan.domain}</Badge>
              <span className="text-body-xs text-fg-subtle font-mono">
                Form: {currentPlan.targetFormFactor}
              </span>
            </div>
            <h2 className="font-display text-headline-md font-bold text-fg">
              {currentPlan.ideaTitle}
            </h2>
            <p className="text-body-sm text-fg-muted leading-relaxed">{currentPlan.summary}</p>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-1 p-4 text-center shrink-0 min-w-[180px]">
            <span className="text-[11px] font-mono text-fg-subtle block">Est. 1-Unit Proto Cost</span>
            <div className="font-display text-headline-md font-bold text-accent-fg mt-0.5">
              {currency === 'INR'
                ? `₹${currentPlan.estimatedTotalProtoCost.inr.toLocaleString('en-IN')}`
                : `$${currentPlan.estimatedTotalProtoCost.usd}`}
            </div>
            <span className="text-[11px] text-fg-subtle block">BOM + 2-Layer PCB fab</span>
          </div>
        </div>

        <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="primary" size="sm">
              <Link href="/manufacturing/pcb">
                <Cpu className="size-3.5" />
                <span>Open in PCB Studio</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/manufacturing/rfq">
                <Layers className="size-3.5 text-accent" />
                <span>Get Indian Fab Quotes</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/earn">
                <Users className="size-3.5 text-accent" />
                <span>Recruit Squad</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={isAlreadySaved ? 'soft' : 'secondary'}
              size="sm"
              onClick={handleSavePlan}
            >
              <Bookmark className={cn('size-3.5', isAlreadySaved && 'fill-current')} />
              <span>{isAlreadySaved ? 'Saved Blueprint' : 'Save Blueprint'}</span>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleCopySpec}>
              {copied ? (
                <>
                  <CheckCircle2 className="size-3.5 text-success-fg" />
                  <span>Copied Spec!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Export Spec (.txt)</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Blocks + Pinouts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
              <Cpu className="size-4 text-accent" />
              <span>1. System Topology Blocks</span>
            </h3>
            <span className="text-body-xs text-fg-subtle font-mono">
              {currentPlan.systemBlocks.length} blocks
            </span>
          </div>

          <div className="space-y-2.5">
            {currentPlan.systemBlocks.map((block) => (
              <Card key={block.name} className="border-hairline bg-surface-1 p-4 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge tone={getCategoryTone(block.category)} variant="outline">
                    {block.category}
                  </Badge>
                  <span className="text-body-xs font-mono font-semibold text-accent-fg">
                    {block.icChoice}
                  </span>
                </div>
                <h4 className="font-display text-body-sm font-bold text-fg">{block.name}</h4>
                <p className="text-body-xs text-fg-muted leading-relaxed">{block.function}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
              <Zap className="size-4 text-accent" />
              <span>2. MCU Pinout Matrix</span>
            </h3>
            <span className="text-body-xs text-fg-subtle font-mono">
              {currentPlan.pinoutMapping.length} pins
            </span>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface-1 overflow-x-auto">
            <table className="w-full text-left text-body-xs">
              <thead className="border-b border-hairline bg-sunken text-fg-subtle font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Pin</th>
                  <th className="py-2.5 px-3">Protocol</th>
                  <th className="py-2.5 px-3">Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono">
                {currentPlan.pinoutMapping.map((pin) => (
                  <tr key={pin.pin}>
                    <td className="py-2.5 px-3 font-bold text-accent-fg">{pin.pin}</td>
                    <td className="py-2.5 px-3">
                      <Badge tone="neutral" variant="outline">{pin.protocol}</Badge>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-fg-muted">{pin.connectedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOM Cost Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
            <DollarSign className="size-4 text-accent" />
            <span>3. Bill of Materials (BOM)</span>
          </h3>
          <span className="text-body-xs text-fg-subtle font-mono">
            {currentPlan.bom.length} Line Items
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-hairline bg-surface-1">
          <table className="w-full text-left text-body-xs">
            <thead className="border-b border-hairline bg-sunken text-fg-subtle font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Part Number</th>
                <th className="py-2.5 px-4">Footprint</th>
                <th className="py-2.5 px-4">Est. Cost</th>
                <th className="py-2.5 px-4">Distributor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {currentPlan.bom.map((item) => (
                <tr key={item.partNumber}>
                  <td className="py-3 px-4 font-semibold text-fg">{item.component}</td>
                  <td className="py-3 px-4 font-mono text-accent-fg font-semibold">{item.partNumber}</td>
                  <td className="py-3 px-4 font-mono text-fg-muted">{item.footprint}</td>
                  <td className="py-3 px-4 font-bold text-fg whitespace-nowrap">
                    {currency === 'INR' ? `₹${item.estCostInr}` : `$${item.estCostUsd.toFixed(2)}`}
                  </td>
                  <td className="py-3 px-4 text-fg-muted">{item.distributor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Squad + Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-hairline bg-surface-1 p-5 space-y-3">
          <h3 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
            <Users className="size-4 text-accent" />
            <span>4. Required Squad Roles</span>
          </h3>
          <div className="space-y-2.5">
            {currentPlan.requiredSkills.map((role) => (
              <div key={role.role} className="rounded-xl bg-sunken p-3.5 border border-hairline space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-fg text-body-xs">{role.role}</span>
                  <Badge tone="accent" variant="outline">~{role.estimatedHours} hrs</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-surface-1 border border-hairline text-fg-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-hairline bg-surface-1 p-5 space-y-3">
          <h3 className="font-display text-body-lg font-bold text-fg flex items-center gap-2">
            <Calendar className="size-4 text-accent" />
            <span>5. 4-Stage Build Roadmap</span>
          </h3>
          <div className="space-y-2.5">
            {currentPlan.milestones.map((m) => (
              <div key={m.phase} className="rounded-xl bg-sunken p-3.5 border border-hairline space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-fg text-body-xs">{m.phase}</span>
                  <Badge tone="code" variant="outline">{m.durationWeeks} Weeks</Badge>
                </div>
                <ul className="text-body-xs text-fg-muted space-y-0.5">
                  {m.deliverables.map((del) => (
                    <li key={del} className="flex items-start gap-1.5">
                      <span className="text-accent font-bold">✓</span>
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
