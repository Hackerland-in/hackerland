import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * `false` during server rendering and hydration, `true` afterwards.
 * Replaces the `useEffect(() => setMounted(true), [])` pattern without a
 * cascading re-render (react-hooks/set-state-in-effect).
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
