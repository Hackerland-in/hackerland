'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ThumbsUp,
  Users,
  ArrowUpRight,
  Plus,
  Sparkles,
  Filter,
  Search,
  MessageSquare,
  Send,
  Bookmark,
} from 'lucide-react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Input, cn } from '@hackerland/ui';
import { formatMoney } from '@hackerland/core';
import { getActiveBuilderIdentity } from '@/lib/builder-identity';
import { useSocialCommunity } from '@/components/social/social-context';
import {
  INITIAL_REVERSE_RFCS,
  type ReverseRfcRecord,
} from '@/lib/data/community-workflows-store';

export type ReverseRFC = ReverseRfcRecord;

export function ReverseRFCSection() {
  const [rfcs, setRfcs] = useState<ReverseRfcRecord[]>(INITIAL_REVERSE_RFCS);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'upvotes' | 'bounty' | 'squads'>('upvotes');
  const [onlySaved, setOnlySaved] = useState(false);

  // Thread expansion & replies
  const [expandedRfcId, setExpandedRfcId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // Create modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Clean Water');
  const [newSponsor, setNewSponsor] = useState('');
  const [newBounty, setNewBounty] = useState('50000');
  const [newDesc, setNewDesc] = useState('');
  const [shareToFeed, setShareToFeed] = useState(true);

  const { isItemSaved, toggleSaveItem } = useSocialCommunity();

  useEffect(() => {
    try {
      const savedRfcs = localStorage.getItem('hackerland_rfcs_v1');
      if (savedRfcs) {
        const parsed = JSON.parse(savedRfcs);
        if (Array.isArray(parsed) && parsed.length > 0) setRfcs(parsed);
      }
      const savedVotes = localStorage.getItem('hackerland_rfc_votes_v1');
      if (savedVotes) {
        const parsed = JSON.parse(savedVotes);
        if (Array.isArray(parsed)) setVotedIds(parsed);
      }
    } catch {}

    let active = true;
    fetch('/api/rfcs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.rfcs || !Array.isArray(data.rfcs)) return;
        setRfcs((prev) => {
          // Merge server items with any client-created local ones
          const map = new Map<string, ReverseRfcRecord>();
          for (const item of data.rfcs as ReverseRfcRecord[]) map.set(item.id, item);
          for (const localItem of prev) {
            if (!map.has(localItem.id)) map.set(localItem.id, localItem);
          }
          return Array.from(map.values());
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const persistRfcs = (next: ReverseRfcRecord[]) => {
    try {
      localStorage.setItem('hackerland_rfcs_v1', JSON.stringify(next));
    } catch {}
  };

  const domains = ['All', 'Clean Water', 'Cold-Chain Logistics', 'Soil Telemetry', 'Assistive Tech'];

  const handleVote = async (id: string) => {
    const hasVoted = votedIds.includes(id);
    const delta: 1 | -1 = hasVoted ? -1 : 1;

    setVotedIds((prev) => {
      const next = hasVoted ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('hackerland_rfc_votes_v1', JSON.stringify(next));
      } catch {}
      return next;
    });

    setRfcs((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, upvotes: Math.max(0, item.upvotes + delta) } : item,
      );
      persistRfcs(next);
      return next;
    });

    try {
      await fetch('/api/rfcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upvote', id, delta }),
      });
    } catch {}
  };

  const handleReplySubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const text = (replyDrafts[id] || '').trim();
    if (text.length < 3) return;
    const identity = getActiveBuilderIdentity();

    const newReply = {
      id: `rfc-reply-${Date.now()}`,
      authorName: identity.name,
      body: text,
      createdAt: new Date().toISOString(),
    };

    setRfcs((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, replies: [...(item.replies ?? []), newReply] } : item,
      );
      persistRfcs(next);
      return next;
    });
    setReplyDrafts((prev) => ({ ...prev, [id]: '' }));

    try {
      await fetch('/api/rfcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', id, authorName: identity.name, body: text }),
      });
    } catch {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    const identity = getActiveBuilderIdentity();

    const rfc: ReverseRfcRecord = {
      id: `rfc-${Date.now()}`,
      title: newTitle.trim(),
      domain: newDomain,
      sponsor: newSponsor.trim() || identity.name,
      bountyAmount: Number(newBounty) || 25000,
      description: newDesc.trim(),
      upvotes: 1,
      squadDraftsCount: 0,
      urgency: 'medium',
      replies: [],
    };

    setRfcs((prev) => {
      const next = [rfc, ...prev];
      persistRfcs(next);
      return next;
    });
    setIsModalOpen(false);
    setNewTitle('');
    setNewSponsor('');
    setNewDesc('');

    try {
      await fetch('/api/rfcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          title: rfc.title,
          domain: rfc.domain,
          sponsor: rfc.sponsor,
          bountyAmount: rfc.bountyAmount,
          description: rfc.description,
          shareToFeed,
        }),
      });
    } catch {}
  };

  const filteredRfcs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rfcs
      .filter((r) => {
        if (selectedDomain !== 'All' && r.domain !== selectedDomain) return false;
        if (onlySaved && !isItemSaved(`rfc:${r.id}`)) return false;
        if (
          q &&
          !r.title.toLowerCase().includes(q) &&
          !r.description.toLowerCase().includes(q) &&
          !r.sponsor.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'bounty') return b.bountyAmount - a.bountyAmount;
        if (sortBy === 'squads') return b.squadDraftsCount - a.squadDraftsCount;
        return b.upvotes - a.upvotes;
      });
  }, [rfcs, selectedDomain, onlySaved, searchQuery, sortBy, isItemSaved]);

  return (
    <div className="space-y-5 pt-5 border-t border-hairline" data-testid="reverse-rfc-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-accent" />
            <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent-fg">
              Grassroots Innovation Pipeline
            </span>
          </div>
          <h2 className="font-display text-headline-sm font-semibold text-fg">
            Reverse RFCs: Real-World Problem Statements
          </h2>
          <p className="text-body-sm text-fg-muted mt-1 max-w-2xl">
            Community organizations post urgent unsolved problems with pledged pools. Upvote high-impact RFCs, pitch hardware approaches, or assemble a squad.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          className="shrink-0 self-start md:self-auto"
        >
          <Plus className="size-4 mr-1.5" /> Submit Problem Statement
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-fg-subtle mr-1" />
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-full text-caption font-display font-medium transition-colors border ${
                selectedDomain === dom
                  ? 'border-accent bg-accent text-on-solid font-semibold shadow-xs'
                  : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg hover:border-accent/40'
              }`}
            >
              {dom}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOnlySaved((v) => !v)}
            aria-pressed={onlySaved}
            className={`px-3.5 py-1.5 rounded-full text-caption font-display font-medium transition-colors border ${
              onlySaved
                ? 'border-accent bg-accent-soft text-accent-fg font-semibold'
                : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg hover:border-accent/40'
            }`}
          >
            Saved RFCs
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-hairline">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-subtle" />
            <input
              type="search"
              placeholder="Search problem statements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-line bg-sunken pl-8 pr-3 text-body-xs text-fg placeholder:text-fg-subtle focus:border-accent focus:bg-surface-1 focus:outline-none"
            />
          </div>

          <select
            aria-label="Sort Reverse RFCs"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'upvotes' | 'bounty' | 'squads')}
            className="h-9 rounded-full border border-line bg-sunken px-3 text-body-xs text-fg focus:border-accent focus:bg-surface-1 focus:outline-none"
          >
            <option value="upvotes">Sort: Most Upvoted</option>
            <option value="bounty">Sort: Highest Bounty</option>
            <option value="squads">Sort: Most Squads</option>
          </select>
        </div>
      </div>

      {/* RFC Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRfcs.map((rfc) => {
          const hasVoted = votedIds.includes(rfc.id);
          const saved = isItemSaved(`rfc:${rfc.id}`);
          const isExpanded = expandedRfcId === rfc.id;
          const rfcReplies = rfc.replies ?? [];

          return (
            <Card key={rfc.id} className="flex flex-col justify-between border-hairline bg-surface-1 hover:border-accent/35 transition-colors">
              <div>
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone="code" variant="solid" className="text-caption">
                        {rfc.domain}
                      </Badge>
                      {rfc.urgency === 'critical' && (
                        <Badge tone="danger" variant="outline" className="text-caption">
                          Urgent Need
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-earn-fg text-body-sm tabular-nums">
                        {formatMoney(rfc.bountyAmount, 'INR')} Bounty
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSaveItem(`rfc:${rfc.id}`)}
                        aria-label={saved ? `Unsave ${rfc.title}` : `Save ${rfc.title}`}
                        aria-pressed={saved}
                        className={cn(
                          'flex size-7 items-center justify-center rounded-full border transition-colors',
                          saved
                            ? 'border-accent/40 bg-accent-soft text-accent-fg'
                            : 'border-hairline bg-surface-2/60 text-fg-subtle hover:text-accent-fg',
                        )}
                      >
                        <Bookmark className={cn('size-3', saved && 'fill-current')} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-body-lg font-semibold text-fg [overflow-wrap:anywhere]">{rfc.title}</h3>
                  <p className="text-caption text-fg-subtle">Posted by {rfc.sponsor}</p>
                </CardHeader>

                <CardBody className="space-y-3">
                  <p className="text-body-sm text-fg-muted">{rfc.description}</p>

                  {isExpanded && (
                    <div className="rounded-xl border border-hairline bg-sunken p-3 space-y-2.5">
                      <span className="font-display text-[11px] uppercase tracking-wider text-fg-subtle block">
                        Technical Approaches &amp; Pitches ({rfcReplies.length})
                      </span>
                      {rfcReplies.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {rfcReplies.map((rep) => (
                            <div key={rep.id} className="rounded-lg bg-surface-1 border border-hairline p-2.5 text-body-xs">
                              <span className="font-display font-semibold text-fg block">{rep.authorName}</span>
                              <p className="text-fg-muted mt-0.5">{rep.body}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-body-xs text-fg-subtle">
                          No architecture pitches yet. Share the first open approach below!
                        </p>
                      )}

                      <form onSubmit={(e) => handleReplySubmit(e, rfc.id)} className="flex gap-1.5 pt-1">
                        <Input
                          type="text"
                          placeholder="Pitch sensor BOM or build approach..."
                          value={replyDrafts[rfc.id] || ''}
                          onChange={(e) =>
                            setReplyDrafts((prev) => ({ ...prev, [rfc.id]: e.target.value }))
                          }
                          className="h-8 text-body-xs flex-1"
                        />
                        <Button type="submit" variant="primary" size="sm" className="h-8 px-2.5">
                          <Send className="size-3.5" />
                        </Button>
                      </form>
                    </div>
                  )}
                </CardBody>
              </div>

              <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-hairline/60">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleVote(rfc.id)}
                    aria-label={`Upvote ${rfc.title}`}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-caption transition-colors ${
                      hasVoted
                        ? 'border-accent bg-accent-soft text-accent-fg font-semibold'
                        : 'border-hairline bg-surface-2/60 text-fg-muted hover:text-fg hover:border-accent/30'
                    }`}
                  >
                    <ThumbsUp className={`size-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                    <span className="tabular-nums">{rfc.upvotes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedRfcId(isExpanded ? null : rfc.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-hairline bg-surface-2/60 text-caption text-fg-muted hover:text-accent-fg hover:border-accent/30 transition-colors"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>Pitch ({rfcReplies.length})</span>
                  </button>

                  <span className="flex items-center gap-1 text-caption text-fg-subtle">
                    <Users className="size-3.5" />
                    <span>{rfc.squadDraftsCount} Squads</span>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fg/35 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface-1 p-6 shadow-overlay space-y-4">
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
                  className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-caption font-medium text-fg mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
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
                    className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
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
                  className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-caption font-medium text-fg mb-1">
                  Technical Requirements &amp; Context
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the environment, existing constraints, target BOM limit, or user safety standards..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-line bg-sunken px-3 py-2 text-body-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              <label className="flex items-center gap-2 text-body-xs text-fg-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareToFeed}
                  onChange={(e) => setShareToFeed(e.target.checked)}
                  className="accent-accent"
                />
                <span>Broadcast problem callout to the Live Community Feed</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
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
