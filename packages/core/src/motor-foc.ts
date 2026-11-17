import { z } from 'zod';

export const motorTopologySchema = z.enum([
  'surface_pmsm',
  'interior_pmsm',
  'bldc_outrunner',
  'bldc_inrunner',
]);
export type MotorTopology = z.infer<typeof motorTopologySchema>;

export const feedbackSensorTypeSchema = z.enum([
  'hall_sensors_120deg',
  'quadrature_encoder',
  'absolute_magnetic_as5047',
  'sensorless_sliding_mode',
]);
export type FeedbackSensorType = z.infer<typeof feedbackSensorTypeSchema>;

export const motorParametersSchema = z.object({
  motorModel: z.string().default('Generic Traction PMSM Motor'),
  topology: motorTopologySchema,
  polePairs: z.number().int().min(1).max(30).default(4),
  statorResistanceOhm: z.number().positive().default(0.045), // Rs
  dAxisInductanceMilliH: z.number().positive().default(0.25), // Ld
  qAxisInductanceMilliH: z.number().positive().default(0.38), // Lq (Lq > Ld for IPM reluctance torque)
  permanentMagnetFluxWb: z.number().positive().default(0.035), // Lambda_m (PM flux linkage)
  ratedSpeedRpm: z.number().positive().default(4500),
  maxSpeedRpm: z.number().positive().default(7500),
  ratedTorqueNm: z.number().positive().default(26),
  peakTorqueNm: z.number().positive().default(45),
  dcBusVoltageV: z.number().positive().default(48),
  maxInverterCurrentA: z.number().positive().default(180),
});
export type MotorParameters = z.infer<typeof motorParametersSchema>;

export const focSimulationParamsSchema = z.object({
  targetSpeedRpm: z.number().min(0).max(12000).default(3000),
  loadTorqueNm: z.number().min(0).max(100).default(12),
  motor: motorParametersSchema,
  pwmFrequencyKhz: z.number().min(8).max(50).default(20),
  dcBusVoltageV: z.number().min(12).max(800).default(48),
  enableFieldWeakening: z.boolean().default(false),
  feedbackSensor: feedbackSensorTypeSchema.default('absolute_magnetic_as5047'),
  currentLoopBandwidthHz: z.number().min(200).max(3000).default(1000),
});
export type FocSimulationParams = z.input<typeof focSimulationParamsSchema>;

export const svpwmSectorSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);
export type SvpwmSector = z.infer<typeof svpwmSectorSchema>;

export const focWaveformPointSchema = z.object({
  angleElectricalDeg: z.number(),
  currentPhaseA: z.number(),
  currentPhaseB: z.number(),
  currentPhaseC: z.number(),
  dutyCycleA: z.number(),
  dutyCycleB: z.number(),
  dutyCycleC: z.number(),
});
export type FocWaveformPoint = z.infer<typeof focWaveformPointSchema>;

export const focSimulationResultSchema = z.object({
  electricalRpm: z.number(),
  mechanicalRpm: z.number(),
  idCurrentA: z.number(), // Field weakening / magnetizing current
  iqCurrentA: z.number(), // Torque-producing quadrature current
  phaseCurrentRmsA: z.number(),
  electromagneticTorqueNm: z.number(),
  reluctanceTorqueNm: z.number(),
  totalTorqueNm: z.number(),
  mechanicalPowerWatts: z.number(),
  electricalPowerWatts: z.number(),
  inverterEfficiencyPercent: z.number(),
  backEmfPeakV: z.number(),
  modulationIndex: z.number(),
  currentSector: svpwmSectorSchema,
  dwellTimeT1Us: z.number(),
  dwellTimeT2Us: z.number(),
  dwellTimeT0Us: z.number(),
  kpGain: z.number(),
  kiGain: z.number(),
  waveforms: z.array(focWaveformPointSchema).min(10),
});
export type FocSimulationResult = z.infer<typeof focSimulationResultSchema>;

