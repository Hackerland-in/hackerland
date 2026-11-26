'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Cpu,
  Download,
  ExternalLink,
  Factory,
  FileCode2,
  Save,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import {
  calculateVendorQuotes,
  type RFQConfig,
  USD_TO_INR,
} from './rfq-types';

export function RFQCalculator() {
  const labShell = useLabShell();
  const [config, setConfig] = useState<RFQConfig>({
    boardName: 'Hackerland-Node-v1',
    widthMm: 100,
    heightMm: 80,
    layers: 2,
    quantity: 10,
    thicknessMm: 1.6,
    solderMask: 'green',
    silkscreen: 'white',
    surfaceFinish: 'hasl',
    copperWeight: '1oz',
    pcbAssembly: false,
    componentsCount: 24,
  });

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [uploadedGerberName, setUploadedGerberName] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const fileInputId = useId();

  const quotes = calculateVendorQuotes(config);

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `${config.boardName} (${config.layers}L · ${config.quantity} pcs)`,
        summary: `${config.widthMm}x${config.heightMm}mm, ${config.surfaceFinish.toUpperCase()} finish. Best landed quote: ₹${quotes[0]?.totalInr?.toLocaleString('en-IN') ?? '—'}.`,
        tags: ['rfq', `${config.layers}-layer`],
        payload: { config, currency },
      }),
      onLoad: (ws) => {
        const savedCfg = ws.payload?.config as Partial<RFQConfig> | undefined;
        if (savedCfg && typeof savedCfg === 'object') {
          setConfig((prev) => ({ ...prev, ...savedCfg }));
        }
        if (ws.payload?.currency === 'INR' || ws.payload?.currency === 'USD') {
          setCurrency(ws.payload.currency);
        }
      },
    });
  }, [labShell, config, currency, quotes]);

  const handleSaveQuoteToDb = async () => {
    if (!labShell) return;
    await labShell.saveWorkspace({
      title: `${config.boardName} (${config.layers}L RFQ)`,
      summary: `${config.widthMm}x${config.heightMm}mm · Qty ${config.quantity} · Best quote: ₹${quotes[0]?.totalInr?.toLocaleString('en-IN') ?? '—'}`,
      tags: ['rfq', `${config.layers}-layer`],
      payload: { config, currency, quotes },
    });
    setSavedBanner('RFQ quote configuration saved to workspace history!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedGerberName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setConfig((prev) => ({ ...prev, boardName: cleanName }));
    }
  };

  const handleDownloadSpec = () => {
    const spec = `HACKERLAND INSTANT PCB RFQ SPECIFICATION SHEET
Generated: ${new Date().toISOString()}
============================================================
Project Name: ${config.boardName}
Board Dimensions: ${config.widthMm} mm x ${config.heightMm} mm
Layer Count: ${config.layers} Layers
Quantity: ${config.quantity} pcs
Board Thickness: ${config.thicknessMm} mm
Solder Mask: ${config.solderMask}
Silkscreen: ${config.silkscreen}
Surface Finish: ${config.surfaceFinish.toUpperCase()}
Copper Weight: ${config.copperWeight}
SMD Assembly Required: ${config.pcbAssembly ? `YES (${config.componentsCount} components/board)` : 'NO (Bare PCB only)'}

FABRICATION VENDOR COMPARISON:
------------------------------------------------------------
${quotes
  .map(
    (q) =>
      `• ${q.name} (${q.country} - ${q.location})
  Turnaround: ${q.turnaroundDays}
  Base Cost: ${currency === 'INR' ? `₹${q.pcbCostInr}` : `$${q.pcbCostUsd}`}
  Shipping: ${currency === 'INR' ? `₹${q.shippingInr}` : `$${q.shippingUsd}`}
  Duties/Tax: ${currency === 'INR' ? `₹${q.customsTaxInr}` : `$${q.customsTaxUsd}`}
  ESTIMATED TOTAL: ${currency === 'INR' ? `₹${q.totalInr}` : `$${q.totalUsd}`}`,
  )
  .join('\n\n')}
============================================================
Ready for instant ordering at https://www.hackerland.in/manufacturing/rfq
`;

    const blob = new Blob([spec], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.boardName}-RFQ-Spec.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-accent/25 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent-fg border border-accent/25">
              <Sparkles className="w-3.5 h-3.5" /> Direct Fab Integration
            </div>
            <h2 className="font-display text-xl font-bold text-fg">
              Compare Indian &amp; Global PCB Fabricators In Seconds
            </h2>
            <p className="text-sm text-fg-muted">
              Zero guessing on customs duty, import delays, or GST invoicing. Import dimensions directly from PCB Studio.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/manufacturing/pcb"
              className="px-3.5 py-2 rounded-full bg-surface-1 hover:bg-surface-2 text-xs font-semibold text-fg transition flex items-center gap-1.5 border border-hairline shadow-xs"
            >
              <Cpu className="w-4 h-4 text-accent" /> Open PCB Studio
            </Link>
            <div className="flex rounded-full bg-sunken border border-hairline p-0.5">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  currency === 'INR' ? 'bg-accent text-on-solid shadow-xs' : 'text-fg-muted hover:text-fg'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  currency === 'USD' ? 'bg-accent text-on-solid shadow-xs' : 'text-fg-muted hover:text-fg'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 space-y-4 shadow-xs">
            <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
              <Factory className="w-4 h-4 text-accent" /> 1. Board Specifications
            </h3>

            {/* Gerber Upload */}
            <div className="rounded-xl border border-dashed border-accent/35 bg-sunken/70 p-4 text-center hover:border-accent transition-colors">
              <input
                type="file"
                id={fileInputId}
                accept=".zip,.rar,.tar,.gz,.gerber"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor={fileInputId} className="cursor-pointer block">
                <FileCode2 className="w-7 h-7 text-accent mx-auto mb-1.5" />
                <span className="text-sm font-semibold text-accent-fg hover:underline">
                  {uploadedGerberName ? uploadedGerberName : 'Upload Gerber ZIP (Optional)'}
                </span>
                <p className="text-xs text-fg-subtle mt-1">
                  Drop RS-274X archive from PCB Studio or KiCad
                </p>
              </label>
            </div>

            {/* Board Name */}
            <div>
              <label className="block text-xs font-semibold text-fg-muted mb-1">Project / Board Title</label>
              <input
                type="text"
                value={config.boardName}
                onChange={(e) => setConfig({ ...config, boardName: e.target.value })}
                className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
              />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Width (mm)</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={config.widthMm}
                  onChange={(e) => setConfig({ ...config, widthMm: Number(e.target.value) || 10 })}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Height (mm)</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={config.heightMm}
                  onChange={(e) => setConfig({ ...config, heightMm: Number(e.target.value) || 10 })}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Layers & Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Layers</label>
                <select
                  value={config.layers}
                  onChange={(e) => setConfig({ ...config, layers: Number(e.target.value) as 1 | 2 | 4 | 6 })}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                >
                  <option value={1}>1 Layer (Single)</option>
                  <option value={2}>2 Layers (Standard)</option>
                  <option value={4}>4 Layers (Dense SMD)</option>
                  <option value={6}>6 Layers (RF / High-speed)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Quantity (pcs)</label>
                <select
                  value={config.quantity}
                  onChange={(e) => setConfig({ ...config, quantity: Number(e.target.value) })}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                >
                  <option value={5}>5 pcs (Prototype)</option>
                  <option value={10}>10 pcs (Recommended)</option>
                  <option value={25}>25 pcs</option>
                  <option value={50}>50 pcs (Batch run)</option>
                  <option value={100}>100 pcs</option>
                  <option value={500}>500 pcs (Production)</option>
                </select>
              </div>
            </div>

            {/* Surface Finish & Solder Mask */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Surface Finish</label>
                <select
                  value={config.surfaceFinish}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      surfaceFinish: e.target.value as 'hasl' | 'lead_free_hasl' | 'enig',
                    })
                  }
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                >
                  <option value="hasl">HASL (Lead)</option>
                  <option value="lead_free_hasl">Lead-Free HASL (RoHS)</option>
                  <option value="enig">ENIG Gold (Immersion)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Solder Mask Color</label>
                <select
                  value={config.solderMask}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      solderMask: e.target.value as RFQConfig['solderMask'],
                    })
                  }
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                >
                  <option value="green">Classic Green</option>
                  <option value="black">Matte Black</option>
                  <option value="blue">Royal Blue</option>
                  <option value="red">Ferrari Red</option>
                  <option value="purple">OSH Park Purple</option>
                  <option value="white">Clean White</option>
                </select>
              </div>
            </div>

            {/* Thickness & Copper */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Board Thickness</label>
                <select
                  value={config.thicknessMm}
                  onChange={(e) => setConfig({ ...config, thicknessMm: Number(e.target.value) })}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                >
                  <option value={0.8}>0.8 mm (Slim/Keyboards)</option>
                  <option value={1.2}>1.2 mm</option>
                  <option value={1.6}>1.6 mm (Standard)</option>
                  <option value={2.0}>2.0 mm (Heavy duty)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1">Copper Weight</label>
                <select
                  value={config.copperWeight}
                  onChange={(e) => setConfig({ ...config, copperWeight: e.target.value as '1oz' | '2oz' })}
                  className="w-full rounded-xl bg-sunken border border-line px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent"
                >
                  <option value="1oz">1 oz (Standard Logic)</option>
                  <option value="2oz">2 oz (Power / Motor Driver)</option>
                </select>
              </div>
            </div>

            {/* Assembly Toggle */}
            <div className="pt-3 border-t border-hairline space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.pcbAssembly}
                  onChange={(e) => setConfig({ ...config, pcbAssembly: e.target.checked })}
                  className="rounded border-line bg-surface-1 accent-accent w-4 h-4"
                />
                <span className="text-sm font-medium text-fg">
                  Include SMD Component Assembly (PCBA)
                </span>
              </label>

              {config.pcbAssembly && (
                <div className="pl-7">
                  <label className="block text-xs font-semibold text-fg-muted mb-1">
                    Unique SMD Components / Board
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={config.componentsCount}
                    onChange={(e) => setConfig({ ...config, componentsCount: Number(e.target.value) || 1 })}
                    className="w-full rounded-xl bg-sunken border border-line px-3 py-1.5 text-sm text-fg focus:outline-none focus:border-accent"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button type="button" variant="primary" className="flex-1" onClick={handleDownloadSpec}>
                <Download className="w-4 h-4" /> Download RFQ Spec (.txt)
              </Button>
              {labShell && (
                <Button type="button" variant="secondary" onClick={() => void handleSaveQuoteToDb()}>
                  <Save className="w-4 h-4" /> Save Quote
                </Button>
              )}
            </div>
            {savedBanner && (
              <p role="status" className="text-xs font-medium text-success-fg">
                {savedBanner}
              </p>
            )}
          </div>
        </div>

        {/* Quotes Comparison */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" /> 2. Live Vendor Quotes &amp; Landed Cost
            </h3>
            <span className="text-xs font-mono text-fg-muted">
              1 USD ≈ ₹{USD_TO_INR}
            </span>
          </div>

          <div className="space-y-4">
            {quotes.map((q) => {
              const isRecommended = q.vendorId === 'lioncircuits';
              return (
                <div
                  key={q.vendorId}
                  className={`rounded-2xl border p-5 transition shadow-xs ${
                    isRecommended
                      ? 'border-accent/45 bg-gradient-to-br from-surface-1 to-accent-soft/50'
                      : 'border-hairline bg-surface-1 hover:border-accent/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-fg text-base">{q.name}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-sunken text-fg-muted border border-hairline">
                          {q.country} · {q.location}
                        </span>
                        {isRecommended && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent-fg font-semibold border border-accent/30">
                            ★ {q.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-fg-muted flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-fg-subtle" /> Lead time: {q.turnaroundDays}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-accent-fg font-display">
                        {currency === 'INR' ? `₹${q.totalInr.toLocaleString('en-IN')}` : `$${q.totalUsd}`}
                      </div>
                      <div className="text-xs text-fg-subtle">Estimated Total Landed</div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-hairline text-xs">
                    <div>
                      <span className="text-fg-subtle block">PCB Fabrication:</span>
                      <span className="text-fg font-semibold">
                        {currency === 'INR' ? `₹${q.pcbCostInr.toLocaleString('en-IN')}` : `$${q.pcbCostUsd}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-fg-subtle block">Shipping:</span>
                      <span className="text-fg font-semibold">
                        {currency === 'INR' ? `₹${q.shippingInr}` : `$${q.shippingUsd}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-fg-subtle block">
                        {q.country === 'India' ? 'GST (18% Input Credit):' : 'Customs & IGST (~42%):'}
                      </span>
                      <span className="text-fg font-semibold">
                        {currency === 'INR' ? `₹${q.customsTaxInr.toLocaleString('en-IN')}` : `$${q.customsTaxUsd}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <ul className="text-xs text-fg-muted space-y-0.5">
                      {q.pros.map((pro) => (
                        <li key={pro} className="flex items-center gap-1.5">
                          <span className="text-success-fg font-bold">✓</span> {pro}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={q.instantUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-surface-2 hover:bg-accent hover:text-on-solid text-fg text-xs font-semibold transition border border-hairline whitespace-nowrap"
                    >
                      Instant Quote on {q.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
