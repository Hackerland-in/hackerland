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
import type { TeardownCategory, TeardownPinoutAnnotation, TeardownSubsystem } from '@hackerland/core';
import { calculateBomMarkup } from '@hackerland/core';
import { Button } from '@hackerland/ui';
import { getActiveBuilderIdentity } from '@/lib/builder-identity';
import { PcbPinoutAnnotator } from './pcb-pinout-annotator';

export function TeardownSubmitStudio() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [title, setTitle] = useState('Ultraviolette F77 Battery Management System & Inverter');
  const [manufacturer, setManufacturer] = useState('Ultraviolette Automotive (India)');
  const [deviceType, setDeviceType] = useState('High-Performance Electric Motorcycle Powertrain');
  const [category, setCategory] = useState<TeardownCategory>('ev_automotive');
  const [retailPriceInr, setRetailPriceInr] = useState<number>(380000);
  const [estimatedBomInr, setEstimatedBomInr] = useState<number>(85000);
  const [summary, setSummary] = useState(
    'Architectural autopsy of the 10.3 kWh SRB77 battery pack and dual CAN-FD telematics cluster engineered for 30kW peak power delivery.',
  );

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

  const [annotations] = useState<TeardownPinoutAnnotation[]>([
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

  const [lessons, setLessons] = useState<string[]>([
    'Direct copper busbar laser-welding eliminates crimp contact resistance in high-amp EV discharge.',
    'Silicon Carbide (SiC) MOSFETs reduce switching losses by 65% compared to legacy IGBT modules.',
  ]);

  const [submitted, setSubmitted] = useState<boolean>(false);

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
    const identity = getActiveBuilderIdentity();
    if (typeof fetch === 'function') {
      void fetch('/api/workbenches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'teardown',
          slugOrRoute: '/teardowns/submit',
          title,
          summary,
          ownerHandle: identity.handle,
          ownerName: identity.name,
          tags: ['teardown', category],
          payload: {
            title,
            manufacturer,
            deviceType,
            category,
            retailPriceInr,
            estimatedBomInr,
            margins,
            subsystems,
            annotations,
            lessons,
          },
          publishToFeed: true,
        }),
      }).catch(() => {});
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-success/35 bg-success/10 p-8 md:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-xs">
        <div className="size-16 rounded-2xl bg-success/15 border border-success/35 flex items-center justify-center mx-auto text-success-fg">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase font-bold text-success-fg tracking-wider">
            TEARDOWN AUTOPSY PUBLISHED
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-fg">{title}</h2>
          <p className="text-sm text-fg-muted max-w-xl mx-auto leading-relaxed">
            Your chip-level autopsy and interactive pinout annotations have been saved to the workspace archive and shared to the community stream. Earned{' '}
            <span className="text-accent-fg font-bold font-mono">+150 Reputation XP</span>!
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="primary" size="md">
            <Link href="/teardowns">Explore Teardown Library</Link>
          </Button>
          <Button type="button" variant="secondary" size="md" onClick={() => setSubmitted(false)}>
            Submit Another Teardown
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-6 md:p-7 space-y-3 shadow-xs">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-fg">
          <Compass className="size-3.5" />
          <span>Hardware Reverse Engineering &amp; Autopsy Studio</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
          Submit a Hardware Teardown
        </h1>
        <p className="text-fg-muted text-xs md:text-sm max-w-3xl leading-relaxed">
          Document silicon chips, pinout schematics, subsystem trees, and true Bill of Materials costs of commercial products to accelerate open-source alternatives.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
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
              className={`p-2.5 rounded-xl border text-left transition-all ${
                currentStep === s.num
                  ? 'border-accent bg-accent text-on-solid font-bold shadow-xs'
                  : currentStep > s.num
                  ? 'border-accent/30 bg-accent-soft text-fg'
                  : 'border-hairline bg-surface-1 text-fg-muted hover:border-accent/35'
              }`}
            >
              <span className="text-[10px] font-mono block opacity-80">STEP 0{s.num}</span>
              <span className="text-xs truncate block">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-6 shadow-xs">
          <h2 className="font-display text-base font-bold text-fg flex items-center gap-2">
            <Cpu className="size-4 text-accent" />
            <span>Device Profile &amp; Retail vs BOM Margins</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-fg-muted font-semibold">Teardown Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-sunken border border-line rounded-xl p-2.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-fg-muted font-semibold">Manufacturer (Brand):</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-sunken border border-line rounded-xl p-2.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-fg-muted font-semibold">Device Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TeardownCategory)}
                className="w-full bg-sunken border border-line rounded-xl p-2.5 text-fg focus:border-accent focus:outline-none"
              >
                <option value="ev_automotive">EV &amp; Automotive Electronics</option>
                <option value="drones_robotics">Drones &amp; Robotics</option>
                <option value="smart_grid_iot">Smart Grid &amp; Industrial IoT</option>
                <option value="medical_assistive">Medical Devices &amp; Assistive Tech</option>
                <option value="consumer_edge_ai">Consumer &amp; Edge AI Hardware</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-fg-muted font-semibold">Device Class / Form Factor:</label>
              <input
                type="text"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full bg-sunken border border-line rounded-xl p-2.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-hairline space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-fg-muted font-semibold text-xs">Retail Price (₹ INR):</label>
                <input
                  type="number"
                  step="1000"
                  value={retailPriceInr}
                  onChange={(e) => setRetailPriceInr(Number(e.target.value))}
                  className="w-full bg-sunken border border-line rounded-xl p-2.5 text-fg font-mono text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-fg-muted font-semibold text-xs">Estimated Electronics BOM (₹ INR):</label>
                <input
                  type="number"
                  step="500"
                  value={estimatedBomInr}
                  onChange={(e) => setEstimatedBomInr(Number(e.target.value))}
                  className="w-full bg-sunken border border-line rounded-xl p-2.5 text-fg font-mono text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-accent/25 bg-accent-soft/60 p-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-fg-muted font-mono block">MARKUP RATIO</span>
                <span className="text-2xl font-black text-fg font-mono">{margins.markupRatio}x</span>
                <span className="text-[10px] text-fg-subtle block">Retail / BOM Factor</span>
              </div>
              <div>
                <span className="text-xs text-fg-muted font-mono block">EST. GROSS MARGIN</span>
                <span className="text-2xl font-black text-accent-fg font-mono">
                  {margins.grossMarginPercent}%
                </span>
                <span className="text-[10px] text-fg-subtle block">Standard Hardware ~60-75%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-fg-muted font-semibold text-xs">Autopsy Abstract / Summary:</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-sunken border border-line rounded-xl p-2.5 text-xs text-fg focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" variant="primary" size="sm" onClick={() => setCurrentStep(2)}>
              <span>Next: Subsystems</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-fg flex items-center gap-2">
              <Layers className="size-4 text-accent" />
              <span>Subsystems &amp; Functional Tree</span>
            </h2>
            <button
              type="button"
              onClick={handleAddSubsystem}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-fg hover:underline"
            >
              <Plus className="size-3.5" />
              <span>Add Subsystem</span>
            </button>
          </div>

          <div className="space-y-4">
            {subsystems.map((sub, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-hairline bg-sunken/70 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-accent-fg">
                    SUBSYSTEM #{idx + 1}
                  </span>
                  {subsystems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSubsystems(subsystems.filter((_, i) => i !== idx))}
                      className="text-fg-subtle hover:text-danger-fg p-1"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-fg-muted font-semibold block mb-1">Subsystem Name:</label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => {
                        const copy = [...subsystems];
                        copy[idx]!.name = e.target.value;
                        setSubsystems(copy);
                      }}
                      className="w-full bg-surface-1 border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-fg-muted font-semibold block mb-1">Identified Silicon Chips (comma separated):</label>
                    <input
                      type="text"
                      value={sub.chips.join(', ')}
                      onChange={(e) => {
                        const copy = [...subsystems];
                        copy[idx]!.chips = e.target.value.split(',').map((c) => c.trim()).filter(Boolean);
                        setSubsystems(copy);
                      }}
                      className="w-full bg-surface-1 border border-line rounded-lg px-2.5 py-1.5 text-fg font-mono focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-fg-muted font-semibold text-xs block mb-1">Functional Description:</label>
                  <textarea
                    rows={2}
                    value={sub.description}
                    onChange={(e) => {
                      const copy = [...subsystems];
                      copy[idx]!.description = e.target.value;
                      setSubsystems(copy);
                    }}
                    className="w-full bg-surface-1 border border-line rounded-lg px-2.5 py-1.5 text-xs text-fg focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-hairline">
            <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={() => setCurrentStep(3)}>
              <span>Next: Visual Pinout Annotator</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <PcbPinoutAnnotator
            initialAnnotations={annotations}
            deviceTitle={title}
            allowEditing={true}
          />

          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={() => setCurrentStep(4)}>
              <span>Next: Lessons &amp; Submit</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-6 shadow-xs">
          <h2 className="font-display text-base font-bold text-fg flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            <span>Engineering Lessons &amp; Pre-Mortem Takeaways</span>
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
                  className="flex-1 bg-sunken border border-line rounded-xl p-2.5 text-xs text-fg focus:border-accent focus:outline-none"
                />
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLessons(lessons.filter((_, i) => i !== idx))}
                    className="text-fg-subtle hover:text-danger-fg p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLesson}
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-fg hover:underline"
            >
              <Plus className="size-3.5" />
              <span>Add Another Engineering Lesson</span>
            </button>
          </div>

          <div className="rounded-xl border border-hairline bg-sunken p-5 space-y-2.5 text-xs">
            <span className="text-[10px] font-mono text-fg-subtle uppercase font-semibold block">
              SUBMISSION SUMMARY
            </span>
            <div className="flex justify-between">
              <span className="text-fg-muted">Device:</span>
              <span className="font-bold text-fg">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Manufacturer &amp; Class:</span>
              <span className="text-fg">{manufacturer} ({deviceType})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Gross Margin Evaluation:</span>
              <span className="text-success-fg font-bold font-mono">
                {margins.grossMarginPercent}% ({margins.markupRatio}x Markup)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Subsystems Analyzed:</span>
              <span className="text-fg font-mono">{subsystems.length} Functional Blocks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Reputation Reward:</span>
              <span className="text-accent-fg font-bold font-mono">+150 XP</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-hairline">
            <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
              <ChevronLeft className="size-4" />
              <span>Back</span>
            </Button>
            <Button type="button" variant="primary" size="md" onClick={handleSubmit}>
              <span>Publish Hardware Teardown (+150 XP)</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
