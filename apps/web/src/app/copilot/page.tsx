import type { Metadata } from 'next';
import { SectionHeader, StatTile } from '@hackerland/ui';
import { Cpu, Calculator, ShieldAlert, Sparkles } from 'lucide-react';
import { HardwareCopilotStudio } from '@/components/copilot/hardware-copilot-studio';

export const metadata: Metadata = {
  title: 'AI Hardware Co-Pilot & Sourcing Assistant · Hackerland',
  description:
    'In-browser hardware engineering co-pilot with IPC-2152 trace sizing, SMPS buck calculators, domestic Indian component sourcing, and BOM obsolescence scrubbers.',
};

export default function CopilotPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="INTELLIGENT HARDWARE WORKBENCH"
        title="AI Hardware Co-Pilot & Sourcing Assistant"
        description="Accelerate hardware prototyping from schematic to production. Calculate IPC-2152 trace widths, size SMPS buck inductor filters, audit BOM supply chain bottlenecks, and discover pin-compatible drop-in chips across domestic Indian distributors."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-w-0">
        <StatTile
          label="DOMESTIC ICS INDEXED"
          value="45,000+"
          hint="Robu, Element14 & KitsnSpares"
          tone="accent"
          icon={<Cpu className="size-4" />}
        />
        <StatTile
          label="ENGINEERING CALCULATORS"
          value="IPC-2152"
          hint="Ampacity, SMPS & Thermal"
          tone="make"
          icon={<Calculator className="size-4" />}
        />
        <StatTile
          label="BOM AUDIT MODELS"
          value="Zero EOL"
          hint="Single-source & NRND detection"
          tone="learn"
          icon={<ShieldAlert className="size-4" />}
        />
        <StatTile
          label="AI COPILOT TERMINAL"
          value="Instant"
          hint="Physics-grounded design advice"
          tone="code"
          icon={<Sparkles className="size-4" />}
        />
      </div>

      {/* Main Studio */}
      <HardwareCopilotStudio />
    </div>
  );
}
