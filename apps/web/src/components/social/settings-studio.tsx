'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { TRACKS, TRACK_META, type Track } from '@hackerland/core';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Label,
  ProgressBar,
  Textarea,
  cn,
} from '@hackerland/ui';
import {
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  User,
  Bell,
  Sliders,
} from 'lucide-react';

interface SocialLink {
  label: string;
  url: string;
}

interface CommunityPrefs {
  openToSquads: boolean;
  openToMentoring: boolean;
  publicPassport: boolean;
  weeklyDigest: boolean;
}

const DEFAULT_PREFS: CommunityPrefs = {
  openToSquads: true,
  openToMentoring: true,
  publicPassport: true,
  weeklyDigest: true,
};

export function SettingsStudio() {
  const [handle, setHandle] = useState('');
  const [isHandleLocked, setIsHandleLocked] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>(['code']);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [prefs, setPrefs] = useState<CommunityPrefs>(DEFAULT_PREFS);

  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    try {
      const cached = localStorage.getItem('hackerland_user_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          if (parsed.handle) {
            setHandle(parsed.handle);
            setIsHandleLocked(true);
          }
          if (parsed.displayName || parsed.name) setDisplayName(parsed.displayName || parsed.name);
          if (parsed.headline) setHeadline(parsed.headline);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.tracks?.length) setSelectedTracks(parsed.tracks);
          if (parsed.links?.length) setLinks(parsed.links);
        }
      }
      const savedPrefs = localStorage.getItem('hackerland_user_prefs');
      if (savedPrefs) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) });
      }
    } catch {}
    setLoading(false);

    void (async () => {
      try {
        const res = await fetch('/api/me/profile');
        if (res.ok && active) {
          const raw = await res.json();
          const data = raw?.profile || raw;
          if (data) {
            if (data.handle) {
              setHandle(data.handle);
              setIsHandleLocked(true);
            }
            if (data.displayName || data.name) setDisplayName(data.displayName || data.name);
            if (data.headline) setHeadline(data.headline);
            if (data.bio) setBio(data.bio);
            if (data.location) setLocation(data.location);
            if (data.tracks?.length) setSelectedTracks(data.tracks);
            if (data.links) setLinks(data.links);
          }
        }
      } catch {}
    })();

    return () => {
      active = false;
    };
  }, []);

  const toggleTrack = (track: Track) => {
    if (selectedTracks.includes(track)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter((t) => t !== track));
      }
    } else {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  const addLink = () => {
    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();
    if (label && url) {
      setLinks([...links, { label, url }]);
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const togglePref = (key: keyof CommunityPrefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('hackerland_user_prefs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const completenessScore = useMemo(() => {
    let score = 0;
    if (handle.trim().length >= 3) score += 20;
    if (displayName.trim().length >= 2) score += 20;
    if (headline.trim().length >= 3) score += 20;
    if (bio.trim().length >= 10) score += 20;
    if (location.trim().length >= 2 || links.length > 0) score += 20;
    return score;
  }, [handle, displayName, headline, bio, location, links.length]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const cleanHandle =
      (handle.trim() || 'innovator')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/^-+|-+$/g, '') || 'innovator';
    const cleanName = displayName.trim() || cleanHandle;

    const payload = {
      handle: cleanHandle,
      displayName: cleanName,
      headline: headline.trim(),
      bio: bio.trim(),
      location: location.trim(),
      tracks: selectedTracks,
      links,
    };

    try {
      localStorage.setItem('hackerland_user_profile', JSON.stringify(payload));
      localStorage.setItem('hackerland_user_prefs', JSON.stringify(prefs));
      window.dispatchEvent(new CustomEvent('hackerland:profile-updated', { detail: payload }));
    } catch {}

    setHandle(cleanHandle);
    setIsHandleLocked(true);
    setSaveSuccess(true);
    setSaving(false);

    void (async () => {
      try {
        const res = await fetch('/api/me/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok && res.status !== 404 && res.status !== 503 && res.status !== 401) {
          const data = await res.json().catch(() => ({}));
          setSaveError(data.error || 'Failed to sync profile to server.');
        }
      } catch {}
    })();
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="size-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-body-sm text-fg-muted">Loading your settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0">
      {/* Rosepaper Hero */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Sliders className="size-3.5" aria-hidden="true" />
              <span>Account &amp; Maker Identity</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              Profile Settings
            </h1>
            <p className="text-body-sm text-fg-muted max-w-xl">
              Manage your public builder persona, disciplines, collaboration preferences, and Innovation Passport links.
            </p>
          </div>

          <Button asChild variant="secondary" size="sm" className="self-start sm:self-auto shrink-0">
            <Link href={handle ? `/u/${handle}` : '/u'}>
              <User className="size-4" />
              <span>{handle ? 'View Public Profile' : 'Browse Makers'}</span>
            </Link>
          </Button>
        </div>

        {/* Profile Completeness Meter */}
        <div className="rounded-xl border border-hairline bg-surface-1/80 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-body-xs">
            <span className="font-display font-semibold text-fg">Maker Profile Completeness</span>
            <span className="font-mono font-bold text-accent-fg">{completenessScore}%</span>
          </div>
          <ProgressBar value={completenessScore} tone="accent" label="Profile completeness" />
        </div>
      </header>

      {saveSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 p-3.5 text-body-sm text-success-fg"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Profile updated successfully! Your Innovation Passport and community persona are synced.</span>
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-body-sm text-danger-fg"
        >
          {saveError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <Card className="min-w-0 break-words border-hairline bg-surface-1 shadow-xs">
          <CardHeader>
            <h2 className="font-display text-headline-sm font-bold text-fg">Public Identity</h2>
            <p className="text-body-sm text-fg-muted">
              Basic information shown across posts, squad rooms, and your Innovation Passport.
            </p>
          </CardHeader>

          <CardBody className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="settings-handle">Innovator Handle</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-body-md text-fg-subtle">
                  @
                </span>
                <Input
                  id="settings-handle"
                  value={handle}
                  disabled={isHandleLocked}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="your-handle (e.g. arya-dev)"
                  className={cn(
                    'pl-8 font-mono text-body-md',
                    isHandleLocked ? 'bg-sunken opacity-80 cursor-not-allowed' : 'bg-surface-1',
                  )}
                  required
                />
              </div>
              <p className="text-body-xs text-fg-subtle">
                {isHandleLocked
                  ? 'Handles are anchored to your proof-of-ship ledger.'
                  : 'Choose your unique maker handle. Locked once saved.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-name">Display Name</Label>
              <Input
                id="settings-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-headline">Headline</Label>
              <Input
                id="settings-headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={140}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-location">Location</Label>
              <Input
                id="settings-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                maxLength={80}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-bio">Biography</Label>
              <Textarea
                id="settings-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={600}
                required
              />
            </div>
          </CardBody>
        </Card>

        {/* Active Tracks */}
        <Card className="min-w-0 break-words border-hairline bg-surface-1 shadow-xs">
          <CardHeader>
            <h2 className="font-display text-headline-sm font-bold text-fg">Active Tracks</h2>
            <p className="text-body-sm text-fg-muted">
              Select the disciplines you build and mentor in.
            </p>
          </CardHeader>

          <CardBody className="pt-2">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {TRACKS.map((track) => {
                const isSelected = selectedTracks.includes(track);
                const meta = TRACK_META[track];
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => toggleTrack(track)}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all',
                      isSelected
                        ? 'border-accent bg-accent-soft/60'
                        : 'border-hairline bg-surface-1 hover:border-accent/40',
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <Badge tone={track} variant={isSelected ? 'solid' : 'outline'}>
                        {meta.label}
                      </Badge>
                      {isSelected && <CheckCircle2 className="size-4 text-accent" />}
                    </div>
                    <p className="text-body-xs text-fg-muted mt-1">{meta.description}</p>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Community Preferences */}
        <Card className="min-w-0 break-words border-hairline bg-surface-1 shadow-xs">
          <CardHeader>
            <h2 className="font-display text-headline-sm font-bold text-fg flex items-center gap-2">
              <Bell className="size-4 text-accent" />
              <span>Community &amp; Collaboration Preferences</span>
            </h2>
            <p className="text-body-sm text-fg-muted">
              Control squad invitations, mentoring visibility, and digest alerts.
            </p>
          </CardHeader>

          <CardBody className="pt-2 space-y-2.5">
            {(
              [
                {
                  key: 'openToSquads',
                  label: 'Open to Sprint & Hackathon Squad Invites',
                  hint: 'Show an "Open for Squads" signal on your maker profile.',
                },
                {
                  key: 'openToMentoring',
                  label: 'Available for Peer Code & Schematic Reviews',
                  hint: 'Allow student makers to request async build feedback.',
                },
                {
                  key: 'publicPassport',
                  label: 'Public Innovation Passport Ledger',
                  hint: 'Allow partners to verify your proof-of-ship builds at /passport.',
                },
                {
                  key: 'weeklyDigest',
                  label: 'Weekly Bounty & Sprint Digest',
                  hint: 'Surface curated open hardware bounties and teardown releases.',
                },
              ] as const
            ).map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-3 rounded-xl border border-hairline bg-sunken/70 p-3.5 cursor-pointer hover:border-accent/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-display text-body-sm font-semibold text-fg block">
                    {item.label}
                  </span>
                  <span className="text-body-xs text-fg-muted block">{item.hint}</span>
                </div>
                <input
                  type="checkbox"
                  checked={prefs[item.key]}
                  onChange={() => togglePref(item.key)}
                  className="mt-1 size-4 rounded border-line accent-accent shrink-0"
                />
              </label>
            ))}
          </CardBody>
        </Card>

        {/* Social Links */}
        <Card className="min-w-0 break-words border-hairline bg-surface-1 shadow-xs">
          <CardHeader>
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Portfolio &amp; Social Links
            </h2>
            <p className="text-body-sm text-fg-muted">
              Connect GitHub, Hackaday, Google Scholar, or personal build logs.
            </p>
          </CardHeader>

          <CardBody className="space-y-4 pt-2">
            {links.length > 0 && (
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-sunken p-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ExternalLink className="size-4 shrink-0 text-accent" />
                      <span className="font-medium text-body-sm text-fg">{link.label}:</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-fg-muted hover:text-accent hover:underline truncate"
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="p-1 text-fg-subtle hover:text-danger-fg transition-colors shrink-0"
                      aria-label={`Remove ${link.label}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col gap-2 sm:flex-row pt-1">
              <Input
                placeholder="Label (e.g. GitHub)"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                className="sm:w-1/3"
              />
              <Input
                placeholder="https://..."
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="sm:flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addLink}
                disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
              >
                <Plus className="size-4" />
                <span>Add Link</span>
              </Button>
            </div>
          </CardBody>

          <CardFooter className="flex justify-end gap-3 bg-surface-2/40 border-t border-hairline">
            <Button type="submit" variant="primary" disabled={saving} loading={saving}>
              <Save className="size-4" />
              <span>Save Changes</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
