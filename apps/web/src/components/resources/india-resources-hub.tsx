'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Compass,
  Cpu,
  ExternalLink,
  Factory,
  FlaskConical,
  IndianRupee,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, Card, FilterChip, cn } from '@hackerland/ui';
import {
  BROAD_SECTOR_SPOTLIGHTS,
  FREE_PROTOTYPING_ACCESS,
  FREE_RESOURCES_LIBRARY,
  INDIA_FUNDING_PROGRAMS,
  INDIA_REGION_HUBS,
  type BroadSectorCategory,
  type IndiaZoneId,
} from '@/lib/data/india-ecosystem-data';

type HubTab = 'all_sectors_regions' | 'funding' | 'prototyping' | 'free_library';

const ZONE_LABELS: { id: IndiaZoneId | 'all'; label: string }[] = [
  { id: 'all', label: 'All India' },
  { id: 'north', label: 'North & Himalayas' },
  { id: 'west', label: 'West & Gujarat' },
  { id: 'south', label: 'South Corridor' },
  { id: 'east', label: 'East India' },
  { id: 'northeast', label: 'North-East' },
  { id: 'central', label: 'Central India' },
];

const CATEGORY_LABELS: { id: BroadSectorCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Every Sector' },
  { id: 'manufacturing', label: 'Manufacturing & Hardware' },
  { id: 'software_ai', label: 'Software, AI & DPI' },
  { id: 'bio_agro_climate', label: 'Agri, MedTech & Climate' },
  { id: 'creative_craft_gi', label: 'GI Craft, Toys & Design' },
];

