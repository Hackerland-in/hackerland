'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CORRIDOR_META } from '@hackerland/core';
import { Badge, Button, Card, cn } from '@hackerland/ui';
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Plane,
  Save,
  ShieldCheck,
} from 'lucide-react';
import {
  EXPORT_ARCHETYPE_METADATA,
  EXPORT_CORRIDORS_CATALOG,
  type ExportCorridorPlaybook,
} from '@/lib/data/export-trade-data';
import { useLabShell, type SavedLabWorkspaceItem } from '@/components/labs/full-screen-lab-shell';
import {
  IncotermsMarginCalculator,
  type IncotermsCalculatorSnapshotState,
} from './incoterms-margin-calculator';
import { ExportRegulatoryBridge } from './export-regulatory-bridge';

interface CorridorDetailViewProps {
  playbook: ExportCorridorPlaybook;
}

export function CorridorDetailView({ playbook }: CorridorDetailViewProps) {
  const labShell = useLabShell();
  const meta = CORRIDOR_META[playbook.corridorId];
  const recommendedArch = playbook.recommendedArchetypes[0] ?? 'iot_wireless';
  const recommendedHsn = EXPORT_ARCHETYPE_METADATA[recommendedArch].defaultHsnCode;

  const latestCalcStateRef = useRef<IncotermsCalculatorSnapshotState | null>(null);
  const [restoredState, setRestoredState] =
    useState<Partial<IncotermsCalculatorSnapshotState> | null>(null);

  const handleCalcStateChange = useCallback((state: IncotermsCalculatorSnapshotState) => {
    latestCalcStateRef.current = state;
  }, []);

  useEffect(() => {
    if (!labShell) return;
    labShell.registerSnapshotHandlers({
      getSnapshot: () => {
        const snap = latestCalcStateRef.current;
        return {
          title: `${playbook.shortName} Export Scenario (${snap?.hsnCode ?? recommendedHsn} · ${snap?.selectedIncoterm ?? 'CIF'})`,
          summary: snap
            ? `${snap.quantity} units @ EXW ₹${snap.exWorksCostInr.toLocaleString('en-IN')}, DVA ${100 - snap.importedBomPercent}% (${snap.selectedIncoterm})`
            : playbook.ftaPerkSummary,
          tags: ['export_trade', playbook.corridorId, snap?.hsnCode ?? recommendedHsn],
          payload: {
            corridorSlug: playbook.slug,
            corridorId: playbook.corridorId,
            ...(snap ?? {}),
          },
        };
      },
      onLoad: (ws: SavedLabWorkspaceItem) => {
        const p = ws.payload as Partial<IncotermsCalculatorSnapshotState> | undefined;
        if (!p) return;
        setRestoredState({ ...p });
      },
    });
  }, [labShell, playbook.corridorId, playbook.ftaPerkSummary, playbook.shortName, playbook.slug, recommendedHsn]);

  const handleSaveScenario = async () => {
    if (!labShell) return;
    const snap = latestCalcStateRef.current;
    await labShell.saveWorkspace({
      title: `${playbook.shortName} Scenario — HSN ${snap?.hsnCode ?? recommendedHsn}`,
      summary: `${snap?.quantity ?? 500} units · ${snap?.selectedIncoterm ?? 'CIF'} · DVA ${100 - (snap?.importedBomPercent ?? 40)}%`,
      tags: ['export_trade', playbook.corridorId, snap?.hsnCode ?? recommendedHsn],
      payload: {
        corridorSlug: playbook.slug,
        corridorId: playbook.corridorId,
        ...(snap ?? {}),
      },
      publishToFeed: false,
    });
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Top Navigation & Corridor Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3">
        <Link
          href="/export"
          className="inline-flex items-center gap-1.5 font-mono text-body-xs text-fg-muted hover:text-accent-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Global Export &amp; Trade Hub</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1.5">
          {EXPORT_CORRIDORS_CATALOG.map((item) => {
            const active = item.slug === playbook.slug;
            return (
              <Link
                key={item.slug}
                href={`/export/${item.slug}`}
                className={cn(
                  'rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors',
                  active
                    ? 'border-accent bg-accent text-on-solid'
                    : 'border-hairline bg-sunken text-fg-muted hover:border-accent/40 hover:text-accent-fg',
                )}
              >
                {item.shortName}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Playbook Hero Card */}
      <Card className="border-accent/25 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={meta.ftaAvailable ? 'success' : 'accent'} variant="solid">
              {playbook.ftaBadge}
            </Badge>
            <Badge tone="neutral" variant="outline">
              Corridor: {playbook.corridorId.toUpperCase()}
            </Badge>
          </div>
          {labShell && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={labShell.saving}
              onClick={handleSaveScenario}
            >
              <Save className="size-3.5" />
              <span>Save Corridor Snapshot</span>
            </Button>
          )}
        </div>

        <div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            {playbook.name}
          </h1>
          <p className="mt-1 text-body-xs font-mono font-semibold text-accent-fg">
            {playbook.regionTagline}
          </p>
          <p className="mt-2 text-body-sm text-fg-muted leading-relaxed max-w-3xl">
            {playbook.headline} {playbook.ftaPerkSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-hairline text-xs font-mono">
          <div className="rounded-xl border border-hairline bg-surface-1 p-3 space-y-1">
            <span className="text-[10px] text-fg-subtle flex items-center gap-1">
              <Anchor className="size-3 text-accent-fg" /> INDIAN EXIT PORTS
            </span>
            <span className="font-bold text-fg block">
              {playbook.indianOriginPorts.join(' · ')}
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3 space-y-1">
            <span className="text-[10px] text-fg-subtle flex items-center gap-1">
              <Plane className="size-3 text-accent-fg" /> DESTINATION HUBS
            </span>
            <span className="font-bold text-fg block">
              {playbook.destinationPorts.join(' · ')}
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3 space-y-1">
            <span className="text-[10px] text-fg-subtle block">TRANSIT BENCHMARK</span>
            <span className="font-bold text-fg block">
              Sea {playbook.seaTransitDays} · Air {playbook.airTransitDays}
            </span>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-1 p-3 space-y-1">
            <span className="text-[10px] text-fg-subtle block">LCL FREIGHT BASELINE</span>
            <span className="font-bold text-accent-fg block">
              ₹{meta.defaultFreightPerShipmentInr.toLocaleString('en-IN')}/shipment
            </span>
          </div>
        </div>
      </Card>

      {/* Pre-Set Interactive Incoterms Calculator */}
      <IncotermsMarginCalculator
        initialCorridor={playbook.corridorId}
        lockedCorridor
        initialHsnCode={recommendedHsn}
        externalState={restoredState}
        onStateChange={handleCalcStateChange}
      />

      {/* Pre-Set Regulatory Bridge */}
      <ExportRegulatoryBridge
        initialCorridor={playbook.corridorId}
        lockedCorridor
        initialArchetype={recommendedArch}
      />

      {/* Deep Corridor Playbook: Customs, Docs, Buyer Audit & Portals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 border-hairline bg-surface-1 p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-fg">
              <ShieldCheck className="size-4 text-accent-fg" />
              <span>Customs, ICEGATE &amp; Freight Execution Playbook</span>
            </div>
            <ul className="space-y-2.5">
              {playbook.customsNotes.map((note, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-hairline bg-sunken p-3 text-body-xs text-fg"
                >
                  <CheckCircle2 className="size-4 text-success-fg shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-2 border-t border-hairline">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
              Buyer Onboarding &amp; Technical Qualification Expectations
            </h3>
            <ul className="space-y-2">
              {playbook.buyerQualificationTips.map((tip, idx) => (
                <li key={idx} className="text-body-xs text-fg-muted leading-relaxed flex gap-2">
                  <span className="text-accent-fg font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="border-hairline bg-surface-1 p-5 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
              Corridor-Specific Clearance Dossier
            </h3>
            <ul className="space-y-2 text-body-xs text-fg-muted">
              {playbook.extraCorridorDocs.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <FileText className="size-3.5 text-accent-fg shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-fg">
              Official Trade &amp; Tariff Portals
            </h3>
            <div className="space-y-2">
              {playbook.officialPortals.map((portal) => (
                <a
                  key={portal.label}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-hairline bg-sunken p-3 hover:border-accent/50 transition-colors group"
                >
                  <div className="flex items-center justify-between text-xs font-mono font-semibold text-fg group-hover:text-accent-fg">
                    <span>{portal.label}</span>
                    <ExternalLink className="size-3 text-fg-subtle" />
                  </div>
                  <div className="text-[11px] text-fg-muted mt-0.5">{portal.purpose}</div>
                </a>
              ))}
            </div>
          </Card>

          <Card className="border-accent/25 bg-accent-soft/40 p-4 space-y-2.5 text-body-xs">
            <div className="font-mono text-[11px] font-bold uppercase text-accent-fg">
              Complete Export Readiness Stack
            </div>
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              <Link href="/export?tab=paperwork" className="text-fg hover:text-accent-fg inline-flex items-center gap-1">
                <span>10-Step DGFT Paperwork &amp; PLI Matchmaker</span>
                <ArrowRight className="size-3" />
              </Link>
              <Link href="/compliance" className="text-fg hover:text-accent-fg inline-flex items-center gap-1">
                <span>BIS / WPC / AIS-156 NABL Baseline</span>
                <ArrowRight className="size-3" />
              </Link>
              <Link href="/sourcing" className="text-fg hover:text-accent-fg inline-flex items-center gap-1">
                <span>Dual-Source BOM &amp; India Alternates</span>
                <ArrowRight className="size-3" />
              </Link>
              <Link href="/network/ip" className="text-fg hover:text-accent-fg inline-flex items-center gap-1">
                <span>IP Defense &amp; Copyleft Prior Art Audit</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
