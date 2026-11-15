'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader } from '@hackerland/ui';
import { formatMoney } from '@hackerland/core';
import { ThumbsUp, Users, ArrowUpRight, Plus, Sparkles, Filter } from 'lucide-react';

export interface ReverseRFC {
  id: string;
  title: string;
  domain: string;
  sponsor: string;
  bountyAmount: number;
  description: string;
  upvotes: number;
  squadDraftsCount: number;
  urgency: 'high' | 'medium' | 'critical';
}

const INITIAL_RFCS: ReverseRFC[] = [
  {
    id: 'rfc-1',
    title: 'Low-Cost Arsenic & Fluoride IoT Spectrophotometer',
    domain: 'Clean Water',
    sponsor: 'Jal Jeevan Open Tech',
    bountyAmount: 150000,
    description:
      'Field-deployable colorimetric sensor node testing groundwater contamination with sub-₹1,200 bill of materials.',
    upvotes: 34,
    squadDraftsCount: 3,
    urgency: 'critical',
  },
  {
    id: 'rfc-2',
    title: 'Solar-Assisted Phase Change Material (PCM) Vaccine Carrier',
    domain: 'Cold-Chain Logistics',
    sponsor: 'Rural Health Alliance',
    bountyAmount: 120000,
    description:
      'Passive-active hybrid cooling container maintaining 2°C–8°C for 72 hours across 45°C ambient temperatures in tier-3 districts.',
    upvotes: 48,
    squadDraftsCount: 2,
    urgency: 'high',
  },
  {
    id: 'rfc-3',
    title: 'Sub-₹500 LoRaWAN NPK Optical Soil Sensor Node',
    domain: 'Soil Telemetry',
    sponsor: 'Kisan AI Foundation',
    bountyAmount: 85000,
    description:
      'Multi-spectral LED sensor measuring nitrogen, phosphorus, and potassium absorption in clay-loam soils with 1-year battery life.',
    upvotes: 29,
    squadDraftsCount: 4,
    urgency: 'medium',
  },
  {
    id: 'rfc-4',
    title: 'Open-Hardware Haptic Navigation Cane with Ultrasonic Mesh',
    domain: 'Assistive Tech',
    sponsor: 'National Blind Federation',
    bountyAmount: 95000,
    description:
      'Lightweight smart cane using spatial haptic pulses to detect overhead obstacles, potholes, and moving two-wheelers.',
    upvotes: 52,
    squadDraftsCount: 5,
    urgency: 'critical',
  },
];

