import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SourcingCatalog } from './sourcing-catalog';
import { LandedCostCalculator } from './landed-cost-calculator';
import { AlternateComparisonTable } from './alternate-comparison-table';
import { SourcingDetailView } from './sourcing-detail-view';
import { COMPONENT_SOURCING_REGISTRY } from '@/lib/data/sourcing-data';

// @ts-expect-error configure react act environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Component Sourcing & Drop-In Alternates Components', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders SourcingCatalog with tracked components and top stats', () => {
    act(() => {
      root.render(<SourcingCatalog initialRecords={COMPONENT_SOURCING_REGISTRY} />);
    });

    expect(container.textContent).toContain('Critical Components');
    expect(container.textContent).toContain('Domestic Stock');
    expect(container.textContent).toContain('STM32F405RGT6');
    expect(container.textContent).toContain('BQ76952PFBR');
    expect(container.textContent).toContain('SX1262IMLTRT');
  });

  it('filters SourcingCatalog by search keyword', () => {
    act(() => {
      root.render(<SourcingCatalog initialRecords={COMPONENT_SOURCING_REGISTRY} />);
    });

    const searchInput = container.querySelector('input[type="search"]') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    act(() => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      nativeInputValueSetter?.call(searchInput, 'Semtech');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('SX1262IMLTRT');
    expect(container.textContent).not.toContain('STM32F405RGT6');
  });

  it('renders LandedCostCalculator and recalculates on origin switch', () => {
    act(() => {
      root.render(<LandedCostCalculator unitPriceINR={500} mpn="STM32F405RGT6" />);
    });

    expect(container.textContent).toContain('Production Landed Cost for STM32F405RGT6');
    expect(container.textContent).toContain('Total Landed Invoice');

    // Default India Domestic: 100 units * 500 = 50,000 subtotal + 9,000 GST = 59,000
    expect(container.textContent).toContain('59,000');

    // Switch to China import
    const cnBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Import (China)')
    );
    expect(cnBtn).toBeTruthy();

    act(() => {
      cnBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // Should now show Basic Customs Duty BCD
    expect(container.textContent).toContain('Basic Customs Duty (BCD 7.5% under HSN 8542)');
  });

  it('renders AlternateComparisonTable with compatibility levels and price delta', () => {
    const record = COMPONENT_SOURCING_REGISTRY[0]!;
    act(() => {
      root.render(
        <AlternateComparisonTable
          baseMpn={record.mpn}
          basePriceINR={record.basePriceINR}
          alternates={record.alternates}
        />
      );
    });

    expect(container.textContent).toContain('GD32F405RGT6');
    expect(container.textContent).toContain('98% Match');
    expect(container.textContent).toContain('100% Pin-Compatible Drop-In');
    expect(container.textContent).toContain('Mindgrove Secure IoT SoC');
  });

  it('renders SourcingDetailView with specs matrix and distributor quotes table', () => {
    const record = COMPONENT_SOURCING_REGISTRY[0]!;
    act(() => {
      root.render(<SourcingDetailView record={record} />);
    });

    expect(container.textContent).toContain('STM32F405RGT6');
    expect(container.textContent).toContain('STMicroelectronics');
    expect(container.textContent).toContain('Live Distributor Stock & Pricing Matrix');
    expect(container.textContent).toContain('Robu.in');
    expect(container.textContent).toContain('Element14 India');
    expect(container.textContent).toContain('Procurement & BOM Design Guidelines');
  });
});
