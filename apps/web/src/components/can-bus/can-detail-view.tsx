'use client';

import Link from 'next/link';
import type { CanBusProject } from '@hackerland/core';
import { CanBusWorkbench } from './can-bus-workbench';

interface CanDetailViewProps {
  project: CanBusProject;
}

export function CanDetailView({ project }: CanDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/can-bus" className="hover:text-amber-400 transition-colors">
            ← Automotive CAN Bus Network Simulator
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                {project.nominalBaudRateKbps} kbps Nominal
              </span>
              {project.dataBaudRateMbps && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {project.dataBaudRateMbps} Mbps CAN-FD
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 font-mono uppercase">
                {project.protocolStandard.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                {project.busTopology.nodeCount} ECUs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Domain: <span className="text-slate-200">{project.automotiveDomain}</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard &amp; Compliance</span>
            <span className="text-xs font-bold text-slate-200 block mt-0.5">{project.standardsCompliance}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">ARAI / NABL Validated Bus</span>
          </div>
        </div>
      </div>

      {/* Indian Testing Facility Alert */}
      <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
            NABL Accredited Indian Test Facility &amp; Automotive Rig
          </span>
          <p className="text-sm text-slate-300 font-mono mt-0.5">
            {project.indianContextFacility}
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Harness: <strong className="text-slate-300">{project.busTopology.cableType}</strong> ({project.busTopology.busLengthMeters}m span) · Termination: <strong className="text-amber-300">{project.busTopology.terminationMethod.replace(/_/g, ' ')}</strong> · Isolation: <strong className="text-sky-300">{project.busTopology.isolationType.replace(/_/g, ' ')}</strong>
          </p>
        </div>
      </div>

      {/* Design Rules & Engineering Directives */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-300 block border-b border-slate-800 pb-2">
          Engineering Directives &amp; Design Archaeology
        </span>
        <ul className="space-y-2 text-xs text-slate-300">
          {project.designDirectives.map((directive, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">0{idx + 1}.</span>
              <span className="leading-relaxed">{directive}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Workbench with Bus Parameters Loaded */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="text-amber-400">⚡</span>
            Interactive Bit Timing &amp; Load Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Tune bus harness parameters and node traffic to verify bit-sample margins and propagation integrity for this architecture
          </p>
        </div>

        <CanBusWorkbench
          initialStandard={project.protocolStandard}
          initialBaudRateKbps={project.nominalBaudRateKbps}
          initialBusLengthM={project.busTopology.busLengthMeters}
          initialNodes={project.busTopology.nodeCount}
          initialTermination={project.busTopology.terminationMethod}
        />
      </div>
    </div>
  );
}
