import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useIsClient } from './use-is-client';
import { useStoredValue, writeStoredValue } from './use-stored-value';

function ClientFlag() {
  return <span data-testid="flag">{useIsClient() ? 'client' : 'server'}</span>;
}

function Stored({ storageKey }: { storageKey: string }) {
  return <span data-testid="value">{useStoredValue(storageKey) ?? 'none'}</span>;
}

let container: HTMLDivElement;
let root: Root;

const mount = (node: ReactNode) => {
  act(() => {
    root.render(node);
  });
};
const text = (testId: string) =>
  container.querySelector(`[data-testid="${testId}"]`)?.textContent;

beforeEach(() => {
  // @ts-expect-error React's act() environment flag is not in the global types
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

describe('useIsClient', () => {
  it('is false while rendering on the server', () => {
    expect(renderToString(<ClientFlag />)).toContain('server');
  });

  it('is true once rendered in the browser', () => {
    mount(<ClientFlag />);
    expect(text('flag')).toBe('client');
  });
});

describe('useStoredValue', () => {
  it('returns null on the server', () => {
    localStorage.setItem('k', 'v');
    expect(renderToString(<Stored storageKey="k" />)).toContain('none');
  });

  it('reads the current value in the browser', () => {
    localStorage.setItem('k', 'v');
    mount(<Stored storageKey="k" />);
    expect(text('value')).toBe('v');
  });

  it('re-renders after writeStoredValue', () => {
    mount(<Stored storageKey="k" />);
    expect(text('value')).toBe('none');
    act(() => {
      expect(writeStoredValue('k', 'updated')).toBe(true);
    });
    expect(text('value')).toBe('updated');
  });
});
