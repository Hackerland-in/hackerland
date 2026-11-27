'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, SectionHeader } from '@hackerland/ui';
import {
  GraduationCap,
  Play,
  ExternalLink,
  BookOpen,
  PieChart,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Globe,
  Factory,
  BadgeIndianRupee,
  Rocket,
  FileCheck2,
} from 'lucide-react';
import {
  ENTREPRENEUR_COURSES,
  CURATED_ESSAYS,
  OPEN_SOURCE_FOUNDER_DOCS,
} from './entrepreneurship-data';
import { CapTableCalculator } from './cap-table-calculator';
import { UnitEconomicsCalculator } from './unit-economics-calculator';

export function EntrepreneurshipHub() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>('cs183b-how-to-start-a-startup');
  const [activeTab, setActiveTab] = useState<'courses' | 'calculators' | 'reading' | 'legal'>('courses');

  const categories = [
    'All',
    'Fundamentals',
    'Customer Discovery',
    'Hardware & Deep Tech',
    'Scaling',
    'Legal & Operations',
  ];

  const filteredCourses = ENTREPRENEUR_COURSES.filter((course) => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent" variant="solid" className="font-mono text-caption">
              100% Free & Open Access
            </Badge>
            <Badge tone="neutral" variant="outline" className="font-mono text-caption">
              Stanford · YC · MIT · Harvard · DPIIT
            </Badge>
          </div>
          <h1 className="text-heading-lg sm:text-headline-md font-display font-bold text-fg tracking-tight">
            Open-Source Founder Academy & Playbooks
          </h1>
          <p className="text-body-md text-fg-muted">
            The world’s most comprehensive repository of verified, free university curricula, video playlists, unit economics calculators, and legal frameworks for technical founders.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-hairline/80">
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">University Courses</span>
            <span className="text-heading-sm font-mono font-bold text-fg">7 Masterclasses</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Curated Video Hours</span>
            <span className="text-heading-sm font-mono font-bold text-earn-fg">140+ Hours</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Cost to Founders</span>
            <span className="text-heading-sm font-mono font-bold text-accent-fg">₹0 / $0 Forever</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-fg-muted uppercase block">Legal Templates</span>
            <span className="text-heading-sm font-mono font-bold text-fg">SAFE & Term Sheets</span>
          </div>
        </div>
      </div>

      {/* Main View Mode Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-hairline pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'courses'
              ? 'bg-accent/10 border border-accent text-accent font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <GraduationCap className="size-4" />
          <span>Courses & Playlists ({ENTREPRENEUR_COURSES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculators')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'calculators'
              ? 'bg-accent/10 border border-accent text-accent font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <PieChart className="size-4" />
          <span>Cap Table & Unit Economics Calculators</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reading')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'reading'
              ? 'bg-accent/10 border border-accent text-accent font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <BookOpen className="size-4" />
          <span>Essential Founder Essays ({CURATED_ESSAYS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-display font-medium transition-colors ${
            activeTab === 'legal'
              ? 'bg-accent/10 border border-accent text-accent font-bold'
              : 'text-fg-muted hover:text-fg hover:bg-surface-1 border border-transparent'
          }`}
        >
          <FileText className="size-4" />
          <span>Open-Source SAFE & Legal Vault</span>
        </button>
      </div>

      {/* TAB 1: COURSES & PLAYLISTS */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-colors border ${
                    activeCategory === cat
                      ? 'border-accent bg-accent/10 text-accent font-bold'
                      : 'border-hairline bg-surface-1 text-fg-muted hover:text-fg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                placeholder="Search lectures, topics, YC, MIT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-1 border border-hairline text-caption text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Courses List */}
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourseId === course.id;

              return (
                <Card
                  key={course.id}
                  className="p-5 sm:p-6 bg-surface-1 border-hairline transition-all hover:border-hairline-strong space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono text-accent uppercase font-bold">
                          {course.provider}
                        </span>
                        <span className="text-fg-subtle">·</span>
                        <Badge tone="accent" variant="solid" className="font-mono text-[10px]">
                          {course.freeBadge}
                        </Badge>
                        <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
                          {course.duration} ({course.lectureCount} Lectures)
                        </Badge>
                      </div>

                      <h3 className="text-heading-sm font-display font-bold text-fg">
                        {course.title}
                      </h3>

                      <p className="text-body-sm text-fg-muted">
                        <span className="text-fg font-medium">Instructors:</span> {course.instructor}
                      </p>

                      <p className="text-body-sm text-fg-muted pt-1">
                        {course.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-2 text-fg-muted border border-hairline"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                      {course.playlistUrl && (
                        <Button
                          asChild
                          variant="primary"
                          size="sm"
                          className="gap-1.5 text-caption font-mono"
                        >
                          <a
                            href={course.playlistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Play className="size-3.5 fill-current" />
                            <span>
                              {course.playlistUrl.includes('list=')
                                ? 'Watch Playlist'
                                : 'Watch Lectures'}
                            </span>
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      )}

                      {course.externalUrl && (
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="gap-1.5 text-caption font-mono"
                        >
                          <a
                            href={course.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Course Portal</span>
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-1.5 text-caption font-mono"
                        onClick={() =>
                          setExpandedCourseId(isExpanded ? null : course.id)
                        }
                      >
                        <span>{isExpanded ? 'Hide Syllabus' : 'View Syllabus'}</span>
                        {isExpanded ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Syllabus Drawer */}
                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-hairline space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-fg-muted uppercase font-bold">
                          Core Curriculum & Actionable Takeaways ({course.syllabus.length} Modules)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.syllabus.map((lecture) => (
                          <div
                            key={lecture.lectureNumber}
                            className="p-3 rounded-lg bg-surface-2 border border-hairline space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-accent font-bold">
                                Lecture {lecture.lectureNumber}
                              </span>
                              {lecture.speaker && (
                                <span className="text-fg-subtle truncate max-w-[180px]">
                                  {lecture.speaker}
                                </span>
                              )}
                            </div>
                            <h4 className="text-caption font-bold text-fg">
                              {lecture.title}
                            </h4>
                            <p className="text-[11px] text-fg-muted pt-0.5">
                              <span className="text-earn-fg font-medium">Core rule:</span> {lecture.keyTakeaway}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CALCULATORS & DYNAMICS */}
      {activeTab === 'calculators' && (
        <div className="space-y-6">
          <CapTableCalculator />
          <UnitEconomicsCalculator />
        </div>
      )}

      {/* TAB 3: ESSENTIAL ESSAYS */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-1 border border-hairline">
            <h3 className="text-body-sm font-display font-bold text-fg mb-1">
              The Canonical Founder Reading Curriculum
            </h3>
            <p className="text-caption text-fg-muted">
              Hand-picked seminal texts on customer psychology, maker scheduling, non-scalable distribution, and specific knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURATED_ESSAYS.map((essay) => (
              <Card
                key={essay.id}
                className="p-5 bg-surface-1 border-hairline space-y-3 flex flex-col justify-between hover:border-hairline-strong transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-caption font-mono">
                    <span className="text-accent font-bold">{essay.author}</span>
                    <span className="text-fg-subtle">{essay.readTimeMin} min read</span>
                  </div>
                  <h4 className="text-heading-sm font-display font-bold text-fg">
                    {essay.title}
                  </h4>
                  <p className="text-caption text-fg-muted">
                    {essay.oneLineSummary}
                  </p>
                  <div className="p-2.5 rounded-lg bg-sunken border border-hairline text-[11px] font-mono text-earn-fg">
                    &ldquo;{essay.coreRule}&rdquo;
                  </div>
                </div>

                <div className="pt-2 border-t border-hairline/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-fg-subtle">{essay.source}</span>
                  <Button asChild variant="secondary" size="sm" className="gap-1.5 text-caption font-mono">
                    <a href={essay.url} target="_blank" rel="noopener noreferrer">
                      <span>Read Original</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LEGAL VAULT */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-1 border border-hairline">
            <h3 className="text-body-sm font-display font-bold text-fg mb-1">
              Open-Source Legal Agreements & Incorporation Frameworks
            </h3>
            <p className="text-caption text-fg-muted">
              Never pay expensive early legal fees for standard equity agreements. Use industry-standard open templates trusted by top accelerators and institutional venture funds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {OPEN_SOURCE_FOUNDER_DOCS.map((doc) => (
              <Card
                key={doc.id}
                className="p-5 bg-surface-1 border-hairline space-y-3 flex flex-col justify-between hover:border-hairline-strong transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-accent uppercase font-bold">
                      {doc.organization}
                    </span>
                    <Badge tone="neutral" variant="outline" className="font-mono text-[10px]">
                      {doc.format}
                    </Badge>
                  </div>
                  <h4 className="text-body-sm font-display font-bold text-fg">
                    {doc.title}
                  </h4>
                  <p className="text-caption text-fg-muted">
                    {doc.description}
                  </p>
                </div>

                <Button asChild variant="secondary" size="sm" className="w-full gap-1.5 text-caption font-mono">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <span>Access Standard Docs</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* INDIA MANUFACTURING, MSME & EXPORT LAUNCH STACK */}
      <section
        aria-labelledby="india-msme-export-stack"
        className="rounded-2xl border border-accent/25 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft/75 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <SectionHeader
          eyebrow="INDIA MSME & GLOBAL EXPORT EXECUTION"
          title={<span id="india-msme-export-stack">India Manufacturing, MSME &amp; Export Launch Stack</span>}
          description="Move cleanly from lab prototype to factory floor and international customs clearance using India’s zero-fee registrations, working-capital shields, and non-dilutive manufacturing grants."
          action={
            <Button asChild variant="primary" size="sm">
              <Link href="/export">
                <Globe className="size-4" aria-hidden="true" />
                <span>Open Export Hub</span>
              </Link>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Badge tone="accent" variant="outline">MSME IDENTITY · ₹0 FEE</Badge>
              <Building2 className="size-4 text-accent-fg" aria-hidden="true" />
            </div>
            <h3 className="font-display text-body-lg font-bold text-fg">
              Udyam Registration
            </h3>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              Instant Aadhaar &amp; PAN-linked Micro/Small/Medium enterprise certificate on{' '}
              <span className="font-mono text-fg">udyamregistration.gov.in</span>. Unlocks collateral-free CGTMSE term loans up to ₹5 Cr, TReDS invoice discounting against large OEMs, and government PSU tender EMD exemptions.
            </p>
            <div className="p-3 rounded-xl bg-sunken border border-hairline text-[11px] font-mono text-fg-muted">
              Pair with DPIIT Startup Recognition for 3-year Section 80-IAC tax holiday &amp; fast-track patent rebates.
            </div>
          </Card>

          <Card className="p-5 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Badge tone="code" variant="outline">CUSTOMS &amp; PORT CODE</Badge>
              <Globe className="size-4 text-code-fg" aria-hidden="true" />
            </div>
            <h3 className="font-display text-body-lg font-bold text-fg">
              DGFT IEC &amp; ICEGATE AD Code
            </h3>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              Obtain your 10-digit Importer-Exporter Code via{' '}
              <span className="font-mono text-fg">dgft.gov.in</span> (₹500 statutory fee) and register your bank’s Authorized Dealer (AD) Code on ICEGATE for Nhava Sheva, Mundra, Chennai, or Bengaluru Air Cargo before dispatching export samples or FCL containers.
            </p>
            <div className="p-3 rounded-xl bg-sunken border border-hairline text-[11px] font-mono text-fg-muted">
              Mandatory for clearing commercial prototypes, EPCG capital machinery, and claiming export duty scripts.
            </div>
          </Card>

          <Card className="p-5 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Badge tone="earn" variant="outline">WORKING CAPITAL SHIELD</Badge>
              <FileCheck2 className="size-4 text-earn-fg" aria-hidden="true" />
            </div>
            <h3 className="font-display text-body-lg font-bold text-fg">
              GST Zero-Rated LUT (Form RFD-11)
            </h3>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              File an annual Letter of Undertaking on{' '}
              <span className="font-mono text-fg">gst.gov.in</span> to export hardware batches and engineering design services at <strong className="text-fg">0% IGST</strong>—preserving cashflow instead of blocking 18% GST in upfront tax payouts while claiming Input Tax Credit (ITC) refunds on domestic BOMs.
            </p>
            <div className="p-3 rounded-xl bg-sunken border border-hairline text-[11px] font-mono text-fg-muted">
              Combine with ECGC Whole Turnover policies to offer 45–60 day credit terms to US/EU OEMs safely.
            </div>
          </Card>

          <Card className="p-5 bg-surface-1 border-hairline space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Badge tone="make" variant="outline">GRANTS &amp; EXPORT INCENTIVES</Badge>
              <BadgeIndianRupee className="size-4 text-make-fg" aria-hidden="true" />
            </div>
            <h3 className="font-display text-body-lg font-bold text-fg">
              NIDHI-PRAYAS · SISFS · PLI · RoDTEP
            </h3>
            <p className="text-body-xs text-fg-muted leading-relaxed">
              Stack non-dilutive hardware capital before raising equity: <strong className="text-fg">DST NIDHI-PRAYAS</strong> (up to ₹10L PoC grant via IIT/NIT TBIs), <strong className="text-fg">Startup India Seed Fund (SISFS)</strong> (₹20L grant / ₹50L convertible), <strong className="text-fg">PLI</strong> electronics/ACC/textiles schemes, and <strong className="text-fg">RoDTEP</strong> 0.5%–4.3% duty-remission scrips on exported SKUs.
            </p>
            <div className="p-3 rounded-xl bg-sunken border border-hairline text-[11px] font-mono text-fg-muted">
              RoDTEP credits offset NABL, ARAI, CE/FCC, and UN 38.3 testing budgets as export volume scales.
            </div>
          </Card>
        </div>

        {/* Direct Execution Links */}
        <div className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-body-sm font-display font-bold text-fg">
              Launch Your India Hardware &amp; Export Workflow
            </div>
            <p className="text-body-xs text-fg-muted">
              Jump straight to factory blueprints, compliance checklists, instant manufacturing quotes, and export tools.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="primary" size="sm">
              <Link href="/how-to-start">
                <Factory className="size-3.5" aria-hidden="true" />
                <span>How to Start a Plant</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/export">
                <Globe className="size-3.5" aria-hidden="true" />
                <span>Global Export Hub</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/manufacturing/rfq">
                <span>Instant RFQ</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/compliance">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                <span>Compliance</span>
              </Link>
            </Button>
            <Button asChild variant="soft" size="sm">
              <Link href="/launchpad">
                <Rocket className="size-3.5" aria-hidden="true" />
                <span>Launchpad</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
