'use client';

import React from 'react';
import { StudioBreadcrumb } from '@/components/manufacturing/studio-breadcrumb';
import { PcbStudio } from '@/components/manufacturing/pcb/pcb-studio';
import { Badge, Card } from '@hackerland/ui';
import { Layers, Zap, Download } from 'lucide-react';

export default function PcbStudioPage() {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      {/* 1. STUDIO BREADCRUMB */}
      <StudioBreadcrumb
        title="A-Z PCB Design & Real-Time Circuit Studio"
        category="Hardware & Electronics"
        badge="Real-Time SPICE"
        activeId="pcb"
      />

      {/* 2. MAIN INTERACTIVE STUDIO */}
      <section className="border-b border-hairline bg-slate-950">
        <PcbStudio />
      </section>

      {/* 3. TECHNICAL DOCUMENTATION & CAPABILITIES */}
      <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-accent border-accent/30 font-mono">
            Full-Stack Electronic Design Automation (EDA)
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            From Stripboard Breadboarding to Multi-Layer Production PCB
          </h2>
          <p className="text-fg-subtle text-sm sm:text-base leading-relaxed">
            Hackerland PCB Studio bridges the gap between hands-on hardware hacking and industrial electronics manufacturing.
            Test circuits live with real-time nodal analysis, slice stripboard copper strips with interactive track breaks,
            inspect boards in 3D WebGL, and export one-click RS-274X Gerbers for JLCPCB, PCBWay, and NextPCB.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-surface-1 border-hairline space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="size-5" />
            </div>
            <h3 className="font-display font-bold text-base text-fg">Live Circuit Simulation Engine</h3>
            <p className="text-xs text-fg-subtle leading-relaxed">
              Components aren&apos;t just passive graphics—they work! Push buttons close switches, potentiometers divide voltages,
              NE555 timers oscillate square waves, LEDs glow with radial light gradients proportional to forward current,
              and our live 2-channel oscilloscope graphs real-time waveforms.
            </p>
          </Card>

          <Card className="p-6 bg-surface-1 border-hairline space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Layers className="size-5" />
            </div>
            <h3 className="font-display font-bold text-base text-fg">Multi-Substrate Prototyping</h3>
            <p className="text-xs text-fg-subtle leading-relaxed">
              Toggle between three physical substrate modes: <strong>FR4 Multi-Layer PCB</strong> with Top/Bottom copper routing,
              <strong>Veroboard (Stripboard)</strong> with 2.54mm hole pitch and interactive track cutter tool,
              or <strong>Solderless Breadboard</strong> with dual power rails and 5-pin tie points.
            </p>
          </Card>

          <Card className="p-6 bg-surface-1 border-hairline space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Download className="size-5" />
            </div>
            <h3 className="font-display font-bold text-base text-fg">Fab-Ready Manufacturing Exports</h3>
            <p className="text-xs text-fg-subtle leading-relaxed">
              Automated generation of industrial RS-274X Gerber files (Top Copper, Bottom Copper, Top Silkscreen, Board Outline),
              Excellon NC Drill files (.DRL), Bill of Materials (BOM) CSV, and Pick & Place Centroid (CPL) for automated SMT assembly.
            </p>
          </Card>
        </div>

        {/* Component Catalog Breakdown */}
        <div className="bg-surface-1 rounded-2xl border border-hairline p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div>
              <h3 className="text-lg font-bold font-display">Supported Electronic Components Catalog</h3>
              <p className="text-xs text-fg-subtle">
                Standard footprints, pinouts, and mathematical simulation parameters included
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              20+ Built-in Parts
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline/80 space-y-1">
              <div className="font-bold text-accent">Passives</div>
              <div className="text-fg-subtle">Resistors (100Ω - 100kΩ)</div>
              <div className="text-fg-subtle">Capacitors (Ceramic & Can)</div>
              <div className="text-fg-subtle">10kΩ Potentiometers</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline/80 space-y-1">
              <div className="font-bold text-accent">Semiconductors</div>
              <div className="text-fg-subtle">Radiant LEDs (Red, Green, Blue)</div>
              <div className="text-fg-subtle">1N4007 Rectifier & Zener</div>
              <div className="text-fg-subtle">2N2222 NPN & 2N3906 PNP</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline/80 space-y-1">
              <div className="font-bold text-accent">Integrated Circuits</div>
              <div className="text-fg-subtle">NE555 Precision Timer</div>
              <div className="text-fg-subtle">LM358 Dual Op-Amp</div>
              <div className="text-fg-subtle">LM7805 5V Regulator</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/60 border border-hairline/80 space-y-1">
              <div className="font-bold text-accent">Sensors & Electro</div>
              <div className="text-fg-subtle">GL5528 Photoresistor (LDR)</div>
              <div className="text-fg-subtle">Tactile Buttons & SPST Switches</div>
              <div className="text-fg-subtle">Active Piezo Buzzers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
