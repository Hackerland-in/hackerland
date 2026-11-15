'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@hackerland/ui';

export type Theme = 'dark' | 'light';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'labeled';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('hackerland-theme');
  return saved === 'light' ? 'light' : 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
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
      // Dispatch storage event so all components listening across the app sync immediately
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
        aria-label={`Current mode: ${isDark ? 'Dark (Mission Control)' : 'Day mode (Solar)'}. Click to switch.`}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-hairline bg-surface-1 px-3 py-1.5 text-body-sm font-display font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          className
        )}
      >
        {isDark ? (
          <>
            <Moon className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Night / Dark</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4 text-warning-fg" aria-hidden="true" />
            <span>Day / Solar</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Day mode' : 'Switch to Dark mode'}
      aria-label={isDark ? 'Switch to Day mode' : 'Switch to Dark mode'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface-1 text-fg-muted transition-colors hover:border-accent hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className
      )}
    >
      {isDark ? (
        <Moon className="h-4 w-4 transition-transform hover:scale-110" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4 text-warning-fg transition-transform hover:scale-110" aria-hidden="true" />
      )}
    </button>
  );
}
