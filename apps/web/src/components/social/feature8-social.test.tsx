import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { listObservatoryItems } from '@/lib/data/observatory-data';
import { SocialCommunityProvider } from './social-context';
import { TechRadarView } from '@/components/observatory/tech-radar-view';
import { FailureRiskCalculator } from '@/components/museum/failure-risk-calculator';
import { PrototypeArchitectStudio } from '@/components/prototype/prototype-architect-studio';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Feature #8: Hardware Hubs Interactive Persistence & Rosepaper Controls', () => {
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

  it('toggles saved Observatory Watchlist items inside SocialCommunityProvider', () => {
    const items = listObservatoryItems();
    const first = items[0]!;

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <TechRadarView items={items} />
        </SocialCommunityProvider>,
      );
    });

    const saveBtn = container.querySelector(
      `button[aria-label="Save ${first.title}"]`,
    ) as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();

    act(() => {
      saveBtn.click();
    });

    expect(saveBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('saves hardware pre-mortem snapshots in FailureRiskCalculator', () => {
    act(() => {
      root.render(<FailureRiskCalculator />);
    });

    const saveBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Save Check'),
    );
    expect(saveBtn).toBeTruthy();

    act(() => {
      saveBtn!.click();
    });

    expect(container.textContent).toContain('Saved BOM Pre-Mortem Snapshots (1)');
    const stored = JSON.parse(localStorage.getItem('hackerland_risk_scenarios') || '[]');
    expect(stored.length).toBe(1);
  });

  it('saves and removes hardware blueprints in PrototypeArchitectStudio', () => {
    act(() => {
      root.render(<PrototypeArchitectStudio />);
    });

    const saveBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Save Blueprint'),
    );
    expect(saveBtn).toBeTruthy();

    act(() => {
      saveBtn!.click();
    });

    expect(container.textContent).toContain('Saved Architecture Blueprints (1)');
    const stored = JSON.parse(localStorage.getItem('hackerland_proto_plans') || '[]');
    expect(stored.length).toBe(1);

    const removeBtn = container.querySelector('button[aria-label^="Remove "]') as HTMLButtonElement;
    expect(removeBtn).toBeTruthy();
    act(() => {
      removeBtn.click();
    });

    expect(container.textContent).not.toContain('Saved Architecture Blueprints');
  });
});
