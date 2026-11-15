import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserNav } from './user-nav';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const mockUseSession = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: () => mockUseSession(),
    signOut: vi.fn(),
  },
}));

describe('UserNav Component', () => {
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
    vi.clearAllMocks();
  });

  it('renders Sign in and Sign up buttons when user is not logged in', () => {
    mockUseSession.mockReturnValue({ data: null, isPending: false });

    act(() => {
      root.render(<UserNav />);
    });

    expect(container.textContent).toContain('Sign in');
    expect(container.textContent).toContain('Sign up');
  });

  it('renders user avatar and details when logged in', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user_123',
          name: 'Arya Sharma',
          email: 'arya@example.com',
          image: null,
        },
      },
      isPending: false,
    });

    act(() => {
      root.render(<UserNav />);
    });

    expect(container.textContent).toContain('Arya Sharma');
  });

  it('opens dropdown menu on click with links to Profile, Settings, and Sign Out', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user_123',
          name: 'Arya Sharma',
          email: 'arya@example.com',
          image: null,
        },
      },
      isPending: false,
    });

    act(() => {
      root.render(<UserNav />);
    });

    const triggerBtn = container.querySelector('button');
    expect(triggerBtn).toBeDefined();

    act(() => {
      triggerBtn?.click();
    });

    expect(container.textContent).toContain('My Profile');
    expect(container.textContent).toContain('Profile Settings');
    expect(container.textContent).toContain('Create New Project');
    expect(container.textContent).toContain('Sign Out');
  });
});
