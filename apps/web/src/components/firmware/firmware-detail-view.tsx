'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    navigator.clipboard.writeText(cliSnippet);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/firmware"
          className="inline-flex items-center space-x-1 font-mono text-xs text-stone-400 hover:text-white transition-colors"
        >
          <span>← Back to Firmware Registry</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl border border-amber-500/50 bg-amber-950/20 px-3 py-1 text-xs font-mono font-bold text-amber-400 uppercase">
              {item.targetArch.toUpperCase()}
            </span>
            <span className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1 text-xs font-mono text-stone-400">
              License: {item.openSourceLicense}
            </span>
            <span className="rounded-xl border border-stone-800 bg-stone-900 px-3 py-1 text-xs font-mono text-stone-400">
              {item.category.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={item.sourceRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-mono text-stone-300 hover:text-white transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub Source</span>
            </a>

            <button
              onClick={() => setIsFlasherOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition-all shadow-md"
            >
              <span>Flash Firmware ⚡</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-1 text-sm text-stone-300 font-mono">{item.tagline}</p>
          <p className="mt-3 text-sm text-stone-400 leading-relaxed max-w-4xl">
            {item.description}
          </p>
        </div>

        {/* Author / Maintainer */}
        <div className="flex items-center space-x-3 border-t border-stone-800/80 pt-3 text-xs font-mono text-stone-400">
          <span>Maintainer:</span>
          <span className="font-semibold text-white">{item.author.name}</span>
          {item.author.org && <span className="text-stone-500">({item.author.org})</span>}
          {item.author.verifiedBadge && (
            <span className="rounded-full bg-blue-950/80 border border-blue-500/50 px-2 py-0.5 text-[10px] text-blue-300">
              ✓ Verified Publisher
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Details & Flasher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Release Version Selector & Verification Box */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
              <div>
                <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  ACTIVE RELEASE &amp; CRYPTOGRAPHIC VERIFICATION
                </h3>
                <p className="text-[11px] text-stone-400">
                  Select release stream and verify SHA-256 signature
                </p>
              </div>

              {/* Version dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-stone-400">Release:</span>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-900 px-3 py-1 font-mono text-xs text-white"
                >
                  {item.releases.map((rel) => (
                    <option key={rel.version} value={rel.version}>
                      {rel.version} ({rel.channel}) - {rel.releaseDate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Release specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                <span className="text-stone-500 block text-[10px]">IMAGE SIZE</span>
                <span className="text-white font-bold">{formatFirmwareBytes(activeRelease.fileSizeBytes)}</span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                <span className="text-stone-500 block text-[10px]">FORMAT</span>
                <span className="text-amber-400 font-bold uppercase">{activeRelease.binaryFormat}</span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                <span className="text-stone-500 block text-[10px]">CHANNEL</span>
                <span className="text-emerald-400 font-bold uppercase">{activeRelease.channel}</span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-2.5">
                <span className="text-stone-500 block text-[10px]">BAUD RATE</span>
                <span className="text-sky-400 font-bold">{item.flashBaudRate} baud</span>
              </div>
            </div>

            {/* Checksums */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-[10px] text-stone-500">SHA-256 CHECKSUM</div>
              <div className="rounded-xl border border-stone-800 bg-black p-2.5 text-[11px] text-emerald-400 break-all select-all">
                {activeRelease.sha256}
              </div>
              <div className="text-[10px] text-stone-500">ED25519 RELEASE SIGNATURE</div>
              <div className="rounded-xl border border-stone-800 bg-black p-2.5 text-[11px] text-stone-400 break-all select-all">
                {activeRelease.ed25519Signature}
              </div>
            </div>

            {/* Changelog */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
              <h4 className="text-xs font-mono font-bold text-stone-300">Changelog:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-400">
                {activeRelease.changelog.map((entry, idx) => (
                  <li key={idx}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Flash Partition Visualizer */}
          <PartitionTableVisualizer partitions={item.partitions} />

          {/* Flashing Instructions */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              HARDWARE FLASHING INSTRUCTIONS &amp; STEP-BY-STEP
            </h3>
            <div className="prose prose-invert prose-stone max-w-none text-xs text-stone-300 leading-relaxed">
              <pre className="whitespace-pre-wrap font-sans text-xs text-stone-300">
                {item.instructionsMarkdown}
              </pre>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Board Compatibility & CLI Commands */}
        <div className="space-y-6">
          {/* Supported Boards */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              SUPPORTED HARDWARE BOARDS
            </h3>
            <div className="space-y-2">
              {item.supportedBoards.map((b) => (
                <div
                  key={b}
                  className="flex items-center space-x-2 rounded-xl border border-stone-800 bg-stone-900/60 p-2.5 text-xs font-mono text-stone-200"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CLI Flashing Snippet */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                CLI FLASH COMMAND
              </h3>
              <button
                onClick={copyCliToClipboard}
                className="text-[10px] font-mono text-amber-400 hover:underline"
              >
                {copiedCli ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <div className="relative rounded-xl border border-stone-900 bg-black p-3 font-mono text-[11px] text-stone-300 overflow-x-auto">
              <pre>{cliSnippet}</pre>
            </div>
            <p className="text-[11px] font-mono text-stone-500">
              Run in your local terminal if flashing outside a WebSerial supported browser.
            </p>
          </div>

          {/* Direct Download Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 shadow-sm space-y-3 text-center">
            <h4 className="text-xs font-mono font-bold text-white uppercase">
              DIRECT RAW BINARY
            </h4>
            <p className="text-xs text-stone-400">
              Download compiled image for mass production jig programmers or offline burning.
            </p>
            <a
              href={activeRelease.binaryUrl}
              download
              className="inline-block w-full rounded-xl border border-stone-700 bg-stone-900 py-2.5 text-xs font-mono font-bold text-white hover:bg-stone-800 transition-all"
            >
              Download {activeRelease.version} ({formatFirmwareBytes(activeRelease.fileSizeBytes)})
            </a>
          </div>
        </div>
      </div>

      {/* Flasher Modal */}
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
