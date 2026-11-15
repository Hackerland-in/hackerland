'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { Download, Copy, Check, Cpu } from 'lucide-react';
import type { EdaPreset } from './eda-engine';

export interface EdaYosysViewerProps {
  preset: EdaPreset;
}

export function EdaYosysViewer({ preset }: EdaYosysViewerProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<'verilog' | 'yosys'>('verilog');
  const [copied, setCopied] = useState(false);

  const activeText = activeCodeTab === 'verilog' ? preset.verilogSource : preset.yosysScript;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const filename = activeCodeTab === 'verilog' ? `${preset.id}.v` : `${preset.id}_synth.tcl`;
    const blob = new Blob([activeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4"
      data-testid="eda-yosys-viewer"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-hairline">
          <button
            type="button"
            onClick={() => setActiveCodeTab('verilog')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeCodeTab === 'verilog'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            RTL Verilog Source
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeTab('yosys')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeCodeTab === 'yosys'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Yosys Synthesis TCL Script
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="size-3.5 mr-1 text-emerald-500" /> : <Copy className="size-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            <Download className="size-3.5 mr-1" />
            Download Source
          </Button>
        </div>
      </div>

      {/* Code Viewer */}
      <pre className="rounded-xl border border-hairline bg-surface-2 p-4 font-mono text-body-xs text-fg overflow-x-auto max-h-[300px] leading-relaxed select-text">
        <code>{activeText}</code>
      </pre>

      {/* Standard Cell Specs Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-2/60 border border-hairline p-3 text-caption font-mono">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-accent" />
          <span className="text-fg-muted">Target Standard Cell Library:</span>
          <span className="font-bold text-fg">SkyWater sky130_fd_sc_hd (High Density)</span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-fg-muted">Supply: </span>
            <span className="font-bold text-fg">1.8V VDD</span>
          </div>
          <div>
            <span className="text-fg-muted">Track Height: </span>
            <span className="font-bold text-fg">7-Track (2.72 µm)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
