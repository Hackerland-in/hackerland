'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  X,
  ArrowRight,
  Cpu,
  Factory,
  GraduationCap,
  Coins,
  Atom,
  FolderKanban,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';
import { IconButton, cn } from '@hackerland/ui';
import { STATIC_SEARCH_CATALOG, type SearchResultItem } from '@/lib/search/search-catalog';

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    startTransition(() => {
      const terms = trimmed.split(/\s+/).filter(Boolean);
      const filtered = STATIC_SEARCH_CATALOG.filter((item) => {
        const itemTitle = item.title.toLowerCase();
        const itemDesc = item.description.toLowerCase();
        const keywords = (item.keywords || []).map((k) => k.toLowerCase()).join(' ');
        return (
          itemTitle.includes(trimmed) ||
          terms.every((t) => itemTitle.includes(t) || keywords.includes(t) || itemDesc.includes(t))
        );
      }).slice(0, 8);

      setResults(filtered);
      setSelectedIndex(0);
    });

    let isCancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (Array.isArray(data.results) && data.results.length > 0) {
            setResults(data.results.slice(0, 8));
          }
        }
      } catch {
        // Fallback silently to static results
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && results.length === 0) return;

    if (results.length > 0 && selectedIndex >= 0 && results[selectedIndex]) {
      const target = results[selectedIndex]!;
      setIsOpen(false);
      router.push(target.href);
    } else {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'projects':
        return <FolderKanban className="size-4 text-accent-fg" />;
      case 'simulators':
        return <Cpu className="size-4 text-code-fg" />;
      case 'blueprints':
        return <Factory className="size-4 text-make-fg" />;
      case 'academy':
      case 'roadmaps':
        return <GraduationCap className="size-4 text-earn-fg" />;
      case 'bounties':
        return <Coins className="size-4 text-accent-fg" />;
      case 'labs':
        return <Atom className="size-4 text-research-fg" />;
      default:
        return <Sparkles className="size-4 text-accent-fg" />;
    }
  };

  return (
    <>
      {/* Desktop Pill Search Trigger (xl+) */}
      <div className="hidden xl:block w-52 2xl:w-64">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between rounded-full border border-hairline bg-sunken px-3.5 py-1.5 text-body-sm text-fg-subtle transition-colors hover:border-accent/40 hover:bg-surface-1 hover:text-fg focus:outline-none focus:ring-2 focus:ring-accent/20"
          aria-label="Search Hackerland (⌘K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="size-3.5 shrink-0 text-fg-subtle" />
            <span className="truncate text-[13px]">Search builders, builds…</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-full border border-hairline bg-surface-1 px-1.5 font-mono text-[10px] text-fg-subtle">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Tablet & Mobile Search Trigger (< xl) */}
      <div className="xl:hidden">
        <IconButton
          label="Search Hackerland"
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-fg"
        >
          <Search className="size-4" aria-hidden="true" />
        </IconButton>
      </div>

      {/* Global Spotlight Search Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global Search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-fg/35 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={containerRef}
            className="w-full max-w-2xl rounded-2xl border border-hairline bg-surface-1 shadow-overlay overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-surface-1"
            >
              <Search className="size-5 shrink-0 text-accent" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search makers, builds, squads, bounties, labs…"
                className="flex-1 bg-transparent text-body-md text-fg placeholder:text-fg-subtle focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full text-fg-subtle hover:text-fg hover:bg-surface-2 transition-colors"
                  aria-label="Clear query"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-surface-2 text-fg-subtle hover:text-fg border border-hairline"
              >
                ESC
              </button>
            </form>

            <div className="overflow-y-auto p-3 space-y-2 flex-1">
              {results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-display font-semibold text-fg-subtle">
                    Results ({results.length})
                  </div>
                  {results.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-xl transition-all group border',
                          isSelected
                            ? 'bg-accent/8 border-accent/30 shadow-xs'
                            : 'border-transparent hover:bg-surface-2',
                        )}
                      >
                        <div
                          className={cn(
                            'p-2 rounded-xl shrink-0 mt-0.5 border border-hairline',
                            isSelected ? 'bg-surface-1' : 'bg-surface-2',
                          )}
                        >
                          {renderCategoryIcon(item.category)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'font-display text-body-sm font-semibold truncate',
                                isSelected ? 'text-accent-fg' : 'text-fg group-hover:text-accent-fg',
                              )}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={cn(
                                  'rounded-full text-[10px] font-display font-semibold px-2 py-0.5 shrink-0 border border-hairline',
                                  item.badgeTone === 'accent'
                                    ? 'bg-accent/10 text-accent-fg border-accent/20'
                                    : item.badgeTone === 'earn'
                                    ? 'bg-earn/10 text-earn-fg border-earn/20'
                                    : 'bg-surface-2 text-fg-subtle',
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-body-sm text-fg-muted line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                          <span className="text-[11px] text-fg-subtle mt-0.5 block">
                            {item.categoryLabel}
                          </span>
                        </div>

                        <div className="self-center pl-2 shrink-0">
                          <ArrowRight
                            className={cn(
                              'size-4 transition-transform',
                              isSelected
                                ? 'text-accent-fg translate-x-0.5'
                                : 'text-fg-subtle opacity-40 group-hover:opacity-100',
                            )}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : query.trim() ? (
                <div className="py-10 text-center space-y-3">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface-2 text-fg-subtle">
                    <Search className="size-6" />
                  </div>
                  <div>
                    <p className="font-display text-body-md font-semibold text-fg">
                      No instant matches for &quot;{query}&quot;
                    </p>
                    <p className="text-body-sm text-fg-muted mt-0.5">
                      Press Enter to run a full search across posts, projects, and builders.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-accent text-on-solid font-display text-body-sm font-semibold hover:bg-accent-strong transition-colors"
                  >
                    <span>Search all of Hackerland</span>
                    <CornerDownLeft className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-2 px-1">
                  <div>
                    <span className="text-[12px] font-display font-semibold text-fg-subtle block mb-2 px-2">
                      Trending searches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'AeroGlide UAV',
                        'OpenBraille',
                        'PCB Studio',
                        'Bounties & Grants',
                        'STM32 Firmware',
                        '3D Physics Labs',
                        'Quadcopter',
                        'Solar MPPT',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setQuery(item);
                            inputRef.current?.focus();
                          }}
                          className="px-3 py-1.5 rounded-full border border-hairline bg-surface-2 text-body-sm text-fg-muted hover:text-accent-fg hover:border-accent/40 hover:bg-accent/5 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-hairline pt-3">
                    <span className="text-[12px] font-display font-semibold text-fg-subtle block mb-2 px-2">
                      Popular destinations
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Community Feed', href: '/feed', icon: Sparkles },
                        { label: 'Explore Projects', href: '/projects', icon: FolderKanban },
                        { label: 'Makers', href: '/u', icon: Coins },
                        { label: 'Hardware Labs', href: '/manufacturing', icon: Cpu },
                      ].map((hub) => {
                        const Icon = hub.icon;
                        return (
                          <Link
                            key={hub.href}
                            href={hub.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-hairline bg-surface-2/60 text-body-sm font-display font-medium text-fg hover:border-accent/40 hover:text-accent-fg transition-colors"
                          >
                            <Icon className="size-4 text-accent" />
                            <span className="truncate">{hub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-hairline bg-surface-2/40 text-[11px] font-mono text-fg-subtle">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>

              {query.trim() && (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="text-accent-fg hover:underline font-display font-semibold flex items-center gap-1"
                >
                  <span>See all results</span>
                  <ArrowRight className="size-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
