import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  EmptyState,
} from '@hackerland/ui';
import {
  Search,
  MapPin,
  Award,
  ExternalLink,
  Sparkles,
  Settings,
} from 'lucide-react';
import { listAllStoredProfiles } from '@/lib/data/queries';
import { TrackBadge } from '@/components/domain/track-badge';
import { TRACKS, TRACK_META, type Track } from '@hackerland/core';

export const metadata: Metadata = {
  title: 'Innovators & Builders Directory · Hackerland',
  description:
    'Discover public profiles of open-source hardware engineers, deep-tech researchers, makers, and founders building across India and globally.',
};

interface InnovatorsPageProps {
  searchParams: Promise<{
    q?: string;
    track?: string;
  }>;
}

export default async function InnovatorsDirectoryPage({ searchParams }: InnovatorsPageProps) {
  const { q, track } = await searchParams;
  const rawQuery = (q || '').trim().toLowerCase();
  const activeTrack = track as Track | undefined;

  const allProfiles = listAllStoredProfiles();

  const filtered = allProfiles.filter((p) => {
    if (activeTrack && !p.tracks.includes(activeTrack)) {
      return false;
    }
    if (rawQuery) {
      const matchName = p.name.toLowerCase().includes(rawQuery);
      const matchHandle = p.handle.toLowerCase().includes(rawQuery);
      const matchHeadline = (p.headline || '').toLowerCase().includes(rawQuery);
      const matchLocation = (p.location || '').toLowerCase().includes(rawQuery);
      const matchSkills = (p.skills || []).some((s) => s.toLowerCase().includes(rawQuery));
      return matchName || matchHandle || matchHeadline || matchLocation || matchSkills;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-page px-4 py-8 md:px-6 md:py-12 space-y-8 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-hairline pb-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-1 text-caption text-fg-muted font-mono">
            <Sparkles className="size-3.5 text-accent" />
            <span>COMMUNITY LEDGER · PUBLIC PROFILES</span>
          </div>
          <h1 className="font-display text-headline-xl md:text-display-sm text-fg">
            Innovators Directory
          </h1>
          <p className="text-body-md text-fg-muted">
            Explore verified engineers, propulsion researchers, hardware makers, and squad leads
            building open-source tech across Hackerland.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary" size="md">
            <Link href="/settings">
              <Settings className="size-4 mr-2" />
              Manage Your Profile
            </Link>
          </Button>
          <Button asChild variant="secondary" size="md">
            <Link href="/leaderboard">
              <Award className="size-4 mr-2 text-earn" />
              Leaderboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Track Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/u"
            className={`rounded-full px-3.5 py-1.5 text-caption font-medium transition-colors ${
              !activeTrack
                ? 'bg-accent text-accent-fg'
                : 'bg-surface-2 text-fg-muted hover:text-fg hover:bg-surface-3'
            }`}
          >
            All Tracks ({allProfiles.length})
          </Link>
          {TRACKS.map((t) => {
            const count = allProfiles.filter((p) => p.tracks.includes(t)).length;
            const isSelected = activeTrack === t;
            return (
              <Link
                key={t}
                href={isSelected ? '/u' : `/u?track=${t}`}
                className={`rounded-full px-3 py-1 text-caption font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent text-accent-fg'
                    : 'bg-surface-2 text-fg-muted hover:text-fg hover:bg-surface-3'
                }`}
              >
                {TRACK_META[t].label} ({count})
              </Link>
            );
          })}
        </div>

        {/* Search input form */}
        <form method="GET" action="/u" className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
          <input
            type="search"
            name="q"
            defaultValue={rawQuery}
            placeholder="Search by name, skill, location…"
            className="w-full rounded-lg border border-hairline bg-surface-1 py-1.5 pl-9 pr-3 text-body-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {activeTrack && <input type="hidden" name="track" value={activeTrack} />}
        </form>
      </div>

      {/* Profiles Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No innovators found"
          description="Try broadening your search term or clearing the selected track filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile) => (
            <Card
              key={profile.handle}
              className="group flex flex-col justify-between transition-all hover:border-hairline-strong hover:shadow-card"
            >
              <CardBody className="p-6 space-y-4">
                {/* Header: Avatar, Name & Handle */}
                <div className="flex items-start gap-3.5">
                  <Avatar
                    name={profile.name}
                    src={profile.avatarUrl}
                    size="lg"
                    className="shrink-0 ring-1 ring-hairline"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/u/${profile.handle}`}
                      className="font-display font-bold text-body-lg text-fg group-hover:text-accent transition-colors block truncate"
                    >
                      {profile.name}
                    </Link>
                    <span className="font-mono text-caption text-accent block truncate">
                      @{profile.handle}
                    </span>
                    {profile.location && (
                      <div className="flex items-center gap-1 text-[11px] text-fg-subtle mt-0.5 truncate">
                        <MapPin className="size-3 shrink-0" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Headline */}
                <p className="text-body-sm text-fg-muted line-clamp-2 min-h-[2.5rem]">
                  {profile.headline || 'Open-source engineering and innovation.'}
                </p>

                {/* Badges & Tracks */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-0.5 text-caption font-mono font-bold text-accent">
                    <Award className="size-3" />
                    {profile.reputation} REP
                  </span>
                  {profile.badges?.slice(0, 2).map((b, idx) => (
                    <Badge key={idx} tone={b.tone}>
                      {b.label}
                    </Badge>
                  ))}
                  {profile.tracks?.slice(0, 2).map((t) => (
                    <TrackBadge key={t} track={t} />
                  ))}
                </div>

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {profile.skills.slice(0, 3).map((skill) => (
                      <Chip key={skill} tone="neutral" className="text-[11px] py-0 px-2">
                        {skill}
                      </Chip>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="text-[11px] text-fg-subtle">
                        +{profile.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </CardBody>

              {/* Card Footer: View Public Profile */}
              <div className="border-t border-hairline/60 px-6 py-3.5 bg-surface-2/40 flex items-center justify-between">
                <span className="text-caption text-fg-subtle">
                  {profile.projects?.length || 0} squad projects
                </span>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/u/${profile.handle}`}>
                    <span>View Profile</span>
                    <ExternalLink className="size-3.5 ml-1.5 text-fg-subtle" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Community Banner */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-module">
        <div className="space-y-1 max-w-xl">
          <h2 className="font-display text-headline-sm text-fg">
            Building something groundbreaking?
          </h2>
          <p className="text-body-sm text-fg-muted">
            Activate your public builder node to share open-source CAD, firmware, neural models, and
            collaborate in live squads.
          </p>
        </div>
        <Button asChild variant="primary" size="md" className="shrink-0">
          <Link href="/settings">
            <Sparkles className="size-4 mr-2" />
            Claim Your Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
