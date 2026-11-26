import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_PROFILES } from '@/lib/data/fixtures/people';
import { ALL_POSTS } from '@/lib/data/fixtures/posts';
import { SocialCommunityProvider } from './social-context';
import { MakerDirectory } from './maker-directory';
import { SocialProfileView } from './social-profile-view';
import { PersonalProfileHub } from './personal-profile-hub';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockUseSession = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/u',
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: () => mockUseSession(),
  },
}));

describe('Maker Profiles & Social Directory Components', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
    mockUseSession.mockReturnValue({ data: null, isPending: false });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it('renders MakerDirectory, searches by query, and toggles Follow count', () => {
    act(() => {
      root.render(
        <SocialCommunityProvider>
          <MakerDirectory initialProfiles={ALL_PROFILES} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain(`All Makers (${ALL_PROFILES.length})`);
    expect(container.textContent).toContain('Following (2)');
    expect(container.textContent).toContain('Dr. Meera Iyer');
    expect(container.textContent).toContain('Lena Fischer');

    // Follow Kabir Shah (initially not followed) -> Following count rises from 2 to 3
    const followButtons = Array.from(container.querySelectorAll('button')).filter(
      (b) => b.textContent?.trim() === 'Follow',
    );
    expect(followButtons.length).toBeGreaterThan(0);

    act(() => {
      followButtons[0]?.click();
    });
    expect(container.textContent).toContain('Following (3)');

    // Search for Berlin -> only Lena Fischer remains
    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(searchInput, 'Berlin');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Lena Fischer');
    expect(container.textContent).not.toContain('Dr. Meera Iyer');
  });

  it('renders SocialProfileView, increments follower count on Follow, and posts inline endorsement', () => {
    const kabirProfile = ALL_PROFILES.find((p) => p.handle === 'kabir-shah')!;
    const kabirPosts = ALL_POSTS.filter((p) => p.author.handle === 'kabir-shah');

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <SocialProfileView profile={kabirProfile} posts={kabirPosts} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('Kabir Shah');
    expect(container.textContent).toContain('@kabir-shah');

    // Click Follow button on profile header
    const followBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Follow',
    );
    expect(followBtn).toBeTruthy();

    act(() => {
      followBtn?.click();
    });
    expect(followBtn?.textContent).toContain('Following');

    // Switch to Endorsements tab & submit shoutout
    const endorseTab = Array.from(container.querySelectorAll('[role="tab"]')).find((t) =>
      t.textContent?.includes('Endorsements'),
    ) as HTMLButtonElement | undefined;
    expect(endorseTab).toBeTruthy();

    act(() => {
      endorseTab?.click();
    });

    const endorseInput = container.querySelector('#endorse-input') as HTMLInputElement;
    expect(endorseInput).toBeTruthy();

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(endorseInput, 'Built a rock-solid I2C recovery firmware for our drone!');
      endorseInput.dispatchEvent(new Event('input', { bubbles: true }));
      endorseInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const submitBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Post Shoutout'),
    ) as HTMLButtonElement;

    act(() => {
      submitBtn.form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Built a rock-solid I2C recovery firmware for our drone!');
  });

  it('renders PersonalProfileHub in guest state with live Following stat', () => {
    act(() => {
      root.render(
        <SocialCommunityProvider>
          <PersonalProfileHub />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('Join Hackerland Builders');
    expect(container.textContent).toContain('Following');
    expect(container.textContent).toContain('Saved Bookmarks');
  });
});
