import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_COMMUNITY_IDEAS } from '@/lib/data/ideas-data';
import { listProblems } from '@/lib/data/problems-data';
import { listBuildStories } from '@/lib/data/stories-data';
import { SocialCommunityProvider } from './social-context';
import { IdeasWorkbench } from './ideas-workbench';
import { ProblemsExplorer } from './problems-explorer';
import { StoriesExplorer } from './stories-explorer';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function setControlValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Feature #6: IdeaLab, Unsolved Problems & Build Stories Social Components', () => {
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

  it('creates a new idea, toggles cheer, and advances stage with localStorage persistence', () => {
    const firstIdea = INITIAL_COMMUNITY_IDEAS[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <IdeasWorkbench />
        </SocialCommunityProvider>,
      );
    });

    // Cheer the first idea
    const cheerBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(`Cheer (${firstIdea.cheersCount})`),
    );
    expect(cheerBtn).toBeTruthy();

    act(() => {
      cheerBtn!.click();
    });

    expect(container.textContent).toContain(`Cheer (${firstIdea.cheersCount + 1})`);
    const cheersStored = JSON.parse(localStorage.getItem('hackerland_idea_cheers') || '[]');
    expect(cheersStored).toContain(firstIdea.id);

    // Advance stage of the first idea (prototype -> test)
    const advanceBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Next stage'),
    );
    expect(advanceBtn).toBeTruthy();
    act(() => {
      advanceBtn!.click();
    });
    expect(container.textContent).toContain('Stage: test');

    // Open workbook modal and create a new spark
    const openModalBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Shape an Idea in the Workbook'),
    );
    expect(openModalBtn).toBeTruthy();

    act(() => {
      openModalBtn!.click();
    });

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();

    const inputs = dialog!.querySelectorAll('input');
    const textarea = dialog!.querySelector('textarea')!;
    act(() => {
      setControlValue(inputs[0] as HTMLInputElement, 'Rainwater Aquifer Sensor Mesh');
      setControlValue(textarea, 'Borewell depletion goes unmeasured across rural clusters.');
      setControlValue(inputs[1] as HTMLInputElement, 'Gram panchayat water committees');
      setControlValue(inputs[2] as HTMLInputElement, 'LoRa pressure node with solar beacon');
    });

    const form = dialog!.querySelector('form')!;
    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Rainwater Aquifer Sensor Mesh');
    const storedIdeas = JSON.parse(localStorage.getItem('hackerland_ideas_v1') || '[]');
    expect(storedIdeas.some((item: { title: string }) => item.title === 'Rainwater Aquifer Sensor Mesh')).toBe(true);
  });

  it('filters ProblemsExplorer by domain/search and persists claimed investigations', async () => {
    const problems = await listProblems();
    expect(problems.length).toBeGreaterThan(1);
    const first = problems[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <ProblemsExplorer initialProblems={problems} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain(first.title);

    const claimBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Claim Investigation'),
    );
    expect(claimBtn).toBeTruthy();

    act(() => {
      claimBtn!.click();
    });

    expect(claimBtn!.getAttribute('aria-pressed')).toBe('true');
    expect(claimBtn!.textContent).toContain('Investigating');
    const claimedStored = JSON.parse(localStorage.getItem('hackerland_claimed_problems') || '[]');
    expect(claimedStored).toContain(first.id);

    // Filter by search query
    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    act(() => {
      setControlValue(searchInput, 'zzzz-nonexistent-problem');
    });
    expect(container.textContent).not.toContain(first.title);

    act(() => {
      setControlValue(searchInput, first.title.slice(0, 10));
    });
    expect(container.textContent).toContain(first.title);
  });

  it('filters StoriesExplorer by category, search query, and persists saves', async () => {
    const stories = await listBuildStories();
    expect(stories.length).toBeGreaterThan(1);
    const first = stories[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <StoriesExplorer initialStories={stories} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain(first.title);

    // Filter to first story's category
    const catBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === first.category,
    );
    expect(catBtn).toBeTruthy();

    act(() => {
      catBtn!.click();
    });
    expect(container.textContent).toContain(first.title);

    // Toggle bookmark save
    const saveBtn = container.querySelector(
      `button[aria-label="Save ${first.title}"]`,
    ) as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();
    act(() => {
      saveBtn.click();
    });
    expect(saveBtn.getAttribute('aria-pressed')).toBe('true');

    // Filter out by search query
    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    act(() => {
      setControlValue(searchInput, 'zzzz-nonexistent-story');
    });
    expect(container.textContent).not.toContain(first.title);
  });
});
