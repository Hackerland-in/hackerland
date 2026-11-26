'use client';

import { useEffect, useState } from 'react';

export interface BuilderIdentity {
  name: string;
  handle: string;
  headline: string;
  badgeLabel: string;
  isConfigured: boolean;
}

export const BUILDER_PROFILE_STORAGE_KEY = 'hackerland_user_profile';
export const BUILDER_IDENTITY_UPDATED_EVENT = 'hackerland:identity-updated';

export const DEFAULT_BUILDER_IDENTITY: BuilderIdentity = {
  name: 'Rohan Kulkarni',
  handle: 'rohan_k',
  headline: 'Embedded Systems & Hardware Builder · Pune',
  badgeLabel: 'Maker',
  isConfigured: false,
};

function sanitizeHandle(raw: string): string {
  const clean = raw
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return clean || DEFAULT_BUILDER_IDENTITY.handle;
}

export function getActiveBuilderIdentity(): BuilderIdentity {
  if (typeof window === 'undefined') return DEFAULT_BUILDER_IDENTITY;
  try {
    const raw = window.localStorage.getItem(BUILDER_PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_BUILDER_IDENTITY;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const rawName =
      typeof parsed.displayName === 'string' && parsed.displayName.trim()
        ? parsed.displayName.trim()
        : typeof parsed.name === 'string' && parsed.name.trim()
        ? parsed.name.trim()
        : '';
    const rawHandle =
      typeof parsed.handle === 'string' && parsed.handle.trim() ? parsed.handle.trim() : '';
    if (!rawName && !rawHandle) return DEFAULT_BUILDER_IDENTITY;
    const name = rawName || DEFAULT_BUILDER_IDENTITY.name;
    const handle = sanitizeHandle(rawHandle || name);
    const headline =
      typeof parsed.headline === 'string' && parsed.headline.trim()
        ? parsed.headline.trim()
        : typeof parsed.bio === 'string' && parsed.bio.trim()
        ? parsed.bio.trim().slice(0, 90)
        : DEFAULT_BUILDER_IDENTITY.headline;
    return {
      name,
      handle,
      headline,
      badgeLabel:
        typeof parsed.primaryTrack === 'string' && parsed.primaryTrack.trim()
          ? parsed.primaryTrack.trim()
          : 'Builder',
      isConfigured: true,
    };
  } catch {
    return DEFAULT_BUILDER_IDENTITY;
  }
}

export function setActiveBuilderIdentity(partial: {
  name?: string;
  handle?: string;
  headline?: string;
}): BuilderIdentity {
  const current = getActiveBuilderIdentity();
  const nextName = partial.name?.trim() || current.name;
  const nextHandle = sanitizeHandle(partial.handle?.trim() || current.handle || nextName);
  const nextHeadline = partial.headline?.trim() || current.headline;

  if (typeof window !== 'undefined') {
    try {
      const prevRaw = window.localStorage.getItem(BUILDER_PROFILE_STORAGE_KEY);
      const prev = prevRaw ? (JSON.parse(prevRaw) as Record<string, unknown>) : {};
      const updated = {
        ...prev,
        displayName: nextName,
        name: nextName,
        handle: nextHandle,
        headline: nextHeadline,
      };
      window.localStorage.setItem(BUILDER_PROFILE_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(BUILDER_IDENTITY_UPDATED_EVENT));
      window.dispatchEvent(new CustomEvent('hackerland:profile-updated', { detail: updated }));
    } catch {}
  }

  return {
    name: nextName,
    handle: nextHandle,
    headline: nextHeadline,
    badgeLabel: current.badgeLabel,
    isConfigured: true,
  };
}

export function useBuilderIdentity() {
  const [identity, setIdentity] = useState<BuilderIdentity>(DEFAULT_BUILDER_IDENTITY);

  useEffect(() => {
    const sync = () => setIdentity(getActiveBuilderIdentity());
    sync();
    window.addEventListener(BUILDER_IDENTITY_UPDATED_EVENT, sync);
    window.addEventListener('hackerland:profile-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BUILDER_IDENTITY_UPDATED_EVENT, sync);
      window.removeEventListener('hackerland:profile-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const updateIdentity = (partial: { name?: string; handle?: string; headline?: string }) => {
    const updated = setActiveBuilderIdentity(partial);
    setIdentity(updated);
    return updated;
  };

  return { identity, updateIdentity };
}
