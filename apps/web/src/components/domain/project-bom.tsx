'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardHeader, StatTile } from '@hackerland/ui';
import { CheckCircle2, Cpu, Heart } from 'lucide-react';
import { formatMoney } from '@hackerland/core';
import type { Resource } from '@/lib/data/types';

export interface ExtendedBOMItem extends Resource {
  partNumber?: string;
  supplier?: string;
  supplierUrl?: string;
}

export interface ProjectBOMProps {
  initialResources: Resource[];
  projectTitle: string;
}

const DEFAULT_SUPPLIERS = ['Robu.in', 'Evelta', 'Mouser India', 'JLCPCB'];

export function ProjectBOM({ initialResources, projectTitle }: ProjectBOMProps) {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [items, setItems] = useState<ExtendedBOMItem[]>(() =>
    initialResources.map((res, i) => ({
      ...res,
      partNumber: res.spec || `PART-0${i + 1}`,
      supplier: DEFAULT_SUPPLIERS[i % DEFAULT_SUPPLIERS.length],
      supplierUrl: 'https://robu.in',
    }))
  );
  const [fundedMessage, setFundedMessage] = useState<string | null>(null);

  const totalCost = items.reduce(
    (acc, item) => acc + (item.cost || 0) * (item.qty || 1) * multiplier,
    0
  );

  const fundedCost = items
    .filter((item) => item.status === 'funded')
    .reduce((acc, item) => acc + (item.cost || 0) * (item.qty || 1) * multiplier, 0);

  const needsFundingCount = items.filter((i) => i.status === 'needs-funding').length;

  const handleFundItem = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status: 'funded' } : item))
    );
    const itemName = items[index]?.name || 'Component';
    setFundedMessage(`Thank you! Pledged component: ${itemName} for ${projectTitle}.`);
    setTimeout(() => setFundedMessage(null), 5000);
  };

  const getStatusBadge = (status: Resource['status']) => {
    switch (status) {
      case 'funded':
        return <Badge tone="success" variant="solid">Funded</Badge>;
      case 'sourcing':
        return <Badge tone="warning" variant="outline">In Sourcing</Badge>;
      case 'needs-funding':
        return <Badge tone="accent" variant="outline">Needs Sponsor</Badge>;
    }
  };

  return (
    <Card className="min-w-0 border-hairline bg-surface-1 shadow-module">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-make" aria-hidden="true" />
            <h3 className="font-display text-headline-sm font-semibold text-fg">
              Hardware Bill of Materials (Open-BOM)
            </h3>
          </div>
          <p className="text-body-sm text-fg-muted mt-1">
            Real-time component procurement, domestic supplier routing, and community component micro-pledges.
          </p>
        </div>

        {/* Quantity Multiplier */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-hairline bg-surface-2 p-1">
          <span className="text-label-xs font-display text-fg-subtle px-2">Batch:</span>
          {[1, 5, 10].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMultiplier(m)}
              className={`rounded px-2.5 py-1 text-label-xs font-mono font-semibold transition-colors ${
                multiplier === m
                  ? 'bg-make text-on-solid'
                  : 'text-fg-muted hover:text-fg hover:bg-surface-3'
              }`}
            >
              {m}x
            </button>
          ))}
        </div>
      </CardHeader>

      <CardBody className="p-4 sm:p-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Total BOM Cost"
            value={formatMoney(totalCost, 'INR')}
            hint={`For ${multiplier} prototype${multiplier > 1 ? 's' : ''}`}
          />
          <StatTile
            label="Funded Capital"
            value={formatMoney(fundedCost, 'INR')}
            hint={`${Math.round((fundedCost / (totalCost || 1)) * 100)}% covered`}
          />
          <StatTile
            label="Unfunded Items"
            value={needsFundingCount.toString()}
            hint={needsFundingCount === 0 ? 'Fully funded!' : 'Awaiting micro-patrons'}
          />
          <StatTile
            label="Suppliers"
            value="Domestic (India)"
            hint="Robu, Evelta, Mouser"
          />
        </div>

        {/* Feedback message */}
        {fundedMessage && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-md border border-success/40 bg-success/10 p-3 text-body-sm text-success-fg animate-fadeIn"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span>{fundedMessage}</span>
          </div>
        )}

        {/* Items Table */}
        <div className="overflow-x-auto rounded-md border border-hairline">
          <table className="w-full text-left text-body-sm border-collapse">
            <thead className="border-b border-hairline bg-surface-2 font-display text-label-xs text-fg-subtle uppercase">
              <tr>
                <th className="py-2.5 px-3">Component & Spec</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Preferred Supplier</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-surface-1">
              {items.map((item, index) => {
                const itemQty = (item.qty || 1) * multiplier;
                const itemTotal = (item.cost || 0) * itemQty;

                return (
                  <tr key={index} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-display font-medium text-fg">{item.name}</div>
                      {item.spec && (
                        <div className="font-mono text-label-xs text-fg-subtle">{item.spec}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-fg-muted">
                      {itemQty}
                    </td>
                    <td className="py-3 px-3 text-fg-muted">
                      <span className="inline-flex items-center gap-1 font-display text-body-xs">
                        {item.supplier}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-fg-muted">
                      {formatMoney(item.cost || 0, 'INR')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-fg">
                      {formatMoney(itemTotal, 'INR')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status === 'needs-funding' ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleFundItem(index)}
                          className="hover:border-make hover:text-make"
                        >
                          <Heart className="h-3.5 w-3.5 text-make mr-1" />
                          Pledge {formatMoney(itemTotal, 'INR')}
                        </Button>
                      ) : (
                        <span className="text-label-xs font-mono text-success-fg flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          Acquired
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
