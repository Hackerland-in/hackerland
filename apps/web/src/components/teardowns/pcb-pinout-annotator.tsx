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
import { Button } from '@hackerland/ui';

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
    initialAnnotations[0]?.id || null,
  );
  const [isAnnotatorMode, setIsAnnotatorMode] = useState<boolean>(false);
  const [activeSubsystemFilter, setActiveSubsystemFilter] = useState<string>('all');

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
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(annotations, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${deviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-pinouts.json`);
    dlAnchor.click();
  };

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-5 md:p-6 space-y-5 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-fg bg-accent/10 px-2.5 py-0.5 rounded-full mb-1">
            <Crosshair className="size-3.5" />
            <span>INTERACTIVE CHIP-LEVEL PINOUT EXPLORER</span>
          </div>
          <h3 className="font-display text-base sm:text-lg font-bold text-fg">
            Silicon Architecture &amp; Subsystem Hotspots
          </h3>
          <p className="text-xs text-fg-muted">
            Click any labeled IC hotspot on the PCB layout to inspect part numbers, voltage ratings, and open-source drop-in alternatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {allowEditing && (
            <Button
              type="button"
              size="sm"
              variant={isAnnotatorMode ? 'primary' : 'secondary'}
              onClick={() => {
                setIsAnnotatorMode(!isAnnotatorMode);
                setNewPinDraft(null);
              }}
            >
              <Plus className="size-3.5" />
              <span>{isAnnotatorMode ? 'Active Annotator Mode' : 'Add Custom Pin'}</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleExportJson}
            title="Export Pinout Annotations as JSON"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Subsystem Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveSubsystemFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-mono transition-colors shrink-0 border ${
            activeSubsystemFilter === 'all'
              ? 'border-accent bg-accent text-on-solid font-bold'
              : 'border-hairline bg-sunken text-fg-muted hover:text-fg'
          }`}
        >
          All Subsystems ({annotations.length})
        </button>
        {subsystems.map((sub) => (
          <button
            type="button"
            key={sub}
            onClick={() => setActiveSubsystemFilter(sub)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors shrink-0 border ${
              activeSubsystemFilter === sub
                ? 'border-accent bg-accent text-on-solid font-bold'
                : 'border-hairline bg-sunken text-fg-muted hover:text-fg'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* PCB Board Visual & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-2">
          <div
            ref={boardRef}
            onClick={handleBoardClick}
            className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-emerald-700/40 select-none shadow-sm ${
              isAnnotatorMode ? 'cursor-crosshair ring-2 ring-accent/50' : 'cursor-default'
            }`}
            style={{
              backgroundColor: '#064e3b',
              backgroundImage: `
                radial-gradient(circle at 50% 50%, #047857 0%, #064e3b 100%),
                linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 20px 20px, 20px 20px',
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="pcb-copper" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 L 20 20 L 25 15 L 40 15" fill="none" stroke="#a7f3d0" strokeWidth="1" />
                  <path d="M 10 40 L 10 30 L 20 20" fill="none" stroke="#a7f3d0" strokeWidth="1" />
                  <circle cx="20" cy="20" r="2" fill="#fde047" />
                  <circle cx="25" cy="15" r="1.5" fill="#a7f3d0" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pcb-copper)" />
            </svg>

            {/* Plated Mounting Holes */}
            <div className="absolute top-3 left-3 size-4 rounded-full border-2 border-amber-300 bg-surface-1 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-fg-muted/40" />
            </div>
            <div className="absolute top-3 right-3 size-4 rounded-full border-2 border-amber-300 bg-surface-1 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-fg-muted/40" />
            </div>
            <div className="absolute bottom-3 left-3 size-4 rounded-full border-2 border-amber-300 bg-surface-1 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-fg-muted/40" />
            </div>
            <div className="absolute bottom-3 right-3 size-4 rounded-full border-2 border-amber-300 bg-surface-1 flex items-center justify-center">
              <div className="size-1.5 rounded-full bg-fg-muted/40" />
            </div>

            <div className="absolute top-3 left-10 font-mono text-[10px] text-emerald-100/85 tracking-widest uppercase">
              REV-3.2 // {deviceTitle.slice(0, 24)} // FR4 4-LAYER COPPER
            </div>

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
                  <div
                    className={`relative flex items-center justify-center rounded border shadow-md transition-all ${
                      isSelected
                        ? 'border-accent bg-accent text-on-solid'
                        : 'border-emerald-200 bg-surface-1 text-fg group-hover:border-accent'
                    } px-2 py-1`}
                  >
                    <span className="font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>

                    {isSelected && (
                      <span className="absolute -inset-1 rounded-md animate-ping bg-accent/40 pointer-events-none" />
                    )}
                  </div>

                  <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-1 border border-hairline rounded px-2 py-0.5 text-[10px] font-mono font-semibold text-fg whitespace-nowrap pointer-events-none shadow-sm">
                    {pin.label}
                  </div>
                </button>
              );
            })}

            {isAnnotatorMode && !newPinDraft && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-accent text-on-solid font-mono text-[11px] font-bold px-3.5 py-1 rounded-full shadow pointer-events-none">
                Click anywhere on board to place new IC annotation
              </div>
            )}
          </div>
        </div>

        {/* Pin Inspector */}
        <div className="lg:col-span-4">
          {selectedAnnotation ? (
            <div className="rounded-2xl border border-hairline bg-sunken/70 p-5 space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-hairline pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-semibold text-accent-fg bg-accent/10 px-2 py-0.5 rounded-full">
                    {selectedAnnotation.subsystem}
                  </span>
                  <h4 className="font-display text-base font-bold text-fg mt-1.5">
                    {selectedAnnotation.label}
                  </h4>
                  <span className="text-xs font-mono text-fg-muted block">
                    MPN: {selectedAnnotation.partNumber} ({selectedAnnotation.manufacturer})
                  </span>
                </div>
                {allowEditing && (
                  <button
                    type="button"
                    onClick={() => handleDeletePin(selectedAnnotation.id)}
                    className="text-fg-subtle hover:text-danger-fg p-1 rounded"
                    title="Remove Pin"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-fg-muted leading-relaxed">
                {selectedAnnotation.function}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-surface-1 p-2.5 rounded-xl border border-hairline">
                  <span className="text-fg-subtle text-[10px] block">PACKAGE</span>
                  <span className="text-fg font-semibold">{selectedAnnotation.package}</span>
                </div>
                <div className="bg-surface-1 p-2.5 rounded-xl border border-hairline">
                  <span className="text-fg-subtle text-[10px] block">EST. SILICON COST</span>
                  <span className="text-success-fg font-bold">
                    ${selectedAnnotation.estimatedCostUsd.toFixed(2)} (~₹{Math.round(selectedAnnotation.estimatedCostUsd * 86)})
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-accent/25 bg-accent-soft/60 p-3.5 space-y-1">
                <span className="text-[10px] font-mono font-bold text-accent-fg flex items-center gap-1">
                  <Sparkles className="size-3" />
                  <span>OPEN-SOURCE PROTOTYPING ALTERNATIVE:</span>
                </span>
                <p className="text-xs text-fg font-semibold">
                  {selectedAnnotation.openSourceAlternative}
                </p>
                <span className="text-[10px] text-fg-muted block pt-0.5">
                  Lets builders replicate functionality without proprietary chip NDA restrictions.
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center text-xs text-fg-subtle border border-dashed border-hairline rounded-2xl bg-sunken/50">
              Select any labeled chip hotspot on the PCB to inspect silicon details.
            </div>
          )}
        </div>
      </div>

      {newPinDraft && (
        <div className="rounded-2xl border border-accent bg-surface-1 p-5 space-y-4 shadow-overlay">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h4 className="font-display text-sm font-bold text-fg flex items-center gap-2">
              <Plus className="size-4 text-accent" />
              <span>Configure New Chip Annotation at ({newPinDraft.xPercent}%, {newPinDraft.yPercent}%)</span>
            </h4>
            <button
              type="button"
              onClick={() => setNewPinDraft(null)}
              className="text-fg-subtle hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Chip Label / Subsystem Ref:</label>
              <input
                type="text"
                value={newPinDraft.label}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, label: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Manufacturer Part Number (MPN):</label>
              <input
                type="text"
                value={newPinDraft.partNumber}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, partNumber: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Manufacturer:</label>
              <input
                type="text"
                value={newPinDraft.manufacturer}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, manufacturer: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Subsystem Domain:</label>
              <input
                type="text"
                value={newPinDraft.subsystem}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, subsystem: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Package (e.g. QFN-32, SOIC-8):</label>
              <input
                type="text"
                value={newPinDraft.package}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, package: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Est Cost (USD):</label>
              <input
                type="number"
                step="0.1"
                value={newPinDraft.estimatedCostUsd}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, estimatedCostUsd: Number(e.target.value) })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Functional Description:</label>
              <input
                type="text"
                value={newPinDraft.function}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, function: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="text-fg-muted font-semibold block mb-1">Open-Source Alternative Drop-in:</label>
              <input
                type="text"
                value={newPinDraft.openSourceAlternative}
                onChange={(e) => setNewPinDraft({ ...newPinDraft, openSourceAlternative: e.target.value })}
                className="w-full bg-sunken border border-line rounded-lg px-2.5 py-1.5 text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setNewPinDraft(null)}>
              Cancel
            </Button>
            <Button type="button" size="sm" variant="primary" onClick={handleSaveDraft}>
              Save Pin Annotation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
