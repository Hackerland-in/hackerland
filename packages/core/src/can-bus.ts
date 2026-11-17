import { z } from 'zod';

export const canProtocolStandardSchema = z.enum([
  'can_2_0b_standard',
  'can_2_0b_extended',
  'can_fd_iso',
  'can_fd_non_iso',
]);
export type CanProtocolStandard = z.infer<typeof canProtocolStandardSchema>;

export const terminationTopologySchema = z.enum([
  'split_termination_filtered',
  'standard_120_ohm',
  'single_end_high_z_unterminated',
]);
export type TerminationTopology = z.infer<typeof terminationTopologySchema>;

export const transceiverIsolationTypeSchema = z.enum([
  'galvanic_optocoupler',
  'capacitive_digital_isolator',
  'monolithic_non_isolated',
]);
export type TransceiverIsolationType = z.infer<typeof transceiverIsolationTypeSchema>;

export const canBitTimingConfigSchema = z.object({
  clockFrequencyMhz: z.number().positive().default(40), // e.g. 16, 24, 40, 80 MHz
  targetBaudRateKbps: z.number().positive().default(500), // e.g. 125, 250, 500, 1000
  prescalerBrd: z.number().int().min(1).max(256).default(4),
  syncSegTq: z.number().int().default(1),
  propSegTq: z.number().int().min(1).max(32).default(6),
  phaseSeg1Tq: z.number().int().min(1).max(32).default(7),
  phaseSeg2Tq: z.number().int().min(1).max(32).default(6),
  syncJumpWidthSjwTq: z.number().int().min(1).max(4).default(2),
});
export type CanBitTimingConfig = z.infer<typeof canBitTimingConfigSchema>;

export const canSimulationParamsSchema = z.object({
  standard: canProtocolStandardSchema.default('can_2_0b_standard'),
  baudRateKbps: z.number().min(50).max(1000).default(500),
  dataPhaseBaudRateMbps: z.number().min(1).max(8).default(2), // For CAN-FD
  clockFrequencyMhz: z.number().min(8).max(120).default(40),
  busLengthMeters: z.number().min(0.5).max(1000).default(15),
  numberOfNodes: z.number().int().min(2).max(64).default(8),
  averagePayloadBytes: z.number().int().min(0).max(64).default(8),
  totalMessageFrequencyHz: z.number().min(10).max(5000).default(500),
  termination: terminationTopologySchema.default('split_termination_filtered'),
  cableSpecificDelayNsPerMeter: z.number().min(3).max(8).default(5), // ~5 ns/m for typical automotive twisted pair
  transceiverLoopDelayNs: z.number().min(50).max(350).default(150),
});
export type CanSimulationParams = z.input<typeof canSimulationParamsSchema>;

export const canWaveformSampleSchema = z.object({
  timeNs: z.number(),
  vCanH: z.number(),
  vCanL: z.number(),
  vDiff: z.number(),
  bitLogicState: z.enum(['dominant_0', 'recessive_1']),
  segmentLabel: z.string(),
});
export type CanWaveformSample = z.infer<typeof canWaveformSampleSchema>;

export const canSimulationResultSchema = z.object({
  actualBaudRateKbps: z.number(),
  timeQuantumNs: z.number(),
  totalTimeQuantaPerBit: z.number(),
  samplePointPercent: z.number(),
  samplePointStatus: z.enum(['optimal_cia', 'acceptable', 'marginal_out_of_spec']),
  nominalBitTimeNs: z.number(),
  oneWayPropDelayNs: z.number(),
  roundTripDelayNs: z.number(),
  maxAllowableBusLengthMeters: z.number(),
  busLoadPercent: z.number(),
  busUtilizationHealth: z.enum(['optimal_safe', 'heavy_traffic', 'overloaded_hazard']),
  frameTotalBits: z.number(),
  maxFrameTransferTimeUs: z.number(),
  terminationImpedanceOhms: z.number(),
  commonModeFilterCutoffKhz: z.number(),
  waveforms: z.array(canWaveformSampleSchema).min(10),
});
export type CanSimulationResult = z.infer<typeof canSimulationResultSchema>;

export const canBusProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  automotiveDomain: z.string().min(1),
  protocolStandard: canProtocolStandardSchema,
  nominalBaudRateKbps: z.number().positive(),
  dataBaudRateMbps: z.number().positive().optional(),
  busTopology: z.object({
    busLengthMeters: z.number().positive(),
    nodeCount: z.number().int().positive(),
    cableType: z.string().min(1),
    terminationMethod: terminationTopologySchema,
    isolationType: transceiverIsolationTypeSchema,
  }),
  designDirectives: z.array(z.string()),
  indianContextFacility: z.string().min(1),
  standardsCompliance: z.string().min(1),
});
export type CanBusProject = z.infer<typeof canBusProjectSchema>;

