import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  Cpu,
  Factory,
  Globe2,
  Rocket,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import {
  PROJECT_STAGE_LABEL,
  TRACK_META,
  formatMoney,
} from '@hackerland/core';
import {
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  EmptyState,
  Panel,
  ProgressBar,
  SegmentedProgress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackerland/ui';
import {
  getPlatformStats,
  getProject,
  listOpportunities,
  listProjects,
} from '@/lib/data/queries';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { formatDate } from '@/lib/format';
import { PersonChip } from '@/components/domain/person-chip';
import { ProjectCover } from '@/components/domain/project-cover';
import { PostCard } from '@/components/domain/post-card';
import { KiCanvasViewer } from '@/components/domain/kicanvas-viewer';
import { WokwiSimulator } from '@/components/domain/wokwi-simulator';
import { ProjectBOM } from '@/components/domain/project-bom';
import { ProjectDiscussion } from '@/components/domain/project-discussion';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRightRail } from '@/components/social/community-right-rail';
import {
  InteractiveRoleList,
  PostUpdateAction,
  ProjectHeroActions,
} from './project-interactions';

export const dynamic = 'force-dynamic';

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
      title: 'Project not found · Hackerland',
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
  const [project, allProjects, bounties, stats] = await Promise.all([
    getProject(slug),
    listProjects(),
    listOpportunities('bounty'),
    getPlatformStats(),
  ]);

  if (!project) {
    notFound();
  }

  const otherTrending = allProjects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <SocialCommunityProvider>
      <SocialShell
        rightRail={
          <div className="space-y-5 min-w-0">
            <Panel
              title="Open Squad Roles"
              action={
                <Badge tone="accent" variant="solid">
                  {project.openRoles.length} open
                </Badge>
              }
            >
              <InteractiveRoleList slug={project.slug} roles={project.openRoles} compact />
            </Panel>

            <CommunityRightRail
              suggestedMakers={ALL_PEOPLE.slice(0, 3)}
              trendingProjects={otherTrending}
              openBounties={bounties.slice(0, 2)}
              stats={stats}
            />
          </div>
        }
      >
        {/* Back Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-1 border border-hairline px-3.5 py-1.5 text-body-sm font-display font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors shadow-xs"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            <span>All builds</span>
          </Link>

          <Button asChild variant="soft" size="sm">
            <Link href={`/projects/${project.slug}/squad`}>
              <Users className="size-3.5" aria-hidden="true" />
              <span>Squad Room &amp; Escrow</span>
            </Link>
          </Button>
        </div>

        {/* End-to-End Studio & Export Pipeline */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-hairline bg-surface-1 px-3.5 py-2.5 text-[11px] shadow-xs">
          <span className="font-mono font-semibold uppercase tracking-wide text-accent-fg mr-1">
            Build Pipeline:
          </span>
          <Link
            href={`/prototype?title=${encodeURIComponent(project.title)}`}
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <Cpu className="size-3 text-accent" aria-hidden="true" />
            <span>Prototype Architect</span>
          </Link>
          <Link
            href={`/manufacturing/pcb?title=${encodeURIComponent(project.title)}`}
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <Zap className="size-3 text-accent" aria-hidden="true" />
            <span>PCB Studio</span>
          </Link>
          <Link
            href={`/manufacturing/rfq?boardName=${encodeURIComponent(project.title)}`}
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <Factory className="size-3 text-accent" aria-hidden="true" />
            <span>Instant Fab RFQ</span>
          </Link>
          <Link
            href="/testbeds"
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <Activity className="size-3 text-accent" aria-hidden="true" />
            <span>HIL Testbeds</span>
          </Link>
          <Link
            href="/compliance"
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <ShieldCheck className="size-3 text-accent" aria-hidden="true" />
            <span>Compliance</span>
          </Link>
          <Link
            href={`/launch?title=${encodeURIComponent(project.title)}&tagline=${encodeURIComponent(project.summary)}`}
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <Rocket className="size-3 text-accent" aria-hidden="true" />
            <span>Launch Kit</span>
          </Link>
          <Link
            href="/export"
            className="inline-flex items-center gap-1 rounded-full border border-hairline bg-sunken px-2.5 py-1 font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors"
          >
            <Globe2 className="size-3 text-accent" aria-hidden="true" />
            <span>Export Hub</span>
          </Link>
        </div>

        {/* Social Showcase Hero Card */}
        <Card className="overflow-hidden min-w-0 break-words">
          <ProjectCover
            tracks={project.tracks}
            title={project.title}
            className="h-36 sm:h-48 w-full"
          />

          <CardBody className="p-5 sm:p-6 space-y-5">
            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {project.tracks.map((track) => (
                  <Badge key={track} tone={track} variant="outline">
                    {TRACK_META[track]?.label ?? track}
                  </Badge>
                ))}
                <Badge tone="neutral" variant="outline">
                  {PROJECT_STAGE_LABEL[project.stage]}
                </Badge>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-fg-subtle">
                  {project.licence}
                </span>
              </div>

              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg break-words [overflow-wrap:anywhere]">
                {project.title}
              </h1>

              <p className="text-body-md text-fg-muted break-words [overflow-wrap:anywhere] leading-relaxed">
                {project.summary}
              </p>

              <div className="pt-1">
                <ProjectHeroActions
                  slug={project.slug}
                  openRoles={project.openRoles}
                  squadSize={project.squadSize}
                />
              </div>
            </div>

            {/* Compact Progress & Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-hairline pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-display font-semibold text-fg">
                    {PROJECT_STAGE_LABEL[project.stage]}
                  </span>
                  <span className="text-accent-fg font-semibold tabular-nums">
                    {project.milestone.current}/{project.milestone.total}
                  </span>
                </div>
                <SegmentedProgress
                  completed={project.milestone.current}
                  total={project.milestone.total}
                  label="Milestone progress"
                  tone="accent"
                />
                <p className="text-[12px] text-fg-subtle truncate">Next: {project.milestone.next}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-display font-semibold text-fg">Funding</span>
                  <span className="text-earn-fg font-semibold tabular-nums">
                    {project.funding
                      ? `${formatMoney(project.funding.raised, project.funding.currency)} / ${formatMoney(project.funding.goal, project.funding.currency)}`
                      : 'Self-funded'}
                  </span>
                </div>
                {project.funding ? (
                  <ProgressBar
                    value={project.funding.raised}
                    max={project.funding.goal}
                    tone="earn"
                    label="Funding progress"
                  />
                ) : (
                  <p className="text-[12px] text-fg-subtle">Community &amp; volunteer run</p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="text-left sm:text-right">
                  <div className="font-display text-body-sm font-bold text-fg tabular-nums">
                    {project.squadSize} builders
                  </div>
                  <div className="text-[12px] text-fg-subtle">
                    Updated {formatDate(project.updatedAt)}
                  </div>
                </div>
                <AvatarGroup
                  people={project.squad.map((p) => ({ name: p.name, src: p.avatarUrl }))}
                  max={4}
                  size="sm"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Showcase Navigation Tabs */}
        <Tabs defaultValue="overview" className="min-w-0">
          <TabsList label="Project sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Updates ({project.updates.length})</TabsTrigger>
            <TabsTrigger value="squad-roles">Squad ({project.squadSize})</TabsTrigger>
            <TabsTrigger value="resources">Hardware &amp; BOM ({project.resources.length})</TabsTrigger>
            <TabsTrigger value="discussions">Discussion</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-5">
            <Panel title="About this build">
              <p className="whitespace-pre-line text-body-md leading-relaxed text-fg-muted break-words [overflow-wrap:anywhere]">
                {project.body}
              </p>
            </Panel>

            <Panel title="Project Leads">
              <div className="grid grid-cols-1 gap-3.5">
                {project.leads.map((lead) => (
                  <div
                    key={lead.handle}
                    className="rounded-xl border border-hairline bg-surface-2/50 p-4 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PersonChip person={lead} size="md" />
                      <Badge tone="accent" variant="outline">
                        {lead.role}
                      </Badge>
                    </div>
                    {lead.bio ? (
                      <p className="text-body-sm text-fg-muted break-words">{lead.bio}</p>
                    ) : null}
                    {lead.skills && lead.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {lead.skills.map((skill) => (
                          <Chip key={skill}>{skill}</Chip>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Panel>

            {project.updates.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-display text-headline-sm font-bold text-fg">
                    Recent build logs
                  </h2>
                  <PostUpdateAction slug={project.slug} />
                </div>
                {project.updates.map((update) => (
                  <PostCard key={update.id} post={update} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-hairline bg-surface-1 p-4 shadow-xs">
              <div>
                <h2 className="font-display text-body-md font-bold text-fg">
                  Project Build Stream
                </h2>
                <p className="text-body-sm text-fg-muted">
                  Milestone notes, bench runs, and telemetry shared by the squad.
                </p>
              </div>
              <PostUpdateAction slug={project.slug} />
            </div>

            {project.updates.length > 0 ? (
              <div className="space-y-4">
                {project.updates.map((update) => (
                  <PostCard key={update.id} post={update} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No build logs yet"
                description="Follow this build to catch milestone updates as soon as the team ships."
              />
            )}
          </TabsContent>

          {/* Squad Tab */}
          <TabsContent value="squad-roles" className="space-y-5">
            <Panel title="Active Squad Members">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.squad.map((member) => (
                  <div
                    key={member.handle}
                    className="rounded-xl border border-hairline bg-surface-2/50 p-3"
                  >
                    <PersonChip person={member} size="sm" />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title={`Open Roles (${project.openRoles.length})`}>
              <InteractiveRoleList slug={project.slug} roles={project.openRoles} />
            </Panel>
          </TabsContent>

          {/* Hardware & BOM Tab */}
          <TabsContent value="resources" className="space-y-5">
            <ProjectBOM
              initialResources={project.resources}
              projectTitle={project.title}
            />

            <Panel title="PCB & Schematic Preview">
              <KiCanvasViewer boardName={`${project.title} Controller PCB`} />
            </Panel>

            <Panel title="MCU Simulation Bench">
              <WokwiSimulator projectTitle={`${project.title} MCU Twin`} />
            </Panel>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussions" className="space-y-5">
            <ProjectDiscussion projectSlug={project.slug} projectTitle={project.title} />
          </TabsContent>
        </Tabs>
      </SocialShell>
    </SocialCommunityProvider>
  );
}
