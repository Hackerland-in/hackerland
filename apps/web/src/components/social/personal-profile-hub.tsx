'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Settings,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MapPin,
  FolderKanban,
  Bookmark,
  Users,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  StatTile,
} from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';
import { TrackBadge } from '@/components/domain/track-badge';
import type { Track } from '@hackerland/core';
import { useSocialCommunity } from './social-context';

interface UserProfileData {
  userId: string;
  handle: string;
  displayName: string;
  headline?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  tracks?: Track[];
  skills?: string[];
  reputation?: number;
  links?: { label: string; url: string }[];
}

export function PersonalProfileHub() {
  const session = authClient.useSession();
  const { followingHandles, bookmarkedPostIds } = useSocialCommunity();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const user = session.data?.user;
  const isPending = session.isPending;

  useEffect(() => {
    try {
      const cached = localStorage.getItem('hackerland_user_profile');
      if (cached) {
        const prof = JSON.parse(cached);
        if (prof?.handle) {
          setProfile(prof);
          setProfileLoaded(true);
        }
      }
    } catch {
      // Ignore
    }

    let active = true;
    fetch('/api/me/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        const prof = data?.profile || data;
        if (prof?.handle) {
          setProfile(prof);
        }
        setProfileLoaded(true);
      })
      .catch(() => {
        if (active) setProfileLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const showLoading = isPending || (Boolean(user?.id) && !profileLoaded);

  if (showLoading) {
    return (
      <div className="rounded-2xl border border-hairline bg-surface-1 p-12 text-center space-y-3 shadow-xs">
        <div className="size-9 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-body-sm text-fg-muted">Loading your community profile…</p>
      </div>
    );
  }

  // Signed-out prompt with social community activity snapshot
  if (!user && !profile) {
    return (
      <div className="space-y-5">
        <Card className="overflow-hidden">
          <div className="h-24 w-full bg-gradient-to-r from-accent via-design to-make/80" />
          <CardBody className="p-6 sm:p-8 -mt-10 text-center space-y-5">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border-4 border-surface-1 bg-accent/10 text-accent shadow-xs">
              <User className="size-7" aria-hidden="true" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg">
                Join Hackerland Builders
              </h1>
              <p className="text-body-md text-fg-muted">
                Claim your @handle, showcase open hardware &amp; software ships, follow top makers, and earn bounties.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="md" variant="primary">
                <Link href="/sign-up">Create account</Link>
              </Button>
              <Button asChild size="md" variant="secondary">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="md" variant="soft">
                <Link href="/u">Browse Makers</Link>
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Quick Social Graph Snapshot even in Guest Mode */}
        <div className="grid grid-cols-2 gap-4">
          <StatTile
            label="Following"
            value={followingHandles.length}
            hint="Makers you follow on this device"
            tone="accent"
            icon={<Users className="size-4" />}
          />
          <StatTile
            label="Saved Bookmarks"
            value={bookmarkedPostIds.length}
            hint="Posts bookmarked in feed"
            tone="design"
            icon={<Bookmark className="size-4" />}
          />
        </div>
      </div>
    );
  }

  // Signed-in but handle not yet claimed
  if (!profile) {
    return (
      <Card className="overflow-hidden">
        <div className="h-24 w-full bg-gradient-to-r from-accent via-design to-make/80" />
        <CardBody className="p-8 -mt-10 text-center space-y-5">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border-4 border-surface-1 bg-accent text-on-solid shadow-xs">
            <Sparkles className="size-7" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-headline-lg font-bold text-fg">
              Welcome, {user?.name || 'Builder'}!
            </h1>
            <p className="text-body-md text-fg-muted max-w-md mx-auto">
              {user?.email ? (
                <>
                  Signed in as <span className="font-mono text-fg">{user.email}</span>.{' '}
                </>
              ) : null}
              Claim your public @handle to share build updates and join squads.
            </p>
          </div>

          <Button asChild size="md" variant="primary">
            <Link href="/onboarding">
              <span>Claim your @handle</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6 min-w-0" data-testid="profile-hub">
      <Card className="overflow-hidden">
        <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-accent via-design to-make/80" />
        <CardBody className="p-5 sm:p-6 pt-0 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="rounded-full ring-4 ring-surface-1 bg-surface-1 w-fit shadow-module">
              <Avatar
                name={profile.displayName || user?.name || 'Builder'}
                src={profile.avatarUrl || user?.image || undefined}
                size="xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="primary" size="sm">
                <Link href={`/u/${profile.handle}`}>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span>Public Profile</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/settings">
                  <Settings className="size-3.5" aria-hidden="true" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="font-display text-headline-xl font-bold text-fg break-words">
                {profile.displayName || user?.name || 'Builder'}
              </h1>
              <span className="font-mono text-body-md text-accent-fg break-all">
                @{profile.handle}
              </span>
              <Badge tone="accent" variant="solid">
                Verified Builder
              </Badge>
            </div>

            {profile.location && (
              <div className="flex items-center gap-1.5 text-body-sm text-fg-subtle">
                <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.headline && (
              <p className="text-body-md text-fg-muted max-w-2xl">{profile.headline}</p>
            )}

            {profile.tracks && profile.tracks.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {profile.tracks.map((t) => (
                  <TrackBadge key={t} track={t} />
                ))}
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-body-md text-fg whitespace-pre-line border-t border-hairline pt-4 max-w-3xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {profile.skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Social Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile
          label="Reputation"
          value={profile.reputation ?? 0}
          hint="Verified builds"
          tone="accent"
        />
        <StatTile
          label="Following"
          value={followingHandles.length}
          hint="Active makers"
        />
        <StatTile
          label="Saved Posts"
          value={bookmarkedPostIds.length}
          hint="Bookmarked items"
          tone="design"
        />
        <StatTile
          label="Skills"
          value={profile.skills?.length ?? 0}
          hint="Listed capabilities"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/u/${profile.handle}`}
          className="rounded-2xl border border-hairline bg-surface-1 p-5 hover:border-accent/40 hover:shadow-module transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <User className="size-5 text-accent" aria-hidden="true" />
            <ArrowRight className="size-4 text-fg-subtle group-hover:text-accent-fg transition-colors" />
          </div>
          <h2 className="font-display text-body-md font-bold text-fg group-hover:text-accent-fg">
            Public Showcase
          </h2>
          <p className="text-body-sm text-fg-muted">
            Preview your maker card, follower stats, and ships.
          </p>
        </Link>

        <Link
          href="/settings"
          className="rounded-2xl border border-hairline bg-surface-1 p-5 hover:border-accent/40 hover:shadow-module transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Settings className="size-5 text-research-fg" aria-hidden="true" />
            <ArrowRight className="size-4 text-fg-subtle group-hover:text-accent-fg transition-colors" />
          </div>
          <h2 className="font-display text-body-md font-bold text-fg group-hover:text-accent-fg">
            Edit Bio &amp; Stack
          </h2>
          <p className="text-body-sm text-fg-muted">
            Customize headline, social links, city, and tracks.
          </p>
        </Link>

        <Link
          href="/new"
          className="rounded-2xl border border-hairline bg-surface-1 p-5 hover:border-accent/40 hover:shadow-module transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <FolderKanban className="size-5 text-earn-fg" aria-hidden="true" />
            <ArrowRight className="size-4 text-fg-subtle group-hover:text-accent-fg transition-colors" />
          </div>
          <h2 className="font-display text-body-md font-bold text-fg group-hover:text-accent-fg">
            Share a New Build
          </h2>
          <p className="text-body-sm text-fg-muted">
            Launch a hardware/software project and recruit a squad.
          </p>
        </Link>
      </div>
    </div>
  );
}
