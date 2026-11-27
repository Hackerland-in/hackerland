import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Wrench,
  Compass,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Globe,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, Badge, Button } from '@hackerland/ui';
import { PLANT_BLUEPRINTS } from '@/components/domain/how-to-start/how-to-start-data';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PLANT_BLUEPRINTS.map((blueprint) => ({
    slug: blueprint.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blueprint = PLANT_BLUEPRINTS.find((b) => b.slug === slug);
  if (!blueprint) return { title: 'Blueprint Not Found | Hackerland' };

  return {
    title: `How to Start a ${blueprint.title} | Hackerland Hardware`,
    description: blueprint.tagline,
  };
}

export default async function PlantBlueprintPage({ params }: PageProps) {
  const { slug } = await params;
  const plant = PLANT_BLUEPRINTS.find((b) => b.slug === slug);

  if (!plant) {
    notFound();
  }

  const primaryExportCorridor = plant.exportCorridors?.[0]?.corridorSlug ?? 'us';

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <div className="mx-auto w-full max-w-4xl py-2 sm:py-4 space-y-6 min-w-0">
          {/* Back button & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-hairline bg-surface-1">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <Button asChild variant="secondary" size="sm">
                <Link href="/how-to-start">
                  <ArrowLeft className="size-4 mr-1.5" />
                  <span>All Manufacturing Blueprints</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-caption font-semibold uppercase tracking-wider text-accent-fg shrink-0">
                  {plant.category}
                </span>
                <span className="text-fg-subtle">/</span>
                <span className="font-display text-body-sm font-bold text-fg truncate max-w-xs sm:max-w-md">
                  {plant.title}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {plant.pilotScaleOption && (
                <Badge tone="accent" variant="solid" className="font-mono text-caption">
                  EMS Pilot: {plant.pilotScaleOption.budgetRangeInr}
                </Badge>
              )}
              <Badge tone="neutral" variant="outline" className="font-mono text-caption bg-sunken">
                Plant: {plant.capitalRequirements.pilotCapEx}
              </Badge>
            </div>
          </div>

          {/* Header Overview Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-caption font-mono uppercase font-bold text-accent-fg">
                {plant.category}
              </span>
              <span className="text-fg-subtle">·</span>
              <Badge tone="neutral" variant="outline" className="font-mono text-[10px] bg-surface-1">
                Land: {plant.capitalRequirements.landSqFt}
              </Badge>
              <Badge tone="neutral" variant="outline" className="font-mono text-[10px] bg-surface-1">
                Power: {plant.capitalRequirements.powerGridKva}
              </Badge>
              {plant.capitalRequirements.cleanroomClass && (
                <Badge tone="neutral" variant="outline" className="font-mono text-[10px] bg-surface-1">
                  {plant.capitalRequirements.cleanroomClass}
                </Badge>
              )}
            </div>

            <h1 className="text-heading-lg sm:text-headline-md font-display font-bold text-fg">
              {plant.title}
            </h1>

            <p className="text-body-md font-medium text-accent-fg">
              {plant.tagline}
            </p>

            <p className="text-body-md text-fg-muted max-w-4xl">
              {plant.overview}
            </p>

            {/* Industrial Clusters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-hairline text-caption font-mono text-fg-muted">
              <MapPin className="size-4 text-accent-fg shrink-0" />
              <span className="font-bold text-fg">Target Manufacturing Ecosystems in India:</span>
              <span>{plant.rawMaterialsAndSupplyChain.indianIndustrialClusters.join(' · ')}</span>
            </div>
          </div>

          {/* Start Smaller: Lab -> EMS Pilot Batch (₹5L–₹35L) -> Full Plant -> Export */}
          <Card className="p-5 sm:p-6 bg-surface-1 border-accent/25 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-accent-fg">
                  <Sparkles className="size-3.5" />
                  <span>Scale Without the Zero-to-Factory Cliff</span>
                </span>
                <h2 className="text-body-md font-display font-bold text-fg">
                  Start Smaller: Lab &rarr; EMS Pilot Batch ({plant.pilotScaleOption?.budgetRangeInr ?? '₹5L–₹35L'}) &rarr; Full Plant &rarr; Export
                </h2>
              </div>
              <Link
                href="/sectors"
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-sunken px-3 py-1.5 text-caption font-mono font-semibold text-fg hover:border-accent/40 hover:text-accent-fg transition-colors self-start sm:self-auto"
              >
                <Layers className="size-3.5 text-accent-fg" />
                <span>Sector Hubs</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-sunken border border-hairline flex flex-col justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-accent-fg uppercase block">
                    01 · Lab Prototype
                  </span>
                  <p className="text-caption font-semibold text-fg">Validate in Open Labs</p>
                  <p className="text-[11px] text-fg-muted">Run simulators, CAD, and first bench prototypes.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-hairline">
                  <Link href="/learn" className="text-[11px] font-mono font-medium text-accent-fg hover:underline">
                    /learn
                  </Link>
                  <span className="text-fg-subtle">·</span>
                  <Link href="/labs" className="text-[11px] font-mono font-medium text-accent-fg hover:underline">
                    /labs
                  </Link>
                  <span className="text-fg-subtle">·</span>
                  <Link href="/manufacturing" className="text-[11px] font-mono font-medium text-accent-fg hover:underline">
                    /manufacturing
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-accent-soft border border-accent/25 flex flex-col justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-accent-fg uppercase block">
                    02 · EMS Pilot ({plant.pilotScaleOption?.budgetRangeInr ?? '₹5L–₹35L'})
                  </span>
                  <p className="text-caption font-semibold text-fg">Missing-Middle Pilot Lot</p>
                  <p className="text-[11px] text-fg-muted">
                    {plant.pilotScaleOption?.batchSize ?? 'Small-lot EMS & job-shop validation'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-accent/20">
                  <Link href="/sourcing" className="text-[11px] font-mono font-medium text-accent-fg hover:underline">
                    /sourcing
                  </Link>
                  <span className="text-fg-subtle">·</span>
                  <Link
                    href={plant.linkedAssemblySlug ? `/assembly/${plant.linkedAssemblySlug}` : '/assembly'}
                    className="text-[11px] font-mono font-medium text-accent-fg hover:underline"
                  >
                    /assembly
                  </Link>
                  <span className="text-fg-subtle">·</span>
                  <Link
                    href={plant.linkedTestbedSlug ? `/testbeds/${plant.linkedTestbedSlug}` : '/testbeds'}
                    className="text-[11px] font-mono font-medium text-accent-fg hover:underline"
                  >
                    /testbeds
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sunken border border-hairline flex flex-col justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-accent-fg uppercase block">
                    03 · Full Plant &amp; Certs
                  </span>
                  <p className="text-caption font-semibold text-fg">{plant.capitalRequirements.pilotCapEx}</p>
                  <p className="text-[11px] text-fg-muted">Lock PLI/SPECS subsidies &amp; BIS/CDSCO/AIS approvals.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-hairline">
                  <Link href="/sectors" className="text-[11px] font-mono font-medium text-accent-fg hover:underline">
                    /sectors
                  </Link>
                  <span className="text-fg-subtle">·</span>
                  <Link
                    href={plant.linkedComplianceSlug ? `/compliance/${plant.linkedComplianceSlug}` : '/compliance'}
                    className="text-[11px] font-mono font-medium text-accent-fg hover:underline"
                  >
                    /compliance
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sunken border border-hairline flex flex-col justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-accent-fg uppercase block">
                    04 · Export Scale
                  </span>
                  <p className="text-caption font-semibold text-fg">Global Trade Corridors</p>
                  <p className="text-[11px] text-fg-muted">
                    {plant.exportHsCodes?.[0] ?? 'Claim RoDTEP & PLI export incentives'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-hairline">
                  <Link href="/export" className="text-[11px] font-mono font-medium text-accent-fg hover:underline">
                    /export
                  </Link>
                  <span className="text-fg-subtle">·</span>
                  <Link
                    href={`/export/${primaryExportCorridor}`}
                    className="text-[11px] font-mono font-medium text-accent-fg hover:underline"
                  >
                    /export/{primaryExportCorridor}
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Missing Middle Pilot Bridge Detail Card */}
          {plant.pilotScaleOption && (
            <Card className="p-5 sm:p-6 bg-surface-1 border-hairline space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-hairline">
                <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
                  <Sparkles className="size-4 text-accent-fg" />
                  Missing-Middle Pilot Bridge ({plant.pilotScaleOption.budgetRangeInr} Before Full Plant CapEx)
                </h2>
                <Badge tone="accent" variant="outline" className="font-mono text-caption self-start sm:self-auto">
                  {plant.pilotScaleOption.batchSize}
                </Badge>
              </div>

              <p className="text-body-sm text-fg-muted">{plant.pilotScaleOption.bridgeModel}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-sunken border border-hairline space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-fg block">
                    Indian Incubators, Shared Fabs &amp; Contract Job-Shops
                  </span>
                  <ul className="space-y-1 text-caption text-fg-muted list-disc list-inside">
                    {plant.pilotScaleOption.indianBridgePartners.map((partner) => (
                      <li key={partner}>{partner}</li>
                    ))}
                  </ul>
                  {plant.linkedLabs && plant.linkedLabs.length > 0 && (
                    <div className="pt-2 border-t border-hairline flex flex-wrap gap-2">
                      {plant.linkedLabs.map((lab) => (
                        <Link
                          key={lab.name}
                          href={lab.href}
                          className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface-1 px-2 py-0.5 text-[11px] font-mono text-accent-fg hover:border-accent/40"
                        >
                          <span>{lab.name} ({lab.city})</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-sunken border border-hairline space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-success-fg flex items-center gap-1.5">
                      <CheckCircle2 className="size-4" />
                      <span>Graduation Gate to Full Plant CapEx</span>
                    </span>
                    <p className="text-caption text-fg-muted">
                      {plant.pilotScaleOption.graduationGate}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline">
                    <Link
                      href="/sourcing"
                      className="rounded-md border border-hairline bg-surface-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-fg hover:text-accent-fg"
                    >
                      BOM Sourcing
                    </Link>
                    <Link
                      href={plant.linkedAssemblySlug ? `/assembly/${plant.linkedAssemblySlug}` : '/assembly'}
                      className="rounded-md border border-hairline bg-surface-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-fg hover:text-accent-fg"
                    >
                      EMS Assembly Track
                    </Link>
                    <Link
                      href={plant.linkedTestbedSlug ? `/testbeds/${plant.linkedTestbedSlug}` : '/testbeds'}
                      className="rounded-md border border-hairline bg-surface-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-fg hover:text-accent-fg"
                    >
                      Shared NABL Testbed
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Market Opportunity & Capital Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-surface-1 border-hairline space-y-4">
              <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
                <TrendingUp className="size-4 text-accent-fg" />
                Market Opportunity &amp; Domestic Demand
              </h2>
              <div className="grid grid-cols-2 gap-3 font-mono text-caption">
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Global Market</span>
                  <span className="text-heading-sm font-bold text-fg">{plant.marketDemand.tamGlobal}</span>
                </div>
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Indian Market</span>
                  <span className="text-heading-sm font-bold text-success-fg">{plant.marketDemand.tamIndia}</span>
                </div>
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Growth CAGR</span>
                  <span className="text-heading-sm font-bold text-accent-fg">{plant.marketDemand.cagr}</span>
                </div>
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Import Dependency</span>
                  <span className="text-heading-sm font-bold text-danger-fg">{plant.marketDemand.importDependencyPercent}%</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">Key Growth Drivers</span>
                <ul className="space-y-1 text-caption text-fg-muted list-disc list-inside">
                  {plant.marketDemand.growthDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-5 bg-surface-1 border-hairline space-y-4">
              <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
                <ShieldCheck className="size-4 text-success-fg" />
                Unit Economics &amp; Government Subsidies
              </h2>

              <div className="grid grid-cols-2 gap-3 font-mono text-caption">
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Gross Margin</span>
                  <span className="text-heading-sm font-bold text-success-fg">{plant.unitEconomics.typicalGrossMargin}</span>
                </div>
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Net Profit Margin</span>
                  <span className="text-heading-sm font-bold text-fg">{plant.unitEconomics.netMargin}</span>
                </div>
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Payback Timeline</span>
                  <span className="text-heading-sm font-bold text-accent-fg">{plant.unitEconomics.paybackPeriodYears}</span>
                </div>
                <div className="p-3 rounded-lg bg-sunken border border-hairline">
                  <span className="text-[10px] text-fg-muted block uppercase">Breakeven Volume</span>
                  <span className="text-heading-sm font-bold text-fg">{plant.unitEconomics.breakEvenCapacityUtil}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-hairline">
                <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
                  Applicable Central &amp; State Subsidies
                </span>
                {plant.governmentSchemes.map((scheme) => (
                  <div key={scheme.schemeName} className="p-2.5 rounded-lg bg-sunken border border-hairline text-caption space-y-0.5">
                    <span className="font-bold text-fg block">{scheme.schemeName}</span>
                    <p className="text-fg-muted text-[11px]">{scheme.subsidyDetails}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Export Markets, HSN Codes & Compliance Corridors */}
          {plant.exportCorridors && plant.exportCorridors.length > 0 && (
            <Card className="p-6 bg-surface-1 border-hairline space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-hairline">
                <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
                  <Globe className="size-4 text-accent-fg" />
                  Global Export Corridors, HSN Codes &amp; Trade Incentives
                </h2>
                {plant.linkedComplianceSlug && (
                  <Link
                    href={`/compliance/${plant.linkedComplianceSlug}`}
                    className="inline-flex items-center gap-1.5 text-caption font-mono font-semibold text-accent-fg hover:underline"
                  >
                    <ShieldCheck className="size-3.5" />
                    <span>Open Linked Compliance Roadmap</span>
                  </Link>
                )}
              </div>

              {plant.exportHsCodes && plant.exportHsCodes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {plant.exportHsCodes.map((hsn) => (
                    <Badge key={hsn} tone="neutral" variant="outline" className="font-mono text-[11px] bg-sunken">
                      HSN {hsn}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plant.exportCorridors.map((corridor) => (
                  <Link
                    key={corridor.corridorSlug}
                    href={`/export/${corridor.corridorSlug}`}
                    className="p-4 rounded-xl bg-sunken border border-hairline hover:border-accent/40 transition-colors space-y-2 block"
                  >
                    <div className="flex items-center justify-between text-caption font-mono font-bold text-accent-fg">
                      <span>{corridor.marketLabel}</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                    <div className="text-[11px] font-mono text-fg">
                      <span className="text-fg-muted block uppercase text-[10px]">Required Standards</span>
                      {corridor.certifications.join(' · ')}
                    </div>
                    <p className="text-caption text-fg-muted pt-1 border-t border-hairline">
                      {corridor.incentiveNote}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Critical Machinery & Tooling Table */}
          <Card className="p-6 bg-surface-1 border-hairline space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-hairline">
              <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
                <Wrench className="size-4 text-accent-fg" />
                Critical Plant Machinery &amp; Tooling ({plant.machineryList.length} Capital Tools)
              </h2>
              <Badge tone="accent" variant="outline" className="font-mono text-caption">
                Commercial: {plant.capitalRequirements.commercialCapEx}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plant.machineryList.map((machine) => (
                <div
                  key={machine.name}
                  className="p-4 rounded-xl bg-sunken border border-hairline space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-caption font-mono">
                    <span className="font-bold text-fg">{machine.name}</span>
                    <span className="text-accent-fg font-semibold shrink-0">{machine.estCostInr}</span>
                  </div>
                  <p className="text-caption text-fg-muted">
                    {machine.purpose}
                  </p>
                  <div className="text-[11px] font-mono text-fg-subtle pt-2 border-t border-hairline">
                    <span className="text-fg font-medium">Recommended Global Brands:</span> {machine.recommendedBrands.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Step-by-Step 4-Phase Factory Execution Roadmap */}
          <Card className="p-6 bg-surface-1 border-hairline space-y-4">
            <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
              <Compass className="size-4 text-accent-fg" />
              Step-by-Step 4-Phase Factory Execution Roadmap
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plant.executionRoadmap.map((step) => (
                <div
                  key={step.phase}
                  className="p-4 rounded-xl bg-sunken border border-hairline space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className="text-accent-fg font-bold">{step.phase}</span>
                      <span className="text-fg-subtle">{step.durationWeeks}</span>
                    </div>
                    <h3 className="text-caption font-bold text-fg mb-2">
                      {step.title}
                    </h3>
                    <ul className="space-y-1.5 text-caption text-fg-muted list-disc list-inside">
                      {step.tasks.map((task, idx) => (
                        <li key={idx} className="leading-snug">
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-hairline text-[11px] font-mono text-success-fg">
                    <span className="text-fg-subtle block">Deliverable:</span>
                    {step.deliverable}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Raw Materials & Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-surface-1 border-hairline space-y-3">
              <h2 className="text-body-sm font-display font-bold text-fg">
                Raw Materials &amp; Sourcing Supply Chain
              </h2>
              <ul className="space-y-1.5 text-caption text-fg-muted list-disc list-inside">
                {plant.rawMaterialsAndSupplyChain.materials.map((mat, idx) => (
                  <li key={idx}>{mat}</li>
                ))}
              </ul>
              <div className="pt-2 border-t border-hairline text-[11px] font-mono text-fg-subtle">
                <span className="text-fg font-medium">Primary Global Material Vendors:</span>{' '}
                {plant.rawMaterialsAndSupplyChain.primarySources.join(', ')}
              </div>
            </Card>

            <Card className="p-5 bg-surface-1 border-hairline space-y-3">
              <h2 className="text-body-sm font-display font-bold text-fg">
                Statutory Clearances &amp; Certifications
              </h2>
              <div className="flex items-center gap-2 text-caption font-mono">
                <span className="text-fg-muted">Pollution Category:</span>
                <Badge
                  tone={
                    plant.certificationsAndCompliance.pollutionCategory === 'Red'
                      ? 'danger'
                      : plant.certificationsAndCompliance.pollutionCategory === 'Orange'
                      ? 'accent'
                      : 'neutral'
                  }
                  variant="solid"
                >
                  {plant.certificationsAndCompliance.pollutionCategory} Category
                </Badge>
              </div>
              <ul className="space-y-1 text-caption text-fg-muted list-disc list-inside">
                {plant.certificationsAndCompliance.mandatory.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
              {plant.linkedComplianceSlug && (
                <div className="pt-2 border-t border-hairline">
                  <Link
                    href={`/compliance/${plant.linkedComplianceSlug}`}
                    className="inline-flex items-center gap-1 text-caption font-mono font-semibold text-accent-fg hover:underline"
                  >
                    <span>View Step-by-Step Certification Checklist</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
