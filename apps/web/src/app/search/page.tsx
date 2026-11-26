import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Search,
  Cpu,
  Factory,
  GraduationCap,
  Coins,
  Atom,
  FolderKanban,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, EmptyState, cn } from '@hackerland/ui';
import { searchGlobalPlatform, type SearchResultItem } from '@/lib/search/search-index';
import { SocialCommunityProvider } from '@/components/social/social-context';
import { SocialShell } from '@/components/social/social-shell';
import { CommunityRailServer } from '@/components/social/community-rail-server';

export const metadata: Metadata = {
  title: 'Global Search · Hackerland',
  description:
    'Search projects, virtual engineering simulators, factory blueprints, academy courses, bounties, and makerspaces across Hackerland.',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const rawQ = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;
  const query = (rawQ || '').trim();

  const rawCat = Array.isArray(resolvedParams.category)
    ? resolvedParams.category[0]
    : resolvedParams.category;
  const activeCategory = rawCat || 'all';

  const allResults = query ? await searchGlobalPlatform(query) : [];

  const categoryCounts = {
    all: allResults.length,
    projects: allResults.filter((r) => r.category === 'projects').length,
    simulators: allResults.filter((r) => r.category === 'simulators').length,
    blueprints: allResults.filter((r) => r.category === 'blueprints').length,
    academy: allResults.filter((r) => r.category === 'academy' || r.category === 'roadmaps').length,
    labs: allResults.filter((r) => r.category === 'labs').length,
    bounties: allResults.filter((r) => r.category === 'bounties').length,
  };

  const filteredResults =
    activeCategory === 'all'
      ? allResults
      : activeCategory === 'academy'
      ? allResults.filter((r) => r.category === 'academy' || r.category === 'roadmaps')
      : allResults.filter((r) => r.category === activeCategory);

  const renderCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'projects':
        return <FolderKanban className="size-4 text-accent" aria-hidden="true" />;
      case 'simulators':
        return <Cpu className="size-4 text-code-fg" aria-hidden="true" />;
      case 'blueprints':
        return <Factory className="size-4 text-make-fg" aria-hidden="true" />;
      case 'academy':
      case 'roadmaps':
        return <GraduationCap className="size-4 text-learn-fg" aria-hidden="true" />;
      case 'bounties':
        return <Coins className="size-4 text-earn-fg" aria-hidden="true" />;
      case 'labs':
        return <Atom className="size-4 text-research-fg" aria-hidden="true" />;
      default:
        return <Sparkles className="size-4 text-accent" aria-hidden="true" />;
    }
  };

  const CATEGORY_TABS = [
    { id: 'all', label: 'All Results', count: categoryCounts.all },
    { id: 'projects', label: 'Projects', count: categoryCounts.projects },
    { id: 'simulators', label: 'Simulators & Studios', count: categoryCounts.simulators },
    { id: 'blueprints', label: 'Factory Blueprints', count: categoryCounts.blueprints },
    { id: 'academy', label: 'Academy & Courses', count: categoryCounts.academy },
    { id: 'labs', label: 'Makerspaces & Labs', count: categoryCounts.labs },
    { id: 'bounties', label: 'Bounties & Grants', count: categoryCounts.bounties },
  ];

  return (
    <SocialCommunityProvider>
      <SocialShell rightRail={<CommunityRailServer />}>
        <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
            <Search className="size-3.5" aria-hidden="true" />
            <span>Global Network Search</span>
          </div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight [overflow-wrap:anywhere]">
            {query ? `Search Results for "${query}"` : 'Global Network Search'}
          </h1>
          <p className="text-body-sm sm:text-body-md text-fg-muted max-w-xl">
            Discover open-source builds, hardware simulators, factory blueprints, courses, bounties, and makerspaces across Hackerland.
          </p>
        </header>

        {/* Interactive Search Input Form */}
        <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs space-y-4">
          <form method="GET" action="/search" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="size-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by topic, CAD, drone, PCB, Stanford, EV battery, KiCad, or city…"
                className="h-11 w-full rounded-full border border-line bg-sunken pl-10 pr-4 text-body-md text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:bg-surface-1"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              <span>Search</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          {query && allResults.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-hairline">
              {CATEGORY_TABS.map((tab) => {
                const isSelected = activeCategory === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={`/search?q=${encodeURIComponent(query)}&category=${tab.id}`}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-body-xs font-display font-medium transition-all border inline-flex items-center gap-1.5',
                      isSelected
                        ? 'border-accent bg-accent text-on-solid font-semibold shadow-xs'
                        : 'border-hairline bg-sunken text-fg-muted hover:text-fg hover:border-accent/40',
                    )}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        'font-mono text-[10px] px-1.5 py-0.2 rounded-full',
                        isSelected ? 'bg-on-solid/20 text-on-solid' : 'bg-surface-2 text-fg-subtle',
                      )}
                    >
                      {tab.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Display */}
        {query ? (
          filteredResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-body-xs font-mono text-fg-subtle px-1">
                <span>
                  Showing {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}{' '}
                  {activeCategory !== 'all' ? `in ${activeCategory}` : 'across all categories'}
                </span>
                <span>Sorted by relevance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResults.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="rounded-2xl border border-hairline bg-surface-1 p-5 flex flex-col justify-between space-y-4 hover:border-accent/45 hover:shadow-module transition-all group min-w-0 [overflow-wrap:anywhere]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-2 rounded-full bg-surface-2 border border-hairline group-hover:bg-accent-soft group-hover:border-accent/30 transition-colors shrink-0">
                            {renderCategoryIcon(item.category)}
                          </div>
                          <span className="font-mono text-[11px] text-fg-subtle uppercase truncate">
                            {item.categoryLabel}
                          </span>
                        </div>
                        {item.badge && (
                          <Badge
                            tone={
                              item.badgeTone === 'accent'
                                ? 'accent'
                                : item.badgeTone === 'earn'
                                ? 'earn'
                                : 'neutral'
                            }
                            variant="outline"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="font-display text-body-md font-bold text-fg group-hover:text-accent-fg transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-body-xs text-fg-muted line-clamp-3 mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-hairline flex items-center justify-between text-body-xs font-display font-semibold text-accent-fg">
                      <span>Explore Result</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title={`No results found for "${query}"`}
              description="Try searching with broader terms, checking spelling, or exploring one of the suggested categories below."
              action={
                <Button asChild variant="secondary">
                  <Link href="/search">Clear Search</Link>
                </Button>
              }
            />
          )
        ) : (
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 space-y-7 shadow-xs">
            <div className="space-y-3">
              <h2 className="font-display text-headline-sm font-bold text-fg">
                Trending &amp; Popular Searches
              </h2>
              <p className="text-body-sm text-fg-muted">
                Click any topic to jump straight into open projects, simulators, factory blueprints, and courses:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'Quadcopter Drone Physics',
                  'Multilayer PCB Plant',
                  'EV Battery Gigafactory',
                  'Cap Table Calculator',
                  'KiCad 8 OpenEDA',
                  'SPICE Circuit Solver',
                  'Stanford CS183 Startup',
                  '3D Printing Labs India',
                  'Bounties & Grants',
                  'De Laval Rocket Nozzle',
                  'Cleanroom HVAC Sizing',
                  'BLDC Stator Motor Winding',
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3.5 py-1.5 rounded-full border border-hairline bg-sunken text-body-xs font-display font-medium text-fg-muted hover:text-accent-fg hover:border-accent/40 hover:bg-accent-soft transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-hairline pt-6 space-y-3">
              <h3 className="font-display text-body-md font-bold text-fg">
                Explore Core Hackerland Domains
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: 'Virtual Simulators Suite',
                    desc: '60 FPS vehicle, drone, rocket, SPICE, and EDA engines.',
                    href: '/manufacturing/physics',
                    icon: Cpu,
                    badge: 'Simulators',
                  },
                  {
                    title: 'Physical Makerspaces & Labs',
                    desc: '3D printers, CNC mills, and ATL nodes across India.',
                    href: '/labs',
                    icon: Atom,
                    badge: 'Labs Map',
                  },
                  {
                    title: 'Industrial Factory Blueprints',
                    desc: 'Turnkey blueprints for PCB, EV, Drones & Fabs.',
                    href: '/how-to-start',
                    icon: Factory,
                    badge: 'CapEx',
                  },
                  {
                    title: 'Founder Academy & Cap Tables',
                    desc: 'Stanford, YC, and MIT courses with equity calculators.',
                    href: '/entrepreneurship',
                    icon: GraduationCap,
                    badge: '100% Free',
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="p-4 rounded-2xl border border-hairline bg-sunken/70 hover:bg-surface-1 hover:border-accent/40 transition-all group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Icon className="size-5 text-accent" aria-hidden="true" />
                          <Badge tone="neutral" variant="outline">{card.badge}</Badge>
                        </div>
                        <h4 className="font-display text-body-sm font-bold text-fg group-hover:text-accent-fg transition-colors">
                          {card.title}
                        </h4>
                        <p className="text-body-xs text-fg-muted">{card.desc}</p>
                      </div>
                      <span className="text-body-xs font-display font-semibold text-accent-fg inline-flex items-center gap-1">
                        <span>Launch Hub</span>
                        <ArrowRight className="size-3" aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </SocialShell>
    </SocialCommunityProvider>
  );
}
