'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  EmptyState,
  Panel,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackerland/ui';
import {
  MapPin,
  ExternalLink,
  Users,
  Award,
  ShieldCheck,
  Send,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import type { FeedPost, ProfileView } from '@/lib/data/types';
import { formatDate } from '@/lib/format';
import { PersonChip } from '@/components/domain/person-chip';
import { ProjectCard } from '@/components/domain/project-card';
import { PostCard } from '@/components/domain/post-card';
import { TrackBadge } from '@/components/domain/track-badge';
import { Money } from '@/components/domain/money';
import { ProfileActions } from '@/components/domain/profile-actions';
import { useSocialCommunity } from './social-context';

export interface SocialProfileViewProps {
  profile: ProfileView;
  posts: FeedPost[];
}

function getBaseFollowerCount(handle: string, reputation: number): number {
  let hash = 0;
  for (const ch of handle) hash = (hash * 31 + ch.charCodeAt(0)) % 90;
  return 48 + Math.floor(reputation / 8) + hash;
}

export function SocialProfileView({ profile, posts }: SocialProfileViewProps) {
  const { isFollowing } = useSocialCommunity();
  const [endorsements, setEndorsements] = useState(profile.endorsements);
  const [endorseQuote, setEndorseQuote] = useState('');

  const following = isFollowing(profile.handle);
  const followersCount = getBaseFollowerCount(profile.handle, profile.reputation) + (following ? 1 : 0);

  const handleEndorseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quote = endorseQuote.trim();
    if (!quote) return;

    setEndorsements((prev) => [
      {
        author: {
          handle: 'community-builder',
          name: 'You (Builder)',
          badges: [{ label: 'Maker', tone: 'design' }],
        },
        quote,
      },
      ...prev,
    ]);
    setEndorseQuote('');
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Back breadcrumb */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/u"
          className="inline-flex items-center gap-1.5 rounded-full bg-surface-1 border border-hairline px-3.5 py-1.5 text-body-sm font-display font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors shadow-xs"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          <span>Makers directory</span>
        </Link>
      </div>

      {/* Social Cover Header Card */}
      <Card className="min-w-0 break-words overflow-hidden">
        {/* Signature Pink Cover Banner */}
        <div className="relative h-28 sm:h-36 w-full bg-gradient-to-r from-accent via-design to-make/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_55%)]" />
        </div>

        <CardBody className="p-5 sm:p-6 pt-0 space-y-5">
          {/* Overlapping Avatar + Right Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="rounded-full ring-4 ring-surface-1 bg-surface-1 w-fit shadow-module">
              <Avatar name={profile.name} src={profile.avatarUrl} size="xl" />
            </div>

            <div className="pt-1 sm:pb-1">
              <ProfileActions handle={profile.handle} />
            </div>
          </div>

          {/* Identity Block */}
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-baseline gap-2 min-w-0">
              <h1 className="font-display text-headline-xl font-bold text-fg break-words [overflow-wrap:anywhere] min-w-0">
                {profile.name}
              </h1>
              <span className="font-mono text-body-md font-medium text-accent-fg break-all [overflow-wrap:anywhere]">
                @{profile.handle}
              </span>
            </div>

            {profile.headline && (
              <p className="text-body-md font-medium text-fg-muted break-words max-w-2xl">
                {profile.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-body-sm text-fg-subtle pt-0.5">
              {profile.location && (
                <span className="inline-flex items-center gap-1.5 break-words">
                  <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{profile.location}</span>
                </span>
              )}
              {profile.links?.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent-fg font-medium hover:underline"
                >
                  <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-body-md text-fg break-words [overflow-wrap:anywhere] whitespace-pre-line pt-2 max-w-3xl leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Badges & Tracks */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
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

          {/* Inline Social Stats Strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-4 text-body-sm">
            <div>
              <span className="font-display font-bold text-fg tabular-nums">{followersCount}</span>{' '}
              <span className="text-fg-subtle">Followers</span>
            </div>
            <div>
              <span className="font-display font-bold text-accent-fg tabular-nums">
                {profile.reputation}
              </span>{' '}
              <span className="text-fg-subtle">Reputation</span>
            </div>
            <div>
              <span className="font-display font-bold text-fg tabular-nums">
                {profile.projects.length || profile.stats.projects}
              </span>{' '}
              <span className="text-fg-subtle">Builds</span>
            </div>
            <div>
              <span className="font-display font-bold text-fg tabular-nums">
                {endorsements.length}
              </span>{' '}
              <span className="text-fg-subtle">Endorsements</span>
            </div>
            {profile.stats.earned.amount > 0 && (
              <div>
                <Money
                  amount={profile.stats.earned.amount}
                  currency={profile.stats.earned.currency}
                  className="font-display font-bold text-earn-fg tabular-nums"
                />{' '}
                <span className="text-fg-subtle">Earned</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Main Content Tabs: Posts & Ships · Projects · Endorsements · Credentials */}
      <Tabs defaultValue={posts.length > 0 ? 'posts' : 'projects'} className="w-full min-w-0">
        <TabsList label="Maker profile sections">
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="projects">Projects ({profile.projects.length})</TabsTrigger>
          <TabsTrigger value="endorsements">Endorsements ({endorsements.length})</TabsTrigger>
          <TabsTrigger value="about">Credentials &amp; Skills</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts">
          {posts.length === 0 ? (
            <EmptyState
              icon={<Flame />}
              title="No public posts yet"
              description={`Follow @${profile.handle} to see future build logs, demos, and questions here.`}
            />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          {profile.projects.length === 0 ? (
            <EmptyState
              title="No public projects yet"
              description="This builder has not published public squad projects yet."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {profile.projects.map((proj) => (
                <ProjectCard key={proj.slug} project={proj} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Endorsements Tab + Inline Endorse Box */}
        <TabsContent value="endorsements" className="space-y-4">
          <form
            onSubmit={handleEndorseSubmit}
            className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-3 shadow-xs"
          >
            <label
              htmlFor="endorse-input"
              className="block font-display text-body-sm font-semibold text-fg"
            >
              Endorse {profile.name.split(' ')[0]}&apos;s work
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="endorse-input"
                type="text"
                value={endorseQuote}
                onChange={(e) => setEndorseQuote(e.target.value)}
                placeholder="Share a quick shoutout for hardware reviews, code quality, or mentorship..."
                className="flex-1 min-w-0 rounded-full border border-hairline bg-sunken px-4 py-2 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <Button type="submit" size="sm" variant="primary" disabled={!endorseQuote.trim()}>
                <Send className="size-3.5" aria-hidden="true" />
                <span>Post Shoutout</span>
              </Button>
            </div>
          </form>

          {endorsements.length === 0 ? (
            <EmptyState
              title="No endorsements yet"
              description="Be the first builder to vouch for their work!"
            />
          ) : (
            <div className="space-y-3.5">
              {endorsements.map((end, idx) => (
                <blockquote
                  key={idx}
                  className="rounded-2xl border border-hairline bg-surface-1 p-5 shadow-xs space-y-3"
                >
                  <p className="text-body-md text-fg break-words whitespace-pre-line [overflow-wrap:anywhere] leading-relaxed">
                    &ldquo;{end.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 pt-2.5 border-t border-hairline">
                    <PersonChip person={end.author} size="sm" />
                  </div>
                </blockquote>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Credentials, Mentorship, Skills & Reputation History Tab */}
        <TabsContent value="about" className="space-y-5">
          {/* Skills */}
          <Panel title="Skills & Stack" headingLevel={2}>
            <div className="flex flex-wrap items-center gap-2">
              {profile.skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          </Panel>

          {/* Credentials */}
          <Panel
            title="Verified Credentials"
            icon={<Award className="size-4 text-accent" aria-hidden="true" />}
            headingLevel={2}
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
                    <p className="font-display font-semibold text-body-md text-fg break-words">
                      {cred.title}
                    </p>
                    <p className="text-body-sm text-fg-subtle break-words">{cred.issuer}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Mentorship Pairs */}
          <Panel
            title="Mentorship Circle"
            icon={<Users className="size-4 text-accent" aria-hidden="true" />}
            headingLevel={2}
          >
            {profile.mentorships.length === 0 ? (
              <p className="text-body-sm text-fg-muted">No active mentorship pairs listed.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.mentorships.map((m) => (
                  <div
                    key={m.handle}
                    className="rounded-xl border border-hairline bg-surface-2/60 p-3 space-y-2 min-w-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PersonChip person={m} size="sm" />
                      <Badge tone={m.relation === 'mentor' ? 'accent' : 'make'}>
                        {m.relation === 'mentor' ? 'Mentor' : 'Mentee'}
                      </Badge>
                    </div>
                    {m.project ? (
                      <p className="text-[12px] text-fg-subtle truncate">
                        Build: <span className="text-fg-muted font-medium">{m.project}</span>
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Recent Reputation Ledger */}
          <Panel
            title="Reputation Log"
            icon={<ShieldCheck className="size-4 text-earn" aria-hidden="true" />}
            headingLevel={2}
          >
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
                      <p className="text-body-sm font-medium text-fg break-words">{evt.label}</p>
                      <time
                        dateTime={evt.at}
                        className="text-[12px] text-fg-subtle tabular-nums"
                      >
                        {formatDate(evt.at)}
                      </time>
                    </div>
                    <span className="rounded-full bg-earn/10 px-2.5 py-0.5 font-display font-semibold text-[12px] text-earn-fg tabular-nums shrink-0">
                      +{evt.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
