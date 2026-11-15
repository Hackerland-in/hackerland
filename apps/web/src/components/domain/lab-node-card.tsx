import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Chip } from '@hackerland/ui';
import {
  MapPin,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Mail,
} from 'lucide-react';
import type { LabNodeView } from '@/lib/data/types';

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
          {/* Tools & Capabilities */}
          <div className="space-y-1.5">
            <span className="font-display text-label-xs uppercase tracking-wider text-fg-subtle">
              Available Tools & Testbenches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {lab.tools.map((tool) => (
                <Chip key={tool} tone="make" className="text-label-xs">
                  {tool}
                </Chip>
              ))}
            </div>
          </div>

          {/* Equipment Highlights */}
          {lab.equipmentList && lab.equipmentList.length > 0 && (
            <div className="space-y-1.5 rounded-sm border border-hairline/80 bg-surface-2/40 p-2.5">
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
        </CardBody>
      </div>

      <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-hairline pt-3">
        <div className="flex items-center gap-2 text-body-xs font-mono text-fg-subtle">
          <Mail className="size-3 shrink-0 text-fg-subtle" />
          <span className="truncate">{lab.contact.name} ({lab.contact.role})</span>
        </div>

        <Button
          asChild
          variant="secondary"
          size="sm"
          className="shrink-0 gap-1.5 font-display text-label-xs uppercase"
        >
          <a
            href={`mailto:${lab.contact.email}?subject=Hackerland Squad Booking: ${encodeURIComponent(lab.name)}`}
          >
            <span>Book Bench / HIL Rig</span>
            <ExternalLink className="size-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
