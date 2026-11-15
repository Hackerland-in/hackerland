import { describe, it, expect } from 'vitest';
import {
  calculatePacejkaForce,
  calculateAeroDrag,
  calculateAeroDownforce,
  calculateAirDensity,
  calculateLongitudinalLoadTransfer,
  stepSuspension,
  rk4Step,
} from './physics-engine';

describe('Multibody Vehicle Physics Engine', () => {
  describe('Pacejka Magic Formula Tire Model', () => {
    it('returns 0 force when normal force is zero or negative', () => {
      expect(calculatePacejkaForce(0.1, 0, 1.2)).toBe(0);
      expect(calculatePacejkaForce(0.1, -100, 1.2)).toBe(0);
    });

    it('calculates positive lateral/longitudinal force under slip', () => {
      const normalForce = 4000; // 4000 N (~400kg on tire)
      const mu = 1.1;
      const force = calculatePacejkaForce(0.08, normalForce, mu);
      expect(force).toBeGreaterThan(0);
      expect(force).toBeLessThanOrEqual(normalForce * mu * 1.05); // near peak
    });

    it('respects friction coefficient scaling', () => {
      const normalForce = 3500;
      const forceDry = calculatePacejkaForce(0.06, normalForce, 1.4);
      const forceWet = calculatePacejkaForce(0.06, normalForce, 0.7);
      expect(forceDry).toBeGreaterThan(forceWet);
    });
  });

  describe('Aerodynamics & Air Density', () => {
    it('calculates standard sea-level air density', () => {
      const rhoSeaLevel = calculateAirDensity(0, 15);
      // Standard sea level air density is approx 1.225 kg/m^3
      expect(rhoSeaLevel).toBeCloseTo(1.225, 2);
    });

    it('decreases air density with altitude', () => {
      const rhoSea = calculateAirDensity(0, 20);
      const rhoAltitude = calculateAirDensity(2500, 20);
      expect(rhoAltitude).toBeLessThan(rhoSea);
    });

    it('computes aerodynamic drag proportional to v^2', () => {
      const cdA = 0.32;
      const drag10 = calculateAeroDrag(10, cdA, 1.225);
      const drag20 = calculateAeroDrag(20, cdA, 1.225);
      // Quadruples when speed doubles
      expect(drag20).toBeCloseTo(drag10 * 4, 1);
    });

    it('computes aerodynamic downforce', () => {
      const downforce = calculateAeroDownforce(50, 0.45, 1.225);
      expect(downforce).toBeGreaterThan(0);
    });
  });

  describe('Dynamic Longitudinal Load Transfer', () => {
    const carGeom = {
      totalMassKg: 1400,
      wheelbaseMeters: 2.6,
      staticFrontWeightRatio: 0.52,
      cgHeightMeters: 0.5,
    };

    it('maintains total normal force under acceleration', () => {
      const staticTotal = carGeom.totalMassKg * 9.80665;
      const transfer = calculateLongitudinalLoadTransfer(carGeom, 4.5, 0);

      const dynamicTotal = transfer.frontNormalForceN + transfer.rearNormalForceN;
      expect(dynamicTotal).toBeCloseTo(staticTotal, 1);
    });

    it('transfers weight to the rear during positive acceleration (squat)', () => {
      const transfer = calculateLongitudinalLoadTransfer(carGeom, 5.0, 0);
      expect(transfer.rearNormalForceN).toBeGreaterThan(transfer.frontNormalForceN);
      expect(transfer.weightTransferN).toBeGreaterThan(0);
      expect(transfer.isWheelie).toBe(false);
    });

    it('transfers weight to the front during heavy braking (dive)', () => {
      const transfer = calculateLongitudinalLoadTransfer(carGeom, -8.0, 0);
      expect(transfer.frontNormalForceN).toBeGreaterThan(transfer.rearNormalForceN);
      expect(transfer.weightTransferN).toBeLessThan(0);
    });

    it('detects wheelie condition on high CG / short wheelbase', () => {
      const dragBike = {
        totalMassKg: 220,
        wheelbaseMeters: 1.4,
        staticFrontWeightRatio: 0.45,
        cgHeightMeters: 0.75,
      };
      // Massive acceleration ~14 m/s^2
      const transfer = calculateLongitudinalLoadTransfer(dragBike, 14.0, 0);
      expect(transfer.isWheelie).toBe(true);
      expect(transfer.frontNormalForceN).toBe(0);
    });
  });

  describe('Suspension Mass-Spring-Damper Kinematics', () => {
    it('compresses under positive downward force and restores', () => {
      let state = { displacement: 0, velocity: 0 };
      const sprungMass = 350; // kg per corner
      const springRate = 35000; // N/m
      const damping = 2500; // Ns/m

      // Step under 2000 N bump load
      state = stepSuspension(state, sprungMass, springRate, damping, 2000, 0.12, 1 / 60);
      expect(state.displacement).toBeGreaterThan(0);

      // Subsequent steps without load restore towards 0
      for (let i = 0; i < 60; i++) {
        state = stepSuspension(state, sprungMass, springRate, damping, 0, 0.12, 1 / 60);
      }
      expect(Math.abs(state.displacement)).toBeLessThan(0.05);
    });
  });

  describe('Runge-Kutta 4th Order Integrator', () => {
    it('accurately integrates exponential decay y\' = -y', () => {
      // Analytical solution of y' = -y with y(0) = 1 is y(t) = e^(-t)
      let y = 1.0;
      const dt = 0.1;
      for (let step = 0; step < 10; step++) {
        y = rk4Step(y, (current) => -current, dt);
      }
      // At t = 1.0, e^(-1) ≈ 0.367879
      expect(y).toBeCloseTo(Math.exp(-1), 4);
    });
  });
});
