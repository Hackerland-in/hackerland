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
import { Button, EmptyState, SectionHeader, cn } from '@hackerland/ui';
import { searchGlobalPlatform, type SearchResultItem } from '@/lib/search/search-index';

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
        return <FolderKanban className="size-5 text-accent" />;
      case 'simulators':
        return <Cpu className="size-5 text-cyan-400" />;
      case 'blueprints':
        return <Factory className="size-5 text-amber-400" />;
      case 'academy':
      case 'roadmaps':
        return <GraduationCap className="size-5 text-emerald-400" />;
      case 'bounties':
        return <Coins className="size-5 text-brand-pink" />;
      case 'labs':
        return <Atom className="size-5 text-purple-400" />;
      default:
        return <Sparkles className="size-5 text-accent" />;
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-w-0">
      <SectionHeader
        as="h1"
        size="page"
        eyebrow="GLOBAL NETWORK SEARCH"
        title={query ? `Search Results for "${query}"` : 'Global Network Search'}
        description="Search across open-source projects, cyber-physical simulators, factory blueprints, founder masterclasses, bounties, and ATL makerspaces."
      />

      {/* Big Interactive Search Input Form */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-6 shadow-sm space-y-4">
        <form method="GET" action="/search" className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="size-5 text-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by topic, CAD, drone, PCB, Stanford, EV battery, KiCad, or city…"
              className="w-full rounded-xl border border-hairline bg-surface-2 pl-11 pr-4 py-3 text-body-md text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              autoFocus
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="shrink-0 font-display">
            <span>Search</span>
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </form>

        {/* Category Filter Tabs */}
        {query && allResults.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-hairline/60">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={`/search?q=${encodeURIComponent(query)}&category=${tab.id}`}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-body-xs font-display font-medium transition-all whitespace-nowrap border flex items-center gap-2',
                    isSelected
                      ? 'border-accent bg-accent/15 text-accent font-semibold shadow-xs'
                      : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      'font-mono text-[10px] px-1.5 py-0.2 rounded',
                      isSelected ? 'bg-accent/25 text-accent' : 'bg-surface-3 text-fg-subtle'
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-xl border border-hairline bg-surface-1 p-5 flex flex-col justify-between space-y-4 hover:border-accent hover:shadow-module transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-surface-2 border border-hairline group-hover:bg-accent/15 group-hover:border-accent/40 transition-colors">
                          {renderCategoryIcon(item.category)}
                        </div>
                        <span className="font-mono text-[11px] text-fg-subtle uppercase">
                          {item.categoryLabel}
                        </span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'font-mono text-[9px] uppercase px-2 py-0.5 rounded border',
                            item.badgeTone === 'accent'
                              ? 'bg-accent/15 text-accent border-accent/30'
                              : item.badgeTone === 'earn'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-surface-2 text-fg-subtle border-hairline'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-body-md font-bold text-fg group-hover:text-accent transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-body-xs text-fg-muted line-clamp-3 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline/60 flex items-center justify-between text-body-xs font-display font-medium text-accent">
                    <span>Explore Result</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
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
        /* Empty Query: Showcase popular topics and hub shortcuts */
        <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-headline-sm font-bold text-fg">
              Trending & Popular Searches
            </h2>
            <p className="text-body-sm text-fg-muted">
              Click any term to explore instant projects, simulators, plant blueprints, and masterclasses:
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
                  className="px-3 py-1.5 rounded-lg border border-hairline bg-surface-2 text-body-xs font-display font-medium text-fg-muted hover:text-accent hover:border-accent hover:bg-accent/10 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="border-t border-hairline pt-6 space-y-3">
            <h3 className="font-display text-body-md font-bold text-fg">
              Explore Core Hackerland Domains
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    className="p-4 rounded-xl border border-hairline bg-surface-2/60 hover:bg-surface-2 hover:border-accent/40 transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Icon className="size-5 text-accent" />
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-3 text-fg-subtle border border-hairline">
                          {card.badge}
                        </span>
                      </div>
                      <h4 className="font-display text-body-sm font-bold text-fg group-hover:text-accent transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-caption text-fg-muted">{card.desc}</p>
                    </div>
                    <span className="text-caption font-mono text-accent flex items-center gap-1">
                      <span>Launch Hub</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
