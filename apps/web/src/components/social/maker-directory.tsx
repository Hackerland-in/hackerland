'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Avatar, Badge, Button, Card, CardBody, Chip, EmptyState, FilterChip, SearchField, cn } from '@hackerland/ui';
import { TRACKS, TRACK_META, type Track } from '@hackerland/core';
import { Award, MapPin, UserCheck, UserPlus, Users, ArrowRight } from 'lucide-react';
import type { ProfileView } from '@/lib/data/types';
import { TrackBadge } from '@/components/domain/track-badge';
import { useSocialCommunity } from './social-context';

export interface MakerDirectoryProps {
  initialProfiles: ProfileView[];
  initialQuery?: string;
  initialTrack?: Track;
}

export function MakerDirectory({
  initialProfiles,
  initialQuery = '',
  initialTrack,
}: MakerDirectoryProps) {
  const { isFollowing, toggleFollow, followingHandles } = useSocialCommunity();
  const [query, setQuery] = useState(initialQuery);
  const [selectedTrack, setSelectedTrack] = useState<Track | 'all' | 'following'>(
    initialTrack ?? 'all',
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialProfiles.filter((profile) => {
      if (selectedTrack === 'following' && !isFollowing(profile.handle)) {
        return false;
      }
      if (selectedTrack !== 'all' && selectedTrack !== 'following' && !profile.tracks.includes(selectedTrack)) {
        return false;
      }
      if (!q) return true;
      return (
        profile.name.toLowerCase().includes(q) ||
        profile.handle.toLowerCase().includes(q) ||
        (profile.headline || '').toLowerCase().includes(q) ||
        (profile.location || '').toLowerCase().includes(q) ||
        (profile.skills || []).some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [initialProfiles, query, selectedTrack, isFollowing]);

  const followingCount = initialProfiles.filter((p) => followingHandles.includes(p.handle)).length;

  return (
    <div className="space-y-5 min-w-0">
      {/* Directory Controls */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 space-y-4 shadow-xs">
        <SearchField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search makers by name, @handle, skill, or city..."
          aria-label="Search makers directory"
        />

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip selected={selectedTrack === 'all'} onClick={() => setSelectedTrack('all')}>
            All Makers ({initialProfiles.length})
          </FilterChip>
          <FilterChip
            selected={selectedTrack === 'following'}
            onClick={() => setSelectedTrack('following')}
          >
            Following ({followingCount})
          </FilterChip>
          {TRACKS.map((t) => {
            const count = initialProfiles.filter((p) => p.tracks.includes(t)).length;
            return (
              <FilterChip
                key={t}
                selected={selectedTrack === t}
                onClick={() => setSelectedTrack((cur) => (cur === t ? 'all' : t))}
              >
                {TRACK_META[t].label} ({count})
              </FilterChip>
            );
          })}
        </div>
      </div>

      {/* Maker Social Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No makers match your filters"
          description="Try clearing your search or switching back to All Makers."
          action={
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setQuery('');
                setSelectedTrack('all');
              }}
            >
              Show all makers
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
          {filtered.map((profile) => {
            const following = isFollowing(profile.handle);
            return (
              <Card
                key={profile.handle}
                accent={profile.tracks[0] ?? 'accent'}
                interactive
                className="flex flex-col justify-between min-w-0 break-words"
              >
                {/* Soft Pink Top Stripe Accent */}
                <div className="h-14 w-full bg-gradient-to-r from-accent/15 via-accent-soft to-surface-2 border-b border-hairline/70" />

                <CardBody className="p-5 -mt-8 space-y-3.5 flex-1">
                  {/* Avatar & Follow Button Row */}
                  <div className="flex items-end justify-between gap-3">
                    <Link
                      href={`/u/${profile.handle}`}
                      className="rounded-full ring-4 ring-surface-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleFollow(profile.handle)}
                      aria-pressed={following}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-display font-semibold transition-all border',
                        following
                          ? 'border-hairline bg-surface-2 text-fg-muted hover:border-danger/30 hover:text-danger-fg'
                          : 'border-accent bg-accent text-on-solid hover:bg-accent-strong shadow-xs',
                      )}
                    >
                      {following ? (
                        <>
                          <UserCheck className="size-3.5" aria-hidden="true" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="size-3.5" aria-hidden="true" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Identity */}
                  <div className="min-w-0 space-y-0.5">
                    <Link
                      href={`/u/${profile.handle}`}
                      className="font-display font-bold text-headline-sm text-fg hover:text-accent-fg hover:underline block break-words [overflow-wrap:anywhere]"
                    >
                      {profile.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-fg-subtle">
                      <span className="font-mono text-accent-fg break-all">@{profile.handle}</span>
                      {profile.location && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 truncate">
                            <MapPin className="size-3 shrink-0" aria-hidden="true" />
                            <span>{profile.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Headline */}
                  <p className="text-body-sm text-fg-muted line-clamp-2 min-h-[2.5rem] break-words">
                    {profile.headline || 'Open-source builder & collaborator.'}
                  </p>

                  {/* Badges & Reputation */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-display font-semibold text-accent-fg tabular-nums">
                      <Award className="size-3" aria-hidden="true" />
                      {profile.reputation} REP
                    </span>
                    {profile.badges?.slice(0, 1).map((b, idx) => (
                      <Badge key={idx} tone={b.tone}>
                        {b.label}
                      </Badge>
                    ))}
                    {profile.tracks?.slice(0, 2).map((t) => (
                      <TrackBadge key={t} track={t} />
                    ))}
                  </div>

                  {/* Top Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {profile.skills.slice(0, 3).map((skill) => (
                        <Chip key={skill} className="text-[11px] py-0.5 px-2.5">
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  )}
                </CardBody>

                {/* Card Footer */}
                <div className="border-t border-hairline px-5 py-3 bg-surface-2/40 flex items-center justify-between text-[13px]">
                  <span className="text-fg-subtle tabular-nums">
                    {profile.stats?.projects ?? profile.projects?.length ?? 0} builds ·{' '}
                    {profile.stats?.endorsements ?? profile.endorsements?.length ?? 0} endorsements
                  </span>
                  <Link
                    href={`/u/${profile.handle}`}
                    className="inline-flex items-center gap-1 font-display font-semibold text-accent-fg hover:underline"
                  >
                    <span>Profile</span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
