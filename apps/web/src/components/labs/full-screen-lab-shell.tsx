'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import type { LabWorkspaceKind } from '@hackerland/db';
import {
  ArrowLeft,
  BookmarkCheck,
  Check,
  ChevronDown,
  Cpu,
  ExternalLink,
  FolderOpen,
  Maximize2,
  Minimize2,
  Save,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { Badge, Button, Input, cn } from '@hackerland/ui';
import { useBuilderIdentity } from '@/lib/builder-identity';

export interface SavedLabWorkspaceItem {
  workspaceId: string;
  kind: LabWorkspaceKind;
  slugOrRoute: string;
  title: string;
  summary?: string;
  ownerHandle: string;
  ownerName: string;
  tags: string[];
  payload: Record<string, unknown>;
  updatedAt: string;
}

export interface LabSnapshotDraft {
  workspaceId?: string;
  title: string;
  summary?: string;
  tags?: string[];
  payload: Record<string, unknown>;
}

interface LabShellContextValue {
  labKind: LabWorkspaceKind;
  currentRoute: string;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  savedWorkspaces: SavedLabWorkspaceItem[];
  saving: boolean;
  lastSaveMessage: string | null;
  saveWorkspace: (draft: LabSnapshotDraft & { publishToFeed?: boolean }) => Promise<SavedLabWorkspaceItem | null>;
  refreshWorkspaces: () => Promise<void>;
  openSavedDrawer: () => void;
  registerSnapshotHandlers: (handlers: {
    getSnapshot?: () => LabSnapshotDraft;
    onLoad?: (ws: SavedLabWorkspaceItem) => void;
  }) => void;
}

const LabShellContext = createContext<LabShellContextValue | null>(null);

export function useLabShell(): LabShellContextValue | null {
  return useContext(LabShellContext);
}

const ALL_LAB_GROUPS: Array<{
  group: string;
  items: Array<{ label: string; href: string; kind?: string }>;
}> = [
  {
    group: 'Design & Fabrication',
    items: [
      { label: 'A-Z PCB & Circuit Studio', href: '/manufacturing/pcb', kind: 'pcb' },
      { label: 'PCB Fabrication RFQ Engine', href: '/manufacturing/rfq', kind: 'rfq' },
      { label: 'Idea-to-Prototype Architect', href: '/prototype', kind: 'prototype' },
      { label: 'AI Hardware Co-Pilot', href: '/copilot', kind: 'copilot' },
      { label: 'SMT Assembly Visualizer', href: '/assembly/aeroglide-flight-controller-pcba' },
    ],
  },
  {
    group: 'Simulators & Physics',
    items: [
      { label: '3D Multibody Simulator', href: '/manufacturing/physics/3d', kind: 'physics' },
      { label: 'Multibody Physics Hub', href: '/manufacturing/physics', kind: 'physics' },
      { label: 'Quadcopter 6-DOF Lab', href: '/manufacturing/physics/drone' },
      { label: 'EV Powertrain Dyno', href: '/manufacturing/physics/ev' },
      { label: 'Car Dynamics Engine', href: '/manufacturing/physics/car' },
      { label: 'Rocket Ascent Sim', href: '/manufacturing/physics/rocket' },
      { label: 'SPICE Hardware Bench', href: '/manufacturing/spice', kind: 'spice' },
      { label: 'Falstad & ngspice', href: '/manufacturing/falstad' },
      { label: 'HDL & GTKWave RTL', href: '/manufacturing/hdl' },
      { label: 'RISC-V RV32I ISS', href: '/manufacturing/iss' },
      { label: 'Circuito.io Auto-BOM', href: '/manufacturing/circuito' },
      { label: 'Open-Source EDA Suite', href: '/manufacturing/eda', kind: 'eda' },
      { label: 'ESP-Labs Bench', href: '/manufacturing/bench' },
      { label: 'Factory Tooling Suite', href: '/manufacturing/tools' },
    ],
  },
  {
    group: 'Power, RF & Field Labs',
    items: [
      { label: 'Digital Twin Telemetry', href: '/telemetry', kind: 'telemetry' },
      { label: 'WebSerial Firmware Flasher', href: '/manufacturing/flasher', kind: 'firmware' },
      { label: 'RF & Smith Chart Calc', href: '/rf-calc/50-ohm-esp32-s3-antenna-feedline' },
      { label: 'Battery EIS Nyquist Lab', href: '/battery-eis/ais156-nmc-21700-pack-cycle-500' },
      { label: 'CAN-FD Bus Timing Sim', href: '/can-bus/2w-ev-powertrain-can-fd-500kbps' },
      { label: 'Motor FOC & SVPWM Lab', href: '/motor-foc/pmsm-2w-ev-traction-drive' },
      { label: 'Solar MPPT Converter Lab', href: '/solar-mppt/agritech-48v-solar-pump-mppt' },
      { label: 'Thermal Heatsink Profiler', href: '/thermal/gan-sic-traction-inverter-coldplate' },
      { label: 'EMC Pre-Scan Analyzer', href: '/emc/bldc-foc-esc-cispr25-prescan' },
      { label: 'Hardware Teardowns Studio', href: '/teardowns/submit', kind: 'teardown' },
    ],
  },
];

export interface FullScreenLabShellProps {
  labKind: LabWorkspaceKind;
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
  currentRoute: string;
  edgeToEdge?: boolean;
  children: ReactNode;
}

export function FullScreenLabShell({
  labKind,
  title,
  subtitle,
  category = 'Hardware Lab',
  badge,
  backHref = '/manufacturing',
  backLabel = 'Manufacturing Hub',
  currentRoute,
  edgeToEdge = false,
  children,
}: FullScreenLabShellProps) {
  const { identity } = useBuilderIdentity();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const snapshotGetterRef = useRef<(() => LabSnapshotDraft) | null>(null);
  const snapshotLoaderRef = useRef<((ws: SavedLabWorkspaceItem) => void) | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [savedWorkspaces, setSavedWorkspaces] = useState<SavedLabWorkspaceItem[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaveMessage, setLastSaveMessage] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<'mongodb' | 'memory' | null>(null);

  const [quickSaveTitle, setQuickSaveTitle] = useState('');
  const [quickSaveNotes, setQuickSaveNotes] = useState('');

  const refreshWorkspaces = useCallback(async () => {
    if (typeof fetch !== 'function') return;
    setLoadingWorkspaces(true);
    try {
      const res = await fetch(`/api/workbenches?kind=${encodeURIComponent(labKind)}`);
      if (res.ok) {
        const data = (await res.json()) as {
          workspaces?: SavedLabWorkspaceItem[];
          storage?: 'mongodb' | 'memory';
        };
        if (Array.isArray(data.workspaces)) {
          setSavedWorkspaces(data.workspaces);
        }
        if (data.storage) setStorageMode(data.storage);
      }
    } catch {
      // Ignore network errors in offline unit tests
    } finally {
      setLoadingWorkspaces(false);
    }
  }, [labKind]);

  useEffect(() => {
    void refreshWorkspaces();
  }, [refreshWorkspaces]);

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        // Keep zenFullscreen controllable independently
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSwitcherOpen(false);
        if (isFullscreen && !document.fullscreenElement) {
          setIsFullscreen(false);
        }
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        try {
          if (next && rootRef.current?.requestFullscreen && !document.fullscreenElement) {
            void rootRef.current.requestFullscreen().catch(() => {});
          } else if (!next && document.fullscreenElement && document.exitFullscreen) {
            void document.exitFullscreen().catch(() => {});
          }
        } catch {}
      }
      return next;
    });
  }, []);

  const saveWorkspace = useCallback(
    async (draft: LabSnapshotDraft & { publishToFeed?: boolean }) => {
      setSaving(true);
      setLastSaveMessage(null);
      try {
        const res = await fetch('/api/workbenches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspaceId: draft.workspaceId,
            kind: labKind,
            slugOrRoute: currentRoute,
            title: draft.title || `${title} Snapshot`,
            summary: draft.summary,
            ownerHandle: identity.handle,
            ownerName: identity.name,
            tags: draft.tags ?? [labKind],
            payload: draft.payload ?? { route: currentRoute },
            publishToFeed: Boolean(draft.publishToFeed),
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            workspace?: SavedLabWorkspaceItem;
            storage?: 'mongodb' | 'memory';
            sharedPostId?: string;
          };
          if (data.storage) setStorageMode(data.storage);
          if (data.workspace) {
            setSavedWorkspaces((prev) => [
              data.workspace!,
              ...prev.filter((w) => w.workspaceId !== data.workspace!.workspaceId),
            ]);
            setLastSaveMessage(
              data.sharedPostId
                ? 'Saved & published snapshot to community feed!'
                : 'Workspace snapshot saved!',
            );
            return data.workspace;
          }
        }
      } catch {
        setLastSaveMessage('Saved locally for this session.');
      } finally {
        setSaving(false);
      }
      return null;
    },
    [currentRoute, identity.handle, identity.name, labKind, title],
  );

  const handleQuickSave = async (publishToFeed: boolean) => {
    const captured = snapshotGetterRef.current?.();
    const finalTitle =
      quickSaveTitle.trim() ||
      captured?.title ||
      `${title} — ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const finalSummary =
      quickSaveNotes.trim() ||
      captured?.summary ||
      `${title} configuration saved by ${identity.name} (@${identity.handle}).`;

    await saveWorkspace({
      ...(captured ?? {}),
      title: finalTitle,
      summary: finalSummary,
      payload: captured?.payload ?? { route: currentRoute, capturedAt: new Date().toISOString() },
      publishToFeed,
    });
    setQuickSaveTitle('');
    setQuickSaveNotes('');
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    setSavedWorkspaces((prev) => prev.filter((w) => w.workspaceId !== workspaceId));
    try {
      await fetch(`/api/workbenches?workspaceId=${encodeURIComponent(workspaceId)}`, {
        method: 'DELETE',
      });
    } catch {}
  };

  const registerSnapshotHandlers = useCallback(
    (handlers: {
      getSnapshot?: () => LabSnapshotDraft;
      onLoad?: (ws: SavedLabWorkspaceItem) => void;
    }) => {
      snapshotGetterRef.current = handlers.getSnapshot ?? null;
      snapshotLoaderRef.current = handlers.onLoad ?? null;
    },
    [],
  );

  return (
    <LabShellContext.Provider
      value={{
        labKind,
        currentRoute,
        isFullscreen,
        toggleFullscreen,
        savedWorkspaces,
        saving,
        lastSaveMessage,
        saveWorkspace,
        refreshWorkspaces,
        openSavedDrawer: () => setSavedDrawerOpen(true),
        registerSnapshotHandlers,
      }}
    >
      <div
        ref={rootRef}
        className={cn(
          'w-full bg-canvas text-fg flex flex-col min-w-0',
          isFullscreen
            ? 'fixed inset-0 z-50 overflow-y-auto'
            : 'min-h-[calc(100vh-4rem)]',
        )}
      >
        {/* Top Rosepaper Full-Screen Lab Studio Bar */}
        <header className="sticky top-0 z-30 border-b border-hairline bg-surface-1/95 backdrop-blur-md px-3 sm:px-5 py-2.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href={backHref}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 py-1.5 text-[12px] font-display font-medium text-fg-muted hover:border-accent/40 hover:text-accent-fg transition-colors shrink-0"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide text-accent-fg">
                    <Cpu className="size-3" aria-hidden="true" />
                    {category}
                  </span>
                  {badge && (
                    <Badge tone="neutral" variant="outline" className="hidden md:inline-flex font-mono text-[10px]">
                      {badge}
                    </Badge>
                  )}
                  <span className="truncate font-display text-sm sm:text-base font-bold text-fg">
                    {title}
                  </span>
                </div>
                {subtitle && (
                  <p className="hidden lg:block truncate text-[12px] text-fg-muted mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Lab Switcher + DB Workbenches + Share + Full Screen */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSwitcherOpen((o) => !o)}
                  aria-expanded={switcherOpen}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-sunken px-3 py-1.5 text-[12px] font-display font-medium text-fg hover:border-accent/40 hover:bg-surface-2 transition-colors"
                >
                  <span>All Labs</span>
                  <ChevronDown className="size-3.5 text-fg-subtle" aria-hidden="true" />
                </button>

                {switcherOpen && (
                  <div className="absolute right-0 mt-2 w-[320px] sm:w-[440px] max-h-[75vh] overflow-y-auto rounded-2xl border border-hairline bg-surface-1 p-4 shadow-overlay z-50 space-y-4">
                    <div className="flex items-center justify-between border-b border-hairline pb-2">
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-fg-muted">
                        Hardware &amp; Simulation Studios
                      </span>
                      <button
                        type="button"
                        onClick={() => setSwitcherOpen(false)}
                        className="rounded-full p-1 text-fg-subtle hover:bg-surface-2 hover:text-fg"
                        aria-label="Close studio switcher"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                    {ALL_LAB_GROUPS.map((grp) => (
                      <div key={grp.group} className="space-y-1.5">
                        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accent-fg">
                          {grp.group}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {grp.items.map((item) => {
                            const active = item.href === currentRoute;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSwitcherOpen(false)}
                                className={cn(
                                  'rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors truncate border',
                                  active
                                    ? 'border-accent bg-accent/10 text-accent-fg font-semibold'
                                    : 'border-transparent text-fg-muted hover:border-hairline hover:bg-sunken hover:text-fg',
                                )}
                              >
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSavedDrawerOpen(true);
                  void refreshWorkspaces();
                }}
              >
                <FolderOpen className="size-3.5" aria-hidden="true" />
                <span>Saved ({savedWorkspaces.length})</span>
              </Button>

              <Button
                size="sm"
                variant="soft"
                onClick={() => void handleQuickSave(true)}
                disabled={saving}
              >
                <Share2 className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Share to Feed</span>
                <span className="sm:hidden">Share</span>
              </Button>

              <Button
                size="sm"
                variant={isFullscreen ? 'primary' : 'secondary'}
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="size-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="size-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {lastSaveMessage && (
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-1.5 text-[12px] text-success-fg">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="size-3.5" aria-hidden="true" />
                {lastSaveMessage}
              </span>
              <div className="flex items-center gap-3">
                <Link href="/feed" className="inline-flex items-center gap-1 font-semibold underline">
                  <span>View Feed</span>
                  <ExternalLink className="size-3" />
                </Link>
                <button
                  type="button"
                  onClick={() => setLastSaveMessage(null)}
                  className="text-fg-subtle hover:text-fg"
                  aria-label="Dismiss save status"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Edge-to-Edge Studio Viewport */}
        <div
          className={cn(
            'flex-1 w-full min-w-0',
            edgeToEdge
              ? 'px-3 sm:px-5 py-4 space-y-5'
              : 'mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6',
          )}
        >
          {children}
        </div>

        {/* Saved Workspaces DB Drawer */}
        {savedDrawerOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Saved Lab Workspaces"
            className="fixed inset-0 z-50 flex justify-end bg-fg/35 backdrop-blur-xs"
          >
            <div className="w-full max-w-md bg-surface-1 border-l border-hairline h-full flex flex-col shadow-overlay">
              <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                <div>
                  <h2 className="font-display text-base font-bold text-fg flex items-center gap-2">
                    <BookmarkCheck className="size-4 text-accent" aria-hidden="true" />
                    <span>Saved {title}</span>
                  </h2>
                  <p className="text-[12px] text-fg-muted mt-0.5">
                    {storageMode === 'mongodb'
                      ? 'Synced with MongoDB workspace collection'
                      : 'Active workspace snapshot library'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSavedDrawerOpen(false)}
                  aria-label="Close saved workspaces drawer"
                  className="rounded-full p-1.5 text-fg-subtle hover:bg-surface-2 hover:text-fg"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-5 border-b border-hairline bg-sunken/60 space-y-3">
                <div className="text-[12px] font-display font-semibold text-fg">
                  Save Snapshot as {identity.name} (@{identity.handle})
                </div>
                <Input
                  placeholder="Snapshot name (e.g. BLDC ESC v3 — 4-layer thermal pass)"
                  value={quickSaveTitle}
                  onChange={(e) => setQuickSaveTitle(e.target.value)}
                />
                <Input
                  placeholder="Bench notes or measurement summary (optional)"
                  value={quickSaveNotes}
                  onChange={(e) => setQuickSaveNotes(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    disabled={saving}
                    onClick={() => void handleQuickSave(false)}
                  >
                    <Save className="size-3.5" aria-hidden="true" />
                    <span>Save Snapshot</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="soft"
                    disabled={saving}
                    onClick={() => void handleQuickSave(true)}
                  >
                    <Share2 className="size-3.5" aria-hidden="true" />
                    <span>Save &amp; Post</span>
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {loadingWorkspaces ? (
                  <p className="text-body-sm text-fg-muted">Loading saved snapshots…</p>
                ) : savedWorkspaces.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-hairline p-6 text-center space-y-2">
                    <p className="text-body-sm font-medium text-fg">No saved snapshots yet</p>
                    <p className="text-[12px] text-fg-muted">
                      Save your current configuration above or directly inside the lab controls.
                    </p>
                  </div>
                ) : (
                  savedWorkspaces.map((ws) => (
                    <div
                      key={ws.workspaceId}
                      className="rounded-xl border border-hairline bg-surface-1 p-3.5 hover:border-accent/40 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-display text-body-sm font-bold text-fg truncate">
                            {ws.title}
                          </div>
                          <div className="text-[11px] text-fg-muted">
                            by {ws.ownerName} (@{ws.ownerHandle}) ·{' '}
                            {new Date(ws.updatedAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteWorkspace(ws.workspaceId)}
                          aria-label={`Delete ${ws.title}`}
                          className="rounded-md p-1 text-fg-subtle hover:bg-danger/10 hover:text-danger-fg shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      {ws.summary && (
                        <p className="text-[12px] text-fg-muted line-clamp-2">{ws.summary}</p>
                      )}
                      {snapshotLoaderRef.current && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            snapshotLoaderRef.current?.(ws);
                            setSavedDrawerOpen(false);
                          }}
                        >
                          Load into Workspace
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </LabShellContext.Provider>
  );
}
