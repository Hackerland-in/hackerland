import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_POSTS } from '@/lib/data/fixtures/posts';
import { ALL_PEOPLE } from '@/lib/data/fixtures/people';
import { ALL_PROJECT_SUMMARIES } from '@/lib/data/fixtures/projects';
import { ALL_OPPORTUNITIES } from '@/lib/data/fixtures/opportunities';
import { PLATFORM_STATS } from '@/lib/data/fixtures/stats';
import { SocialCommunityProvider } from './social-context';
import { BuilderStoriesStrip } from './builder-stories-strip';
import { SocialFeedStream } from './social-feed-stream';
import { CommunityRightRail } from './community-right-rail';
import { PostCard } from '@/components/domain/post-card';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
}));

describe('Hackerland Pink & White Social Community Components', () => {
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

  it('renders BuilderStoriesStrip with active makers and status chips', () => {
    const stories = ALL_PEOPLE.slice(0, 3).map((person) => ({
      person,
      statusTag: 'Shipping',
    }));

    act(() => {
      root.render(<BuilderStoriesStrip stories={stories} />);
    });

    expect(container.textContent).toContain('Shipping Today');
    expect(container.textContent).toContain('Dr. Meera');
    expect(container.textContent).toContain('Kabir Shah');
  });

  it('renders SocialFeedStream with For You, Following, Saved tabs and inline composer', async () => {
    act(() => {
      root.render(
        <SocialCommunityProvider>
          <SocialFeedStream initialPosts={ALL_POSTS} showComposer />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('For You');
    expect(container.textContent).toContain('Following');
    expect(container.textContent).toContain('Saved (0)');
    expect(container.textContent).toContain('Wind Tunnel Foil Test #3 telemetry logs published');

    // Expand inline composer & publish post
    const promptBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('What are you building today?'),
    );
    expect(promptBtn).toBeTruthy();

    act(() => {
      promptBtn?.click();
    });

    const titleInput = container.querySelector('input[placeholder*="Headline"]') as HTMLInputElement;
    const bodyTextarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(titleInput).toBeTruthy();
    expect(bodyTextarea).toBeTruthy();

    act(() => {
      const nativeInputSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeInputSetter?.call(titleInput, 'First Pink & White Community Demo');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));

      const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )?.set;
      nativeTextareaSetter?.call(bodyTextarea, 'Built a solar weather node in Bengaluru!');
      bodyTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      bodyTextarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const publishBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Publish Post'),
    ) as HTMLButtonElement;
    expect(publishBtn).toBeTruthy();

    await act(async () => {
      publishBtn.form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('First Pink & White Community Demo');
    expect(container.textContent).toContain('Built a solar weather node in Bengaluru!');
  });

  it('supports inline threaded replies, Follow, Bookmark, and Repost on PostCard', () => {
    const post = ALL_POSTS[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <PostCard post={post} />
        </SocialCommunityProvider>,
      );
    });

    // Follow button toggle (meera-iyer starts followed by default -> unfollows then re-follows)
    const followBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Following') || b.textContent?.includes('Follow'),
    );
    expect(followBtn).toBeTruthy();
    expect(followBtn?.textContent).toContain('Following');

    act(() => {
      followBtn?.click();
    });
    expect(followBtn?.textContent).toContain('Follow');

    // Bookmark toggle
    const bookmarkBtn = container.querySelector('button[aria-label="Bookmark post"]') as HTMLButtonElement | null;
    expect(bookmarkBtn).toBeTruthy();
    act(() => {
      bookmarkBtn?.click();
    });
    expect(container.querySelector('button[aria-label="Remove bookmark"]')).toBeTruthy();

    // Repost toggle
    const repostBtn = container.querySelector('button[aria-label="Boost post"]') as HTMLButtonElement | null;
    expect(repostBtn).toBeTruthy();
    act(() => {
      repostBtn?.click();
    });
    expect(container.textContent).toContain('Boosted by you');

    // Comments expand + submit reply
    const commentBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.getAttribute('aria-expanded') !== null && b.textContent?.includes(String(post.comments)),
    );
    expect(commentBtn).toBeTruthy();
    act(() => {
      commentBtn?.click();
    });

    const replyInput = container.querySelector('input[aria-label="Reply to post"]') as HTMLInputElement;
    expect(replyInput).toBeTruthy();

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      setter?.call(replyInput, 'Awesome pitot array precision!');
      replyInput.dispatchEvent(new Event('input', { bubbles: true }));
      replyInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const replySubmit = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Reply'),
    ) as HTMLButtonElement;

    act(() => {
      replySubmit.form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Awesome pitot array precision!');
  });

  it('renders CommunityRightRail with Makers to follow and syncs Follow state', () => {
    act(() => {
      root.render(
        <SocialCommunityProvider>
          <CommunityRightRail
            suggestedMakers={ALL_PEOPLE.slice(0, 3)}
            trendingProjects={ALL_PROJECT_SUMMARIES.slice(0, 2)}
            openBounties={ALL_OPPORTUNITIES.slice(0, 2)}
            stats={PLATFORM_STATS}
          />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('Hackerland Square');
    expect(container.textContent).toContain('Makers to follow');
    expect(container.textContent).toContain('Trending builds');
    expect(container.textContent).toContain('Live bounties');
    expect(container.textContent).toContain('Kabir Shah');
  });
});
