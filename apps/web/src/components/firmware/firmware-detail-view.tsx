'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@hackerland/ui';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { FirmwareRegistryItem, FirmwareRelease } from '@hackerland/core';
import { formatFirmwareBytes } from '@hackerland/core';
import { PartitionTableVisualizer } from './partition-table-visualizer';
import { WebSerialFlasherModal } from './webserial-flasher-modal';

interface FirmwareDetailViewProps {
  item: FirmwareRegistryItem;
}

export function FirmwareDetailView({ item }: FirmwareDetailViewProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>(
    item.defaultReleaseVersion || item.releases[0]?.version || 'v1.0.0',
  );
  const [isFlasherOpen, setIsFlasherOpen] = useState<boolean>(false);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const activeRelease: FirmwareRelease =
    item.releases.find((r) => r.version === selectedVersion) ?? item.releases[0]!;

  const cliSnippet =
    item.targetArch === 'esp32s3' || item.targetArch === 'esp32'
      ? `esptool.py --chip ${item.targetArch} -p /dev/ttyUSB0 -b ${item.flashBaudRate} --before default_reset --after hard_reset write_flash \\\n  ${item.partitions[0]?.offsetHex ?? '0x1000'} ${item.slug}-${activeRelease.version}.bin`
      : item.targetArch === 'rp2040'
      ? `picotool load -x ${item.slug}-${activeRelease.version}.uf2`
      : item.targetArch === 'stm32'
      ? `dfu-util -a 0 -s 0x08000000:leave -D ${item.slug}-${activeRelease.version}.bin`
      : `# Flash via openocd or serial bootloader\nopenocd -f interface/ftdi.cfg -f target/${item.targetArch}.cfg -c "program ${item.slug}.bin 0x0 verify reset exit"`;

  const copyCliToClipboard = () => {
    try {
      navigator.clipboard?.writeText(cliSnippet);
    } catch {}
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="space-y-6 min-w-0">
      <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
        <Link
          href="/firmware"
          className="inline-flex items-center gap-1.5 font-mono text-body-xs text-fg-muted hover:text-accent-fg transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Firmware Registry</span>
        </Link>
      </div>

      <Card className="border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="outline">{item.targetArch.toUpperCase()}</Badge>
            <Badge tone="neutral" variant="outline">License: {item.openSourceLicense}</Badge>
            <Badge tone="neutral" variant="outline">{item.category.replace('_', ' ').toUpperCase()}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" size="sm">
              <a href={item.sourceRepoUrl} target="_blank" rel="noopener noreferrer">
                <span>GitHub Source</span>
                <ExternalLink className="size-3.5" />
              </a>
            </Button>

            <Button type="button" variant="primary" size="sm" onClick={() => setIsFlasherOpen(true)}>
              Flash Firmware ⚡
            </Button>
          </div>
        </div>

        <div>
          <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
            {item.title}
          </h1>
          <p className="mt-1 text-body-sm text-accent-fg font-mono">{item.tagline}</p>
          <p className="mt-2 text-body-sm text-fg-muted leading-relaxed">{item.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-hairline pt-3 text-body-xs font-mono text-fg-muted">
          <span>Maintainer:</span>
          <span className="font-semibold text-fg">{item.author.name}</span>
          {item.author.org && <span className="text-fg-subtle">({item.author.org})</span>}
          {item.author.verifiedBadge && (
            <Badge tone="success" variant="outline">✓ Verified Publisher</Badge>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">
                  ACTIVE RELEASE &amp; CRYPTOGRAPHIC VERIFICATION
                </h3>
                <p className="text-[11px] text-fg-muted">
                  Select release stream and inspect SHA-256 signature
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-fg-muted">Release:</span>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="rounded-full border border-line bg-sunken px-3 py-1 font-mono text-xs text-fg focus:border-accent focus:outline-none"
                >
                  {item.releases.map((rel) => (
                    <option key={rel.version} value={rel.version}>
                      {rel.version} ({rel.channel}) - {rel.releaseDate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                <span className="text-fg-subtle block text-[10px]">IMAGE SIZE</span>
                <span className="text-fg font-bold">{formatFirmwareBytes(activeRelease.fileSizeBytes)}</span>
              </div>
              <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                <span className="text-fg-subtle block text-[10px]">FORMAT</span>
                <span className="text-accent-fg font-bold uppercase">{activeRelease.binaryFormat}</span>
              </div>
              <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                <span className="text-fg-subtle block text-[10px]">CHANNEL</span>
                <span className="text-success-fg font-bold uppercase">{activeRelease.channel}</span>
              </div>
              <div className="rounded-xl border border-hairline bg-sunken p-2.5">
                <span className="text-fg-subtle block text-[10px]">BAUD RATE</span>
                <span className="text-fg font-bold">{item.flashBaudRate} baud</span>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-[10px] text-fg-subtle">SHA-256 CHECKSUM</div>
              <div className="rounded-xl border border-hairline bg-sunken p-2.5 text-[11px] text-success-fg font-semibold break-all select-all">
                {activeRelease.sha256}
              </div>
              <div className="text-[10px] text-fg-subtle">ED25519 RELEASE SIGNATURE</div>
              <div className="rounded-xl border border-hairline bg-sunken p-2.5 text-[11px] text-fg-muted break-all select-all">
                {activeRelease.ed25519Signature}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-hairline">
              <h4 className="text-xs font-mono font-bold text-fg">Changelog:</h4>
              <ul className="list-disc list-inside space-y-1 text-body-xs text-fg-muted">
                {activeRelease.changelog.map((entry, idx) => (
                  <li key={idx}>{entry}</li>
                ))}
              </ul>
            </div>
          </Card>

          <PartitionTableVisualizer partitions={item.partitions} />

          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">
              HARDWARE FLASHING INSTRUCTIONS &amp; STEP-BY-STEP
            </h3>
            <pre className="whitespace-pre-wrap font-sans text-body-xs text-fg-muted leading-relaxed">
              {item.instructionsMarkdown}
            </pre>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">
              SUPPORTED HARDWARE BOARDS
            </h3>
            <div className="space-y-2">
              {item.supportedBoards.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-2 rounded-xl border border-hairline bg-sunken p-2.5 text-xs font-mono text-fg"
                >
                  <span className="size-2 rounded-full bg-success shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold tracking-wider text-fg uppercase">
                CLI FLASH COMMAND
              </h3>
              <button
                type="button"
                onClick={copyCliToClipboard}
                className="text-[11px] font-mono text-accent-fg font-semibold hover:underline"
              >
                {copiedCli ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <div className="rounded-xl border border-hairline bg-sunken p-3 font-mono text-[11px] text-fg overflow-x-auto">
              <pre>{cliSnippet}</pre>
            </div>
            <p className="text-[11px] font-mono text-fg-subtle">
              Run locally if flashing outside a WebSerial supported browser.
            </p>
          </Card>

          <Card className="border-hairline bg-surface-1 p-5 shadow-xs space-y-3 text-center">
            <h4 className="text-xs font-mono font-bold text-fg uppercase">DIRECT RAW BINARY</h4>
            <p className="text-body-xs text-fg-muted">
              Download image for mass production jigs or offline flashing.
            </p>
            <Button asChild variant="secondary" size="sm" className="w-full">
              <a href={activeRelease.binaryUrl} download>
                Download {activeRelease.version} ({formatFirmwareBytes(activeRelease.fileSizeBytes)})
              </a>
            </Button>
          </Card>
        </div>
      </div>

      {isFlasherOpen && (
        <WebSerialFlasherModal
          item={item}
          release={activeRelease}
          isOpen={true}
          onClose={() => setIsFlasherOpen(false)}
        />
      )}
    </div>
  );
}
