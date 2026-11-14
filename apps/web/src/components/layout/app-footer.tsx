import { Badge, StatusDot } from '@hackerland/ui';
import { getPlatformStats } from '@/lib/data/queries';

export async function AppFooter() {
  const stats = await getPlatformStats();

  return (
    <footer className="w-full border-t border-hairline bg-surface-1/40 py-6 text-body-sm text-fg-subtle">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-4 sm:px-6 lg:px-8">
        {/* Top/Primary line: Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline/60 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <StatusDot tone="accent" pulse label="Network active" />
              <span className="font-display text-label-sm uppercase tracking-wider text-fg">
                HACKERLAND MESH
              </span>
            </div>
            <span className="text-line">•</span>
            <div className="flex flex-wrap items-center gap-2 text-body-xs font-mono">
              <span className="tabular">{stats.members.toLocaleString()} members</span>
              <span className="text-line">•</span>
              <span className="tabular">{stats.projects} projects</span>
              <span className="text-line">•</span>
              <span className="tabular">{stats.openOpportunities} open opportunities</span>
            </div>
          </div>

          <Badge tone="warning" variant="outline">
            Preview · sample data
          </Badge>
        </div>

        {/* Bottom line: Copyright & license */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs">
          <span>Open source · BSD-3-Clause</span>
          <span>© 2026 Hackerland · hackerland.in</span>
        </div>
      </div>
    </footer>
  );
}
