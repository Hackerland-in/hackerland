import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IndiaResourcesHub } from './india-resources-hub';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Pan-India Funding, Prototyping & Free Resources Hub', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('filters across all Indian zones and switches cleanly between sectors, funding, prototyping and free learning tabs', () => {
    act(() => {
      root.render(<IndiaResourcesHub />);
    });

    expect(container.textContent).toContain('Pan-India Funding, Prototyping Labs & Free Builder Resources');
    expect(container.textContent).toContain('Technical Textiles');
    expect(container.textContent).toContain('Open AI, Voice Models');

    // Filter to North-East zone
    const neChip = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('North-East'),
    );
    expect(neChip).toBeTruthy();
    act(() => {
      neChip?.click();
    });
    expect(container.textContent).toContain('UNNATI North-East Industrial Incentive Scheme');

    // Reset zone and inspect Funding tab + No Company filter
    const allChip = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'All India',
    );
    act(() => {
      allChip?.click();
    });

    const fundingTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Funding & Grants'),
    );
    act(() => {
      fundingTab?.click();
    });
    expect(container.textContent).toContain('DST NIDHI-PRAYAS Prototype Grant');
    expect(container.textContent).toContain('Startup India Seed Fund Scheme');

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    act(() => {
      checkbox.click();
    });
    expect(container.textContent).toContain('DST NIDHI-PRAYAS Prototype Grant');
    expect(container.textContent).not.toContain('Startup India Seed Fund Scheme');

    // Prototyping & Free Learning tabs
    const protoTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Free Prototyping Access'),
    );
    act(() => {
      protoTab?.click();
    });
    expect(container.textContent).toContain('I-STEM National Shared Scientific Lab Portal');

    const libTab = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Free Learning & Tools'),
    );
    act(() => {
      libTab?.click();
    });
    expect(container.textContent).toContain('IIT Bombay Spoken Tutorial');
  });
});
