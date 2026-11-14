const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

/**
 * Formats an ISO date string to e.g. "12 Nov 2026" using Asia/Kolkata timezone.
 */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}
