import { describe, expect, it } from 'vitest';
import { getEnabledSocialProviders, isAuthConfigured } from './auth';

describe('auth helpers', () => {
  it('isAuthConfigured returns false when env is empty', () => {
    expect(isAuthConfigured({})).toBe(false);
  });

  it('isAuthConfigured returns true when MONGODB_URI and BETTER_AUTH_SECRET are present', () => {
    expect(
      isAuthConfigured({
        MONGODB_URI: 'mongodb://x',
        BETTER_AUTH_SECRET: 's',
      }),
    ).toBe(true);
  });

  it('getEnabledSocialProviders returns empty when keys are missing or partial', () => {
    expect(getEnabledSocialProviders({})).toEqual([]);
    expect(getEnabledSocialProviders({ GITHUB_CLIENT_ID: 'a' })).toEqual([]);
    expect(getEnabledSocialProviders({ GITHUB_CLIENT_SECRET: 'b' })).toEqual([]);
  });

  it('getEnabledSocialProviders returns github when both id and secret are provided', () => {
    expect(
      getEnabledSocialProviders({
        GITHUB_CLIENT_ID: 'gh-id',
        GITHUB_CLIENT_SECRET: 'gh-secret',
      }),
    ).toEqual(['github']);
  });

  it('getEnabledSocialProviders returns both providers when all credentials are set', () => {
    expect(
      getEnabledSocialProviders({
        GITHUB_CLIENT_ID: 'gh-id',
        GITHUB_CLIENT_SECRET: 'gh-secret',
        GOOGLE_CLIENT_ID: 'g-id',
        GOOGLE_CLIENT_SECRET: 'g-secret',
      }),
    ).toEqual(['github', 'google']);
  });
});
