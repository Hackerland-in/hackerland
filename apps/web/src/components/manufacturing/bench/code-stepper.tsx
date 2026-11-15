'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Badge } from '@hackerland/ui';
import { Play, Pause, StepForward, RotateCcw, Code2, Info, Cpu } from 'lucide-react';
import type { BenchTrack } from './bench-tracks-data';

export interface CodeStepperProps {
  track: BenchTrack;
  activeLineIndex: number;
  onLineChange: (lineIndex: number) => void;
  onExecuteHardwareAction?: (actionText: string) => void;
}

export function CodeStepper({
  track,
  activeLineIndex,
  onLineChange,
  onExecuteHardwareAction,
}: CodeStepperProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  const currentLine = track.firmwareCode[activeLineIndex] ?? track.firmwareCode[0];

  const handleStep = () => {
    // Find next executable line
    const nextIdx = track.firmwareCode.findIndex(
      (line, i) => i > activeLineIndex && line.isExecutable
    );
    if (nextIdx !== -1) {
      onLineChange(nextIdx);
      if (track.firmwareCode[nextIdx]?.hardwareAction && onExecuteHardwareAction) {
        onExecuteHardwareAction(track.firmwareCode[nextIdx].hardwareAction!);
      }
    } else {
      // Loop back to first executable
      const firstExec = track.firmwareCode.findIndex((line) => line.isExecutable);
      onLineChange(firstExec !== -1 ? firstExec : 0);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    const firstExec = track.firmwareCode.findIndex((line) => line.isExecutable);
    onLineChange(firstExec !== -1 ? firstExec : 0);
  };

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleStep();
    }, 800);
    return () => clearInterval(interval);
  });

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4" data-testid="code-stepper">
      {/* Header & Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="size-5 text-accent" />
          <div>
            <h3 className="font-display text-body-md font-bold text-fg">Firmware Code Reader & Stepper</h3>
            <span className="text-caption text-fg-subtle font-mono">PlatformIO / Embedded C++</span>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleStep}
            className="text-caption font-mono"
            aria-label="Step forward one instruction"
          >
            <StepForward className="size-3.5 mr-1" /> Step
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-caption font-mono"
            aria-label={isPlaying ? 'Pause auto-execution' : 'Auto-run code'}
          >
            {isPlaying ? (
              <>
                <Pause className="size-3.5 mr-1" /> Pause
              </>
            ) : (
              <>
                <Play className="size-3.5 mr-1" /> Auto Run
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="text-caption font-mono"
            aria-label="Reset execution to setup"
          >
            <RotateCcw className="size-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Code Viewer */}
      <div
        ref={codeContainerRef}
        className="h-80 overflow-y-auto rounded-lg border border-hairline-strong bg-canvas p-3 font-mono text-body-xs shadow-inner select-text"
      >
        <div className="space-y-0.5">
          {track.firmwareCode.map((line, idx) => {
            const isActive = idx === activeLineIndex;
            return (
              <div
                key={line.lineNumber}
                onClick={() => {
                  if (line.isExecutable) onLineChange(idx);
                }}
                className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                  isActive
                    ? 'bg-accent/25 text-fg font-bold ring-1 ring-accent'
                    : line.isExecutable
                    ? 'hover:bg-surface-2/60 cursor-pointer text-fg-muted'
                    : 'text-fg-subtle/70'
                }`}
              >
                {/* Pointer / Line Number */}
                <span className="w-4 text-center shrink-0 text-accent font-bold">
                  {isActive ? '→' : ''}
                </span>
                <span className="w-8 shrink-0 text-right text-fg-subtle/50 font-mono select-none">
                  {line.lineNumber}
                </span>

                {/* Code content */}
                <code className="flex-1 whitespace-pre">{line.code}</code>

                {/* Executable Indicator */}
                {line.isExecutable && (
                  <span className="size-1.5 rounded-full bg-accent/40 shrink-0 select-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Line Hardware Inspector Callout */}
      {currentLine && currentLine.explanation && (
        <div className="rounded-lg border border-accent/30 bg-surface-2 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="size-4 text-accent" />
              <span className="font-display text-caption font-bold text-fg uppercase tracking-wider">
                Line {currentLine.lineNumber} Hardware Explainer:
              </span>
            </div>
            {currentLine.hardwareAction && (
              <Badge tone="accent" variant="solid" className="text-[10px] font-mono">
                <Cpu className="size-3 mr-1" /> {currentLine.hardwareAction}
              </Badge>
            )}
          </div>
          <p className="text-body-sm text-fg-muted leading-relaxed">
            {currentLine.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
