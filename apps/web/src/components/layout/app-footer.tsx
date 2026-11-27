import Link from 'next/link';
import Image from 'next/image';
import { StatusDot } from '@hackerland/ui';
import { getPlatformStats } from '@/lib/data/queries';
import { ShieldCheck } from 'lucide-react';

export async function AppFooter() {
  const stats = await getPlatformStats();

  return (
    <footer className="w-full border-t border-hairline bg-surface-1 text-body-sm text-fg-subtle pt-12 pb-8">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Section: Brand + Multi-column Links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Hackerland Logo"
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg object-contain"
              />
              <Image
                src="/images/logo2.png"
                alt="Hackerland"
                width={120}
                height={24}
                className="h-6 w-auto object-contain dark:invert dark:brightness-150"
              />
            </Link>
            <p className="text-body-sm text-fg-muted max-w-sm">
              Where makers, engineers, students, and designers build projects in public, team up in squads, and earn through open bounties.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/8 px-3 py-1">
              <StatusDot tone="accent" pulse label="Community active" />
              <span className="font-display text-label-sm font-medium text-accent-fg">
                Open Builder Network
              </span>
            </div>
          </div>

          {/* Col 1: Ideate & Learn */}
          <div className="space-y-3">
            <p className="font-display text-body-sm font-semibold text-fg">
              Ideate &amp; Learn
            </p>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/sectors" className="hover:text-accent-fg transition-colors">
                  All Sectors Pathways
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-accent-fg transition-colors">
                  Funding &amp; Free Resources
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="hover:text-accent-fg transition-colors">
                  IdeaLab &amp; Problems
                </Link>
              </li>
              <li>
                <Link href="/young-innovators" className="hover:text-accent-fg transition-colors">
                  Students &amp; Youth (8–26)
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-accent-fg transition-colors">
                  India Build Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Squads & Grants */}
          <div className="space-y-3">
            <p className="font-display text-body-sm font-semibold text-fg">
              Squads &amp; Grants
            </p>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/projects" className="hover:text-accent-fg transition-colors">
                  Builds &amp; Squads
                </Link>
              </li>
              <li>
                <Link href="/earn" className="hover:text-accent-fg transition-colors">
                  Bounties &amp; Grants
                </Link>
              </li>
              <li>
                <Link href="/sprints" className="hover:text-accent-fg transition-colors">
                  48H Sprints
                </Link>
              </li>
              <li>
                <Link href="/launchpad" className="hover:text-accent-fg transition-colors">
                  Launchpad &amp; Escrow
                </Link>
              </li>
              <li>
                <Link href="/entrepreneurship" className="hover:text-accent-fg transition-colors">
                  Founder Academy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Manufacture & Export */}
          <div className="space-y-3">
            <p className="font-display text-body-sm font-semibold text-fg">
              Manufacture &amp; Export
            </p>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/manufacturing" className="hover:text-accent-fg transition-colors">
                  Hardware Workbench
                </Link>
              </li>
              <li>
                <Link href="/how-to-start" className="hover:text-accent-fg transition-colors">
                  Pilot-to-Plant Guides
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-accent-fg transition-colors">
                  Makerspaces &amp; ATL
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-accent-fg transition-colors">
                  Compliance &amp; Sourcing
                </Link>
              </li>
              <li>
                <Link href="/export" className="hover:text-accent-fg transition-colors font-medium text-accent-fg">
                  Global Export Hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <div className="flex flex-wrap items-center gap-2 text-body-sm text-fg-muted">
            <span className="tabular-nums font-medium">{stats.members.toLocaleString()} members</span>
            <span className="text-line">·</span>
            <span className="tabular-nums font-medium">{stats.projects} builds</span>
            <span className="text-line">·</span>
            <span className="tabular-nums font-medium">{stats.openOpportunities} open bounties</span>
          </div>

          <div className="flex items-center gap-3 text-body-sm">
            <Link
              href="/design-system"
              className="text-fg-subtle hover:text-accent-fg transition-colors"
            >
              Design System
            </Link>
            <span className="text-line">·</span>
            <Link
              href="/moderation"
              className="inline-flex items-center gap-1 text-fg-subtle hover:text-fg transition-colors"
            >
              <ShieldCheck className="size-3.5 text-earn" />
              <span>DPDP Safety</span>
            </Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline/60 pt-6 text-[13px] text-fg-subtle">
          <span>Open source · BSD-3-Clause License</span>
          <span>© 2026 Hackerland</span>
        </div>
      </div>
    </footer>
  );
}
