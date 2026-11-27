'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useBuilderIdentity } from '@/lib/builder-identity';

export type VentureStageNumber = 1 | 2 | 3 | 4 | 5;

export interface VentureThread {
  id: string;
  title: string;
  sectorId: string;
  sectorLabel: string;
  cityOrCluster?: string;
  currentStage: VentureStageNumber; // 1: Ideate, 2: Learn, 3: Team Up, 4: Build & Mfg, 5: Certify & Export
  problemSlug?: string;
  ideaId?: string;
  projectSlug?: string;
  squadSlug?: string;
  prototypeWorkspaceId?: string;
  pcbWorkspaceId?: string;
  rfqWorkspaceId?: string;
  copilotWorkspaceId?: string;
  testbedLogId?: string;
  exportCorridor?: string;
  completedLearnSlugs: string[];
  bookingIds: string[];
  updatedAt: string;
}

interface VentureContextValue {
  ventures: VentureThread[];
  activeVenture: VentureThread | null;
  selectVenture: (id: string) => void;
  startVenture: (input: {
    title: string;
    sectorId?: string;
    sectorLabel?: string;
    cityOrCluster?: string;
    problemSlug?: string;
    ideaId?: string;
    stage?: VentureStageNumber;
  }) => VentureThread;
  updateActiveVenture: (
    patch: Partial<Omit<VentureThread, 'id' | 'updatedAt'>>,
  ) => VentureThread | null;
  linkWorkspaceToVenture: (
    kind: 'prototype' | 'pcb' | 'rfq' | 'copilot' | 'sim_preset',
    workspaceId: string,
    stage?: VentureStageNumber,
  ) => void;
  markLearnCompleted: (roadmapSlug: string) => void;
}

const STORAGE_KEY = 'hackerland_ventures_v1';
const ACTIVE_KEY = 'hackerland_active_venture_id';

const DEFAULT_SAMPLE_VENTURE: VentureThread = {
  id: 'venture_seed_kaveri_bms',
  title: 'Smart LFP Pack & CAN-FD Controller for 2W Fleets',
  sectorId: 'ev-clean-energy',
  sectorLabel: 'EV, Batteries & Clean Energy',
  cityOrCluster: 'Pune · Chakan',
  currentStage: 4,
  projectSlug: 'aeroglide',
  squadSlug: 'aeroglide',
  completedLearnSlugs: ['embedded-systems'],
  bookingIds: [],
  exportCorridor: 'uae_gcc',
  updatedAt: '2026-11-26T10:00:00.000Z',
};

const VentureContext = createContext<VentureContextValue | null>(null);

