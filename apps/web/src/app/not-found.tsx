import Link from 'next/link';
import { Button } from '@hackerland/ui';

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="font-mono text-label-sm uppercase tracking-widest text-accent mb-2">
        Error 404
      </div>
      <h1 className="font-display text-display-hero-mobile md:text-headline-xl font-bold text-fg mb-4">
        Signal lost: page not found
      </h1>
      <p className="max-w-md text-body-md text-fg-muted mb-8">
        The coordinates you dialed do not resolve to an active telemetry node, project, or innovator profile on the Hackerland mesh.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild variant="primary">
          <Link href="/feed">Explore feed</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Back to mission control</Link>
        </Button>
      </div>
    </main>
  );
}
