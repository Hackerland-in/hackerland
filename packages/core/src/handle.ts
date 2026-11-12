import { z } from 'zod';

/** Public profile handle: 3–30 chars, lowercase letters, digits and inner hyphens. */
export const handleSchema = z
  .string()
  .transform((value) => value.toLowerCase())
  .pipe(z.string().regex(/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/));
