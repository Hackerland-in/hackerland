import { useSyncExternalStore } from 'react';

const CHANGE_EVENT = 'hackerland:storage';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Subscribes to a localStorage entry. Returns `null` on the server and during
 * hydration, then the stored string; re-renders on writeStoredValue() and on
 * changes from other tabs.
 */
export function useStoredValue(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
}

/** Writes a localStorage entry and notifies useStoredValue subscribers. Returns false if storage is unavailable. */
export function writeStoredValue(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}
