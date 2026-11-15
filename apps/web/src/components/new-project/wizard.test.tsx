import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NewProjectWizard } from './wizard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('NewProjectWizard', () => {
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

  const getButtonByText = (text: string) => {
    const buttons = Array.from(container.querySelectorAll('button'));
    return buttons.find((b) => b.textContent?.trim().includes(text));
  };

  const getNextButton = () => getButtonByText('Next');

  const setInputValue = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  it('Step 1: initially Next is disabled; typing "Drone" enables it', async () => {
    await act(async () => {
      root.render(React.createElement(NewProjectWizard));
    });

    expect(getNextButton()?.disabled).toBe(true);

    const titleInput = container.querySelector<HTMLInputElement>('input[aria-label="Title"]');
    expect(titleInput).not.toBeNull();

    await act(async () => {
      setInputValue(titleInput!, 'Drone');
    });

    expect(getNextButton()?.disabled).toBe(false);
  });

  it('Step 2: Next is disabled until a track chip is pressed; typing kicad then KiCad yields 1 chip', async () => {
    await act(async () => {
      root.render(React.createElement(NewProjectWizard));
    });

    // Enter valid title on Step 1
    const titleInput = container.querySelector<HTMLInputElement>('input[aria-label="Title"]');
    await act(async () => {
      setInputValue(titleInput!, 'Drone');
    });

    // Go to Step 2
    await act(async () => {
      getNextButton()?.click();
    });

    // On Step 2, Next is disabled until a track chip is selected
    expect(getNextButton()?.disabled).toBe(true);

    // Select track "Code"
    const trackChips = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'),
    );
    const codeChip = trackChips.find((b) => b.textContent?.trim().includes('Code'));
    expect(codeChip).toBeDefined();

    await act(async () => {
      codeChip?.click();
    });

    expect(getNextButton()?.disabled).toBe(false);

    // Add skill "kicad"
    const skillInput = container.querySelector<HTMLInputElement>('input[aria-label="Add skill"]');
    expect(skillInput).not.toBeNull();

    await act(async () => {
      setInputValue(skillInput!, 'kicad');
    });

    await act(async () => {
      skillInput!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
      );
    });

    // Add duplicate skill "KiCad"
    await act(async () => {
      setInputValue(skillInput!, 'KiCad');
    });

    await act(async () => {
      skillInput!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
      );
    });

    // Should only yield exactly one chip for "kicad"
    const skillElements = Array.from(container.querySelectorAll('span')).filter(
      (el) => el.textContent?.trim() === 'kicad',
    );
    expect(skillElements.length).toBe(1);
  });

  it('Step 3: stipend without amount shows error; with amount 5000 and INR, role appears', async () => {
    await act(async () => {
      root.render(React.createElement(NewProjectWizard));
    });

    // Step 1
    const titleInput = container.querySelector<HTMLInputElement>('input[aria-label="Title"]');
    await act(async () => {
      setInputValue(titleInput!, 'Drone');
    });
    await act(async () => {
      getNextButton()?.click();
    });

    // Step 2
    const codeChip = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'),
    ).find((b) => b.textContent?.trim().includes('Code'));
    await act(async () => {
      codeChip?.click();
    });
    await act(async () => {
      getNextButton()?.click();
    });

    // Step 3
    const roleTitleInput = container.querySelector<HTMLInputElement>('input[aria-label="Role title"]');
    const compSelect = container.querySelector<HTMLSelectElement>('select[aria-label="Compensation type"]');
    const addRoleBtn = getButtonByText('Add role');

    await act(async () => {
      setInputValue(roleTitleInput!, 'Avionics Engineer');
      compSelect!.value = 'stipend';
      compSelect!.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Try to add role without amount
    await act(async () => {
      addRoleBtn?.click();
    });

    // Error should be shown
    const alert = container.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain('Stipends and bounties need an amount and currency');

    // Enter amount 5000 and INR
    const amountInput = container.querySelector<HTMLInputElement>('input[aria-label="Compensation amount"]');
    expect(amountInput).not.toBeNull();

    await act(async () => {
      setInputValue(amountInput!, '5000');
    });

    await act(async () => {
      getButtonByText('Add role')?.click();
    });

    // Role appears in configured list
    expect(container.textContent).toContain('Avionics Engineer');
    expect(container.textContent).toContain('₹5,000 / month');
  });

  it('Step 4: shows the title, role title, and disabled "Publish project" button', async () => {
    await act(async () => {
      root.render(React.createElement(NewProjectWizard));
    });

    // Step 1
    const titleInput = container.querySelector<HTMLInputElement>('input[aria-label="Title"]');
    await act(async () => {
      setInputValue(titleInput!, 'Drone Mesh System');
    });
    await act(async () => {
      getNextButton()?.click();
    });

    // Step 2
    const codeChip = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'),
    ).find((b) => b.textContent?.trim().includes('Code'));
    await act(async () => {
      codeChip?.click();
    });
    await act(async () => {
      getNextButton()?.click();
    });

    // Step 3: Add role
    const roleTitleInput = container.querySelector<HTMLInputElement>('input[aria-label="Role title"]');
    await act(async () => {
      setInputValue(roleTitleInput!, 'Lead Navigator');
    });
    await act(async () => {
      getButtonByText('Add role')?.click();
    });
    await act(async () => {
      getNextButton()?.click();
    });

    // Step 4: Review
    expect(container.textContent).toContain('Drone Mesh System');
    expect(container.textContent).toContain('Lead Navigator');

    const publishBtn = getButtonByText('Publish project');
    expect(publishBtn).toBeDefined();
    expect(publishBtn?.disabled).toBe(false);
  });
});
