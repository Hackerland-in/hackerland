/**
 * Returns `input` narrowed to a member of `values`, or `undefined` when it is
 * not a string member. Used to parse untrusted query params safely.
 */
export function parseEnum<T extends readonly string[]>(
  values: T,
  input: unknown,
): T[number] | undefined {
  return typeof input === 'string' && (values as readonly string[]).includes(input)
    ? (input as T[number])
    : undefined;
}
