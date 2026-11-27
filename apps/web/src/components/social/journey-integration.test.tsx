import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IndiaJourneyHero } from './india-journey-hero';
import { VentureProvider } from './venture-context';
import { LeftCommunityRail } from './left-community-rail';
import { MainNav } from '@/components/layout/main-nav';
import { NewProjectWizard } from '@/components/new-project/wizard';
import { buildFallbackSquadRoom } from '@/lib/data/queries';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
}));

describe('End-to-End India Ideation-to-Export Journey Integration', () => {
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
    vi.restoreAllMocks();
  });

  it('renders IndiaJourneyHero with interactive 5-stage Ideate -> Learn -> Squad -> Manufacture -> Export explorer', () => {
    act(() => {
      root.render(
        <VentureProvider>
          <IndiaJourneyHero />
        </VentureProvider>,
      );
    });

    expect(container.textContent).toContain('Build from India. Manufacture for the world.');
    expect(container.textContent).toContain('01 · Ideate');
    expect(container.textContent).toContain('05 · Export');
    expect(container.textContent).toContain('Tiruppur · Surat');

    // Click stage 5 Export
    const exportBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('05 · Export'),
    );
    expect(exportBtn).toBeTruthy();
    act(() => {
      exportBtn?.click();
    });
    expect(container.textContent).toContain('Global Export Hub');
    expect(container.innerHTML).toContain('href="/export"');

    // Click stage 2 Learn
    const learnBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('02 · Learn'),
    );
    act(() => {
      learnBtn?.click();
    });
    expect(container.textContent).toContain('Explore 10 Sectors');
    expect(container.innerHTML).toContain('href="/sectors"');
  });

  it('exposes core lifecycle hubs in LeftCommunityRail and MainNav dropdowns', () => {
    act(() => {
      root.render(
        <div>
          <MainNav />
          <LeftCommunityRail />
        </div>,
      );
    });

    expect(container.querySelector('nav[aria-label="Main Navigation"]')).toBeTruthy();
    expect(container.textContent).toContain('All 10 Sectors');
    expect(container.textContent).toContain('Funding & Free Labs');
    expect(container.textContent).toContain('Pilot-to-Plant');
    expect(container.textContent).toContain('Global Export Hub');
    expect(container.innerHTML).toContain('href="/resources"');
    expect(container.innerHTML).toContain('href="/export"');
    expect(container.innerHTML).toContain('href="/sectors"');
  });

  it('prefills NewProjectWizard from initialDraft and builds a fallback Squad Room without 404s', () => {
    act(() => {
      root.render(
        <NewProjectWizard
          initialDraft={{
            title: 'Tiruppur Smart Loom Tension Controller',
            tagline: 'Optical warp break detector for export looms',
            tracks: ['make', 'code'],
            skills: ['esp32', 'textiles'],
          }}
        />,
      );
    });

    const titleInput = container.querySelector('input[aria-label="Title"]') as HTMLInputElement;
    expect(titleInput.value).toBe('Tiruppur Smart Loom Tension Controller');

    const squad = buildFallbackSquadRoom('tiruppur-smart-loom');
    expect(squad.projectSlug).toBe('tiruppur-smart-loom');
    expect(squad.squadMembers.length).toBeGreaterThanOrEqual(2);
    expect(squad.milestones.length).toBeGreaterThan(0);
  });
});
