'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@hackerland/ui';
import { Terminal, Send, Trash2, Copy, Check, ArrowDownCircle } from 'lucide-react';
import type { BenchTrack } from './bench-tracks-data';

export interface SerialMonitorProps {
  track: BenchTrack;
  logs: string[];
  potVoltage: number;
  onSendCommand: (cmd: string) => void;
  onClearLogs: () => void;
}

export function SerialMonitor({
  track,
  logs,
  onSendCommand,
  onClearLogs,
}: SerialMonitorProps) {
  const [inputCommand, setInputCommand] = useState('');
  const [baudRate, setBaudRate] = useState('115200');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCommand.trim();
    if (!trimmed) return;
    onSendCommand(trimmed);
    setInputCommand('');
  };

  const handleCopyLogs = async () => {
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="serial-monitor">
      {/* Terminal Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">Serial Terminal (UART0)</h3>
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 border border-hairline text-accent font-mono">
            {baudRate} baud
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Baud Rate Selector */}
          <select
            value={baudRate}
            onChange={(e) => setBaudRate(e.target.value)}
            className="rounded border border-hairline bg-surface-2 px-2.5 py-1 text-caption font-mono text-fg focus:outline-none focus:border-accent"
            aria-label="Select serial baud rate"
          >
            <option value="9600">9600 baud</option>
            <option value="115200">115200 baud</option>
            <option value="230400">230400 baud</option>
          </select>

          {/* Auto-scroll toggle */}
          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded border transition-colors ${
              autoScroll ? 'border-accent bg-accent/15 text-accent' : 'border-hairline bg-surface-2 text-fg-subtle'
            }`}
            title={autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
            aria-label="Toggle auto-scroll"
          >
            <ArrowDownCircle className="size-4" />
          </button>

          {/* Copy logs */}
          <button
            type="button"
            onClick={handleCopyLogs}
            className="p-1.5 rounded border border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong transition-colors"
            title="Copy logs to clipboard"
            aria-label="Copy logs"
          >
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </button>

          {/* Clear logs */}
          <button
            type="button"
            onClick={onClearLogs}
            className="p-1.5 rounded border border-hairline bg-surface-2 text-fg-muted hover:text-error hover:border-error transition-colors"
            title="Clear serial buffer"
            aria-label="Clear serial buffer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        ref={logContainerRef}
        className="h-64 overflow-y-auto rounded-lg border border-hairline-strong bg-canvas p-3.5 font-mono text-caption space-y-1 shadow-inner focus:outline-none"
        tabIndex={0}
      >
        {logs.length === 0 ? (
          <p className="text-fg-subtle italic">[Buffer empty. Send command or trigger bench event.]</p>
        ) : (
          logs.map((log, index) => {
            let textColor = 'text-fg-muted';
            if (log.startsWith('[BOOT]') || log.startsWith('[INIT]')) textColor = 'text-accent';
            else if (log.startsWith('[WARN]') || log.startsWith('[SAFETY]')) textColor = 'text-warning';
            else if (log.startsWith('[ERR]')) textColor = 'text-error';
            else if (log.startsWith('>>>')) textColor = 'text-success font-bold';
            else if (log.startsWith('[I2C]') || log.startsWith('[SSD1306]')) textColor = 'text-accent';

            return (
              <div key={index} className={`leading-relaxed break-words ${textColor}`}>
                {log}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Command Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-mono text-fg-subtle mr-1">Quick Send:</span>
        {track.quickCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => onSendCommand(cmd)}
            className="px-2 py-0.5 rounded border border-hairline bg-surface-2 text-[11px] font-mono text-fg-muted hover:text-accent hover:border-accent transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Type command (e.g. HELP, STATUS, SCAN, ADC, LED #3b82f6)..."
            className="w-full rounded-md border border-hairline bg-surface-2 px-3 py-2 text-caption font-mono text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
          />
        </div>
        <Button type="submit" variant="primary" size="sm" className="shrink-0 text-caption font-mono">
          <Send className="size-3.5 mr-1.5" /> Send
        </Button>
      </form>
    </div>
  );
}
