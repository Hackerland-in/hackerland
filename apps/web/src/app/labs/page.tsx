import type { Metadata } from 'next';
import Link from 'next/link';
import {
  EmptyState,
  FilterChip,
  SectionHeader,
  StatTile,
} from '@hackerland/ui';
import {
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { listLabs } from '@/lib/data/queries';
import { LabNodeCard } from '@/components/domain/lab-node-card';
import { RegisterLabTrigger } from './register-lab-trigger';

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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      {/* Header */}
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="CYBER-PHYSICAL FABRICATION MESH"
        title="Makerspaces & ATL Nodes"
        description="Connect with certified Atal Tinkering Labs (ATLs), university makerspaces, and community FabLabs across India to fabricate PCBs, 3D print enclosures, and test remote hardware."
        action={<RegisterLabTrigger />}
      />

      {/* 4 KPI StatTiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 min-w-0">
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

      {/* Filter Row */}
      <div
        role="navigation"
        aria-label="Filter by tool"
        className="flex max-w-full items-center gap-2 overflow-x-auto pb-2"
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
              tone={isAll ? 'accent' : 'make'}
            >
              <Link href={href}>{tool}</Link>
            </FilterChip>
          );
        })}
      </div>

      {/* Labs Grid or Empty State */}
      {filteredLabs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-w-0">
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
    </div>
  );
}
