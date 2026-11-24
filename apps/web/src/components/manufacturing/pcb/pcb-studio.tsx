'use client';

import React, { useState, useEffect, useRef } from 'react';
import type {
  BoardSubstrate,
  PcbLayer,
  PlacedComponent,
  CopperTraceSegment,
  PcbVia,
  VeroboardTrackCut,
  DrcViolation,
} from './pcb-types';
import { COMPONENT_CATALOG, getComponentCatalogItem } from './pcb-catalog';
import {
  type CircuitSimulationState,
  stepCircuitSimulation,
  resolveCircuitNets,
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

// Curated starter circuits
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
      { id: 't1', netId: 'vcc', layer: 'top_copper', startX: 18, startY: 20, endX: 52.38, endY: 41.19, widthMm: 0.6 }, // V1 to Pin 8
      { id: 't2', netId: 'gnd', layer: 'bottom_copper', startX: 18, startY: 75, endX: 52.38, endY: 48.81, widthMm: 0.6 }, // G1 to Pin 1
      { id: 't3', netId: 'out', layer: 'top_copper', startX: 67.62, endY: 45, endX: 95, startY: 43.73, widthMm: 0.35 }, // Pin 3 to LED
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

/** Random offset for newly placed parts so they do not stack exactly. */
const jitter = (base: number, range: number) => base + Math.random() * range;

export function PcbStudio() {
  const [substrate, setSubstrate] = useState<BoardSubstrate>('fr4');
  const [activeLayer, setActiveLayer] = useState<PcbLayer>('top_copper');
  const [activeTool, setActiveTool] = useState<'select' | 'route' | 'cut' | 'via' | 'delete'>('select');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  // Circuit entities
  const [components, setComponents] = useState<PlacedComponent[]>(STARTER_CIRCUITS.ne555_flasher.components);
  const [traces, setTraces] = useState<CopperTraceSegment[]>(STARTER_CIRCUITS.ne555_flasher.traces);
  const [vias, setVias] = useState<PcbVia[]>([]);
  const [trackCuts, setTrackCuts] = useState<VeroboardTrackCut[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);

  // Simulation State
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

  // UI state for panels and exports
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showDrcModal, setShowDrcModal] = useState(false);
  const [drcViolations, setDrcViolations] = useState<DrcViolation[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPackage, setExportPackage] = useState<ReturnType<typeof buildCompleteManufacturingExport> | null>(null);

  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation loop tick (every 40ms = 25Hz)
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
          20
        );
        // Sync back updated component states (LED glow, 555 output)
        setComponents(next.components);
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isSimRunning, components, traces, trackCuts, substrate]);

  // Live Oscilloscope Canvas Renderer
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark screen
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    // Oscilloscope Grid Lines
    ctx.strokeStyle = '#1e293b';
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

    // Zero Volt Baseline
    const zeroY = h - 15;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(w, zeroY);
    ctx.stroke();

    // Scale: 5V corresponds to approx 60px height
    const vScale = 12; // px per volt

    // Plot Channel A (Yellow)
    if (simState.channelAData.length > 1) {
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      simState.channelAData.forEach((pt, i) => {
        const x = (i / 100) * w;
        const y = zeroY - pt.voltage * vScale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Plot Channel B (Cyan)
    if (simState.channelBData.length > 1) {
      ctx.strokeStyle = '#06b6d4';
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

  // Load Preset Circuit
  const loadPreset = (key: 'ne555_flasher' | 'veroboard_audio') => {
    const preset = STARTER_CIRCUITS[key];
    if (!preset) return;
    setSubstrate(preset.substrate);
    setComponents(preset.components);
    setTraces(preset.traces);
    setTrackCuts(preset.trackCuts);
    setSelectedCompId(null);
  };

  // Run DRC
  const handleRunDrc = () => {
    const violations = runDesignRuleCheck(components, traces);
    setDrcViolations(violations);
    setShowDrcModal(true);
  };

  // Build Exports
  const handleExport = () => {
    const pkg = buildCompleteManufacturingExport(components, traces, vias);
    setExportPackage(pkg);
    setShowExportModal(true);
  };

  // Add Component from Catalog
  const handleAddComponent = (typeId: string) => {
    const item = getComponentCatalogItem(typeId);
    if (!item) return;

    const count = components.filter((c) => c.typeId === typeId).length + 1;
    const newComp: PlacedComponent = {
      id: `${item.prefix}${count}`,
      typeId: item.typeId,
      name: item.name,
      designator: `${item.prefix}${count}`,
      x: jitter(40, 40),
      y: jitter(30, 30),
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

  // Rotate selected component
  const handleRotateSelected = () => {
    if (!selectedCompId) return;
    setComponents(
      components.map((c) =>
        c.id === selectedCompId ? { ...c, rotationDeg: (c.rotationDeg + 90) % 360 } : c
      )
    );
  };

  // Delete selected component
  const handleDeleteSelected = () => {
    if (!selectedCompId) return;
    setComponents(components.filter((c) => c.id !== selectedCompId));
    setSelectedCompId(null);
  };

  const selectedComp = components.find((c) => c.id === selectedCompId);
  const nets = resolveCircuitNets(components, traces, substrate, trackCuts);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP STUDIO TOOLBAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow">
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                PCB & Real-Time Circuit Studio
                <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  LIVE SPICE
                </span>
              </h1>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-700 mx-2" />

          {/* Substrate Selector */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded border border-slate-700 text-xs">
            {(['fr4', 'veroboard', 'breadboard'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSubstrate(s)}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  substrate === s
                    ? 'bg-amber-500 text-slate-950 shadow font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'fr4' ? 'FR4 Multi-Layer' : s === 'veroboard' ? 'Veroboard' : 'Breadboard'}
              </button>
            ))}
          </div>

          {/* Presets */}
          <select
            onChange={(e) => e.target.value && loadPreset(e.target.value as Parameters<typeof loadPreset>[0])}
            className="text-xs bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
            defaultValue="ne555_flasher"
          >
            <option value="ne555_flasher">Preset: 555 Astable LED Flasher</option>
            <option value="veroboard_audio">Preset: Veroboard BJT Switch & Buzzer</option>
          </select>
        </div>

        {/* Center Tool Buttons */}
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setActiveTool('select')}
            title="Select & Move (V)"
            className={`px-2.5 py-1 text-xs rounded transition flex items-center space-x-1 ${
              activeTool === 'select' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>↖ Select</span>
          </button>
          <button
            onClick={() => setActiveTool('route')}
            title="Route Copper Trace (W)"
            className={`px-2.5 py-1 text-xs rounded transition flex items-center space-x-1 ${
              activeTool === 'route' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>〰 Route</span>
          </button>
          {substrate === 'veroboard' && (
            <button
              onClick={() => setActiveTool('cut')}
              title="Track Cut / Break (C)"
              className={`px-2.5 py-1 text-xs rounded transition flex items-center space-x-1 ${
                activeTool === 'cut' ? 'bg-red-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>✂ Track Cut</span>
            </button>
          )}
          <button
            onClick={() => setActiveTool('via')}
            title="Place Via (T)"
            className={`px-2.5 py-1 text-xs rounded transition flex items-center space-x-1 ${
              activeTool === 'via' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>◎ Via</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Active Copper Layer Switcher */}
          <button
            onClick={() => setActiveLayer('top_copper')}
            className={`px-2 py-0.5 text-xs rounded font-medium ${
              activeLayer === 'top_copper' ? 'bg-red-600 text-white font-semibold' : 'text-red-400 hover:bg-slate-700'
            }`}
          >
            Top Cu
          </button>
          <button
            onClick={() => setActiveLayer('bottom_copper')}
            className={`px-2 py-0.5 text-xs rounded font-medium ${
              activeLayer === 'bottom_copper' ? 'bg-blue-600 text-white font-semibold' : 'text-blue-400 hover:bg-slate-700'
            }`}
          >
            Bottom Cu
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 p-0.5 rounded border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                viewMode === '2d' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              2D Canvas
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                viewMode === '3d' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              3D WebGL
            </button>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimRunning(!isSimRunning)}
            className={`px-3 py-1 text-xs font-semibold rounded flex items-center space-x-1 transition ${
              isSimRunning
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
            }`}
          >
            <span>{isSimRunning ? '⏸ Pause Sim' : '▶ Run Sim'}</span>
          </button>

          {/* DRC Checker */}
          <button
            onClick={handleRunDrc}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded font-medium"
          >
            DRC Check
          </button>

          {/* Export Fabrication */}
          <button
            onClick={handleExport}
            className="px-3 py-1 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded shadow transition"
          >
            Export Gerber/BOM
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COMPONENT CATALOG PALETTE */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Component Library
            </h2>
            <div className="flex flex-wrap gap-1">
              {['All', 'Passives', 'Diodes & Opto', 'Transistors', 'ICs', 'Electro'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded transition ${
                    activeCategory === cat ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {COMPONENT_CATALOG.filter((item) =>
              activeCategory === 'All' ? true : item.category.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4))
            ).map((item) => (
              <div
                key={item.typeId}
                onClick={() => handleAddComponent(item.typeId)}
                className="group p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {item.defaultValue} • {item.standardFootprint.packageType}
                  </div>
                </div>
                <button className="text-[10px] px-1.5 py-0.5 bg-slate-700 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 rounded font-semibold">
                  + Add
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER STAGE (2D Canvas or 3D WebGL Viewer) */}
        <main className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
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
                    c.id === id ? { ...c, userParams: { ...c.userParams, [key]: val } } : c
                  )
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

          {/* Floating Selected Component Quick Toolbar */}
          {selectedComp && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-xl flex items-center space-x-3 text-xs">
              <span className="font-semibold text-amber-400">
                {selectedComp.id}: {selectedComp.name}
              </span>
              <button
                onClick={handleRotateSelected}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
              >
                ↻ Rotate 90°
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-2 py-0.5 bg-red-950 hover:bg-red-900 text-red-300 rounded border border-red-800"
              >
                ✕ Delete
              </button>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR: INSPECTOR & OSCILLOSCOPE */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
          {/* Real-time 2-Channel Oscilloscope */}
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live 2-CH Oscilloscope
              </span>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="text-yellow-400 font-mono">CH A (Out)</span>
                <span className="text-cyan-400 font-mono">CH B (Cap/LED)</span>
              </div>
            </div>
            <div className="w-full h-32 rounded bg-slate-950 border border-slate-800 overflow-hidden relative">
              <canvas
                ref={scopeCanvasRef}
                width={300}
                height={128}
                className="w-full h-full block"
              />
              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-500">
                20ms/div • 1V/div
              </div>
            </div>
          </div>

          {/* Digital Multimeter / Node Telemetry */}
          <div className="p-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Digital Multimeter & Telemetry
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">VCC Bus</div>
                <div className="text-base font-bold text-amber-400 font-mono">5.00 V</div>
              </div>
              <div className="bg-slate-800/60 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Nets</div>
                <div className="text-base font-bold text-emerald-400 font-mono">{nets.length}</div>
              </div>
            </div>
          </div>

          {/* Component Parameter Inspector */}
          <div className="flex-1 overflow-y-auto p-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Component Inspector
            </span>

            {selectedComp ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400">Designator</label>
                  <input
                    type="text"
                    value={selectedComp.id}
                    disabled
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Nominal Value</label>
                  <input
                    type="text"
                    value={selectedComp.value}
                    onChange={(e) => {
                      setComponents(
                        components.map((c) =>
                          c.id === selectedComp.id ? { ...c, value: e.target.value } : c
                        )
                      );
                    }}
                    className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-amber-400 font-mono"
                  />
                </div>

                {/* Interactive Controls based on component type */}
                {selectedComp.typeId === 'pot_10k' && (
                  <div>
                    <label className="text-[10px] text-slate-400">
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
                              : c
                          )
                        );
                      }}
                      className="w-full mt-1 accent-amber-500"
                    />
                  </div>
                )}

                {selectedComp.typeId === 'ldr_gl5528' && (
                  <div>
                    <label className="text-[10px] text-slate-400">
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
                              ? { ...c, userParams: { ...c.userParams, lux: parseInt(e.target.value) } }
                              : c
                          )
                        );
                      }}
                      className="w-full mt-1 accent-amber-500"
                    />
                  </div>
                )}

                {/* Live Node Voltage Readings */}
                <div className="bg-slate-800/40 p-2 rounded border border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Live Dynamic State</div>
                  {selectedComp.simState.illumination !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span>Brightness:</span>
                      <span className="text-amber-400">
                        {Math.round(selectedComp.simState.illumination * 100)}%
                      </span>
                    </div>
                  )}
                  {selectedComp.simState.currentMa !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span>Current:</span>
                      <span className="text-emerald-400">{selectedComp.simState.currentMa} mA</span>
                    </div>
                  )}
                  {selectedComp.simState.oscillatorFreqHz !== undefined && (
                    <div className="flex justify-between font-mono">
                      <span>Freq:</span>
                      <span className="text-cyan-400">{selectedComp.simState.oscillatorFreqHz} Hz</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-4 text-center">
                Select any component to inspect pins, configure parameters, or interact with dials and buttons.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 3. DRC VIOLATIONS MODAL */}
      {showDrcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Design Rule Check (DRC)</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    drcViolations.length === 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {drcViolations.length} Violations
                </span>
              </h3>
              <button
                onClick={() => setShowDrcModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {drcViolations.length === 0 ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <span>✓</span>
                  <span>Board passed all DRC checks! Clearance, trace widths, and vias are production ready.</span>
                </div>
              ) : (
                drcViolations.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded bg-slate-800 border border-slate-700 text-xs flex items-start space-x-2"
                  >
                    <span className={v.severity === 'error' ? 'text-red-400' : 'text-amber-400'}>
                      {v.severity === 'error' ? '✖' : '⚠'}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200">{v.code}</div>
                      <div className="text-slate-400 text-[11px]">{v.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowDrcModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 4. MANUFACTURING EXPORTS MODAL */}
      {showExportModal && exportPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manufacturing & Fabrication Package</span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                  RS-274X + Excellon + BOM
                </span>
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                <div className="font-bold text-slate-200 mb-1">Gerber RS-274X Layers</div>
                <ul className="text-slate-400 space-y-0.5 text-[11px]">
                  <li>• Top Copper (.GTL)</li>
                  <li>• Bottom Copper (.GBL)</li>
                  <li>• Top Silkscreen (.GTO)</li>
                  <li>• Edge Cuts (.GKO)</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                <div className="font-bold text-slate-200 mb-1">Assembly & Netlist Files</div>
                <ul className="text-slate-400 space-y-0.5 text-[11px]">
                  <li>• Excellon NC Drill (.DRL)</li>
                  <li>• Bill of Materials (.CSV)</li>
                  <li>• Pick & Place Centroid (.CSV)</li>
                  <li>• KiCad PCB Netlist (.NET)</li>
                </ul>
              </div>
            </div>

            {/* Quick BOM Preview */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-slate-300 mb-1">BOM Preview:</div>
              <pre className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-emerald-400 max-h-36 overflow-y-auto">
                {exportPackage.bomCsv}
              </pre>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const blob = new Blob([exportPackage.bomCsv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'PCB_BOM.csv';
                  a.click();
                }}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded transition"
              >
                Download BOM.csv
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportPackage.gerberTopCopper], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'TopCopper.gtl';
                  a.click();
                }}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition shadow"
              >
                Download Gerber TopCopper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
