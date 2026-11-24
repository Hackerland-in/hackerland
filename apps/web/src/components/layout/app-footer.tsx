import Link from 'next/link';
import Image from 'next/image';
import { StatusDot } from '@hackerland/ui';
import { getPlatformStats } from '@/lib/data/queries';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export async function AppFooter() {
  const stats = await getPlatformStats();

  return (
    <footer className="w-full border-t border-hairline bg-surface-1/60 text-body-sm text-fg-subtle pt-12 pb-8">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Section: Brand + Multi-column Links */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Hackerland Logo"
                width={28}
                height={28}
                className="h-7 w-7 rounded-sm object-contain"
              />
              <Image
                src="/images/logo2.png"
                alt="Hackerland"
                width={120}
                height={24}
                className="h-6 w-auto object-contain dark:brightness-200 dark:contrast-125"
              />
            </Link>
            <p className="text-body-sm text-fg-muted max-w-sm">
              The open-source innovation network for hardware tinkerers, deep-tech researchers,
              software engineers, and cross-disciplinary squads.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <StatusDot tone="accent" pulse label="Network active" />
              <span className="font-mono text-caption text-fg-subtle">
                HACKERLAND MESH · ACTIVE
              </span>
            </div>
          </div>

          {/* Col 1: Hardware & Labs */}
          <div className="space-y-3">
            <p className="font-display text-caption font-semibold uppercase tracking-wider text-fg">
              Hardware & Labs
            </p>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/manufacturing" className="hover:text-fg transition-colors">
                  Manufacturing Hub
                </Link>
              </li>
              <li>
                <Link href="/manufacturing/physics" className="hover:text-fg transition-colors">
                  Physics Simulators
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-fg transition-colors">
                  Makerspaces & ATL
                </Link>
              </li>
              <li>
                <Link href="/how-to-start" className="hover:text-fg transition-colors">
                  Factory Blueprints
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Academy & Earn */}
          <div className="space-y-3">
            <p className="font-display text-caption font-semibold uppercase tracking-wider text-fg">
              Academy & Earn
            </p>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/learn" className="hover:text-fg transition-colors">
                  Skill Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/entrepreneurship" className="hover:text-fg transition-colors">
                  Founder Academy
                </Link>
              </li>
              <li>
                <Link href="/earn" className="hover:text-fg transition-colors">
                  Bounties & Grants
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-fg transition-colors">
                  Squad Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Trust */}
          <div className="space-y-3">
            <p className="font-display text-caption font-semibold uppercase tracking-wider text-fg">
              Community
            </p>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/u" className="hover:text-fg transition-colors">
                  Innovator Profiles
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-fg transition-colors">
                  Top Innovators
                </Link>
              </li>
              <li>
                <Link href="/feed" className="hover:text-fg transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <a
                  href="https://ai.hackerland.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-pink hover:underline"
                >
                  <span>AI Community</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://blog.hackerland.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg transition-colors"
                >
                  Engineering Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline/60 pt-6">
          <div className="flex flex-wrap items-center gap-2 text-body-xs font-mono text-fg-subtle">
            <span className="tabular">{stats.members.toLocaleString()} members</span>
            <span className="text-line">•</span>
            <span className="tabular">{stats.projects} projects</span>
            <span className="text-line">•</span>
            <span className="tabular">{stats.openOpportunities} open opportunities</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/design-system"
              className="text-body-xs font-mono text-fg-subtle hover:text-fg transition-colors"
            >
              Design System
            </Link>
            <span className="text-line">•</span>
            <Link
              href="/moderation"
              className="inline-flex items-center gap-1 text-body-xs text-fg-subtle hover:text-fg transition-colors"
            >
              <ShieldCheck className="size-3 text-earn" />
              <span>DPDP Compliance</span>
            </Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline/40 pt-6 text-body-xs">
          <span>Open source · BSD-3-Clause License</span>
          <span>© 2026 Hackerland · All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
