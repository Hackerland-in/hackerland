'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Code,
  Terminal,
  Play,
  Clock,
  ChevronRight,
  GraduationCap,
  Rocket,
  Zap,
  Compass,
  Lightbulb,
  Factory,
  Globe,
} from 'lucide-react';
import { Badge, Button, Card, CardBody, Panel, cn } from '@hackerland/ui';
import {
  VISUAL_BLOCK_PRESETS,
  JUNIOR_CHALLENGES,
  JUNIOR_SHOWCASE_PROJECTS,
  type VisualBlockPreset,
} from '@/lib/data/young-innovators-data';
import { GuardianConsentModal } from './guardian-consent-modal';

export interface YoungInnovatorsHubProps {
  statsSlot?: ReactNode;
}

export function YoungInnovatorsHub({ statsSlot }: YoungInnovatorsHubProps = {}) {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedPreset, setSelectedPreset] = useState<VisualBlockPreset>(VISUAL_BLOCK_PRESETS[0]!);
  const [activeCodeTab, setActiveCodeTab] = useState<'log' | 'python' | 'cpp'>('log');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string>(selectedPreset.simulatedOutput);

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [verifiedConsentTokens, setVerifiedConsentTokens] = useState<string[]>([]);
  const [enrolledChallenges, setEnrolledChallenges] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedTokens = localStorage.getItem('hackerland_dpdp_tokens');
      if (savedTokens) {
        const parsed = JSON.parse(savedTokens);
        if (Array.isArray(parsed)) setVerifiedConsentTokens(parsed);
      }
      const savedEnrolled = localStorage.getItem('hackerland_junior_enrolled');
      if (savedEnrolled) {
        const parsed = JSON.parse(savedEnrolled);
        if (Array.isArray(parsed)) setEnrolledChallenges(parsed);
      }
    } catch {}
  }, []);

  const filteredChallenges = useMemo(() => {
    if (selectedAge === 'all') return JUNIOR_CHALLENGES;
    return JUNIOR_CHALLENGES.filter((c) => c.ageBracket === selectedAge);
  }, [selectedAge]);

  const filteredProjects = useMemo(() => {
    if (selectedAge === 'all') return JUNIOR_SHOWCASE_PROJECTS;
    return JUNIOR_SHOWCASE_PROJECTS.filter((p) => p.ageBracket === selectedAge);
  }, [selectedAge]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationLog('Powering on virtual 3.3V rail...\nChecking sensor pin impedance...\nExecuting visual block loop...');
    setTimeout(() => {
      setSimulationLog(selectedPreset.simulatedOutput);
      setIsSimulating(false);
    }, 500);
  };

  const handleSelectPreset = (preset: VisualBlockPreset) => {
    setSelectedPreset(preset);
    setSimulationLog(preset.simulatedOutput);
  };

  const handleToggleEnroll = (challengeId: string) => {
    const enrolling = !enrolledChallenges.includes(challengeId);
    setEnrolledChallenges((prev) => {
      const next = prev.includes(challengeId)
        ? prev.filter((id) => id !== challengeId)
        : [...prev, challengeId];
      try {
        localStorage.setItem('hackerland_junior_enrolled', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (enrolling && typeof fetch === 'function') {
      void fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'young_innovator_join',
          details: { challengeId },
        }),
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      {/* Unified Hero Banner */}
      <header className="rounded-2xl border border-accent/20 bg-gradient-to-r from-surface-1 via-surface-1 to-accent-soft p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-accent/10 text-accent-fg">
              <GraduationCap className="size-3.5" aria-hidden="true" />
              <span>YOUNG INNOVATORS SANDBOX · AGES 8 TO 26 PATHWAY</span>
            </div>
            <h1 className="font-display text-headline-lg sm:text-headline-xl font-bold tracking-tight text-fg">
              From Curiosity to Real Physical Hardware
            </h1>
            <p className="text-body-sm sm:text-body-md text-fg-muted leading-relaxed">
              A 10-year-old building circuits, a 13-year-old programming robotics, or a 16–26 diploma, ITI, and college builder shipping export-grade hardware. Learn safely with visual logic blocks, MicroPython, DPDP Act guardian co-signs, and ATL mentors.
            </p>
            {verifiedConsentTokens.length > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/30 px-3 py-1 text-body-xs font-mono font-semibold text-success-fg">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                <span>Active DPDP Safety Token: {verifiedConsentTokens[0]}</span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowConsentModal(true)}
            className="shrink-0"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>Guardian DPDP Co-Sign</span>
          </Button>
        </div>
      </header>

      {statsSlot}

      {/* 3 Age Progression Pillars (note: keep .cursor-pointer class on each card for test compatibility) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setSelectedAge(selectedAge === 'junior_8_11' ? 'all' : 'junior_8_11')}
          className={cn(
            'cursor-pointer rounded-2xl border p-5 space-y-2.5 transition-all bg-surface-1 shadow-xs',
            selectedAge === 'junior_8_11'
              ? 'border-accent bg-accent-soft ring-1 ring-accent/25'
              : 'border-hairline hover:border-accent/40',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <Badge tone="learn" variant="outline">AGES 8 – 11</Badge>
            <span className="text-[11px] text-fg-subtle font-mono">STARTER TIER</span>
          </div>
          <h3 className="font-display text-body-lg font-bold text-fg">Junior Tinkerers</h3>
          <p className="text-body-xs text-fg-muted leading-relaxed">
            Paper circuits, BBC Micro:bit v2, conductive tape, low-voltage 5V motors, and block-based logic.
          </p>
          <div className="text-[11px] font-display font-semibold text-accent-fg pt-1 flex items-center gap-1">
            <span>{selectedAge === 'junior_8_11' ? 'Showing Junior filter' : 'Filter challenges'}</span>
            <ChevronRight className="size-3" aria-hidden="true" />
          </div>
        </div>

        <div
          onClick={() => setSelectedAge(selectedAge === 'intermediate_12_14' ? 'all' : 'intermediate_12_14')}
          className={cn(
            'cursor-pointer rounded-2xl border p-5 space-y-2.5 transition-all bg-surface-1 shadow-xs',
            selectedAge === 'intermediate_12_14'
              ? 'border-accent bg-accent-soft ring-1 ring-accent/25'
              : 'border-hairline hover:border-accent/40',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <Badge tone="earn" variant="outline">AGES 12 – 14</Badge>
            <span className="text-[11px] text-fg-subtle font-mono">BUILDER TIER</span>
          </div>
          <h3 className="font-display text-body-lg font-bold text-fg">Intermediate Makers</h3>
          <p className="text-body-xs text-fg-muted leading-relaxed">
            Raspberry Pi Pico (RP2040), MicroPython, 3D printing in PLA/PETG, ultrasonic sensors, and solar chargers.
          </p>
          <div className="text-[11px] font-display font-semibold text-accent-fg pt-1 flex items-center gap-1">
            <span>{selectedAge === 'intermediate_12_14' ? 'Showing Builder filter' : 'Filter challenges'}</span>
            <ChevronRight className="size-3" aria-hidden="true" />
          </div>
        </div>

        <div
          onClick={() => setSelectedAge(selectedAge === 'senior_15_17' ? 'all' : 'senior_15_17')}
          className={cn(
            'cursor-pointer rounded-2xl border p-5 space-y-2.5 transition-all bg-surface-1 shadow-xs',
            selectedAge === 'senior_15_17'
              ? 'border-accent bg-accent-soft ring-1 ring-accent/25'
              : 'border-hairline hover:border-accent/40',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <Badge tone="research" variant="outline">AGES 15 – 17</Badge>
            <span className="text-[11px] text-fg-subtle font-mono">INNOVATOR TIER</span>
          </div>
          <h3 className="font-display text-body-lg font-bold text-fg">Junior Fellows</h3>
          <p className="text-body-xs text-fg-muted leading-relaxed">
            Custom 2-layer KiCad PCB routing, LoRa telemetry, CanSat probes, tendon-actuated bionics, and science fairs.
          </p>
          <div className="text-[11px] font-display font-semibold text-accent-fg pt-1 flex items-center gap-1">
            <span>{selectedAge === 'senior_15_17' ? 'Showing Fellow filter' : 'Filter challenges'}</span>
            <ChevronRight className="size-3" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Youth-to-Export Launch Ramp (16–26 Diploma, ITI & College Builders) */}
      <section
        aria-labelledby="youth-export-launch-ramp"
        className="rounded-2xl border border-accent/25 bg-gradient-to-br from-surface-1 via-surface-1 to-accent-soft/75 p-5 sm:p-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent text-on-solid px-3 py-0.5 text-[11px] font-mono font-semibold">
              <Rocket className="size-3" aria-hidden="true" />
              <span>AGES 16–26 · DIPLOMA · ITI · POLYTECHNIC · COLLEGE</span>
            </div>
            <h2
              id="youth-export-launch-ramp"
              className="font-display text-headline-sm sm:text-headline-md font-bold text-fg"
            >
              Youth-to-Export Launch Ramp (16–26 Diploma, ITI &amp; College Builders)
            </h2>
            <p className="text-body-xs sm:text-body-sm text-fg-muted max-w-3xl">
              Graduate cleanly from ₹500 benchtop sensor kits in your hostel or ITI workshop to 48-hour build sprints, certified sector pathways, and global export batches.
            </p>
          </div>
          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href="/export">
              <Globe className="size-3.5" aria-hidden="true" />
              <span>View Export Pathway</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-accent-fg">STEP 01</span>
                <Cpu className="size-3.5 text-accent-fg" aria-hidden="true" />
              </div>
              <h3 className="font-display text-body-sm font-bold text-fg">
                ₹500–₹5,000 Starter Bench Kits &amp; Simulator
              </h3>
              <p className="text-body-xs text-fg-muted leading-relaxed">
                Practice GPIO, PWM, ADC, and telemetry logic on Arduino, ESP32, or RP2040 in the live simulator below before buying parts.
              </p>
            </div>
            <Link
              href="#hardware-simulator"
              className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-accent-fg hover:underline"
            >
              <span>Launch Arduino/ESP32 Simulator</span>
              <ChevronRight className="size-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-accent-fg">STEP 02</span>
                <Zap className="size-3.5 text-accent-fg" aria-hidden="true" />
              </div>
              <h3 className="font-display text-body-sm font-bold text-fg">
                Join 48H Sprints &amp; Squads
              </h3>
              <p className="text-body-xs text-fg-muted leading-relaxed">
                Team up with ITI machinists, firmware devs, and CAD designers across India in timed hardware sprints.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-display font-semibold">
              <Link href="/sprints" className="text-accent-fg hover:underline inline-flex items-center gap-0.5">
                <span>48H Sprints</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </Link>
              <span className="text-fg-subtle">·</span>
              <Link href="/squads" className="text-accent-fg hover:underline inline-flex items-center gap-0.5">
                <span>Squads</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-accent-fg">STEP 03</span>
                <Compass className="size-3.5 text-accent-fg" aria-hidden="true" />
              </div>
              <h3 className="font-display text-body-sm font-bold text-fg">
                Take a Sector Track
              </h3>
              <p className="text-body-xs text-fg-muted leading-relaxed">
                Master EV powertrains, agri-IoT, CNC tooling, or medical textiles via structured industrial roadmaps.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-display font-semibold">
              <Link href="/sectors" className="text-accent-fg hover:underline inline-flex items-center gap-0.5">
                <span>Sector Tracks</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </Link>
              <span className="text-fg-subtle">·</span>
              <Link href="/learn" className="text-accent-fg hover:underline inline-flex items-center gap-0.5">
                <span>Learn</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-surface-1 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-accent-fg">STEP 04</span>
                <Lightbulb className="size-3.5 text-accent-fg" aria-hidden="true" />
              </div>
              <h3 className="font-display text-body-sm font-bold text-fg">
                Shape Your Idea
              </h3>
              <p className="text-body-xs text-fg-muted leading-relaxed">
                Validate unit BOM, buyer pain, and BIS/WPC pre-checks inside IdeaLab before cutting molds or ordering reels.
              </p>
            </div>
            <Link
              href="/ideas"
              className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-accent-fg hover:underline"
            >
              <span>Open IdeaLab</span>
              <ChevronRight className="size-3" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent-soft/60 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-accent-fg">STEP 05</span>
                <Factory className="size-3.5 text-accent-fg" aria-hidden="true" />
              </div>
              <h3 className="font-display text-body-sm font-bold text-fg">
                Prototype &amp; Export
              </h3>
              <p className="text-body-xs text-fg-muted leading-relaxed">
                Run DFM/RFQ quotes with verified Indian fabs and ship commercial pilot lots globally under IEC &amp; RoDTEP.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-display font-semibold">
              <Link href="/manufacturing" className="text-accent-fg hover:underline inline-flex items-center gap-0.5">
                <span>Manufacturing</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </Link>
              <span className="text-fg-subtle">·</span>
              <Link href="/export" className="text-accent-fg hover:underline inline-flex items-center gap-0.5">
                <span>Export Hub</span>
                <ChevronRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Block-to-Hardware Micro-Simulator */}
      <div id="hardware-simulator">
      <Panel
        title="Visual Logic to Real MicroPython & C++ Simulator"
        icon={<Code aria-hidden="true" />}
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            {VISUAL_BLOCK_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={cn(
                  'px-3 py-1 rounded-full text-body-xs font-display font-semibold transition-all border',
                  selectedPreset.id === preset.id
                    ? 'border-accent bg-accent text-on-solid shadow-xs'
                    : 'border-hairline bg-sunken text-fg-muted hover:text-fg',
                )}
              >
                {preset.title.split('(')[0]?.trim()}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-body-xs font-mono text-fg-subtle">
            <span>LOGIC FLOW FOR: {selectedPreset.targetBoard}</span>
            <span>AUTO-SYNTHESIZED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedPreset.blocks.map((block, idx) => (
              <div
                key={block.id}
                className="p-3.5 rounded-xl border border-accent/25 bg-accent-soft/60 text-fg space-y-1"
              >
                <div className="text-[10px] font-mono uppercase font-bold text-accent-fg">
                  STAGE {idx + 1}: {block.type.replace('_', ' ')}
                </div>
                <div className="font-display text-body-xs font-bold leading-snug">{block.label}</div>
              </div>
            ))}
          </div>

          {/* Code & Telemetry Preview Tabs */}
          <div className="rounded-xl border border-hairline bg-sunken overflow-hidden text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-3.5 py-2.5 bg-surface-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('log')}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs transition-colors inline-flex items-center gap-1.5',
                    activeCodeTab === 'log'
                      ? 'bg-accent text-on-solid font-bold'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-2',
                  )}
                >
                  <Terminal className="size-3" aria-hidden="true" /> Virtual Hardware Serial Monitor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('python')}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs transition-colors inline-flex items-center gap-1.5',
                    activeCodeTab === 'python'
                      ? 'bg-accent text-on-solid font-bold'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-2',
                  )}
                >
                  <Code className="size-3" aria-hidden="true" /> MicroPython (RP2040)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('cpp')}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs transition-colors inline-flex items-center gap-1.5',
                    activeCodeTab === 'cpp'
                      ? 'bg-accent text-on-solid font-bold'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-2',
                  )}
                >
                  <Cpu className="size-3" aria-hidden="true" /> Arduino C++
                </button>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="h-8 text-[11px] font-mono"
              >
                <Play className="size-3 text-accent" aria-hidden="true" />
                <span>{isSimulating ? 'Executing...' : 'Run Simulation'}</span>
              </Button>
            </div>

            <div className="p-4 max-h-60 overflow-y-auto leading-relaxed">
              {activeCodeTab === 'log' && (
                <pre className="text-earn-fg whitespace-pre-wrap">{simulationLog}</pre>
              )}
              {activeCodeTab === 'python' && (
                <pre className="text-code-fg whitespace-pre-wrap">{selectedPreset.generatedPython}</pre>
              )}
              {activeCodeTab === 'cpp' && (
                <pre className="text-make-fg whitespace-pre-wrap">{selectedPreset.generatedCpp}</pre>
              )}
            </div>
          </div>
        </div>
      </Panel>
      </div>

      {/* Junior Challenges Roster */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs text-fg-subtle px-1 font-mono">
          <span>JUNIOR HARDWARE CHALLENGES ({filteredChallenges.length})</span>
          <span>DPDP VERIFIED MENTORS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => {
            const enrolled = enrolledChallenges.includes(challenge.id);
            return (
              <Card
                key={challenge.id}
                className="flex flex-col justify-between transition-all hover:border-accent/40 min-w-0 [overflow-wrap:anywhere]"
              >
                <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone="accent" variant="outline">
                        {challenge.ageBracket.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-body-xs font-mono text-fg-subtle inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden="true" /> {challenge.estimatedTimeHours} hrs
                      </span>
                    </div>

                    <h3 className="font-display text-body-lg font-bold text-fg">{challenge.title}</h3>
                    <p className="text-body-sm text-fg-muted leading-relaxed">{challenge.summary}</p>

                    <div className="p-3 rounded-xl border border-hairline bg-sunken space-y-1.5 text-body-xs">
                      <span className="text-[10px] font-mono text-fg-subtle block">HARDWARE KIT REQUIRED</span>
                      <div className="flex flex-wrap gap-1.5">
                        {challenge.hardwareKit.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-0.5 rounded-full bg-surface-1 border border-hairline text-[11px] font-mono text-fg-muted"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 text-body-xs text-fg-muted">
                      <span className="text-[11px] font-mono text-earn-fg block font-semibold">
                        SKILLS UNLOCKED
                      </span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {challenge.learningOutcomes.map((outcome, idx) => (
                          <li key={idx}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
                    <span className="text-body-xs font-mono text-warning-fg font-semibold">
                      {challenge.prizeOrBadge}
                    </span>
                    <Button
                      size="sm"
                      variant={enrolled ? 'soft' : 'primary'}
                      onClick={() => handleToggleEnroll(challenge.id)}
                    >
                      {enrolled ? '✓ Enrolled' : 'Start Challenge'}
                      {!enrolled && <ChevronRight className="size-3.5" aria-hidden="true" />}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Young Maker Showcase Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-xs text-fg-subtle px-1 font-mono">
          <span>YOUNG INNOVATOR SHOWCASE ({filteredProjects.length} PHYSICAL BUILDS)</span>
          <span>GUARDIAN &amp; EDUCATOR CO-SIGNED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:border-accent/40 transition-all">
              <CardBody className="p-5 space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="success" variant="outline">
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                      <span>DPDP CO-SIGNED</span>
                    </Badge>
                    <span className="text-[11px] font-mono text-fg-subtle">
                      AGE {project.builderAge} · {project.city}
                    </span>
                  </div>
                  <h3 className="font-display text-body-lg font-bold text-fg">{project.title}</h3>
                  <p className="text-body-xs text-fg-muted">
                    By <strong className="text-fg">{project.builderName}</strong> · {project.schoolOrAtl}
                  </p>
                </div>

                <p className="text-body-sm text-fg-muted leading-relaxed">{project.summary}</p>

                <div className="flex flex-wrap gap-1.5">
                  {project.materialsUsed.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-0.5 rounded-full bg-sunken border border-hairline text-[11px] font-mono text-fg-muted"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-hairline flex items-center justify-between text-body-xs font-mono">
                  <span className="text-fg-subtle">Mentor: {project.mentorName}</span>
                  <span className="text-accent-fg font-semibold">{project.unlockedBadge}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety & DPDP Modal */}
      {showConsentModal && (
        <GuardianConsentModal
          onClose={() => setShowConsentModal(false)}
          onConsentGranted={(consent) => {
            setVerifiedConsentTokens((prev) => {
              const next = [consent.id, ...prev];
              try {
                localStorage.setItem('hackerland_dpdp_tokens', JSON.stringify(next));
              } catch {}
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
