'use client';

import { Button } from '@hackerland/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="font-mono text-label-sm uppercase tracking-widest text-danger mb-2">
        System fault
      </div>
      <h1 className="font-display text-display-hero-mobile md:text-headline-xl font-bold text-fg mb-4">
        Something broke in the lab
      </h1>
      <p className="max-w-md text-body-md text-fg-muted mb-8">
        An unexpected telemetry exception occurred while executing this routine. Diagnostic trace: {error.message || 'Unknown error'}.
      </p>
      <Button onClick={reset} variant="primary">
        Retry execution
      </Button>
    </main>
  );
}
