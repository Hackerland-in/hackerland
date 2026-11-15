import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EscrowMilestoneStepper } from './escrow-milestone-stepper';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('EscrowMilestoneStepper', () => {
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

  it('correctly calculates 40% and 60% escrow splits for INR amounts', () => {
    act(() => {
      root.render(<EscrowMilestoneStepper totalAmount={50000} currency="INR" />);
    });

    expect(container.textContent).toContain('2-Stage Escrow Protection');
    expect(container.textContent).toContain('100% Funds Secured');

    const m1Card = container.querySelector('[data-testid="milestone-1-card"]');
    const m2Card = container.querySelector('[data-testid="milestone-2-card"]');

    expect(m1Card?.textContent).toContain('Stage 1 • 40% Advance');
    expect(m1Card?.textContent).toContain('20,000');

    expect(m2Card?.textContent).toContain('Stage 2 • 60% Completion');
    expect(m2Card?.textContent).toContain('30,000');
  });

  it('handles odd numbers without rounding discrepancies', () => {
    act(() => {
      root.render(<EscrowMilestoneStepper totalAmount={25000} currency="INR" />);
    });

    const m1Card = container.querySelector('[data-testid="milestone-1-card"]');
    const m2Card = container.querySelector('[data-testid="milestone-2-card"]');

    expect(m1Card?.textContent).toContain('10,000');
    expect(m2Card?.textContent).toContain('15,000');
  });

  it('renders approved and released badges when stage progresses', () => {
    act(() => {
      root.render(<EscrowMilestoneStepper totalAmount={10000} stage="milestone_1_approved" />);
    });
    expect(container.textContent).toContain('Approved');

    act(() => {
      root.render(<EscrowMilestoneStepper totalAmount={10000} stage="milestone_2_released" />);
    });
    expect(container.textContent).toContain('Released');
  });
});
