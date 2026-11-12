import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { SHADOW_TOKENS, TYPE_SCALE } from './tokens';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [...TYPE_SCALE],
      shadow: [...SHADOW_TOKENS],
    },
  },
});

/** Joins class names and resolves Tailwind conflicts, aware of Hackerland tokens. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