/**
 * Calculates CAN bus bit timing, sample point location, bus propagation delay,
 * differential physical layer voltage levels, and bus load traffic metrics.
 */
export function simulateCanBus(rawParams: CanSimulationParams): CanSimulationResult {
  const params = canSimulationParamsSchema.parse(rawParams);
  const {
    standard,
    baudRateKbps,
    clockFrequencyMhz,
    busLengthMeters,
    numberOfNodes,
    averagePayloadBytes,
    totalMessageFrequencyHz,
    termination,
    cableSpecificDelayNsPerMeter,
    transceiverLoopDelayNs,
  } = params;

  // 1. Bit Timing & Sample Point Synthesis
  // Nominal bit time in nanoseconds
  const targetBitTimeNs = (1 / (baudRateKbps * 1000)) * 1e9;

  // Target between 16 and 20 time quanta per bit (CiA 301 / ISO 11898 standard recommendation)
  // t_q = BRP / f_clk
  // N_tq = targetBitTimeNs / t_q = targetBitTimeNs * f_clk / BRP
  let bestBrp = 1;
  let bestNtq = 20;
  let minError = Infinity;

  for (let brp = 1; brp <= 64; brp++) {
    const tq = (brp / (clockFrequencyMhz * 1e6)) * 1e9;
    const ntqFloat = targetBitTimeNs / tq;
    const ntq = Math.round(ntqFloat);
    if (ntq >= 8 && ntq <= 32) {
      const actualBitTime = ntq * tq;
      const error = Math.abs(actualBitTime - targetBitTimeNs);
      if (error < minError) {
        minError = error;
        bestBrp = brp;
        bestNtq = ntq;
      }
    }
  }

  const timeQuantumNs = Math.round(((bestBrp / (clockFrequencyMhz * 1e6)) * 1e9) * 100) / 100;
  const totalNtq = bestNtq;
  const actualBitTimeNs = totalNtq * timeQuantumNs;
  const actualBaudRateKbps = Math.round((1e9 / actualBitTimeNs) / 1000);

  // Allocate segments:
  // Sync_Seg is always 1 t_q
  const syncSeg = 1;
  // Target 80% to 87.5% sample point for automotive robustness
  const samplePointTarget = Math.round(totalNtq * 0.80);
  const phaseSeg2 = Math.max(2, totalNtq - samplePointTarget);
  const remaining = totalNtq - syncSeg - phaseSeg2;
  const propSeg = Math.max(1, Math.floor(remaining / 2));
  const phaseSeg1 = remaining - propSeg;

  const samplePointPercent = Math.round(((syncSeg + propSeg + phaseSeg1) / totalNtq) * 1000) / 10;

  let samplePointStatus: 'optimal_cia' | 'acceptable' | 'marginal_out_of_spec' = 'acceptable';
  if (samplePointPercent >= 75.0 && samplePointPercent <= 87.5) {
    samplePointStatus = 'optimal_cia';
  } else if (samplePointPercent >= 65.0 && samplePointPercent <= 90.0) {
    samplePointStatus = 'acceptable';
  } else {
    samplePointStatus = 'marginal_out_of_spec';
  }

  // 2. Physical Layer Propagation Delay & Max Bus Length
  // Delay = 2 * (t_cable * L + t_xceiver)
  const oneWayCableDelayNs = busLengthMeters * cableSpecificDelayNsPerMeter;
  const oneWayPropDelayNs = Math.round((oneWayCableDelayNs + transceiverLoopDelayNs / 2) * 10) / 10;
  const roundTripDelayNs = Math.round((2 * oneWayCableDelayNs + transceiverLoopDelayNs) * 10) / 10;

  // For robust arbitration: RoundTripDelay <= Prop_Seg * t_q + Phase_Seg1 * t_q (or Prop_Seg time)
  const allowablePropTimeNs = (propSeg + phaseSeg1) * timeQuantumNs;
  const maxAllowableBusLengthMeters = Math.max(
    2,
    Math.round(((allowablePropTimeNs - transceiverLoopDelayNs) / (2 * cableSpecificDelayNsPerMeter)) * 10) / 10
  );

  // 3. Frame Bits, Bit Stuffing, and Bus Load Calculation
  // Standard 2.0B: SOF(1) + ID(11) + RTR(1) + IDE(1) + r0(1) + DLC(4) + Data(8*N) + CRC(15) + CRCDel(1) + ACK(1) + ACKDel(1) + EOF(7) + IFS(3) = 47 + 8*N bits
  // Extended 2.0B: 29-bit ID -> 67 + 8*N bits
  const isExtended = standard === 'can_2_0b_extended';
  const baseOverhead = isExtended ? 67 : 47;
  const rawDataBits = averagePayloadBytes * 8;
  const rawFrameBits = baseOverhead + rawDataBits;

  // Average bit stuffing factor in random data is ~1.15 to 1.20
  const stuffedFrameBits = Math.round(rawFrameBits * 1.15);
  const maxFrameTransferTimeUs = Math.round((stuffedFrameBits * actualBitTimeNs) / 1000);

  // Bus Load = (Total message frequency * stuffed bits / baud rate) * 100
  const busBandwidthBitsPerSec = actualBaudRateKbps * 1000;
  const transmittedBitsPerSec = totalMessageFrequencyHz * stuffedFrameBits;
  const busLoadPercent = Math.min(
    100,
    Math.round((transmittedBitsPerSec / busBandwidthBitsPerSec) * 1000) / 10
  );

  let busUtilizationHealth: 'optimal_safe' | 'heavy_traffic' | 'overloaded_hazard' = 'optimal_safe';
  if (busLoadPercent <= 50.0) {
    busUtilizationHealth = 'optimal_safe';
  } else if (busLoadPercent <= 70.0) {
    busUtilizationHealth = 'heavy_traffic';
  } else {
    busUtilizationHealth = 'overloaded_hazard';
  }

  // 4. Termination & Common-Mode RF Filtering
  let terminationImpedanceOhms = 120;
  let commonModeFilterCutoffKhz = 280; // f_c = 1 / (2 * pi * 60 * 4.7nF) ~ 564 kHz or ~280 kHz differential
  if (termination === 'split_termination_filtered') {
    terminationImpedanceOhms = 120; // 2 x 60 Ohm with center 4.7nF capacitor
    commonModeFilterCutoffKhz = 282; // 1 / (2 * pi * 120 * 4.7nF) ~ 282 kHz
  } else if (termination === 'single_end_high_z_unterminated') {
    terminationImpedanceOhms = 2400;
    commonModeFilterCutoffKhz = 50;
  }

  // 5. Differential Oscilloscope Waveform Generation (Dominant vs Recessive)
  const waveforms: CanWaveformSample[] = [];
  const samplesPerBit = 12;
  const bitsToSimulate = [
    { logic: 'dominant_0' as const, label: 'SOF (0)' },
    { logic: 'dominant_0' as const, label: 'ID Bit 10 (0)' },
    { logic: 'recessive_1' as const, label: 'ID Bit 9 (1)' },
    { logic: 'dominant_0' as const, label: 'ID Bit 8 (0)' },
    { logic: 'recessive_1' as const, label: 'ID Bit 7 (1)' },
  ];

  let currentTimeNs = 0;
  const timeStepNs = actualBitTimeNs / samplesPerBit;

  for (const bit of bitsToSimulate) {
    for (let s = 0; s < samplesPerBit; s++) {
      let vH = 2.5;
      let vL = 2.5;

      if (bit.logic === 'dominant_0') {
        // Dominant state: CAN_H driven high to ~3.5V, CAN_L driven low to ~1.5V -> V_diff = ~2.0V
        // Add subtle ringing at bit edge transitions
        const ringing = s < 3 ? Math.sin((s / 3) * Math.PI) * 0.12 : 0;
        vH = 3.5 + ringing;
        vL = 1.5 - ringing;
      } else {
        // Recessive state: both lines float to nominal 2.5V bias -> V_diff = 0V
        const noise = (Math.sin(s * 1.5) * 0.04);
        vH = 2.5 + noise;
        vL = 2.5 - noise;
      }

      waveforms.push({
        timeNs: Math.round(currentTimeNs),
        vCanH: Math.round(vH * 100) / 100,
        vCanL: Math.round(vL * 100) / 100,
        vDiff: Math.round((vH - vL) * 100) / 100,
        bitLogicState: bit.logic,
        segmentLabel: bit.label,
      });

      currentTimeNs += timeStepNs;
    }
  }

  return {
    actualBaudRateKbps,
    timeQuantumNs,
    totalTimeQuantaPerBit: totalNtq,
    samplePointPercent,
    samplePointStatus,
    nominalBitTimeNs: Math.round(actualBitTimeNs),
    oneWayPropDelayNs,
    roundTripDelayNs,
    maxAllowableBusLengthMeters,
    busLoadPercent,
    busUtilizationHealth,
    frameTotalBits: stuffedFrameBits,
    maxFrameTransferTimeUs,
    terminationImpedanceOhms,
    commonModeFilterCutoffKhz,
    waveforms,
  };
}

/**
 * Filter CAN bus projects by protocol standard, termination, and keyword search.
 */
export function filterCanBusProjects(
  projects: CanBusProject[],
  filters: {
    standard?: CanProtocolStandard;
    termination?: TerminationTopology;
    search?: string;
  }
): CanBusProject[] {
  return projects.filter((p) => {
    if (filters.standard && p.protocolStandard !== filters.standard) return false;
    if (filters.termination && p.busTopology.terminationMethod !== filters.termination) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.automotiveDomain.toLowerCase().includes(q) ||
        p.busTopology.cableType.toLowerCase().includes(q) ||
        p.indianContextFacility.toLowerCase().includes(q) ||
        p.standardsCompliance.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
