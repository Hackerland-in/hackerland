import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_PROJECT_SUMMARIES } from '@/lib/data/fixtures/projects';
import { SQUADS_DATA } from '@/lib/data/squads-data';
import { SocialCommunityProvider } from './social-context';
import { ProjectCatalog } from './project-catalog';
import { SquadRoomWorkspace } from '@/components/squad/squad-room-workspace';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/projects',
}));

describe('Projects Discovery & Squad Rooms Components', () => {
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

  it('renders ProjectCatalog, likes a project card, and filters live by query', () => {
    act(() => {
      root.render(
        <SocialCommunityProvider>
          <ProjectCatalog initialProjects={ALL_PROJECT_SUMMARIES} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain(`All Builds (${ALL_PROJECT_SUMMARIES.length})`);
    expect(container.textContent).toContain('Liked (1)');
    expect(container.textContent).toContain('AeroGlide');
    expect(container.textContent).toContain('OpenBraille');

    // Like OpenBraille (second card) -> Liked count becomes 2
    const likeButtons = Array.from(container.querySelectorAll('button[aria-label^="Like "]'));
    expect(likeButtons.length).toBeGreaterThan(0);

    act(() => {
      (likeButtons[0] as HTMLButtonElement).click();
    });

    expect(container.textContent).toContain('Liked (2)');

    // Search for Saathi
    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(searchInput, 'Saathi');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('Saathi Voice AI');
    expect(container.textContent).not.toContain('AeroGlide');
  });

  it('renders SquadRoomWorkspace in light social style, adds kanban task, and submits proof', () => {
    const squadRoom = SQUADS_DATA[0]!;

    act(() => {
      root.render(<SquadRoomWorkspace squadRoom={squadRoom} />);
    });

    expect(container.textContent).toContain('Squad Room & Milestone Vault');
    expect(container.textContent).toContain('Total Escrow Pool');
    expect(container.textContent).toContain(squadRoom.projectTitle);

    // Switch currency from INR to USD
    const usdBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === '$',
    );
    expect(usdBtn).toBeTruthy();

    act(() => {
      usdBtn?.click();
    });

    expect(container.textContent).toContain(`$${squadRoom.escrowPoolTotalUsd}`);

    // Switch to Kanban Board tab and add a new task
    const kanbanTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Kanban Board'),
    );
    expect(kanbanTab).toBeTruthy();

    act(() => {
      kanbanTab?.click();
    });

    const taskInput = container.querySelector('input[placeholder*="Add squad task"]') as HTMLInputElement;
    expect(taskInput).toBeTruthy();

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(taskInput, 'Verify telemetry packet loss rate');
      taskInput.dispatchEvent(new Event('input', { bubbles: true }));
      taskInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const addTaskBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Add Task'),
    ) as HTMLButtonElement;

    act(() => {
      addTaskBtn.form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Verify telemetry packet loss rate');
  });
});
