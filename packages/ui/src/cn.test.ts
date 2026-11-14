import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('treats custom type-scale tokens as font sizes, not colours', () => {
    const result = cn('text-body-md text-fg', 'text-label-sm').split(' ');
    expect(result).toContain('text-fg');
    expect(result).toContain('text-label-sm');
    expect(result).not.toContain('text-body-md');
  });

  it('lets later utilities win and drops falsy values', () => {
    expect(cn('px-2', false, 'px-4')).toBe('px-4');
  });

  it('merges custom shadow tokens', () => {
    expect(cn('shadow-module', 'shadow-glow-accent')).toBe('shadow-glow-accent');
  });
});
