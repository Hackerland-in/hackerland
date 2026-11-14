import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PROJECT_STAGE_LABEL,
  TRACK_META,
  formatMoney,
} from '@hackerland/core';
import {
  AvatarGroup,
  Badge,
  Button,
  Chip,
  EmptyState,
  Panel,
  ProgressBar,
  SegmentedProgress,
  StatTile,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackerland/ui';
import { getProject, listProjects } from '@/lib/data/queries';
import { formatDate } from '@/lib/format';
import { PersonChip } from '@/components/domain/person-chip';
import { ProjectCover } from '@/components/domain/project-cover';
import { RoleCard } from '@/components/domain/role-card';

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return {
      title: 'Signal lost: page not found · Hackerland',
    };
  }
  return {
    title: `${project.title} · Hackerland`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const primaryTrack = project.tracks[0] ?? 'code';

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-8">
      {/* Top Blueprint Cover Art */}
      <ProjectCover
        tracks={project.tracks}
        title={project.title}
        className="h-44 w-full rounded-lg md:h-64"
      />

      {/* Hero Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-label-sm uppercase text-accent-fg">
              PROJECT #{project.slug.slice(0, 8).toUpperCase()}
            </span>
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
            <Badge tone="accent" variant="outline">
              Public workspace
            </Badge>
          </div>

          <h1 className="font-display text-headline-xl text-fg break-words">
            {project.title}
          </h1>

          <p className="text-body-lg text-fg-muted break-words">
            {project.summary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            disabled
            title="Available once accounts launch"
            aria-disabled="true"
          >
            Offer mentorship
          </Button>
          <Button
            variant="primary"
            disabled
            title="Available once accounts launch"
            aria-disabled="true"
          >
            Join squad
          </Button>
        </div>
      </div>

      {/* Stat Strip of 4 StatTiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="STAGE"
          value={PROJECT_STAGE_LABEL[project.stage]}
          hint={`Next: ${project.milestone.next}`}
        >
          <div className="mt-2">
            <SegmentedProgress
              completed={project.milestone.current}
              total={project.milestone.total}
              label="Milestone progress"
              tone={primaryTrack}
            />
          </div>
        </StatTile>

        <StatTile
          label="FUNDING"
          value={
            project.funding
              ? formatMoney(project.funding.raised, project.funding.currency)
              : 'Self-funded'
          }
          hint={
            project.funding
              ? `Goal: ${formatMoney(project.funding.goal, project.funding.currency)}`
              : 'No capital required'
          }
          tone="earn"
        >
          {project.funding ? (
            <div className="mt-2">
              <ProgressBar
                value={project.funding.raised}
                max={project.funding.goal}
                tone="earn"
                label="Funding progress"
              />
            </div>
          ) : null}
        </StatTile>

        <StatTile
          label="SQUAD"
          value={`${project.squadSize} active`}
          hint={`${project.openRoleCount} ${project.openRoleCount === 1 ? 'role open' : 'roles open'}`}
        >
          <div className="mt-2">
            <AvatarGroup
              people={project.squad.map((p) => ({ name: p.name, src: p.avatarUrl }))}
              max={4}
              size="sm"
            />
          </div>
        </StatTile>

        <StatTile
          label="ACTIVITY"
          value={`${project.updates.length} ${project.updates.length === 1 ? 'update' : 'updates'}`}
          hint={`Last update: ${formatDate(project.updatedAt)}`}
        />
      </div>

      {/* Two-Column Body */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left Column: Tabs */}
        <div className="min-w-0 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList label="Project sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="squad-roles">Squad & Roles</TabsTrigger>
              <TabsTrigger value="updates">
                Updates ({project.updates.length})
              </TabsTrigger>
              <TabsTrigger value="resources">
                Resources ({project.resources.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab: Overview */}
            <TabsContent value="overview" className="space-y-6">
              <Panel title="About">
                <p className="whitespace-pre-line text-body-md leading-relaxed text-fg-muted break-words">
                  {project.body}
                </p>
              </Panel>

              <Panel title="Squad leads">
                <div className="space-y-4">
                  {project.leads.map((lead) => (
                    <div
                      key={lead.handle}
                      className="rounded-lg border border-hairline bg-surface-2/40 p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <PersonChip person={lead} size="md" />
                        <Badge tone="accent" variant="outline">
                          {lead.role}
                        </Badge>
                      </div>
                      {lead.bio ? (
                        <p className="text-body-sm text-fg-muted break-words">
                          {lead.bio}
                        </p>
                      ) : null}
                      {lead.skills && lead.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {lead.skills.map((skill) => (
                            <Chip key={skill} tone="neutral">
                              {skill}
                            </Chip>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Panel>

              {project.resources.length > 0 ? (
                <Panel
                  title="Resources & bill of materials"
                  action={
                    <span className="font-mono text-label-sm text-fg-subtle">
                      {project.resources.length} items
                    </span>
                  }
                >
                  <div className="max-w-full overflow-x-auto">
                    <table className="w-full min-w-[540px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-hairline font-display text-label-sm uppercase text-fg-subtle">
                          <th className="px-3 py-2.5">Item</th>
                          <th className="px-3 py-2.5 text-center">Qty</th>
                          <th className="px-3 py-2.5">Specification</th>
                          <th className="px-3 py-2.5 text-right">Est. Cost</th>
                          <th className="px-3 py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline text-body-sm">
                        {project.resources.map((item, idx) => (
                          <tr key={idx} className="transition-colors hover:bg-surface-2/40">
                            <td className="px-3 py-3 font-medium text-fg break-words">
                              {item.name}
                            </td>
                            <td className="px-3 py-3 text-center font-mono text-fg-muted">
                              {item.qty}
                            </td>
                            <td className="px-3 py-3 font-mono text-xs text-fg-muted break-words">
                              {item.spec ?? '—'}
                            </td>
                            <td className="px-3 py-3 text-right font-mono tabular-nums text-fg">
                              {item.cost !== undefined && item.currency
                                ? formatMoney(item.cost, item.currency)
                                : '—'}
                            </td>
                            <td className="px-3 py-3 text-right">
                              {item.status === 'funded' && (
                                <Badge tone="success" variant="solid">
                                  Funded
                                </Badge>
                              )}
                              {item.status === 'sourcing' && (
                                <Badge tone="warning" variant="outline">
                                  Sourcing
                                </Badge>
                              )}
                              {item.status === 'needs-funding' && (
                                <Badge tone="danger" variant="outline">
                                  Needs funding
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              ) : null}

              {project.updates.length > 0 ? (
                <Panel
                  title="Updates"
                  action={
                    <span className="font-mono text-label-sm text-fg-subtle">
                      {project.updates.length} posts
                    </span>
                  }
                >
                  <div className="space-y-4">
                    {project.updates.map((update) => (
                      <div
                        key={update.id}
                        className="rounded-lg border border-hairline bg-surface-2/40 p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="accent" variant="solid">
                              {update.kind}
                            </Badge>
                            <span className="font-mono text-label-sm text-fg-subtle">
                              {formatDate(update.createdAt)}
                            </span>
                          </div>
                          <PersonChip person={update.author} size="sm" showBadges={false} />
                        </div>

                        <h3 className="font-display text-headline-sm text-fg break-words">
                          {update.title}
                        </h3>

                        <p className="whitespace-pre-line text-body-sm text-fg-muted break-words">
                          {update.body}
                        </p>

                        {update.progress ? (
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-label-sm text-fg-subtle">
                              <span>{update.progress.label}</span>
                              <span className="font-mono">
                                {update.progress.current} / {update.progress.total}
                              </span>
                            </div>
                            <SegmentedProgress
                              completed={update.progress.current}
                              total={update.progress.total}
                              label={update.progress.label}
                              tone="accent"
                            />
                          </div>
                        ) : null}

                        {update.tags && update.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {update.tags.map((tag) => (
                              <span key={tag} className="font-mono text-[11px] text-fg-subtle">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Panel>
              ) : null}
            </TabsContent>

            {/* Tab: Squad & Roles */}
            <TabsContent value="squad-roles" className="space-y-6">
              <Panel title="Squad leads">
                <div className="space-y-4">
                  {project.leads.map((lead) => (
                    <div
                      key={lead.handle}
                      className="rounded-lg border border-hairline bg-surface-2/40 p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <PersonChip person={lead} size="md" />
                        <Badge tone="accent" variant="outline">
                          {lead.role}
                        </Badge>
                      </div>
                      {lead.bio ? (
                        <p className="text-body-sm text-fg-muted break-words">
                          {lead.bio}
                        </p>
                      ) : null}
                      {lead.skills && lead.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {lead.skills.map((skill) => (
                            <Chip key={skill} tone="neutral">
                              {skill}
                            </Chip>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Active squad">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {project.squad.map((member) => (
                    <div
                      key={member.handle}
                      className="rounded-lg border border-hairline bg-surface-2/40 p-3"
                    >
                      <PersonChip person={member} size="sm" />
                    </div>
                  ))}
                </div>
              </Panel>
            </TabsContent>

            {/* Tab: Updates */}
            <TabsContent value="updates" className="space-y-6">
              <Panel title="Project updates">
                {project.updates.length > 0 ? (
                  <div className="space-y-4">
                    {project.updates.map((update) => (
                      <div
                        key={update.id}
                        className="rounded-lg border border-hairline bg-surface-2/40 p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="accent" variant="solid">
                              {update.kind}
                            </Badge>
                            <span className="font-mono text-label-sm text-fg-subtle">
                              {formatDate(update.createdAt)}
                            </span>
                          </div>
                          <PersonChip person={update.author} size="sm" showBadges={false} />
                        </div>

                        <h3 className="font-display text-headline-sm text-fg break-words">
                          {update.title}
                        </h3>

                        <p className="whitespace-pre-line text-body-sm text-fg-muted break-words">
                          {update.body}
                        </p>

                        {update.progress ? (
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-label-sm text-fg-subtle">
                              <span>{update.progress.label}</span>
                              <span className="font-mono">
                                {update.progress.current} / {update.progress.total}
                              </span>
                            </div>
                            <SegmentedProgress
                              completed={update.progress.current}
                              total={update.progress.total}
                              label={update.progress.label}
                              tone="accent"
                            />
                          </div>
                        ) : null}

                        {update.tags && update.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {update.tags.map((tag) => (
                              <span key={tag} className="font-mono text-[11px] text-fg-subtle">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No updates posted yet"
                    description="The squad has not posted any progress logs yet. Check back soon for project milestones."
                  />
                )}
              </Panel>
            </TabsContent>

            {/* Tab: Resources */}
            <TabsContent value="resources" className="space-y-6">
              <Panel title="Resources & bill of materials">
                {project.resources.length > 0 ? (
                  <div className="max-w-full overflow-x-auto">
                    <table className="w-full min-w-[540px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-hairline font-display text-label-sm uppercase text-fg-subtle">
                          <th className="px-3 py-2.5">Item</th>
                          <th className="px-3 py-2.5 text-center">Qty</th>
                          <th className="px-3 py-2.5">Specification</th>
                          <th className="px-3 py-2.5 text-right">Est. Cost</th>
                          <th className="px-3 py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline text-body-sm">
                        {project.resources.map((item, idx) => (
                          <tr key={idx} className="transition-colors hover:bg-surface-2/40">
                            <td className="px-3 py-3 font-medium text-fg break-words">
                              {item.name}
                            </td>
                            <td className="px-3 py-3 text-center font-mono text-fg-muted">
                              {item.qty}
                            </td>
                            <td className="px-3 py-3 font-mono text-xs text-fg-muted break-words">
                              {item.spec ?? '—'}
                            </td>
                            <td className="px-3 py-3 text-right font-mono tabular-nums text-fg">
                              {item.cost !== undefined && item.currency
                                ? formatMoney(item.cost, item.currency)
                                : '—'}
                            </td>
                            <td className="px-3 py-3 text-right">
                              {item.status === 'funded' && (
                                <Badge tone="success" variant="solid">
                                  Funded
                                </Badge>
                              )}
                              {item.status === 'sourcing' && (
                                <Badge tone="warning" variant="outline">
                                  Sourcing
                                </Badge>
                              )}
                              {item.status === 'needs-funding' && (
                                <Badge tone="danger" variant="outline">
                                  Needs funding
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="No bill of materials recorded"
                    description="This project has no hardware components or procurement items listed."
                  />
                )}
              </Panel>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Rail: Panel "Open roles" */}
        <div className="min-w-0">
          <Panel
            title="Open roles"
            action={
              <Badge tone="accent" variant="solid">
                {project.openRoles.length} OPEN
              </Badge>
            }
            className="sticky top-20"
          >
            {project.openRoles.length > 0 ? (
              <div className="space-y-4">
                {project.openRoles.map((role) => (
                  <RoleCard key={role.id} role={role} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-fg-muted">
                All squad positions are currently filled. Follow this project to be notified when new roles open.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
