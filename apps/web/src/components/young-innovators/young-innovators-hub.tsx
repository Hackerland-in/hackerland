'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Button } from '@hackerland/ui';
import {
  VISUAL_BLOCK_PRESETS,
  JUNIOR_CHALLENGES,
  JUNIOR_SHOWCASE_PROJECTS,
  type VisualBlockPreset,
} from '@/lib/data/young-innovators-data';
import { GuardianConsentModal } from './guardian-consent-modal';

export function YoungInnovatorsHub() {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedPreset, setSelectedPreset] = useState<VisualBlockPreset>(VISUAL_BLOCK_PRESETS[0]!);
  const [activeCodeTab, setActiveCodeTab] = useState<'log' | 'python' | 'cpp'>('log');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string>(selectedPreset.simulatedOutput);

  // Modal
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [verifiedConsentTokens, setVerifiedConsentTokens] = useState<string[]>([]);

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
    }, 600);
  };

  const handleSelectPreset = (preset: VisualBlockPreset) => {
    setSelectedPreset(preset);
    setSimulationLog(preset.simulatedOutput);
  };

  return (
    <div className="space-y-8 min-w-0">
      {/* Banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/30 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GraduationCap className="size-3.5" />
              <span>SUPERVISED JUNIOR INNOVATOR TRACK · AGES 8 TO 17</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              From Curiosity to Real Physical Hardware
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              A 10-year-old with a dream, a 13-year-old building robotics, or a 16-year-old soldering satellite telemetry. Learn safely with visual logic blocks, MicroPython, verified educator mentors, and full DPDP Act child data safety.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowConsentModal(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono"
            >
              <ShieldCheck className="size-3.5 mr-1.5" />
              Guardian DPDP Co-Sign
            </Button>
          </div>
        </div>
      </div>

      {/* 3 Age Progression Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: 8-11 */}
        <div
          onClick={() => setSelectedAge(selectedAge === 'junior_8_11' ? 'all' : 'junior_8_11')}
          className={`cursor-pointer rounded-2xl border p-5 space-y-3 transition-all ${
            selectedAge === 'junior_8_11'
              ? 'border-cyan-500/60 bg-cyan-950/30 shadow-lg'
              : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AGES 8 – 11
            </span>
            <span className="text-xs text-neutral-500 font-mono">STARTER TIER</span>
          </div>
          <h3 className="text-base font-bold text-white">Junior Tinkerers</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Paper circuits, BBC Micro:bit v2, conductive tape, low-voltage 5V motors, and colorful block-based logic.
          </p>
          <div className="text-[11px] font-mono text-cyan-300 pt-1 flex items-center gap-1">
            <span>Filter challenges</span>
            <ChevronRight className="size-3" />
          </div>
        </div>

        {/* Tier 2: 12-14 */}
        <div
          onClick={() => setSelectedAge(selectedAge === 'intermediate_12_14' ? 'all' : 'intermediate_12_14')}
          className={`cursor-pointer rounded-2xl border p-5 space-y-3 transition-all ${
            selectedAge === 'intermediate_12_14'
              ? 'border-emerald-500/60 bg-emerald-950/30 shadow-lg'
              : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AGES 12 – 14
            </span>
            <span className="text-xs text-neutral-500 font-mono">BUILDER TIER</span>
          </div>
          <h3 className="text-base font-bold text-white">Intermediate Makers</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Raspberry Pi Pico (RP2040), MicroPython, 3D printing in PLA/PETG, ultrasonic sensors, and solar chargers.
          </p>
          <div className="text-[11px] font-mono text-emerald-300 pt-1 flex items-center gap-1">
            <span>Filter challenges</span>
            <ChevronRight className="size-3" />
          </div>
        </div>

        {/* Tier 3: 15-17 */}
        <div
          onClick={() => setSelectedAge(selectedAge === 'senior_15_17' ? 'all' : 'senior_15_17')}
          className={`cursor-pointer rounded-2xl border p-5 space-y-3 transition-all ${
            selectedAge === 'senior_15_17'
              ? 'border-indigo-500/60 bg-indigo-950/30 shadow-lg'
              : 'border-white/10 bg-neutral-900/60 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              AGES 15 – 17
            </span>
            <span className="text-xs text-neutral-500 font-mono">INNOVATOR TIER</span>
          </div>
          <h3 className="text-base font-bold text-white">Junior Fellows</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Custom 2-layer KiCad PCB routing, LoRa telemetry, CanSat probes, tendon-actuated bionics, and science fairs.
          </p>
          <div className="text-[11px] font-mono text-indigo-300 pt-1 flex items-center gap-1">
            <span>Filter challenges</span>
            <ChevronRight className="size-3" />
          </div>
        </div>
      </div>

      {/* Interactive Block-to-Hardware Micro-Simulator */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Code className="size-3.5" />
              <span>VISUAL BLOCK-TO-FIRMWARE BRIDGE</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Visual Logic to Real MicroPython & C++ Simulator
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Connect visual logic blocks and watch them compile directly into real MCU firmware.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {VISUAL_BLOCK_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedPreset.id === preset.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-neutral-800/60 text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                {preset.title.split('(')[0]?.trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Blocks Sequence Container */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>LOGIC FLOW FOR: {selectedPreset.targetBoard}</span>
            <span>AUTO-SYNTHESIZED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedPreset.blocks.map((block, idx) => (
              <div
                key={block.id}
                className={`p-3.5 rounded-xl border border-white/10 bg-gradient-to-br ${block.color} text-white shadow-md relative overflow-hidden`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider opacity-80 mb-1">
                  STAGE {idx + 1}: {block.type.replace('_', ' ')}
                </div>
                <div className="text-xs font-bold leading-snug">{block.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Code & Telemetry Preview Tabs */}
        <div className="rounded-xl border border-white/10 bg-neutral-950 overflow-hidden text-xs font-mono">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-neutral-900/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveCodeTab('log')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'log' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Terminal className="size-3" /> Virtual Hardware Serial Monitor
              </button>
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'python' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Code className="size-3" /> MicroPython (RP2040)
              </button>
              <button
                onClick={() => setActiveCodeTab('cpp')}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                  activeCodeTab === 'cpp' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Cpu className="size-3" /> Arduino C++
              </button>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="text-[11px] font-mono h-7"
            >
              <Play className="size-3 mr-1 text-cyan-400" />
              {isSimulating ? 'Executing...' : 'Run Simulation'}
            </Button>
          </div>

          <div className="p-4 max-h-60 overflow-y-auto leading-relaxed">
            {activeCodeTab === 'log' && (
              <pre className="text-emerald-400 whitespace-pre-wrap">{simulationLog}</pre>
            )}
            {activeCodeTab === 'python' && (
              <pre className="text-cyan-300 whitespace-pre-wrap">{selectedPreset.generatedPython}</pre>
            )}
            {activeCodeTab === 'cpp' && (
              <pre className="text-amber-300 whitespace-pre-wrap">{selectedPreset.generatedCpp}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Junior Challenges Roster */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
          <span>JUNIOR HARDWARE CHALLENGES ({filteredChallenges.length})</span>
          <span>DPDP VERIFIED MENTORS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {challenge.ageBracket.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                    <Clock className="size-3" /> {challenge.estimatedTimeHours} hrs build time
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{challenge.title}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{challenge.summary}</p>

                {/* Hardware Kit */}
                <div className="p-3 rounded-xl border border-white/5 bg-neutral-950/40 space-y-1.5 text-xs">
                  <span className="text-[11px] font-mono text-neutral-400 block">HARDWARE KIT REQUIRED:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.hardwareKit.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded bg-neutral-900 border border-white/5 text-[11px] font-mono text-neutral-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="space-y-1 text-xs text-neutral-400">
                  <span className="text-[11px] font-mono text-emerald-400 block font-medium">SKILLS UNLOCKED:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {challenge.learningOutcomes.map((outcome, idx) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-medium">
                  {challenge.prizeOrBadge}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => alert(`Enrolled in ${challenge.title}! Review safety instructions.`)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono"
                >
                  Start Challenge
                  <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Young Maker Showcase Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
          <span>YOUNG INNOVATOR SHOWCASE ({filteredProjects.length} PHYSICAL BUILDS)</span>
          <span>GUARDIAN & EDUCATOR CO-SIGNED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6 space-y-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> DPDP CO-SIGNED
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      AGE {project.builderAge} · {project.city}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{project.title}</h3>
                  <p className="text-xs text-neutral-400">
                    By <strong className="text-neutral-200">{project.builderName}</strong> · {project.schoolOrAtl}
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {project.summary}
              </p>

              {/* Materials */}
              <div className="flex flex-wrap gap-1.5">
                {project.materialsUsed.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded bg-neutral-950 border border-white/5 text-[11px] font-mono text-neutral-400"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 text-[11px]">Mentor: {project.mentorName}</span>
                <span className="text-cyan-400 font-medium">{project.unlockedBadge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & DPDP Modal */}
      {showConsentModal && (
        <GuardianConsentModal
          onClose={() => setShowConsentModal(false)}
          onConsentGranted={(consent) => {
            setVerifiedConsentTokens((prev) => [consent.id, ...prev]);
          }}
        />
      )}
    </div>
  );
}