export function IndiaResourcesHub() {
  const [activeTab, setActiveTab] = useState<HubTab>('all_sectors_regions');
  const [selectedZone, setSelectedZone] = useState<IndiaZoneId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BroadSectorCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [noCompanyOnly, setNoCompanyOnly] = useState(false);

  const q = searchQuery.trim().toLowerCase();

  const filteredSectors = useMemo(() => {
    return BROAD_SECTOR_SPOTLIGHTS.filter((s) => {
      if (selectedZone !== 'all' && !s.zones.includes(selectedZone)) return false;
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.indianHubs.some((h) => h.toLowerCase().includes(q)) ||
        s.fundingFit.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [selectedZone, selectedCategory, q]);

  const activeZoneHub =
    selectedZone !== 'all'
      ? INDIA_REGION_HUBS.find((z) => z.zone === selectedZone) ?? null
      : null;

  const filteredFunding = useMemo(() => {
    return INDIA_FUNDING_PROGRAMS.filter((f) => {
      if (noCompanyOnly && !f.noCompanyNeeded) return false;
      if (
        selectedZone !== 'all' &&
        !(f.zones as readonly string[]).includes('all') &&
        !(f.zones as readonly string[]).includes(selectedZone)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.provider.toLowerCase().includes(q) ||
        f.sectors.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [noCompanyOnly, selectedZone, q]);

  return (
    <div className="space-y-6 min-w-0">
      {/* Header Banner */}
      <header className="rounded-3xl border border-accent/25 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-display font-bold text-on-solid">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Every Sector · Every Corner of India</span>
          </span>
          <Badge tone="earn" variant="solid">
            100% Open Access Guide
          </Badge>
        </div>

        <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight">
          Pan-India Funding, Prototyping Labs &amp; Free Builder Resources
        </h1>
        <p className="text-body-sm sm:text-body-md text-fg-muted max-w-3xl leading-relaxed">
          From Kashmiri cold-climate clean tech and Guwahati bamboo/biotech to Surat textiles, Rajkot CNC, Pune EVs, Chennai deep-tech and digital AI stacks — discover every sector, zero-equity grant, free prototyping center, and regional-language resource across India.
        </p>

        {/* Search + Zone Selector */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search
              className="size-4 text-fg-subtle absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search city (Tiruppur, Guwahati, Pune, Rajkot), sector, or grant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface-1 pl-10 pr-4 py-2 text-body-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {ZONE_LABELS.map((z) => (
              <FilterChip
                key={z.id}
                selected={selectedZone === z.id}
                tone="accent"
                onClick={() => setSelectedZone(z.id)}
              >
                {z.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </header>

      {/* Main Switcher Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-hairline pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all_sectors_regions')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold border transition cursor-pointer',
            activeTab === 'all_sectors_regions'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'bg-surface-1 text-fg-muted border-hairline hover:text-fg',
          )}
        >
          <Compass className="size-4" aria-hidden="true" />
          <span>All India Sectors &amp; Zones ({BROAD_SECTOR_SPOTLIGHTS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('funding')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold border transition cursor-pointer',
            activeTab === 'funding'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'bg-surface-1 text-fg-muted border-hairline hover:text-fg',
          )}
        >
          <IndianRupee className="size-4" aria-hidden="true" />
          <span>Funding &amp; Grants ({INDIA_FUNDING_PROGRAMS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prototyping')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold border transition cursor-pointer',
            activeTab === 'prototyping'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'bg-surface-1 text-fg-muted border-hairline hover:text-fg',
          )}
        >
          <FlaskConical className="size-4" aria-hidden="true" />
          <span>Free Prototyping Access ({FREE_PROTOTYPING_ACCESS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('free_library')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-display font-semibold border transition cursor-pointer',
            activeTab === 'free_library'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'bg-surface-1 text-fg-muted border-hairline hover:text-fg',
          )}
        >
          <BookOpen className="size-4" aria-hidden="true" />
          <span>Free Learning &amp; Tools ({FREE_RESOURCES_LIBRARY.length})</span>
        </button>
      </div>

      {/* Tab 1: All Sectors & Regions */}
      {activeTab === 'all_sectors_regions' && (
        <div className="space-y-6">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORY_LABELS.map((cat) => (
              <FilterChip
                key={cat.id}
                selected={selectedCategory === cat.id}
                tone="make"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </FilterChip>
            ))}
          </div>

          {/* Regional Highlight Card when Zone Filtered (or Pan-India Strip) */}
          {activeZoneHub ? (
            <Card className="p-5 border-accent/30 bg-accent-soft/60 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-accent-fg" aria-hidden="true" />
                  <h2 className="font-display text-headline-sm font-bold text-fg">
                    {activeZoneHub.zoneTitle}
                  </h2>
                </div>
                <Badge tone="accent" variant="solid">
                  {activeZoneHub.stateGrantAmount}
                </Badge>
              </div>
              <p className="text-body-xs text-fg-muted">
                <strong className="text-fg">States &amp; UTs:</strong> {activeZoneHub.statesCovered} ·{' '}
                <strong className="text-fg">Key Hubs:</strong> {activeZoneHub.keyHubs}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-xs">
                <div className="rounded-xl bg-surface-1 border border-hairline p-3 space-y-1">
                  <div className="font-semibold text-accent-fg uppercase text-[10px] font-mono">
                    Flagship Regional Support &amp; Free Labs
                  </div>
                  <p className="font-medium text-fg">{activeZoneHub.flagshipStateScheme}</p>
                  <p className="text-fg-muted">Labs: {activeZoneHub.freePrototypingLabs.join(' · ')}</p>
                </div>
                <div className="rounded-xl bg-surface-1 border border-hairline p-3 space-y-1">
                  <div className="font-semibold text-emerald-700 uppercase text-[10px] font-mono">
                    Export Gateways &amp; Regional Strengths
                  </div>
                  <p className="text-fg">{activeZoneHub.strengthSectors.join(' · ')}</p>
                  <p className="text-fg-muted">{activeZoneHub.exportCorridorNote}</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {INDIA_REGION_HUBS.map((hub) => (
                <button
                  key={hub.zone}
                  type="button"
                  onClick={() => setSelectedZone(hub.zone)}
                  className="text-left rounded-2xl border border-hairline bg-surface-1 p-4 hover:border-accent/40 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-body-sm font-bold text-fg">
                      {hub.zoneTitle}
                    </span>
                    <MapPin className="size-3.5 text-accent shrink-0" />
                  </div>
                  <p className="text-[11px] font-mono text-fg-subtle line-clamp-1">{hub.keyHubs}</p>
                  <p className="text-[12px] text-accent-fg font-medium line-clamp-1">
                    {hub.stateGrantAmount}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Sector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSectors.map((sector) => (
              <Card key={sector.id} className="p-5 border-hairline bg-surface-1 flex flex-col justify-between gap-4 hover:border-accent/35 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge tone="accent" variant="outline">
                      {sector.categoryLabel}
                    </Badge>
                    <span className="text-[11px] font-mono text-fg-subtle">
                      {sector.indianHubs.slice(0, 3).join(' · ')}
                    </span>
                  </div>
                  <h3 className="font-display text-headline-sm font-bold text-fg">
                    {sector.title}
                  </h3>
                  <p className="text-body-xs text-fg-muted leading-relaxed">{sector.tagline}</p>

                  <div className="rounded-xl bg-sunken border border-hairline p-3 space-y-1.5 text-body-xs">
                    <div>
                      <span className="font-semibold text-fg">₹0 Starter Path:</span>{' '}
                      <span className="text-fg-muted">{sector.zeroCostStarter}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-fg">Free Prototyping:</span>{' '}
                      <span className="text-fg-muted">{sector.freePrototypingPath}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700">Export Potential:</span>{' '}
                      <span className="text-fg-muted">{sector.exportPotential}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline">
                  <span className="text-[11px] font-mono text-accent-fg font-semibold">
                    Grants: {sector.fundingFit[0]}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="primary">
                      <Link href={sector.linkedRoute}>Open Pathway →</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Funding & Grants */}
      {activeTab === 'funding' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-hairline bg-surface-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-body-md font-bold text-fg">
                Filter for Early Individuals &amp; Students
              </h2>
              <p className="text-body-xs text-fg-muted">
                Many Indian prototype grants fund solo builders or teams even before incorporating a company.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-body-xs font-semibold text-fg cursor-pointer bg-sunken px-3 py-2 rounded-xl border border-hairline">
              <input
                type="checkbox"
                checked={noCompanyOnly}
                onChange={(e) => setNoCompanyOnly(e.target.checked)}
                className="accent-accent"
              />
              <span>No Company Registered Yet Only</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFunding.map((grant) => (
              <Card key={grant.id} className="p-5 border-hairline bg-surface-1 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge tone={grant.type === 'free_grant' ? 'earn' : 'accent'} variant="solid">
                      {grant.typeLabel}
                    </Badge>
                    {grant.noCompanyNeeded && (
                      <Badge tone="code" variant="outline">
                        Individual / Student Eligible
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display text-headline-sm font-bold text-fg">
                    {grant.name}
                  </h3>
                  <p className="text-[12px] text-fg-subtle">{grant.provider}</p>
                  <div className="grid grid-cols-2 gap-2 text-body-xs pt-1">
                    <div className="rounded-xl bg-sunken border border-hairline p-2.5">
                      <span className="text-[10px] font-mono text-fg-subtle block">Support Size</span>
                      <span className="font-bold text-emerald-700">{grant.amountRangeInr}</span>
                    </div>
                    <div className="rounded-xl bg-sunken border border-hairline p-2.5">
                      <span className="text-[10px] font-mono text-fg-subtle block">Equity Dilution</span>
                      <span className="font-bold text-fg">{grant.equityTaken}</span>
                    </div>
                  </div>
                  <p className="text-body-xs text-fg-muted">
                    <strong className="text-fg">How to prepare:</strong> {grant.howToPrepare}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline">
                  <Link href="/ideas" className="text-body-xs font-semibold text-accent-fg hover:underline">
                    Build PoC Brief in IdeaLab →
                  </Link>
                  <a
                    href={grant.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-sunken border border-line px-3 py-1.5 text-body-xs font-semibold text-fg hover:border-accent"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Free Prototyping Access */}
      {activeTab === 'prototyping' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FREE_PROTOTYPING_ACCESS.map((item) => (
            <Card key={item.id} className="p-5 border-hairline bg-surface-1 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="make" variant="outline">
                    {item.categoryLabel}
                  </Badge>
                  <span className="text-body-xs font-mono font-bold text-emerald-700">
                    {item.cost}
                  </span>
                </div>
                <h3 className="font-display text-headline-sm font-bold text-fg">{item.name}</h3>
                <p className="text-[12px] font-mono text-fg-subtle">{item.regions}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.toolsAvailable.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-sunken border border-hairline px-2.5 py-0.5 text-[11px] font-medium text-fg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-body-xs text-fg-muted leading-relaxed">
                  {item.howYoungBuildersAccess}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline">
                {item.internalRoute ? (
                  <Button asChild size="sm" variant="primary">
                    <Link href={item.internalRoute}>Launch Inside Hackerland →</Link>
                  </Button>
                ) : (
                  <span className="text-[11px] font-mono text-fg-subtle">External Free Platform</span>
                )}
                {!item.url.startsWith('/') && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-body-xs font-semibold text-accent-fg hover:underline"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Free Learning & Tools */}
      {activeTab === 'free_library' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FREE_RESOURCES_LIBRARY.map((res) => (
            <Card key={res.id} className="p-5 border-hairline bg-surface-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="accent" variant="solid">
                    {res.provider}
                  </Badge>
                  <Badge tone="earn" variant="outline">
                    {res.cost}
                  </Badge>
                </div>
                <h3 className="font-display text-headline-sm font-bold text-fg">{res.title}</h3>
                <p className="text-[11px] font-mono text-accent-fg">{res.languages}</p>
                <p className="text-body-xs text-fg-muted leading-relaxed">{res.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline">
                {res.internalRoute ? (
                  <Link href={res.internalRoute} className="text-body-xs font-semibold text-accent-fg hover:underline">
                    Related Hackerland Track →
                  </Link>
                ) : (
                  <span />
                )}
                {res.url.startsWith('/') ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={res.url}>Open Templates →</Link>
                  </Button>
                ) : (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sunken border border-line px-3 py-1.5 text-body-xs font-semibold text-fg hover:border-accent"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom Next-Step Bridge */}
      <Card className="p-5 border-accent/25 bg-accent-soft/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display text-body-md font-bold text-fg flex items-center gap-2">
            <Factory className="size-4 text-accent-fg" aria-hidden="true" />
            <span>Ready to turn an idea + grant into a real product?</span>
          </h3>
          <p className="text-body-xs text-fg-muted">
            Shape your concept in IdeaLab, assemble a squad, prototype in Labs, and prepare international shipments in Export Hub.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="primary">
            <Link href="/ideas">Open IdeaLab</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/export">Export &amp; Trade Hub</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
