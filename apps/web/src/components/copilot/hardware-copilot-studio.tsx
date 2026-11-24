'use client';

import { useState, useMemo } from 'react';
import type {
  BomAuditItem,
} from '@hackerland/core';
import {
  calculateIpc2152Trace,
  calculateSmpsBuck,
  calculateThermalHeatsink,
  auditBomItems,
} from '@hackerland/core';
import {
  Search,
  ShieldAlert,
  MessageSquare,
  Calculator,
  Send,
  Flame,
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import {
  HARDWARE_COMPONENTS_CATALOG,
  SAMPLE_BOMS,
  CO_PILOT_PROMPTS,
} from '@/lib/data/copilot-data';

export function HardwareCopilotStudio() {
  const [activeTab, setActiveTab] = useState<'calculators' | 'sourcing' | 'bom_audit' | 'chat'>('calculators');

  // --- CALCULATOR 1: IPC-2152 TRACE STATE ---
  const [traceCurrent, setTraceCurrent] = useState<number>(4.5);
  const [copperWeight, setCopperWeight] = useState<0.5 | 1 | 2 | 3>(1);
  const [tempRise, setTempRise] = useState<number>(10);
  const [isInternal, setIsInternal] = useState<boolean>(false);

  const traceResult = useMemo(() => {
    return calculateIpc2152Trace({
      currentAmps: traceCurrent || 0.1,
      copperWeightOz: copperWeight,
      tempRiseC: tempRise || 1,
      isInternalLayer: isInternal,
    });
  }, [traceCurrent, copperWeight, tempRise, isInternal]);

  // --- CALCULATOR 2: SMPS BUCK STATE ---
  const [buckVin, setBuckVin] = useState<number>(24);
  const [buckVout, setBuckVout] = useState<number>(5.0);
  const [buckIout, setBuckIout] = useState<number>(3.0);
  const [buckFreq, setBuckFreq] = useState<number>(500);

  const buckResult = useMemo(() => {
    return calculateSmpsBuck({
      vinVolts: Math.max(buckVin, buckVout + 0.5),
      voutVolts: buckVout,
      ioutAmps: buckIout,
      freqKhz: buckFreq,
      rippleRatio: 0.3,
    });
  }, [buckVin, buckVout, buckIout, buckFreq]);

  // --- CALCULATOR 3: THERMAL HEATSINK STATE ---
  const [thermalPower, setThermalPower] = useState<number>(8.5);
  const [maxJunction, setMaxJunction] = useState<number>(125);
  const [ambientTemp, setAmbientTemp] = useState<number>(45);
  const [thetaJc, setThetaJc] = useState<number>(2.5);

  const thermalResult = useMemo(() => {
    return calculateThermalHeatsink({
      powerWatts: thermalPower || 0.1,
      maxJunctionTempC: maxJunction,
      ambientTempC: ambientTemp,
      thetaJc: thetaJc,
    });
  }, [thermalPower, maxJunction, ambientTemp, thetaJc]);

  // --- SOURCING SEARCH STATE ---
  const [sourcingQuery, setSourcingQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredComponents = useMemo(() => {
    return HARDWARE_COMPONENTS_CATALOG.filter((comp) => {
      if (selectedCategory !== 'all' && !comp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
      if (sourcingQuery.trim()) {
        const q = sourcingQuery.toLowerCase();
        const m1 = comp.mpn.toLowerCase().includes(q);
        const m2 = comp.manufacturer.toLowerCase().includes(q);
        const m3 = comp.description.toLowerCase().includes(q);
        const m4 = comp.category.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4) return false;
      }
      return true;
    });
  }, [sourcingQuery, selectedCategory]);

  // --- BOM AUDIT STATE ---
  const [bomCsvText, setBomCsvText] = useState(SAMPLE_BOMS[0]!.csvContent);
  const [auditResults, setAuditResults] = useState<BomAuditItem[]>(() => {
    const lines = SAMPLE_BOMS[0]!.csvContent.split('\n').slice(1);
    const parsed = lines
      .map((l) => {
        const parts = l.split(',');
        return { reference: parts[0]?.trim() || '', mpn: parts[1]?.trim() || '' };
      })
      .filter((p) => p.reference && p.mpn);
    return auditBomItems(parsed, HARDWARE_COMPONENTS_CATALOG);
  });

  const handleRunBomAudit = () => {
    const lines = bomCsvText.split('\n');
    const headerIndex = lines.findIndex((l) => l.toLowerCase().includes('mpn'));
    const dataLines = headerIndex >= 0 ? lines.slice(headerIndex + 1) : lines;
    const parsed = dataLines
      .map((l) => {
        const parts = l.split(',');
        return { reference: parts[0]?.trim() || 'R?', mpn: parts[1]?.trim() || parts[0]?.trim() || '' };
      })
      .filter((p) => p.mpn && p.mpn.length > 1);

    const audit = auditBomItems(parsed, HARDWARE_COMPONENTS_CATALOG);
    setAuditResults(audit);
  };

  // --- CHAT STATE ---
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: "👋 I'm your Hardware Engineering Co-Pilot. Ask me about trace ampacity, LDO step-down thermals, decoupling layouts, EMI shielding, or domestic Indian sourcing for microcontrollers and power MOSFETs.",
      timestamp: '21:26',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    const userMsg = { role: 'user' as const, text: q, timestamp: 'Now' };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // Match prompt or generate response
    const matched = CO_PILOT_PROMPTS.find(
      (p) => p.question.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(p.question.toLowerCase().slice(0, 15))
    );

    setTimeout(() => {
      const reply = matched
        ? matched.answer
        : `[Hardware Co-Pilot Analysis]: For "${q}", verify your switching nodes against IPC-2221 electrical clearances. If operating under Indian ambient temperatures (+45°C), ensure thermal junction dissipation does not exceed $T_j < 125°C$. Check our domestic component database for drop-in pin-compatible replacements on Robu or Element14.`;
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, timestamp: 'Now' },
      ]);
    }, 400);
  };

  return (
    <div className="space-y-8 min-w-0">
      {/* Studio Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('calculators')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
            activeTab === 'calculators'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md'
              : 'text-neutral-400 hover:text-white border border-transparent hover:bg-neutral-800/40'
          }`}
        >
          <Calculator className="size-4" />
          <span>⚡ Engineering Calculators</span>
        </button>

        <button
          onClick={() => setActiveTab('sourcing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
            activeTab === 'sourcing'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
              : 'text-neutral-400 hover:text-white border border-transparent hover:bg-neutral-800/40'
          }`}
        >
          <Search className="size-4" />
          <span>🔍 Domestic Indian Sourcing Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('bom_audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
            activeTab === 'bom_audit'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
              : 'text-neutral-400 hover:text-white border border-transparent hover:bg-neutral-800/40'
          }`}
        >
          <ShieldAlert className="size-4" />
          <span>🛡️ BOM Risk Scrubber & Single-Source</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md'
              : 'text-neutral-400 hover:text-white border border-transparent hover:bg-neutral-800/40'
          }`}
        >
          <MessageSquare className="size-4" />
          <span>💬 Hardware Co-Pilot Terminal</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ENGINEERING CALCULATORS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'calculators' && (
        <div className="space-y-8">
          {/* CALCULATOR 1: IPC-2152 TRACE WIDTH */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400">IPC-2152 STANDARD</span>
                <h3 className="text-lg font-bold text-white">PCB Trace Width & Ampacity Sizing</h3>
                <p className="text-xs text-neutral-400">
                  Calculates trace width based on current carrying capacity, copper foil thickness, and temperature rise.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 w-fit">
                IPC-2152 COMPLIANT
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                    <span>Continuous Current (Amperes):</span>
                    <strong className="text-amber-400 font-bold">{traceCurrent} A</strong>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="15.0"
                    step="0.1"
                    value={traceCurrent}
                    onChange={(e) => setTraceCurrent(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Copper Foil Weight</label>
                    <select
                      value={copperWeight}
                      onChange={(e) => setCopperWeight(parseFloat(e.target.value) as any)}
                      className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="0.5">0.5 oz (18 µm)</option>
                      <option value="1">1.0 oz (35 µm standard)</option>
                      <option value="2">2.0 oz (70 µm high current)</option>
                      <option value="3">3.0 oz (105 µm heavy copper)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Max Temp Rise (°C)</label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={tempRise}
                      onChange={(e) => setTempRise(parseFloat(e.target.value) || 10)}
                      className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Internal Layer Trace (Inner plane with reduced convective cooling)</span>
                </label>
              </div>

              {/* Live Output Card */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-4 font-mono text-xs">
                <span className="text-amber-400 font-bold block border-b border-amber-500/20 pb-2">
                  RECOMMENDED TRACE DIMENSIONS:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">WIDTH (MILLIMETERS):</span>
                    <span className="text-2xl font-bold text-white">{traceResult.widthMm} mm</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">WIDTH (MILS / THOU):</span>
                    <span className="text-2xl font-bold text-amber-400">{traceResult.widthMils} mils</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">RESISTANCE / METER:</span>
                    <span className="text-neutral-200">{traceResult.resistancePerMeterOhms} Ω/m</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">POWER LOSS / METER:</span>
                    <span className="text-neutral-200">{traceResult.powerLossWattsPerMeter} W/m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CALCULATOR 2: SMPS BUCK CONVERTER LC SIZING */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400">SWITCH-MODE POWER SUPPLY</span>
                <h3 className="text-lg font-bold text-white">Buck Converter LC Filter Sizing (CCM)</h3>
                <p className="text-xs text-neutral-400">
                  Calculates minimum inductor and output capacitor values for continuous conduction mode.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 w-fit">
                30% RIPPLE CCM
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-neutral-400 mb-1">Input Voltage (Vin)</label>
                  <input
                    type="number"
                    min="3.3"
                    max="100"
                    value={buckVin}
                    onChange={(e) => setBuckVin(parseFloat(e.target.value) || 12)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Output Voltage (Vout)</label>
                  <input
                    type="number"
                    min="1.0"
                    max="48"
                    step="0.1"
                    value={buckVout}
                    onChange={(e) => setBuckVout(parseFloat(e.target.value) || 5)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Load Current (Iout Amps)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="30"
                    step="0.5"
                    value={buckIout}
                    onChange={(e) => setBuckIout(parseFloat(e.target.value) || 3)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Switching Frequency (kHz)</label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    step="50"
                    value={buckFreq}
                    onChange={(e) => setBuckFreq(parseFloat(e.target.value) || 500)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Output Card */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-4 font-mono text-xs">
                <span className="text-cyan-400 font-bold block border-b border-cyan-500/20 pb-2">
                  OPTIMAL INDUCTOR & CAPACITOR VALUES:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">INDUCTOR (L):</span>
                    <span className="text-2xl font-bold text-white">{buckResult.inductanceUh} µH</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">MIN CAPACITANCE (Cout):</span>
                    <span className="text-2xl font-bold text-cyan-400">{buckResult.minOutputCapUf} µF</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">PEAK INDUCTOR CURRENT:</span>
                    <span className="text-neutral-200">{buckResult.peakCurrentAmps} A</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">DUTY CYCLE (D):</span>
                    <span className="text-neutral-200">{(buckResult.dutyCycle * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CALCULATOR 3: THERMAL & HEATSINK SIZING */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-red-400">THERMAL DESIGN</span>
                <h3 className="text-lg font-bold text-white">Heatsink Thermal Resistance Calculator</h3>
                <p className="text-xs text-neutral-400">
                  Size heatsinks for power MOSFETs, motor drivers, and linear regulators under harsh Indian ambient heat (+45°C).
                </p>
              </div>
              <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 w-fit">
                INDIAN SUMMER RATED (+45°C)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-neutral-400 mb-1">Power Dissipated (Watts)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={thermalPower}
                    onChange={(e) => setThermalPower(parseFloat(e.target.value) || 5)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Max Junction Temp Tj (°C)</label>
                  <input
                    type="number"
                    min="85"
                    max="175"
                    value={maxJunction}
                    onChange={(e) => setMaxJunction(parseFloat(e.target.value) || 125)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Ambient Temp Ta (°C)</label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(parseFloat(e.target.value) || 45)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Package Theta JC (°C/W)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={thetaJc}
                    onChange={(e) => setThetaJc(parseFloat(e.target.value) || 2.5)}
                    className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Output */}
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 space-y-4 font-mono text-xs">
                <span className="text-red-400 font-bold block border-b border-red-500/20 pb-2">
                  THERMAL MARGIN & RECOMMENDATION:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">MAX TOTAL THETA:</span>
                    <span className="text-2xl font-bold text-white">{thermalResult.maxTotalTheta} °C/W</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[11px]">REQUIRED HEATSINK θsa:</span>
                    <span className="text-2xl font-bold text-red-400">{thermalResult.requiredHeatsinkTheta} °C/W</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-red-500/20">
                  <span className="text-neutral-400 block text-[11px] mb-1">RECOMMENDED COOLING HARDWARE:</span>
                  <div className="text-white font-sans font-medium text-xs bg-neutral-950 p-2.5 rounded-lg border border-red-500/30 flex items-center gap-2">
                    <Flame className="size-4 text-red-400 shrink-0" />
                    <span>{thermalResult.coolingRecommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOMESTIC INDIAN SOURCING ENGINE                                    */}
      {/* ========================================================================= */}
      {activeTab === 'sourcing' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search ICs by part number (e.g. STM32, ESP32, RP2040, INA219, LoRa, MOSFET)..."
                  value={sourcingQuery}
                  onChange={(e) => setSourcingQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <select
                aria-label="Filter by component category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-300 focus:border-emerald-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Microcontroller">Microcontrollers</option>
                <option value="Wireless">Wireless & RF</option>
                <option value="Regulator">Voltage Regulators</option>
                <option value="Monitor">Sensors & Monitors</option>
                <option value="MOSFET">Power MOSFETs</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
              <span>SHOWING {filteredComponents.length} ELECTRONIC COMPONENTS</span>
              <span>DOMESTIC INR PRICING VERIFIED</span>
            </div>

            {filteredComponents.map((comp) => (
              <div
                key={comp.mpn}
                className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 space-y-4 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-white font-mono">{comp.mpn}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                        {comp.package}
                      </span>
                      {comp.lifecycleStatus === 'active' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ACTIVE PRODUCTION
                        </span>
                      )}
                      {comp.lifecycleStatus === 'nrnd' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          NOT RECOMMENDED FOR NEW DESIGNS (NRND)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {comp.manufacturer} · <span className="text-neutral-500">{comp.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">{comp.description}</p>

                {/* Domestic Indian Distributors */}
                <div className="rounded-xl border border-white/5 bg-neutral-950/60 p-3.5 space-y-2 text-xs font-mono">
                  <span className="text-[11px] text-emerald-400 block font-medium">
                    VERIFIED DOMESTIC INDIAN DISTRIBUTORS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {comp.indianDistributors.map((dist) => (
                      <div
                        key={dist.name}
                        className="p-2.5 rounded-lg bg-neutral-900/80 border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-white font-medium block">{dist.name}</span>
                          <span className="text-[10px] text-emerald-400">₹{dist.priceInr} / unit</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          IN STOCK
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pin Compatible Alternates */}
                {comp.pinCompatibleAlternates.length > 0 && (
                  <div className="pt-2 border-t border-white/5 text-xs">
                    <span className="text-[11px] font-mono text-cyan-400 block mb-1">
                      PIN-COMPATIBLE DROP-IN ALTERNATES:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {comp.pinCompatibleAlternates.map((alt) => (
                        <div
                          key={alt.mpn}
                          className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-white/10 font-mono text-[11px] flex items-center gap-2"
                        >
                          <span className="text-white font-bold">{alt.mpn}</span>
                          <span className="text-neutral-500">({alt.manufacturer})</span>
                          <span className="text-emerald-400">₹{alt.priceInr}</span>
                          <span className="text-[10px] text-neutral-400 font-sans italic">· {alt.notes}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BOM RISK SCRUBBER & AUDITOR                                       */}
      {/* ========================================================================= */}
      {activeTab === 'bom_audit' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="size-4 text-cyan-400" />
                  Bill of Materials (BOM) Single-Source & Obsolescence Auditor
                </h3>
                <p className="text-xs text-neutral-400">
                  Paste your KiCad, Altium, or EasyEDA CSV export to audit for obsolete silicon and domestic Indian distributor shortages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">Load sample:</span>
                {SAMPLE_BOMS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setBomCsvText(preset.csvContent);
                    }}
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition-colors"
                  >
                    {preset.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={6}
              value={bomCsvText}
              onChange={(e) => setBomCsvText(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 focus:border-cyan-500 focus:outline-none"
            />

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleRunBomAudit}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono"
              >
                Run Hardware BOM Audit
              </Button>
            </div>
          </div>

          {/* Audit Output Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
              <span>AUDIT REPORT ({auditResults.length} COMPONENTS INSPECTED)</span>
              <span>DOMESTIC SUPPLY CHAIN RISK</span>
            </div>

            <div className="space-y-2">
              {auditResults.map((audit) => (
                <div
                  key={audit.reference}
                  className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    audit.riskLevel === 'high'
                      ? 'bg-red-500/10 border-red-500/30'
                      : audit.riskLevel === 'medium'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-emerald-500/10 border-emerald-500/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{audit.reference}</span>
                      <span className="font-mono text-neutral-300">{audit.mpn}</span>
                      {audit.riskLevel === 'high' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                          HIGH RISK (EOL)
                        </span>
                      )}
                      {audit.riskLevel === 'medium' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          MEDIUM RISK
                        </span>
                      )}
                      {audit.riskLevel === 'low' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          VERIFIED SAFE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-300">{audit.riskReason}</p>
                  </div>

                  {audit.suggestedReplacement && (
                    <div className="shrink-0 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400">RECOMMENDED DROP-IN:</span>
                      <span className="px-2.5 py-1 rounded bg-neutral-900 border border-cyan-500/30 text-cyan-300 font-bold">
                        {audit.suggestedReplacement}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HARDWARE CO-PILOT CHAT TERMINAL                                    */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          {/* Quick Prompts Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">Ask quick question:</span>
            {CO_PILOT_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSendChat(p.question)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10 transition-colors"
              >
                {p.question.slice(0, 35)}...
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 min-h-[380px] flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl text-xs leading-relaxed max-w-3xl ${
                    msg.role === 'user'
                      ? 'ml-auto bg-purple-600/20 border border-purple-500/30 text-white font-mono'
                      : 'bg-neutral-900/90 border border-white/10 text-neutral-200 font-sans'
                  }`}
                >
                  <div className="text-[10px] font-mono text-neutral-500 mb-1">
                    {msg.role === 'user' ? 'YOU' : 'ANTIGRAVITY HARDWARE CO-PILOT'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-3 pt-4 border-t border-white/10"
            >
              <input
                type="text"
                placeholder="Ask about decoupling capacitors, SMPS inductors, LDO heat, or domestic Indian sourcing..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
              />
              <Button
                type="submit"
                variant="primary"
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono"
              >
                <Send className="size-3.5 mr-1.5" />
                Ask Co-Pilot
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
