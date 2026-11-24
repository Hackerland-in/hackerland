'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Cpu,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import type { TeardownCategory, TeardownPinoutAnnotation, TeardownSubsystem, TeardownBOMItem } from '@hackerland/core';
import { calculateBomMarkup } from '@hackerland/core';
import { PcbPinoutAnnotator } from './pcb-pinout-annotator';

export function TeardownSubmitStudio() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('Ultraviolette F77 Battery Management System & Inverter');
  const [manufacturer, setManufacturer] = useState('Ultraviolette Automotive (India)');
  const [deviceType, setDeviceType] = useState('High-Performance Electric Motorcycle Powertrain');
  const [category, setCategory] = useState<TeardownCategory>('ev_automotive');
  const [retailPriceInr, setRetailPriceInr] = useState<number>(380000);
  const [estimatedBomInr, setEstimatedBomInr] = useState<number>(85000);
  const [summary, setSummary] = useState(
    'Architectural autopsy of the 10.3 kWh SRB77 battery pack and dual CAN-FD telematics cluster engineered for 30kW peak power delivery.'
  );

  // Subsystems
  const [subsystems, setSubsystems] = useState<TeardownSubsystem[]>([
    {
      name: 'High-Voltage Traction BMS',
      description: 'Monitors 28 series Li-Ion cells with redundant CAN-FD transceivers and active temperature balancing.',
      chips: ['Analog Devices ADBMS6815', 'TI TMS320F280049C Piccolo MCU'],
    },
    {
      name: '3-Phase FOC Traction Inverter',
      description: 'Drives 30 kW permanent magnet synchronous motor with isolated gate drivers.',
      chips: ['Infineon CoolSiC MOSFETs', 'TI UCC21520 Isolated Gate Driver'],
    },
  ]);

  // Pinout Annotations
  const [annotations, setAnnotations] = useState<TeardownPinoutAnnotation[]>([
    {
      id: 'pin-1',
      xPercent: 45,
      yPercent: 40,
      label: 'ADBMS6815 Battery Monitor',
      subsystem: 'Traction BMS',
      partNumber: 'ADBMS6815',
      manufacturer: 'Analog Devices',
      function: 'Precision multicell battery stack monitor with isoSPI communication',
      package: '64-lead eTQFP',
      voltageRating: '100V max',
      estimatedCostUsd: 8.5,
      openSourceAlternative: 'LTC6811 breakout / OpenBMS',
    },
    {
      id: 'pin-2',
      xPercent: 68,
      yPercent: 55,
      label: 'C2000 Piccolo Real-Time MCU',
      subsystem: 'Inverter FOC',
      partNumber: 'TMS320F280049C',
      manufacturer: 'Texas Instruments',
      function: '100MHz real-time DSP with trigonometric math unit for Field Oriented Control',
      package: '64-pin QFP',
      voltageRating: '3.3V',
      estimatedCostUsd: 6.2,
      openSourceAlternative: 'STM32G474 / VESC Open Inverter',
    },
  ]);

  // BOM items
  const [bomItems, setBomItems] = useState<TeardownBOMItem[]>([
    {
      component: 'Battery Stack Monitor',
      partNumber: 'ADBMS6815',
      manufacturer: 'Analog Devices',
      function: 'Monitors up to 18 cells with <1.5mV error',
      package: 'eTQFP-64',
      estCost: '$8.50 (₹730)',
      openAlternative: 'LTC6811',
    },
  ]);

  // Lessons & Failure modes
  const [lessons, setLessons] = useState<string[]>([
    'Direct copper busbar laser-welding eliminates crimp contact resistance in high-amp EV discharge.',
    'Silicon Carbide (SiC) MOSFETs reduce switching losses by 65% compared to legacy IGBT modules.',
  ]);

  const [submitted, setSubmitted] = useState<boolean>(false);

  // Markup & Margins
  const margins = useMemo(() => {
    return calculateBomMarkup(retailPriceInr, estimatedBomInr);
  }, [retailPriceInr, estimatedBomInr]);

  const handleAddSubsystem = () => {
    setSubsystems([
      ...subsystems,
      {
        name: 'New Subsystem',
        description: 'Subsystem architectural functional block and circuit purpose.',
        chips: ['Sample MPN 1'],
      },
    ]);
  };

  const handleAddLesson = () => {
    setLessons([...lessons, 'Key design takeaway for other hardware engineers.']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-8 md:p-12 text-center space-y-6 max-w-3xl mx-auto">
        <div className="size-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
            TEARDOWN AUTOPSY SUBMITTED TO PEER REVIEW
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{title}</h2>
          <p className="text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Your chip-level autopsy and interactive pinout annotations have been recorded. You have been awarded
            <span className="text-emerald-400 font-bold font-mono"> +150 Reputation XP</span> in your Innovation Passport!
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/teardowns"
            className="px-5 py-2.5 rounded-lg bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
          >
            Explore Teardown Library
          </Link>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-white font-semibold text-xs hover:bg-neutral-700 transition-colors"
          >
            Submit Another Teardown
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-6 md:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <Compass className="size-3.5" />
          <span>Hardware Reverse Engineering & Autopsy Studio</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Submit a Hardware Teardown
        </h1>
        <p className="text-neutral-400 text-xs md:text-sm max-w-3xl leading-relaxed">
          Document the silicon chips, pinout schematics, subsystem trees, and true Bill of Materials costs of
          commercial products. Help the community design better open hardware without reinventing the wheel.
        </p>

        {/* Wizard Steps Bar */}
        <div className="grid grid-cols-4 gap-2 pt-4">
          {[
            { num: 1, label: 'Device & Margins' },
            { num: 2, label: 'Subsystems' },
            { num: 3, label: 'Pinout Annotator' },
            { num: 4, label: 'Lessons & Submit' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                currentStep === s.num
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                  : currentStep > s.num
                  ? 'border-neutral-700 bg-neutral-900 text-neutral-300'
                  : 'border-neutral-800 bg-neutral-950 text-neutral-500'
              }`}
            >
              <span className="text-[10px] font-mono block">STEP 0{s.num}</span>
              <span className="text-xs truncate block">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: DEVICE & MARGINS */}
      {currentStep === 1 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="size-4 text-emerald-400" />
            <span>Device Profile & Retail vs BOM Margins</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Teardown Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Manufacturer (Brand):</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Device Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TeardownCategory)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
              >
                <option value="ev_automotive">EV & Automotive Electronics</option>
                <option value="drones_robotics">Drones & Robotics</option>
                <option value="smart_grid_iot">Smart Grid & Industrial IoT</option>
                <option value="medical_assistive">Medical Devices & Assistive Tech</option>
                <option value="consumer_edge_ai">Consumer & Edge AI Hardware</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Device Class / Form Factor:</label>
              <input
                type="text"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          {/* Pricing & Real-Time Margin Evaluator */}
          <div className="pt-4 border-t border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Retail Price (₹ INR):</label>
                <input
                  type="number"
                  step="1000"
                  value={retailPriceInr}
                  onChange={(e) => setRetailPriceInr(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Estimated Electronics BOM (₹ INR):</label>
                <input
                  type="number"
                  step="500"
                  value={estimatedBomInr}
                  onChange={(e) => setEstimatedBomInr(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Margin Metrics Display */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-neutral-400 font-mono block">MARKUP RATIO</span>
                <span className="text-2xl font-black text-white font-mono">{margins.markupRatio}x</span>
                <span className="text-[10px] text-neutral-500 block">Retail / BOM Factor</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-mono block">EST. GROSS MARGIN</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {margins.grossMarginPercent}%
                </span>
                <span className="text-[10px] text-neutral-500 block">Standard Hardware ~60-75%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-neutral-400 font-medium">Autopsy Abstract / Summary:</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
            >
              <span>Next: Subsystems</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SUBSYSTEMS MAPPING */}
      {currentStep === 2 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="size-4 text-emerald-400" />
              <span>Subsystems & Functional Tree</span>
            </h2>
            <button
              type="button"
              onClick={handleAddSubsystem}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="size-3.5" />
              <span>Add Subsystem</span>
            </button>
          </div>

          <div className="space-y-4">
            {subsystems.map((sub, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    SUBSYSTEM #{idx + 1}
                  </span>
                  {subsystems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSubsystems(subsystems.filter((_, i) => i !== idx))}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Subsystem Name:</label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => {
                        const copy = [...subsystems];
                        copy[idx]!.name = e.target.value;
                        setSubsystems(copy);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Identified Silicon Chips (comma separated):</label>
                    <input
                      type="text"
                      value={sub.chips.join(', ')}
                      onChange={(e) => {
                        const copy = [...subsystems];
                        copy[idx]!.chips = e.target.value.split(',').map((c) => c.trim()).filter(Boolean);
                        setSubsystems(copy);
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 text-xs block mb-1">Functional Description:</label>
                  <textarea
                    rows={2}
                    value={sub.description}
                    onChange={(e) => {
                      const copy = [...subsystems];
                      copy[idx]!.description = e.target.value;
                      setSubsystems(copy);
                    }}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
            >
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
            >
              <span>Next: Visual Pinout Annotator</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VISUAL PINOUT ANNOTATOR */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <PcbPinoutAnnotator
            initialAnnotations={annotations}
            deviceTitle={title}
            allowEditing={true}
          />

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
            >
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
            >
              <span>Next: Lessons & Submit</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LESSONS & FINAL REVIEW */}
      {currentStep === 4 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-400" />
            <span>Engineering Lessons & Pre-Mortem Takeaways</span>
          </h2>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={lesson}
                  onChange={(e) => {
                    const copy = [...lessons];
                    copy[idx] = e.target.value;
                    setLessons(copy);
                  }}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs text-white"
                />
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLessons(lessons.filter((_, i) => i !== idx))}
                    className="text-neutral-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLesson}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="size-3.5" />
              <span>Add Another Engineering Lesson</span>
            </button>
          </div>

          {/* Review Summary Box */}
          <div className="rounded-xl border border-white/10 bg-neutral-950/80 p-5 space-y-3 text-xs">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">SUBMISSION SUMMARY</span>
            <div className="flex justify-between">
              <span className="text-neutral-400">Device:</span>
              <span className="font-bold text-white">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Manufacturer & Class:</span>
              <span className="text-white">{manufacturer} ({deviceType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Gross Margin Evaluation:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {margins.grossMarginPercent}% ({margins.markupRatio}x Markup)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Subsystems Analyzed:</span>
              <span className="text-white font-mono">{subsystems.length} Functional Blocks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Reputation Reward:</span>
              <span className="text-emerald-400 font-bold font-mono">+150 XP</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
            >
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Publish Hardware Teardown (+150 XP)</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
