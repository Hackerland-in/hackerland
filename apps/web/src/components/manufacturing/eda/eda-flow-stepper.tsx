'use client';

import { Terminal, CheckCircle2, Play, Check } from 'lucide-react';
import { Button } from '@hackerland/ui';
import { EDA_FLOW_STAGES, type EdaPreset, type EdaStageId } from './eda-engine';

export interface EdaFlowStepperProps {
  preset: EdaPreset;
  currentStage: EdaStageId;
  onSelectStage: (stage: EdaStageId) => void;
  onNextStage: () => void;
}

export function EdaFlowStepper({
  preset,
  currentStage,
  onSelectStage,
  onNextStage,
}: EdaFlowStepperProps) {
  const currentStageIndex = EDA_FLOW_STAGES.findIndex((s) => s.id === currentStage);
  const isFinalStage = currentStageIndex === EDA_FLOW_STAGES.length - 1;

  const currentStageData = EDA_FLOW_STAGES[currentStageIndex]!;
  const currentPresetStageInfo = preset.stages[currentStage];

  return (
    <div
      className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4"
      data-testid="eda-flow-stepper"
    >
      {/* Header & Flow Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 text-accent" />
          <h3 className="font-display text-body-md font-bold text-fg">
            OpenLane / OpenROAD RTL-to-GDSII Automated ASIC Flow
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={onNextStage}
            disabled={isFinalStage}
          >
            <Play className="size-3.5 mr-1 text-emerald-500" />
            {isFinalStage ? 'ASIC Tapeout Complete' : 'Execute Next EDA Stage'}
          </Button>
        </div>
      </div>

      {/* 7-Stage Horizontal Pipeline Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {EDA_FLOW_STAGES.map((stage, idx) => {
          const isSelected = stage.id === currentStage;
          const isPassed = idx < currentStageIndex;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(stage.id)}
              className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-accent bg-accent/10 ring-1 ring-accent'
                  : isPassed
                  ? 'border-hairline bg-surface-2 text-fg hover:border-hairline-strong'
                  : 'border-hairline bg-surface-2/40 text-fg-muted hover:border-hairline-strong'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-bold text-accent">
                    0{idx + 1}
                  </span>
                  {isPassed ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : isSelected ? (
                    <CheckCircle2 className="size-3.5 text-accent animate-pulse" />
                  ) : null}
                </div>
                <h4 className="font-display text-[11px] font-bold text-fg line-clamp-1">
                  {stage.name.split('&')[0]}
                </h4>
                <p className="text-[10px] font-mono text-accent truncate mt-0.5">
                  {stage.tool.split(' ')[0]}
                </p>
              </div>

              <div className="mt-2 pt-1 border-t border-hairline/60">
                <span className="text-[9px] text-fg-subtle truncate block">
                  {preset.stages[stage.id]?.metricValue}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail & Terminal Log Output */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {/* Stage Overview Card */}
        <div className="rounded-xl border border-hairline bg-surface-2 p-4 space-y-3">
          <div>
            <span className="text-caption font-semibold uppercase tracking-wider text-accent">
              Active EDA Stage
            </span>
            <h4 className="font-display text-body-md font-bold text-fg mt-0.5">
              {currentStageData.name}
            </h4>
            <p className="text-caption text-fg-muted mt-1">
              {currentStageData.description}
            </p>
          </div>

          <div className="space-y-1.5 border-t border-hairline pt-3 font-mono text-caption">
            <div className="flex justify-between">
              <span className="text-fg-muted">EDA Tool:</span>
              <span className="font-bold text-accent">{currentStageData.tool}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Artifact:</span>
              <span className="font-semibold text-fg">{currentStageData.outputArtifact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">{currentStageData.metricLabel}:</span>
              <span className="font-bold text-emerald-500">
                {currentPresetStageInfo?.metricValue}
              </span>
            </div>
          </div>
        </div>

        {/* Live EDA Tool Output Console (Yosys / OpenROAD / Magic Terminal) */}
        <div className="md:col-span-2 rounded-xl border border-hairline bg-surface-3 p-4 font-mono text-body-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-hairline mb-2">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-caption font-bold text-fg">
                {currentStageData.tool} Console Log
              </span>
            </div>
            <span className="text-[10px] text-fg-subtle">POSIX Exit Code: 0 (SUCCESS)</span>
          </div>

          <pre className="text-fg-muted overflow-x-auto leading-relaxed select-text max-h-[160px] scrollbar-thin">
            <code>{currentPresetStageInfo?.logSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
