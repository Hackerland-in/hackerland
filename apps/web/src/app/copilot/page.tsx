import type { Metadata } from 'next';
import { StatTile } from '@hackerland/ui';
import { Cpu, Calculator, ShieldAlert, Sparkles } from 'lucide-react';
import { HardwareCopilotStudio } from '@/components/copilot/hardware-copilot-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'AI Hardware Co-Pilot & Sourcing Assistant · Hackerland',
  description:
    'In-browser hardware engineering co-pilot with IPC-2152 trace sizing, SMPS buck calculators, domestic Indian component sourcing, and BOM obsolescence scrubbers.',
};

export default function CopilotPage() {
  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Intelligent Hardware Workbench</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            AI Hardware Co-Pilot &amp; Sourcing Assistant
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-2xl leading-relaxed">
            Calculate IPC-2152 trace widths, size SMPS buck inductor filters, audit BOM supply bottlenecks, and discover pin-compatible drop-in ICs across Indian distributors.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 min-w-0">
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
            hint="Physics-grounded advice"
            tone="code"
            icon={<Sparkles className="size-4" />}
          />
        </div>

        <HardwareCopilotStudio />
      </SocialShell>
    </SocialCommunityProvider>
  );
}
