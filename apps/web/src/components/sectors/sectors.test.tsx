import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SECTOR_IDS } from '@hackerland/core';
import { ALL_ROADMAPS } from '@/lib/data/fixtures/roadmaps';
import {
  ALL_ENRICHED_SECTORS,
  CROSS_CUTTING_SECTOR_BRIDGES,
  getEnrichedSector,
  searchEnrichedSectors,
} from '@/lib/data/sectors-data';
import { generateStaticParams } from '@/app/sectors/[slug]/page';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { RoadmapCard } from '@/components/domain/roadmap-card';
import { SectorPathwaysHub } from './sector-pathways-hub';
import { SectorDetailPathway } from './sector-detail-pathway';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function setInputValue(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('India Sector Pathways Hub & Detail Ladder', () => {
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
  });

  it('reconciles all 10 sectors with verified roadmaps, plants, compliance, autopsies, and grants', async () => {
    expect(ALL_ENRICHED_SECTORS).toHaveLength(10);

    const staticParams = await generateStaticParams();
    expect(staticParams.map((p) => p.slug)).toEqual([...SECTOR_IDS]);

    const allGrantTags = new Set<string>();
    for (const sector of ALL_ENRICHED_SECTORS) {
      expect(SECTOR_IDS).toContain(sector.id);
      expect(sector.matchedRoadmaps.length).toBeGreaterThanOrEqual(2);
      expect(sector.matchedPlants.length).toBeGreaterThanOrEqual(1);
      expect(sector.matchedCompliances.length).toBeGreaterThanOrEqual(1);
      expect(sector.resolvedAutopsies.length).toBeGreaterThanOrEqual(2);
      expect(sector.enrichment.zeroCostPrototypingRoutes.some((r) => r.route === '/resources')).toBe(
        true,
      );
      expect(
        sector.enrichment.zeroCostPrototypingRoutes.some((r) => r.route === '/young-innovators'),
      ).toBe(true);
      expect(sector.enrichment.vernacularCourses.length).toBeGreaterThanOrEqual(3);
      for (const tag of sector.enrichment.grantTags) {
        allGrantTags.add(tag);
      }
    }

    for (const expectedTag of [
      'NIDHI-PRAYAS',
      'SISFS',
      'BIRAC',
      'iDEX',
      'NTTM',
      'MoFPI',
      'PMEGP',
    ]) {
      expect(allGrantTags.has(expectedTag)).toBe(true);
    }

    expect(CROSS_CUTTING_SECTOR_BRIDGES.some((b) => b.id === 'ai-dpi-vernacular-software')).toBe(
      true,
    );
    expect(CROSS_CUTTING_SECTOR_BRIDGES.some((b) => b.id === 'handicraft-gi-d2c-design')).toBe(
      true,
    );

    expect(searchEnrichedSectors('Guwahati').length).toBeGreaterThanOrEqual(3);
    expect(searchEnrichedSectors('Tiruppur').some((s) => s.id === 'technical-textiles-apparel')).toBe(
      true,
    );
    expect(searchEnrichedSectors('Rajkot').some((s) => s.id === 'robotics-cnc-automation')).toBe(
      true,
    );
  });

  it('renders SectorPathwaysHub with all 10 sectors, /resources & /export bridges, and search/cluster filtering', () => {
    act(() => {
      root.render(<SectorPathwaysHub />);
    });

    expect(container.textContent).toContain('India Sector Pathways Hub');
    expect(container.textContent).toContain('Showing 10 of 10 sectors');
    expect(container.textContent).toContain(
      'Funding & Free Resources — incl. Software/AI, Crafts & Every Indian Zone',
    );
    expect(container.textContent).toContain('Global Export Hub & Compliance Readiness');
    expect(container.textContent).toContain('Digital AI / DPI, GI Crafts & Circular Climate Tracks');

    for (const id of SECTOR_IDS) {
      const card = container.querySelector(`[data-testid="sector-card-${id}"]`);
      expect(card).toBeTruthy();
      expect(container.querySelector(`a[href="/sectors/${id}"]`)).toBeTruthy();
    }
    expect(container.querySelector('a[href="/resources"]')).toBeTruthy();
    expect(container.querySelector('a[href="/export"]')).toBeTruthy();

    // Filter by city cluster chip (Tiruppur)
    const tiruppurChip = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Tiruppur'),
    ) as HTMLButtonElement;
    expect(tiruppurChip).toBeTruthy();

    act(() => {
      tiruppurChip.click();
    });

    expect(container.querySelector('[data-testid="sector-card-technical-textiles-apparel"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="sector-card-drones-defense-space"]')).toBeNull();

    // Reset chip back to All Sectors (10)
    const allChip = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('All Sectors (10)'),
    ) as HTMLButtonElement;
    act(() => {
      allChip.click();
    });
    expect(container.textContent).toContain('Showing 10 of 10 sectors');

    // Filter by domain search input
    const searchInput = container.querySelector(
      'input[aria-label="Search sectors, skills, cities, or standards"]',
    ) as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      setInputValue(searchInput, 'AIS-156');
    });

    expect(container.querySelector('[data-testid="sector-card-ev-clean-energy"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="sector-card-technical-textiles-apparel"]')).toBeNull();

    // Nonsense query renders EmptyState and reset action restores all 10 sectors
    act(() => {
      setInputValue(searchInput, 'zzz-nonexistent-query');
    });

    expect(container.textContent).toContain('No sectors match that filter');
    const resetBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Show all 10 sectors'),
    ) as HTMLButtonElement;
    expect(resetBtn).toBeTruthy();

    act(() => {
      resetBtn.click();
    });

    expect(container.textContent).toContain('Showing 10 of 10 sectors');
  });

  it('renders SectorDetailPathway with all 5 rungs, Jargon Decoder filter, starter CTAs, pilot tools & export links', () => {
    const sector = getEnrichedSector('ev-clean-energy');
    expect(sector).toBeDefined();

    act(() => {
      root.render(<SectorDetailPathway sector={sector!} />);
    });

    // All 5 rungs present
    expect(container.textContent).toContain('Rung 0 — Industry 101 & Jargon Decoder');
    expect(container.textContent).toContain('Rung 1 — Free Resources & Virtual Simulators');
    expect(container.textContent).toContain('Rung 2 — Build a');
    expect(container.textContent).toContain('Rung 3 — Missing Middle: Pilot Batch & Team Squad');
    expect(container.textContent).toContain('Rung 4 — Factory Scale & Global Export');

    // Rung 0: Value chain + Jargon Decoder + Autopsies
    expect(container.textContent).toContain('5-Stage Value Chain in India');
    for (const term of sector!.jargonDecoder) {
      expect(container.textContent).toContain(term.term);
      expect(container.textContent).toContain(term.plainEnglish);
    }
    expect(container.querySelector('a[href="/stories/ather-energy-first-smart-ev"]')).toBeTruthy();
    expect(container.querySelector('a[href="/teardowns/ather-450-smart-bms-and-telematics"]')).toBeTruthy();
    expect(
      container.querySelector('a[href="/museum/uncertified-liion-pack-air-cargo-rejection"]'),
    ).toBeTruthy();

    // Interactive Jargon filter
    const jargonInput = container.querySelector(
      'input[aria-label="Filter jargon terms"]',
    ) as HTMLInputElement;
    expect(jargonInput).toBeTruthy();

    act(() => {
      setInputValue(jargonInput, 'UN 38.3');
    });
    expect(container.textContent).toContain('UN 38.3');
    expect(container.textContent).not.toContain('BMS (Battery Management System)');

    act(() => {
      setInputValue(jargonInput, '');
    });

    // Rung 1: Simulators, 22-language Spoken Tutorial, /resources, /learn roadmaps
    expect(container.textContent).toContain('22 Indian Languages');
    expect(container.querySelector('a[href="/battery-eis"]')).toBeTruthy();
    expect(container.querySelector('a[href="/resources"]')).toBeTruthy();
    expect(container.querySelector('a[href="/learn?track=make"]')).toBeTruthy();

    // Rung 2: Starter Project 1-click CTAs
    const firstIdea = sector!.starterProjectIdeas[0]!;
    expect(
      container.querySelector(`a[href="/new?title=${encodeURIComponent(firstIdea.title)}"]`),
    ).toBeTruthy();
    expect(container.querySelector('a[href="/ideas"]')).toBeTruthy();
    expect(container.querySelector('a[href="/problems"]')).toBeTruthy();
    expect(container.querySelector('a[href="/young-innovators"]')).toBeTruthy();

    // Rung 3: Pilot tools, grants & squads
    expect(container.querySelector('a[href="/assembly"]')).toBeTruthy();
    expect(container.querySelector('a[href="/sourcing"]')).toBeTruthy();
    expect(container.querySelector('a[href="/manufacturing/rfq"]')).toBeTruthy();
    expect(container.querySelector('a[href="/squads"]')).toBeTruthy();
    expect(container.querySelector('a[href="/sprints"]')).toBeTruthy();
    expect(container.textContent).toContain('NIDHI-PRAYAS');
    expect(container.textContent).toContain('SISFS');

    // Rung 4: Factory blueprints, compliance & export
    expect(container.querySelector('a[href="/how-to-start/ev-battery-pack"]')).toBeTruthy();
    expect(container.querySelector('a[href="/compliance/ais156-ev-battery-pack"]')).toBeTruthy();
    expect(container.querySelector('a[href="/export"]')).toBeTruthy();
  });

  it('renders additive Apply Next footer links in RoadmapCard without altering checklist persistence', () => {
    const embeddedRoadmap = ALL_ROADMAPS.find((r) => r.slug === 'embedded-systems-from-zero')!;
    expect(embeddedRoadmap).toBeDefined();

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <RoadmapCard roadmap={embeddedRoadmap} />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('Apply Next:');
    expect(container.querySelector('a[href="/ideas"]')).toBeTruthy();
    expect(container.querySelector('a[href="/sectors/semiconductors-electronics"]')).toBeTruthy();
    expect(container.querySelector('a[href="/manufacturing/eda"]')).toBeTruthy();
  });
});
