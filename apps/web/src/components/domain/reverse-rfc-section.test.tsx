import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ReverseRFCSection } from './reverse-rfc-section';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('ReverseRFCSection', () => {
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

  it('renders reverse RFC problem statements and domain filters', () => {
    act(() => {
      root.render(<ReverseRFCSection />);
    });

    expect(container.textContent).toContain('Reverse RFCs: Real-World Problem Statements');
    expect(container.textContent).toContain('Clean Water');
    expect(container.textContent).toContain('Low-Cost Arsenic & Fluoride IoT Spectrophotometer');
  });

  it('filters RFC items when a domain button is clicked', () => {
    act(() => {
      root.render(<ReverseRFCSection />);
    });

    const buttons = Array.from(container.querySelectorAll('button'));
    const soilButton = buttons.find((b) => b.textContent?.trim() === 'Soil Telemetry');
    expect(soilButton).toBeDefined();

    act(() => {
      soilButton?.click();
    });

    expect(container.textContent).toContain('Sub-₹500 LoRaWAN NPK Optical Soil Sensor Node');
    expect(container.textContent).not.toContain('Low-Cost Arsenic & Fluoride IoT Spectrophotometer');
  });

  it('increments and toggles upvote count on click', () => {
    act(() => {
      root.render(<ReverseRFCSection />);
    });

    const upvoteButton = container.querySelector(
      'button[aria-label="Upvote Low-Cost Arsenic & Fluoride IoT Spectrophotometer"]'
    ) as HTMLButtonElement;

    expect(upvoteButton).toBeDefined();
    expect(upvoteButton.textContent).toContain('34');

    act(() => {
      upvoteButton.click();
    });
    expect(upvoteButton.textContent).toContain('35');

    act(() => {
      upvoteButton.click();
    });
    expect(upvoteButton.textContent).toContain('34');
  });
});
