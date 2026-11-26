import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState, FilterChip, StatTile } from '@hackerland/ui';
import { Cpu, Layers, MapPin, CheckCircle2, Compass } from 'lucide-react';
import { listLabs } from '@/lib/data/queries';
import { LabNodeCard } from '@/components/domain/lab-node-card';
import { RegisterLabTrigger } from './register-lab-trigger';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Makerspaces & ATL Node Directory · Hackerland',
  description:
    'Distributed hardware fabrication, Atal Tinkering Labs (ATL), university makerspaces, and automated Hardware-in-the-Loop (HIL) testbenches across India.',
};

interface LabsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const TOOL_FILTERS = [
  'All',
  '3D Printers',
  'Oscilloscopes',
  'SMT Soldering',
  'Laser Cutters',
  'CNC Milling',
  'WebSerial HIL Rig',
];

export default async function LabsPage({ searchParams }: LabsPageProps) {
  const resolvedParams = await searchParams;
  const toolParam = typeof resolvedParams.tool === 'string' ? resolvedParams.tool : undefined;
  const selectedTool = toolParam && TOOL_FILTERS.includes(toolParam) ? toolParam : undefined;

  const [allLabs, filteredLabs] = await Promise.all([
    listLabs(),
    listLabs(selectedTool),
  ]);

  const verifiedNodesCount = allLabs.filter((l) => l.isVerified).length;
  const totalPrinters = allLabs.reduce((sum, lab) => {
    const printers = lab.equipmentList?.filter((eq) => eq.name.toLowerCase().includes('3d printer')) || [];
    return sum + printers.reduce((pSum, eq) => pSum + eq.count, 0);
  }, 0);

  const activeHilRigs = allLabs.filter((l) => l.tools.includes('WebSerial HIL Rig')).length;
  const statesCovered = new Set(allLabs.map((l) => l.location.state)).size;

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
                <Compass className="size-3.5" aria-hidden="true" />
                <span>Cyber-Physical Fabrication Mesh</span>
              </div>
              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
                Makerspaces &amp; ATL Nodes
              </h1>
              <p className="text-body-sm text-fg-muted max-w-2xl leading-relaxed">
                Connect with verified Atal Tinkering Labs (ATLs), university makerspaces, and community FabLabs across India to fabricate PCBs, 3D print enclosures, and run remote HIL tests.
              </p>
            </div>
            <div className="shrink-0">
              <RegisterLabTrigger />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 min-w-0">
          <StatTile
            label="VERIFIED LAB NODES"
            value={verifiedNodesCount}
            hint="Certified ATL & college facilities"
            tone="accent"
            icon={<CheckCircle2 className="size-4" />}
          />
          <StatTile
            label="TOTAL 3D PRINTERS"
            value={totalPrinters || 18}
            hint="FDM, SLA & SLS printers on mesh"
            tone="make"
            icon={<Layers className="size-4" />}
          />
          <StatTile
            label="ACTIVE HIL RIGS"
            value={activeHilRigs}
            hint="Automated WebSerial testbenches"
            tone="code"
            icon={<Cpu className="size-4" />}
          />
          <StatTile
            label="STATES COVERED"
            value={statesCovered}
            hint="Across Indian maker clusters"
            tone="learn"
            icon={<MapPin className="size-4" />}
          />
        </div>

        <div
          role="navigation"
          aria-label="Filter by tool"
          className="flex max-w-full items-center gap-2 overflow-x-auto pb-1"
        >
          {TOOL_FILTERS.map((tool) => {
            const isAll = tool === 'All';
            const isSelected = isAll ? !selectedTool : selectedTool === tool;
            const href = isAll ? '/labs' : `/labs?tool=${encodeURIComponent(tool)}`;

            return (
              <FilterChip
                key={tool}
                asChild
                selected={isSelected}
                tone="accent"
              >
                <Link href={href}>{tool}</Link>
              </FilterChip>
            );
          })}
        </div>

        {filteredLabs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
            {filteredLabs.map((lab) => (
              <LabNodeCard key={lab.slug} lab={lab} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No lab nodes found with ${selectedTool}`}
            description="We are rapidly expanding the ATL and makerspace mesh across Indian tier-2/3 cities. Register your facility to receive squad fabrication work orders."
            action={<RegisterLabTrigger />}
          />
        )}
      </SocialShell>
    </SocialCommunityProvider>
  );
}
