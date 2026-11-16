import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FirmwareCatalog } from './firmware-catalog';
import { FirmwareDetailView } from './firmware-detail-view';
import { PartitionTableVisualizer } from './partition-table-visualizer';
import { FIRMWARE_REGISTRY } from '@/lib/data/firmware-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Firmware Registry & Flasher Components', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders FirmwareCatalog with items and search filters', () => {
    act(() => {
      root.render(<FirmwareCatalog initialItems={FIRMWARE_REGISTRY} />);
    });

    expect(container.textContent).toContain('Firmware Registry & WebSerial Flasher');
    expect(container.textContent).toContain('VERIFIED BINARIES');
    expect(container.textContent).toContain('ONE-CLICK FLASH');
    expect(container.textContent).toContain('ArduPilot Copter 4.5.2');
    expect(container.textContent).toContain('Zephyr RTOS AIS-156 EV Smart BMS');
    expect(container.textContent).toContain('MicroPython v1.22');
  });

  it('renders PartitionTableVisualizer and computes memory allocation', () => {
    const samplePartitions = FIRMWARE_REGISTRY[1]?.partitions ?? [];
    act(() => {
      root.render(<PartitionTableVisualizer partitions={samplePartitions} totalFlashBytes={4194304} />);
    });

    expect(container.textContent).toContain('FLASH MEMORY PARTITION MAP');
    expect(container.textContent).toContain('bootloader');
    expect(container.textContent).toContain('partition_table');
    expect(container.textContent).toContain('0x1000');
    expect(container.textContent).toContain('0x8000');
  });

  it('renders FirmwareDetailView with checksum, changelog, and CLI command', () => {
    const item = FIRMWARE_REGISTRY[0]!;
    act(() => {
      root.render(<FirmwareDetailView item={item} />);
    });

    expect(container.textContent).toContain('ArduPilot Copter 4.5.2');
    expect(container.textContent).toContain('ACTIVE RELEASE & CRYPTOGRAPHIC VERIFICATION');
    expect(container.textContent).toContain('SHA-256 CHECKSUM');
    expect(container.textContent).toContain('SUPPORTED HARDWARE BOARDS');
    expect(container.textContent).toContain('Cube Orange+ (STM32H757)');
    expect(container.textContent).toContain('CLI FLASH COMMAND');
  });

  it('filters catalog items when architecture select changes', () => {
    act(() => {
      root.render(<FirmwareCatalog initialItems={FIRMWARE_REGISTRY} />);
    });

    const archSelect = container.querySelectorAll('select')[0] as HTMLSelectElement;
    expect(archSelect).toBeTruthy();

    act(() => {
      archSelect.value = 'stm32';
      archSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('ArduPilot Copter 4.5.2');
    expect(container.textContent).not.toContain('MicroPython v1.22');
  });
});
