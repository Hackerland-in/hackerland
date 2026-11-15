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
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { Badge, IconButton, cn } from '@hackerland/ui';
import { STATIC_SEARCH_CATALOG, type SearchResultItem } from '@/lib/search/search-catalog';

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global hotkey: Cmd+K / Ctrl+K or / to open search
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

  // Autofocus input when modal opens
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

  // Filter results on query change (instant static + async server query)
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
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'projects':
        return <FolderKanban className="size-4 text-accent" />;
      case 'simulators':
        return <Cpu className="size-4 text-cyan-400" />;
      case 'blueprints':
        return <Factory className="size-4 text-amber-400" />;
      case 'academy':
      case 'roadmaps':
        return <GraduationCap className="size-4 text-emerald-400" />;
      case 'bounties':
        return <Coins className="size-4 text-brand-pink" />;
      case 'labs':
        return <Atom className="size-4 text-purple-400" />;
      default:
        return <Sparkles className="size-4 text-accent" />;
    }
  };

  return (
    <>
      {/* Desktop Search Trigger Field (2xl+) */}
      <div className="hidden 2xl:block w-52 2xl:w-60">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between rounded-md border border-hairline bg-sunken px-3 py-1.5 text-body-xs text-fg-subtle transition-colors hover:border-line hover:text-fg focus:outline-none focus:ring-1 focus:ring-accent"
          aria-label="Search Hackerland (⌘K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="size-3.5 shrink-0 text-fg-subtle" />
            <span className="truncate">Search Hackerland…</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-hairline/60 bg-surface-2 px-1.5 font-mono text-[10px] text-fg-subtle">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Mobile, Tablet & Laptop Search Trigger Icon (< 2xl) */}
      <div className="2xl:hidden">
        <IconButton
          label="Search Hackerland"
          onClick={() => setIsOpen(true)}
          className="text-fg"
        >
          <Search className="size-4" aria-hidden="true" />
        </IconButton>
      </div>

      {/* Global Spotlight Search Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global Search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-canvas/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={containerRef}
            className="w-full max-w-2xl rounded-2xl border border-hairline bg-surface-1 shadow-overlay overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
          >
            {/* Search Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline bg-surface-2/60"
            >
              <Search className="size-5 shrink-0 text-accent" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, simulators, factory blueprints, academy, labs…"
                className="flex-1 bg-transparent text-body-md text-fg placeholder:text-fg-subtle focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-fg-subtle hover:text-fg hover:bg-surface-3 transition-colors"
                  aria-label="Clear query"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-mono text-[11px] px-2 py-1 rounded bg-surface-3 text-fg-subtle hover:text-fg border border-hairline"
              >
                ESC
              </button>
            </form>

            {/* Results or Suggestions List */}
            <div className="overflow-y-auto p-3 space-y-2 flex-1 scrollbar-thin">
              {results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-fg-subtle">
                    Matching Results ({results.length})
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
                            ? 'bg-accent/15 border-accent/40 shadow-xs ring-1 ring-accent/30'
                            : 'border-transparent hover:bg-surface-2'
                        )}
                      >
                        <div
                          className={cn(
                            'p-2 rounded-lg shrink-0 mt-0.5 border border-hairline',
                            isSelected
                              ? 'bg-surface-1 text-accent'
                              : 'bg-surface-2 text-fg-subtle group-hover:text-fg'
                          )}
                        >
                          {renderCategoryIcon(item.category)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'font-display text-body-sm font-bold truncate',
                                isSelected ? 'text-accent' : 'text-fg group-hover:text-accent'
                              )}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={cn(
                                  'font-mono text-[9px] uppercase px-1.5 py-0.2 rounded shrink-0 border border-hairline',
                                  item.badgeTone === 'accent'
                                    ? 'bg-accent/15 text-accent'
                                    : item.badgeTone === 'earn'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-surface-3 text-fg-subtle'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-caption text-fg-muted line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                          <span className="text-[10px] font-mono text-fg-subtle mt-1 block">
                            {item.categoryLabel}
                          </span>
                        </div>

                        <div className="self-center pl-2 shrink-0">
                          <ArrowRight
                            className={cn(
                              'size-4 transition-transform',
                              isSelected
                                ? 'text-accent translate-x-0.5'
                                : 'text-fg-subtle opacity-40 group-hover:opacity-100'
                            )}
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : query.trim() ? (
                /* No quick matches, offer search page */
                <div className="py-10 text-center space-y-3">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-surface-2 text-fg-subtle">
                    <Search className="size-6" />
                  </div>
                  <div>
                    <p className="font-display text-body-md font-semibold text-fg">
                      No instant suggestions for &quot;{query}&quot;
                    </p>
                    <p className="text-caption text-fg-muted mt-0.5">
                      Press Enter to run a comprehensive multi-category search across the network.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-on-solid font-display text-body-sm font-semibold hover:bg-accent-strong transition-colors"
                  >
                    <span>Search all of Hackerland</span>
                    <CornerDownLeft className="size-3.5" />
                  </button>
                </div>
              ) : (
                /* Empty state: popular queries & shortcuts */
                <div className="space-y-4 py-2 px-1">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-fg-subtle block mb-2 px-2">
                      Popular & Suggested Searches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
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
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setQuery(item);
                            inputRef.current?.focus();
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-hairline bg-surface-2 text-caption text-fg-muted hover:text-fg hover:border-accent/40 hover:bg-surface-3 transition-colors text-left"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-hairline pt-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-fg-subtle block mb-2 px-2">
                      Quick Hub Shortcuts
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Simulators', href: '/manufacturing/physics', icon: Cpu },
                        { label: 'Factory Blueprints', href: '/how-to-start', icon: Factory },
                        { label: 'Founder Academy', href: '/entrepreneurship', icon: GraduationCap },
                        { label: 'Makerspaces & Labs', href: '/labs', icon: Atom },
                      ].map((hub) => {
                        const Icon = hub.icon;
                        return (
                          <Link
                            key={hub.href}
                            href={hub.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 p-2.5 rounded-lg border border-hairline bg-surface-2/60 text-caption font-semibold text-fg hover:border-accent hover:bg-surface-2 transition-colors"
                          >
                            <Icon className="size-4 text-accent" />
                            <span>{hub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Keyboard Shortcuts and Full Results link */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-hairline bg-surface-2/40 text-[11px] font-mono text-fg-subtle">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-surface-3 border border-hairline">↑</kbd>
                  <kbd className="px-1 py-0.5 rounded bg-surface-3 border border-hairline">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-surface-3 border border-hairline">↵</kbd>
                  <span>open</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-surface-3 border border-hairline">esc</kbd>
                  <span>close</span>
                </span>
              </div>

              {query.trim() && (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="text-accent hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View full search page</span>
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
