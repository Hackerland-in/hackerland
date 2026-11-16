import { z } from 'zod';

export const pnpPackageTypeSchema = z.enum([
  '0402',
  '0603',
  '0805',
  'sot23',
  'soic',
  'qfp',
  'qfn',
  'bga',
  'through_hole',
  'connector',
]);
export type PnpPackageType = z.infer<typeof pnpPackageTypeSchema>;

export const pnpPlacementSideSchema = z.enum(['top', 'bottom']);
export type PnpPlacementSide = z.infer<typeof pnpPlacementSideSchema>;

export const pnpComponentPlacementSchema = z.object({
  designator: z.string().min(1),
  val: z.string().min(1),
  pkg: pnpPackageTypeSchema,
  posX: z.number(),
  posY: z.number(),
  rotation: z.number().min(0).max(360),
  side: pnpPlacementSideSchema,
});
export type PnpComponentPlacement = z.infer<typeof pnpComponentPlacementSchema>;

export const stencilFoilThicknessSchema = z.enum(['0.10mm', '0.12mm', '0.15mm']);
export type StencilFoilThickness = z.infer<typeof stencilFoilThicknessSchema>;

export const emsPartnerSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  certifications: z.array(z.string()),
});
export type EmsPartner = z.infer<typeof emsPartnerSchema>;

export const pcbaAssemblyProjectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  boardDimensions: z.object({
    widthMm: z.number().positive(),
    heightMm: z.number().positive(),
  }),
  layerCount: z.number().int().positive(),
  placements: z.array(pnpComponentPlacementSchema),
  recommendedFoilThickness: stencilFoilThicknessSchema,
  hasBgaOrQfn: z.boolean(),
  hasConformalCoating: z.boolean(),
  description: z.string().min(1),
  recommendedEmsPartner: emsPartnerSchema,
});
export type PcbaAssemblyProject = z.infer<typeof pcbaAssemblyProjectSchema>;

export interface PnpFeederSetupResult {
  totalParts: number;
  smdPartsCount: number;
  thtPartsCount: number;
  feederSlotsRequired: number;
  sideDistribution: { top: number; bottom: number };
  packageBreakdown: Record<string, number>;
}

export function calculatePnpFeederSetup(placements: PnpComponentPlacement[]): PnpFeederSetupResult {
  let smdCount = 0;
  let thtCount = 0;
  let topCount = 0;
  let bottomCount = 0;
  const uniquePartsSet = new Set<string>();
  const pkgBreakdown: Record<string, number> = {};

  for (const p of placements) {
    if (p.pkg === 'through_hole' || p.pkg === 'connector') {
      thtCount++;
    } else {
      smdCount++;
    }

    if (p.side === 'top') topCount++;
    else bottomCount++;

    // Feeder slot key is combination of value + package (e.g., "100nF_0402")
    uniquePartsSet.add(`${p.val}__${p.pkg}`);
    pkgBreakdown[p.pkg] = (pkgBreakdown[p.pkg] || 0) + 1;
  }

  return {
    totalParts: placements.length,
    smdPartsCount: smdCount,
    thtPartsCount: thtCount,
    feederSlotsRequired: uniquePartsSet.size,
    sideDistribution: { top: topCount, bottom: bottomCount },
    packageBreakdown: pkgBreakdown,
  };
}

export type EmsQualityTier = 'standard_prototyping' | 'high_rel_automotive' | 'aerospace_class3';

export interface PcbaTurnkeyCostBreakdown {
  setupFeeINR: number;
  smtPlacementFeeINR: number;
  inspectionFeeINR: number;
  stencilFeeINR: number;
  totalAssemblyINR: number;
  unitAssemblyCostINR: number;
}

/**
 * Computes PCBA Turnkey Assembly Cost based on Indian EMS market benchmarks (Kaynes, Syrma, Centum).
 */
