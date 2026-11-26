import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ALL_OPPORTUNITIES } from '@/lib/data/fixtures/opportunities';
import { SPRINTS_CATALOG } from '@/lib/data/sprints-data';
import { SocialCommunityProvider } from './social-context';
import { OpportunitiesTabs } from './opportunities-tabs';
import { OpportunityCard } from '@/components/domain/opportunity-card';
import { JobsStudio } from '@/components/jobs/jobs-studio';
import { LaunchpadStudio } from '@/components/launchpad/launchpad-studio';
import { SprintCatalog } from '@/components/sprints/sprint-catalog';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/jobs',
}));

describe('Feature #4: Bounties, 48H Sprints, Jobs & Launchpad Social UI', () => {
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

  it('renders OpportunitiesTabs with ecosystem links and highlights active pathname', () => {
    act(() => {
      root.render(<OpportunitiesTabs />);
    });

    expect(container.textContent).toContain('Bounties & Grants');
    expect(container.textContent).toContain('48H Sprints');
    expect(container.textContent).toContain('Jobs & Fellowships');
    expect(container.textContent).toContain('Launchpad');

    const activeLink = container.querySelector('a[aria-current="page"]') as HTMLAnchorElement;
    expect(activeLink).toBeTruthy();
    expect(activeLink.getAttribute('href')).toBe('/jobs');
  });

  it('persists OpportunityCard bookmark state in SocialCommunityProvider', () => {
    const opp = ALL_OPPORTUNITIES[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <OpportunityCard opportunity={opp} />
        </SocialCommunityProvider>,
      );
    });

    const saveBtn = container.querySelector(
      `button[aria-label="Save ${opp.title}"]`,
    ) as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();
    expect(saveBtn.getAttribute('aria-pressed')).toBe('false');

    act(() => {
      saveBtn.click();
    });

    expect(saveBtn.getAttribute('aria-pressed')).toBe('true');
    const saved = JSON.parse(localStorage.getItem('hackerland_saved_items') || '[]');
    expect(saved).toContain(`opp:${opp.id}`);
  });

  it('persists bookmark state across SprintCatalog, JobsStudio, and LaunchpadStudio', () => {
    const firstSprint = SPRINTS_CATALOG[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <SprintCatalog initialSprints={SPRINTS_CATALOG} />
          <JobsStudio />
          <LaunchpadStudio />
        </SocialCommunityProvider>,
      );
    });

    const sprintSave = container.querySelector(
      `button[aria-label="Save ${firstSprint.title}"]`,
    ) as HTMLButtonElement;
    expect(sprintSave).toBeTruthy();

    act(() => {
      sprintSave.click();
    });

    const saved = JSON.parse(localStorage.getItem('hackerland_saved_items') || '[]');
    expect(saved).toContain(`sprint:${firstSprint.slug}`);
  });
});
