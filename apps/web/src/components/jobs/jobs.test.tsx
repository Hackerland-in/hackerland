import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JobsStudio } from './jobs-studio';
import { JobDetailView } from './job-detail-view';
import { HARDWARE_JOBS_REGISTRY } from '@/lib/data/jobs-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('JobsStudio Component', () => {
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

  it('renders jobs directory and header stats', () => {
    act(() => {
      root.render(<JobsStudio />);
    });

    expect(container.textContent).toContain('Deep-Tech Hardware Jobs & Fellowships');
    expect(container.textContent).toContain('AVG LEAD PACKAGE');
    expect(container.textContent).toContain('FELLOWSHIP STIPEND');
    expect(container.textContent).toContain('Proof-of-Work Skill Matcher');
    expect(container.textContent).toContain('Lead Battery Management System (BMS) Firmware Engineer');
  });

  it('toggles interactive skill matcher and calculates match score', () => {
    act(() => {
      root.render(<JobsStudio />);
    });

    const toggleBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Match My Skills to Roles')
    );
    expect(toggleBtn).toBeTruthy();

    act(() => {
      toggleBtn?.click();
    });

    expect(container.textContent).toContain('Select or add your technical proficiencies');
    expect(container.textContent).toContain('FreeRTOS');
    expect(container.textContent).toContain('CAN Bus');
  });
});

describe('JobDetailView Component', () => {
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

  it('renders job detail view, lab equipment, and submits proof-of-work application', () => {
    const job = HARDWARE_JOBS_REGISTRY[0]!;

    act(() => {
      root.render(<JobDetailView job={job} />);
    });

    expect(container.textContent).toContain(job.title);
    expect(container.textContent).toContain('Key Engineering Responsibilities');
    expect(container.textContent).toContain('Physical Lab Benches & Test Equipment');
    expect(container.textContent).toContain('Proof-of-Work Application Standard');
    expect(container.textContent).toContain('Apply with Proof-of-Work');

    // Submit application form
    const form = container.querySelector('form');
    expect(form).toBeTruthy();

    act(() => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Application Received!');
  });
});