export function calculatePcbaTurnkeyCost(
  project: PcbaAssemblyProject,
  batchQuantity: number,
  tier: EmsQualityTier = 'standard_prototyping'
): PcbaTurnkeyCostBreakdown {
  const qty = Math.max(1, Math.round(batchQuantity));
  const feeder = calculatePnpFeederSetup(project.placements);

  // Stencil fee: Laser-cut electropolished stainless steel stencil
  const isDoubleSided = feeder.sideDistribution.bottom > 0;
  const stencilFeeINR = isDoubleSided ? 4500 : 2500;

  // Machine NRE setup fee based on unique feeder slots
  const baseSetupPerSlot = tier === 'aerospace_class3' ? 250 : tier === 'high_rel_automotive' ? 180 : 120;
  const setupFeeINR = Math.max(3500, feeder.feederSlotsRequired * baseSetupPerSlot);

  // Per-point placement fee
  let ratePerPlacement = 0.45; // standard prototyping (₹0.45 per SMD placement)
  if (tier === 'high_rel_automotive') ratePerPlacement = 0.75;
  if (tier === 'aerospace_class3') ratePerPlacement = 1.25;

  const totalPlacementsInBatch = feeder.totalParts * qty;
  // Volume discount scaling
  const volumeDiscount = qty >= 500 ? 0.75 : qty >= 100 ? 0.85 : 1.0;
  const smtPlacementFeeINR = Math.round(totalPlacementsInBatch * ratePerPlacement * volumeDiscount);

  // Inspection fee (Automated Optical Inspection + 3D X-Ray for BGA/QFN)
  let inspectionPerBoard = 40;
  if (project.hasBgaOrQfn) inspectionPerBoard += 120; // 3D X-Ray inspection
  if (tier === 'aerospace_class3') inspectionPerBoard += 250; // Flying probe / IPC-A-610 Class 3 audit
  const inspectionFeeINR = Math.round(inspectionPerBoard * qty);

  const totalAssemblyINR = setupFeeINR + stencilFeeINR + smtPlacementFeeINR + inspectionFeeINR;
  const unitAssemblyCostINR = Math.round((totalAssemblyINR / qty) * 100) / 100;

  return {
    setupFeeINR,
    smtPlacementFeeINR,
    inspectionFeeINR,
    stencilFeeINR,
    totalAssemblyINR,
    unitAssemblyCostINR,
  };
}

/**
 * Validates a standard KiCad / Altium XYRS Centroid CSV file string.
 * Expected format: Designator, Val, Package, PosX, PosY, Rot, Side
 */
export function validatePnpCentroidCsv(csvContent: string): {
  valid: boolean;
  placements: PnpComponentPlacement[];
  errors: string[];
} {
  const errors: string[] = [];
  const placements: PnpComponentPlacement[] = [];

  const lines = csvContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith(';'));

  if (lines.length < 2) {
    return {
      valid: false,
      placements: [],
      errors: ['Centroid CSV must contain a header row and at least one component entry'],
    };
  }

  // Check header
  const header = lines[0]!.toLowerCase();
  if (!header.includes('designator') && !header.includes('ref')) {
    errors.push('Missing Designator or RefDes column header');
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    const parts = line.split(/[,;\t]/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length < 6) {
      errors.push(`Line ${i + 1}: expected at least 6 columns (Designator, Val, Package, PosX, PosY, Rot, Side)`);
      continue;
    }

    const designator = parts[0] || `U${i}`;
    const val = parts[1] || 'Unknown';
    const rawPkg = (parts[2] || '0603').toLowerCase();

    let pkg: PnpPackageType = '0603';
    if (rawPkg.includes('0402')) pkg = '0402';
    else if (rawPkg.includes('0603')) pkg = '0603';
    else if (rawPkg.includes('0805')) pkg = '0805';
    else if (rawPkg.includes('sot')) pkg = 'sot23';
    else if (rawPkg.includes('soic') || rawPkg.includes('sop')) pkg = 'soic';
    else if (rawPkg.includes('qfn')) pkg = 'qfn';
    else if (rawPkg.includes('qfp')) pkg = 'qfp';
    else if (rawPkg.includes('bga')) pkg = 'bga';
    else if (rawPkg.includes('tht') || rawPkg.includes('dip')) pkg = 'through_hole';
    else if (rawPkg.includes('conn') || rawPkg.includes('header')) pkg = 'connector';

    const posX = parseFloat(parts[3] || '0');
    const posY = parseFloat(parts[4] || '0');
    const rotation = ((parseFloat(parts[5] || '0') % 360) + 360) % 360;
    const rawSide = (parts[6] || 'top').toLowerCase();
    const side: PnpPlacementSide = rawSide.includes('bottom') || rawSide.includes('bot') ? 'bottom' : 'top';

    if (isNaN(posX) || isNaN(posY)) {
      errors.push(`Line ${i + 1}: Invalid coordinate PosX/PosY`);
      continue;
    }

    placements.push({
      designator,
      val,
      pkg,
      posX,
      posY,
      rotation,
      side,
    });
  }

  return {
    valid: errors.length === 0,
    placements,
    errors,
  };
}

export function filterAssemblyProjects(
  projects: PcbaAssemblyProject[],
  filters: { search?: string }
): PcbaAssemblyProject[] {
  return projects.filter((proj) => {
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const matchName = proj.name.toLowerCase().includes(q);
      const matchDesc = proj.description.toLowerCase().includes(q);
      const matchEms = proj.recommendedEmsPartner.name.toLowerCase().includes(q);
      const matchCity = proj.recommendedEmsPartner.city.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchEms && !matchCity) {
        return false;
      }
    }
    return true;
  });
}
