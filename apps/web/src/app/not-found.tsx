import Link from 'next/link';
import { Button } from '@hackerland/ui';

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 font-display text-label-sm font-semibold text-accent-fg mb-3">
        Error 404
      </div>
      <h1 className="font-display text-display-hero-mobile md:text-headline-xl font-bold text-fg mb-4">
        Signal lost: page not found
      </h1>
      <p className="max-w-md text-body-md text-fg-muted mb-8">
        We couldn&apos;t find that project, builder profile, or discussion thread in the Hackerland community.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="primary">
          <Link href="/feed">Explore feed</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
