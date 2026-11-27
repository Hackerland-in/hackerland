'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { cn } from '@hackerland/ui';
import { useVenture, type VentureStageNumber } from './venture-context';

const JOURNEY_STEPS: Array<{
  step: VentureStageNumber;
  label: string;
  href: string;
}> = [
  { step: 1, label: 'Ideate', href: '/ideas' },
  { step: 2, label: 'Learn & Sectors', href: '/sectors' },
  { step: 3, label: 'Squad & Funding', href: '/squads' },
  { step: 4, label: 'Build & Fab', href: '/manufacturing' },
  { step: 5, label: 'Certify & Export', href: '/export' },
];

export function ActiveBuildJourneyBar() {
  const pathname = usePathname();
  const { activeVenture } = useVenture();

  // On / we already display the rich interactive IndiaJourneyHero above the fold
  if (pathname === '/') return null;

  const currentStage = activeVenture?.currentStage ?? 1;
  const nextStep =
    JOURNEY_STEPS.find((s) => s.step === currentStage) ?? JOURNEY_STEPS[0]!;

  return (
    <div
      aria-label="Active Build Journey Stepper"
      className="rounded-2xl border border-hairline bg-surface-1 px-3.5 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-body-xs"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[10px] font-bold text-accent-fg shrink-0">
          <Compass className="size-3" aria-hidden="true" />
          <span>BUILD PATH</span>
        </span>
        <span className="truncate font-display font-semibold text-fg max-w-[200px] sm:max-w-xs">
          {activeVenture?.title ?? 'Your India Build Journey'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {JOURNEY_STEPS.map((st) => {
          const isCurrent = pathname.startsWith(st.href);
          const isReached = currentStage > st.step;
          return (
            <Link
              key={st.step}
              href={st.href}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-display font-medium transition-colors border',
                isCurrent
                  ? 'border-accent bg-accent text-on-solid font-semibold'
                  : isReached
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
                    : 'border-hairline bg-sunken text-fg-muted hover:text-fg hover:border-accent/40',
              )}
            >
              {isReached && !isCurrent && (
                <CheckCircle2 className="size-3 shrink-0" aria-hidden="true" />
              )}
              <span>
                {st.step}. {st.label}
              </span>
            </Link>
          );
        })}

        <Link
          href="/resources"
          className="ml-1 inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent-soft px-2.5 py-1 text-[11px] font-display font-semibold text-accent-fg hover:bg-accent hover:text-on-solid transition-colors"
        >
          <span>Grants &amp; Labs</span>
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
        <span className="sr-only">Next milestone: {nextStep.label}</span>
      </div>
    </div>
  );
}
