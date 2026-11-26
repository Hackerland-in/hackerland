'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@hackerland/ui';

export type Theme = 'light' | 'dark';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'labeled';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('hackerland-theme');
  return saved === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export function ThemeToggle({ className, variant = 'icon' }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? 'light' : 'dark';
    try {
      localStorage.setItem('hackerland-theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      document.documentElement.classList.toggle('light', nextTheme === 'light');
      window.dispatchEvent(new Event('storage'));
    } catch {
      // LocalStorage might be restricted in sandboxes
    }
  };

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Current mode: ${isDark ? 'Midnight Pink (Dark)' : 'White & Pink (Light)'}. Click to switch.`}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1 px-4 py-1.5 text-body-sm font-display font-medium text-fg-muted transition-colors hover:border-accent/40 hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-xs',
          className,
        )}
      >
        {isDark ? (
          <>
            <Moon className="h-4 w-4 text-accent-fg" aria-hidden="true" />
            <span>Midnight Dark</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>White & Pink</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to White theme' : 'Switch to Dark theme'}
      aria-label={isDark ? 'Switch to White theme' : 'Switch to Dark theme'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-surface-1 text-fg-muted transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-accent-fg transition-transform hover:scale-110" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:scale-110" aria-hidden="true" />
      )}
    </button>
  );
}
