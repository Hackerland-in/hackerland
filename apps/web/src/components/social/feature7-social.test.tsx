import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SocialCommunityProvider } from './social-context';
import { SettingsStudio } from './settings-studio';
import { PassportStudio } from './passport-studio';
import { LaunchKit } from '@/components/launch/launch-kit';
import { AuthForm } from '@/components/auth/auth-form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/settings',
  useSearchParams: () => new URLSearchParams(),
}));

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function setInputValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Feature #7: Auth, Settings, Innovation Passport & Launch Kit', () => {
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

  it('saves SettingsStudio profile + collaboration prefs synchronously to localStorage', () => {
    act(() => {
      root.render(
        <SocialCommunityProvider>
          <SettingsStudio />
        </SocialCommunityProvider>,
      );
    });

    const handleInput = container.querySelector('#settings-handle') as HTMLInputElement;
    const nameInput = container.querySelector('#settings-name') as HTMLInputElement;
    const headlineInput = container.querySelector('#settings-headline') as HTMLInputElement;
    const bioInput = container.querySelector('#settings-bio') as HTMLTextAreaElement;

    act(() => {
      setInputValue(handleInput, 'meera-robotics');
      setInputValue(nameInput, 'Dr. Meera Iyer');
      setInputValue(headlineInput, 'Autonomous Flight Systems Lead');
      setInputValue(bioInput, 'Building PX4 sensor fusion and SiC BMS controllers in Pune.');
    });

    const form = container.querySelector('form')!;
    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Profile updated successfully');
    const savedProfile = JSON.parse(localStorage.getItem('hackerland_user_profile') || '{}');
    expect(savedProfile.handle).toBe('meera-robotics');
    expect(savedProfile.displayName).toBe('Dr. Meera Iyer');
  });

  it('verifies credential hash and toggles visibility in PassportStudio', () => {
    localStorage.setItem(
      'hackerland_user_profile',
      JSON.stringify({ handle: 'arjun-silicon', displayName: 'Arjun Menon' }),
    );

    act(() => {
      root.render(
        <SocialCommunityProvider>
          <PassportStudio />
        </SocialCommunityProvider>,
      );
    });

    expect(container.textContent).toContain('Arjun Menon');
    expect(container.textContent).toContain('@arjun-silicon');

    const verifyBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Verify Credential Signature'),
    );
    expect(verifyBtn).toBeTruthy();
    act(() => {
      verifyBtn!.click();
    });

    expect(container.textContent).toContain('HL-SIG-2026-');

    const visBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Public Passport'),
    );
    expect(visBtn).toBeTruthy();
    act(() => {
      visBtn!.click();
    });
    expect(container.textContent).toContain('Private Passport');
    expect(localStorage.getItem('hackerland_passport_public')).toBe('false');
  });

  it('customizes launch copy live and persists launched channels in LaunchKit', () => {
    act(() => {
      root.render(<LaunchKit />);
    });

    const nameInput = container.querySelector('#launch-project-name') as HTMLInputElement;
    act(() => {
      setInputValue(nameInput, 'Aeroglide V2');
    });

    expect(container.textContent).toContain('Show HN: Aeroglide V2');

    const markBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Mark Launched'),
    );
    expect(markBtn).toBeTruthy();
    act(() => {
      markBtn!.click();
    });

    expect(container.textContent).toContain('1 / 4 channels marked launched');
    const launched = JSON.parse(localStorage.getItem('hackerland_launch_channels') || '[]');
    expect(launched.length).toBe(1);
  });

  it('renders AuthForm guest exploration links when sign-in is unconfigured', () => {
    act(() => {
      root.render(<AuthForm mode="sign-in" configured={false} providers={['github', 'google']} />);
    });

    const notice = container.querySelector('[aria-label="Deployment notice"]');
    expect(notice).toBeTruthy();
    expect(notice?.textContent).toContain('Explore Community Feed');
    expect(notice?.textContent).toContain('Try Local Onboarding');
  });
});
