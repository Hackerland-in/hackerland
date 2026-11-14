import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  EmptyState,
  Panel,
  StatTile,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackerland/ui';
import { MapPin, ExternalLink, Users, Award, ShieldCheck } from 'lucide-react';
import { getProfile } from '@/lib/data/queries';
import { formatDate } from '@/lib/format';
import { PersonChip } from '@/components/domain/person-chip';
import { ProjectCard } from '@/components/domain/project-card';
import { TrackBadge } from '@/components/domain/track-badge';
import { Money } from '@/components/domain/money';

interface ProfilePageProps {
  params: Promise<{
    handle: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (!profile) {
    return { title: 'Signal Lost · Profile Not Found' };
  }
  return {
    title: `${profile.name} (@${profile.handle})`,
    description: profile.headline || profile.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  const profile = await getProfile(handle);

  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-page px-4 py-8 md:px-6 md:py-12 space-y-8 min-w-0">
      {/* Profile Header Card */}
      <Card className="min-w-0 break-words">
        <CardBody className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Avatar & Identity Info */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start min-w-0">
              <Avatar
                name={profile.name}
                src={profile.avatarUrl}
                size="xl"
                className="shrink-0 ring-2 ring-hairline"
              />
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h1 className="font-display text-headline-xl text-fg break-words [overflow-wrap:anywhere]">
                    {profile.name}
                  </h1>
                  <span className="font-mono text-body-md text-accent break-words [overflow-wrap:anywhere]">
                    @{profile.handle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-body-sm text-fg-subtle">
                  <MapPin className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
                  <span className="break-words">{profile.location}</span>
                </div>

                <p className="text-body-md text-fg-muted break-words pt-1 max-w-2xl">
                  {profile.headline}
                </p>

                {/* Experience & Track Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {profile.badges?.map((badge, idx) => (
                    <Badge key={idx} tone={badge.tone}>
                      {badge.label}
                    </Badge>
                  ))}
                  {profile.tracks?.map((track) => (
                    <TrackBadge key={track} track={track} />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Disabled until accounts launch */}
            <div className="flex flex-wrap gap-3 sm:shrink-0">
              <Button
                variant="primary"
                disabled
                title="Available once accounts launch"
              >
                Request mentorship
              </Button>
              <Button
                variant="secondary"
                disabled
                title="Available once accounts launch"
              >
                Message
              </Button>
            </div>
          </div>

          {/* Bio & External Links */}
          <div className="border-t border-hairline pt-4 space-y-3">
            <p className="text-body-md text-fg break-words [overflow-wrap:anywhere] whitespace-pre-line max-w-3xl">
              {profile.bio}
            </p>

            {profile.links && profile.links.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {profile.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-body-sm text-accent hover:underline transition-colors"
                  >
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Stats Row: 4 Tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 min-w-0">
        <StatTile
          label="Projects"
          value={profile.stats.projects}
          hint="Led or contributed"
        />
        <StatTile
          label="Endorsements"
          value={profile.stats.endorsements}
          hint="From peer builders"
        />
        <StatTile
          label="Reputation"
          value={profile.reputation}
          hint="Verified points"
          tone="accent"
        />
        <StatTile
          label="Earned"
          value={
            <Money
              amount={profile.stats.earned.amount}
              currency={profile.stats.earned.currency}
            />
          }
          hint="Bounties & grants"
          tone="earn"
        />
      </div>

      {/* Two-Column Layout: Left (Mentorship, Credentials, Ledger) & Right (Tabs) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 min-w-0">
        {/* Left Column (5 Cols on LG) */}
        <div className="space-y-6 lg:col-span-5 min-w-0">
          {/* Mentorship Pairs */}
          <Panel
            title="Mentorship"
            icon={<Users className="size-5 text-accent" aria-hidden="true" />}
          >
            {profile.mentorships.length === 0 ? (
              <p className="text-body-sm text-fg-muted">No active mentorship pairs.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {profile.mentorships.map((m) => (
                  <div
                    key={m.handle}
                    className="rounded-lg border border-hairline bg-surface-2 p-3 space-y-2 min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PersonChip person={m} size="sm" />
                      <Badge
                        tone={m.relation === 'mentor' ? 'accent' : 'make'}
                        variant="outline"
                      >
                        {m.relation === 'mentor' ? 'Mentor' : 'Mentee'}
                      </Badge>
                    </div>
                    {m.project ? (
                      <p className="text-body-xs text-fg-subtle truncate">
                        Project: <span className="text-fg-muted">{m.project}</span>
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Credentials */}
          <Panel
            title="Credentials"
            icon={<Award className="size-5 text-accent" aria-hidden="true" />}
          >
            {profile.credentials.length === 0 ? (
              <p className="text-body-sm text-fg-muted">No credentials listed yet.</p>
            ) : (
              <ul className="space-y-3">
                {profile.credentials.map((cred, idx) => (
                  <li
                    key={idx}
                    className="border-b border-hairline pb-2.5 last:border-0 last:pb-0"
                  >
                    <p className="font-display font-medium text-body-md text-fg break-words">
                      {cred.title}
                    </p>
                    <p className="text-body-sm text-fg-subtle break-words">{cred.issuer}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Recent Reputation: Append-only ledger */}
          <Panel
            title="Recent reputation"
            icon={<ShieldCheck className="size-5 text-earn" aria-hidden="true" />}
          >
            <p className="mb-3 text-body-xs text-fg-subtle">
              Reputation is an append-only ledger verified by peer reviews and deliverables.
            </p>
            {profile.recentReputation.length === 0 ? (
              <p className="text-body-sm text-fg-muted">No reputation events recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {profile.recentReputation.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 border-b border-hairline pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-body-sm text-fg break-words">{evt.label}</p>
                      <time
                        dateTime={evt.at}
                        className="font-display text-body-xs text-fg-subtle tabular-nums"
                      >
                        {formatDate(evt.at)}
                      </time>
                    </div>
                    <span className="font-display font-semibold text-label-md text-earn tabular-nums shrink-0">
                      +{evt.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Right Column (7 Cols on LG): Tabs (Projects · Endorsements · Skills) */}
        <div className="lg:col-span-7 min-w-0">
          <Tabs defaultValue="projects" className="w-full min-w-0">
            <TabsList label="Innovator profile tabs" className="w-full">
              <TabsTrigger value="projects">
                Projects ({profile.projects.length})
              </TabsTrigger>
              <TabsTrigger value="endorsements">
                Endorsements ({profile.endorsements.length})
              </TabsTrigger>
              <TabsTrigger value="skills">
                Skills ({profile.skills.length})
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects">
              {profile.projects.length === 0 ? (
                <EmptyState
                  title="No public projects yet"
                  description="This innovator has not published any public squad projects yet."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {profile.projects.map((proj) => (
                    <ProjectCard key={proj.slug} project={proj} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Endorsements Tab */}
            <TabsContent value="endorsements">
              {profile.endorsements.length === 0 ? (
                <EmptyState
                  title="No endorsements yet"
                  description="Endorsements from collaborators will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {profile.endorsements.map((end, idx) => (
                    <blockquote
                      key={idx}
                      className="rounded-lg border border-hairline bg-surface-1 p-5 shadow-module space-y-3"
                    >
                      <p className="text-body-md italic text-fg-muted break-words whitespace-pre-line [overflow-wrap:anywhere]">
                        &ldquo;{end.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 pt-2 border-t border-hairline">
                        <PersonChip person={end.author} size="sm" />
                      </div>
                    </blockquote>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-4">
                <h3 className="font-display text-label-md uppercase text-fg-subtle">
                  Disciplines & Expertise
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {profile.skills.map((skill) => (
                    <Chip key={skill} tone="neutral">
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
