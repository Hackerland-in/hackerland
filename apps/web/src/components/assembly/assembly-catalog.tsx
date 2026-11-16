'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { PcbaAssemblyProject } from '@hackerland/core';
import { filterAssemblyProjects, calculatePnpFeederSetup } from '@hackerland/core';

interface AssemblyCatalogProps {
  initialProjects: PcbaAssemblyProject[];
}

export function AssemblyCatalog({ initialProjects }: AssemblyCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return filterAssemblyProjects(initialProjects, {
      search: searchQuery,
    });
  }, [initialProjects, searchQuery]);

  const totalPlacements = useMemo(() => {
    return initialProjects.reduce((sum, p) => sum + p.placements.length, 0);
  }, [initialProjects]);

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            PCBA Projects
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {initialProjects.length}
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">Centroid & SMT Mapped</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Placements
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            {totalPlacements}
          </p>
          <span className="text-[11px] text-emerald-500 font-mono">Pick-and-Place Coordinates</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tier-1 EMS Plants
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            Kaynes / Syrma
          </p>
          <span className="text-[11px] text-primary font-mono">Dixon & Centum Lines</span>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Standards
          </span>
          <p className="text-2xl font-mono font-bold text-foreground mt-1">
            IPC-A-610
          </p>
          <span className="text-[11px] text-muted-foreground font-mono">Class 2 & Class 3 SMT</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} production PCBA assembly designs with complete pick-and-place centroids.
        </p>

        <input
          type="search"
          placeholder="Search PCBA design, Kaynes, BGA, drone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-72"
        />
      </div>

      {/* Assembly Projects Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm font-medium text-foreground">No assembly designs match your search</p>
          <p className="text-xs text-muted-foreground mt-1">Try searching by partner name (Kaynes, Syrma) or application.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const feeder = calculatePnpFeederSetup(proj.placements);

            return (
              <Link
                key={proj.id}
                href={`/assembly/${proj.slug}`}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground uppercase">
                      {proj.layerCount} Layers · {proj.boardDimensions.widthMm}x{proj.boardDimensions.heightMm}mm
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {proj.recommendedFoilThickness} Stencil
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Components
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {feeder.totalParts} Parts ({feeder.feederSlotsRequired} Feeders)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                        Double-Sided
                      </span>
                      <span className="font-mono font-medium text-foreground">
                        {feeder.sideDistribution.bottom > 0 ? 'Top + Bottom' : 'Top Only'}
                      </span>
                    </div>
                  </div>

                  {/* Feature badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.hasBgaOrQfn && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        ⚡ 3D X-Ray / QFN
                      </span>
                    )}
                    {proj.hasConformalCoating && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        🛡️ Conformal Coating
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[180px]">
                    🏭 {proj.recommendedEmsPartner.name}
                  </span>
                  <span className="text-primary group-hover:underline font-semibold">
                    Inspect PnP →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