export function VentureProvider({ children }: { children: React.ReactNode }) {
  const { identity } = useBuilderIdentity();
  const [ventures, setVentures] = useState<VentureThread[]>([DEFAULT_SAMPLE_VENTURE]);
  const [activeId, setActiveId] = useState<string>(DEFAULT_SAMPLE_VENTURE.id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const savedActive = localStorage.getItem(ACTIVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as VentureThread[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVentures(parsed);
          if (savedActive && parsed.some((v) => v.id === savedActive)) {
            setActiveId(savedActive);
          } else {
            setActiveId(parsed[0]!.id);
          }
        }
      }
    } catch {}
  }, []);

  const persistVentures = useCallback(
    (nextList: VentureThread[], nextActiveId?: string) => {
      setVentures(nextList);
      if (nextActiveId) setActiveId(nextActiveId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
        if (nextActiveId) localStorage.setItem(ACTIVE_KEY, nextActiveId);
      } catch {}

      if (typeof fetch === 'function') {
        void fetch('/api/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync_graph',
            actorHandle: identity.handle,
            actorName: identity.name,
            customMeta: { ventures: nextList.slice(0, 10) },
          }),
        }).catch(() => {});
      }
    },
    [identity.handle, identity.name],
  );

  const activeVenture =
    ventures.find((v) => v.id === activeId) ?? ventures[0] ?? DEFAULT_SAMPLE_VENTURE;

  const selectVenture = useCallback((id: string) => {
    setActiveId(id);
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch {}
  }, []);

  const startVenture = useCallback(
    (input: {
      title: string;
      sectorId?: string;
      sectorLabel?: string;
      cityOrCluster?: string;
      problemSlug?: string;
      ideaId?: string;
      stage?: VentureStageNumber;
    }): VentureThread => {
      const created: VentureThread = {
        id: `venture_${Date.now()}`,
        title: input.title.trim(),
        sectorId: input.sectorId || 'semiconductors-electronics',
        sectorLabel: input.sectorLabel || 'Semiconductors & Electronics',
        cityOrCluster: input.cityOrCluster || 'Pune / Bengaluru',
        currentStage: input.stage ?? 1,
        problemSlug: input.problemSlug,
        ideaId: input.ideaId,
        completedLearnSlugs: [],
        bookingIds: [],
        updatedAt: new Date().toISOString(),
      };
      const next = [created, ...ventures];
      persistVentures(next, created.id);
      return created;
    },
    [persistVentures, ventures],
  );

  const updateActiveVenture = useCallback(
    (patch: Partial<Omit<VentureThread, 'id' | 'updatedAt'>>): VentureThread | null => {
      if (!activeVenture) return null;
      const updated: VentureThread = {
        ...activeVenture,
        ...patch,
        currentStage: patch.currentStage
          ? (Math.max(activeVenture.currentStage, patch.currentStage) as VentureStageNumber)
          : activeVenture.currentStage,
        updatedAt: new Date().toISOString(),
      };
      const next = ventures.map((v) => (v.id === updated.id ? updated : v));
      persistVentures(next, updated.id);
      return updated;
    },
    [activeVenture, persistVentures, ventures],
  );

  const linkWorkspaceToVenture = useCallback(
    (
      kind: 'prototype' | 'pcb' | 'rfq' | 'copilot' | 'sim_preset',
      workspaceId: string,
      stage: VentureStageNumber = 4,
    ) => {
      if (kind === 'prototype') updateActiveVenture({ prototypeWorkspaceId: workspaceId, currentStage: stage });
      if (kind === 'pcb') updateActiveVenture({ pcbWorkspaceId: workspaceId, currentStage: stage });
      if (kind === 'rfq') updateActiveVenture({ rfqWorkspaceId: workspaceId, currentStage: stage });
      if (kind === 'copilot') updateActiveVenture({ copilotWorkspaceId: workspaceId, currentStage: stage });
      if (kind === 'sim_preset') updateActiveVenture({ testbedLogId: workspaceId, currentStage: stage });
    },
    [updateActiveVenture],
  );

  const markLearnCompleted = useCallback(
    (roadmapSlug: string) => {
      if (!activeVenture) return;
      if (activeVenture.completedLearnSlugs.includes(roadmapSlug)) return;
      updateActiveVenture({
        completedLearnSlugs: [...activeVenture.completedLearnSlugs, roadmapSlug],
        currentStage: 2,
      });
    },
    [activeVenture, updateActiveVenture],
  );

  return (
    <VentureContext.Provider
      value={{
        ventures,
        activeVenture,
        selectVenture,
        startVenture,
        updateActiveVenture,
        linkWorkspaceToVenture,
        markLearnCompleted,
      }}
    >
      {children}
    </VentureContext.Provider>
  );
}

const STANDALONE_FALLBACK: VentureContextValue = {
  ventures: [DEFAULT_SAMPLE_VENTURE],
  activeVenture: DEFAULT_SAMPLE_VENTURE,
  selectVenture: () => {},
  startVenture: (input) => ({
    ...DEFAULT_SAMPLE_VENTURE,
    id: `venture_local_${Date.now()}`,
    title: input.title,
  }),
  updateActiveVenture: () => null,
  linkWorkspaceToVenture: () => {},
  markLearnCompleted: () => {},
};

export function useVenture(): VentureContextValue {
  return useContext(VentureContext) ?? STANDALONE_FALLBACK;
}
