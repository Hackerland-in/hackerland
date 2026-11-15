'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { Play, Download, Copy, Check, FileCode } from 'lucide-react';
import type { HdlPreset } from './hdl-engine';

export interface HdlEditorProps {
  preset: HdlPreset;
  vcdContent: string;
  onRunSimulation: () => void;
}

export function HdlEditor({ preset, vcdContent, onRunSimulation }: HdlEditorProps) {
  const [activeCodeView, setActiveCodeView] = useState<'module' | 'testbench' | 'vcd'>('module');
  const [copied, setCopied] = useState(false);

  const currentText =
    activeCodeView === 'module'
      ? preset.verilogCode
      : activeCodeView === 'testbench'
      ? preset.testbenchCode
      : vcdContent;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const filename =
      activeCodeView === 'module'
        ? `${preset.id}.v`
        : activeCodeView === 'testbench'
        ? `tb_${preset.id}.v`
        : `${preset.id}.vcd`;

    const blob = new Blob([currentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="hdl-editor">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-hairline">
          <button
            type="button"
            onClick={() => setActiveCodeView('module')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeCodeView === 'module'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Design Module (Verilog)
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeView('testbench')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeCodeView === 'testbench'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Testbench Stimulus (\`tb\`)
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeView('vcd')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeCodeView === 'vcd'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            IEEE 1364 VCD Dump
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="text-caption font-mono"
            aria-label="Copy active code view"
          >
            {copied ? <Check className="size-3.5 mr-1 text-success" /> : <Copy className="size-3.5 mr-1" />}
            Copy
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="text-caption font-mono"
            aria-label="Download active code view"
          >
            <Download className="size-3.5 mr-1" /> Download
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onRunSimulation}
            className="text-caption font-mono"
            aria-label="Compile and run HDL simulation"
          >
            <Play className="size-3.5 mr-1" /> Run Iverilog / Verilator
          </Button>
        </div>
      </div>

      {/* Code Text Viewport */}
      <div className="space-y-1.5">
        <div className="h-96 overflow-y-auto rounded-lg border border-hairline-strong bg-canvas p-4 font-mono text-body-xs shadow-inner select-text">
          <pre className="text-accent leading-relaxed whitespace-pre">{currentText}</pre>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-fg-subtle">
          <span className="flex items-center gap-1">
            <FileCode className="size-3.5 text-accent" />
            <span>Format: {activeCodeView === 'vcd' ? 'Value Change Dump (VCD)' : 'Verilog HDL (IEEE 1364-2001)'}</span>
          </span>
          <span>Target Simulator: Verilator / Icarus Verilog / ModelSim / Questa</span>
        </div>
      </div>
    </div>
  );
}
