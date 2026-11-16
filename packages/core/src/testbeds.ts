import { z } from 'zod';

export const testbedEquipmentCategorySchema = z.enum([
  'rf_spectrum_analyzer',
  'battery_cycler',
  'emc_anechoic_chamber',
  'vibration_shaker',
  'thermal_chamber',
  'logic_analyzer',
]);
export type TestbedEquipmentCategory = z.infer<typeof testbedEquipmentCategorySchema>;

export const testbedAccessTypeSchema = z.enum(['remote_scpi', 'physical_onsite', 'hybrid']);
export type TestbedAccessType = z.infer<typeof testbedAccessTypeSchema>;

export const testbedScriptTypeSchema = z.enum(['pyvisa_scpi', 'bash_telnet', 'json_profile']);
export type TestbedScriptType = z.infer<typeof testbedScriptTypeSchema>;

export const testbedScriptRunnerSchema = z.object({
  scriptType: testbedScriptTypeSchema,
  sampleScript: z.string(),
  supportedInterfaces: z.array(z.enum(['gpib', 'lan_scpi', 'usb_tmc', 'serial'])),
});
export type TestbedScriptRunner = z.infer<typeof testbedScriptRunnerSchema>;

export const testbedFacilitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  category: testbedEquipmentCategorySchema,
  hostLab: z.object({
    name: z.string(),
    city: z.string(),
    state: z.string(),
    institution: z.string(),
    nablAccredited: z.boolean(),
  }),
  accessType: testbedAccessTypeSchema,
  specifications: z.record(z.string(), z.string()),
  hourlyRateInr: z.number(),
  studentSubsidyRateInr: z.number(),
  safetyInductionRequired: z.boolean(),
  activeQueueLength: z.number(),
  scriptRunner: testbedScriptRunnerSchema,
  description: z.string(),
  rulesAndGuidelines: z.array(z.string()),
});
export type TestbedFacility = z.infer<typeof testbedFacilitySchema>;

/**
 * Validates SCPI (Standard Commands for Programmable Instruments) scripts.
 * Checks for mandatory identity query, checks syntax structure, and blocks dangerous destructive commands.
 */
export function validateScpiCommandScript(scriptText: string): {
  isValid: boolean;
  commandCount: number;
  warnings: string[];
  errors: string[];
} {
  const lines = scriptText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('//'));

  const errors: string[] = [];
  const warnings: string[] = [];

  if (lines.length === 0) {
    return {
      isValid: false,
      commandCount: 0,
      warnings: [],
      errors: ['Script cannot be empty.'],
    };
  }

  let hasIdnOrRst = false;

  for (const line of lines) {
    const upper = line.toUpperCase();

    // Check for destructive commands
    if (upper.includes(':SYST:SEC:ERA') || upper.includes('FLASH:ERASE:ALL') || upper.includes('FORMAT:NAND')) {
      errors.push(`Disallowed destructive system command detected: '${line}'`);
    }

    if (upper.includes('*IDN?') || upper.includes('*RST')) {
      hasIdnOrRst = true;
    }

    // Basic SCPI syntax check: common SCPI commands begin with * or : or alphanumeric mnemonic
    const isScpiSyntax = /^(\*?[A-Za-z0-9_:]+(\?[A-Za-z0-9_,\s.]*)?|\w+\s*=\s*.+)$/.test(line);
    if (!isScpiSyntax) {
      warnings.push(`Line does not conform to standard SCPI syntax: '${line}'`);
    }
  }

  if (!hasIdnOrRst) {
    warnings.push('Recommended best practice: Begin script with *IDN? or *RST for deterministic state.');
  }

  return {
    isValid: errors.length === 0,
    commandCount: lines.length,
    warnings,
    errors,
  };
}

/**
 * Calculates booking reservation cost with DPIIT startup or student subsidy deduction.
 */
export function calculateTestbedBookingCost(
  hours: number,
  standardHourlyRate: number,
  subsidyHourlyRate: number,
  isEligibleForSubsidy: boolean,
): {
  totalCostInr: number;
  savingsInr: number;
  appliedHourlyRate: number;
} {
  const rate = isEligibleForSubsidy ? subsidyHourlyRate : standardHourlyRate;
  const totalCostInr = Math.max(0, hours * rate);
  const standardTotal = hours * standardHourlyRate;
  const savingsInr = Math.max(0, standardTotal - totalCostInr);

  return {
    totalCostInr,
    savingsInr,
    appliedHourlyRate: rate,
  };
}

/**
 * Filter testbed facilities by equipment category, city, access mode, or keyword search.
 */
export function filterTestbedFacilities(
  items: TestbedFacility[],
  filters: { category?: string; city?: string; accessType?: string; search?: string },
): TestbedFacility[] {
  return items.filter((item) => {
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.city && filters.city !== 'all' && item.hostLab.city.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }
    if (filters.accessType && filters.accessType !== 'all' && item.accessType !== filters.accessType) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchModel = item.model.toLowerCase().includes(q);
      const matchMaker = item.manufacturer.toLowerCase().includes(q);
      const matchLab = item.hostLab.name.toLowerCase().includes(q);
      const matchCity = item.hostLab.city.toLowerCase().includes(q);
      if (!matchName && !matchModel && !matchMaker && !matchLab && !matchCity) {
        return false;
      }
    }
    return true;
  });
}
