'use client';

import Link from 'next/link';
import type { EmcScanProject } from '@hackerland/core';
import { EmcSpectralAnalyzer } from './emc-spectral-analyzer';
import { NearFieldProbeHeatmap } from './near-field-probe-heatmap';
import { EmcFilterCalculator } from './emc-filter-calculator';

interface EmcDetailViewProps {
  project: EmcScanProject;
}

export function EmcDetailView({ project }: EmcDetailViewProps) {
  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <Link href="/emc" className="hover:text-foreground transition-colors">
          EMC Pre-Scan
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-sm">{project.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {project.standard.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary capitalize">
              {project.scanType.replace(/_/g, ' ')}
            </span>
            <span
              className={`text-xs font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                project.overallStatus === 'compliant'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : project.overallStatus === 'marginal_warning'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }`}
            >
              {project.overallStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            Test Chamber: <span className="font-bold text-foreground">{project.testLabFacility}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {project.title}
        </h1>
        <p className="text-xs md:text-sm text-primary font-mono mt-1 font-semibold">
          DUT: {project.deviceUnderTesting}
        </p>
      </div>

      {/* Interactive Spectral Trace vs Regulatory Limits */}
      <EmcSpectralAnalyzer
        spectralTrace={project.spectralTrace}
        standardTitle={project.standard.replace(/_/g, ' ').toUpperCase()}
      />

      {/* Near-Field Probe Radiation Heatmap */}
      <NearFieldProbeHeatmap
        hotspots={project.hotspots}
        dutName={project.deviceUnderTesting}
      />

      {/* Interactive Common-Mode Choke & LC Filter Calculator */}
      <EmcFilterCalculator />

      {/* Filter Recommendations & PCB Layout Fixes */}
      <div className="rounded-xl border border-border bg-card/40 p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Prescribed EMI Filter & PCB Stackup Recommendations
        </h2>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-2 leading-relaxed">
          {project.filterRecommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Lab Instrumentation & Test Notes */}
      {project.notes.length > 0 && (
        <div className="rounded-xl border border-border bg-card/40 p-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">
            Test Setup & Lab Instrumentation Methodology
          </h2>
          <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5 leading-relaxed font-mono">
            {project.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
