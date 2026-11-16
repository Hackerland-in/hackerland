'use client';

import Link from 'next/link';
import type { PcbaAssemblyProject } from '@hackerland/core';
import { calculatePnpFeederSetup } from '@hackerland/core';
import { PnpCentroidVisualizer } from './pnp-centroid-visualizer';
import { TurnkeyCostEstimator } from './turnkey-cost-estimator';

interface AssemblyDetailViewProps {
  project: PcbaAssemblyProject;
}

export function AssemblyDetailView({ project }: AssemblyDetailViewProps) {
  const feeder = calculatePnpFeederSetup(project.placements);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Link href="/assembly" className="hover:text-foreground transition-colors">
          Assembly
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-sm">{project.name}</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {project.layerCount} Layer Board
            </span>
            <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
              {project.boardDimensions.widthMm} x {project.boardDimensions.heightMm} mm
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary text-foreground">
              {project.recommendedFoilThickness} Stencil Foil
            </span>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            Recommended EMS: <span className="font-bold text-foreground">{project.recommendedEmsPartner.name}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {project.name}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-3xl leading-relaxed">
          {project.description}
        </p>

        {/* Action badges */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-mono">
          {project.hasBgaOrQfn && (
            <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ✓ Requires 3D X-Ray Voiding Audit (&lt;15% void ratio)
            </span>
          )}
          {project.hasConformalCoating && (
            <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ✓ Conformal Coating Protection Layer
            </span>
          )}
        </div>
      </div>

      {/* Interactive 2D Centroid Visualizer */}
      <PnpCentroidVisualizer
        boardDimensions={project.boardDimensions}
        placements={project.placements}
        projectName={project.name}
      />

      {/* Feeder Setup & Component Breakdown */}
      <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            SMT Feeder Setup & Packaging Distribution
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {feeder.feederSlotsRequired} Unique Feeder Tape Slots
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-background/60 border border-border/80 p-3">
            <span className="text-[11px] font-mono text-muted-foreground uppercase block">
              Total Components
            </span>
            <p className="text-xl font-mono font-bold text-foreground mt-0.5">
              {feeder.totalParts} pcs
            </p>
          </div>
          <div className="rounded-lg bg-background/60 border border-border/80 p-3">
            <span className="text-[11px] font-mono text-muted-foreground uppercase block">
              SMD vs Through-Hole
            </span>
            <p className="text-xl font-mono font-bold text-foreground mt-0.5">
              {feeder.smdPartsCount} SMD / {feeder.thtPartsCount} THT
            </p>
          </div>
          <div className="rounded-lg bg-background/60 border border-border/80 p-3">
            <span className="text-[11px] font-mono text-muted-foreground uppercase block">
              Side Distribution
            </span>
            <p className="text-xl font-mono font-bold text-foreground mt-0.5">
              Top: {feeder.sideDistribution.top} | Bot: {feeder.sideDistribution.bottom}
            </p>
          </div>
          <div className="rounded-lg bg-background/60 border border-border/80 p-3">
            <span className="text-[11px] font-mono text-muted-foreground uppercase block">
              SMT Stencil Aperture
            </span>
            <p className="text-xl font-mono font-bold text-primary mt-0.5">
              {project.recommendedFoilThickness}
            </p>
          </div>
        </div>

        {/* Package counts pill row */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
          {Object.entries(feeder.packageBreakdown).map(([pkg, count]) => (
            <span
              key={pkg}
              className="px-2.5 py-1 rounded bg-secondary/60 border border-border text-foreground"
            >
              {pkg.toUpperCase()}: <span className="font-bold text-primary">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Turnkey PCBA Cost Modeling */}
      <TurnkeyCostEstimator project={project} />

      {/* Recommended Indian EMS Partner */}
      <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Recommended Indian EMS Manufacturing Partner
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-background/60 border border-border/80">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {project.recommendedEmsPartner.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              📍 {project.recommendedEmsPartner.city}, {project.recommendedEmsPartner.state} (India)
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.recommendedEmsPartner.certifications.map((cert, i) => (
              <span
                key={i}
                className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                ✓ {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
