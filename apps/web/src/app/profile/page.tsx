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
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  StatTile,
} from '@hackerland/ui';
import { authClient } from '@/lib/auth-client';
import { TrackBadge } from '@/components/domain/track-badge';
import type { Track } from '@hackerland/core';

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

export default function ProfileHubPage() {
  const session = authClient.useSession();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const user = session.data?.user;
  const isPending = session.isPending;

  useEffect(() => {
    // 1. Check localStorage first for instant client hydration
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

    // 2. Query /api/me/profile from server
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
      <div className="mx-auto max-w-page px-4 py-16 text-center space-y-4">
        <div className="size-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-body-sm text-fg-muted">Loading your innovator profile…</p>
      </div>
    );
  }

  // If user is not signed in and has no saved profile
  if (!user && !profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center space-y-6">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mx-auto">
          <User className="size-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-headline-xl text-fg">Your Builder Node</h1>
          <p className="text-body-md text-fg-muted">
            Sign in to access your custom profile, portfolio, reputation scores, and squad collaborations.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="md" variant="primary">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="md" variant="secondary">
            <Link href="/sign-up">Create account</Link>
          </Button>
          <Button asChild size="md" variant="ghost">
            <Link href="/u">Explore Innovators</Link>
          </Button>
        </div>
      </div>
    );
  }

  // If user is signed in but hasn't completed onboarding/claimed handle
  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 space-y-6">
        <Card>
          <CardBody className="p-8 text-center space-y-6">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mx-auto">
              <Sparkles className="size-7" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-headline-lg text-fg">
                Welcome, {user?.name || 'Builder'}!
              </h1>
              <p className="text-body-md text-fg-muted max-w-md mx-auto">
                {user?.email ? (
                  <>
                    You are signed in as <span className="font-mono text-fg">{user.email}</span>.{' '}
                  </>
                ) : null}
                To activate your public innovator portfolio and squad identity, claim your unique handle.
              </p>
            </div>

            <div className="pt-2">
              <Button asChild size="md" variant="primary">
                <Link href="/onboarding">
                  Claim Your @handle & Profile
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // If user is signed in and has a profile
  return (
    <div className="mx-auto max-w-page px-4 py-8 md:px-6 md:py-12 space-y-8 min-w-0" data-testid="profile-hub">
      {/* Header Profile Summary Card */}
      <Card>
        <CardBody className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Identity */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start min-w-0">
              <Avatar
                name={profile.displayName || user?.name || 'User'}
                src={profile.avatarUrl || user?.image || undefined}
                size="xl"
                className="shrink-0 ring-2 ring-accent/30"
              />
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h1 className="font-display text-headline-xl text-fg break-words">
                    {profile.displayName || user?.name || 'Innovator'}
                  </h1>
                  <span className="font-mono text-body-md text-accent">
                    @{profile.handle}
                  </span>
                  <Badge tone="accent" variant="solid" className="text-caption">
                    Authenticated
                  </Badge>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-1.5 text-body-sm text-fg-subtle">
                    <MapPin className="size-4 shrink-0 text-fg-subtle" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.headline && (
                  <p className="text-body-md text-fg-muted max-w-2xl">
                    {profile.headline}
                  </p>
                )}

                {/* Tracks */}
                {profile.tracks && profile.tracks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {profile.tracks.map((t) => (
                      <TrackBadge key={t} track={t} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
              <Button asChild variant="primary" size="sm">
                <Link href={`/u/${profile.handle}`}>
                  <ExternalLink className="size-3.5 mr-1.5" />
                  View Public Profile
                </Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/settings">
                  <Settings className="size-3.5 mr-1.5" />
                  Edit Settings
                </Link>
              </Button>
            </div>
          </div>

          {/* Bio & Skills */}
          {profile.bio && (
            <div className="border-t border-hairline pt-4">
              <p className="text-body-md text-fg whitespace-pre-line max-w-3xl leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-caption font-semibold uppercase tracking-wider text-fg-muted mr-1">
                Skills:
              </span>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-hairline bg-surface-2 px-2.5 py-1 font-mono text-[11px] font-medium text-fg"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile
          label="Reputation Score"
          value={profile.reputation ?? 0}
          hint="Verified build achievements"
        />
        <StatTile
          label="Active Tracks"
          value={profile.tracks?.length ?? 1}
          hint="Domains of expertise"
        />
        <StatTile
          label="Verified Skills"
          value={profile.skills?.length ?? 0}
          hint="Peer endorsed tools"
        />
        <StatTile
          label="Identity Status"
          value="CLAIMED"
          hint={`@${profile.handle}`}
        />
      </div>

      {/* Quick Access Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/u/${profile.handle}`}
          className="rounded-xl border border-hairline bg-surface-1 p-5 hover:border-accent transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <User className="size-5 text-accent" />
            <ArrowRight className="size-4 text-fg-subtle group-hover:text-accent transition-colors" />
          </div>
          <h4 className="font-display text-body-md font-bold text-fg group-hover:text-accent">
            Public Profile Page
          </h4>
          <p className="text-caption text-fg-muted">
            Share your verified link with founders, researchers, and venture grants.
          </p>
        </Link>

        <Link
          href="/settings"
          className="rounded-xl border border-hairline bg-surface-1 p-5 hover:border-accent transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <Settings className="size-5 text-purple-500" />
            <ArrowRight className="size-4 text-fg-subtle group-hover:text-purple-500 transition-colors" />
          </div>
          <h4 className="font-display text-body-md font-bold text-fg group-hover:text-purple-500">
            Account & Profile Settings
          </h4>
          <p className="text-caption text-fg-muted">
            Update your bio, social links, location, and hardware track preferences.
          </p>
        </Link>

        <Link
          href="/new"
          className="rounded-xl border border-hairline bg-surface-1 p-5 hover:border-accent transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <FolderKanban className="size-5 text-emerald-500" />
            <ArrowRight className="size-4 text-fg-subtle group-hover:text-emerald-500 transition-colors" />
          </div>
          <h4 className="font-display text-body-md font-bold text-fg group-hover:text-emerald-500">
            Start a Hardware Project
          </h4>
          <p className="text-caption text-fg-muted">
            Post an open-source project, invite collaborators, and raise bounties.
          </p>
        </Link>
      </div>
    </div>
  );
}
