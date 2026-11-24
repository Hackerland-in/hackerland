'use client';

import { useState, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Download,
  X,
  Crosshair,
} from 'lucide-react';
import type { TeardownPinoutAnnotation } from '@hackerland/core';

interface PcbPinoutAnnotatorProps {
  initialAnnotations: TeardownPinoutAnnotation[];
  deviceTitle: string;
  allowEditing?: boolean;
}

export function PcbPinoutAnnotator({
  initialAnnotations,
  deviceTitle,
  allowEditing = true,
}: PcbPinoutAnnotatorProps) {
  const [annotations, setAnnotations] = useState<TeardownPinoutAnnotation[]>(initialAnnotations);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(
    initialAnnotations[0]?.id || null
  );
  const [isAnnotatorMode, setIsAnnotatorMode] = useState<boolean>(false);
  const [activeSubsystemFilter, setActiveSubsystemFilter] = useState<string>('all');

  // New Pin form draft
  const [newPinDraft, setNewPinDraft] = useState<{
    label: string;
    partNumber: string;
    manufacturer: string;
    subsystem: string;
    function: string;
    package: string;
    openSourceAlternative: string;
    estimatedCostUsd: number;
    xPercent: number;
    yPercent: number;
  } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  const subsystems = Array.from(new Set(annotations.map((a) => a.subsystem)));

  const filteredAnnotations = annotations.filter((a) => {
    if (activeSubsystemFilter === 'all') return true;
    return a.subsystem === activeSubsystemFilter;
  });

  const selectedAnnotation = annotations.find((a) => a.id === selectedPinId) || null;

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotatorMode || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setNewPinDraft({
      label: 'New IC Annotation',
      partNumber: 'STM32 / TI / ESP32',
      manufacturer: 'Texas Instruments / ST / Espressif',
      subsystem: subsystems[0] || 'Core Processing',
      function: 'Primary microcontroller or sensor frontend function',
      package: 'QFN-32',
      openSourceAlternative: 'RP2040 / Open Hardware module',
      estimatedCostUsd: 2.5,
      xPercent: Math.max(2, Math.min(98, x)),
      yPercent: Math.max(2, Math.min(98, y)),
    });
  };

  const handleSaveDraft = () => {
    if (!newPinDraft) return;
    const newPin: TeardownPinoutAnnotation = {
      id: `pin-custom-${Date.now()}`,
      ...newPinDraft,
    };
    setAnnotations((prev) => [...prev, newPin]);
    setSelectedPinId(newPin.id);
    setNewPinDraft(null);
  };

  const handleDeletePin = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (selectedPinId === id) {
      setSelectedPinId(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(annotations, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${deviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-pinouts.json`);
    dlAnchor.click();
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mb-1">
            <Crosshair className="size-3.5" />
            <span>INTERACTIVE CHIP-LEVEL PINOUT EXPLORER</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Silicon Architecture & Subsystem Hotspots
          </h3>
          <p className="text-xs text-neutral-400">
            Click any labeled IC hotspot on the PCB layout to inspect part numbers, voltage ratings, and open-source drop-in alternatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {allowEditing && (
            <button
              type="button"
              onClick={() => {
                setIsAnnotatorMode(!isAnnotatorMode);
                setNewPinDraft(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isAnnotatorMode
                  ? 'border-emerald-500 bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <Plus className="size-3.5" />
              <span>{isAnnotatorMode ? 'Active Annotator Mode' : 'Add Custom Pin'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Export Pinout Annotations as JSON"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Subsystem Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveSubsystemFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors shrink-0 ${
            activeSubsystemFilter === 'all'
              ? 'bg-emerald-500 text-neutral-950 font-bold'
              : 'bg-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          All Subsystems ({annotations.length})
        </button>
        {subsystems.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubsystemFilter(sub)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors shrink-0 ${
              activeSubsystemFilter === sub
                ? 'bg-emerald-500 text-neutral-950 font-bold'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* PCB Visual Canvas & Hotspot Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PCB Board Container (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          <div
            ref={boardRef}
            onClick={handleBoardClick}
            className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-emerald-500/30 select-none ${
              isAnnotatorMode ? 'cursor-crosshair ring-2 ring-emerald-500/40' : 'cursor-default'
            }`}
            style={{
              backgroundColor: '#071610',
              backgroundImage: `
                radial-gradient(circle at 50% 50%, #0d281e 0%, #050d0a 100%),
                linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 20px 20px, 20px 20px',
            }}
          >
            {/* PCB Silkscreen Decorative Traces */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="pcb-copper" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 L 20 20 L 25 15 L 40 15" fill="none" stroke="#34d399" strokeWidth="1" />
                  <path d="M 10 40 L 10 30 L 20 20" fill="none" stroke="#34d399" strokeWidth="1" />
                  <circle cx="20" cy="20" r="2" fill="#fbbf24" />
                  <circle cx="25" cy="15" r="1.5" fill="#34d399" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pcb-copper)" />
            </svg>

            {/* PCB Gold Mounting Holes */}
            <div className="absolute top-3 left-3 size-4 rounded-full border-2 border-amber-400/80 bg-neutral-950 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-neutral-800" />
            </div>
            <div className="absolute top-3 right-3 size-4 rounded-full border-2 border-amber-400/80 bg-neutral-950 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-neutral-800" />
            </div>
            <div className="absolute bottom-3 left-3 size-4 rounded-full border-2 border-amber-400/80 bg-neutral-950 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-neutral-800" />
            </div>
            <div className="absolute bottom-3 right-3 size-4 rounded-full border-2 border-amber-400/80 bg-neutral-950 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-neutral-800" />
            </div>

            {/* Board Silkscreen Label */}
            <div className="absolute top-3 left-10 font-mono text-[10px] text-emerald-400/70 tracking-widest uppercase">
              REV-3.2 // {deviceTitle.slice(0, 24)} // FR4 4-LAYER COPPER
            </div>

            {/* Interactive Pins */}
            {filteredAnnotations.map((pin, idx) => {
              const isSelected = pin.id === selectedPinId;
              return (
                <button
                  key={pin.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPinId(pin.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform z-10 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                  }`}
                  style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                >
                  {/* Pin IC Chip Silhouette */}
                  <div
                    className={`relative flex items-center justify-center rounded border shadow-lg transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/20 shadow-amber-500/30'
                        : 'border-emerald-400 bg-neutral-950 shadow-emerald-500/20 group-hover:border-white'
                    } px-2 py-1`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isSelected ? 'text-amber-300' : 'text-emerald-400 group-hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    {/* Ping Radar Animation on active pin */}
                    {isSelected && (
                      <span className="absolute -inset-1 rounded-md animate-ping bg-amber-400/30 pointer-events-none" />
                    )}
                  </div>

                  {/* Tooltip Hover Pill */}
                  <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 border border-white/20 rounded px-1.5 py-0.5 text-[9px] font-mono text-white whitespace-nowrap pointer-events-none">
                    {pin.label}
                  </div>
                </button>
              );
            })}

            {/* Active Click Cursor in Annotator Mode */}
            {isAnnotatorMode && !newPinDraft && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-neutral-950 font-mono text-[11px] font-bold px-3 py-1 rounded-full shadow pointer-events-none">
                Click anywhere on board to place new IC annotation
              </div>
            )}
          </div>
        </div>

        {/* Pin Inspector Card (4 cols) */}
        <div className="lg:col-span-4">
          {selectedAnnotation ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {selectedAnnotation.subsystem}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">
                    {selectedAnnotation.label}
                  </h4>
                  <span className="text-xs font-mono text-neutral-400 block">
                    MPN: {selectedAnnotation.partNumber} ({selectedAnnotation.manufacturer})
                  </span>
                </div>
                {allowEditing && (
                  <button
                    type="button"
                    onClick={() => handleDeletePin(selectedAnnotation.id)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    title="Remove Pin"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedAnnotation.function}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] block">PACKAGE</span>
                  <span className="text-white font-medium">{selectedAnnotation.package}</span>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800">
                  <span className="text-neutral-500 text-[10px] block">EST. SILICON COST</span>
                  <span className="text-emerald-400 font-bold">
                    ${selectedAnnotation.estimatedCostUsd.toFixed(2)} (~₹{Math.round(selectedAnnotation.estimatedCostUsd * 86)})
                  </span>
                </div>
              </div>

              {/* Open-Source Drop-in Replacement Callout */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="size-3" />
                  <span>OPEN-SOURCE PROTOTYPING ALTERNATIVE:</span>
                </span>
                <p className="text-xs text-white font-medium">
                  {selectedAnnotation.openSourceAlternative}
                </p>
                <span className="text-[10px] text-neutral-400 block pt-0.5">
                  Allows indie squads to replicate functionality without proprietary chip NDA restrictions.
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center text-xs text-neutral-500 border border-neutral-800 rounded-xl bg-neutral-950/40">
              Select any labeled chip hotspot on the PCB to view architectural parameters.
            </div>
          )}
        </div>
      </div>

      {/* New Pin Draft Modal/Drawer if Annotator active */}
      {newPinDraft && (
        <div className="rounded-xl border border-emerald-500 bg-neutral-950 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="size-4 text-emerald-400" />
              <span>Configure New Chip Annotation at ({newPinDraft.xPercent}%, {newPinDraft.yPercent}%)</span>
            </h4>
            <button
              type="button"
              onClick={() => setNewPinDraft(null)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Chip Label / Subsystem Ref:</label>
              <input
                type="text"
                value={newPinDraft.label}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, label: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Manufacturer Part Number (MPN):</label>
              <input
                type="text"
                value={newPinDraft.partNumber}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, partNumber: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Manufacturer:</label>
              <input
                type="text"
                value={newPinDraft.manufacturer}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, manufacturer: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Subsystem Domain:</label>
              <input
                type="text"
                value={newPinDraft.subsystem}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, subsystem: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Package (e.g. QFN-32, SOIC-8):</label>
              <input
                type="text"
                value={newPinDraft.package}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, package: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Est Cost (USD):</label>
              <input
                type="number"
                step="0.1"
                value={newPinDraft.estimatedCostUsd}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, estimatedCostUsd: Number(e.target.value) })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-neutral-400 block mb-1">Functional Description:</label>
              <input
                type="text"
                value={newPinDraft.function}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, function: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Open-Source Alternative Drop-in:</label>
              <input
                type="text"
                value={newPinDraft.openSourceAlternative}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, openSourceAlternative: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setNewPinDraft(null)}
              className="px-3 py-1.5 rounded text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-1.5 bg-emerald-500 text-neutral-950 font-semibold text-xs rounded hover:bg-emerald-400 transition-colors"
            >
              Save Pin Annotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
