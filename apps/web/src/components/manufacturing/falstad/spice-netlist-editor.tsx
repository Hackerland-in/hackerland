'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { Terminal, Play, Download, Copy, Check } from 'lucide-react';

export interface SpiceNetlistEditorProps {
  netlistText: string;
  onUpdateNetlist: (newNetlist: string) => void;
  onRunSimulation: () => void;
}

export function SpiceNetlistEditor({
  netlistText,
  onUpdateNetlist,
  onRunSimulation,
}: SpiceNetlistEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(netlistText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([netlistText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hackerland_circuit.cir';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="spice-netlist-editor">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            Berkeley SPICE / ngspice Netlist Deck (.cir)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-hairline text-accent font-mono">
            Standard SPICE 3f5
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="text-caption font-mono"
            aria-label="Copy SPICE netlist"
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
            aria-label="Download SPICE netlist"
          >
            <Download className="size-3.5 mr-1" /> .cir
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onRunSimulation}
            className="text-caption font-mono"
            aria-label="Run SPICE simulation"
          >
            <Play className="size-3.5 mr-1" /> Run SPICE
          </Button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="space-y-1.5">
        <textarea
          value={netlistText}
          onChange={(e) => onUpdateNetlist(e.target.value)}
          rows={10}
          className="w-full rounded-lg border border-hairline-strong bg-canvas p-3.5 font-mono text-body-xs text-accent leading-relaxed focus:outline-none focus:border-accent shadow-inner resize-y"
          placeholder="Enter SPICE netlist (e.g. R1 1 2 1k)..."
          aria-label="SPICE netlist text area"
        />
        <div className="flex justify-between text-[11px] font-mono text-fg-subtle">
          <span>Format: [Device] [Node+] [Node-] [Value]</span>
          <span>Compatible with LTspice, ngspice, and Qucs</span>
        </div>
      </div>
    </div>
  );
}
