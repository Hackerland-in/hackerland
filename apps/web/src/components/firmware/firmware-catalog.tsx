'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@hackerland/ui';
import { Search, Cpu } from 'lucide-react';
import type { FirmwareRegistryItem } from '@hackerland/core';
import { filterFirmwareRegistry } from '@hackerland/core';
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
    <div className="space-y-6 min-w-0">
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[12px] font-display font-semibold text-accent-fg">
              <Cpu className="size-3.5" aria-hidden="true" />
              <span>Open-Source Hardware Firmware Registry</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              Firmware Registry &amp; WebSerial Flasher
            </h1>
            <p className="text-body-sm text-fg-muted max-w-2xl leading-relaxed">
              Verified pre-compiled binaries for flight controllers, EV BMS, indigenous RISC-V silicon, and edge TinyML. Flash straight over USB via WebSerial.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-2.5 text-center">
              <div className="text-fg-subtle text-[10px]">VERIFIED BINARIES</div>
              <div className="text-lg font-bold text-fg">{initialItems.length}</div>
            </div>
            <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-2.5 text-center">
              <div className="text-fg-subtle text-[10px]">ONE-CLICK FLASH</div>
              <div className="text-lg font-bold text-accent-fg">WebSerial</div>
            </div>
          </div>
        </div>
      </header>

      <Card className="border-hairline bg-surface-1 p-3.5 shadow-xs flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search firmware by title, board, chip, or author..."
            className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 font-mono text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedArch}
            onChange={(e) => setSelectedArch(e.target.value)}
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
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
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs font-mono text-fg focus:border-accent focus:outline-none"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {filteredItems.length === 0 ? (
        <Card className="py-12 text-center font-mono text-body-xs text-fg-subtle border-hairline bg-surface-1">
          No firmware matched your filter criteria. Try clearing search or architecture.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const latestRelease = item.releases[0];
            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between border-hairline bg-surface-1 p-5 shadow-xs hover:border-accent/40 transition-all min-w-0 [overflow-wrap:anywhere]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="accent" variant="outline">{item.targetArch.toUpperCase()}</Badge>
                    <span className="text-[11px] font-mono text-fg-subtle">
                      {item.openSourceLicense}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/firmware/${item.slug}`}
                      className="font-display text-body-lg font-bold text-fg hover:text-accent-fg transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-body-xs text-fg-muted line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-fg-subtle flex justify-between">
                      <span>PARTITION LAYOUT</span>
                      <span>{item.partitions.length} partitions</span>
                    </div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-sunken">
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

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.supportedBoards.slice(0, 3).map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-hairline bg-sunken px-2 py-0.5 text-[10px] font-mono text-fg-muted"
                      >
                        {b}
                      </span>
                    ))}
                    {item.supportedBoards.length > 3 && (
                      <span className="rounded-full border border-hairline bg-sunken px-2 py-0.5 text-[10px] font-mono text-fg-subtle">
                        +{item.supportedBoards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-hairline pt-3 flex items-center justify-between gap-2">
                  <div className="font-mono text-[11px] text-fg-muted">
                    Version: <strong className="text-fg">{latestRelease?.version ?? 'v1.0.0'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/firmware/${item.slug}`}>Docs</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveFlasherItem(item)}
                    >
                      Flash ⚡
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

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
