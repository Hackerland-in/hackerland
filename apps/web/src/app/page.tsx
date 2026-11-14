import { getPlatformStats } from '../lib/data/queries';

export default async function HomePage() {
  const stats = await getPlatformStats();

  return (
    <main className="p-8 max-w-page mx-auto">
      <h1 className="text-headline-xl font-display text-accent mb-4">
        Hackerland Mission Control
      </h1>
      <p className="text-body-lg text-fg-muted mb-8">
        Build together. Earn together. Open-source innovation network.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-1 border border-hairline rounded-lg">
          <span className="text-label-sm uppercase text-fg-subtle">Members</span>
          <div className="text-headline-md font-display text-fg mt-1 tabular">{stats.members.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-surface-1 border border-hairline rounded-lg">
          <span className="text-label-sm uppercase text-fg-subtle">Projects</span>
          <div className="text-headline-md font-display text-fg mt-1 tabular">{stats.projects}</div>
        </div>
        <div className="p-4 bg-surface-1 border border-hairline rounded-lg">
          <span className="text-label-sm uppercase text-fg-subtle">Opportunities</span>
          <div className="text-headline-md font-display text-fg mt-1 tabular">{stats.openOpportunities}</div>
        </div>
        <div className="p-4 bg-surface-1 border border-hairline rounded-lg">
          <span className="text-label-sm uppercase text-fg-subtle">Rewards Pool</span>
          <div className="text-headline-md font-display text-fg mt-1 tabular">₹{stats.rewardsPool.amount.toLocaleString()}</div>
        </div>
      </div>
    </main>
  );
}
