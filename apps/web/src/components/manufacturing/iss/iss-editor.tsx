'use client';

import { useState } from 'react';
import { Button } from '@hackerland/ui';
import { ArrowRight, Download, Copy, Check } from 'lucide-react';
import type { ParsedInstruction, IssProgramPreset } from './iss-engine';

export interface IssEditorProps {
  preset: IssProgramPreset;
  instructions: ParsedInstruction[];
  currentPc: number;
  onStep: () => void;
}

export function IssEditor({
  preset,
  instructions,
  currentPc,
}: IssEditorProps) {
  const [activeTab, setActiveTab] = useState<'disassembly' | 'source'>('disassembly');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preset.sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([preset.sourceCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${preset.id}.s`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="iss-editor">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-hairline">
          <button
            type="button"
            onClick={() => setActiveTab('disassembly')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeTab === 'disassembly'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Disassembled Machine Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('source')}
            className={`px-3 py-1 rounded text-caption font-mono font-bold transition-colors ${
              activeTab === 'source'
                ? 'bg-accent text-on-solid'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Assembly Source (.s)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="size-3.5 mr-1 text-emerald-500" /> : <Copy className="size-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDownload}>
            <Download className="size-3.5 mr-1" />
            Download .s
          </Button>
        </div>
      </div>

      {/* Disassembly View */}
      {activeTab === 'disassembly' && (
        <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-2/30 max-h-[420px] overflow-y-auto">
          <table className="w-full text-left font-mono text-body-xs">
            <thead>
              <tr className="border-b border-hairline bg-surface-3/60 text-fg-muted">
                <th className="py-2 px-3 w-10">Exec</th>
                <th className="py-2 px-3">Address</th>
                <th className="py-2 px-3">Machine Code</th>
                <th className="py-2 px-3">Instruction</th>
                <th className="py-2 px-3">Comment / Micro-op</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {instructions.map((inst) => {
                const isCurrent = inst.address === currentPc;
                return (
                  <tr
                    key={inst.address}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-accent/15 font-bold text-accent'
                        : 'hover:bg-surface-2'
                    }`}
                  >
                    <td className="py-2 px-3 text-center">
                      {isCurrent && <ArrowRight className="size-3.5 text-accent animate-pulse" />}
                    </td>
                    <td className="py-2 px-3 font-semibold text-fg">
                      0x{inst.address.toString(16).padStart(4, '0').toUpperCase()}
                    </td>
                    <td className="py-2 px-3 text-accent font-mono">{inst.machineCode}</td>
                    <td className="py-2 px-3 text-fg">
                      <span className="font-bold text-fg">{inst.mnemonic}</span>{' '}
                      <span className="text-fg-muted">
                        {inst.rawText.replace(inst.mnemonic, '').trim()}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-fg-subtle text-[11px]">
                      {inst.comment ? `# ${inst.comment}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Raw Source View */}
      {activeTab === 'source' && (
        <pre className="rounded-xl border border-hairline bg-surface-2 p-4 font-mono text-body-xs text-fg overflow-x-auto max-h-[420px] leading-relaxed select-text">
          <code>{preset.sourceCode}</code>
        </pre>
      )}
    </div>
  );
}
