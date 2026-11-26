import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BUILDER_IDENTITY_UPDATED_EVENT,
  BUILDER_PROFILE_STORAGE_KEY,
  DEFAULT_BUILDER_IDENTITY,
  getActiveBuilderIdentity,
  setActiveBuilderIdentity,
} from './builder-identity';

describe('builder-identity helper', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns default authentic Indian hardware builder identity when unconfigured', () => {
    const id = getActiveBuilderIdentity();
    expect(id.name).toBe('Rohan Kulkarni');
    expect(id.handle).toBe('rohan_k');
    expect(id.isConfigured).toBe(false);
    expect(id).toEqual(DEFAULT_BUILDER_IDENTITY);
  });

  it('persists custom builder profile to localStorage and sanitizes handles', () => {
    const onUpdated = vi.fn();
    window.addEventListener(BUILDER_IDENTITY_UPDATED_EVENT, onUpdated);

    const saved = setActiveBuilderIdentity({
      name: 'Aarti Verma',
      handle: '@Aarti.Verma!!',
      headline: 'SiC Inverter & Thermal Architect · Chennai',
    });

    expect(saved.name).toBe('Aarti Verma');
    expect(saved.handle).toBe('aarti_verma');
    expect(saved.isConfigured).toBe(true);
    expect(onUpdated).toHaveBeenCalledTimes(1);

    const reloaded = getActiveBuilderIdentity();
    expect(reloaded.name).toBe('Aarti Verma');
    expect(reloaded.handle).toBe('aarti_verma');
    expect(reloaded.headline).toContain('Chennai');
    expect(window.localStorage.getItem(BUILDER_PROFILE_STORAGE_KEY)).toContain('Aarti Verma');

    window.removeEventListener(BUILDER_IDENTITY_UPDATED_EVENT, onUpdated);
  });
});
