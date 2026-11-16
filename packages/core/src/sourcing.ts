import { z } from 'zod';

export const componentCategorySchema = z.enum([
  'microcontroller',
  'power_management',
  'rf_transceiver',
  'sensor_imu',
  'motor_driver',
  'interface_bridge',
]);
export type ComponentCategory = z.infer<typeof componentCategorySchema>;

export const componentLifecycleSchema = z.enum([
  'active',
  'nrnd',
  'eol',
  'obsolete',
]);
export type ComponentLifecycle = z.infer<typeof componentLifecycleSchema>;

export const compatibilityLevelSchema = z.enum([
  'pin_compatible',
  'functional_drop_in',
  'minor_firmware_change',
  'requires_pcb_redesign',
]);
export type CompatibilityLevel = z.infer<typeof compatibilityLevelSchema>;

export const supplierStockQuoteSchema = z.object({
  supplierName: z.string().min(1),
  country: z.enum(['IN', 'CN', 'US', 'SG']),
  unitPriceINR: z.number().positive(),
  moq: z.number().int().positive(),
  inStockCount: z.number().int().nonnegative(),
  leadTimeDays: z.number().int().nonnegative(),
  productUrl: z.string().optional(),
});
export type SupplierStockQuote = z.infer<typeof supplierStockQuoteSchema>;

export const componentAlternateSchema = z.object({
  mpn: z.string().min(1),
  manufacturer: z.string().min(1),
  compatibilityLevel: compatibilityLevelSchema,
  compatibilityScore: z.number().int().min(0).max(100),
  keyDifferences: z.array(z.string()),
  firmwareChangesRequired: z.array(z.string()),
  unitPriceINR: z.number().positive(),
  availabilityStatus: z.enum(['in_stock', 'low_stock', 'backorder']),
});
export type ComponentAlternate = z.infer<typeof componentAlternateSchema>;

export const componentSourcingRecordSchema = z.object({
  id: z.string(),
  mpn: z.string().min(1),
  manufacturer: z.string().min(1),
  description: z.string().min(1),
  category: componentCategorySchema,
  package: z.string().min(1),
  lifecycle: componentLifecycleSchema,
  primarySpecs: z.record(z.string(), z.string()),
  basePriceINR: z.number().positive(),
  suppliers: z.array(supplierStockQuoteSchema),
  alternates: z.array(componentAlternateSchema),
  notes: z.array(z.string()),
});
export type ComponentSourcingRecord = z.infer<typeof componentSourcingRecordSchema>;

export interface LandedCostBreakdown {
  subtotalINR: number;
  customsDutyINR: number;
  socialWelfareSurchargeINR: number;
  gstINR: number;
  totalLandedINR: number;
  effectiveUnitCostINR: number;
}

/**
 * Calculates landed hardware component cost with authentic Indian customs & GST rates.
 * - Domestic (IN): 0% Customs, 0% SWS, 18% GST on subtotal.
 * - Imported (CN / US / SG):
 *   - Basic Customs Duty (BCD): 7.5% (standard HSN 8542 electronic integrated circuits)
 *   - Social Welfare Surcharge (SWS): 10% on BCD
 *   - Integrated Goods and Services Tax (IGST): 18% on (Subtotal + BCD + SWS)
 */
export function calculateLandedComponentCost(
  unitPriceINR: number,
  quantity: number,
  country: 'IN' | 'CN' | 'US' | 'SG',
  gstRate: number = 0.18
): LandedCostBreakdown {
  const qty = Math.max(1, Math.round(quantity));
  const subtotalINR = Math.round(unitPriceINR * qty * 100) / 100;

  if (country === 'IN') {
    const gstINR = Math.round(subtotalINR * gstRate * 100) / 100;
    const totalLandedINR = Math.round((subtotalINR + gstINR) * 100) / 100;
    return {
      subtotalINR,
      customsDutyINR: 0,
      socialWelfareSurchargeINR: 0,
      gstINR,
      totalLandedINR,
      effectiveUnitCostINR: Math.round((totalLandedINR / qty) * 100) / 100,
    };
  }

  // Import calculation under Indian Customs Tariff HSN 8542
  const bcdRate = 0.075; // 7.5% BCD
  const swsRate = 0.10;  // 10% on BCD

  const customsDutyINR = Math.round(subtotalINR * bcdRate * 100) / 100;
  const socialWelfareSurchargeINR = Math.round(customsDutyINR * swsRate * 100) / 100;

  // Assessable base for IGST = CIF value + BCD + SWS
  const igstBase = subtotalINR + customsDutyINR + socialWelfareSurchargeINR;
  const gstINR = Math.round(igstBase * gstRate * 100) / 100;

  const totalLandedINR = Math.round((igstBase + gstINR) * 100) / 100;

  return {
    subtotalINR,
    customsDutyINR,
    socialWelfareSurchargeINR,
    gstINR,
    totalLandedINR,
    effectiveUnitCostINR: Math.round((totalLandedINR / qty) * 100) / 100,
  };
}

export function findBestAlternate(record: ComponentSourcingRecord): ComponentAlternate | null {
  if (record.alternates.length === 0) return null;
  // Sort primarily by compatibility score descending, then by price ascending
  const sorted = [...record.alternates].sort((a, b) => {
    if (b.compatibilityScore !== a.compatibilityScore) {
      return b.compatibilityScore - a.compatibilityScore;
    }
    return a.unitPriceINR - b.unitPriceINR;
  });
  return sorted[0] || null;
}

export function filterSourcingRecords(
  records: ComponentSourcingRecord[],
  filters: { category?: string; lifecycle?: string; search?: string }
): ComponentSourcingRecord[] {
  return records.filter((rec) => {
    if (filters.category && filters.category !== 'all' && rec.category !== filters.category) {
      return false;
    }
    if (filters.lifecycle && filters.lifecycle !== 'all' && rec.lifecycle !== filters.lifecycle) {
      return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchMpn = rec.mpn.toLowerCase().includes(q);
      const matchMfr = rec.manufacturer.toLowerCase().includes(q);
      const matchDesc = rec.description.toLowerCase().includes(q);
      const matchPkg = rec.package.toLowerCase().includes(q);
      const matchAlt = rec.alternates.some(
        (alt) =>
          alt.mpn.toLowerCase().includes(q) ||
          alt.manufacturer.toLowerCase().includes(q)
      );
      if (!matchMpn && !matchMfr && !matchDesc && !matchPkg && !matchAlt) {
        return false;
      }
    }
    return true;
  });
}
