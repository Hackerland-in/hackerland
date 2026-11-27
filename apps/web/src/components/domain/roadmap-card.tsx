'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ProgressBar,
  cn,
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
  Bookmark,
  Check,
  Sparkles,
} from 'lucide-react';
import type { RoadmapView, RoadmapStage, RoadmapModule } from '@/lib/data/types';
import { getRoadmapNextSteps } from '@/lib/data/sectors-data';
import { useSocialCommunity } from '@/components/social/social-context';
import { useVenture } from '@/components/social/venture-context';
import { TrackBadge } from './track-badge';

export interface RoadmapCardProps {
  roadmap: RoadmapView;
  expanded?: boolean;
  className?: string;
  recommendedLabHref?: string;
  recommendedSectorHref?: string;
}

export function RoadmapCard({
  roadmap,
  expanded = false,
  className,
  recommendedLabHref,
  recommendedSectorHref,
}: RoadmapCardProps) {
  const storageKey = `hackerland_roadmap_${roadmap.slug}`;
  const nextSteps = getRoadmapNextSteps(roadmap.slug, roadmap.track);
  const labHref = recommendedLabHref ?? nextSteps.primaryLabRoute;
  const sectorHref = recommendedSectorHref ?? nextSteps.primarySectorRoute;
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [sharedNotice, setSharedNotice] = useState(false);

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();
  const { markLearnCompleted } = useVenture();
  const saved = isItemSaved(`roadmap:${roadmap.slug}`);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompletedModules(parsed);
      }
    } catch {}
  }, [storageKey]);

  const toggleModule = (modKey: string) => {
    const isNowComplete = !completedModules.includes(modKey);
    setCompletedModules((prev) => {
      const next = prev.includes(modKey) ? prev.filter((k) => k !== modKey) : [...prev, modKey];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
    if (isNowComplete) {
      markLearnCompleted(roadmap.slug);
    }
  };

  const totalModules = roadmap.stages.reduce((acc, s) => acc + s.modules.length, 0);
  const defaultDoneCount = roadmap.stages
    .filter((s) => s.status === 'done')
    .reduce((acc, s) => acc + s.modules.length, 0);
  const activeDoneCount =
    completedModules.length > 0 ? completedModules.length : defaultDoneCount;

  const doneStages = roadmap.stages.filter((s, sIdx) => {
    const stageKeys = s.modules.map((_, mIdx) => `${sIdx}-${mIdx}`);
    if (completedModules.length > 0 && stageKeys.length > 0) {
      return stageKeys.every((k) => completedModules.includes(k));
    }
    return s.status === 'done';
  }).length;
  const totalStages = roadmap.stages.length;

  const handleShareMilestone = async () => {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'update',
          title: `Roadmap Milestone: ${roadmap.title}`,
          body: `Completed ${activeDoneCount} of ${totalModules} modules (${doneStages}/${totalStages} stages) in the ${roadmap.title} track.`,
          tags: ['learn-in-public', roadmap.track],
        }),
      });
    } catch {}
    setSharedNotice(true);
    setTimeout(() => setSharedNotice(false), 3000);
  };

  return (
    <Card
      accent={roadmap.track}
      className={cn(
        'flex flex-col justify-between min-w-0 [overflow-wrap:anywhere] transition-all hover:border-accent/40',
        className,
      )}
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
            <div className="flex items-center gap-2.5 text-body-xs text-fg-subtle">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-fg-subtle" aria-hidden="true" />
                {roadmap.hours} hrs
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5 text-fg-subtle" aria-hidden="true" />
                {roadmap.learners.toLocaleString()} learners
              </span>
              <button
                type="button"
                onClick={() => toggleSaveItem(`roadmap:${roadmap.slug}`)}
                aria-label={saved ? `Unsave ${roadmap.title}` : `Save ${roadmap.title}`}
                aria-pressed={saved}
                className={cn(
                  'flex size-7 items-center justify-center rounded-full border transition-colors',
                  saved
                    ? 'border-accent/40 bg-accent-soft text-accent-fg'
                    : 'border-hairline bg-surface-2/60 text-fg-subtle hover:border-accent/30 hover:text-accent-fg',
                )}
              >
                <Bookmark className={cn('size-3', saved && 'fill-current')} aria-hidden="true" />
              </button>
            </div>
          </div>

          <h3 className="font-display text-headline-sm text-fg [overflow-wrap:anywhere] mt-1">
            {roadmap.title}
          </h3>
        </CardHeader>

        <CardBody className="space-y-4">
          <p className="text-body-sm text-fg-muted line-clamp-3 [overflow-wrap:anywhere]">
            {roadmap.summary}
          </p>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-body-xs text-fg-subtle">
              <span>Progress ({activeDoneCount}/{totalModules} modules)</span>
              <span>
                {doneStages} of {totalStages} stages completed
              </span>
            </div>
            <ProgressBar
              value={totalModules > 0 ? activeDoneCount : doneStages}
              max={totalModules > 0 ? totalModules : totalStages}
              tone={roadmap.track}
              label={`Roadmap progress for ${roadmap.title}`}
            />
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-5 pt-4 border-t border-hairline">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display text-label-md uppercase tracking-wider text-fg-subtle">
                  Stages &amp; Interactive Checklist
                </h4>
                <button
                  type="button"
                  onClick={handleShareMilestone}
                  className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent-soft px-3 py-1 text-[11px] font-display font-semibold text-accent-fg hover:bg-accent hover:text-on-solid transition-colors"
                >
                  <Sparkles className="size-3" aria-hidden="true" />
                  <span>{sharedNotice ? 'Shared to Feed!' : 'Share Progress'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {roadmap.stages.map((stage: RoadmapStage, stageIdx: number) => {
                  const stageNumber = stageIdx + 1;
                  return (
                    <div
                      key={stage.title}
                      className="rounded-xl border border-hairline bg-sunken/70 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface-1 font-display text-label-sm font-semibold text-fg">
                            {stageNumber}
                          </span>
                          <h5 className="font-display text-body-md font-semibold text-fg [overflow-wrap:anywhere]">
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
                              Open to Check
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 pl-0 sm:pl-8">
                        {stage.modules.map((mod: RoadmapModule, modIdx: number) => {
                          const modKey = `${stageIdx}-${modIdx}`;
                          const isChecked = completedModules.includes(modKey);
                          return (
                            <div
                              key={modIdx}
                              className={cn(
                                'flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between transition-colors',
                                isChecked
                                  ? 'border-success/35 bg-success/5'
                                  : 'border-hairline bg-surface-1',
                              )}
                            >
                              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                <button
                                  type="button"
                                  onClick={() => toggleModule(modKey)}
                                  aria-label={`Mark ${mod.title} completed`}
                                  aria-pressed={isChecked}
                                  className={cn(
                                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                                    isChecked
                                      ? 'border-accent bg-accent text-on-solid'
                                      : 'border-line bg-sunken text-transparent hover:border-accent',
                                  )}
                                >
                                  <Check className="size-3" aria-hidden="true" />
                                </button>

                                <div className="min-w-0 flex-1">
                                  {mod.url ? (
                                    <a
                                      href={mod.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 font-display text-body-sm font-medium text-fg hover:text-accent-fg transition-colors [overflow-wrap:anywhere]"
                                    >
                                      <span className={cn(isChecked && 'line-through text-fg-muted')}>
                                        {mod.title}
                                      </span>
                                      <ExternalLink className="size-3.5 shrink-0 text-fg-subtle" />
                                    </a>
                                  ) : (
                                    <span
                                      className={cn(
                                        'font-display text-body-sm font-medium text-fg [overflow-wrap:anywhere]',
                                        isChecked && 'line-through text-fg-muted',
                                      )}
                                    >
                                      {mod.title}
                                    </span>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-body-xs text-fg-subtle">
                                    <span>{mod.provider}</span>
                                    <span>•</span>
                                    <span>{mod.hours} hrs</span>
                                  </div>
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
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </div>

      <CardFooter className="flex-col items-stretch gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span>{isExpanded ? 'Collapse roadmap' : 'View syllabus & interactive checklist'}</span>
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline/70 pt-2 text-[11px] font-display">
          <span className="font-semibold uppercase tracking-wider text-fg-subtle">
            Apply Next:
          </span>
          <div className="flex flex-wrap items-center gap-2 font-semibold text-fg-muted">
            <Link href={labHref} className="hover:text-accent-fg transition-colors">
              Labs
            </Link>
            <span className="text-fg-subtle" aria-hidden="true">·</span>
            <Link href="/ideas" className="hover:text-accent-fg transition-colors">
              Ideas
            </Link>
            <span className="text-fg-subtle" aria-hidden="true">·</span>
            <Link href={sectorHref} className="text-accent-fg hover:underline">
              Sectors ({nextSteps.primarySectorLabel})
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
