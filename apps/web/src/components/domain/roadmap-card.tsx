'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ProgressBar,
} from '@hackerland/ui';
import {
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  CircleDot,
  Lock,
} from 'lucide-react';
import type { RoadmapView, RoadmapStage, RoadmapModule } from '@/lib/data/types';
import { TrackBadge } from './track-badge';

export interface RoadmapCardProps {
  roadmap: RoadmapView;
  expanded?: boolean;
  className?: string;
}

export function RoadmapCard({ roadmap, expanded = false, className }: RoadmapCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const doneStages = roadmap.stages.filter((s) => s.status === 'done').length;
  const totalStages = roadmap.stages.length;

  return (
    <Card
      accent={roadmap.track}
      className={`flex flex-col justify-between min-w-0 break-words ${className ?? ''}`}
    >
      <div>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <TrackBadge track={roadmap.track} />
              <Badge tone="neutral" className="capitalize">
                {roadmap.level}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-body-xs text-fg-subtle">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-fg-subtle" />
                {roadmap.hours} hrs
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5 text-fg-subtle" />
                {roadmap.learners.toLocaleString()} learners
              </span>
            </div>
          </div>

          <h3 className="font-display text-headline-sm text-fg break-words mt-1">
            {roadmap.title}
          </h3>
        </CardHeader>

        <CardBody className="space-y-4">
          <p className="text-body-sm text-fg-muted line-clamp-3 break-words">
            {roadmap.summary}
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-body-xs text-fg-subtle">
              <span>Progress</span>
              <span>
                {doneStages} of {totalStages} stages completed
              </span>
            </div>
            <ProgressBar
              value={doneStages}
              max={totalStages}
              tone={roadmap.track}
              label={`Roadmap progress for ${roadmap.title}`}
            />
          </div>

          {isExpanded && (
            <div className="mt-6 space-y-6 pt-4 border-t border-hairline">
              <h4 className="font-display text-label-md uppercase tracking-wider text-fg-subtle">
                Stages & Modules
              </h4>

              <div className="space-y-6">
                {roadmap.stages.map((stage: RoadmapStage, stageIdx: number) => {
                  const stageNumber = stageIdx + 1;
                  return (
                    <div
                      key={stage.title}
                      className="rounded-lg border border-hairline bg-surface-2/40 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface-1 font-display text-label-xs font-semibold text-fg">
                            {stageNumber}
                          </span>
                          <h5 className="font-display text-body-md font-semibold text-fg break-words">
                            {stage.title}
                          </h5>
                        </div>

                        <div>
                          {stage.status === 'done' && (
                            <Badge tone="success" className="gap-1">
                              <CheckCircle2 className="size-3" />
                              Done
                            </Badge>
                          )}
                          {stage.status === 'active' && (
                            <Badge tone="warning" className="gap-1">
                              <CircleDot className="size-3" />
                              In progress
                            </Badge>
                          )}
                          {stage.status === 'locked' && (
                            <Badge tone="neutral" className="gap-1">
                              <Lock className="size-3" />
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 pl-0 sm:pl-8">
                        {stage.modules.map((mod: RoadmapModule, modIdx: number) => (
                          <div
                            key={modIdx}
                            className="flex flex-col gap-2 rounded-md border border-hairline/60 bg-surface-1/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0 flex-1">
                              {mod.url ? (
                                <a
                                  href={mod.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 font-display text-body-sm font-medium text-fg hover:text-accent transition-colors break-words"
                                >
                                  <span>{mod.title}</span>
                                  <ExternalLink className="size-3.5 shrink-0 text-fg-subtle" />
                                </a>
                              ) : (
                                <span className="font-display text-body-sm font-medium text-fg break-words">
                                  {mod.title}
                                </span>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-body-xs text-fg-subtle">
                                <span>{mod.provider}</span>
                                <span>•</span>
                                <span>{mod.hours} hrs</span>
                              </div>
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-start sm:self-center">
                              {mod.free && (
                                <Badge tone="earn" variant="outline">
                                  FREE
                                </Badge>
                              )}
                              {mod.certified && (
                                <Badge tone="learn" variant="outline">
                                  CERTIFICATE
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </div>

      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>{isExpanded ? 'Collapse roadmap' : 'View syllabus & modules'}</span>
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
