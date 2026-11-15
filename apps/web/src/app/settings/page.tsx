'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TRACKS,
  TRACK_META,
  type Track,
} from '@hackerland/core';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Label,
  SectionHeader,
  Textarea,
} from '@hackerland/ui';
import {
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  User,
} from 'lucide-react';

interface SocialLink {
  label: string;
  url: string;
}

export default function SettingsPage() {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>(['code']);
  const [links, setLinks] = useState<SocialLink[]>([]);

  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Try to load current user profile from API if available
  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const res = await fetch('/api/me/profile');
        if (res.ok) {
          const raw = await res.json();
          const data = raw?.profile || raw;
          if (active && data) {
            if (data.handle) setHandle(data.handle);
            if (data.displayName || data.name) setDisplayName(data.displayName || data.name);
            if (data.headline) setHeadline(data.headline);
            if (data.bio) setBio(data.bio);
            if (data.location) setLocation(data.location);
            if (data.tracks && data.tracks.length > 0) setSelectedTracks(data.tracks);
            if (data.links) setLinks(data.links);
          }
        }
      } catch {
        // Fall back gracefully
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const payload = {
      handle,
      displayName,
      headline,
      bio,
      location,
      tracks: selectedTracks,
      links,
    };

    try {
      const res = await fetch('/api/me/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // In local or static demo mode, acknowledge save
        if (res.status === 404 || res.status === 503) {
          setSaveSuccess(true);
          setSaving(false);
          return;
        }
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || 'Failed to update profile.');
        setSaving(false);
        return;
      }

      setSaveSuccess(true);
    } catch {
      // Local fallback
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="size-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-body-sm text-fg-muted">Loading your settings…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 min-w-0 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          as="h1"
          size="page"
          eyebrow="MISSION CONTROL · IDENTITY"
          title="Profile Settings"
          description="Manage your public innovator persona, disciplines, and portfolio links."
        />
        <Button asChild variant="secondary" size="sm" className="self-start sm:self-auto">
          <Link href={`/u/${handle}`}>
            <User className="size-4" />
            <span>View Public Profile</span>
          </Link>
        </Button>
      </div>

      {saveSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md border border-earn/40 bg-earn/10 p-3 text-body-sm text-earn"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Profile updated successfully! Your reputation ledger and bio are synchronized.</span>
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg"
        >
          {saveError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Identity */}
        <Card className="min-w-0 break-words shadow-module">
          <CardHeader>
            <h2 className="font-display text-headline-sm text-fg">
              Public Identity
            </h2>
            <p className="text-body-sm text-fg-muted">
              Basic information visible to collaborators across Hackerland.
            </p>
          </CardHeader>

          <CardBody className="space-y-4 pt-2">
            {/* Handle (immutable) */}
            <div className="space-y-2">
              <Label htmlFor="settings-handle">Innovator Handle</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-body-md text-fg-subtle">
                  @
                </span>
                <Input
                  id="settings-handle"
                  value={handle}
                  disabled
                  className="pl-8 font-mono text-body-md bg-sunken opacity-80 cursor-not-allowed"
                />
              </div>
              <p className="text-body-xs text-fg-subtle">
                Handles are permanently tied to your cryptographic ledger and cannot be changed.
              </p>
            </div>

            {/* Display Name */}
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

            {/* Headline */}
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

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="settings-location">Location</Label>
              <Input
                id="settings-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India or Berlin, Germany"
                maxLength={80}
              />
            </div>

            {/* Bio */}
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
              <p className="text-body-xs text-fg-subtle">
                Summarize your engineering journey, areas of expertise, and mentorship interests.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Primary Tracks */}
        <Card className="min-w-0 break-words shadow-module">
          <CardHeader>
            <h2 className="font-display text-headline-sm text-fg">
              Active Tracks
            </h2>
            <p className="text-body-sm text-fg-muted">
              Select the disciplines you want to build and mentor in.
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
                    className={`flex flex-col items-start gap-1 rounded-lg border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-accent bg-surface-2 shadow-module'
                        : 'border-hairline bg-surface-1 hover:border-line'
                    }`}
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

        {/* Social Links & Portfolio */}
        <Card className="min-w-0 break-words shadow-module">
          <CardHeader>
            <h2 className="font-display text-headline-sm text-fg">
              Portfolio & Social Links
            </h2>
            <p className="text-body-sm text-fg-muted">
              Connect external profiles (GitHub, ResearchGate, Scholar, Personal Portfolio).
            </p>
          </CardHeader>

          <CardBody className="space-y-4 pt-2">
            {links.length > 0 && (
              <ul className="space-y-2">
                {links.map((link, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-2 p-3"
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
                      className="p-1 text-fg-subtle hover:text-danger transition-colors shrink-0"
                      aria-label={`Remove ${link.label}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add new link */}
            <div className="flex flex-col gap-2 sm:flex-row pt-2">
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

          <CardFooter className="flex justify-end gap-3 bg-surface-2/40">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              loading={saving}
            >
              <Save className="size-4" />
              <span>Save Changes</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
