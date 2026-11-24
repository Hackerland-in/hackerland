import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsPage from './page';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockUseSession = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: { useSession: () => mockUseSession() },
}));

describe('Settings page', () => {
  let container: HTMLDivElement;
  let root: Root;
  const fetchMock = vi.fn();

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ profile: { handle: 'meera-iyer', displayName: 'Meera' } })),
    );
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    localStorage.clear();
  });

  const profileFetches = () =>
    fetchMock.mock.calls.filter(([url]) => String(url).startsWith('/api/me/profile'));

  it('does not request the signed-in profile for a signed-out visitor', async () => {
    mockUseSession.mockReturnValue({ data: null, isPending: false });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(profileFetches()).toHaveLength(0);
    expect(container.querySelector('h1')?.textContent).toContain('Profile Settings');
  });

  it('loads the profile once the session shows a signed-in user', async () => {
    mockUseSession.mockReturnValue({ data: { user: { id: 'u1' } }, isPending: false });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(profileFetches()).toHaveLength(1);
  });

  it('keeps a signed-out visitor\'s unsaved edits when the session refetches on tab focus', async () => {
    localStorage.setItem('hackerland_user_profile', JSON.stringify({ bio: 'saved bio' }));
    mockUseSession.mockReturnValue({ data: null, isPending: false });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    const bio = () => container.querySelector<HTMLTextAreaElement>('#settings-bio')!;
    expect(bio().value).toBe('saved bio');

    // Type into the field the way React observes it.
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
      setter.call(bio(), 'unsaved edit');
      bio().dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(bio().value).toBe('unsaved edit');

    // better-auth marks a signed-out session pending again while it refetches on focus.
    mockUseSession.mockReturnValue({ data: null, isPending: true });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(container.textContent).not.toContain('Loading your settings');

    mockUseSession.mockReturnValue({ data: null, isPending: false });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(bio().value).toBe('unsaved edit');
  });

  it('fetches again when a different user signs in', async () => {
    mockUseSession.mockReturnValue({ data: { user: { id: 'u1' } }, isPending: false });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    mockUseSession.mockReturnValue({ data: { user: { id: 'u2' } }, isPending: false });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(profileFetches()).toHaveLength(2);
  });

  it('waits for the session before fetching', async () => {
    mockUseSession.mockReturnValue({ data: null, isPending: true });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(profileFetches()).toHaveLength(0);
    expect(container.textContent).toContain('Loading your settings');
  });
});
