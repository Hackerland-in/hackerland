'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Button } from '@hackerland/ui';
import {
  Cpu,
  Wrench,
  Navigation,
  Car,
  Bike,
  Flame,
  Smartphone,
  Sparkles,
  ExternalLink,
  Search,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Eye,
  Filter,
  Layers,
  Factory,
  Atom,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { MANUFACTURING_PILLARS } from './manufacturing-data';
import { ManufacturingSimulator } from './simulators/manufacturing-simulators';
import {
  InjectionMoldingSimulator,
  SheetMetalBendSimulator,
  BatteryWeldingSimulator,
  BLDCMotorSimulator,
  ThermalHeatsinkSimulator,
  CleanroomSimulator,
} from './simulators/advanced-industrial-simulators';
import { InteractiveLab } from './interactive-lab';
import { ManufacturingLifecyclePipeline } from './lifecycle-pipeline';
import { HardwareBenchStudio } from './bench/hardware-bench-studio';
import { CircuitoBuilder } from './circuito/circuito-builder';
import { ActualHardwareSimulator } from './hardware-simulator/actual-hardware-simulator';
import { FalstadSimulator } from './falstad/falstad-simulator';
import { HdlSimulator } from './hdl/hdl-simulator';
import { IssSimulator } from './iss/iss-simulator';
import { OpenEdaStudio } from './eda/open-eda-studio';
import { PhysicsHub } from './physics/physics-hub';

// Domain Factory Blueprints mapping
const DOMAIN_BLUEPRINTS: Record<
  string,
  {
    slug: string;
    title: string;
    discipline: string;
    capex: string;
    facility: string;
    subsidies: string;
    standards: string;
    description: string;
  }
> = {
  pcb: {
    slug: 'pcb-plant',
    title: 'Multilayer PCB Fabrication & SMT Assembly Plant',
    discipline: 'Printed Circuit Boards',
    capex: '₹2.4 Cr',
    facility: '18,000 sq ft · Class 10k Cleanroom',
    subsidies: 'SPECS (25% capex) + PLI for Electronic Components',
    standards: 'IPC-A-610 Class 3, UL 94V-0',
    description:
      'Turnkey blueprint for chemical wet processing, automated high-speed SMT pick-and-place lines, and multi-layer impedance testing.',
  },
  drone: {
    slug: 'drone-aerospace',
    title: 'Precision Drone & Aerospace Airframe Facility',
    discipline: 'Autonomous Drones',
    capex: '₹3.5 Cr',
    facility: '12,000 sq ft · DGCA Testbay & Airfield',
    subsidies: 'Drone PLI Scheme (₹120 Cr pool) + Defence Indigenization Grants',
    standards: 'DGCA Type Certification, ISO 9001:2015',
    description:
      'Precision carbon-fiber airframe routing, brushless motor winding, autopilot HIL flight testbenches, and GeM defence portal onboarding.',
  },
  car: {
    slug: 'ev-battery-pack',
    title: 'Electric Vehicle (EV) Battery Gigafactory & Pack Assembly',
    discipline: 'Electric Vehicles',
    capex: '₹4.8 Cr',
    facility: '25,000 sq ft · Dry Room (-40°C Dew Point)',
    subsidies: 'National Programme on Advanced Chemistry Cell (ACC) Battery Storage',
    standards: 'AIS-156 Rev 2, UN 38.3, ARAI Certification',
    description:
      'Automated cylindrical/prismatic cell sorting, automated laser busbar welding, active cooling thermal potting, and automated BMS flashing.',
  },
  bike: {
    slug: 'cycle-manufacturing',
    title: 'Complete Bicycle & E-Bike Manufacturing Plant',
    discipline: 'Light EV & Bicycles',
    capex: '₹1.8 Cr',
    facility: '15,000 sq ft · Electrostatic Paint Line',
    subsidies: 'MSME Capital Subsidy + State Industrial Infrastructure Scheme',
    standards: 'BIS IS 10613, EN 15194 (EPAC Pedelecs)',
    description:
      'Hydroformed alloy/steel tube precision welding jigs, electrostatic conveyorized powder coating, and automated robotic wheel truing & lacing.',
  },
  hardware: {
    slug: 'precision-mechanical-parts',
    title: 'Precision Mechanical Parts Manufacturing (Bicycle & Machine Components)',
    discipline: 'Hardware & Enclosures',
    capex: '₹2.9 Cr',
    facility: '10,000 sq ft · Vibration-Isolated Heavy Bed',
    subsidies: 'CLCSS Capital Subsidy + Zero Defect Zero Effect (ZED)',
    standards: 'ISO 9001 / IATF 16949, AS9100D',
    description:
      '5-Axis CNC machining centers, swiss turn lathes, wire-cut EDM, and CMM coordinate measuring metrology inspection.',
  },
  engine: {
    slug: 'carbon-fiber-hub',
    title: 'Carbon Fiber & Advanced Composites Manufacturing Hub',
    discipline: 'Engines & Propulsion',
    capex: '₹6.5 Cr',
    facility: '20,000 sq ft · Class 10,000 Layup Cleanroom',
    subsidies: 'Defence Production Corridor Subsidy + Strategic Aerospace Grants',
    standards: 'AS9100 Aerospace, FAA/EASA Composite Standards',
    description:
      'Autoclave pressure vessel curing up to 200°C / 10 bar, cryogenic prepreg storage, vacuum debulking, and ultrasonic void testing.',
  },
  mobile: {
    slug: 'mobile-parts',
    title: 'Mobile Phone Parts & Module Assembly Plant',
    discipline: 'Mobile Devices',
    capex: '₹5.2 Cr',
    facility: '22,000 sq ft · Class 100k ESD Cleanroom',
    subsidies: 'PLI for Large Scale Electronics Manufacturing (4-6% incentive)',
    standards: 'BIS CRS, CE-RED, RoHS Compliance',
    description:
      'Sub-millimeter 0201 SMT lines, camera module 6-axis active optical alignment, RF anechoic chamber testing, and acoustic vibration isolation.',
  },
  'future-tech': {
    slug: 'fab-manufacturing',
    title: 'Semiconductor Wafer Fab & ATMP/OSAT Packaging Plant',
    discipline: 'Future Tech & Frontiers',
    capex: '₹12.0 Cr (Pilot ATMP)',
    facility: '30,000 sq ft · Class 100/1000 Sub-Micron Cleanroom',
    subsidies: 'India Semiconductor Mission (ISM) 50% Fiscal Support',
    standards: 'SEMI Standards, JEDEC Reliability Qualification',
    description:
      'Silicon backend packaging, thermo-compression wire bonding, flip-chip BGA assembly, and laser wafer dicing with ultra-pure DI water plant.',
  },
};

// Domain recommended studios mapping
const DOMAIN_RECOMMENDED_STUDIOS: Record<string, string[]> = {
  pcb: ['eda', 'spice', 'falstad', 'bench'],
  hardware: ['tools', 'bench', 'eda', 'physics'],
  drone: ['physics', 'bench', 'falstad', 'tools'],
  car: ['physics', 'tools', 'bench', 'circuito'],
  bike: ['physics', 'tools', 'bench', 'circuito'],
  engine: ['physics', 'tools', 'spice', 'bench'],
  mobile: ['hdl', 'eda', 'tools', 'bench'],
  'future-tech': ['iss', 'hdl', 'physics', 'tools'],
};

// Domain default tooling engine mapping
const DOMAIN_DEFAULT_TOOL: Record<
  string,
  'injection' | 'sheet_metal' | 'battery_weld' | 'bldc_winding' | 'thermal' | 'cleanroom'
> = {
  pcb: 'thermal',
  hardware: 'sheet_metal',
  drone: 'bldc_winding',
  car: 'battery_weld',
  bike: 'sheet_metal',
  engine: 'thermal',
  mobile: 'cleanroom',
  'future-tech': 'cleanroom',
};

// Domain physical lab equipment mapping
const DOMAIN_LAB_EQUIPMENT: Record<
  string,
  { equipment: string[]; nodes: string; sampleLab: string }
> = {
  pcb: {
    equipment: [
      'Manual Stencil Printer',
      'Reflow Oven T-962',
      'Rigol 100MHz 4-CH Scope',
      'Desoldering Rework Station',
    ],
    nodes: '34 Makerspaces & FabLabs in India',
    sampleLab: 'Makerspace Bangalore & Maker Village Kochi',
  },
  hardware: {
    equipment: [
      '3-Axis & 5-Axis CNC Mill',
      'Industrial FDM 3D Printers',
      'Formlabs SLA Resin',
      'Mitutoyo CMM Gauge',
    ],
    nodes: '42 ATL & Maker Nodes in India',
    sampleLab: 'IIT Madras Research Park & Maker Bhavan Pune',
  },
  drone: {
    equipment: [
      'Aero Wind-Tunnel Testbench',
      'Carbon Fiber CNC Router',
      'Thrust Stand Dynamometer',
      'RF Spectrum Analyzer',
    ],
    nodes: '28 Drone Hubs in India',
    sampleLab: 'Drone Federation Testing Node & IIT Kanpur Lab',
  },
  car: {
    equipment: [
      'Automated Battery Cycler & Load Cell',
      'CAN Bus Analyzer / Kvaser',
      'Spot Welder & Laser Jig',
      'Thermal Fluke Camera',
    ],
    nodes: '19 EV Testing Hubs in India',
    sampleLab: 'ARAI Mobility Lab Pune & IIT Delhi EV CoE',
  },
  bike: {
    equipment: [
      'Wheel Truing Stand & Tension Meter',
      'TIG / MIG Tube Welding Jig',
      'Frame Alignment Gauge',
      'Roller Dyno Bench',
    ],
    nodes: '25 Micromobility Nodes in India',
    sampleLab: 'NID Ahmedabad Workshop & Ludhiana Prototyping Center',
  },
  engine: {
    equipment: [
      'High-Pressure Flow Testbench',
      'Load Cell Thrust Test Stand',
      'Autoclave Curing Chamber',
      'High-Temp Pyrometer',
    ],
    nodes: '14 Aerospace Nodes in India',
    sampleLab: 'VSSC Technology Transfer Cell & Skyroot Prototyping Hub',
  },
  mobile: {
    equipment: [
      'Stereo Inspection Microscope 40x',
      'ESD Safe Clean Bench ISO 6',
      'Rohde & Schwarz CMW500 Radio Tester',
      'BGA Hot-Air Station',
    ],
    nodes: '21 Hardware Nodes in India',
    sampleLab: 'MeitY Electropreneur Park & C-DAC Hardware Lab',
  },
  'future-tech': {
    equipment: [
      'Sub-Micron Wire Bonder',
      'Class 100 Cleanroom Hood',
      'Thermal Vacuum Chamber (TVAC)',
      'Semiconductor Parameter Analyzer',
    ],
    nodes: '16 DeepTech Centers in India',
    sampleLab: 'CeNSE IISc Bangalore & IIT Bombay Nano-Fab Lab',
  },
};

export function ManufacturingHub() {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('pcb');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllStudios, setShowAllStudios] = useState<boolean>(false);
  const [activeStudioPreview, setActiveStudioPreview] = useState<
    'physics' | 'bench' | 'circuito' | 'spice' | 'falstad' | 'hdl' | 'iss' | 'eda' | 'tools' | 'none'
  >('physics');
  const [activeIndustrialSim, setActiveIndustrialSim] = useState<
    'injection' | 'sheet_metal' | 'battery_weld' | 'bldc_winding' | 'thermal' | 'cleanroom'
  >('thermal');

  const STUDIO_LINKS = [
    {
      id: 'physics',
      title: 'Multibody Vehicle Physics',
      category: 'Vehicle Mechanics',
      badge: '60 FPS RK4',
      desc: 'Bicycle, race car, superbike, quadcopter drone, EV battery, and aerospace rocket simulators with custom components.',
      href: '/manufacturing/physics',
    },
    {
      id: 'bench',
      title: 'ESP-Labs Hardware Bench',
      category: 'Embedded & IoT',
      badge: 'ESP32 / OLED',
      desc: 'Virtual ESP32-S3 microcontroller, SSD1306 OLED, WS2812B NeoPixel, and UART Serial Monitor.',
      href: '/manufacturing/bench',
    },
    {
      id: 'circuito',
      title: 'Circuito.io Circuit Builder',
      category: 'Prototyping',
      badge: 'Breadboard & BOM',
      desc: 'Autonomous breadboard wiring engine, logic level shifters, and distributor pricing in ₹.',
      href: '/manufacturing/circuito',
    },
    {
      id: 'spice',
      title: 'SPICE Hardware Simulator',
      category: 'Analog Physics',
      badge: 'DMM & Oscilloscope',
      desc: 'True SPICE nodal solver, component burnout physics, and digital storage oscilloscope.',
      href: '/manufacturing/spice',
    },
    {
      id: 'falstad',
      title: 'Falstad & ngspice Circuit',
      category: 'Circuits',
      badge: 'Moving Electrons',
      desc: 'Interactive schematic canvas with animated electron dots and Berkeley SPICE netlist deck.',
      href: '/manufacturing/falstad',
    },
    {
      id: 'hdl',
      title: 'Digital Logic HDL Studio',
      category: 'HDL',
      badge: 'Verilog & VCD',
      desc: 'Cycle-accurate Verilog synthesis, GTKWave style timing diagrams, and IEEE 1364 VCD.',
      href: '/manufacturing/hdl',
    },
    {
      id: 'iss',
      title: 'RISC-V Instruction Set (ISS)',
      category: 'Architecture',
      badge: 'RV32I / Pipeline',
      desc: 'Microarchitecture simulation with 32 registers, 5-stage pipeline, and RAM hex dump.',
      href: '/manufacturing/iss',
    },
    {
      id: 'eda',
      title: 'Open-Source EDA Silicon',
      category: 'ASIC & VLSI',
      badge: 'OpenROAD / GDSII',
      desc: 'Automated RTL-to-GDSII flow with Yosys, OpenROAD, Magic DRC, and KLayout die viewer.',
      href: '/manufacturing/eda',
    },
    {
      id: 'tools',
      title: 'Factory Tooling Suite',
      category: 'Production',
      badge: '6 Calculators',
      desc: 'Injection molding clamp, sheet metal bend K-factor, spot weld, and cleanroom HVAC.',
      href: '/manufacturing/tools',
    },
  ];

  const pillars = MANUFACTURING_PILLARS;
  const isAllSelected = selectedPillarId === 'all';
  const selectedPillar =
    pillars.find((p) => p.id === selectedPillarId) ?? pillars[0]!;

  const filteredPillars = searchQuery.trim()
    ? pillars.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.hotTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.popularSearches.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : pillars;

  const handlePillarSelect = (id: string) => {
    setSelectedPillarId(id);
    if (id !== 'all' && DOMAIN_DEFAULT_TOOL[id]) {
      setActiveIndustrialSim(DOMAIN_DEFAULT_TOOL[id]!);
    }
  };

  const currentBlueprint = DOMAIN_BLUEPRINTS[selectedPillar.id] ?? DOMAIN_BLUEPRINTS.pcb!;
  const currentLabMeta = DOMAIN_LAB_EQUIPMENT[selectedPillar.id] ?? DOMAIN_LAB_EQUIPMENT.pcb!;

  // Studios filtered to active domain or all
  const domainStudioIds = DOMAIN_RECOMMENDED_STUDIOS[selectedPillar.id] ?? ['physics', 'bench'];
  const displayedStudios =
    showAllStudios || isAllSelected
      ? STUDIO_LINKS
      : STUDIO_LINKS.filter((s) => domainStudioIds.includes(s.id));

  const renderIcon = (name: string, className = 'size-5') => {
    switch (name) {
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Navigation':
        return <Navigation className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Bike':
        return <Bike className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      default:
        return <Cpu className={className} />;
    }
  };

  return (
    <div className="space-y-10 min-w-0" data-testid="manufacturing-hub">
      {/* 1. DOMAIN FILTER SECTION */}
      <div className="space-y-4 rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-accent" />
              <h2 className="font-display text-body-md font-bold uppercase tracking-wider text-fg">
                Select Manufacturing Domain
              </h2>
              <Badge tone="accent" variant="solid" className="text-caption font-mono">
                8 Pillars Active
              </Badge>
            </div>
            <p className="text-caption text-fg-muted">
              Select an engineering discipline below to filter all interactive simulators, factory blueprints, hands-on labs, tooling engines, and domestic Indian suppliers.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="size-4 text-fg-subtle absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search CAD, BMS, 5G, DFM, GaN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-hairline bg-surface-2 pl-9 pr-3 py-1.5 text-body-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Filter Controls: All Domains Toggle + 8 Domain Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePillarSelect('all')}
                className={`px-3 py-1.5 rounded-lg border text-caption font-display font-semibold transition-all flex items-center gap-1.5 ${
                  isAllSelected
                    ? 'border-accent bg-accent/20 text-accent ring-1 ring-accent shadow-xs'
                    : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
                }`}
                data-testid="pillar-btn-all"
              >
                <Layers className="size-3.5" />
                <span>All Domains (8)</span>
              </button>
              <span className="text-hairline hidden sm:inline">|</span>
              <span className="text-[11px] font-mono text-fg-subtle hidden sm:inline">
                Click any domain to focus the entire page:
              </span>
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-caption font-mono text-accent hover:underline"
              >
                Clear Search ✕
              </button>
            )}
          </div>

          {/* 8 Pillar Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {filteredPillars.map((p) => {
              const isSelected = p.id === selectedPillarId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePillarSelect(p.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all min-h-[96px] ${
                    isSelected
                      ? 'border-accent bg-accent/15 text-accent shadow-sm ring-1 ring-accent'
                      : 'border-hairline bg-surface-2/60 text-fg-muted hover:text-fg hover:bg-surface-2 hover:border-hairline-strong'
                  }`}
                  data-testid={`pillar-btn-${p.id}`}
                >
                  <div
                    className={`p-2 rounded-full mb-1.5 ${
                      isSelected ? 'bg-accent/20 text-accent' : 'bg-surface-1 text-fg-subtle'
                    }`}
                  >
                    {renderIcon(p.iconName, 'size-4')}
                  </div>
                  <span className="font-display text-caption font-semibold line-clamp-1">
                    {p.title.split('(')[0]?.trim()}
                  </span>
                  <span className="text-[10px] text-fg-subtle mt-0.5">
                    {p.estTimeToPrototype}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Domain Filter Notice Bar */}
        {!isAllSelected && selectedPillar && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 text-caption font-mono animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex size-2 rounded-full bg-accent animate-ping" />
              <span className="text-fg font-bold">Active Filter:</span>
              <span className="text-accent font-semibold">{selectedPillar.title}</span>
              <span className="text-fg-subtle">•</span>
              <span className="text-fg-muted">Simulators, blueprints, labs & tools are filtered</span>
            </div>
            <button
              type="button"
              onClick={() => handlePillarSelect('all')}
              className="text-accent hover:underline font-semibold"
            >
              Reset to All Domains ✕
            </button>
          </div>
        )}
      </div>

      {/* 2. ALL DOMAINS OVERVIEW MATRIX (When 'All Domains' is selected) */}
      {isAllSelected && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
                Comparative Matrix
              </span>
              <h3 className="font-display text-headline-sm font-semibold text-fg">
                All 8 Cyber-Physical Manufacturing Disciplines
              </h3>
            </div>
            <Badge tone="accent" variant="solid" className="font-mono text-caption">
              Overview Mode
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((pillar) => {
              const bp = DOMAIN_BLUEPRINTS[pillar.id];
              return (
                <div
                  key={pillar.id}
                  className="rounded-xl border border-hairline bg-surface-1 p-5 flex flex-col justify-between space-y-4 hover:border-accent/50 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-lg bg-accent/15 text-accent">
                        {renderIcon(pillar.iconName, 'size-5')}
                      </div>
                      <Badge tone="code" variant="solid" className="text-[10px]">
                        {pillar.difficulty}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-display text-body-sm font-bold text-fg group-hover:text-accent transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-caption text-fg-muted line-clamp-2 mt-1">
                        {pillar.tagline}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-hairline/60 text-caption font-mono">
                      <div className="flex items-center justify-between text-fg-subtle">
                        <span>Turnaround:</span>
                        <span className="text-fg font-semibold">{pillar.estTimeToPrototype}</span>
                      </div>
                      {bp && (
                        <div className="flex items-center justify-between text-fg-subtle">
                          <span>Factory CapEx:</span>
                          <span className="text-accent font-semibold">{bp.capex}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePillarSelect(pillar.id)}
                    className="w-full py-2 rounded-lg bg-surface-2 hover:bg-accent/15 hover:text-accent text-fg font-display text-caption font-bold border border-hairline transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Filter to This Domain</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SELECTED PILLAR DETAILED FILTERED VIEW */}
      {selectedPillar && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="rounded-xl border border-hairline bg-surface-1 p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent/20 text-accent border border-accent/30 shadow-xs">
                  {renderIcon(selectedPillar.iconName, 'size-6')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider">
                      Active Domain Discipline
                    </span>
                  </div>
                  <h2 className="font-display text-headline-md font-bold text-fg">
                    {selectedPillar.title}
                  </h2>
                  <p className="text-body-sm text-fg-muted mt-0.5">{selectedPillar.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="code" variant="solid">
                  {selectedPillar.difficulty}
                </Badge>
                <Badge tone="make" variant="outline">
                  Prototype: {selectedPillar.estTimeToPrototype}
                </Badge>
              </div>
            </div>

            <p className="text-body-md text-fg max-w-3xl leading-relaxed">
              {selectedPillar.tagline}
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline/60">
              <span className="text-caption font-semibold text-fg-subtle uppercase tracking-wider mr-2 self-center">
                Governing Standards:
              </span>
              {selectedPillar.certifications.map((cert) => (
                <Badge key={cert} tone="neutral" variant="outline" className="text-caption font-mono">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* DYNAMIC DOMAIN-SPECIFIC FACTORY BLUEPRINT BANNER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-6 rounded-xl border border-hairline bg-gradient-to-r from-surface-1 via-surface-1 to-surface-2 shadow-sm">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <Factory className="size-4 text-accent" />
                <span className="text-[11px] font-mono text-accent uppercase font-bold tracking-wider">
                  Industrial Factory Blueprint for {selectedPillar.title.split('(')[0]?.trim()}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/15 text-accent font-bold">
                  Make In India
                </span>
              </div>
              <h3 className="text-headline-sm font-display font-bold text-fg">
                {currentBlueprint.title}
              </h3>
              <p className="text-body-sm text-fg-muted leading-relaxed">
                {currentBlueprint.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-caption font-mono text-fg-subtle">
                <div>
                  <span className="text-fg font-bold">CapEx: </span>
                  <span className="text-accent font-semibold">{currentBlueprint.capex}</span>
                </div>
                <div>
                  <span className="text-fg font-bold">Facility: </span>
                  <span>{currentBlueprint.facility}</span>
                </div>
                <div>
                  <span className="text-fg font-bold">Subsidies: </span>
                  <span className="text-emerald-400 font-semibold">{currentBlueprint.subsidies}</span>
                </div>
              </div>
            </div>

            <Button asChild variant="primary" size="md" className="shrink-0 gap-2 font-mono text-caption self-start lg:self-center">
              <Link href={`/how-to-start/${currentBlueprint.slug}`}>
                <span>Open {selectedPillar.title.split('(')[0]?.trim()} Plant Guide</span>
                <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>

          {/* DOMAIN-SPECIFIC INTERACTIVE SIMULATION ENGINE */}
          <div className="space-y-3" id="simulators">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <SlidersHorizontal className="size-3.5" />
                  Domain Physics & Feasibility Simulator
                </span>
                <h3 className="font-display text-headline-sm font-semibold text-fg">
                  Real-time Calculations for {selectedPillar.title.split('(')[0]?.trim()}
                </h3>
              </div>
              <Badge tone="accent" variant="solid" className="font-mono text-caption">
                Live Engine
              </Badge>
            </div>
            <ManufacturingSimulator pillarId={selectedPillar.id} />
          </div>

          {/* DOMAIN INTERACTIVE LAB CHALLENGE */}
          <div className="space-y-3" id="interactive-lab">
            <InteractiveLab pillar={selectedPillar} />
          </div>

          {/* VIRTUAL HARDWARE & SILICON STUDIO DIRECTORY (Filtered to Domain) */}
          <div className="space-y-4 rounded-xl border border-hairline bg-surface-1 p-6" data-testid="studio-directory">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="size-4 text-accent" />
                  <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
                    Hardware & Silicon Engineering Suites
                  </span>
                </div>
                <h3 className="font-display text-headline-sm font-semibold text-fg">
                  {showAllStudios
                    ? 'All Virtual Engineering Studios'
                    : `Recommended Studios for ${selectedPillar.title.split('(')[0]?.trim()}`}
                </h3>
                <p className="text-body-sm text-fg-muted mt-0.5">
                  Launch dedicated full-screen workbenches or test interactive circuit & physics engines directly below.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowAllStudios(!showAllStudios)}
                  className="px-3 py-1 rounded-md text-caption font-mono border border-hairline bg-surface-2 text-fg-muted hover:text-fg transition-colors"
                >
                  {showAllStudios ? 'Show Filtered Only' : 'View All 9 Studios'}
                </button>
                <Badge tone="accent" variant="solid" className="font-mono text-caption">
                  {displayedStudios.length} Active Studios
                </Badge>
              </div>
            </div>

            {/* Studio Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {displayedStudios.map((studio) => {
                const isPreviewing = activeStudioPreview === studio.id;
                return (
                  <div
                    key={studio.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      isPreviewing
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-hairline bg-surface-2/60 hover:border-hairline-strong'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                          {studio.badge}
                        </span>
                        <Badge tone="neutral" className="text-[10px]">
                          {studio.category}
                        </Badge>
                      </div>
                      <h4 className="font-display text-body-sm font-bold text-fg">
                        {studio.title}
                      </h4>
                      <p className="text-caption text-fg-muted line-clamp-2">
                        {studio.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-hairline flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveStudioPreview(studio.id as typeof activeStudioPreview)}
                        className="text-[11px] font-mono text-accent font-semibold hover:underline flex items-center gap-1"
                      >
                        <Eye className="size-3" />
                        {isPreviewing ? 'Previewing' : 'Quick Preview'}
                      </button>
                      <Link
                        href={studio.href}
                        className="text-[11px] font-bold text-fg hover:text-accent flex items-center gap-1"
                      >
                        <span>Launch</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Studio Preview Workbench */}
            {activeStudioPreview !== 'none' && (
              <div className="mt-6 border-t border-hairline pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-semibold uppercase tracking-wider text-accent flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                    Live Workbench Preview: {STUDIO_LINKS.find((s) => s.id === activeStudioPreview)?.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={STUDIO_LINKS.find((s) => s.id === activeStudioPreview)?.href || '#'}
                      className="text-caption font-mono text-accent hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Open Fullscreen Page</span>
                      <ArrowRight className="size-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveStudioPreview('none')}
                      className="text-caption text-fg-muted hover:text-fg font-mono"
                    >
                      Hide Preview ✕
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  {activeStudioPreview === 'physics' && <PhysicsHub />}
                  {activeStudioPreview === 'bench' && <HardwareBenchStudio initialTrackId={selectedPillar.id} />}
                  {activeStudioPreview === 'circuito' && <CircuitoBuilder />}
                  {activeStudioPreview === 'spice' && <ActualHardwareSimulator />}
                  {activeStudioPreview === 'falstad' && <FalstadSimulator />}
                  {activeStudioPreview === 'hdl' && <HdlSimulator />}
                  {activeStudioPreview === 'iss' && <IssSimulator />}
                  {activeStudioPreview === 'eda' && <OpenEdaStudio />}
                  {activeStudioPreview === 'tools' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {[
                          { id: 'injection', label: 'Injection Molding Clamp' },
                          { id: 'sheet_metal', label: 'Sheet Metal Bend K-Factor' },
                          { id: 'battery_weld', label: 'Battery Spot Weld' },
                          { id: 'bldc_winding', label: 'BLDC Stator Motor' },
                          { id: 'thermal', label: 'Power Heatsink' },
                          { id: 'cleanroom', label: 'Cleanroom Particle & HVAC' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() =>
                              setActiveIndustrialSim(
                                tab.id as typeof activeIndustrialSim
                              )
                            }
                            className={`px-3 py-1 rounded-lg text-body-xs font-medium whitespace-nowrap transition-all border ${
                              activeIndustrialSim === tab.id
                                ? 'border-accent bg-accent/15 text-accent font-semibold shadow-sm'
                                : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      {activeIndustrialSim === 'injection' && <InjectionMoldingSimulator />}
                      {activeIndustrialSim === 'sheet_metal' && <SheetMetalBendSimulator />}
                      {activeIndustrialSim === 'battery_weld' && <BatteryWeldingSimulator />}
                      {activeIndustrialSim === 'bldc_winding' && <BLDCMotorSimulator />}
                      {activeIndustrialSim === 'thermal' && <ThermalHeatsinkSimulator />}
                      {activeIndustrialSim === 'cleanroom' && <CleanroomSimulator />}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DOMAIN EQUIPPED MAKERSPACES & ATL LABS ACROSS INDIA */}
          <div className="rounded-xl border border-hairline bg-surface-1 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Atom className="size-4 text-accent" />
                  <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
                    Physical Hardware Nodes in India
                  </span>
                </div>
                <h3 className="font-display text-headline-sm font-semibold text-fg">
                  Equipped Makerspaces & Labs for {selectedPillar.title.split('(')[0]?.trim()}
                </h3>
                <p className="text-body-sm text-fg-muted">
                  Reserve bench hours, 3D printers, reflow ovens, and oscilloscopes at partner nodes across India.
                </p>
              </div>

              <Button asChild variant="secondary" size="sm" className="font-mono text-caption shrink-0">
                <Link href="/labs">
                  <span>Explore All {currentLabMeta.nodes}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-hairline bg-surface-2 p-4 space-y-2">
                <span className="text-caption font-bold text-fg uppercase tracking-wider block">
                  Available Testbench Equipment at Partner Nodes:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentLabMeta.equipment.map((eq) => (
                    <div key={eq} className="flex items-center gap-2 text-caption text-fg-muted">
                      <CheckCircle2 className="size-3.5 text-accent shrink-0" />
                      <span>{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-hairline bg-surface-2 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-caption font-bold text-fg uppercase tracking-wider block">
                    Regional Node Integration:
                  </span>
                  <p className="text-caption text-fg-muted mt-1">
                    Featured nodes: <strong className="text-fg">{currentLabMeta.sampleLab}</strong>. Verified through the Atal Innovation Mission (AIM) & State Startup Missions.
                  </p>
                </div>
                <Link
                  href="/labs"
                  className="text-caption font-mono font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  <span>Book a Physical Bench Slot</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* 4-Stage Learning-to-Building Roadmap */}
          <div className="rounded-lg border border-hairline bg-surface-1 p-6 space-y-4">
            <div>
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-fg-subtle">
                Curriculum & Milestones
              </span>
              <h3 className="font-display text-headline-sm font-semibold text-fg">
                Learning to Building: 4-Stage Execution Roadmap for {selectedPillar.title.split('(')[0]?.trim()}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {selectedPillar.learningRoadmap.map((stage, idx) => (
                <div key={idx} className="rounded-lg border border-hairline bg-surface-2 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="font-mono text-caption text-accent font-semibold block">
                      Milestone 0{idx + 1}
                    </span>
                    <h4 className="font-display text-body-sm font-semibold text-fg">{stage.stage}</h4>
                    <p className="text-body-xs text-fg-muted">{stage.description}</p>
                  </div>
                  <div className="border-t border-hairline/60 pt-2 text-[11px] text-fg-subtle">
                    <span className="font-semibold text-fg">Deliverable: </span>
                    <span>{stage.keyDeliverable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Future Tech Knowledge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hot Topics & Future Frontiers */}
            <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-accent" />
                <h4 className="font-display text-body-md font-semibold text-fg">
                  Hot Topics & Frontiers in {selectedPillar.title.split('(')[0]?.trim()}
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPillar.hotTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm text-fg-muted">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Searches & Engineering Queries */}
            <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-fg-subtle" />
                <h4 className="font-display text-body-md font-semibold text-fg">
                  Frequently Searched Questions
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPillar.popularSearches.map((query, i) => (
                  <li key={i} className="flex items-center justify-between rounded border border-hairline bg-surface-2 px-3 py-2 text-body-xs text-fg">
                    <span className="truncate mr-2 font-mono">{query}</span>
                    <ChevronRight className="size-3.5 text-fg-subtle shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Indian Domestic Suppliers & Fabrication Hubs */}
          <div className="rounded-lg border border-hairline bg-surface-1 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display text-body-md font-semibold text-fg">
                Verified Domestic Indian Sourcing & Fabrication Partners for {selectedPillar.title.split('(')[0]?.trim()}
              </h4>
              <Badge tone="neutral" variant="outline">
                Domestic Ecosystem
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedPillar.indianSuppliers.map((sup) => (
                <a
                  key={sup.name}
                  href={sup.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-hairline bg-surface-2 p-3 hover:border-accent transition-colors group flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1 text-body-sm font-semibold text-fg group-hover:text-accent">
                      <span>{sup.name}</span>
                      <ExternalLink className="size-3 text-fg-subtle group-hover:text-accent" />
                    </div>
                    <p className="text-caption text-fg-muted">{sup.specialty}</p>
                  </div>
                  <span className="text-[10px] text-accent font-medium mt-2 block">
                    View Catalog →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SPECIALIZED INDUSTRIAL TOOLING CALCULATORS (With Domain Recommendation Badge) */}
      <div className="space-y-4 rounded-xl border border-hairline bg-surface-1 p-6" data-testid="advanced-industrial-sim-suite">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="size-4 text-accent" />
              <span className="font-display text-caption font-semibold uppercase tracking-wider text-accent">
                Advanced Factory & Workshop Tooling Engines
              </span>
            </div>
            <h3 className="font-display text-headline-sm font-semibold text-fg">
              Specialized Industrial Tooling Calculators
            </h3>
            <p className="text-body-sm text-fg-muted mt-0.5">
              Precision calculators for injection molds, sheet metal bending, battery spot welding, motor windings, and cleanroom HVAC.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isAllSelected && selectedPillar && (
              <Badge tone="code" variant="outline" className="font-mono text-caption">
                Target: {selectedPillar.title.split('(')[0]?.trim()}
              </Badge>
            )}
            <Badge tone="make" variant="solid" className="shrink-0 font-mono text-caption">
              6 Specialized Simulators
            </Badge>
          </div>
        </div>

        {/* Simulator Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'injection', label: 'Injection Molding Clamp & Cycle' },
            { id: 'sheet_metal', label: 'Sheet Metal Bend K-Factor' },
            { id: 'battery_weld', label: 'Battery Spot Weld & Nickel Strip' },
            { id: 'bldc_winding', label: 'BLDC Stator Motor Winding' },
            { id: 'thermal', label: 'Power Heatsink & Dissipation' },
            { id: 'cleanroom', label: 'Cleanroom Particle & HVAC' },
          ].map((tab) => {
            const isTargetTool =
              !isAllSelected &&
              selectedPillar &&
              DOMAIN_DEFAULT_TOOL[selectedPillar.id] === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveIndustrialSim(
                    tab.id as 'injection' | 'sheet_metal' | 'battery_weld' | 'bldc_winding' | 'thermal' | 'cleanroom'
                  )
                }
                className={`px-3.5 py-1.5 rounded-lg text-body-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  activeIndustrialSim === tab.id
                    ? 'border-accent bg-accent/15 text-accent font-semibold shadow-sm'
                    : 'border-hairline bg-surface-2 text-fg-muted hover:text-fg hover:border-hairline-strong'
                }`}
              >
                <span>{tab.label}</span>
                {isTargetTool && (
                  <span className="size-1.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Render Selected Industrial Simulator */}
        <div className="pt-2">
          {activeIndustrialSim === 'injection' && <InjectionMoldingSimulator />}
          {activeIndustrialSim === 'sheet_metal' && <SheetMetalBendSimulator />}
          {activeIndustrialSim === 'battery_weld' && <BatteryWeldingSimulator />}
          {activeIndustrialSim === 'bldc_winding' && <BLDCMotorSimulator />}
          {activeIndustrialSim === 'thermal' && <ThermalHeatsinkSimulator />}
          {activeIndustrialSim === 'cleanroom' && <CleanroomSimulator />}
        </div>
      </div>

      {/* 5. GLOBAL 7-STAGE LIFECYCLE PIPELINE */}
      <ManufacturingLifecyclePipeline />
    </div>
  );
}
