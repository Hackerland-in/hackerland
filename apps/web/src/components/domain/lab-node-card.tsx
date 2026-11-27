'use client';

import { useState } from 'react';
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Chip, Input } from '@hackerland/ui';
import {
  MapPin,
  CheckCircle2,
  Cpu,
  Mail,
  Calendar,
  Check,
  X,
} from 'lucide-react';
import type { LabNodeView } from '@/lib/data/types';
import { useBuilderIdentity } from '@/lib/builder-identity';

export interface LabNodeCardProps {
  lab: LabNodeView;
  className?: string;
}

const TYPE_LABELS: Record<string, { label: string; tone: 'accent' | 'make' | 'learn' | 'earn' }> = {
  atl: { label: 'ATL Tinkering Node', tone: 'accent' },
  fablab: { label: 'Community FabLab', tone: 'make' },
  college: { label: 'University Makerspace', tone: 'learn' },
  incubator: { label: 'DeepTech Incubator', tone: 'earn' },
};

export function LabNodeCard({ lab, className = '' }: LabNodeCardProps) {
  const typeMeta = TYPE_LABELS[lab.type] ?? { label: lab.type.toUpperCase(), tone: 'accent' };
  const { identity } = useBuilderIdentity();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(lab.tools[0] ?? 'Bench Access');
  const [selectedDate, setSelectedDate] = useState('2026-12-02');
  const [purposeNote, setPurposeNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'club_equipment_booking',
          clubSlug: lab.slug,
          equipmentId: selectedTool,
          equipmentName: `${lab.name} — ${selectedTool}`,
          slotWindow: `${selectedDate} (${purposeNote.trim() || 'Student / Squad prototype session'})`,
          actorName: identity.name,
          actorHandle: identity.handle,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { booking?: { id?: string } };
        setConfirmedId(data.booking?.id ?? `pass-${Date.now()}`);
      } else {
        setConfirmedId(`pass-local-${Date.now()}`);
      }
    } catch {
      setConfirmedId(`pass-local-${Date.now()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      accent={typeMeta.tone}
      interactive
      className={`flex flex-col justify-between min-w-0 break-words ${className}`}
    >
      <div>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone={typeMeta.tone} variant="solid">
                {typeMeta.label}
              </Badge>
              {lab.isVerified && (
                <Badge tone="success" variant="outline" className="gap-1">
                  <CheckCircle2 className="size-3" />
                  VERIFIED NODE
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-label-xs font-mono text-fg-subtle">
              <MapPin className="size-3 text-fg-subtle" />
              <span>
                {lab.location.city}, {lab.location.state}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-display text-headline-sm text-fg break-words">
              {lab.name}
            </h3>
            <p className="text-body-sm text-fg-muted break-words">
              {lab.institution}
            </p>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div className="space-y-1.5">
            <span className="font-display text-label-xs uppercase tracking-wider text-fg-subtle">
              Available Tools &amp; Testbenches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {lab.tools.map((tool) => (
                <Chip key={tool} tone="make" className="text-label-xs">
                  {tool}
                </Chip>
              ))}
            </div>
          </div>

          {lab.equipmentList && lab.equipmentList.length > 0 && (
            <div className="space-y-1.5 rounded-xl border border-hairline/80 bg-sunken p-3">
              <div className="flex items-center justify-between text-label-xs font-mono text-fg-subtle">
                <span className="flex items-center gap-1">
                  <Cpu className="size-3 text-accent" />
                  <span>Equipment Manifest</span>
                </span>
                <span>{lab.equipmentList.length} items registered</span>
              </div>
              <div className="space-y-1">
                {lab.equipmentList.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between font-mono text-[11px] text-fg-muted"
                  >
                    <span className="truncate max-w-[200px]">{item.name}</span>
                    <span className="text-fg-subtle shrink-0">×{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingOpen && (
            <div className="rounded-xl border border-accent/30 bg-accent-soft/60 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-body-xs font-bold text-fg">
                  Reserve Bench as {identity.name} (@{identity.handle})
                </span>
                <button
                  type="button"
                  onClick={() => setBookingOpen(false)}
                  aria-label="Close bench booking panel"
                  className="text-fg-subtle hover:text-fg"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {confirmedId ? (
                <div className="rounded-lg bg-surface-1 border border-emerald-200 p-3 space-y-1.5 text-body-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <Check className="size-4" />
                    <span>Bench Pass Reserved ({selectedDate})</span>
                  </div>
                  <p className="font-mono text-[11px] text-fg-muted">
                    Pass ID: {confirmedId} · Tool: {selectedTool}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookSlot} className="space-y-2.5 text-body-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      aria-label="Select Lab Tool"
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="rounded-lg border border-line bg-surface-1 px-2.5 py-1.5 font-mono text-xs text-fg"
                    >
                      {lab.tools.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="date"
                      aria-label="Preferred Bench Date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    placeholder="What are you prototyping? (e.g. PCB bring-up, 3D bracket)"
                    value={purposeNote}
                    onChange={(e) => setPurposeNote(e.target.value)}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`mailto:${lab.contact.email}?subject=Hackerland Squad Booking: ${encodeURIComponent(lab.name)}`}
                      className="text-[11px] text-fg-muted hover:text-accent-fg underline"
                    >
                      Email Coordinator
                    </a>
                    <Button type="submit" size="sm" variant="primary" disabled={submitting}>
                      {submitting ? 'Booking...' : 'Confirm Pass'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </CardBody>
      </div>

      <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-3">
        <div className="flex items-center gap-2 text-body-xs font-mono text-fg-subtle min-w-0">
          <Mail className="size-3 shrink-0 text-fg-subtle" />
          <span className="truncate">{lab.contact.name} ({lab.contact.role})</span>
        </div>

        <Button
          type="button"
          variant={confirmedId ? 'soft' : 'primary'}
          size="sm"
          onClick={() => setBookingOpen((o) => !o)}
          className="shrink-0 gap-1.5 font-display text-label-xs uppercase"
        >
          <Calendar className="size-3" aria-hidden="true" />
          <span>{confirmedId ? 'Pass Confirmed' : 'Book Bench / HIL Rig'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
