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
import { formatDate } from '@/lib/format';
import { ProjectCover } from './project-cover';

export interface ProjectCardProps {
  project: ProjectSummary;
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

export function ProjectCard({
  project,
  className,
  headingLevel = 'h3',
}: ProjectCardProps) {
  const primaryTrack = (project.tracks[0] ?? 'code') as Track;
  const Heading = headingLevel;

  return (
    <Card
      accent={primaryTrack}
      interactive
      className={cn('group flex flex-col justify-between overflow-hidden', className)}
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
            <span className="font-mono text-label-sm uppercase text-fg-subtle">
              {project.licence}
            </span>
          </div>

          <Heading className="mt-1 font-display text-headline-sm text-fg transition-colors group-hover:text-accent min-w-0 break-words">
            {project.title}
          </Heading>
        </CardHeader>

        <CardBody className="flex-1 py-2">
          <p className="line-clamp-2 text-body-sm text-fg-muted break-words">
            {project.summary}
          </p>

          {project.funding ? (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-label-sm">
                <span className="text-fg-subtle">Funding</span>
                <span className="font-mono tabular-nums text-fg">
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
          <span className="truncate font-mono text-label-sm text-fg-subtle">
            {project.squadSize} {project.squadSize === 1 ? 'member' : 'members'}
          </span>
        </div>

        {project.openRoleCount > 0 ? (
          <Badge tone="accent" variant="solid">
            {project.openRoleCount} {project.openRoleCount === 1 ? 'role open' : 'roles open'}
          </Badge>
        ) : (
          <span className="font-mono text-label-sm text-fg-subtle">
            {formatDate(project.updatedAt)}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
