'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Download,
  Layers,
  Pause,
  Play,
  RotateCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { Badge, Button, cn } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import { useVenture } from '@/components/social/venture-context';
import { getActiveBuilderIdentity } from '@/lib/builder-identity';
import type {
  BoardSubstrate,
  CopperTraceSegment,
  DrcViolation,
  PcbLayer,
  PcbVia,
  PlacedComponent,
  VeroboardTrackCut,
} from './pcb-types';
import { COMPONENT_CATALOG, getComponentCatalogItem } from './pcb-catalog';
import {
  type CircuitSimulationState,
  resolveCircuitNets,
  stepCircuitSimulation,
} from './pcb-sim-engine';
import { runDesignRuleCheck } from './pcb-drc-checker';
import { buildCompleteManufacturingExport } from './pcb-export-engine';
import { PcbDesignerCanvas } from './pcb-designer-canvas';
import { Pcb3DViewer } from './pcb-3d-viewer';

export interface StarterCircuit {
  name: string;
  substrate: BoardSubstrate;
  components: PlacedComponent[];
  traces: CopperTraceSegment[];
  trackCuts: VeroboardTrackCut[];
}

const STARTER_CIRCUITS: Record<'ne555_flasher' | 'veroboard_audio', StarterCircuit> = {
  ne555_flasher: {
    name: '555 Timer Astable LED Flasher',
    substrate: 'fr4',
    components: [
      {
        id: 'U1',
        typeId: 'ic_ne555',
        name: 'NE555 Timer',
        designator: 'U1',
        x: 60,
        y: 45,
        rotationDeg: 0,
        value: 'NE555P',
        numericValue: 0,
        category: 'Integrated Circuits',
        footprint: getComponentCatalogItem('ic_ne555')!.standardFootprint,
        userParams: { r1: 10000, r2: 47000, c: 0.00001 },
        simState: {},
      },
      {
        id: 'R1',
        typeId: 'res_10k',
        name: 'Timing Resistor R1',
        designator: 'R1',
        x: 40,
        y: 25,
        rotationDeg: 0,
        value: '10kΩ',
        numericValue: 10000,
        category: 'Passives',
        footprint: getComponentCatalogItem('res_10k')!.standardFootprint,
        simState: {},
      },
      {
        id: 'R2',
        typeId: 'res_47k',
        name: 'Timing Resistor R2',
        designator: 'R2',
        x: 40,
        y: 45,
        rotationDeg: 0,
        value: '47kΩ',
        numericValue: 47000,
        category: 'Passives',
        footprint: getComponentCatalogItem('res_47k')!.standardFootprint,
        simState: {},
      },
      {
        id: 'C1',
        typeId: 'cap_10uf',
        name: 'Timing Capacitor',
        designator: 'C1',
        x: 40,
        y: 65,
        rotationDeg: 0,
        value: '10µF',
        numericValue: 10,
        category: 'Passives',
        footprint: getComponentCatalogItem('cap_10uf')!.standardFootprint,
        simState: {},
      },
      {
        id: 'D1',
        typeId: 'led_green',
        name: 'Output Pulse LED',
        designator: 'D1',
        x: 95,
        y: 45,
        rotationDeg: 0,
        value: 'Green 5mm',
        numericValue: 2.1,
        category: 'Diodes & Opto',
        footprint: getComponentCatalogItem('led_green')!.standardFootprint,
        simState: {},
      },
      {
        id: 'V1',
        typeId: 'vcc_5v',
        name: '5V DC Power Source',
        designator: 'V1',
        x: 18,
        y: 20,
        rotationDeg: 0,
        value: '5.0V',
        numericValue: 5,
        category: 'Power & Sources',
        footprint: getComponentCatalogItem('vcc_5v')!.standardFootprint,
        simState: {},
      },
      {
        id: 'G1',
        typeId: 'gnd',
        name: 'System Ground',
        designator: 'G1',
        x: 18,
        y: 75,
        rotationDeg: 0,
        value: '0V GND',
        numericValue: 0,
        category: 'Power & Sources',
        footprint: getComponentCatalogItem('gnd')!.standardFootprint,
        simState: {},
      },
    ],
    traces: [
      { id: 't1', netId: 'vcc', layer: 'top_copper', startX: 18, startY: 20, endX: 52.38, endY: 41.19, widthMm: 0.6 },
      { id: 't2', netId: 'gnd', layer: 'bottom_copper', startX: 18, startY: 75, endX: 52.38, endY: 48.81, widthMm: 0.6 },
      { id: 't3', netId: 'out', layer: 'top_copper', startX: 67.62, endY: 45, endX: 95, startY: 43.73, widthMm: 0.35 },
    ],
    trackCuts: [],
  },
  veroboard_audio: {
    name: 'Veroboard BJT Switch & Buzzer',
    substrate: 'veroboard',
    components: [
      {
        id: 'Q1',
        typeId: 'bjt_2n2222',
        name: '2N2222 NPN Transistor',
        designator: 'Q1',
        x: 50.8,
        y: 40.64,
        rotationDeg: 0,
        value: '2N2222',
        numericValue: 100,
        category: 'Transistors & FETs',
        footprint: getComponentCatalogItem('bjt_2n2222')!.standardFootprint,
        simState: {},
      },
      {
        id: 'SW1',
        typeId: 'btn_push',
        name: 'Tactile Trigger Button',
        designator: 'SW1',
        x: 25.4,
        y: 40.64,
        rotationDeg: 0,
        value: 'Push NO',
        numericValue: 1,
        category: 'Electromechanical',
        footprint: getComponentCatalogItem('btn_push')!.standardFootprint,
        userParams: { isClosed: false },
        simState: {},
      },
      {
        id: 'BZ1',
        typeId: 'buzzer_piezo',
        name: 'Piezo Alarm Buzzer',
        designator: 'BZ1',
        x: 88.9,
        y: 35.56,
        rotationDeg: 0,
        value: '5V Active',
        numericValue: 5,
        category: 'Electromechanical',
        footprint: getComponentCatalogItem('buzzer_piezo')!.standardFootprint,
        simState: {},
      },
      {
        id: 'D1',
        typeId: 'led_red',
        name: 'Indicator Red LED',
        designator: 'D1',
        x: 88.9,
        y: 55.88,
        rotationDeg: 0,
        value: 'Red 5mm',
        numericValue: 1.8,
        category: 'Diodes & Opto',
        footprint: getComponentCatalogItem('led_red')!.standardFootprint,
        simState: {},
      },
      {
        id: 'V1',
        typeId: 'vcc_5v',
        name: '5V Rail',
        designator: 'V1',
        x: 12.7,
        y: 20.32,
        rotationDeg: 0,
        value: '5.0V',
        numericValue: 5,
        category: 'Power & Sources',
        footprint: getComponentCatalogItem('vcc_5v')!.standardFootprint,
        simState: {},
      },
    ],
    traces: [],
    trackCuts: [
      { id: 'c1', x: 45.72, y: 40.64 },
      { id: 'c2', x: 63.5, y: 40.64 },
    ],
  },
};

