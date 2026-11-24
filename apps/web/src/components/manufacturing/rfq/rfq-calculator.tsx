'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import {
  Factory,
  Truck,
  Download,
  ExternalLink,
  Cpu,
  Clock,
  Sparkles,
  FileCode2,
} from 'lucide-react';
import {
  calculateVendorQuotes,
  type RFQConfig,
  USD_TO_INR,
} from './rfq-types';

export function RFQCalculator() {
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
  const fileInputId = useId();

  const quotes = calculateVendorQuotes(config);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedGerberName(file.name);
      // Auto-populate board name from file
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
  ESTIMATED TOTAL: ${currency === 'INR' ? `₹${q.totalInr}` : `$${q.totalUsd}`}`
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
    <div className="space-y-10">
      {/* Top Banner / Context */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-3.5 h-3.5" /> Direct Fab Integration
            </div>
            <h2 className="text-xl font-bold text-white">Compare Indian & Global PCB Fabricators In Seconds</h2>
            <p className="text-sm text-neutral-400">
              Zero guessing on customs duty, import delays, or GST invoicing. Seamlessly import from Hackerland PCB Studio.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/manufacturing/pcb"
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-medium text-white transition flex items-center gap-2 border border-neutral-700"
            >
              <Cpu className="w-4 h-4 text-emerald-400" /> Open PCB Studio
            </Link>
            <div className="flex rounded-lg bg-neutral-900 border border-neutral-800 p-0.5">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  currency === 'INR' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  currency === 'USD' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Factory className="w-4 h-4 text-emerald-400" /> 1. Board Specifications
            </h3>

            {/* Gerber Upload Simulation */}
            <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950/60 p-4 text-center">
              <input
                type="file"
                id={fileInputId}
                accept=".zip,.rar,.tar,.gz,.gerber"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor={fileInputId} className="cursor-pointer block">
                <FileCode2 className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-emerald-400 hover:underline">
                  {uploadedGerberName ? uploadedGerberName : 'Upload Gerber ZIP (Optional)'}
                </span>
                <p className="text-xs text-neutral-500 mt-1">
                  Drag and drop your RS-274X zip from PCB Studio or KiCad
                </p>
              </label>
            </div>

            {/* Board Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Project / Board Title</label>
              <input
                type="text"
                value={config.boardName}
                onChange={(e) => setConfig({ ...config, boardName: e.target.value })}
                className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Width (mm)</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={config.widthMm}
                  onChange={(e) => setConfig({ ...config, widthMm: Number(e.target.value) || 10 })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Height (mm)</label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={config.heightMm}
                  onChange={(e) => setConfig({ ...config, heightMm: Number(e.target.value) || 10 })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Layers & Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Layers</label>
                <select
                  value={config.layers}
                  onChange={(e) => setConfig({ ...config, layers: Number(e.target.value) as 1 | 2 | 4 | 6 })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>1 Layer (Single)</option>
                  <option value={2}>2 Layers (Standard)</option>
                  <option value={4}>4 Layers (Dense SMD)</option>
                  <option value={6}>6 Layers (RF / High-speed)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Quantity (pcs)</label>
                <select
                  value={config.quantity}
                  onChange={(e) => setConfig({ ...config, quantity: Number(e.target.value) })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-medium text-neutral-400 mb-1">Surface Finish</label>
                <select
                  value={config.surfaceFinish}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      surfaceFinish: e.target.value as 'hasl' | 'lead_free_hasl' | 'enig',
                    })
                  }
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="hasl">HASL (Lead)</option>
                  <option value="lead_free_hasl">Lead-Free HASL (RoHS)</option>
                  <option value="enig">ENIG Gold (Immersion)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Solder Mask Color</label>
                <select
                  value={config.solderMask}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      solderMask: e.target.value as RFQConfig['solderMask'],
                    })
                  }
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-medium text-neutral-400 mb-1">Board Thickness</label>
                <select
                  value={config.thicknessMm}
                  onChange={(e) => setConfig({ ...config, thicknessMm: Number(e.target.value) })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={0.8}>0.8 mm (Slim/Keyboards)</option>
                  <option value={1.2}>1.2 mm</option>
                  <option value={1.6}>1.6 mm (Standard)</option>
                  <option value={2.0}>2.0 mm (Heavy duty)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Copper Weight</label>
                <select
                  value={config.copperWeight}
                  onChange={(e) => setConfig({ ...config, copperWeight: e.target.value as '1oz' | '2oz' })}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="1oz">1 oz (Standard Logic)</option>
                  <option value="2oz">2 oz (Power / Motor Driver)</option>
                </select>
              </div>
            </div>

            {/* Assembly Toggle */}
            <div className="pt-2 border-t border-neutral-800 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.pcbAssembly}
                  onChange={(e) => setConfig({ ...config, pcbAssembly: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-0 w-4 h-4"
                />
                <span className="text-sm font-medium text-neutral-300">
                  Include SMD Component Assembly (PCBA)
                </span>
              </label>

              {config.pcbAssembly && (
                <div className="pl-7">
                  <label className="block text-xs font-medium text-neutral-400 mb-1">
                    Unique SMD Components / Board
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={config.componentsCount}
                    onChange={(e) => setConfig({ ...config, componentsCount: Number(e.target.value) || 1 })}
                    className="w-full rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Download Spec Button */}
            <button
              type="button"
              onClick={handleDownloadSpec}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <Download className="w-4 h-4" /> Download RFQ Spec Package (.txt)
            </button>
          </div>
        </div>

        {/* Quotes Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" /> 2. Live Vendor Quotes & Landed Cost
            </h3>
            <span className="text-xs text-neutral-400">
              Exchange rate: 1 USD ≈ ₹{USD_TO_INR}
            </span>
          </div>

          <div className="space-y-4">
            {quotes.map((q) => {
              const isRecommended = q.vendorId === 'lioncircuits';
              return (
                <div
                  key={q.vendorId}
                  className={`rounded-2xl border p-5 transition ${
                    isRecommended
                      ? 'border-emerald-500/50 bg-emerald-950/10 shadow-lg shadow-emerald-500/5'
                      : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{q.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                          {q.country} • {q.location}
                        </span>
                        {isRecommended && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40">
                            ★ {q.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-500" /> Lead time: {q.turnaroundDays}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400">
                        {currency === 'INR' ? `₹${q.totalInr.toLocaleString('en-IN')}` : `$${q.totalUsd}`}
                      </div>
                      <div className="text-xs text-neutral-400">Estimated Total Landed</div>
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-800/80 text-xs">
                    <div>
                      <span className="text-neutral-500 block">PCB Fabrication:</span>
                      <span className="text-neutral-200 font-medium">
                        {currency === 'INR' ? `₹${q.pcbCostInr.toLocaleString('en-IN')}` : `$${q.pcbCostUsd}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Shipping:</span>
                      <span className="text-neutral-200 font-medium">
                        {currency === 'INR' ? `₹${q.shippingInr}` : `$${q.shippingUsd}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">
                        {q.country === 'India' ? 'GST (18% Input Credit):' : 'Customs & Import IGST (~42%):'}
                      </span>
                      <span className="text-neutral-200 font-medium">
                        {currency === 'INR' ? `₹${q.customsTaxInr.toLocaleString('en-IN')}` : `$${q.customsTaxUsd}`}
                      </span>
                    </div>
                  </div>

                  {/* Highlights and Direct Link */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <ul className="text-xs text-neutral-400 space-y-0.5">
                      {q.pros.map((pro) => (
                        <li key={pro} className="flex items-center gap-1.5">
                          <span className="text-emerald-400">✓</span> {pro}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={q.instantUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition border border-neutral-700 whitespace-nowrap"
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
