'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { FirmwareRegistryItem, FirmwareTargetArch, FirmwareCategory } from '@hackerland/core';
import { filterFirmwareRegistry, formatFirmwareBytes } from '@hackerland/core';
import { WebSerialFlasherModal } from './webserial-flasher-modal';

interface FirmwareCatalogProps {
  initialItems: FirmwareRegistryItem[];
}

export function FirmwareCatalog({ initialItems }: FirmwareCatalogProps) {
  const [selectedArch, setSelectedArch] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFlasherItem, setActiveFlasherItem] = useState<FirmwareRegistryItem | null>(null);

  const filteredItems = useMemo(() => {
    return filterFirmwareRegistry(initialItems, {
      targetArch: selectedArch,
      category: selectedCategory,
      search: searchQuery,
    });
  }, [initialItems, selectedArch, selectedCategory, searchQuery]);

  const ARCH_OPTIONS: { id: string; label: string }[] = [
    { id: 'all', label: 'All Architectures' },
    { id: 'esp32s3', label: 'ESP32-S3' },
    { id: 'stm32', label: 'STM32 ARM' },
    { id: 'rp2040', label: 'RP2040' },
    { id: 'riscv_rv32', label: 'RISC-V RV32' },
    { id: 'nrf52', label: 'Nordic nRF52' },
  ];

  const CATEGORY_OPTIONS: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'drone_uav', label: 'Drone & Avionics' },
    { id: 'ev_bms', label: 'EV & Smart BMS' },
    { id: 'lorawan_iot', label: 'LoRaWAN & Mesh' },
    { id: 'rtos', label: 'RTOS & Security' },
    { id: 'micropython', label: 'MicroPython' },
    { id: 'audio_dsp', label: 'TinyML & Audio' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-medium tracking-wider text-emerald-400 uppercase">
              Open-Source Hardware Firmware Registry
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Firmware Registry &amp; WebSerial Flasher
          </h1>
          <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
            Verified, pre-compiled embedded binaries for drone flight controllers, EV battery management systems, indigenous RISC-V silicon, and edge TinyML. Flash directly from your browser over USB without local compiler toolchains.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center space-x-4 font-mono text-xs">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3 text-center">
            <div className="text-stone-500 text-[10px]">VERIFIED BINARIES</div>
            <div className="text-xl font-bold text-white">{initialItems.length}</div>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3 text-center">
            <div className="text-stone-500 text-[10px]">ONE-CLICK FLASH</div>
            <div className="text-xl font-bold text-emerald-400">WebSerial</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <svg className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search firmware by title, board, chip, or author..."
            className="w-full bg-transparent font-mono text-xs text-white placeholder:text-stone-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedArch}
            onChange={(e) => setSelectedArch(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
          >
            {ARCH_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 focus:border-amber-500 focus:outline-none"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Firmware Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center font-mono text-xs text-stone-500">
          No firmware matched your filter criteria. Try clearing search or architecture.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const latestRelease = item.releases[0];
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm transition-all hover:border-stone-700"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg border border-amber-500/40 bg-amber-950/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-400 uppercase">
                      {item.targetArch.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {item.openSourceLicense}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/firmware/${item.slug}`}
                      className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Partition Preview Bar */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-stone-500 flex justify-between">
                      <span>PARTITION LAYOUT</span>
                      <span>{item.partitions.length} partitions</span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded bg-stone-900">
                      {item.partitions.map((part) => (
                        <div
                          key={part.name}
                          style={{
                            width: `${Math.max(5, (part.sizeBytes / 4194304) * 100)}%`,
                            backgroundColor: part.color,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Supported Boards Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.supportedBoards.slice(0, 3).map((b) => (
                      <span
                        key={b}
                        className="rounded-md border border-stone-800 bg-stone-900/60 px-2 py-0.5 text-[10px] font-mono text-stone-400"
                      >
                        {b}
                      </span>
                    ))}
                    {item.supportedBoards.length > 3 && (
                      <span className="rounded-md border border-stone-800 bg-stone-900/60 px-2 py-0.5 text-[10px] font-mono text-stone-500">
                        +{item.supportedBoards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 border-t border-stone-800/80 pt-3 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-stone-400">
                    Version: <strong className="text-white">{latestRelease?.version ?? 'v1.0.0'}</strong>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/firmware/${item.slug}`}
                      className="rounded-xl border border-stone-800 px-3 py-1.5 text-xs font-mono text-stone-400 hover:text-white transition-all"
                    >
                      Docs
                    </Link>
                    <button
                      onClick={() => setActiveFlasherItem(item)}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition-all shadow-sm"
                    >
                      Flash ⚡
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Flasher Modal */}
      {activeFlasherItem && activeFlasherItem.releases[0] && (
        <WebSerialFlasherModal
          item={activeFlasherItem}
          release={activeFlasherItem.releases[0]}
          isOpen={true}
          onClose={() => setActiveFlasherItem(null)}
        />
      )}
    </div>
  );
}