export function PcbStudio() {
  const labShell = useLabShell();
  const { activeVenture, linkWorkspaceToVenture } = useVenture();
  const [boardTitle, setBoardTitle] = useState('555 Astable Flasher Rev B');
  const [substrate, setSubstrate] = useState<BoardSubstrate>('fr4');
  const [activeLayer, setActiveLayer] = useState<PcbLayer>('top_copper');
  const [activeTool, setActiveTool] = useState<'select' | 'route' | 'cut' | 'via' | 'delete'>('select');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const [components, setComponents] = useState<PlacedComponent[]>(STARTER_CIRCUITS.ne555_flasher.components);
  const [traces, setTraces] = useState<CopperTraceSegment[]>(STARTER_CIRCUITS.ne555_flasher.traces);
  const [vias, setVias] = useState<PcbVia[]>([]);
  const [trackCuts, setTrackCuts] = useState<VeroboardTrackCut[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);

  const [isSimRunning, setIsSimRunning] = useState(true);
  const [simState, setSimState] = useState<CircuitSimulationState>({
    components: STARTER_CIRCUITS.ne555_flasher.components,
    traces: STARTER_CIRCUITS.ne555_flasher.traces,
    trackCuts: [],
    substrate: 'fr4',
    simTimeMs: 0,
    isRunning: true,
    channelAData: [],
    channelBData: [],
    statusMessage: 'Ready',
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showDrcModal, setShowDrcModal] = useState(false);
  const [drcViolations, setDrcViolations] = useState<DrcViolation[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPackage, setExportPackage] = useState<ReturnType<typeof buildCompleteManufacturingExport> | null>(null);
  const [boardSaveStatus, setBoardSaveStatus] = useState<string | null>(null);
  const [quotingRfq, setQuotingRfq] = useState(false);

  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const titleParam = params.get('title')?.trim();
      if (titleParam) {
        setBoardTitle(`${titleParam} PCB`);
      } else if (
        params.get('fromProto') === '1' &&
        activeVenture?.title &&
        activeVenture.id !== 'venture_seed_kaveri_bms'
      ) {
        setBoardTitle(`${activeVenture.title} PCB`);
      }
    }
  }, [activeVenture]);

  const computeBoardSnapshotMeta = () => {
    const widthMm = Math.max(
      80,
      Math.min(300, Math.round(components.reduce((max, c) => Math.max(max, c.x + 15), 85))),
    );
    const heightMm = Math.max(
      60,
      Math.min(250, Math.round(components.reduce((max, c) => Math.max(max, c.y + 15), 65))),
    );
    const layers: 1 | 2 | 4 =
      substrate !== 'fr4'
        ? 1
        : vias.length >= 4
          ? 4
          : 2;
    const bomCsv =
      exportPackage?.bomCsv ?? buildCompleteManufacturingExport(components, traces, vias).bomCsv;
    return {
      widthMm,
      heightMm,
      layers,
      componentsCount: components.length,
      bomCsv,
    };
  };

  useEffect(() => {
    const meta = computeBoardSnapshotMeta();
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: boardTitle.trim() || 'Untitled PCB Revision',
        summary: `${substrate.toUpperCase()} layout · ${meta.widthMm}x${meta.heightMm}mm · ${meta.layers}L · ${components.length} components · ${traces.length} traces`,
        tags: ['pcb', substrate, 'kicad-ready'],
        payload: {
          boardTitle,
          substrate,
          components,
          traces,
          vias,
          trackCuts,
          ...meta,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload;
        if (typeof p.boardTitle === 'string') setBoardTitle(p.boardTitle);
        else setBoardTitle(ws.title);
        if (p.substrate === 'fr4' || p.substrate === 'veroboard' || p.substrate === 'breadboard') {
          setSubstrate(p.substrate);
        }
        if (Array.isArray(p.components)) setComponents(p.components as PlacedComponent[]);
        if (Array.isArray(p.traces)) setTraces(p.traces as CopperTraceSegment[]);
        if (Array.isArray(p.vias)) setVias(p.vias as PcbVia[]);
        if (Array.isArray(p.trackCuts)) setTrackCuts(p.trackCuts as VeroboardTrackCut[]);
        setSelectedCompId(null);
      },
    });
  }, [labShell, boardTitle, substrate, components, traces, vias, trackCuts, exportPackage]);

  useEffect(() => {
    if (!isSimRunning) return;
    const interval = setInterval(() => {
      setSimState((prev) => {
        const next = stepCircuitSimulation(
          {
            ...prev,
            components,
            traces,
            trackCuts,
            substrate,
          },
          20,
        );
        setComponents(next.components);
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isSimRunning, components, traces, trackCuts, substrate]);

  // Crisp Rosepaper White & Pink Oscilloscope Renderer
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#fcf8fa';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(250, 22, 129, 0.10)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const zeroY = h - 16;
    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(w, zeroY);
    ctx.stroke();

    const vScale = 12;

    if (simState.channelAData.length > 1) {
      ctx.strokeStyle = '#e11d74';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      simState.channelAData.forEach((pt, i) => {
        const x = (i / 100) * w;
        const y = zeroY - pt.voltage * vScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    if (simState.channelBData.length > 1) {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      simState.channelBData.forEach((pt, i) => {
        const x = (i / 100) * w;
        const y = zeroY - pt.voltage * vScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [simState.channelAData, simState.channelBData]);

  const loadPreset = (key: 'ne555_flasher' | 'veroboard_audio') => {
    const preset = STARTER_CIRCUITS[key];
    if (!preset) return;
    setBoardTitle(preset.name);
    setSubstrate(preset.substrate);
    setComponents(preset.components);
    setTraces(preset.traces);
    setTrackCuts(preset.trackCuts);
    setSelectedCompId(null);
  };

  const handleRunDrc = () => {
    const violations = runDesignRuleCheck(components, traces);
    setDrcViolations(violations);
    setShowDrcModal(true);
  };

  const handleExport = () => {
    const pkg = buildCompleteManufacturingExport(components, traces, vias);
    setExportPackage(pkg);
    setShowExportModal(true);
  };

  const persistPcbWorkspace = async () => {
    const meta = computeBoardSnapshotMeta();
    const title = boardTitle.trim() || 'Untitled PCB Design';
    const summary = `${substrate.toUpperCase()} PCB · ${meta.widthMm}x${meta.heightMm}mm · ${meta.layers}L · ${components.length} parts · ${traces.length} traces`;
    const payload = {
      boardTitle: title,
      substrate,
      components,
      traces,
      vias,
      trackCuts,
      ...meta,
    };

    if (labShell) {
      const ws = await labShell.saveWorkspace({
        title,
        summary,
        tags: ['pcb', substrate, 'rfq-ready'],
        payload,
      });
      if (ws?.workspaceId) {
        linkWorkspaceToVenture('pcb', ws.workspaceId, 4);
      }
      return ws;
    }

    if (typeof fetch === 'function') {
      const identity = getActiveBuilderIdentity();
      try {
        const res = await fetch('/api/workbenches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'pcb',
            slugOrRoute: '/manufacturing/pcb',
            title,
            summary,
            ownerHandle: identity.handle,
            ownerName: identity.name,
            tags: ['pcb', substrate, 'rfq-ready'],
            payload,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { workspace?: { workspaceId: string } };
          if (data.workspace?.workspaceId) {
            linkWorkspaceToVenture('pcb', data.workspace.workspaceId, 4);
            return data.workspace;
          }
        }
      } catch {}
    }
    return null;
  };

  const handleSaveBoard = async () => {
    await persistPcbWorkspace();
    setBoardSaveStatus('Saved!');
    setTimeout(() => setBoardSaveStatus(null), 2500);
  };

  const handleSaveAndQuoteRfq = async () => {
    setQuotingRfq(true);
    try {
      const saved = await persistPcbWorkspace();
      const targetUrl = saved?.workspaceId
        ? `/manufacturing/rfq?fromWorkspaceId=${encodeURIComponent(saved.workspaceId)}`
        : `/manufacturing/rfq?boardName=${encodeURIComponent(boardTitle.trim() || 'PCB-Design')}`;
      if (typeof window !== 'undefined') {
        window.location.assign(targetUrl);
      }
    } finally {
      setQuotingRfq(false);
    }
  };

  const handleAddComponent = (typeId: string) => {
    const item = getComponentCatalogItem(typeId);
    if (!item) return;

    const count = components.filter((c) => c.typeId === typeId).length + 1;
    const newComp: PlacedComponent = {
      id: `${item.prefix}${count}`,
      typeId: item.typeId,
      name: item.name,
      designator: `${item.prefix}${count}`,
      x: 40 + Math.random() * 40,
      y: 30 + Math.random() * 30,
      rotationDeg: 0,
      value: item.defaultValue,
      numericValue: item.simModel.nominalValue,
      category: item.category,
      footprint: item.standardFootprint,
      userParams: item.typeId.includes('btn') ? { isClosed: false } : {},
      simState: {},
    };

    setComponents([...components, newComp]);
    setSelectedCompId(newComp.id);
  };

  const handleRotateSelected = () => {
    if (!selectedCompId) return;
    setComponents(
      components.map((c) =>
        c.id === selectedCompId ? { ...c, rotationDeg: (c.rotationDeg + 90) % 360 } : c,
      ),
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedCompId) return;
    setComponents(components.filter((c) => c.id !== selectedCompId));
    setSelectedCompId(null);
  };

  const selectedComp = components.find((c) => c.id === selectedCompId);
  const nets = resolveCircuitNets(components, traces, substrate, trackCuts);

  return (
    <div className="flex flex-col h-[calc(100vh-8.25rem)] min-h-[640px] w-full bg-surface-1 text-fg overflow-hidden font-sans">
      {/* 1. TOP ROSEPAPER STUDIO TOOLBAR */}
      <header className="min-h-14 border-b border-hairline bg-surface-1 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-on-solid shadow-xs">
              <Zap className="size-4" aria-hidden="true" />
            </div>
            <input
              type="text"
              aria-label="PCB Project Name"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="w-44 sm:w-52 rounded-lg border border-hairline bg-sunken px-2.5 py-1 text-xs font-display font-bold text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
            <span className="text-[10px] font-mono font-semibold bg-accent/10 text-accent-fg px-2 py-0.5 rounded-full border border-accent/25">
              LIVE SPICE
            </span>
          </div>

          {/* Substrate Selector */}
          <div className="flex items-center bg-sunken p-0.5 rounded-full border border-hairline text-xs">
            {(['fr4', 'veroboard', 'breadboard'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubstrate(s)}
                className={cn(
                  'px-2.5 py-1 rounded-full font-medium transition',
                  substrate === s
                    ? 'bg-accent text-on-solid shadow-xs font-semibold'
                    : 'text-fg-muted hover:text-fg',
                )}
              >
                {s === 'fr4' ? 'FR4 PCB' : s === 'veroboard' ? 'Veroboard' : 'Breadboard'}
              </button>
            ))}
          </div>

          <select
            aria-label="Circuit Preset"
            onChange={(e) => e.target.value && loadPreset(e.target.value as 'ne555_flasher' | 'veroboard_audio')}
            className="text-xs bg-sunken border border-hairline rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
            defaultValue="ne555_flasher"
          >
            <option value="ne555_flasher">Preset: 555 Astable Flasher</option>
            <option value="veroboard_audio">Preset: Veroboard Buzzer</option>
          </select>
        </div>

        {/* Center CAD Tools */}
        <div className="flex flex-wrap items-center gap-1 bg-sunken p-1 rounded-xl border border-hairline">
          <button
            type="button"
            onClick={() => setActiveTool('select')}
            title="Select & Move (V)"
            className={cn(
              'px-2.5 py-1 text-xs rounded-lg transition font-medium',
              activeTool === 'select'
                ? 'bg-accent text-on-solid font-semibold shadow-xs'
                : 'text-fg-muted hover:bg-surface-1 hover:text-fg',
            )}
          >
            Select
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('route')}
            title="Route Copper Trace (W)"
            className={cn(
              'px-2.5 py-1 text-xs rounded-lg transition font-medium',
              activeTool === 'route'
                ? 'bg-accent text-on-solid font-semibold shadow-xs'
                : 'text-fg-muted hover:bg-surface-1 hover:text-fg',
            )}
          >
            Route Trace
          </button>
          {substrate === 'veroboard' && (
            <button
              type="button"
              onClick={() => setActiveTool('cut')}
              title="Track Cut / Break (C)"
              className={cn(
                'px-2.5 py-1 text-xs rounded-lg transition font-medium',
                activeTool === 'cut'
                  ? 'bg-danger text-on-solid font-semibold shadow-xs'
                  : 'text-fg-muted hover:bg-surface-1 hover:text-fg',
              )}
            >
              Track Cut
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTool('via')}
            title="Place Via (T)"
            className={cn(
              'px-2.5 py-1 text-xs rounded-lg transition font-medium',
              activeTool === 'via'
                ? 'bg-accent text-on-solid font-semibold shadow-xs'
                : 'text-fg-muted hover:bg-surface-1 hover:text-fg',
            )}
          >
            Via
          </button>

          <div className="h-4 w-px bg-hairline mx-1" />

          <button
            type="button"
            onClick={() => setActiveLayer('top_copper')}
            className={cn(
              'px-2 py-1 text-xs rounded-lg font-medium transition',
              activeLayer === 'top_copper'
                ? 'bg-accent/15 text-accent-fg border border-accent/30 font-semibold'
                : 'text-fg-subtle hover:text-fg',
            )}
          >
            Top Cu
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('bottom_copper')}
            className={cn(
              'px-2 py-1 text-xs rounded-lg font-medium transition',
              activeLayer === 'bottom_copper'
                ? 'bg-info/15 text-info-fg border border-info/30 font-semibold'
                : 'text-fg-subtle hover:text-fg',
            )}
          >
            Bottom Cu
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-sunken p-0.5 rounded-full border border-hairline text-xs">
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={cn(
                'px-2.5 py-1 rounded-full font-medium transition',
                viewMode === '2d' ? 'bg-surface-1 text-fg font-semibold shadow-xs' : 'text-fg-muted',
              )}
            >
              2D Canvas
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={cn(
                'px-2.5 py-1 rounded-full font-medium transition',
                viewMode === '3d' ? 'bg-surface-1 text-fg font-semibold shadow-xs' : 'text-fg-muted',
              )}
            >
              3D WebGL
            </button>
          </div>

          <Button
            size="sm"
            variant={isSimRunning ? 'soft' : 'secondary'}
            onClick={() => setIsSimRunning(!isSimRunning)}
          >
            {isSimRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            <span>{isSimRunning ? 'Pause Sim' : 'Run Sim'}</span>
          </Button>

          <Button size="sm" variant="secondary" onClick={handleRunDrc}>
            <ShieldAlert className="size-3.5" />
            <span>DRC Check</span>
          </Button>

          {labShell && (
            <Button size="sm" variant="secondary" onClick={() => void handleSaveBoard()}>
              <Save className="size-3.5" />
              <span>{boardSaveStatus ?? 'Save Board'}</span>
            </Button>
          )}

          <Button size="sm" variant="primary" onClick={handleExport}>
            <Download className="size-3.5" />
            <span>Export Gerber/BOM</span>
          </Button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT COMPONENT CATALOG */}
        <aside className="w-60 sm:w-64 border-r border-hairline bg-surface-1 flex flex-col shrink-0">
          <div className="p-3 border-b border-hairline">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-fg-muted mb-2">
              Component Library
            </h2>
            <div className="flex flex-wrap gap-1">
              {['All', 'Passives', 'Diodes & Opto', 'Transistors', 'ICs', 'Electro'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full transition font-medium border',
                    activeCategory === cat
                      ? 'bg-accent text-on-solid border-accent font-semibold'
                      : 'bg-sunken border-hairline text-fg-muted hover:text-fg',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {COMPONENT_CATALOG.filter((item) =>
              activeCategory === 'All'
                ? true
                : item.category.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4)),
            ).map((item) => (
              <div
                key={item.typeId}
                onClick={() => handleAddComponent(item.typeId)}
                className="group p-2.5 rounded-xl bg-sunken/70 hover:bg-accent-soft/70 border border-hairline hover:border-accent/40 cursor-pointer transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-fg group-hover:text-accent-fg truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-fg-subtle truncate">
                    {item.defaultValue} · {item.standardFootprint.packageType}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-surface-1 border border-hairline group-hover:bg-accent group-hover:text-on-solid group-hover:border-accent text-fg-muted rounded-full font-semibold shrink-0">
                  + Add
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER CANVAS / 3D VIEWER */}
        <main className="flex-1 relative bg-sunken flex flex-col overflow-hidden min-w-0">
          {viewMode === '2d' ? (
            <PcbDesignerCanvas
              substrate={substrate}
              activeLayer={activeLayer}
              activeTool={activeTool}
              components={components}
              traces={traces}
              vias={vias}
              trackCuts={trackCuts}
              nets={nets}
              selectedComponentId={selectedCompId}
              onSelectComponent={setSelectedCompId}
              onUpdateComponentPosition={(id, x, y) => {
                setComponents(components.map((c) => (c.id === id ? { ...c, x, y } : c)));
              }}
              onAddTrace={(trace) => setTraces([...traces, trace])}
              onToggleTrackCut={(x, y) => {
                const existing = trackCuts.find((c) => Math.hypot(c.x - x, c.y - y) < 1.0);
                if (existing) {
                  setTrackCuts(trackCuts.filter((c) => c.id !== existing.id));
                } else {
                  setTrackCuts([...trackCuts, { id: `cut_${Date.now()}`, x, y }]);
                }
              }}
              onAddVia={(x, y) => {
                setVias([
                  ...vias,
                  {
                    id: `via_${Date.now()}`,
                    netId: 'vcc',
                    x,
                    y,
                    outerDiameterMm: 0.8,
                    drillDiameterMm: 0.4,
                  },
                ]);
              }}
              onToggleComponentParam={(id, key, val) => {
                setComponents(
                  components.map((c) =>
                    c.id === id ? { ...c, userParams: { ...c.userParams, [key]: val } } : c,
                  ),
                );
              }}
            />
          ) : (
            <Pcb3DViewer
              substrate={substrate}
              components={components}
              traces={traces}
              vias={vias}
            />
          )}

          {selectedComp && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-surface-1/95 backdrop-blur border border-hairline rounded-full px-3.5 py-1.5 shadow-md flex items-center space-x-2.5 text-xs">
              <span className="font-semibold text-accent-fg">
                {selectedComp.id}: {selectedComp.name}
              </span>
              <button
                type="button"
                onClick={handleRotateSelected}
                className="px-2 py-0.5 bg-sunken hover:bg-surface-2 border border-hairline text-fg rounded-full inline-flex items-center gap-1"
              >
                <RotateCw className="size-3" /> Rotate 90°
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="px-2 py-0.5 bg-danger/10 hover:bg-danger/20 text-danger-fg rounded-full border border-danger/30 inline-flex items-center gap-1"
              >
                <Trash2 className="size-3" /> Delete
              </button>
            </div>
          )}
        </main>

        {/* RIGHT INSPECTOR & OSCILLOSCOPE */}
        <aside className="w-72 xl:w-80 border-l border-hairline bg-surface-1 flex flex-col shrink-0">
          {/* 2-Channel Oscilloscope */}
          <div className="p-3.5 border-b border-hairline">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-fg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Live 2-CH Scope
              </span>
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <span className="text-accent-fg font-semibold">CH A (Out)</span>
                <span className="text-info-fg font-semibold">CH B (Cap)</span>
              </div>
            </div>
            <div className="w-full h-32 rounded-xl bg-sunken border border-hairline overflow-hidden relative">
              <canvas
                ref={scopeCanvasRef}
                width={300}
                height={128}
                className="w-full h-full block"
              />
              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-fg-subtle">
                20ms/div · 1V/div
              </div>
            </div>
          </div>

          {/* Bus & Net Stats */}
          <div className="p-3.5 border-b border-hairline">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-fg-muted mb-2 block">
              Digital Multimeter &amp; Telemetry
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-sunken p-2.5 rounded-xl border border-hairline">
                <div className="text-[10px] text-fg-subtle">VCC Bus</div>
                <div className="text-base font-bold text-accent-fg font-mono">5.00 V</div>
              </div>
              <div className="bg-sunken p-2.5 rounded-xl border border-hairline">
                <div className="text-[10px] text-fg-subtle">Total Nets</div>
                <div className="text-base font-bold text-success-fg font-mono">{nets.length}</div>
              </div>
            </div>
          </div>

          {/* Component Inspector */}
          <div className="flex-1 overflow-y-auto p-3.5">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-fg-muted mb-2.5 block">
              Component Inspector
            </span>

            {selectedComp ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-fg-muted">Designator</label>
                  <input
                    type="text"
                    value={selectedComp.id}
                    disabled
                    className="w-full mt-1 bg-sunken border border-hairline rounded-lg px-2.5 py-1.5 text-fg font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-fg-muted">Nominal Value</label>
                  <input
                    type="text"
                    value={selectedComp.value}
                    onChange={(e) => {
                      setComponents(
                        components.map((c) =>
                          c.id === selectedComp.id ? { ...c, value: e.target.value } : c,
                        ),
                      );
                    }}
                    className="w-full mt-1 bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-accent-fg font-mono focus:border-accent focus:outline-none"
                  />
                </div>

                {selectedComp.typeId === 'pot_10k' && (
                  <div>
                    <label className="text-[10px] font-semibold text-fg-muted">
                      Wiper Position: {Math.round(Number(selectedComp.userParams?.wiperRatio ?? 0.5) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={Number(selectedComp.userParams?.wiperRatio ?? 0.5)}
                      onChange={(e) => {
                        setComponents(
                          components.map((c) =>
                            c.id === selectedComp.id
                              ? { ...c, userParams: { ...c.userParams, wiperRatio: parseFloat(e.target.value) } }
                              : c,
                          ),
                        );
                      }}
                      className="w-full mt-1 accent-accent"
                    />
                  </div>
                )}

                {selectedComp.typeId === 'ldr_gl5528' && (
                  <div>
                    <label className="text-[10px] font-semibold text-fg-muted">
                      Ambient Lux: {selectedComp.userParams?.lux ?? 500} Lux
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="2000"
                      step="50"
                      value={Number(selectedComp.userParams?.lux ?? 500)}
                      onChange={(e) => {
                        setComponents(
                          components.map((c) =>
                            c.id === selectedComp.id
                              ? { ...c, userParams: { ...c.userParams, lux: parseInt(e.target.value, 10) } }
                              : c,
                          ),
                        );
                      }}
                      className="w-full mt-1 accent-accent"
                    />
                  </div>
                )}

                <div className="bg-sunken p-2.5 rounded-xl border border-hairline space-y-1.5">
                  <div className="text-[10px] font-bold text-fg-muted uppercase flex items-center gap-1">
                    <Activity className="size-3 text-accent" /> Live Dynamic State
                  </div>
                  {selectedComp.simState.illumination !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span>Brightness:</span>
                      <span className="text-accent-fg font-semibold">
                        {Math.round(selectedComp.simState.illumination * 100)}%
                      </span>
                    </div>
                  )}
                  {selectedComp.simState.currentMa !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span>Current:</span>
                      <span className="text-success-fg font-semibold">{selectedComp.simState.currentMa} mA</span>
                    </div>
                  )}
                  {selectedComp.simState.oscillatorFreqHz !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span>Freq:</span>
                      <span className="text-info-fg font-semibold">{selectedComp.simState.oscillatorFreqHz} Hz</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-fg-subtle p-4 text-center rounded-xl border border-dashed border-hairline bg-sunken/50">
                Click any component on the canvas to inspect pins, edit values, or toggle switches.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. DRC MODAL */}
      {showDrcModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4"
        >
          <div className="bg-surface-1 border border-hairline rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-overlay space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
                <span>Design Rule Check (DRC)</span>
                <Badge tone={drcViolations.length === 0 ? 'success' : 'warning'} variant="solid">
                  {drcViolations.length} Violations
                </Badge>
              </h3>
              <button
                type="button"
                onClick={() => setShowDrcModal(false)}
                className="rounded-full p-1 text-fg-subtle hover:bg-surface-2 hover:text-fg"
                aria-label="Close DRC results"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {drcViolations.length === 0 ? (
                <div className="p-4 bg-success/10 border border-success/30 rounded-xl text-success-fg text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Board passed all DRC checks! Clearance, trace widths, and vias are fab-ready.</span>
                </div>
              ) : (
                drcViolations.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-sunken border border-hairline text-xs flex items-start gap-2.5"
                  >
                    <span className={v.severity === 'error' ? 'text-danger-fg font-bold' : 'text-warning-fg font-bold'}>
                      {v.severity === 'error' ? '✖' : '⚠'}
                    </span>
                    <div>
                      <div className="font-semibold text-fg">{v.code}</div>
                      <div className="text-fg-muted text-[11px]">{v.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button variant="secondary" className="w-full" onClick={() => setShowDrcModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 4. MANUFACTURING EXPORTS MODAL */}
      {showExportModal && exportPackage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/35 backdrop-blur-sm p-4"
        >
          <div className="bg-surface-1 border border-hairline rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-overlay space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
                <Layers className="size-4 text-accent" />
                <span>Manufacturing &amp; Fabrication Package</span>
                <Badge tone="accent" variant="outline" className="font-mono text-[11px]">
                  RS-274X + Excellon + BOM
                </Badge>
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="rounded-full p-1 text-fg-subtle hover:bg-surface-2 hover:text-fg"
                aria-label="Close export modal"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-sunken rounded-xl border border-hairline">
                <div className="font-bold text-fg mb-1.5">Gerber RS-274X Layers</div>
                <ul className="text-fg-muted space-y-1 text-[11px]">
                  <li>• Top Copper (.GTL)</li>
                  <li>• Bottom Copper (.GBL)</li>
                  <li>• Top Silkscreen (.GTO)</li>
                  <li>• Edge Cuts (.GKO)</li>
                </ul>
              </div>

              <div className="p-3.5 bg-sunken rounded-xl border border-hairline">
                <div className="font-bold text-fg mb-1.5">Assembly &amp; Netlist Files</div>
                <ul className="text-fg-muted space-y-1 text-[11px]">
                  <li>• Excellon NC Drill (.DRL)</li>
                  <li>• Bill of Materials (.CSV)</li>
                  <li>• Pick &amp; Place Centroid (.CSV)</li>
                  <li>• KiCad PCB Netlist (.NET)</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-fg-muted mb-1">BOM Preview:</div>
              <pre className="p-3 bg-sunken rounded-xl border border-hairline text-[10px] font-mono text-fg max-h-36 overflow-y-auto">
                {exportPackage.bomCsv}
              </pre>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  const blob = new Blob([exportPackage.bomCsv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${boardTitle.replace(/\s+/g, '-')}-BOM.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download BOM.csv
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  const blob = new Blob([exportPackage.gerberTopCopper], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${boardTitle.replace(/\s+/g, '-')}-TopCopper.gtl`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download Gerber TopCopper
              </Button>
            </div>

            <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="soft"
                className="w-full sm:w-auto flex-1"
                loading={quotingRfq}
                onClick={() => void handleSaveAndQuoteRfq()}
              >
                <span>Save &amp; Quote Board in Instant RFQ →</span>
              </Button>

              <div className="flex items-center gap-2 text-xs">
                <Link
                  href="/manufacturing/rfq"
                  className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-3 py-1.5 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
                >
                  <span>Instant RFQ</span>
                  <ArrowRight className="size-3" />
                </Link>
                <Link
                  href="/compliance"
                  className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-3 py-1.5 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
                >
                  <ShieldCheck className="size-3 text-accent" />
                  <span>Compliance</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