export function ReverseRFCSection() {
  const [rfcs, setRfcs] = useState<ReverseRFC[]>(INITIAL_RFCS);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Clean Water');
  const [newSponsor, setNewSponsor] = useState('');
  const [newBounty, setNewBounty] = useState('50000');
  const [newDesc, setNewDesc] = useState('');

  const domains = ['All', 'Clean Water', 'Cold-Chain Logistics', 'Soil Telemetry', 'Assistive Tech'];

  const handleVote = (id: string) => {
    setRfcs((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasVoted = votedIds.has(id);
          return {
            ...item,
            upvotes: hasVoted ? item.upvotes - 1 : item.upvotes + 1,
          };
        }
        return item;
      })
    );
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const rfc: ReverseRFC = {
      id: `rfc-${Date.now()}`,
      title: newTitle.trim(),
      domain: newDomain,
      sponsor: newSponsor.trim() || 'Community Partner',
      bountyAmount: Number(newBounty) || 25000,
      description: newDesc.trim(),
      upvotes: 1,
      squadDraftsCount: 0,
      urgency: 'medium',
    };

    setRfcs((prev) => [rfc, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredRfcs =
    selectedDomain === 'All' ? rfcs : rfcs.filter((r) => r.domain === selectedDomain);

  return (
    <div className="space-y-6 pt-4 border-t border-hairline" data-testid="reverse-rfc-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-earn" />
            <span className="font-display text-caption font-semibold uppercase tracking-wider text-earn">
              Grassroots Innovation Pipeline
            </span>
          </div>
          <h2 className="font-display text-headline-sm font-semibold text-fg">
            Reverse RFCs: Real-World Problem Statements
          </h2>
          <p className="text-body-sm text-fg-muted mt-1 max-w-2xl">
            Community organizations and foundations post urgent unsolved problems with pledged prize
            pools. Upvote high-impact statements or assemble a squad to build the open spec.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="earn"
          size="sm"
          className="shrink-0 self-start md:self-auto"
        >
          <Plus className="size-4 mr-1.5" /> Submit Problem Statement
        </Button>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-4 text-fg-subtle mr-1" />
        {domains.map((dom) => (
          <button
            key={dom}
            type="button"
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1 rounded-full text-caption font-medium transition-colors border ${
              selectedDomain === dom
                ? 'border-earn bg-earn/10 text-earn font-semibold'
                : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg hover:border-hairline-strong'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* RFC Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRfcs.map((rfc) => {
          const hasVoted = votedIds.has(rfc.id);
          return (
            <Card key={rfc.id} className="flex flex-col justify-between border-hairline bg-surface-1">
              <div>
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Badge tone="code" variant="solid" className="text-caption">
                        {rfc.domain}
                      </Badge>
                      {rfc.urgency === 'critical' && (
                        <Badge tone="danger" variant="outline" className="text-caption">
                          Urgent Need
                        </Badge>
                      )}
                    </div>
                    <span className="font-display font-semibold text-earn text-body-sm tabular-nums">
                      {formatMoney(rfc.bountyAmount, 'INR')} Bounty
                    </span>
                  </div>

                  <h3 className="font-display text-body-lg font-semibold text-fg">{rfc.title}</h3>
                  <p className="text-caption text-fg-subtle">Posted by {rfc.sponsor}</p>
                </CardHeader>

                <CardBody>
                  <p className="text-body-sm text-fg-muted">{rfc.description}</p>
                </CardBody>
              </div>

              <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-hairline/60">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleVote(rfc.id)}
                    aria-label={`Upvote ${rfc.title}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-caption transition-colors ${
                      hasVoted
                        ? 'border-earn bg-earn/15 text-earn font-semibold'
                        : 'border-hairline text-fg-muted hover:text-fg hover:bg-surface-2'
                    }`}
                  >
                    <ThumbsUp className={`size-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                    <span className="tabular-nums">{rfc.upvotes}</span>
                  </button>

                  <span className="flex items-center gap-1 text-caption text-fg-subtle">
                    <Users className="size-3.5" />
                    <span>{rfc.squadDraftsCount} Squads Tackling</span>
                  </span>
                </div>

                <Button asChild size="sm" variant="ghost">
                  <Link href={`/new?ref=rfc&title=${encodeURIComponent(rfc.title)}`}>
                    Assemble Squad <ArrowUpRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-rfc-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg rounded-lg border border-hairline bg-surface-2 p-6 shadow-overlay space-y-4">
            <h3 id="submit-rfc-dialog-title" className="font-display text-headline-sm font-semibold text-fg">
              Submit Reverse RFC / Problem Statement
            </h3>
            <p className="text-body-sm text-fg-muted">
              Define a physical or digital challenge facing your community, hospital, school, or organization.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-caption font-medium text-fg mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sub-₹1,000 Portable Pulse Oximeter Calibration Rig"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded border border-hairline bg-surface-1 px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-medium text-fg mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full rounded border border-hairline bg-surface-1 px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                  >
                    <option value="Clean Water">Clean Water</option>
                    <option value="Cold-Chain Logistics">Cold-Chain Logistics</option>
                    <option value="Soil Telemetry">Soil Telemetry</option>
                    <option value="Assistive Tech">Assistive Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption font-medium text-fg mb-1">Pledged Bounty (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={newBounty}
                    onChange={(e) => setNewBounty(e.target.value)}
                    className="w-full rounded border border-hairline bg-surface-1 px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-medium text-fg mb-1">
                  Organization / Community Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gram Panchayat Water Board / Open Clinic"
                  value={newSponsor}
                  onChange={(e) => setNewSponsor(e.target.value)}
                  className="w-full rounded border border-hairline bg-surface-1 px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-fg mb-1">
                  Technical Requirements & Context
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the environment, existing constraints, target BOM limit, or user safety standards..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded border border-hairline bg-surface-1 px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="earn">
                  Publish Statement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
