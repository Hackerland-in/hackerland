import type { Metadata } from 'next';
import { StatTile } from '@hackerland/ui';
import { Cpu, Calculator, ShieldAlert, Sparkles } from 'lucide-react';
import { HardwareCopilotStudio } from '@/components/copilot/hardware-copilot-studio';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { FullScreenLabShell } from '@/components/labs/full-screen-lab-shell';

export const metadata: Metadata = {
  title: 'AI Hardware Co-Pilot & Sourcing Assistant · Hackerland',
  description:
    'In-browser hardware engineering co-pilot with IPC-2152 trace sizing, SMPS buck calculators, domestic Indian component sourcing, and BOM obsolescence scrubbers.',
};

export default function CopilotPage() {
  return (
    <SocialCommunityProvider>
      <FullScreenLabShell
        labKind="copilot"
        title="AI Hardware Co-Pilot & Sourcing Assistant"
        subtitle="IPC-2152 trace width sizing, SMPS buck filters, Indian distributor stock & BOM audits"
        category="Hardware Intelligence"
        badge="IPC-2152 · BOM Scrubber"
        currentRoute="/copilot"
      >
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
      </FullScreenLabShell>
    </SocialCommunityProvider>
  );
}
