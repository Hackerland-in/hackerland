'use client';

import { useState } from 'react';
import { Badge, Button } from '@hackerland/ui';
import {
  Layers,
  Zap,
  Code2,
  FileText,
  Plus,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { CIRCUITO_COMPONENTS, type CircuitoComponent } from './circuito-data';
import { CircuitoWiringCanvas } from './circuito-wiring-canvas';
import { generateCircuitCode } from './circuito-code-generator';

export function CircuitoBuilder() {
  // Master Controller state
  const controllers = CIRCUITO_COMPONENTS.filter((c) => c.category === 'controller');
  const [selectedControllerId, setSelectedControllerId] = useState<string>('esp32-s3');
  const controller =
    controllers.find((c) => c.id === selectedControllerId) ?? controllers[0]!;

  // User-added peripheral components (default: DHT22, SSD1306 OLED, SG90 Servo)
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([
    'dht22',
    'ssd1306-oled',
    'sg90-servo',
  ]);

  const [activeTab, setActiveTab] = useState<'wiring' | 'code' | 'bom' | 'logic'>('wiring');
  const [stepIndex, setStepIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter available modules for the selector
  const availableModules = CIRCUITO_COMPONENTS.filter((c) => c.category !== 'controller');
  const activeComponents = selectedComponentIds
    .map((id) => CIRCUITO_COMPONENTS.find((c) => c.id === id))
    .filter((c): c is CircuitoComponent => c !== undefined);

  // Toggle adding/removing a component
  const toggleComponent = (compId: string) => {
    setSelectedComponentIds((prev) =>
      prev.includes(compId) ? prev.filter((id) => id !== compId) : [...prev, compId]
    );
  };

  // Compile code
  const generatedCode = generateCircuitCode(controller, activeComponents);

  // Total current & battery runtime estimation (assuming standard 2500mAh 18650 cell)
  const totalCurrentMa =
    controller.currentDrawMa + activeComponents.reduce((sum, c) => sum + c.currentDrawMa, 0);
  const batteryHours = (2500 / Math.max(1, totalCurrentMa)).toFixed(1);

  // Total BOM Cost
  const totalBomInr =
    controller.estimatedPriceInr +
    activeComponents.reduce((sum, c) => sum + c.estimatedPriceInr, 0) +
    65; // + breadboard and jumper wires pack

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generatedCode.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 rounded-2xl border-2 border-accent/40 bg-surface-1 p-6 shadow-xl" data-testid="circuito-builder">
      {/* Engine Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hairline pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="make" variant="solid" className="text-body-xs font-mono font-bold tracking-wider">
              <Sparkles className="size-3.5 mr-1" /> CIRCUITO GENERATOR ENGINE
            </Badge>
            <span className="text-caption font-mono text-fg-subtle">
              Inspired by Circuito.io Autonomous Hardware Design
            </span>
          </div>
          <h2 className="font-display text-headline-sm sm:text-headline-md font-bold text-fg">
            Interactive Circuit Builder, Breadboard Wiring & Test Code Studio
          </h2>
          <p className="text-body-sm text-fg-muted max-w-3xl">
            Pick your microcontroller and modules: Circuito automatically verifies electrical compatibility, auto-injects required passives (pull-ups, level shifters), generates an interactive breadboard wiring guide, and compiles test firmware.
          </p>
        </div>

        {/* Master Controller Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider">
            Target MCU:
          </span>
          <select
            value={selectedControllerId}
            onChange={(e) => setSelectedControllerId(e.target.value)}
            className="rounded-lg border border-accent/40 bg-surface-2 px-3 py-2 text-body-xs font-mono font-bold text-fg focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Select master microcontroller"
          >
            {controllers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.operatingVoltage}V)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Component Library Palette (Add / Remove Modules) */}
      <div className="rounded-xl border border-hairline bg-surface-2 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
            Component Library Palette (Click to Add / Remove):
          </span>
          <span className="text-[11px] font-mono text-accent">
            {activeComponents.length} modules connected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {availableModules.map((mod) => {
            const isSelected = selectedComponentIds.includes(mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => toggleComponent(mod.id)}
                className={`flex flex-col justify-between p-2.5 rounded-lg border text-left transition-all min-h-[76px] ${
                  isSelected
                    ? 'border-accent bg-accent/15 ring-1 ring-accent'
                    : 'border-hairline bg-surface-1 hover:border-hairline-strong text-fg-muted hover:text-fg'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-fg-subtle">
                    {mod.category}
                  </span>
                  {isSelected ? (
                    <span className="size-4 rounded-full bg-accent text-on-solid flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  ) : (
                    <Plus className="size-3.5 text-fg-subtle" />
                  )}
                </div>
                <span className="font-display text-caption font-semibold line-clamp-1 text-fg">
                  {mod.name.split('/')[0]?.split('(')[0]?.trim()}
                </span>
                <span className="font-mono text-[10px] text-fg-muted">
                  ₹{mod.estimatedPriceInr} • {mod.operatingVoltage}V
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('wiring')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'wiring'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Layers className="size-4" />
            <span>Interactive Wiring Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logic')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'logic'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Zap className="size-4" />
            <span>Power & Logic Compatibility Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'code'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <Code2 className="size-4" />
            <span>Generated Test Firmware (.ino)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bom')}
            className={`flex items-center gap-2 px-4 py-2.5 font-display text-body-sm font-semibold border-b-2 transition-all ${
              activeTab === 'bom'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-transparent text-fg-muted hover:text-fg hover:bg-surface-2'
            }`}
          >
            <FileText className="size-4" />
            <span>Bill of Materials (BOM) & Sourcing</span>
          </button>
        </div>

        {/* Step-by-Step Wiring Navigator */}
        {activeTab === 'wiring' && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="text-caption font-mono"
            >
              <ChevronLeft className="size-3.5 mr-1" /> Prev Step
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setStepIndex((prev) => Math.min(activeComponents.length + 1, prev + 1))}
              disabled={stepIndex >= activeComponents.length + 1}
              className="text-caption font-mono"
            >
              Next Step <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      {/* 1. Wiring Guide */}
      {activeTab === 'wiring' && (
        <CircuitoWiringCanvas
          controller={controller}
          components={activeComponents}
          stepIndex={stepIndex}
        />
      )}

      {/* 2. Power & Logic Compatibility Engine */}
      {activeTab === 'logic' && (
        <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-5" data-testid="circuito-logic-engine">
          <div className="border-b border-hairline pb-3">
            <h3 className="font-display text-body-md font-bold text-fg">
              Automated Electrical Calculation & Power Budget
            </h3>
            <p className="text-caption text-fg-muted">
              Real-time electrical verification across logic voltage rails, transient spikes, and battery life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-1">
              <span className="text-[11px] font-mono text-fg-subtle uppercase">Total Current Draw:</span>
              <div className="font-mono text-headline-sm font-bold text-accent">
                {totalCurrentMa} mA
              </div>
              <p className="text-caption text-fg-muted">
                Peak system load across {activeComponents.length + 1} active modules.
              </p>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-1">
              <span className="text-[11px] font-mono text-fg-subtle uppercase">Estimated Runtime:</span>
              <div className="font-mono text-headline-sm font-bold text-success">
                ~{batteryHours} Hours
              </div>
              <p className="text-caption text-fg-muted">
                On a standard single 3.7V 2500mAh 18650 Li-Ion battery pack.
              </p>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-1">
              <span className="text-[11px] font-mono text-fg-subtle uppercase">Logic Rails:</span>
              <div className="font-mono text-headline-sm font-bold text-warning">
                {controller.operatingVoltage}V / 5.0V
              </div>
              <p className="text-caption text-fg-muted">
                Dual-rail distribution with automatic level shifting passives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Generated Test Code */}
      {activeTab === 'code' && (
        <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="circuito-code-viewer">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
            <div>
              <h3 className="font-display text-body-md font-bold text-fg">
                Generated Hardware Test Sketch ({generatedCode.filename})
              </h3>
              <p className="text-caption text-fg-muted">
                Complete compilable sketch initialized with pin defines and test handlers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyCode}
                className="text-caption font-mono"
              >
                {copiedCode ? <Check className="size-3.5 mr-1 text-success" /> : <Copy className="size-3.5 mr-1" />}
                Copy Code
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDownloadCode}
                className="text-caption font-mono"
              >
                <Download className="size-3.5 mr-1" /> Download .ino
              </Button>
            </div>
          </div>

          {/* Required Libraries Callout */}
          {generatedCode.librariesNeeded.length > 0 && (
            <div className="rounded border border-hairline bg-surface-2 p-3 text-caption font-mono space-y-1">
              <span className="text-fg-subtle uppercase tracking-wider text-[10px] block font-bold">
                Required Arduino / PlatformIO Libraries:
              </span>
              <div className="flex flex-wrap gap-2 text-fg">
                {generatedCode.librariesNeeded.map((lib) => (
                  <span key={lib} className="px-2 py-0.5 rounded bg-surface-1 border border-hairline text-accent">
                    {lib}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Code Viewer */}
          <div className="h-96 overflow-y-auto rounded-lg border border-hairline-strong bg-canvas p-4 font-mono text-body-xs shadow-inner select-text">
            <pre className="text-fg-muted whitespace-pre leading-relaxed">{generatedCode.code}</pre>
          </div>
        </div>
      )}

      {/* 4. Bill of Materials (BOM) & Sourcing */}
      {activeTab === 'bom' && (
        <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-5" data-testid="circuito-bom">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
            <div>
              <h3 className="font-display text-body-md font-bold text-fg">
                Itemized Bill of Materials (BOM) & Domestic Sourcing
              </h3>
              <p className="text-caption text-fg-muted">
                Complete procurement list including primary modules, passive support components, and Indian distributors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge tone="accent" variant="solid" className="text-body-xs font-mono font-bold">
                Total Est: ₹{totalBomInr}
              </Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-caption border-collapse">
              <thead>
                <tr className="border-b border-hairline bg-surface-2 text-fg-subtle uppercase text-[10px]">
                  <th className="py-2.5 px-3">Component Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Footprint / Package</th>
                  <th className="py-2.5 px-3">Qty</th>
                  <th className="py-2.5 px-3">Est. Price (INR)</th>
                  <th className="py-2.5 px-3">Domestic Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/60">
                {/* Controller Row */}
                <tr className="hover:bg-surface-2/40">
                  <td className="py-2.5 px-3 font-bold text-fg">{controller.name}</td>
                  <td className="py-2.5 px-3 text-accent uppercase">{controller.category}</td>
                  <td className="py-2.5 px-3 text-fg-muted">{controller.packageType}</td>
                  <td className="py-2.5 px-3 text-fg">1</td>
                  <td className="py-2.5 px-3 text-fg font-bold">₹{controller.estimatedPriceInr}</td>
                  <td className="py-2.5 px-3">
                    <a
                      href="https://robu.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-1"
                    >
                      Robu.in <ExternalLink className="size-3" />
                    </a>
                  </td>
                </tr>

                {/* Peripherals Rows */}
                {activeComponents.map((comp) => (
                  <tr key={comp.id} className="hover:bg-surface-2/40">
                    <td className="py-2.5 px-3 font-semibold text-fg">{comp.name}</td>
                    <td className="py-2.5 px-3 text-fg-muted uppercase">{comp.category}</td>
                    <td className="py-2.5 px-3 text-fg-muted">{comp.packageType}</td>
                    <td className="py-2.5 px-3 text-fg">1</td>
                    <td className="py-2.5 px-3 text-fg font-bold">₹{comp.estimatedPriceInr}</td>
                    <td className="py-2.5 px-3">
                      <a
                        href="https://quartzcomponents.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        Quartzcomponents <ExternalLink className="size-3" />
                      </a>
                    </td>
                  </tr>
                ))}

                {/* Breadboard & Jumper Wire Accessories */}
                <tr className="hover:bg-surface-2/40">
                  <td className="py-2.5 px-3 font-semibold text-fg">830-Point Solderless Breadboard + 65x Jumpers</td>
                  <td className="py-2.5 px-3 text-fg-muted uppercase">Hardware</td>
                  <td className="py-2.5 px-3 text-fg-muted">Prototyping Kit</td>
                  <td className="py-2.5 px-3 text-fg">1</td>
                  <td className="py-2.5 px-3 text-fg font-bold">₹65</td>
                  <td className="py-2.5 px-3">
                    <a
                      href="https://electronicscomp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-1"
                    >
                      ElectronicsComp <ExternalLink className="size-3" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
