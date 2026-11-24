'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import type { PrototypeArchitecturePlan, PrototypeBlockCategory } from '@hackerland/core';
import { PROTOTYPE_PRESETS, synthesizePrototypePlan } from '@/lib/data/prototype-data';

export function PrototypeArchitectStudio() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PROTOTYPE_PRESETS[0]!.id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<PrototypeArchitecturePlan>(PROTOTYPE_PRESETS[0]!);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [copied, setCopied] = useState<boolean>(false);

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

  const getCategoryColor = (cat: PrototypeBlockCategory) => {
    switch (cat) {
      case 'Power':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Compute':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Sensing':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Connectivity':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Actuation':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
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
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Interactive Prompt & Preset Selector */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Step 1: Choose a Concept or Enter Custom Hardware Idea
            </span>
            <h2 className="text-xl font-bold text-white">Instant Hardware Architecture Synthesizer</h2>
          </div>

          {/* Currency Toggle */}
          <div className="flex rounded-lg bg-neutral-950 border border-neutral-800 p-0.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                currency === 'INR' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                currency === 'USD' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Quick Reference Presets */}
        <div className="flex flex-wrap gap-2">
          {PROTOTYPE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition text-left flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[220px]">{preset.ideaTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Synthesis Prompt */}
        <form onSubmit={handleSynthesize} className="flex gap-2 pt-2 border-t border-neutral-800">
          <input
            type="text"
            placeholder="Or type any hardware idea (e.g. 'LoRa GPS cattle tracker' or 'Sub-100ms BLDC gimbal')..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/10"
          >
            <Sparkles className="w-4 h-4" /> Synthesize Architecture
          </button>
        </form>
      </div>

      {/* Generated Architecture Blueprint Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-neutral-900 to-black p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {currentPlan.domain}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Target Form: {currentPlan.targetFormFactor}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {currentPlan.ideaTitle}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
              {currentPlan.summary}
            </p>
          </div>

          {/* Prototype Cost Summary Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-center shrink-0 min-w-[200px]">
            <span className="text-xs text-neutral-400 block mb-0.5">Estimated 1-Unit Prototype Cost</span>
            <div className="text-2xl font-black text-emerald-400">
              {currency === 'INR'
                ? `₹${currentPlan.estimatedTotalProtoCost.inr.toLocaleString('en-IN')}`
                : `$${currentPlan.estimatedTotalProtoCost.usd}`}
            </div>
            <span className="text-[11px] text-neutral-500 block mt-0.5">BOM + 2-Layer PCB fab</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/manufacturing/pcb"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" /> Open in PCB Studio
            </Link>
            <Link
              href="/manufacturing/rfq"
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-neutral-700"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Get Indian Fab Quotes
            </Link>
            <Link
              href="/earn"
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-neutral-700"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Recruit Squad for This
            </Link>
          </div>

          <button
            type="button"
            onClick={handleCopySpec}
            className="px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition flex items-center gap-1.5 border border-neutral-800"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied Specification!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Export Architecture Spec (.txt)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: System Blocks & Pinout Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* System Topology Blocks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> 1. System Topology & Functional Blocks
            </h3>
            <span className="text-xs text-neutral-500">{currentPlan.systemBlocks.length} Integrated Blocks</span>
          </div>

          <div className="space-y-3">
            {currentPlan.systemBlocks.map((block) => (
              <div
                key={block.name}
                className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-2 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider ${getCategoryColor(block.category)}`}>
                    {block.category}
                  </span>
                  <span className="text-xs font-mono font-medium text-emerald-300">
                    {block.icChoice}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{block.name}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{block.function}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pinout & Interconnect Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> 2. MCU Pinout & Protocol Matrix
            </h3>
            <span className="text-xs text-neutral-500">{currentPlan.pinoutMapping.length} Pins</span>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Pin</th>
                  <th className="py-2.5 px-3">Bus / Protocol</th>
                  <th className="py-2.5 px-3">Interconnect Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono">
                {currentPlan.pinoutMapping.map((pin) => (
                  <tr key={pin.pin} className="hover:bg-neutral-900/40">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{pin.pin}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                        {pin.protocol}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-neutral-300 font-sans">{pin.connectedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bill of Materials (BOM) Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> 3. Bill of Materials (BOM) Cost Breakdown
          </h3>
          <span className="text-xs text-neutral-400">Total: {currentPlan.bom.length} Line Items</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Component Subsystem</th>
                <th className="py-2.5 px-4">Part Number</th>
                <th className="py-2.5 px-4">Package / Footprint</th>
                <th className="py-2.5 px-4">Est. Cost</th>
                <th className="py-2.5 px-4">Recommended Distributor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {currentPlan.bom.map((item) => (
                <tr key={item.partNumber} className="hover:bg-neutral-900/40">
                  <td className="py-3 px-4 font-semibold text-white">{item.component}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">{item.partNumber}</td>
                  <td className="py-3 px-4 font-mono text-neutral-400">{item.footprint}</td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {currency === 'INR' ? `₹${item.estCostInr}` : `$${item.estCostUsd.toFixed(2)}`}
                  </td>
                  <td className="py-3 px-4 text-neutral-400">{item.distributor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Squad Roles & Development Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Skills & Squad Roster */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" /> 4. Required Squad Roles & Skill Sets
          </h3>

          <div className="space-y-3">
            {currentPlan.requiredSkills.map((role) => (
              <div key={role.role} className="rounded-xl bg-neutral-950 p-3.5 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{role.role}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 font-mono border border-cyan-500/30">
                    ~{role.estimatedHours} hrs
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((skill) => (
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Milestones */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" /> 5. Recommended 4-Stage Development Roadmap
          </h3>

          <div className="space-y-3">
            {currentPlan.milestones.map((m) => (
              <div key={m.phase} className="rounded-xl bg-neutral-950 p-3.5 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{m.phase}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 font-mono border border-purple-500/30">
                    {m.durationWeeks} Weeks
                  </span>
                </div>
                <ul className="text-xs text-neutral-400 space-y-0.5">
                  {m.deliverables.map((del) => (
                    <li key={del} className="flex items-center gap-1.5">
                      <span className="text-purple-400">✓</span> {del}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
