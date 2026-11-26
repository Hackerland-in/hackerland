'use client';

import Link from 'next/link';
import type { ProjectSummary } from '@/lib/data/types';
import {
  AvatarGroup,
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ProgressBar,
  cn,
} from '@hackerland/ui';
import {
  PROJECT_STAGE_LABEL,
  TRACK_META,
  formatMoney,
  type Track,
} from '@hackerland/core';
import { Heart, Users } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { ProjectCover } from './project-cover';
import { useSocialCommunity } from '@/components/social/social-context';

export interface ProjectCardProps {
  project: ProjectSummary;
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

function getBaseStars(slug: string, squadSize: number): number {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) % 45;
  return 18 + squadSize * 5 + hash;
}

export function ProjectCard({
  project,
  className,
  headingLevel = 'h3',
}: ProjectCardProps) {
  const { isProjectStarred, toggleStarProject } = useSocialCommunity();
  const primaryTrack = (project.tracks[0] ?? 'code') as Track;
  const Heading = headingLevel;

  const starred = isProjectStarred(project.slug);
  const starCount = getBaseStars(project.slug, project.squadSize) + (starred ? 1 : 0);

  return (
    <Card
      accent={primaryTrack}
      interactive
      className={cn('group flex flex-col justify-between overflow-hidden min-w-0', className)}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ProjectCover
          tracks={project.tracks}
          title={project.title}
          className="h-32 w-full"
        />

        <CardHeader>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.tracks.map((track) => (
              <Badge key={track} tone={track} variant="outline">
                {TRACK_META[track]?.label ?? track}
              </Badge>
            ))}
            <Badge tone="neutral" variant="outline">
              {PROJECT_STAGE_LABEL[project.stage]}
            </Badge>
            <span className="font-mono text-[11px] text-fg-subtle">
              {project.licence}
            </span>
          </div>

          <Heading className="mt-1 font-display text-headline-sm font-bold text-fg transition-colors group-hover:text-accent-fg min-w-0 break-words [overflow-wrap:anywhere]">
            {project.title}
          </Heading>
        </CardHeader>

        <CardBody className="flex-1 py-2">
          <p className="line-clamp-2 text-body-sm text-fg-muted break-words [overflow-wrap:anywhere]">
            {project.summary}
          </p>

          {project.funding ? (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-fg-subtle">Funding</span>
                <span className="font-display font-semibold tabular-nums text-fg">
                  {formatMoney(project.funding.raised, project.funding.currency)} /{' '}
                  {formatMoney(project.funding.goal, project.funding.currency)}
                </span>
              </div>
              <ProgressBar
                value={project.funding.raised}
                max={project.funding.goal}
                tone="earn"
                label={`Funding progress for ${project.title}`}
              />
            </div>
          ) : null}
        </CardBody>
      </Link>

      <CardFooter className="justify-between text-body-sm">
        <div className="flex min-w-0 items-center gap-2">
          <AvatarGroup
            people={project.squad.map((p) => ({ name: p.name, src: p.avatarUrl }))}
            max={3}
            size="sm"
          />
          <span className="inline-flex items-center gap-1 truncate text-[12px] text-fg-subtle tabular-nums">
            <Users className="size-3 shrink-0" aria-hidden="true" />
            {project.squadSize}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleStarProject(project.slug)}
            aria-pressed={starred}
            aria-label={starred ? `Unlike ${project.title}` : `Like ${project.title}`}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-display font-semibold tabular-nums transition-colors border',
              starred
                ? 'border-accent/30 bg-accent/10 text-accent-fg'
                : 'border-hairline bg-surface-1 text-fg-subtle hover:border-accent/30 hover:text-accent-fg',
            )}
          >
            <Heart className={cn('size-3.5', starred && 'fill-accent text-accent')} aria-hidden="true" />
            <span>{starCount}</span>
          </button>

          {project.openRoleCount > 0 ? (
            <Badge tone="accent" variant="solid">
              {project.openRoleCount} open
            </Badge>
          ) : (
            <span className="text-[11px] text-fg-subtle">
              {formatDate(project.updatedAt)}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
