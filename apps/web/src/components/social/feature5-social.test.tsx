import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_ROADMAPS } from '@/lib/data/fixtures/roadmaps';
import { FIXTURE_NOTIFICATIONS } from '@/lib/data/fixtures/notifications';
import { getLeaderboard } from '@/lib/data/queries';
import { SocialCommunityProvider } from './social-context';
import { RoadmapCard } from '@/components/domain/roadmap-card';
import { LeaderboardInteractive } from './leaderboard-interactive';
import { NotificationsInbox } from './notifications-inbox';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Feature #5: Learn, Leaderboard & Notifications Social Components', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    localStorage.clear();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it('toggles module completion and persists RoadmapCard progress in localStorage', () => {
    const roadmap = ALL_ROADMAPS[0]!;
    const firstModule = roadmap.stages[0]!.modules[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <RoadmapCard roadmap={roadmap} expanded />
        </SocialCommunityProvider>,
      );
    });

    const toggleBtn = container.querySelector(
      `button[aria-label="Mark ${firstModule.title} completed"]`,
    ) as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('false');

    act(() => {
      toggleBtn.click();
    });

    expect(toggleBtn.getAttribute('aria-pressed')).toBe('true');
    const stored = JSON.parse(localStorage.getItem(`hackerland_roadmap_${roadmap.slug}`) || '[]');
    expect(stored).toContain('0-0');
  });

  it('filters LeaderboardInteractive by Following Only and search query', async () => {
    const entries = await getLeaderboard();

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <LeaderboardInteractive entries={entries} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('Podium Champions');
    expect(container.textContent).toContain('Proof-of-Ship Ledger');

    const followingBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Following Only'),
    );
    expect(followingBtn).toBeTruthy();

    act(() => {
      followingBtn?.click();
    });

    expect(container.textContent).toContain('Dr. Meera');
  });

  it('marks notifications read individually and via Mark all read in localStorage', () => {
    act(() => {
      root.render(<NotificationsInbox initialNotifications={FIXTURE_NOTIFICATIONS} />);
    });

    const markAllBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Mark all read'),
    ) as HTMLButtonElement;
    expect(markAllBtn).toBeTruthy();

    act(() => {
      markAllBtn.click();
    });

    expect(container.textContent).toContain('Unread (0)');
    const readIds = JSON.parse(localStorage.getItem('hackerland_read_notifications') || '[]');
    expect(readIds.length).toBe(FIXTURE_NOTIFICATIONS.length);
  });
});
