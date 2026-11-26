import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Wrench, Compass, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';
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

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <div className="mx-auto w-full max-w-4xl py-2 sm:py-4 space-y-6 min-w-0">
      {/* Back button & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-hairline bg-surface-1">
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/how-to-start">
              <ArrowLeft className="size-4 mr-1.5" />
              <span>All Manufacturing Blueprints</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-caption font-semibold uppercase tracking-wider text-accent">
              {plant.category}
            </span>
            <span className="text-fg-subtle">/</span>
            <span className="font-display text-body-sm font-bold text-fg truncate max-w-xs sm:max-w-md">
              {plant.title}
            </span>
          </div>
        </div>

        <Badge tone="accent" variant="solid" className="self-start sm:self-auto font-mono text-caption">
          {plant.capitalRequirements.pilotCapEx}
        </Badge>
      </div>

      {/* Header Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-hairline bg-surface-1 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-caption font-mono uppercase font-bold text-accent">
            {plant.category}
          </span>
          <span className="text-fg-subtle">·</span>
          <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
            Land: {plant.capitalRequirements.landSqFt}
          </Badge>
          <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
            Power: {plant.capitalRequirements.powerGridKva}
          </Badge>
          {plant.capitalRequirements.cleanroomClass && (
            <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
              {plant.capitalRequirements.cleanroomClass}
            </Badge>
          )}
        </div>

        <h1 className="text-heading-lg sm:text-headline-md font-display font-bold text-fg">
          {plant.title}
        </h1>

        <p className="text-body-md font-medium text-accent">
          {plant.tagline}
        </p>

        <p className="text-body-md text-fg-muted max-w-4xl">
          {plant.overview}
        </p>

        {/* Industrial Clusters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-hairline/60 text-caption font-mono text-fg-muted">
          <MapPin className="size-4 text-accent shrink-0" />
          <span className="font-bold text-fg">Target Manufacturing Ecosystems in India:</span>
          <span>{plant.rawMaterialsAndSupplyChain.indianIndustrialClusters.join(' · ')}</span>
        </div>
      </div>

      {/* Market Opportunity & Capital Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 bg-surface-1 border-hairline space-y-4">
          <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
            <TrendingUp className="size-4 text-accent" />
            Market Opportunity & Domestic Demand
          </h2>
          <div className="grid grid-cols-2 gap-3 font-mono text-caption">
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Global Market</span>
              <span className="text-heading-sm font-bold text-fg">{plant.marketDemand.tamGlobal}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Indian Market</span>
              <span className="text-heading-sm font-bold text-emerald-400">{plant.marketDemand.tamIndia}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Growth CAGR</span>
              <span className="text-heading-sm font-bold text-accent">{plant.marketDemand.cagr}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Import Dependency</span>
              <span className="text-heading-sm font-bold text-rose-400">{plant.marketDemand.importDependencyPercent}%</span>
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
            <ShieldCheck className="size-4 text-emerald-400" />
            Unit Economics & Government Subsidies
          </h2>

          <div className="grid grid-cols-2 gap-3 font-mono text-caption">
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Gross Margin</span>
              <span className="text-heading-sm font-bold text-emerald-400">{plant.unitEconomics.typicalGrossMargin}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Net Profit Margin</span>
              <span className="text-heading-sm font-bold text-fg">{plant.unitEconomics.netMargin}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Payback Timeline</span>
              <span className="text-heading-sm font-bold text-accent">{plant.unitEconomics.paybackPeriodYears}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-2 border border-hairline">
              <span className="text-[10px] text-fg-muted block uppercase">Breakeven Volume</span>
              <span className="text-heading-sm font-bold text-fg">{plant.unitEconomics.breakEvenCapacityUtil}</span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-hairline/60">
            <span className="text-[11px] font-mono text-fg-muted uppercase font-bold block">
              Applicable Central & State Subsidies
            </span>
            {plant.governmentSchemes.map((scheme) => (
              <div key={scheme.schemeName} className="p-2.5 rounded-lg bg-surface-2 border border-hairline text-caption space-y-0.5">
                <span className="font-bold text-fg block">{scheme.schemeName}</span>
                <p className="text-fg-muted text-[11px]">{scheme.subsidyDetails}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Critical Machinery & Tooling Table */}
      <Card className="p-6 bg-surface-1 border-hairline space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-hairline/60">
          <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
            <Wrench className="size-4 text-accent" />
            Critical Plant Machinery & Tooling ({plant.machineryList.length} Capital Tools)
          </h2>
          <Badge tone="accent" variant="outline" className="font-mono text-caption">
            Commercial: {plant.capitalRequirements.commercialCapEx}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plant.machineryList.map((machine) => (
            <div
              key={machine.name}
              className="p-4 rounded-xl bg-surface-2 border border-hairline space-y-2"
            >
              <div className="flex items-center justify-between text-caption font-mono">
                <span className="font-bold text-fg">{machine.name}</span>
                <span className="text-accent font-semibold">{machine.estCostInr}</span>
              </div>
              <p className="text-caption text-fg-muted">
                {machine.purpose}
              </p>
              <div className="text-[11px] font-mono text-fg-subtle pt-2 border-t border-hairline/60">
                <span className="text-fg font-medium">Recommended Global Brands:</span> {machine.recommendedBrands.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Step-by-Step 4-Phase Factory Execution Roadmap */}
      <Card className="p-6 bg-surface-1 border-hairline space-y-4">
        <h2 className="text-body-sm font-display font-bold text-fg flex items-center gap-2">
          <Compass className="size-4 text-accent" />
          Step-by-Step 4-Phase Factory Execution Roadmap
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plant.executionRoadmap.map((step) => (
            <div
              key={step.phase}
              className="p-4 rounded-xl bg-surface-2 border border-hairline space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-accent font-bold">{step.phase}</span>
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
              <div className="pt-2 border-t border-hairline/60 text-[11px] font-mono text-emerald-400">
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
            Raw Materials & Sourcing Supply Chain
          </h2>
          <ul className="space-y-1.5 text-caption text-fg-muted list-disc list-inside">
            {plant.rawMaterialsAndSupplyChain.materials.map((mat, idx) => (
              <li key={idx}>{mat}</li>
            ))}
          </ul>
          <div className="pt-2 border-t border-hairline/60 text-[11px] font-mono text-fg-subtle">
            <span className="text-fg font-medium">Primary Global Material Vendors:</span>{' '}
            {plant.rawMaterialsAndSupplyChain.primarySources.join(', ')}
          </div>
        </Card>

        <Card className="p-5 bg-surface-1 border-hairline space-y-3">
          <h2 className="text-body-sm font-display font-bold text-fg">
            Statutory Clearances & Certifications
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
        </Card>
      </div>
        </div>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
