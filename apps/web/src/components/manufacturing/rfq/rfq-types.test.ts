import { describe, it, expect } from 'vitest';
import { calculateVendorQuotes, type RFQConfig } from './rfq-types';

describe('RFQ Vendor Quote Calculation Engine', () => {
  const baseConfig: RFQConfig = {
    boardName: 'Test-Board',
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
    componentsCount: 0,
  };

  it('calculates quotes for both domestic Indian and global vendors', () => {
    const quotes = calculateVendorQuotes(baseConfig);
    expect(quotes.length).toBe(5);

    const lion = quotes.find((q) => q.vendorId === 'lioncircuits');
    const jlc = quotes.find((q) => q.vendorId === 'jlcpcb');

    expect(lion).toBeDefined();
    expect(lion?.country).toBe('India');
    expect(lion?.totalInr).toBeGreaterThan(0);

    expect(jlc).toBeDefined();
    expect(jlc?.country).toBe('Global');
    expect(jlc?.customsTaxInr).toBeGreaterThan(0); // Includes Indian import duty
  });

  it('scales cost correctly when increasing layer count from 2 to 4', () => {
    const quotes2Layer = calculateVendorQuotes(baseConfig);
    const quotes4Layer = calculateVendorQuotes({ ...baseConfig, layers: 4 });

    const lion2 = quotes2Layer.find((q) => q.vendorId === 'lioncircuits')!;
    const lion4 = quotes4Layer.find((q) => q.vendorId === 'lioncircuits')!;

    expect(lion4.totalInr).toBeGreaterThan(lion2.totalInr);
  });

  it('applies ENIG finish premium', () => {
    const quotesHasl = calculateVendorQuotes(baseConfig);
    const quotesEnig = calculateVendorQuotes({ ...baseConfig, surfaceFinish: 'enig' });

    const pcbPowerHasl = quotesHasl.find((q) => q.vendorId === 'pcbpower')!;
    const pcbPowerEnig = quotesEnig.find((q) => q.vendorId === 'pcbpower')!;

    expect(pcbPowerEnig.totalInr).toBeGreaterThan(pcbPowerHasl.totalInr);
  });

  it('adds assembly cost when pcbAssembly is requested', () => {
    const quotesBare = calculateVendorQuotes(baseConfig);
    const quotesAssembled = calculateVendorQuotes({
      ...baseConfig,
      pcbAssembly: true,
      componentsCount: 30,
    });

    const circuit99Bare = quotesBare.find((q) => q.vendorId === 'circuit99')!;
    const circuit99Assembled = quotesAssembled.find((q) => q.vendorId === 'circuit99')!;

    expect(circuit99Assembled.totalInr).toBeGreaterThan(circuit99Bare.totalInr);
  });
});
