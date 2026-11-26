'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Cpu,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  Wrench,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { HardwareJobPosting } from '@hackerland/core';
import { formatSalaryRangeInr } from '@hackerland/core';
import { Avatar, Badge, Button, Card, CardBody, Input, Panel, Textarea } from '@hackerland/ui';

interface JobDetailViewProps {
  job: HardwareJobPosting;
}

export function JobDetailView({ job }: JobDetailViewProps) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [hardwareBugStory, setHardwareBugStory] = useState('');
  const [applied, setApplied] = useState(false);

  const salaryText = formatSalaryRangeInr(
    job.salaryInr.minLakhs,
    job.salaryInr.maxLakhs,
    job.salaryInr.equityPercent
  );

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm text-fg-subtle">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 font-display font-medium hover:text-accent-fg transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Deep-Tech Jobs &amp; Fellowships</span>
        </Link>
        <span>/</span>
        <span className="text-fg font-medium truncate">{job.title}</span>
      </nav>

      {/* Hero Header */}
      <Card className="border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft">
        <CardBody className="p-5 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="solid">
              {job.hardwareDomain.replace(/_/g, ' ')}
            </Badge>
            <Badge tone="neutral" variant="outline">
              {job.roleType.replace(/_/g, ' ')}
            </Badge>
            <Badge tone="neutral" variant="outline">
              {job.experienceLevel.replace(/_/g, ' ')}
            </Badge>
            {job.company.verifiedDpiit && (
              <Badge tone="success" variant="outline">
                <ShieldCheck className="size-3" aria-hidden="true" />
                <span>DPIIT Startup India</span>
              </Badge>
            )}
          </div>

          <div className="flex items-start gap-3.5">
            <Avatar name={job.company.name} size="lg" className="shrink-0 mt-0.5" />
            <div className="space-y-1.5 min-w-0">
              <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold text-fg tracking-tight [overflow-wrap:anywhere]">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-body-sm text-fg-muted">
                <span className="font-display font-bold text-fg">{job.company.name}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5 text-fg-subtle" aria-hidden="true" />
                  <span>{job.workLocation}</span>
                </span>
                <span>•</span>
                <span className="font-display font-bold text-earn-fg tabular-nums">{salaryText}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-hairline">
            <div className="rounded-xl border border-hairline bg-surface-1/90 p-3.5">
              <span className="font-mono text-[11px] uppercase text-fg-subtle block">
                COMPENSATION PACKAGE
              </span>
              <span className="font-display text-headline-sm font-bold text-earn-fg tabular-nums block mt-0.5">
                {salaryText}
              </span>
              <span className="text-[11px] text-fg-subtle font-mono block">
                Approx. ₹{Math.round((job.salaryInr.minLakhs * 100000) / 12).toLocaleString('en-IN')} – ₹
                {Math.round((job.salaryInr.maxLakhs * 100000) / 12).toLocaleString('en-IN')} / month
              </span>
              {job.fellowshipGrantStipendInr && (
                <span className="text-[11px] font-mono font-semibold text-accent-fg block mt-1">
                  Fellowship Stipend: ₹{job.fellowshipGrantStipendInr.toLocaleString('en-IN')} / mo
                </span>
              )}
            </div>

            <div className="rounded-xl border border-hairline bg-surface-1/90 p-3.5 space-y-1.5">
              <span className="font-mono text-[11px] uppercase text-fg-subtle block">
                ORGANIZATION PROFILE
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-body-md font-bold text-fg">{job.company.name}</span>
                <Badge tone="earn" variant="outline">{job.company.stage}</Badge>
              </div>
              <div className="text-body-xs text-fg-muted">
                {job.company.city}, {job.company.state} • Founded {job.company.foundedYear}
              </div>
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-body-xs font-display font-semibold text-accent-fg hover:underline"
              >
                <span>Company Website</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Role Overview */}
      <Panel title="Role Overview" icon={<Briefcase aria-hidden="true" />}>
        <div className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed whitespace-pre-line">
          {job.descriptionMarkdown}
        </div>
      </Panel>

      {/* Responsibilities & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Panel title="Key Engineering Responsibilities" icon={<CheckCircle2 aria-hidden="true" />}>
          <div className="space-y-2.5">
            {job.responsibilities.map((resp, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-body-sm text-fg-muted">
                <Check className="size-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{resp}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Prerequisites & Domain Qualifications" icon={<Cpu aria-hidden="true" />}>
          <div className="space-y-2.5">
            {job.prerequisites.map((prereq, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-body-sm text-fg-muted">
                <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span className="leading-relaxed">{prereq}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Physical Lab Benches & Test Equipment */}
      <Panel
        title="Physical Lab Benches & Test Equipment"
        icon={<Wrench aria-hidden="true" />}
      >
        <p className="text-body-sm text-fg-muted mb-3">
          You will have direct hands-on access to the following instrumentation testbenches:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {job.hardwareBenchesUsed.map((bench, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-hairline bg-sunken px-3.5 py-2.5 text-body-xs font-mono text-fg flex items-center gap-2"
            >
              <Cpu className="size-3.5 text-accent shrink-0" aria-hidden="true" />
              <span>{bench}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Required Proof of Work */}
      <Panel
        title="Proof-of-Work Application Standard"
        icon={<Sparkles aria-hidden="true" />}
        className="border-warning/30 bg-warning/5"
      >
        <p className="text-body-sm text-fg-muted leading-relaxed mb-3">
          We do not filter by college pedigree or standard PDF resumes. Instead, the hiring engineering lead evaluates your application based on verified evidence of physical hardware built:
        </p>
        <div className="space-y-2">
          {job.proofOfWorkRequirements.map((req, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-body-xs font-mono text-fg">
              <span className="text-warning-fg font-bold shrink-0">[{idx + 1}]</span>
              <span className="leading-relaxed">{req}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Proof-of-Work Application Form */}
      <Panel
        title="Apply with Proof-of-Work"
        icon={<Send aria-hidden="true" />}
        action={<Badge tone="accent" variant="outline">Direct to Engineering Lead</Badge>}
        className="border-accent/25"
      >
        {applied ? (
          <div
            role="status"
            className="rounded-xl border border-success/40 bg-success/10 p-5 text-center space-y-2"
          >
            <CheckCircle2 className="size-8 text-success-fg mx-auto" aria-hidden="true" />
            <h3 className="font-display text-headline-sm font-bold text-fg">
              Application Received!
            </h3>
            <p className="text-body-sm text-fg-muted leading-relaxed">
              Your proof-of-work submission has been routed directly to the engineering hiring team at{' '}
              <strong className="text-fg">{job.company.name}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-display text-label-md text-fg block mb-1">
                  Your Full Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Vikram Joshi"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-display text-label-md text-fg block mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="font-display text-label-md text-fg block mb-1">
                Proof-of-Work Link (GitHub / Altium / CAD / Video)
              </label>
              <Input
                type="url"
                required
                placeholder="https://github.com/my-profile/firmware-repo"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="font-mono text-body-sm"
              />
            </div>

            <div>
              <label className="font-display text-label-md text-fg block mb-1">
                Describe a hard hardware bug you encountered and resolved
              </label>
              <Textarea
                rows={3}
                required
                placeholder="e.g. Solved ringing on high-side gate driver by adding ferrite bead and tuned deadtime to 120ns..."
                value={hardwareBugStory}
                onChange={(e) => setHardwareBugStory(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full shadow-glow-accent">
              <Send className="size-4" aria-hidden="true" />
              <span>Submit Application with Proof-of-Work</span>
            </Button>
          </form>
        )}
      </Panel>
    </div>
  );
}
