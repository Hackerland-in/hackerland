import { z } from 'zod';

export const firmwareTargetArchSchema = z.enum([
  'esp32',
  'esp32s3',
  'esp32c3',
  'rp2040',
  'rp2350',
  'stm32',
  'nrf52',
  'riscv_rv32',
  'avr',
]);
export type FirmwareTargetArch = z.infer<typeof firmwareTargetArchSchema>;

export const firmwareCategorySchema = z.enum([
  'drone_uav',
  'ev_bms',
  'lorawan_iot',
  'robotics',
  'micropython',
  'rtos',
  'audio_dsp',
]);
export type FirmwareCategory = z.infer<typeof firmwareCategorySchema>;

export const firmwareReleaseChannelSchema = z.enum(['stable', 'beta', 'nightly']);
export type FirmwareReleaseChannel = z.infer<typeof firmwareReleaseChannelSchema>;

export const firmwareBinaryFormatSchema = z.enum(['bin', 'hex', 'uf2', 'elf']);
export type FirmwareBinaryFormat = z.infer<typeof firmwareBinaryFormatSchema>;

export const firmwarePartitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  subType: z.string(),
  offsetHex: z.string(),
  sizeBytes: z.number(),
  color: z.string(),
});
export type FirmwarePartition = z.infer<typeof firmwarePartitionSchema>;

export const firmwareReleaseSchema = z.object({
  version: z.string(),
  channel: firmwareReleaseChannelSchema,
  releaseDate: z.string(),
  binaryUrl: z.string(),
  binaryFormat: firmwareBinaryFormatSchema,
  fileSizeBytes: z.number(),
  sha256: z.string(),
  ed25519Signature: z.string(),
  changelog: z.array(z.string()),
});
export type FirmwareRelease = z.infer<typeof firmwareReleaseSchema>;

export const firmwareRegistryItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  targetArch: firmwareTargetArchSchema,
  supportedBoards: z.array(z.string()),
  category: firmwareCategorySchema,
  openSourceLicense: z.string(),
  sourceRepoUrl: z.string(),
  author: z.object({
    name: z.string(),
    org: z.string().optional(),
    verifiedBadge: z.boolean(),
    github: z.string().optional(),
  }),
  flashBaudRate: z.number().default(115200),
  partitions: z.array(firmwarePartitionSchema),
  releases: z.array(firmwareReleaseSchema),
  defaultReleaseVersion: z.string(),
  instructionsMarkdown: z.string(),
});
export type FirmwareRegistryItem = z.infer<typeof firmwareRegistryItemSchema>;

/**
 * Calculates total flash memory footprint, checks for partition overlaps,
 * and computes free headroom on standard flash chip sizes (e.g. 4MB, 8MB, 16MB).
 */
export function calculateFlashPartitionLayout(
  partitions: FirmwarePartition[],
  totalFlashBytes: number = 4 * 1024 * 1024, // default 4MB flash
): {
  totalAllocatedBytes: number;
  totalAllocatedKb: number;
  freeBytes: number;
  freeKb: number;
  utilizationPercent: number;
  hasOverlap: boolean;
  warnings: string[];
} {
  let totalAllocated = 0;
  const warnings: string[] = [];
  let hasOverlap = false;

  // Sort partitions by numeric offset
  const sorted = [...partitions].sort((a, b) => {
    const offA = Number.parseInt(a.offsetHex, 16);
    const offB = Number.parseInt(b.offsetHex, 16);
    return offA - offB;
  });

  for (let i = 0; i < sorted.length; i++) {
    const part = sorted[i]!;
    const offset = Number.parseInt(part.offsetHex, 16);
    totalAllocated += part.sizeBytes;

    if (i > 0) {
      const prev = sorted[i - 1]!;
      const prevEnd = Number.parseInt(prev.offsetHex, 16) + prev.sizeBytes;
      if (offset < prevEnd) {
        hasOverlap = true;
        warnings.push(
          `Overlap detected: '${part.name}' at ${part.offsetHex} collides with '${prev.name}' (ends at 0x${prevEnd.toString(16)})`,
        );
      }
    }
  }

  const freeBytes = Math.max(0, totalFlashBytes - totalAllocated);
  const utilizationPercent = Number(((totalAllocated / totalFlashBytes) * 100).toFixed(1));

  if (totalAllocated > totalFlashBytes) {
    warnings.push(
      `Firmware memory layout exceeds target flash size (${(totalAllocated / 1024).toFixed(0)} KB > ${(totalFlashBytes / 1024).toFixed(0)} KB)`,
    );
  }

  return {
    totalAllocatedBytes: totalAllocated,
    totalAllocatedKb: Math.round(totalAllocated / 1024),
    freeBytes,
    freeKb: Math.round(freeBytes / 1024),
    utilizationPercent,
    hasOverlap,
    warnings,
  };
}

/**
 * Filter and search firmware registry items by target architecture, domain category, or text search.
 */
export function filterFirmwareRegistry(
  items: FirmwareRegistryItem[],
  filters: { targetArch?: string; category?: string; search?: string },
): FirmwareRegistryItem[] {
  return items.filter((item) => {
    if (filters.targetArch && filters.targetArch !== 'all' && item.targetArch !== filters.targetArch) {
      return false;
    }
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTagline = item.tagline.toLowerCase().includes(q);
      const matchBoards = item.supportedBoards.some((b) => b.toLowerCase().includes(q));
      const matchAuthor = item.author.name.toLowerCase().includes(q);
      if (!matchTitle && !matchTagline && !matchBoards && !matchAuthor) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Helper to human-format byte counts into KB or MB.
 */
export function formatFirmwareBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
