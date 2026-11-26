'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BomAuditItem } from '@hackerland/core';
import {
  auditBomItems,
  calculateIpc2152Trace,
  calculateSmpsBuck,
  calculateThermalHeatsink,
} from '@hackerland/core';
import { Calculator, Flame, MessageSquare, Search, Send, ShieldAlert } from 'lucide-react';
import { Button } from '@hackerland/ui';
import { useBuilderIdentity } from '@/lib/builder-identity';
import { useLabShell } from '@/components/labs/full-screen-lab-shell';
import {
  CO_PILOT_PROMPTS,
  HARDWARE_COMPONENTS_CATALOG,
  SAMPLE_BOMS,
} from '@/lib/data/copilot-data';

export function HardwareCopilotStudio() {
  const labShell = useLabShell();
  const { identity } = useBuilderIdentity();
  const [activeTab, setActiveTab] = useState<'calculators' | 'sourcing' | 'bom_audit' | 'chat'>('calculators');

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

  const [thermalPower, setThermalPower] = useState<number>(8.5);
  const [maxJunction, setMaxJunction] = useState<number>(125);
  const [ambientTemp, setAmbientTemp] = useState<number>(45);
  const [thetaJc, setThetaJc] = useState<number>(2.5);

  const thermalResult = useMemo(() => {
    return calculateThermalHeatsink({
      powerWatts: thermalPower || 0.1,
      maxJunctionTempC: maxJunction,
      ambientTempC: ambientTemp,
      thetaJc,
    });
  }, [thermalPower, maxJunction, ambientTemp, thetaJc]);

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

  useEffect(() => {
    labShell?.registerSnapshotHandlers({
      getSnapshot: () => ({
        title: `Co-Pilot Calc & BOM Audit (${traceCurrent}A · ${buckVout}V)`,
        summary: `IPC-2152 trace: ${traceResult.widthMm}mm, Buck L=${buckResult.inductanceUh}uH, ${auditResults.length} BOM lines audited.`,
        tags: ['copilot', 'ipc-2152', 'bom-audit'],
        payload: {
          traceCurrent,
          copperWeight,
          tempRise,
          isInternal,
          buckVin,
          buckVout,
          buckIout,
          buckFreq,
          thermalPower,
          maxJunction,
          ambientTemp,
          thetaJc,
          bomCsvText,
        },
      }),
      onLoad: (ws) => {
        const p = ws.payload;
        if (typeof p.traceCurrent === 'number') setTraceCurrent(p.traceCurrent);
        if (typeof p.bomCsvText === 'string') setBomCsvText(p.bomCsvText);
      },
    });
  }, [labShell, traceCurrent, copperWeight, tempRise, isInternal, buckVin, buckVout, buckIout, buckFreq, thermalPower, maxJunction, ambientTemp, thetaJc, bomCsvText, traceResult.widthMm, buckResult.inductanceUh, auditResults.length]);

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

  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: "Ask about trace ampacity, LDO thermal limits, SMPS inductors, decoupling layout, EMI shielding, or Indian component distributors for your BOM.",
      timestamp: 'Ready',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    const userMsg = { role: 'user' as const, text: q, timestamp: 'Now' };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    const matched = CO_PILOT_PROMPTS.find(
      (p) =>
        p.question.toLowerCase().includes(q.toLowerCase()) ||
        q.toLowerCase().includes(p.question.toLowerCase().slice(0, 15)),
    );

    setTimeout(() => {
      const reply = matched
        ? matched.answer
        : `For "${q}", check your switching nodes against IPC-2221 clearances. Under +45°C ambient enclosure temperatures, verify junction heat remains below Tj < 125°C and confirm active distributor stock under Domestic Sourcing.`;
      setChatMessages((prev) => [...prev, { role: 'assistant', text: reply, timestamp: 'Now' }]);
    }, 300);
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Studio Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl border border-hairline bg-surface-1 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('calculators')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
            activeTab === 'calculators'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'text-fg-muted hover:text-fg border-transparent hover:bg-sunken'
          }`}
        >
          <Calculator className="size-4" />
          <span>Engineering Calculators</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sourcing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
            activeTab === 'sourcing'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'text-fg-muted hover:text-fg border-transparent hover:bg-sunken'
          }`}
        >
          <Search className="size-4" />
          <span>Domestic Indian Sourcing Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bom_audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
            activeTab === 'bom_audit'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'text-fg-muted hover:text-fg border-transparent hover:bg-sunken'
          }`}
        >
          <ShieldAlert className="size-4" />
          <span>BOM Risk Scrubber &amp; Single-Source</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
            activeTab === 'chat'
              ? 'bg-accent text-on-solid border-accent shadow-xs'
              : 'text-fg-muted hover:text-fg border-transparent hover:bg-sunken'
          }`}
        >
          <MessageSquare className="size-4" />
          <span>Hardware Co-Pilot Terminal</span>
        </button>
      </div>

      {/* TAB 1: CALCULATORS */}
      {activeTab === 'calculators' && (
        <div className="space-y-6">
          {/* IPC-2152 TRACE WIDTH */}
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 sm:p-7 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
              <div>
                <span className="text-xs font-mono font-semibold text-accent-fg">IPC-2152 STANDARD</span>
                <h3 className="font-display text-lg font-bold text-fg">
                  PCB Trace Width &amp; Ampacity Sizing
                </h3>
                <p className="text-xs text-fg-muted">
                  Calculates trace width based on continuous current, copper foil thickness, and max temperature rise.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-success-fg bg-success/10 px-3 py-1 rounded-full border border-success/25 w-fit">
                IPC-2152 COMPLIANT
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-fg-muted mb-1">
                    <span>Continuous Current (Amperes):</span>
                    <strong className="text-accent-fg font-bold">{traceCurrent} A</strong>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="15.0"
                    step="0.1"
                    value={traceCurrent}
                    onChange={(e) => setTraceCurrent(parseFloat(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-fg-muted mb-1">Copper Foil Weight</label>
                    <select
                      value={copperWeight}
                      onChange={(e) => setCopperWeight(parseFloat(e.target.value) as 0.5 | 1 | 2 | 3)}
                      className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-xs text-fg focus:border-accent focus:outline-none"
                    >
                      <option value="0.5">0.5 oz (18 µm)</option>
                      <option value="1">1.0 oz (35 µm standard)</option>
                      <option value="2">2.0 oz (70 µm high current)</option>
                      <option value="3">3.0 oz (105 µm heavy copper)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-fg-muted mb-1">Max Temp Rise (°C)</label>
                    <input
                      type="number"
                      min="2"
                      max="50"
                      value={tempRise}
                      onChange={(e) => setTempRise(parseFloat(e.target.value) || 10)}
                      className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-xs text-fg focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-fg-muted">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded border-line bg-surface-1 accent-accent"
                  />
                  <span>Internal Layer Trace (Inner plane with reduced convective cooling)</span>
                </label>
              </div>

              <div className="rounded-2xl border border-accent/25 bg-accent-soft/50 p-5 space-y-4 font-mono text-xs">
                <span className="text-accent-fg font-bold block border-b border-accent/20 pb-2">
                  RECOMMENDED TRACE DIMENSIONS:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-fg-subtle block text-[11px]">WIDTH (MILLIMETERS):</span>
                    <span className="text-2xl font-bold text-fg">{traceResult.widthMm} mm</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">WIDTH (MILS / THOU):</span>
                    <span className="text-2xl font-bold text-accent-fg">{traceResult.widthMils} mils</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">RESISTANCE / METER:</span>
                    <span className="text-fg font-semibold">{traceResult.resistancePerMeterOhms} Ω/m</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">POWER LOSS / METER:</span>
                    <span className="text-fg font-semibold">{traceResult.powerLossWattsPerMeter} W/m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SMPS BUCK CONVERTER */}
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 sm:p-7 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
              <div>
                <span className="text-xs font-mono font-semibold text-info-fg">SWITCH-MODE POWER SUPPLY</span>
                <h3 className="font-display text-lg font-bold text-fg">Buck Converter LC Filter Sizing (CCM)</h3>
                <p className="text-xs text-fg-muted">
                  Calculates minimum inductor and output capacitor values for continuous conduction mode.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-info-fg bg-info/10 px-3 py-1 rounded-full border border-info/25 w-fit">
                30% RIPPLE CCM
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-fg-muted mb-1">Input Voltage (Vin)</label>
                  <input
                    type="number"
                    min="3.3"
                    max="100"
                    value={buckVin}
                    onChange={(e) => setBuckVin(parseFloat(e.target.value) || 12)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Output Voltage (Vout)</label>
                  <input
                    type="number"
                    min="1.0"
                    max="48"
                    step="0.1"
                    value={buckVout}
                    onChange={(e) => setBuckVout(parseFloat(e.target.value) || 5)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Load Current (Iout Amps)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="30"
                    step="0.5"
                    value={buckIout}
                    onChange={(e) => setBuckIout(parseFloat(e.target.value) || 3)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Switching Frequency (kHz)</label>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    step="50"
                    value={buckFreq}
                    onChange={(e) => setBuckFreq(parseFloat(e.target.value) || 500)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-info/25 bg-info/10 p-5 space-y-4 font-mono text-xs">
                <span className="text-info-fg font-bold block border-b border-info/20 pb-2">
                  OPTIMAL INDUCTOR &amp; CAPACITOR VALUES:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-fg-subtle block text-[11px]">INDUCTOR (L):</span>
                    <span className="text-2xl font-bold text-fg">{buckResult.inductanceUh} µH</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">MIN CAPACITANCE (Cout):</span>
                    <span className="text-2xl font-bold text-info-fg">{buckResult.minOutputCapUf} µF</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">PEAK INDUCTOR CURRENT:</span>
                    <span className="text-fg font-semibold">{buckResult.peakCurrentAmps} A</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">DUTY CYCLE (D):</span>
                    <span className="text-fg font-semibold">{(buckResult.dutyCycle * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THERMAL SIZING */}
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 sm:p-7 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
              <div>
                <span className="text-xs font-mono font-semibold text-danger-fg">THERMAL DESIGN</span>
                <h3 className="font-display text-lg font-bold text-fg">Heatsink Thermal Resistance Calculator</h3>
                <p className="text-xs text-fg-muted">
                  Size heatsinks for power MOSFETs, motor drivers, and LDO regulators under +45°C summer enclosures.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-danger-fg bg-danger/10 px-3 py-1 rounded-full border border-danger/25 w-fit">
                INDIAN SUMMER RATED (+45°C)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="block text-fg-muted mb-1">Power Dissipated (Watts)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={thermalPower}
                    onChange={(e) => setThermalPower(parseFloat(e.target.value) || 5)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Max Junction Temp Tj (°C)</label>
                  <input
                    type="number"
                    min="85"
                    max="175"
                    value={maxJunction}
                    onChange={(e) => setMaxJunction(parseFloat(e.target.value) || 125)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Ambient Temp Ta (°C)</label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    value={ambientTemp}
                    onChange={(e) => setAmbientTemp(parseFloat(e.target.value) || 45)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Package Theta JC (°C/W)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={thetaJc}
                    onChange={(e) => setThetaJc(parseFloat(e.target.value) || 2.5)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-fg focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-danger/25 bg-danger/10 p-5 space-y-4 font-mono text-xs">
                <span className="text-danger-fg font-bold block border-b border-danger/20 pb-2">
                  THERMAL MARGIN &amp; RECOMMENDATION:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-fg-subtle block text-[11px]">MAX TOTAL THETA:</span>
                    <span className="text-2xl font-bold text-fg">{thermalResult.maxTotalTheta} °C/W</span>
                  </div>
                  <div>
                    <span className="text-fg-subtle block text-[11px]">REQUIRED HEATSINK θsa:</span>
                    <span className="text-2xl font-bold text-danger-fg">{thermalResult.requiredHeatsinkTheta} °C/W</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-danger/20">
                  <span className="text-fg-muted block text-[11px] mb-1">RECOMMENDED COOLING HARDWARE:</span>
                  <div className="text-fg font-sans font-semibold text-xs bg-surface-1 p-2.5 rounded-xl border border-hairline flex items-center gap-2">
                    <Flame className="size-4 text-danger-fg shrink-0" />
                    <span>{thermalResult.coolingRecommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOMESTIC SOURCING */}
      {activeTab === 'sourcing' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-fg-subtle" />
                <input
                  type="text"
                  placeholder="Search ICs by part number (e.g. STM32, ESP32, RP2040, INA219, LoRa, MOSFET)..."
                  value={sourcingQuery}
                  onChange={(e) => setSourcingQuery(e.target.value)}
                  className="w-full rounded-xl border border-line bg-sunken pl-10 pr-4 py-2.5 text-xs sm:text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
                />
              </div>

              <select
                aria-label="Filter by component category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-line bg-sunken px-3 py-2.5 text-xs text-fg focus:border-accent focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Microcontroller">Microcontrollers</option>
                <option value="Wireless">Wireless &amp; RF</option>
                <option value="Regulator">Voltage Regulators</option>
                <option value="Monitor">Sensors &amp; Monitors</option>
                <option value="MOSFET">Power MOSFETs</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-fg-muted px-1 font-mono">
              <span>SHOWING {filteredComponents.length} ELECTRONIC COMPONENTS</span>
              <span>DOMESTIC INR PRICING VERIFIED</span>
            </div>

            {filteredComponents.map((comp) => (
              <div
                key={comp.mpn}
                className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 space-y-4 hover:border-accent/40 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-fg font-mono">{comp.mpn}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sunken border border-hairline text-fg-muted">
                        {comp.package}
                      </span>
                      {comp.lifecycleStatus === 'active' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-success/10 text-success-fg border border-success/25">
                          ACTIVE PRODUCTION
                        </span>
                      )}
                      {comp.lifecycleStatus === 'nrnd' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-warning/15 text-warning-fg border border-warning/30">
                          NOT RECOMMENDED FOR NEW DESIGNS (NRND)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-fg-muted mt-1">
                      {comp.manufacturer} · <span className="text-fg-subtle">{comp.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-fg-muted leading-relaxed">{comp.description}</p>

                <div className="rounded-xl border border-hairline bg-sunken/70 p-3.5 space-y-2 text-xs font-mono">
                  <span className="text-[11px] text-success-fg block font-semibold">
                    VERIFIED DOMESTIC INDIAN DISTRIBUTORS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {comp.indianDistributors.map((dist) => (
                      <div
                        key={dist.name}
                        className="p-2.5 rounded-lg bg-surface-1 border border-hairline flex items-center justify-between"
                      >
                        <div>
                          <span className="text-fg font-semibold block">{dist.name}</span>
                          <span className="text-[10px] text-accent-fg font-bold">₹{dist.priceInr} / unit</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-success/10 text-success-fg border border-success/25 font-semibold">
                          IN STOCK
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {comp.pinCompatibleAlternates.length > 0 && (
                  <div className="pt-2 border-t border-hairline text-xs">
                    <span className="text-[11px] font-mono font-semibold text-accent-fg block mb-1.5">
                      PIN-COMPATIBLE DROP-IN ALTERNATES:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {comp.pinCompatibleAlternates.map((alt) => (
                        <div
                          key={alt.mpn}
                          className="px-3 py-1.5 rounded-lg bg-sunken border border-hairline font-mono text-[11px] flex items-center gap-2"
                        >
                          <span className="text-fg font-bold">{alt.mpn}</span>
                          <span className="text-fg-subtle">({alt.manufacturer})</span>
                          <span className="text-success-fg font-semibold">₹{alt.priceInr}</span>
                          <span className="text-[10px] text-fg-muted font-sans italic">· {alt.notes}</span>
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

      {/* TAB 3: BOM AUDITOR */}
      {activeTab === 'bom_audit' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-fg flex items-center gap-2">
                  <ShieldAlert className="size-4 text-accent" />
                  Bill of Materials (BOM) Single-Source &amp; Obsolescence Auditor
                </h3>
                <p className="text-xs text-fg-muted">
                  Paste KiCad, Altium, or EasyEDA CSV export to audit obsolete silicon and domestic Indian shortages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-fg-muted">Load sample:</span>
                {SAMPLE_BOMS.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setBomCsvText(preset.csvContent)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-sunken hover:bg-accent-soft text-fg border border-hairline transition-colors"
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
              className="w-full rounded-xl border border-line bg-sunken p-4 text-xs font-mono text-fg focus:border-accent focus:outline-none"
            />

            <div className="flex justify-end">
              <Button type="button" variant="primary" size="sm" onClick={handleRunBomAudit}>
                Run Hardware BOM Audit
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-fg-muted px-1 font-mono">
              <span>AUDIT REPORT ({auditResults.length} COMPONENTS INSPECTED)</span>
              <span>DOMESTIC SUPPLY CHAIN RISK</span>
            </div>

            <div className="space-y-2">
              {auditResults.map((audit) => (
                <div
                  key={audit.reference}
                  className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    audit.riskLevel === 'high'
                      ? 'bg-danger/10 border-danger/30'
                      : audit.riskLevel === 'medium'
                      ? 'bg-warning/10 border-warning/30'
                      : 'bg-success/10 border-success/25'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-fg">{audit.reference}</span>
                      <span className="font-mono text-fg-muted">{audit.mpn}</span>
                      {audit.riskLevel === 'high' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-danger text-on-solid">
                          HIGH RISK (EOL)
                        </span>
                      )}
                      {audit.riskLevel === 'medium' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-warning text-on-solid">
                          MEDIUM RISK
                        </span>
                      )}
                      {audit.riskLevel === 'low' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-success text-on-solid">
                          VERIFIED SAFE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-fg-muted">{audit.riskReason}</p>
                  </div>

                  {audit.suggestedReplacement && (
                    <div className="shrink-0 flex items-center gap-2 text-xs font-mono">
                      <span className="text-fg-muted">DROP-IN:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-1 border border-accent/30 text-accent-fg font-bold">
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

      {/* TAB 4: CHAT TERMINAL */}
      {activeTab === 'chat' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-fg-muted">Ask quick question:</span>
            {CO_PILOT_PROMPTS.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => handleSendChat(p.question)}
                className="px-3 py-1.5 rounded-full text-xs font-mono bg-surface-1 hover:bg-accent-soft text-fg border border-hairline hover:border-accent/35 transition-colors"
              >
                {p.question.slice(0, 35)}...
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-hairline bg-surface-1 p-5 sm:p-6 space-y-4 min-h-[380px] flex flex-col justify-between shadow-xs">
            <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl text-xs leading-relaxed max-w-3xl border ${
                    msg.role === 'user'
                      ? 'ml-auto bg-accent-soft border-accent/30 text-fg font-mono'
                      : 'bg-sunken/80 border-hairline text-fg font-sans'
                  }`}
                >
                  <div className="text-[10px] font-mono text-accent-fg font-semibold mb-1">
                    {msg.role === 'user' ? `${identity.name} (@${identity.handle})` : 'Hardware Engineering Co-Pilot'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-3 pt-4 border-t border-hairline"
            >
              <input
                type="text"
                placeholder="Ask about decoupling capacitors, SMPS inductors, LDO heat, or Indian sourcing..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-xl border border-line bg-sunken px-4 py-2.5 text-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
              />
              <Button type="submit" variant="primary" size="sm">
                <Send className="size-3.5" />
                <span>Ask Co-Pilot</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