export const motorFocProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  vehicleApplication: z.string().min(1),
  peakPowerWatts: z.number().positive(),
  motorParams: motorParametersSchema,
  defaultOperatingSpeedRpm: z.number().positive(),
  defaultLoadTorqueNm: z.number().positive(),
  recommendedPwmKhz: z.number().positive(),
  feedbackSensor: feedbackSensorTypeSchema,
  inverterSpecs: z.object({
    topology: z.string().min(1),
    switchTechnology: z.enum(['silicon_mosfet', 'silicon_carbide_sic', 'gan_hemt', 'igbt']),
    deadTimeNanoseconds: z.number().positive(),
    currentShuntTopology: z.enum(['low_side_three_shunt', 'in_line_hall', 'single_dc_link_shunt']),
  }),
  designDirectives: z.array(z.string()),
  indianContextFacility: z.string().min(1),
  standardsCompliance: z.string().min(1),
});
export type MotorFocProject = z.infer<typeof motorFocProjectSchema>;

/**
 * Executes Field-Oriented Control (FOC) Clarke/Park Transforms,
 * Space Vector PWM (SVPWM) Sector Synthesis, and IPM Reluctance Torque Modeling.
 */
export function simulateMotorFoc(
  rawParams: FocSimulationParams
): FocSimulationResult {
  const params = focSimulationParamsSchema.parse(rawParams);
  const {
    targetSpeedRpm,
    loadTorqueNm,
    motor,
    pwmFrequencyKhz,
    dcBusVoltageV,
    enableFieldWeakening,
    currentLoopBandwidthHz,
  } = params;

  const polePairs = motor.polePairs;
  const mechanicalRpm = targetSpeedRpm;
  const electricalRpm = mechanicalRpm * polePairs;
  const omegaElecRadPerSec = (electricalRpm * 2 * Math.PI) / 60;

  // 1. Back-EMF estimation
  // E_peak = polePairs * omega_m * Lambda_m = omega_e * Lambda_m
  const backEmfPeakV = Math.round(omegaElecRadPerSec * motor.permanentMagnetFluxWb * 10) / 10;

  // Maximum voltage vector limit in linear modulation: V_max_linear = Vdc / sqrt(3)
  const vMaxLinear = dcBusVoltageV / Math.sqrt(3);

  // 2. Torque Generation & Current Determination
  // Torque Equation for Interior PMSM:
  // Te = 1.5 * p * [ Lambda_m * Iq + (Ld - Lq) * Id * Iq ]
  // For Surface PMSM, Ld = Lq, so reluctance torque is zero.
  const ldH = motor.dAxisInductanceMilliH / 1000;
  const lqH = motor.qAxisInductanceMilliH / 1000;
  const hasReluctance = motor.topology === 'interior_pmsm' && lqH > ldH;

  // Required electromagnetic torque to match load torque
  const reqTorqueNm = Math.min(motor.peakTorqueNm, Math.max(0, loadTorqueNm));

  // Base torque constant (Nm/A) for PM alignment:
  const kt = 1.5 * polePairs * motor.permanentMagnetFluxWb;

  let iq = reqTorqueNm / Math.max(0.01, kt);
  let id = 0;

  // Check if back-EMF exceeds DC bus headroom -> requires Field Weakening
  const vRequiredEstimated = Math.sqrt(
    Math.pow(omegaElecRadPerSec * ldH * id, 2) +
    Math.pow(backEmfPeakV + omegaElecRadPerSec * lqH * iq, 2)
  );

  if (vRequiredEstimated > vMaxLinear * 0.95 && enableFieldWeakening) {
    // Inject negative Id to depress net d-axis stator flux linkage
    // (Lambda_m + Ld * Id) * omega_e <= V_max
    const maxAllowableFlux = vMaxLinear / Math.max(1, omegaElecRadPerSec);
    const idNeeded = (maxAllowableFlux - motor.permanentMagnetFluxWb) / ldH;
    id = Math.max(-motor.maxInverterCurrentA * 0.7, Math.min(0, idNeeded));
  } else if (hasReluctance && reqTorqueNm > motor.ratedTorqueNm * 0.4) {
    // MTPA (Maximum Torque Per Ampere) for IPM: inject slight negative Id for reluctance torque boost
    id = -Math.min(motor.maxInverterCurrentA * 0.35, iq * 0.28);
  }

  // Bound currents within inverter capability
  const currentMagnitude = Math.sqrt(id * id + iq * iq);
  if (currentMagnitude > motor.maxInverterCurrentA) {
    const scale = motor.maxInverterCurrentA / currentMagnitude;
    iq *= scale;
    id *= scale;
  }

  id = Math.round(id * 10) / 10;
  iq = Math.round(iq * 10) / 10;

  const phaseCurrentRmsA = Math.round((Math.sqrt(id * id + iq * iq) / Math.sqrt(2)) * 10) / 10;

  // Calculate produced torque components
  const pmTorque = 1.5 * polePairs * motor.permanentMagnetFluxWb * iq;
  const reluctanceTorque = 1.5 * polePairs * (ldH - lqH) * id * iq;
  const totalTorqueNm = Math.round((pmTorque + reluctanceTorque) * 10) / 10;

  // 3. Mechanical & Electrical Power & Efficiency
  const omegaMechRadPerSec = (mechanicalRpm * 2 * Math.PI) / 60;
  const mechanicalPowerWatts = Math.round(totalTorqueNm * omegaMechRadPerSec);

  // Stator Copper losses: 3/2 * Rs * (Id^2 + Iq^2)
  const copperLossW = 1.5 * motor.statorResistanceOhm * (id * id + iq * iq);
  // Inverter conduction & switching losses (assume ~2.5% + switching)
  const inverterLossW = Math.max(15, mechanicalPowerWatts * 0.028 + (pwmFrequencyKhz / 20) * 20);
  const electricalPowerWatts = Math.round(mechanicalPowerWatts + copperLossW + inverterLossW);

  const inverterEfficiencyPercent =
    electricalPowerWatts > 0
      ? Math.min(98.8, Math.max(70.0, Math.round((mechanicalPowerWatts / electricalPowerWatts) * 1000) / 10))
      : 95.0;

  // 4. Stator Voltage Vector & Modulation Index
  // Vd = Rs * Id - omega_e * Lq * Iq
  // Vq = Rs * Iq + omega_e * (Ld * Id + Lambda_m)
  const vd = motor.statorResistanceOhm * id - omegaElecRadPerSec * lqH * iq;
  const vq = motor.statorResistanceOhm * iq + omegaElecRadPerSec * (ldH * id + motor.permanentMagnetFluxWb);
  const vRefMagnitude = Math.sqrt(vd * vd + vq * vq);
  const modulationIndex = Math.min(1.15, Math.round((vRefMagnitude / vMaxLinear) * 1000) / 1000);

  // 5. SVPWM Dwell Times & Sector Identification
  // Reference vector angle in stator frame
  let thetaRef = Math.atan2(vq, vd);
  if (thetaRef < 0) thetaRef += 2 * Math.PI;

  const sectorIndex = Math.min(6, Math.max(1, Math.floor(thetaRef / (Math.PI / 3)) + 1));
  const alphaInSector = thetaRef - (sectorIndex - 1) * (Math.PI / 3);

  // PWM period in microseconds: T_pwm = 1 / f_pwm
  const tPwmUs = 1e6 / (pwmFrequencyKhz * 1000);
  const mSvpwm = Math.min(1.0, modulationIndex);

  // Dwell times:
  // T1 = T_pwm * m * sin(60 - alpha)
  // T2 = T_pwm * m * sin(alpha)
  // T0 = T_pwm - T1 - T2 (Zero vector split between V0 and V7)
  const t1Us = Math.max(0, Math.round(tPwmUs * mSvpwm * Math.sin(Math.PI / 3 - alphaInSector) * 10) / 10);
  const t2Us = Math.max(0, Math.round(tPwmUs * mSvpwm * Math.sin(alphaInSector) * 10) / 10);
  const t0Us = Math.max(0, Math.round((tPwmUs - t1Us - t2Us) * 10) / 10);

  // 6. PI Current Loop Controller Gain Synthesis
  // Bandwidth omega_bw = 2 * pi * f_bw
  // Kp = Lq * omega_bw, Ki = Rs * omega_bw
  const omegaBw = 2 * Math.PI * currentLoopBandwidthHz;
  const kpGain = Math.round(lqH * omegaBw * 100) / 100;
  const kiGain = Math.round(motor.statorResistanceOhm * omegaBw * 10) / 10;

  // 7. Synthetic 3-Phase Current & Duty Cycle Waveforms (1 full electrical cycle)
  const waveforms: FocWaveformPoint[] = [];
  const points = 36;
  const iPeak = Math.sqrt(id * id + iq * iq);

  for (let i = 0; i <= points; i++) {
    const angleDeg = (i / points) * 360;
    const rad = (angleDeg * Math.PI) / 180;

    // Inverse Park Transform to get phase currents
    const iA = iPeak * Math.sin(rad);
    const iB = iPeak * Math.sin(rad - (2 * Math.PI) / 3);
    const iC = iPeak * Math.sin(rad + (2 * Math.PI) / 3);

    // SVPWM duty cycle (saddle curve / third harmonic injection)
    const dutyA = Math.min(0.98, Math.max(0.02, 0.5 + 0.45 * mSvpwm * Math.sin(rad) + 0.08 * mSvpwm * Math.sin(3 * rad)));
    const dutyB = Math.min(0.98, Math.max(0.02, 0.5 + 0.45 * mSvpwm * Math.sin(rad - (2 * Math.PI) / 3) + 0.08 * mSvpwm * Math.sin(3 * rad)));
    const dutyC = Math.min(0.98, Math.max(0.02, 0.5 + 0.45 * mSvpwm * Math.sin(rad + (2 * Math.PI) / 3) + 0.08 * mSvpwm * Math.sin(3 * rad)));

    waveforms.push({
      angleElectricalDeg: angleDeg,
      currentPhaseA: Math.round(iA * 10) / 10,
      currentPhaseB: Math.round(iB * 10) / 10,
      currentPhaseC: Math.round(iC * 10) / 10,
      dutyCycleA: Math.round(dutyA * 1000) / 1000,
      dutyCycleB: Math.round(dutyB * 1000) / 1000,
      dutyCycleC: Math.round(dutyC * 1000) / 1000,
    });
  }

  return {
    electricalRpm: Math.round(electricalRpm),
    mechanicalRpm: Math.round(mechanicalRpm),
    idCurrentA: id,
    iqCurrentA: iq,
    phaseCurrentRmsA,
    electromagneticTorqueNm: Math.round(pmTorque * 10) / 10,
    reluctanceTorqueNm: Math.round(reluctanceTorque * 10) / 10,
    totalTorqueNm,
    mechanicalPowerWatts,
    electricalPowerWatts,
    inverterEfficiencyPercent,
    backEmfPeakV,
    modulationIndex,
    currentSector: sectorIndex as 1 | 2 | 3 | 4 | 5 | 6,
    dwellTimeT1Us: t1Us,
    dwellTimeT2Us: t2Us,
    dwellTimeT0Us: t0Us,
    kpGain,
    kiGain,
    waveforms,
  };
}

/**
 * Filter motor FOC projects by topology, sensor type, and keyword search.
 */
export function filterMotorFocProjects(
  projects: MotorFocProject[],
  filters: {
    topology?: MotorTopology;
    sensorType?: FeedbackSensorType;
    search?: string;
  }
): MotorFocProject[] {
  return projects.filter((p) => {
    if (filters.topology && p.motorParams.topology !== filters.topology) return false;
    if (filters.sensorType && p.feedbackSensor !== filters.sensorType) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.vehicleApplication.toLowerCase().includes(q) ||
        (p.motorParams.motorModel ? p.motorParams.motorModel.toLowerCase().includes(q) : false) ||
        p.indianContextFacility.toLowerCase().includes(q) ||
        p.standardsCompliance.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
