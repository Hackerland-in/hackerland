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

  it('waits for the session before fetching', async () => {
    mockUseSession.mockReturnValue({ data: null, isPending: true });
    await act(async () => {
      root.render(<SettingsPage />);
    });
    expect(profileFetches()).toHaveLength(0);
    expect(container.textContent).toContain('Loading your settings');
  });
});
